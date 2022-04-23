import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { Bishop } from "./Bishop";
import { ChessPiece, TChessPieceColor } from "./ChessPiece";
import { Pawn } from "./Pawn";
import { Rook } from "./Rook";
import { Queen } from "./Queen";
import { King } from "./King";
import { Knight } from "./Knight";

export class Board {
    private _piecesObj: { [key: number]: ChessPiece } = {};
    private _piecesArr: (ChessPiece | null)[] = [];
    private _takenPieces: { [key in TChessPieceColor]: ChessPiece[] } = {
        white: [], black: []
    };
    private _isGameOver = false;
    private _winningColor: TChessPieceColor | null = null;
    /* color of team that is currently moving a piece.  null is game not active */
    private _teamMoving: null | TChessPieceColor = null;

    public get piecesObj() { return this._piecesObj };
    public get pieces() { return this._piecesArr };
    public get takenPieces() { return this._takenPieces };
    public get isGameOver() { return this._isGameOver };
    public get winningColor() { return this._winningColor };
    public get teamMoving() { return this._teamMoving };

    public static squareCount = 64;
    
    constructor() {
        const { pieces } = Board.getBaseBoardLayout();

        pieces.forEach(p => this.addPiece(p))
    }

    public static get allPieceTypes() {
        // return [Rook, Bishop, Queen, Pawn, King, Knight];
        return [Rook, King, Queen];
    }

    public startGame() {
        this.resetGameBoard();
        this._teamMoving = "white";
    }
    
    private addPiece = (piece: ChessPiece) => {
        this._piecesArr.push(piece);
        this._piecesObj[piece.squareIndex] = piece;
    }

    private setGameWinner = (winningTeam: TChessPieceColor) => {
        this._isGameOver = true;
        this._winningColor = winningTeam;
    }

    /* resets game win status and taken pieces */
    public resetGameBoard = () => {
        this._isGameOver = false;
        this._winningColor = null;
        this._takenPieces = { white: [], black: [] };
    }

    /* Returns board squares array with pieces in their starting positions */
    private static getBaseBoardLayout() {
        // create blank board with no pieces
        const board: (null | ChessPiece)[] = Array(64).fill(null);

        // array of all pieces on board in their starting positions
        const allPieces: ChessPiece[] = []

        this.allPieceTypes.forEach(pieceType => {
            pieceType.getInstantiatedPieces().forEach(p => allPieces.push(p))
        });

        // mapp each piece into it's appropriate spot in the blank board array
        allPieces.forEach(piece => {
            board[piece.squareIndex] = piece;
        })

        return { board, pieces: allPieces }
    }

    public getPieceByIndex = (squareIndex: number): ChessPiece | undefined => {
        return this.piecesObj?.[squareIndex];
    }

    public getPieceAvailableMoves = (squareIndex: number) => {
        const piece = this.getPieceByIndex(squareIndex);

        if (!piece) {
            return {};
        }

        // get all squares piece can move to that are on the board, regardless of other pieces
        const inBoundsSquares = piece.getPotentialMoves();
        // convert list of inBoundsSquares from square indexes to board locations
        let availableSquares = inBoundsSquares?.map(s => ChessPieceUtils.squareIndexToBoardLocation(s));

        inBoundsSquares.forEach(s => {
            const pieceAlreadyOnSquare = this.getPieceByIndex(s);

            if (pieceAlreadyOnSquare) {
                availableSquares = piece.removeBlockedSquares(pieceAlreadyOnSquare, availableSquares);
            }
        })

        // if piece is pawn, check if it can attack a piece diagonally and prevent piece from attacking forward enemies
        if (piece instanceof Pawn) {
            availableSquares = piece.filterAttackMoves(availableSquares, this.piecesObj);
        } else if (piece instanceof King) {
            availableSquares.push(...piece.getCastleMoves(this));
        }
        
        // convert to object with square index as key and true as value
        const availableSquaresObj: { [key: number]: true } = {};

        availableSquares.forEach(s => availableSquaresObj[ChessPieceUtils.squareBoardLocationToIndex(s)] = true);

        return availableSquaresObj;
    }

    /* removes a piece from the board and adds it to the appropriate list of taken pieces */
    public takePiece = (piece: ChessPiece) => {
        // add piece to list of taken piecees
        this._takenPieces[piece.color]?.push(piece);
        // remove piece from board
        this.removePiece(piece);

        // if taken piece is a King, set opposite team of taken piece as the winner
        if (piece instanceof King) {
            this.setGameWinner(piece.color === "white" ? "black" : "white");
        }
    }

    public attemptPieceMove = (currentSquareIndex: number, newSquareIndex: number) => {
        const piece = this.getPieceByIndex(currentSquareIndex);
        const isValidNewSquare = newSquareIndex >= 0 && newSquareIndex <= 63;
        /* verify that piece being moved is of the same color as the team that is currently moving a piece */
        const isCorrectPieceColor = piece?.color === this._teamMoving;
        
        const isValidSpot = this.getPieceAvailableMoves(currentSquareIndex)?.[newSquareIndex];
        
        if (!piece || !isValidSpot || !isValidNewSquare || !isCorrectPieceColor) {
            return undefined;
        } else if (piece instanceof King && Math.abs(ChessPieceUtils.squareIndexToBoardLocation(newSquareIndex).col - piece.col) > 1) {
            return this.handleKingCastleMove(piece, newSquareIndex);
        }

        return this.movePiece(piece, newSquareIndex);
    }

    private removePiece = (piece: ChessPiece) => {
        delete this.piecesObj[piece.squareIndex];
        const pieceIndex = this.pieces.findIndex((p) => p?.squareIndex === piece.squareIndex);

        if (pieceIndex >= 0) {
            this.pieces[pieceIndex] = null;
        }
    }
    
    private movePiece = (piece: ChessPiece, newSquareIndex: number) => {
        const pieceAtNewSquare = this.getPieceByIndex(newSquareIndex);

        if (pieceAtNewSquare?.color === piece.color) {
            return undefined;
        } else if (pieceAtNewSquare) {
            // if there is a piece at the new square, remove piece from piecesObj and set it's value to null in pieces array
            this.takePiece(pieceAtNewSquare);
        }

        delete this._piecesObj[piece.squareIndex];
        piece.squareIndex = newSquareIndex;
        this._piecesObj[newSquareIndex] = piece;

        piece.setHasMoved();

        return this.pieces;
    }

    private handleKingCastleMove = (king: King, newSquareIndex: number) => {
        const isCastlingRight = newSquareIndex > king.squareIndex;
        const rooksOfSameColor = (king.color === "white" ? Rook.startingSquareIndexesWhite : Rook.startingSquareIndexesBlack).map(rookIndex => this.getPieceByIndex(rookIndex));
        const rookToMove = rooksOfSameColor.find(rook => isCastlingRight ? (rook?.col ?? 0) > king.col : (rook?.col ?? 0) < king.col);
        
        const newRookSquare = isCastlingRight ? king.col + 1 : king.col - 1;

        if (!rookToMove) {
            return undefined;
        }

        // move both the rook and the king
        this.movePiece(rookToMove, newRookSquare);
        this.movePiece(king, newSquareIndex);

        return this.pieces;
    }
}