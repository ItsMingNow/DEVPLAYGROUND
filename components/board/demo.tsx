"use client";

import { Board, BoardItem } from "./index";
import styles from "./demo.module.css";

const COLUMNS = 10;
const ROWS = 5;

export default function BoardDemo() {
  // Generate every cell position in the 16×4 grid
  const cells = [];
  for (let row = 1; row <= ROWS; row++) {
    for (let col = 1; col <= COLUMNS; col++) {
      cells.push({ col, row });
    }
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>10 × 5 grid · 64px cells · drag modules onto any slot</p>
      <Board columns={COLUMNS} rows={ROWS}>
        {cells.map(({ col, row }) => (
          <BoardItem key={`${col}-${row}`} col={col} row={row}>
            <div className={styles.slot} />
          </BoardItem>
        ))}
      </Board>
    </div>
  );
}
