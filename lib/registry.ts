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
