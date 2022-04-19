import { faChessKing } from "@fortawesome/pro-solid-svg-icons";
import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { Board } from "./Board";
import { ChessPiece, TChessPieceName, TPieceLocation } from "./ChessPiece";
import { Rook } from "./Rook";

const relativeKingMoves = ChessPieceUtils.kingRelativeMoves;

export class King extends ChessPiece {
    protected _name: TChessPieceName = "king";
    protected _icon = faChessKing;
    protected possibleMoves = relativeKingMoves;
    public static get startingSquareIndexesWhite() { return [4] };
    public static get startingSquareIndexesBlack() { return [60] };

    public static getInstantiatedPieces = () => {
        return ChessPiece.generateInstantiatedPieces(King);
    }

    public getCastleMoves: (board: Board) => TPieceLocation[] = (board) => {
        // to avoid an infinite loop later on, return now if king has already been moved
        if (this.hasMoved) {
            return []
        }

        const rookLocations = Rook[`startingSquareIndexes${this.color === "white" ? "White": "Black"}`];
        // array of all rooks at their starting locations on the same team as this King
        let unMovedRooks: Rook[] = [];

        rookLocations.forEach(squareIndex => {
            const pieceAtLocation = board.piecesObj[squareIndex];

            if (pieceAtLocation && pieceAtLocation instanceof Rook && !pieceAtLocation.hasMoved) {
                unMovedRooks.push(pieceAtLocation);
            }
        })

        if (unMovedRooks.length === 0) {
            return [];
        }

        /* returns array 2 squares to left or right or king in direction of rook for castle move, aslo including the king itself */
        const getSquaresBetweenKingAndRook = (rookCol: number) => {
            return Array(3).fill(null).map((_, i) => ({
                col: rookCol > this.col ? this.col + i : this.col - i,
                row: this.row
            }));
        }

        // make sure there are no pieces between the king and each rook
        let openRooks = unMovedRooks.filter(rook => {
            const squaresBetweenPieces = getSquaresBetweenKingAndRook(rook.col);

            // iterate over all squares between king and rook
            for (const square of squaresBetweenPieces) {
                const pieceOnSquare = board.piecesObj[ChessPieceUtils.squareBoardLocationToIndex(square)]
                // filter out rook if there is a piece on this square, unless piece is the king
                if (pieceOnSquare && (pieceOnSquare.col !== this.col || pieceOnSquare.row !== this.row)) {
                    return false;
                }
            }

            return true;
        })

        // make sure no enemy piece would put the king in check during the castle
        openRooks = openRooks.filter(rook => {
            const squaresBetweenPieces = getSquaresBetweenKingAndRook(rook.col);

            // iterate over all other pieces on board
            for (const squareIndex in board.piecesObj) {
                const piece = board.getPieceByIndex(parseInt(squareIndex));

                // piece is of same color as kind, break iteration since it can't put king in check
                if (!piece || piece.color === this.color) {
                    continue
                } else if (piece instanceof King && !piece.hasMoved) {
                    // to avoid an infinite loop, ignore enemy king now if it has not moved yet, before attempting to get all the available moves for that king
                    continue
                }

                const pieceAvailableMoves = board.getPieceAvailableMoves(parseInt(squareIndex));

                // check if one of the squares the enemy piece can move would put the king in check at any time during castle
                for (const square of squaresBetweenPieces) {
                    const squareIndex = ChessPieceUtils.squareBoardLocationToIndex(square);

                    // if piece would put king in check, return false to remove this castle option
                    if (pieceAvailableMoves[squareIndex]) {
                        console.log(piece);
                        return false;
                    }
                }
            }

            return true;
        });

        const openSquares: TPieceLocation[] = openRooks.map(rook => ({
            col: rook.col < this.col ? this.col - 2 : this.col + 2,
            row: this.row
        }))

        return openSquares;
    }
}