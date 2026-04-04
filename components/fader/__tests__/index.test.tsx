import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Fader, { FaderGroup } from "../index";

describe("Fader", () => {
  it("renders the label", () => {
    render(<Fader value={50} min={0} max={100} onChange={() => {}} label="Vol" />);
    expect(screen.getByText("Vol")).toBeInTheDocument();
  });

  it("renders the rounded value with unit", () => {
    render(<Fader value={75.7} min={0} max={100} onChange={() => {}} unit="%" />);
    expect(screen.getByText("76%")).toBeInTheDocument();
  });

  it("renders value without unit when omitted", () => {
    render(<Fader value={42} min={0} max={100} onChange={() => {}} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("calls onChange when the thumb is dragged", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Fader value={50} min={0} max={100} onChange={onChange} />
    );
    const thumb = container.querySelector(".thumb")!;

    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: thumb, coords: { clientY: 100 } },
    ]);
    window.dispatchEvent(new MouseEvent("mousemove", { clientY: 70, bubbles: true }));
    window.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

    expect(onChange).toHaveBeenCalled();
  });
});

describe("FaderGroup", () => {
  it("renders all child Faders", () => {
    render(
      <FaderGroup>
        <Fader value={10} min={0} max={100} onChange={() => {}} label="A" />
        <Fader value={20} min={0} max={100} onChange={() => {}} label="B" />
        <Fader value={30} min={0} max={100} onChange={() => {}} label="C" />
      </FaderGroup>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });
});
