"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import { useBoard } from "@/components/board";

interface Props {
  label?: string;
  color?: string;       // glow color when pressed, e.g. "#ff9500"
  onPress?: () => void;
  onRelease?: () => void;
}

export default function MidiPad({ label, color = "#ff9500", onPress, onRelease }: Props) {
  const [pressed, setPressed] = useState(false);
  const embedded = useBoard();

  const handlePress = () => {
    setPressed(true);
    onPress?.();
  };

  const handleRelease = () => {
    setPressed(false);
    onRelease?.();
  };

  return (
    <div
      className={`${styles.pad} ${embedded ? styles.embedded : ""} ${pressed ? styles.pressed : ""}`}
      style={{ "--pad-color": color } as React.CSSProperties}
      onMouseDown={(e) => { e.preventDefault(); handlePress(); }}
      onMouseUp={handleRelease}
      onMouseLeave={() => { if (pressed) handleRelease(); }}
      onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
      onTouchEnd={handleRelease}
      onTouchCancel={handleRelease}
    >
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
