import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MidiPad from "../index";

describe("MidiPad", () => {
  it("renders the label when provided", () => {
    render(<MidiPad label="Kick" />);
    expect(screen.getByText("Kick")).toBeInTheDocument();
  });

  it("renders without label by default", () => {
    const { container } = render(<MidiPad />);
    expect(container.querySelector("span")).toBeNull();
  });

  it("calls onPress on mousedown", () => {
    const onPress = vi.fn();
    const { container } = render(<MidiPad onPress={onPress} />);
    const pad = container.firstChild as HTMLElement;
    fireEvent.mouseDown(pad);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("calls onRelease on mouseup", () => {
    const onRelease = vi.fn();
    const { container } = render(<MidiPad onRelease={onRelease} />);
    const pad = container.firstChild as HTMLElement;
    fireEvent.mouseDown(pad);
    fireEvent.mouseUp(pad);
    expect(onRelease).toHaveBeenCalledTimes(1);
  });

  it("calls onRelease when mouse leaves while pressed", () => {
    const onRelease = vi.fn();
    const { container } = render(<MidiPad onRelease={onRelease} />);
    const pad = container.firstChild as HTMLElement;
    fireEvent.mouseDown(pad);
    fireEvent.mouseLeave(pad);
    expect(onRelease).toHaveBeenCalledTimes(1);
  });

  it("does not call onRelease on mouseLeave when not pressed", () => {
    const onRelease = vi.fn();
    const { container } = render(<MidiPad onRelease={onRelease} />);
    const pad = container.firstChild as HTMLElement;
    fireEvent.mouseLeave(pad);
    expect(onRelease).not.toHaveBeenCalled();
  });
});
