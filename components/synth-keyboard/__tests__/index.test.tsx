import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SynthKeyboard from "../index";

// Mock the entire Tone.js library so tests don't touch Web Audio.
// We only care that the component wires events to the right synth methods.
vi.mock("tone", () => {
  const mockSynth = {
    volume: { value: 0 },
    triggerAttack: vi.fn(),
    triggerRelease: vi.fn(),
    releaseAll: vi.fn(),
    dispose: vi.fn(),
    toDestination: vi.fn(function (this: unknown) { return this; }),
  };
  const PolySynth = vi.fn(() => mockSynth);
  // Expose the mock instance so tests can inspect calls
  (PolySynth as any).__mock = mockSynth;

  return {
    start: vi.fn().mockResolvedValue(undefined),
    PolySynth,
    Synth: vi.fn(),
    AMSynth: vi.fn(),
    FMSynth: vi.fn(),
    DuoSynth: vi.fn(),
    MonoSynth: vi.fn(),
  };
});

describe("SynthKeyboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 7 white keys", () => {
    const { container } = render(<SynthKeyboard />);
    const whiteKeys = container.querySelectorAll("[class*='whiteKey']");
    expect(whiteKeys).toHaveLength(7);
  });

  it("renders 5 black keys", () => {
    const { container } = render(<SynthKeyboard />);
    const blackKeys = container.querySelectorAll("[class*='blackKey']");
    expect(blackKeys).toHaveLength(5);
  });

  it("adds pressed class on mousedown and removes on mouseup", async () => {
    const { container } = render(<SynthKeyboard />);
    const [firstWhite] = container.querySelectorAll("[class*='whiteKey']");
    fireEvent.mouseDown(firstWhite);
    // attack() is async (awaits Tone.start), so the pressed class appears on next tick
    await waitFor(() => expect(firstWhite.className).toMatch(/whiteKeyPressed/));
    fireEvent.mouseUp(firstWhite);
    expect(firstWhite.className).not.toMatch(/whiteKeyPressed/);
  });
});
