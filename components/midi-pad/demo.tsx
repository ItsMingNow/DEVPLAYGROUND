"use client";

import MidiPad from "./index";
import { Board, BoardItem } from "@/components/board";
import { useMidi } from "@/hooks/useMidi";
import styles from "./demo.module.css";

const PAD_COLORS = [
  "#ff6b35", "#ff9500", "#ffcc00", "#4cd964",
  "#5ac8fa", "#007aff", "#af52de", "#ff2d55",
  "#ff6b35", "#ff9500", "#ffcc00", "#4cd964",
  "#5ac8fa", "#007aff", "#af52de", "#ff2d55",
];

const PAD_LABELS = [
  "E", "F", "G", "A",
  "B", "C", "D", "E",
  "F", "G", "A", "B",
  "C", "D", "E", "F",
];

// Midi Fighter Spectra default note layout (top-left → bottom-right on screen
// mirrors the physical pad layout: top row = 48–51, bottom row = 36–39)
const MIDI_NOTES = [
  48, 49, 50, 51,
  44, 45, 46, 47,
  40, 41, 42, 43,
  36, 37, 38, 39,
];

const STATUS_LABEL: Record<string, string> = {
  pending:     "Connecting…",
  connected:   "Connected",
  "no-device": "No device found",
  denied:      "Permission denied",
  unsupported: "Not supported in this browser",
};

export default function MidiPadDemo() {
  const { status, deviceName, activeNotes } = useMidi();

  return (
    <div className={styles.wrapper}>
      <div className={styles.midiStatus}>
        <span className={`${styles.dot} ${styles[status]}`} />
        <span>{deviceName ?? STATUS_LABEL[status]}</span>
      </div>

      <p className={styles.hint}>Standalone</p>
      <MidiPad label="C4" color="#ff9500" />

      <p className={styles.hint}>On a Board — 4×4</p>
      <Board columns={4} rows={4}>
        {PAD_LABELS.map((label, i) => (
          <BoardItem key={i} col={(i % 4) + 1} row={Math.floor(i / 4) + 1}>
            <MidiPad
              label={label}
              color={PAD_COLORS[i]}
              active={activeNotes.has(MIDI_NOTES[i])}
            />
          </BoardItem>
        ))}
      </Board>
    </div>
  );
}
