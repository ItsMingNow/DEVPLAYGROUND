import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { describe, it, expect } from "vitest";
import { Board, BoardItem, BoardContext } from "../index";

describe("Board", () => {
  it("renders children", () => {
    render(
      <Board columns={2} rows={2}>
        <div>hello</div>
      </Board>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("sets BoardContext to true for children", () => {
    let contextValue = false;
    function Consumer() {
      contextValue = useContext(BoardContext);
      return null;
    }
    render(
      <Board columns={1} rows={1}>
        <Consumer />
      </Board>
    );
    expect(contextValue).toBe(true);
  });

  it("renders the correct number of slot divs (columns × rows)", () => {
    const { container } = render(<Board columns={3} rows={2} />);
    // Each slot has gridColumn/gridRow style set inline
    const slots = container.querySelectorAll("[style*='grid-column']");
    expect(slots).toHaveLength(6);
  });
});

describe("BoardItem", () => {
  it("renders children at the specified grid position", () => {
    const { container } = render(
      <Board columns={4} rows={4}>
        <BoardItem col={2} row={3}>
          <span>item</span>
        </BoardItem>
      </Board>
    );
    const item = screen.getByText("item").closest("[style*='grid-column: 2']");
    expect(item).toBeInTheDocument();
  });
});
