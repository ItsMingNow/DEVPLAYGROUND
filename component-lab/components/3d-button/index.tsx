"use client";

import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button3D({ children, onClick }: Props) {
  return (
    <button className={styles.btn} onClick={onClick}>
      {children}
    </button>
  );
}
