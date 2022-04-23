import { faChessPawn, IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { ChessPiece, TChessPieceConstructorProps, TChessPieceName, TPieceLocation } from "./ChessPiece";

const relativePawnMoves = ChessPieceUtils.getPawnRelativeMoves();

export class Pawn extends ChessPiece {
    protected _name: TChessPieceName = "pawn";
    protected _icon: IconDefinition | null = faChessPawn;
    protected static startingSquareIndexesWhite = [8, 9, 10, 11, 12, 13, 14, 15];
    protected static startingSquareIndexesBlack = [48, 49, 50, 51, 52, 53, 54, 55];

    constructor(props: TChessPieceConstructorProps) {
        super(props);

        this.possibleMoves = relativePawnMoves[props.color];
    }

    public static getInstantiatedPieces = () => {
        return ChessPiece.generateInstantiatedPieces(Pawn);
    }

    // overriding method from parent class to check if Pawn can move 2 spaces forward if it hasn't moved yet
    public getPotentialMoves = () => {
        let possibleMoves = [...this.possibleMoves];

        // if piece has moved, remove moves allowing piece to move 2 squares forward
        if (this.hasMoved) {
            possibleMoves = possibleMoves.filter(m => Math.abs(m.forward) === 1);
        }

        possibleMoves = this.removeMovesOutsideBoard(possibleMoves);

        const movesIndexes = this.getMovesSquareIndexes(possibleMoves);

        return movesIndexes;
    }

    /* checks if pawn can attack a piece to it's diagonal, and exclude any forward attacks on enemy pieces */
    public filterAttackMoves = (availableSquares: TPieceLocation[], allPiecesObj: { [key: number]: ChessPiece }) => {
        return availableSquares.filter(s => {
            const pieceOnSquare = allPiecesObj[ChessPieceUtils.squareBoardLocationToIndex(s)];
            const isDiagonalPieceEnemy = pieceOnSquare?.color !== this.color && pieceOnSquare?.col !== this.col;

            return (s.col === this.col && !pieceOnSquare) || (pieceOnSquare && isDiagonalPieceEnemy);
        })
    }
}