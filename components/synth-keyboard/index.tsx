"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import styles from "./styles.module.css";

// Maps physical keyboard keys to note names in chromatic order.
// Layout mirrors the classic "piano on a keyboard" pattern: awsedftgyhuj
const KEY_MAP: Record<string, string> = {
  a: "C", w: "C#", s: "D", e: "D#", d: "E",
  f: "F", t: "F#", g: "G", y: "G#", h: "A", u: "A#", j: "B",
};

// Builds a note→Tone.js string map for a given octave.
// e.g. noteFreq(4) gives { C: "C4", "C#": "C#4", ... }
const noteFreq = (octave: number): Record<string, string> => ({
  C: `C${octave}`, "C#": `C#${octave}`, D: `D${octave}`, "D#": `D#${octave}`, E: `E${octave}`,
  F: `F${octave}`, "F#": `F#${octave}`, G: `G${octave}`, "G#": `G#${octave}`, A: `A${octave}`, "A#": `A#${octave}`, B: `B${octave}`,
});

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];

// Black keys need explicit pixel offsets because they're absolutely positioned
// over the gaps between white keys rather than flowing in the flex layout.
const BLACK_KEYS = [
  { note: "C#", left: 34  },
  { note: "D#", left: 84  },
  { note: "F#", left: 184 },
  { note: "G#", left: 234 },
  { note: "A#", left: 284 },
];

export const SOUNDS = ["Synth", "AM", "FM", "Duo", "Mono"] as const;
export type SoundType = typeof SOUNDS[number];

// Each sound type is a different Tone.js synth voice wrapped in PolySynth.
// PolySynth lets us play multiple notes at once (chords) regardless of the voice type.
// Note: PluckSynth and MembraneSynth can't be used here because they don't extend
// Monophonic — the interface PolySynth requires.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createSynth = (sound: SoundType): Tone.PolySynth<any> => {
  switch (sound) {
    case "AM":   return new Tone.PolySynth(Tone.AMSynth).toDestination();
    case "FM":   return new Tone.PolySynth(Tone.FMSynth).toDestination();
    case "Duo":  return new Tone.PolySynth(Tone.DuoSynth).toDestination();
    case "Mono": return new Tone.PolySynth(Tone.MonoSynth, {
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.8 },
    }).toDestination();
    default:     return new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 },
    }).toDestination();
  }
};

interface Props {
  volume?: number;          // 0–100, mapped to -40dB–0dB internally
  octave?: number;          // 1–7, default 4 (middle C = C4)
  soundSelection?: SoundType;
}

export default function SynthKeyboard({ volume = 70, octave = 4, soundSelection = "Synth" }: Props) {
  // Tracks which notes are visually pressed so keys animate down.
  // A Set is used so multiple keys can be held at once (chords).
  const [pressed, setPressed] = useState<Set<string>>(new Set());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const synth = useRef<Tone.PolySynth<any> | null>(null);

  // octaveRef mirrors the octave prop but is readable inside stale closures.
  // The keyboard event listeners are registered once (empty deps []) so they
  // close over the initial octave value and never see updates. By reading
  // octaveRef.current instead, they always get the latest octave.
  const octaveRef = useRef(octave);

  // When octave changes: release any held notes at the OLD octave before updating
  // the ref. If we updated the ref first and then tried to release, we'd send the
  // release signal to the wrong frequency and the note would keep sustaining.
  useEffect(() => {
    pressed.forEach((note) => synth.current?.triggerRelease(noteFreq(octaveRef.current)[note]));
    setPressed(new Set());
    octaveRef.current = octave;
  }, [octave]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Synth lifecycle ──────────────────────────────────────────────────────────
  //
  // IMPORTANT: these two effects are intentionally split into separate concerns.
  //
  // Effect 1 — unmount only: disposes whichever synth is current when the
  // component is removed from the page. The empty [] deps mean this cleanup
  // function is only called on unmount, never between re-renders.
  useEffect(() => {
    return () => { synth.current?.dispose(); };
  }, []);

  // Effect 2 — sound type changes: re-creates the synth when soundSelection changes.
  // We cannot put the dispose logic in the cleanup of this effect because React calls
  // the cleanup BEFORE the next run of the effect — meaning when you change sounds,
  // the cleanup from the previous run would dispose the brand-new synth we just created.
  // This causes an InvalidAccessError in the Web Audio API, especially with rapid changes.
  //
  // The fix: store the old synth in `prev`, immediately assign the new one to the ref,
  // then dispose `prev` after 300ms. This gives the audio context time to finish any
  // in-flight processing on the old synth before we tear it down.
  useEffect(() => {
    const prev = synth.current;
    synth.current = createSynth(soundSelection);
    synth.current.volume.value = volume === 0 ? -Infinity : (volume / 100) * 40 - 40;
    setPressed(new Set());
    if (prev) {
      prev.releaseAll();
      setTimeout(() => prev.dispose(), 300);
    }
  }, [soundSelection]); // eslint-disable-line react-hooks/exhaustive-deps

  // Volume is kept in sync independently so we don't need to rebuild the synth for it.
  // 0 maps to -Infinity dB (true silence) rather than just very quiet.
  useEffect(() => {
    if (synth.current) synth.current.volume.value = volume === 0 ? -Infinity : (volume / 100) * 40 - 40;
  }, [volume]);

  const attack = async (note: string) => {
    // Tone.start() resumes the AudioContext, which browsers suspend until a user gesture.
    // It's a no-op after the first call so there's no cost to calling it every time.
    await Tone.start();
    synth.current?.triggerAttack(noteFreq(octaveRef.current)[note]);
    setPressed((prev) => new Set(prev).add(note));
  };

  const release = (note: string) => {
    synth.current?.triggerRelease(noteFreq(octaveRef.current)[note]);
    setPressed((prev) => { const next = new Set(prev); next.delete(note); return next; });
  };

  // Keyboard listeners are registered once and use octaveRef so they always
  // have the latest octave without needing to re-register on every change.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return; // ignore auto-repeat from holding the key down
      const note = KEY_MAP[e.key];
      if (note) attack(note);
    };
    const up = (e: KeyboardEvent) => {
      const note = KEY_MAP[e.key];
      if (note) release(note);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.keyboard}>
      {WHITE_KEYS.map((note) => (
        <div
          key={note}
          className={`${styles.whiteKey} ${pressed.has(note) ? styles.whiteKeyPressed : ""}`}
          onMouseDown={() => attack(note)}
          onMouseUp={() => release(note)}
          // Release if the user clicks and drags off the key so it doesn't get stuck
          onMouseLeave={() => { if (pressed.has(note)) release(note); }}
        />
      ))}
      {BLACK_KEYS.map((key) => (
        <div
          key={key.note}
          className={`${styles.blackKey} ${pressed.has(key.note) ? styles.blackKeyPressed : ""}`}
          style={{ left: key.left }}
          onMouseDown={() => attack(key.note)}
          onMouseUp={() => release(key.note)}
          onMouseLeave={() => { if (pressed.has(key.note)) release(key.note); }}
        />
      ))}
    </div>
  );
}
