"use client";

import MidiPad from "./index";
import { Board, BoardItem } from "@/components/board";
import styles from "./demo.module.css";

// 4×4 grid — 16 pads with cycling colors like a classic MPC
const PAD_COLORS = [
  "#ff6b35", "#ff9500", "#ffcc00", "#4cd964",
  "#5ac8fa", "#007aff", "#af52de", "#ff2d55",
  "#ff6b35", "#ff9500", "#ffcc00", "#4cd964",
  "#5ac8fa", "#007aff", "#af52de", "#ff2d55",
];

const PAD_LABELS = [
  "C2", "D2", "E2", "F2",
  "G2", "A2", "B2", "C3",
  "D3", "E3", "F3", "G3",
  "A3", "B3", "C4", "D4",
];

export default function MidiPadDemo() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>Standalone</p>
      <MidiPad label="C4" color="#ff9500" />

      <p className={styles.hint}>On a Board — 4×4</p>
      <Board columns={4} rows={4}>
        {PAD_LABELS.map((label, i) => (
          <BoardItem key={label} col={(i % 4) + 1} row={Math.floor(i / 4) + 1}>
            <MidiPad label={label} color={PAD_COLORS[i]} />
          </BoardItem>
        ))}
      </Board>
    </div>
  );
}
