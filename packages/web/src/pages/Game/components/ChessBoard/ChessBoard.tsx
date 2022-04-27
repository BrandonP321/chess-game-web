import React, { useEffect, useRef, useState } from 'react';
import { Board, ChessPiece, TChessPieceColor } from "@chess-game/shared";
import styles from "./ChessBoard.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';

type ChessBoardProps = {

}

const ChessBoard = React.memo((props: ChessBoardProps) => {
    const {} = props;

    const boardRef = useRef(new Board());
    const [pieces, setPieces] = useState<(ChessPiece | null)[]>([]);
    const [availableSquares, setAvailableSquares] = useState<null | { [key: number]: boolean }>(null);
    const [selectedSquare, setSelectedSquare] = useState<null | number>(null);
    const [userColor, setUserColor] = useState<TChessPieceColor>("white");

    useEffect(() => {
        setPieces(boardRef?.current?.pieces);
        startGame();
    }, [])

    const startGame = () => {
       boardRef.current?.startGame();
    }

    const handleSquareClick = (squareIndex: number) => {
        // do nothing if game is over
        if (boardRef.current?.isGameOver) {
            return;
        }

        const clickedPiece = boardRef.current?.getPieceByIndex(squareIndex);
        // check if user has a square clicked but is clicking an invalid square to move to
        const isClickingInvalidSquare = selectedSquare !== null && availableSquares && !availableSquares[squareIndex];

        if (selectedSquare !== null && squareIndex === selectedSquare) {
            // if user is re-clicking their selected piece, un-select that square
            return unselectCurrentSquare();
        } else if (clickedPiece?.color === userColor) {
            // if no square has been selected yet or user is selecteing new piece, select clicked square
            return selectSquare(squareIndex);
        } else if (isClickingInvalidSquare || selectedSquare === null) {
            // if there is no piece on the clicked square at this point or user isn't clicking a valid square to move to, do nothing
            return;
        }

        // else we can now attempt to move the selected piece to the clicked square
        const newPiecePositions = boardRef.current?.attemptPieceMove(selectedSquare, squareIndex);

        // if new array of postions was returned, move was successful
        if (newPiecePositions) {
            setPieces(newPiecePositions);
            setSelectedSquare(null);
            setAvailableSquares(null);
        }
    }

    const selectSquare = (squareIndex: number) => {
        const availableMoves = boardRef.current?.getPieceAvailableMoves(squareIndex);
    
        setAvailableSquares(availableMoves);
        setSelectedSquare(squareIndex);
    }

    const unselectCurrentSquare = () => {
        setSelectedSquare(null);
        setAvailableSquares(null);
    }

    return (
        <div className={styles.board}>
            {Array(Board.squareCount).fill(null).map((s, i) => {
                const isSquareAvailableForMove = availableSquares?.[i];
                const squareHasFriendlyPiece = boardRef.current?.piecesObj?.[i]?.color === userColor;

                const squareClasses = classNames(
                    styles.square,
                    {
                        [styles.availableMove]: isSquareAvailableForMove,
                        [styles.selected]: i === selectedSquare,
                        [styles.hasPiece]: squareHasFriendlyPiece,
                    }
                )

                return (
                    <div key={i} className={squareClasses} onClick={() => handleSquareClick(i)}>
                        <div className={styles.squareAspectRatioBox}/>
                        {/* {i} */}
                        <div className={styles.squareContentWrapper}>
                            <div className={styles.availabilityCircle}/>
                        </div>
                    </div>
                )
            })}

            {pieces?.map((p, i) => {
                if (!p) {
                    return null;
                }

                const { col, row } = p.squareLocation
                
                // get relative position of piece to position it over it's respective square on the board
                const piecePositionBottom = `${(100 / 8) * row}%`;
                const piecePositionLeft = `${(100 / 8) * col}%`;
                
                const pieceStyle: React.CSSProperties = {
                    bottom: piecePositionBottom,
                    left: piecePositionLeft,
                }

                const pieceClasses = classNames(
                    styles.pieceIcon, styles[p.color]
                )

                return (
                    <div key={i} className={styles.pieceWrapper} style={pieceStyle}>
                        <div className={styles.squareAspectRatioBox}/>
                        <div className={styles.pieceIconWrapper}>
                            <FontAwesomeIcon icon={p.icon as IconProp} className={pieceClasses}/>
                        </div>
                    </div>
                )
            })}
        </div>
    )
})

export default ChessBoard;