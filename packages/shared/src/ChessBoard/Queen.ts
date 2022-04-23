import { faChessQueen } from "@fortawesome/pro-solid-svg-icons";
import { ChessPieceUtils } from "../utils/ChessPieceUtils";
import { ChessPiece, TChessPieceName } from "./ChessPiece";

const relativeQueenMoves = ChessPieceUtils.queenRelativeMoves;

export class Queen extends ChessPiece {
    protected _name: TChessPieceName = "queen";
    protected _icon = faChessQueen;
    protected possibleMoves = relativeQueenMoves;
    protected static startingSquareIndexesWhite = [3];
    // protected static startingSquareIndexesBlack = [59];
    protected static startingSquareIndexesBlack = [17];

    public static getInstantiatedPieces = () => {
        return ChessPiece.generateInstantiatedPieces(Queen);
    }
}