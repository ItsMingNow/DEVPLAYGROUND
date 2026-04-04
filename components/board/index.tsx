import React, { createContext, useContext } from "react";
import styles from "./styles.module.css";

// Modules inside a Board read this to switch to their embedded (board-integrated) style
export const BoardContext = createContext(false);
export const useBoard = () => useContext(BoardContext);

// The size of one grid cell in pixels. All module components (Fader, Knob, etc.)
// are designed to fit into multiples of this unit.
export const CELL_SIZE = 64;
export const CELL_GAP = 8;

interface BoardProps {
  columns?: number; // number of grid columns, default 16
  rows?: number;    // number of grid rows, default 4
  children?: React.ReactNode;
}

// Board is the container. It sets up a fixed-cell CSS grid and scrolls
// horizontally when the content is wider than the viewport.
export function Board({ columns = 10, rows = 5, children }: BoardProps) {
  const slots = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= columns; c++) {
      slots.push(
        <div
          key={`slot-${c}-${r}`}
          className={styles.slot}
          style={{ gridColumn: c, gridRow: r }}
        />
      );
    }
  }

  return (
    <BoardContext.Provider value={true}>
      <div className={styles.boardScroll}>
        <div
          className={styles.board}
          style={{
            gridTemplateColumns: `repeat(${columns}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
          }}
        >
          {slots}
          {children}
        </div>
      </div>
    </BoardContext.Provider>
  );
}

interface BoardItemProps {
  col: number;       // 1-based column start
  row: number;       // 1-based row start
  colSpan?: number;  // default 1
  rowSpan?: number;  // default 1
  children?: React.ReactNode;
}

// BoardItem places a child at a specific grid position.
// col/row are 1-based to match CSS grid convention.
export function BoardItem({ col, row, colSpan = 1, rowSpan = 1, children }: BoardItemProps) {
  return (
    <div
      className={styles.item}
      style={{
        gridColumn: `${col} / span ${colSpan}`,
        gridRow: `${row} / span ${rowSpan}`,
      }}
    >
      {children}
    </div>
  );
}
