"use client";

import ButtonRipple from "./index";
import styles from "./demo.module.css";

export default function ButtonRippleDemo() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>Click anywhere on the button to see the ripple origin</p>
      <ButtonRipple>Click me</ButtonRipple>
      <ButtonRipple>Another button</ButtonRipple>
    </div>
  );
}
