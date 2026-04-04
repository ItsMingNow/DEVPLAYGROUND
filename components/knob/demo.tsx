"use client";

import { useState } from "react";
import Knob from "./index";
import styles from "./demo.module.css";

const SPEEDS = ["Off", "Slow", "Med", "Fast", "Max"] as const;
const FILTERS = ["LP", "BP", "HP", "Notch"] as const;
const WAVEFORMS = ["Sine", "Triangle", "Sawtooth", "Square"] as const;

export default function KnobDemo() {
  const [speed, setSpeed] = useState(2);
  const [filter, setFilter] = useState(0);
  const [wave, setWave] = useState(0);

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>Click and drag up or down to turn</p>
      <div className={styles.knobs}>
        <Knob options={SPEEDS} value={speed} onChange={setSpeed} label="Speed" />
        <Knob options={FILTERS} value={filter} onChange={setFilter} label="Filter" />
        <Knob options={WAVEFORMS} value={wave} onChange={setWave} label="Wave" />
      </div>
      <p className={styles.readout}>
        Speed: <span>{SPEEDS[speed]}</span>{" "}
        · Filter: <span>{FILTERS[filter]}</span>{" "}
        · Wave: <span>{WAVEFORMS[wave]}</span>
      </p>
    </div>
  );
}
