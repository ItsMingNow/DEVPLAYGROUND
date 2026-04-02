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

  // Register mouse + touch listeners on the window so dragging outside the knob still works.
  useEffect(() => {
    const move = (clientY: number) => {
      if (!dragStart.current) return;
      const dy = dragStart.current.y - clientY;
      const step = Math.round(dy / 20);
      const next = Math.max(0, Math.min(optionsRef.current.length - 1, dragStart.current.index + step));
      onChangeRef.current(next);
    };
    const onMouseMove = (e: MouseEvent) => move(e.clientY);
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); move(e.touches[0].clientY); };
    const onEnd = () => { dragStart.current = null; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []); // empty deps — listeners registered once, refs keep values fresh

  return (
    <div className={styles.knobWrapper}>
      <div
        className={styles.knob}
        style={{ transform: `rotate(${angle}deg)` }}
        onMouseDown={(e) => {
          e.preventDefault();
          dragStart.current = { y: e.clientY, index: value };
        }}
        onTouchStart={(e) => {
          e.preventDefault(); // prevents page scroll while turning the knob
          dragStart.current = { y: e.touches[0].clientY, index: value };
        }}
      >
        <div className={styles.knobDot} />
      </div>
      {label && <span className={styles.knobLabel}>{label}</span>}
      <span className={styles.knobValue}>{options[value]}</span>
    </div>
  );
}
