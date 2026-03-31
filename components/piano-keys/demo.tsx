"use client";

import PianoKeys from "./index";
import styles from "./demo.module.css";

export default function PianoKeysDemo() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>Press the keys</p>
      <PianoKeys />
    </div>
  );
}
