"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

// Keys in chromatic order: a=C, w=C#, s=D, e=D#, d=E, f=F, t=F#, g=G, y=G#, h=A, u=A#, j=B
const KEY_MAP: Record<string, string> = {
  a: "C",
  w: "C#",
  s: "D",
  e: "D#",
  d: "E",
  f: "F",
  t: "F#",
  g: "G",
  y: "G#",
  h: "A",
  u: "A#",
  j: "B",
};

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];

const BLACK_KEYS = [
  { note: "C#", left: 34  },
  { note: "D#", left: 84  },
  { note: "F#", left: 184 },
  { note: "G#", left: 234 },
  { note: "A#", left: 284 },
];

export default function PianoKeys() {
  const [pressed, setPressed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEY_MAP[e.key];
      if (note) setPressed((prev) => new Set(prev).add(note));
    };
    const up = (e: KeyboardEvent) => {
      const note = KEY_MAP[e.key];
      if (note) setPressed((prev) => { const next = new Set(prev); next.delete(note); return next; });
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  return (
    <div className={styles.keyboard}>
      {WHITE_KEYS.map((note) => (
        <div
          key={note}
          className={`${styles.whiteKey} ${pressed.has(note) ? styles.whiteKeyPressed : ""}`}
        />
      ))}
      {BLACK_KEYS.map((key) => (
        <div
          key={key.note}
          className={`${styles.blackKey} ${pressed.has(key.note) ? styles.blackKeyPressed : ""}`}
          style={{ left: key.left }}
        />
      ))}
    </div>
  );
}
