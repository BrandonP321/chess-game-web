import { faChessRook } from "@fortawesome/pro-solid-svg-icons";
import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { ChessPiece, TChessPieceName } from "./ChessPiece";

const relativeRookMoves = ChessPieceUtils.rookRelativeMoves;

export class Rook extends ChessPiece {
    protected _name: TChessPieceName = "rook";
    protected _icon = faChessRook;
    protected possibleMoves = relativeRookMoves;
    public static get startingSquareIndexesWhite() { return [0, 7] };
    public static get startingSquareIndexesBlack() { return [56, 63] };

    public static getInstantiatedPieces = () => {
        return ChessPiece.generateInstantiatedPieces(Rook);
    }
}