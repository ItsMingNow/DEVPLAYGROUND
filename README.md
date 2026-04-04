# DevPlayGround

A personal playground for UI experiments and component ideas.

## Stack

- **Next.js 13** (App Router)
- **React 18**
- **TypeScript**
- **CSS Modules**
- **Tailwind CSS**
- **Tone.js** (audio synthesis)

## Structure

Each component lives in `components/{name}/` and is registered in `lib/registry.ts`. Adding a new entry there is all it takes to get a gallery card and demo page.

---

## Module System — Grid Sizing

Some components are part of a modular grid system designed to snap together like a hardware mixing board. All module components are sized to fit into exact multiples of the base cell unit.

### Base unit

| Property | Value |
|----------|-------|
| Cell size | 64 × 64px |
| Gap between cells | 8px |
| Board default | 10 columns × 5 rows |

### Component sizes

| Component | Grid size | Pixels (w × h) |
|-----------|-----------|----------------|
| Knob | 1 × 1 | 64 × 64px |
| Fader | 1 × 2 | 64 × 136px |
| MPC Pad *(planned)* | 1 × 1 | 64 × 64px |

### How placement works

Wrap any module in a `BoardItem` inside a `Board`:

```tsx
import { Board, BoardItem } from "@/components/board";
import Fader from "@/components/fader";
import Knob from "@/components/knob";

<Board columns={10} rows={5}>
  {/* Fader spans 2 rows */}
  <BoardItem col={1} row={1} rowSpan={2}>
    <Fader value={vol} min={0} max={100} onChange={setVol} label="Vol" unit="%" />
  </BoardItem>

  {/* Knob sits in a single cell */}
  <BoardItem col={2} row={1}>
    <Knob min={0} max={100} value={pan} onChange={setPan} label="Pan" />
  </BoardItem>
</Board>
```

### Rules for new module components

1. **Width must be a multiple of 64px** — a 1-wide module is exactly 64px wide
2. **Height must fit `n × 64 + (n-1) × 8`** — a 2-tall module is `64 + 8 + 64 = 136px`
3. **Use `width: 100%; height: 100%`** so the module fills whatever BoardItem it's placed in
4. **Label at top, value at bottom** — consistent across all module components
5. **Agnostic props** — `value`, `min`, `max`, `onChange`, `label`, `unit` — the module does not know what it controls

---

Nice to meet you — feel free to reach out.
