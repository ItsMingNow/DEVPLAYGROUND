"use client";

import { useState } from "react";
import Fader, { FaderGroup } from "./index";
import { Board, BoardItem } from "@/components/board";
import styles from "./demo.module.css";

export default function FaderDemo() {
  const [vol, setVol] = useState(75);
  const [reverb, setReverb] = useState(30);
  const [delay, setDelay] = useState(50);
  const [filter, setFilter] = useState(8000);

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>Standalone</p>
      <div className={styles.row}>
        <Fader value={vol} min={0} max={100} onChange={setVol} label="Vol" unit="%" />
      </div>

      <p className={styles.hint}>Grouped — borders removed where touching</p>
      <FaderGroup>
        <Fader value={vol}    min={0}   max={100}   onChange={setVol}    label="Vol"    unit="%" />
        <Fader value={reverb} min={0}   max={100}   onChange={setReverb} label="Reverb" unit="%" />
        <Fader value={delay}  min={0}   max={100}   onChange={setDelay}  label="Delay"  unit="%" />
        <Fader value={filter} min={200} max={20000} onChange={setFilter} label="Filter" unit="hz" />
      </FaderGroup>

      <p className={styles.hint}>On a Board — standalone and grouped</p>
      <Board columns={6} rows={2}>
        {/* Standalone — one fader with empty cells around it */}
        <BoardItem col={1} row={1} rowSpan={2}><Fader value={vol}    min={0}   max={100}   onChange={setVol}    label="Vol"    unit="%" /></BoardItem>
        {/* col 2 intentionally empty */}
        {/* Grouped — adjacent BoardItems, board gap acts as the separation */}
        <BoardItem col={3} row={1} rowSpan={2}><Fader value={reverb} min={0}   max={100}   onChange={setReverb} label="Reverb" unit="%" /></BoardItem>
        <BoardItem col={4} row={1} rowSpan={2}><Fader value={delay}  min={0}   max={100}   onChange={setDelay}  label="Delay"  unit="%" /></BoardItem>
        <BoardItem col={5} row={1} rowSpan={2}><Fader value={filter} min={200} max={20000} onChange={setFilter} label="Filter" unit="hz" /></BoardItem>
        {/* col 6 intentionally empty */}
      </Board>
    </div>
  );
}
