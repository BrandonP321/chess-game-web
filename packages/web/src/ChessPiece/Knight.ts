import { faChessKnight, IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { ChessPiece, TChessPieceName, TPieceLocation, TPiecePossibleMove } from "./ChessPiece";

const relativeKnightMoves = ChessPieceUtils.knightRelativeMoves;

export class Knight extends ChessPiece {
    protected _name: TChessPieceName = "knight";
    protected _icon: IconDefinition | null = faChessKnight;
    protected possibleMoves = relativeKnightMoves;
    protected static startingSquareIndexesWhite = [1, 6];
    protected static startingSquareIndexesBlack = [57, 62];

    public static getInstantiatedPieces = () => {
        return ChessPiece.generateInstantiatedPieces(Knight);
    }
}