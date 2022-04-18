import { faChessRook } from "@fortawesome/pro-solid-svg-icons";
import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { ChessPiece, TChessPieceConstructorProps, TChessPieceName, TPiecePossibleMove } from "./ChessPiece";

const relativeRookMoves = ChessPieceUtils.rookRelativeMoves;

export class Rook extends ChessPiece {
    protected _name: TChessPieceName = "rook";
    protected _icon = faChessRook;
    protected possibleMoves = relativeRookMoves;
    protected static startingSquareIndexesWhite = [0, 7];
    protected static startingSquareIndexesBlack = [56, 63];

    public static getInstantiatedPieces = () => {
        return ChessPiece.generateInstantiatedPieces(Rook);
    }
}