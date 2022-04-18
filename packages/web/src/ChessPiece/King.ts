import { faChessKing } from "@fortawesome/pro-solid-svg-icons";
import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { ChessPiece, TChessPieceConstructorProps, TChessPieceName, TPiecePossibleMove } from "./ChessPiece";

const relativeKingMoves = ChessPieceUtils.kingRelativeMoves;

console.log(relativeKingMoves);

export class King extends ChessPiece {
    protected _name: TChessPieceName = "king";
    protected _icon = faChessKing;
    protected possibleMoves = relativeKingMoves;
    protected static startingSquareIndexesWhite = [4];
    protected static startingSquareIndexesBlack = [60];

    public static getInstantiatedPieces = () => {
        return ChessPiece.generateInstantiatedPieces(King);
    }
}