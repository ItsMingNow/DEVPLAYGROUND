"use client";

import Button3D from "./index";
import styles from "./demo.module.css";

export default function Button3DDemo() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>Press and hold to see the depth collapse</p>
      <Button3D>Press me</Button3D>
    </div>
  );
}
