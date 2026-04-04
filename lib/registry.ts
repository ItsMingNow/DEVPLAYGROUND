export type ComponentMeta = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  sample?: boolean;
};

export const registry: ComponentMeta[] = [
  {
    slug: "button-ripple",
    name: "Button Ripple",
    description: "A button that spawns an expanding ripple on click using pure CSS keyframes.",
    tags: ["css", "interaction", "button"],
    sample: true,
  },
  {
    slug: "3d-button",
    name: "3d Button",
    description: "A button that pushed inward or outward.",
    tags: ["css", "interaction", "button"],
    sample: false
  },
  {
    slug: "fader",
    name: "Fader",
    description: "A vertical fader with agnostic min/max/value props. Fits a 1×2 board slot.",
    tags: ["input", "interaction", "module-system"],
  },
  {
    slug: "board",
    name: "Board",
    description: "A fixed-cell grid container for arranging modules. 8×4 default, 64px cells, 8px gaps.",
    tags: ["layout", "grid", "module-system"],
  },
  {
    slug: "knob",
    name: "Knob",
    description: "A rotary knob that selects between options by clicking and dragging up or down.",
    tags: ["css", "interaction", "input"],
  },
  {
    slug: "synth-keyboard",
    name: "Synth Keyboard",
    description: "One octave of keys wired to Tone.js synthesis. Playable by mouse or keyboard.",
    tags: ["css", "interaction", "music", "audio"],
  },
];
