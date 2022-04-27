import React from 'react';
import ChessBoard from './components/ChessBoard/ChessBoard';
import styles from "./Game.module.scss";

type GameProps = {}

export default function Game(props: GameProps) {
  return (
    <div className={styles.gameWrapper}>
        <div className={styles.chessBoardWrapper}>
            <ChessBoard/>
        </div>
    </div>
  )
}