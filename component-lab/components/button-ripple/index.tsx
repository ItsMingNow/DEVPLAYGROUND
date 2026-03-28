"use client";

import { useRef, MouseEvent } from "react";
import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function ButtonRipple({ children, onClick }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const btn = btnRef.current;
    if (!btn) return;

    // Remove any existing ripple so re-clicking always re-triggers
    const existing = btn.querySelector(`.${styles.ripple}`);
    if (existing) existing.remove();

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = styles.ripple;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());

    onClick?.();
  }

  return (
    <button ref={btnRef} className={styles.btn} onClick={handleClick}>
      {children}
    </button>
  );
}
