import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Knob from "../index";

const OPTIONS = ["Low", "Med", "High"] as const;

describe("Knob", () => {
  it("renders the label", () => {
    render(<Knob options={OPTIONS} value={0} onChange={() => {}} label="Speed" />);
    expect(screen.getByText("Speed")).toBeInTheDocument();
  });

  it("renders the current option value", () => {
    render(<Knob options={OPTIONS} value={1} onChange={() => {}} />);
    expect(screen.getByText("Med")).toBeInTheDocument();
  });

  it("renders no label when omitted", () => {
    const { container } = render(<Knob options={OPTIONS} value={0} onChange={() => {}} />);
    // Only the value span should be present, no label span
    expect(container.querySelectorAll("span")).toHaveLength(1);
  });

  it("calls onChange on mousedown drag", async () => {
    const onChange = vi.fn();
    render(<Knob options={OPTIONS} value={1} onChange={onChange} label="Speed" />);
    const knob = screen.getByText("Med").closest(".knobWrapper")!.querySelector(".knob")!;

    // Simulate a drag: mousedown on the knob, then move up 30px on the window
    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: knob, coords: { clientY: 100 } },
    ]);
    window.dispatchEvent(new MouseEvent("mousemove", { clientY: 70, bubbles: true }));
    window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

    expect(onChange).toHaveBeenCalled();
  });
});
