"use client";

import { useState } from "react";
import SynthKeyboard, { SOUNDS, SoundType } from "./index";
import Knob from "@/components/knob";
import styles from "./demo.module.css";

export default function SynthKeyboardDemo() {
  const [volume, setVolume] = useState(70);
  const [octave, setOctave] = useState(4);
  const [soundIndex, setSoundIndex] = useState(0);

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>Press the keys</p>
      <div className={styles.keyboardScroll}>
        <SynthKeyboard
          volume={volume}
          octave={octave}
          soundSelection={SOUNDS[soundIndex] as SoundType}
        />
      </div>
      <div className={styles.controls}>
        <label className={styles.label}>
          Volume
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.value}>{volume}</span>
        </label>
        <label className={styles.label}>
          Octave
          <input
            type="range"
            min={1}
            max={7}
            value={octave}
            onChange={(e) => setOctave(Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.value}>{octave}</span>
        </label>
        <Knob
          options={SOUNDS}
          value={soundIndex}
          onChange={setSoundIndex}
          label="Sound"
        />
      </div>
    </div>
  );
}
