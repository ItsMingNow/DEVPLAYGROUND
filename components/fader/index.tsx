"use client";

import React, { useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { useBoard } from "@/components/board";

type GroupPosition = "first" | "middle" | "last";

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;          // optional suffix e.g. "%" or "dB"
  groupPosition?: GroupPosition; // injected by FaderGroup, omit when standalone
}

export default function Fader({ value, min, max, onChange, label, unit, groupPosition }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ y: number; value: number } | null>(null);
  const embedded = useBoard();

  const normalized = (value - min) / (max - min);
  const thumbOffset = `${(1 - normalized) * 100}%`;

  // Map groupPosition to the corresponding CSS module class
  const groupClass = groupPosition ? styles[`group${groupPosition.charAt(0).toUpperCase()}${groupPosition.slice(1)}`] : "";

  useEffect(() => {
    const onMove = (clientY: number) => {
      if (!dragStart.current || !trackRef.current) return;
      const trackHeight = trackRef.current.getBoundingClientRect().height;
      const delta = (dragStart.current.y - clientY) / trackHeight * (max - min);
      const next = Math.min(max, Math.max(min, dragStart.current.value + delta));
      onChange(next);
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientY);
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); onMove(e.touches[0].clientY); };
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
  }, [min, max, onChange]);

  return (
    <div className={`${styles.fader} ${groupClass} ${embedded ? styles.embedded : ""}`}>
      <span className={styles.value}>{Math.round(value)}{unit ?? ""}</span>
      <div className={styles.trackArea} ref={trackRef}>
        <div className={styles.track} />
        <div
          className={styles.thumb}
          style={{ top: thumbOffset }}
          onMouseDown={(e) => { e.preventDefault(); dragStart.current = { y: e.clientY, value }; }}
          onTouchStart={(e) => {
            e.preventDefault();
            dragStart.current = { y: e.touches[0].clientY, value };
          }}
        />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}

// ── FaderGroup ────────────────────────────────────────────────────────────────
// Wraps multiple Faders side-by-side. Automatically injects the correct
// groupPosition into each child so touching borders are removed and the
// depth shadow appears on the container rather than each individual fader.
export function FaderGroup({ children }: { children: React.ReactNode }) {
  const embedded = useBoard();
  const arr = React.Children.toArray(children);
  return (
    <div className={`${styles.faderGroup} ${embedded ? styles.faderGroupEmbedded : ""}`}>
      {arr.map((child, i) => {
        if (!React.isValidElement(child)) return child;
        const position: GroupPosition =
          arr.length === 1 ? "first" // single child — won't match any group class, renders normally
            : i === 0 ? "first"
            : i === arr.length - 1 ? "last"
            : "middle";
        return React.cloneElement(child as React.ReactElement<Props>, { groupPosition: position });
      })}
    </div>
  );
}
