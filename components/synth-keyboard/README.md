# Synth Keyboard

One octave of playable keys wired to Tone.js synthesis. Supports mouse clicks and keyboard input (`awsedftgyhuj` maps chromatically from C).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `volume` | `number` | `70` | 0–100. Mapped internally to −40dB–0dB. 0 = true silence. |
| `octave` | `number` | `4` | 1–7. Middle C is octave 4. |
| `soundSelection` | `SoundType` | `"Synth"` | Which synth voice to use. See options below. |

### Sound options

| Value | Character |
|---|---|
| `"Synth"` | Warm triangle wave |
| `"AM"` | Metallic, bell-like |
| `"FM"` | Bright, electric piano |
| `"Duo"` | Thick, slightly chorused |
| `"Mono"` | Buzzy sawtooth lead |

## Keyboard mapping

```
Key:  a  w  s  e  d  f  t  g  y  h  u  j
Note: C  C# D  D# E  F  F# G  G# A  A# B
```

---

## Challenges & how they were solved

### 1. Black key `:active` not firing on the full key area

**Problem:** The original black key was built with three nested divs (cover → slot → key). The `:active` CSS pseudo-class was on the innermost div, so clicking the top portion of the key — which only had the cover div — didn't trigger the animation.

**Fix:** Scrapped the layered approach entirely. Black keys now use `box-shadow: 0 5px 0 #111` for depth, exactly like white keys. On press: `translateY(5px)` + `box-shadow: none`. No nested divs needed.

---

### 2. Octave stale closure in keyboard listeners

**Problem:** Keyboard event listeners were registered once in a `useEffect` with empty `[]` deps. This means they captured the initial value of `octave` (4) and never saw changes. Dragging the octave slider had no effect on keyboard-triggered notes, even though mouse clicks worked fine (inline JSX handlers are always fresh).

**Fix:** Store `octave` in a `useRef` alongside the state. The listeners read `octaveRef.current` instead of `octave`, so they always get the latest value without needing to re-register.

---

### 3. Old note sustaining when octave changed mid-hold

**Problem:** If you held a note and moved the octave slider, the note kept playing. The `release` call looked up `noteFreq(octaveRef.current)[note]`, but by that point `octaveRef.current` was already the new octave — so the release signal was sent to the wrong frequency and the old note never stopped.

**Fix:** In the octave `useEffect`, release all held notes using the old octave *before* updating `octaveRef.current`. Order matters: release first, then update the ref.

---

### 4. `InvalidAccessError` when switching sounds rapidly

**Problem:** Switching the synth type disposes the old synth and creates a new one. With a single `useEffect`, the React cleanup function ran before the next effect — meaning it disposed the brand-new synth that was just created. At normal speed this was fine, but rapid switching caused the Web Audio API to throw `InvalidAccessError` because nodes were being torn down mid-processing.

**Two sub-problems discovered:**

1. **Disposing too fast:** Calling `.dispose()` while the audio context was still processing the synth's last output caused the error. Fixed by giving the old synth 300ms before disposing via `setTimeout`.

2. **Cleanup disposing the wrong synth:** Even with the delay, rapid changes meant React's cleanup function for effect N was disposing `synth.current`, which by then had already been replaced by effect N+1's newly created synth. The wrong synth was being killed.

**Fix:** Split the lifecycle into two separate effects:
- One effect with `[]` deps handles unmount-only cleanup — it disposes `synth.current` when the component leaves the page.
- One effect with `[soundSelection]` deps handles recreation — it stores the old synth in a local `prev` variable, immediately assigns the new synth to `synth.current`, then schedules `prev.dispose()` after 300ms.

Because `prev` is a local variable captured at creation time, each timeout disposes exactly the right synth regardless of how many times the sound changes in quick succession.
