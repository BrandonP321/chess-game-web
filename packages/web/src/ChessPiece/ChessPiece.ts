import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { ChessPieceUtils } from "../utils/ChessPieceUtils";

export type TPieceLocation = {
    row: number;
    col: number
}

export type TPiecePossibleMove = {
    right: number;
    forward: number;
}

export type TChessPieceColor = "white" | "black";
export type TChessPieceName = "rook" | "pawn" | "queen" | "knight" | "bishop" | "king" | null;

export type TChessPieceConstructorProps = {
    color: TChessPieceColor;
    squareIndex: number;
}

export type TChessPiece = {
    getPotentialMoves: () => number[];
}

export class ChessPiece implements TChessPiece {
    /* all squares a piece can move to relative to it's current position, 
    regardless of the position of any other pieces or board size limitations */
    protected possibleMoves: TPiecePossibleMove[] = [];
    protected _color;

    protected _icon: IconDefinition | null = null;
    protected _name: TChessPieceName = null;
    protected _squareIndex;

    public get icon() { return this._icon };
    public get squareIndex() { return this._squareIndex };
    public set squareIndex(index: number) {
        if (index >= 0 && index <= 63) {
            this._squareIndex = index;
        }
    }
    public get name() { return this._name };
    public get color() { return this._color };
    public get row() { return this.squareLocation.row };
    public get col() { return this.squareLocation.col };

    protected static startingSquareIndexesWhite: number[] = []
    protected static startingSquareIndexesBlack: number[] = []

    constructor(props: TChessPieceConstructorProps) {
        this._color = props.color;
        this._squareIndex = props.squareIndex;
    }

    /* returns indexes of all squares piece can move too, 
    only excluding squares that are off the board */
    protected removeMovesOutsideBoard = (possibleMoves: TPiecePossibleMove[]) => {
        const { row, col } = this.squareLocation;

        const validSquares = possibleMoves.filter(m => {
            const newRow = m.forward + row;
            const newCol = m.right + col;

            return newRow <= 7 && newRow >= 0 && newCol >= 0 && newCol <= 7;
        });

        return validSquares;
    }

    public getSlopeToSquare = (square: TPieceLocation) => {
        return (square?.row - this.row) / (square?.col - this.col);
    }

    /* removes all squares from array of possible moves that are blocked by another piece */
    public removeBlockedSquares = (blockingPiece: ChessPiece, possibleMoves: TPieceLocation[]) => {
        // convert all square locations to { row: number, col: number } format;
        const blockedSquare = blockingPiece?.squareLocation;

        // new array to store possible moves after filters have been applied
        let possibleSquares = possibleMoves;
        
        /* returns direction of one square relative to another.  1 = up or to right; -1 = down or to left */
        const getSquareDirection = (startSquare: TPieceLocation, endSquare: TPieceLocation) => {
            const squaresAreSameCol = blockedSquare?.col === this.col;

            /* difference between row or col values of both squares, only using rows if squares are in the same col */
            const squaresDistanceDifference = startSquare?.[squaresAreSameCol ? "row" : "col"] - endSquare?.[squaresAreSameCol ? "row" : "col"];

            /* divide the distance differency by the absolute value of itself to get the relative direction of one square from the other */
            return squaresDistanceDifference / Math.abs(squaresDistanceDifference);
        }

        // slope between piece and blocking piece, used to only filter out squares along the same line as the blocking piece
        const pieceToBlockedPieceSlope = this.getSlopeToSquare(blockingPiece?.squareLocation);
        /* 1 if blocked piece is to right diagonal of current piece, -1 if to the left diagonal */
        const blockedPieceDirection = getSquareDirection(blockedSquare, this);

        /* filter out all squares blocked */
        possibleSquares = possibleSquares.filter(square => {
            const isSameSlopeAsBlockedPiece = this.getSlopeToSquare(square) === pieceToBlockedPieceSlope;

            /* square's direction from blocked square (1 -> right, -1 -> left) */
            const squareDirectionFromBlockingPiece = getSquareDirection(square, blockedSquare);

            /* check if square is moving in the same direction from the blocked square as the blocked square is moving from the selected piece */
            const isSquarePastBlockedSquare = squareDirectionFromBlockingPiece === blockedPieceDirection

            return (
                !isSameSlopeAsBlockedPiece || 
                (isSameSlopeAsBlockedPiece && !isSquarePastBlockedSquare)
            )
        })

        // filter out blocking square from array of possible moves if blocking piece is of the same team as current piece
        if (blockingPiece?.color === this.color) {
            possibleSquares = possibleSquares.filter(square => square.col !== blockedSquare.col || square.row !== blockedSquare.row);
        }

        return possibleSquares;
    }

    /* returns array of all potential moves for a piece without regard to other pieces on the board */
    public getPotentialMoves = () => {
        const inBoundSqures = this.removeMovesOutsideBoard(this.possibleMoves);

        return this.getMovesSquareIndexes(inBoundSqures);
    }

    /* returns array indexes of squares a piece can move too */
    public getMovesSquareIndexes = (possibleMoves: TPiecePossibleMove[]) => {
        return possibleMoves.map(move => {
            return this.squareIndex + (move.forward * 8) + move.right;
        })
    }

    /* Returns array of instantiated pieces & their square index */
    public static getInstantiatedPieces = () => {
        return ChessPiece.generateInstantiatedPieces(ChessPiece);
    }

    protected static generateInstantiatedPieces = (Piece: typeof ChessPiece) => {
        const whitePieces: ChessPiece[] = Piece.startingSquareIndexesWhite.map((i) => new Piece({ color: "white", squareIndex: i }) );
        const blackPieces: ChessPiece[] = Piece.startingSquareIndexesBlack.map(i => new Piece({ color: "black", squareIndex: i }) )

        return [...whitePieces, ...blackPieces];
    }

    public get squareLocation() {
        return ChessPieceUtils.squareIndexToBoardLocation(this.squareIndex);
    }
}