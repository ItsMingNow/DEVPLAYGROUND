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
  }
];
