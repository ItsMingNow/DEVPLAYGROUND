# TODO

Things to come back to. Not urgent, just parked here so I don't forget.

---

## Knob — number range support

Right now Knob only accepts a `readonly string[]` options array and an index.
The goal is to also accept a numeric range so it can drive volume and octave directly
instead of needing a separate slider.

Proposed API:
```tsx
// current (options mode)
<Knob options={SOUNDS} value={index} onChange={setIndex} label="Sound" />

// new (number mode)
<Knob min={0} max={100} value={volume} onChange={setVolume} label="Volume" />
<Knob min={1} max={7} value={octave} onChange={setOctave} label="Octave" />
```

The component would detect which mode it's in based on whether `options` or `min/max` is passed.
Internally, both modes already work the same way — it's just a matter of mapping the drag
delta to a number range instead of an index.

---

## MPC — 4x4 pad grid component

A 4×4 grid of pads like an Akai MPC. Each pad plays a sample or a note on press.

Ideas:
- Pads light up on press with a flash animation
- Each pad mapped to a keyboard key (e.g. `zxcv / asdf / qwer / 1234`)
- Could use `Tone.Player` to load samples per pad, or `Tone.MembraneSynth` / `Tone.MetalSynth`
  for built-in drum sounds without needing audio files
- Props: `sounds` array (one per pad), `labels` array for pad names

Note: `MembraneSynth` and `MetalSynth` can't be used with `PolySynth` (they don't extend
`Monophonic`) but they work fine standalone since each pad is its own instrument instance.

---

## MIDI device API — synth-keyboard integration

Web MIDI API (`navigator.requestMIDIAccess()`) lets browsers talk to connected MIDI devices.
The idea is that a MIDI keyboard plugged into USB would trigger the same `attack`/`release`
calls that mouse and keyboard input use.

Research starting points:
- `navigator.requestMIDIAccess()` returns a promise — needs to be called after a user gesture
- MIDI note numbers: middle C = 60, each semitone = +1. Convert to Tone.js note string with
  `Tone.Frequency(midiNote, "midi").toNote()`
- `MIDIMessageEvent.data` is a `Uint8Array`: `[status, note, velocity]`
  - status `144` = note on, `128` = note off
- Velocity (0–127) could map to volume or just be ignored for now
- Browser support is good on Chrome/Edge, limited on Safari/Firefox

Rough implementation sketch:
```ts
const midi = await navigator.requestMIDIAccess();
midi.inputs.forEach((input) => {
  input.onmidimessage = (e) => {
    const [status, note, velocity] = e.data;
    const noteName = Tone.Frequency(note, "midi").toNote();
    if (status === 144 && velocity > 0) attack(noteName);
    if (status === 128 || (status === 144 && velocity === 0)) release(noteName);
  };
});
```
