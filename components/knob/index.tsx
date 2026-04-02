"use client";

import { useEffect, useRef } from "react";
import styles from "./styles.module.css";

interface KnobProps {
  options: readonly string[];
  value: number; // index into options
  onChange: (index: number) => void;
  label?: string;
}

export default function Knob({ options, value, onChange, label }: KnobProps) {
  // Stores where the drag started so we can compute how far the user has moved
  const dragStart = useRef<{ y: number; index: number } | null>(null);

  // Refs for options and onChange so the mousemove listener (registered once) always
  // sees the latest values without needing to re-register on every render.
  const optionsRef = useRef(options);
  const onChangeRef = useRef(onChange);
  useEffect(() => { optionsRef.current = options; }, [options]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  // Map the current index to a rotation angle.
  // First option = -135deg (lower-left), last option = +135deg (lower-right).
  const angle = options.length > 1
    ? -135 + (value / (options.length - 1)) * 270
    : 0;

  // Register mouse listeners on the window (not the knob element) so dragging
  // outside the knob still works — this is the same pattern used by sliders.
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      // Dragging up (negative dy) increases the index; down decreases it.
      // Every 20px of movement = 1 step.
      const dy = dragStart.current.y - e.clientY;
      const step = Math.round(dy / 20);
      const next = Math.max(0, Math.min(optionsRef.current.length - 1, dragStart.current.index + step));
      onChangeRef.current(next);
    };
    const onMouseUp = () => { dragStart.current = null; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []); // empty deps — listeners registered once, refs keep values fresh

  return (
    <div className={styles.knobWrapper}>
      <div
        className={styles.knob}
        style={{ transform: `rotate(${angle}deg)` }}
        onMouseDown={(e) => {
          e.preventDefault(); // prevents text selection during drag
          dragStart.current = { y: e.clientY, index: value };
        }}
      >
        <div className={styles.knobDot} />
      </div>
      {label && <span className={styles.knobLabel}>{label}</span>}
      <span className={styles.knobValue}>{options[value]}</span>
    </div>
  );
}
