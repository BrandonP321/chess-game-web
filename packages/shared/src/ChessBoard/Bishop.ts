import { faChessBishop } from "@fortawesome/pro-solid-svg-icons";
import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { ChessPiece, TChessPieceName } from "./ChessPiece";

const relativeBishopMoves = ChessPieceUtils.bishopRelativeMoves;

export class Bishop extends ChessPiece {
    protected _name: TChessPieceName = "bishop";
    protected _icon = faChessBishop;
    protected possibleMoves = relativeBishopMoves;
    protected static startingSquareIndexesWhite = [2, 5];
    protected static startingSquareIndexesBlack = [58, 61];

    public static getInstantiatedPieces = () => {
        return ChessPiece.generateInstantiatedPieces(Bishop);
    }
}