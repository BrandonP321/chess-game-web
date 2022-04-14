import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { Bishop } from "./Bishop";
import { ChessPiece } from "./ChessPiece";
import { Pawn } from "./Pawn";
import { Rook } from "./Rook";

export class Board {
    private _squares: (ChessPiece | null)[] = [];
    private _pieces: { [key: number]: ChessPiece } = {};

    public get squares() { return this._squares };
    public get pieces() { return this._pieces };

    constructor() {
        const { board, pieces } = Board.getBaseBoardLayout();

        this._squares = board;

        pieces.forEach(p => this._pieces[p.squareIndex] = p)
    }

    /* Returns board squares array with pieces in their starting positions */
    private static getBaseBoardLayout() {
        // create blank board with no pieces
        const board = Array(64).fill(null);

        // array of all pieces on board in their starting positions
        // const allPieces = [...Rook.getInstantiatedPieces(), ...Pawn.getInstantiatedPieces()];
        const allPieces = [
            ...Rook.getInstantiatedPieces(), 
            ...Bishop.getInstantiatedPieces(), 
            new Pawn({ color: "white", squareIndex: 23 }),
            new Pawn({ color: "white", squareIndex: 19 }),
        ];

        // mapp each piece into it's appropriate spot in the blank board array
        allPieces.forEach(piece => {
            board[piece.squareIndex] = piece;
        })

        return { board, pieces: allPieces }
    }

    public getPieceAvailableMoves = (squareIndex: number) => {
        const piece = this.pieces?.[squareIndex];

        if (!piece) {
            return [];
        }

        // get all squares piece can move to that are on the board, regardless of other pieces
        const inBoundsSquares = piece.getPotentialMoves();
        // convert list of inBoundsSquares from square indexes to board locations
        let availableSquares = inBoundsSquares?.map(s => ChessPieceUtils.squareIndexToBoardLocation(s));

        inBoundsSquares.forEach(s => {
            const pieceAlreadyOnSquare = this.pieces[s];

            availableSquares = piece.removeBlockedSquares(pieceAlreadyOnSquare, availableSquares);
        })
        
        // convert to object with square index as key and true as value
        const availableSquaresObj: { [key: number]: true } = {};

        availableSquares.forEach(s => availableSquaresObj[ChessPieceUtils.squareBoardLocationToIndex(s)] = true);

        return availableSquaresObj;
    }

    public mapPieces = (cb: (piece: ChessPiece, i: number) => any) => {
        return Object.keys(this.pieces).map((piece, i) => cb(this.pieces[parseInt(piece)], i))
    }
}