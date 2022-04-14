import { TPieceLocation, TPiecePossibleMove } from "../ChessPiece/ChessPiece";

export class ChessPieceUtils {
    public static getRookRelativeMoves = () => {
        const moves: TPiecePossibleMove[] = [];
    
        for (let i = 1; i <= 8; i++) {
            moves.push(
                { forward: i, right: 0 },
                { forward: i * -1, right: 0 },
                { forward: 0, right: i },
                { forward: 0, right: i * -1 },
            )
        }
    
        return moves;
    }

    public static getBishopRelativeMoves = () => {
        const moves: TPiecePossibleMove[] = [];
    
        for (let i = 1; i <= 8; i++) {
            moves.push(
                { forward: i, right: i },
                { forward: i * -1, right: i * -1 },
                { forward: i, right: i * -1 },
                { forward: i * -1, right: i },
            )
        }
    
        return moves;
    }

    public static getPawnRelativeMoves = () => {
        const moves = [
            { forward: 1, right: 0 }, { forward: 2, right: 0 }
        ]

        // must return color specific moves since pawns can only move one direction
        return this.getWhiteAndBlackMoves(moves);
    }

    /* applies factor of -1 to all forwards movements of black 
    pieces to ensure they move down the board rather than up */
    private static getWhiteAndBlackMoves = (movements: TPiecePossibleMove[]) => {
        const blackMoves = movements.map(m => ({ ...m, forward: m.forward * -1 }));

        return { white: movements, black: blackMoves };
    }

    /* converts square index to an object with row and column indexes */
    public static squareIndexToBoardLocation = (squareIndex: number) => {
        const row = Math.floor(squareIndex / 8);
        const col = squareIndex - (row * 8);

        return { row, col };
    }

    /* converts square row & column data to square index */
    public static squareBoardLocationToIndex = (location: TPieceLocation) => {
        return location.row * 8 + location.col
    }
}