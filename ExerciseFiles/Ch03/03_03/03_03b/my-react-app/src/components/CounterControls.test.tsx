import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { vi } from "vitest";
import CounterControls from "./CounterControls";

// Test CounterControls component manages step size state and calls onChange when the step changes
describe("CounterControls", () => {
  test("renders step input and calls onChange when step changes", () => {
    const handleChange = vi.fn();
    render(
      <CounterControls step={1} onChange={handleChange} />
    );

    const stepInput = screen.getByLabelText(
      /Step:/i
    ) as HTMLInputElement;
    expect(stepInput.value).toBe("1");

    // Simulate changing the step input
    fireEvent.change(stepInput, { target: { value: "5" } });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  test("does not call onChange for invalid (non-numeric) input", () => {
    const handleChange = vi.fn();
    render(
      <CounterControls step={2} onChange={handleChange} />
    );
    const stepInput = screen.getByLabelText(
      /Step:/i
    ) as HTMLInputElement;

    fireEvent.change(stepInput, {
      target: { value: "abc" },
    });
    expect(handleChange).not.toHaveBeenCalled();
    expect(stepInput.value).toBe("2");
  });

  test("does not call onChange for zero or negative values", () => {
    const handleChange = vi.fn();
    render(
      <CounterControls step={3} onChange={handleChange} />
    );
    const stepInput = screen.getByLabelText(
      /Step:/i
    ) as HTMLInputElement;

    fireEvent.change(stepInput, { target: { value: "0" } });
    fireEvent.change(stepInput, {
      target: { value: "-2" },
    });
    expect(handleChange).not.toHaveBeenCalled();
    expect(stepInput.value).toBe("3");
  });

  test("input reflects prop value on initial render", () => {
    render(
      <CounterControls step={7} onChange={() => {}} />
    );
    const stepInput = screen.getByLabelText(
      /Step:/i
    ) as HTMLInputElement;
    expect(stepInput.value).toBe("7");
  });

  // test CounterControls with multiple settings: step size, min/max limits, and reset functionality
  test("handles multiple settings correctly", () => {
    const handleChange = vi.fn();
    render(
      <CounterControls step={10} onChange={handleChange} />
    );
    const stepInput = screen.getByLabelText(
      /Step:/i
    ) as HTMLInputElement;

    // Change to a valid step size
    fireEvent.change(stepInput, {
      target: { value: "15" },
    });
    expect(handleChange).toHaveBeenCalledWith(15);
    expect(stepInput.value).toBe("15");

    // Change to an invalid (negative) step size
    fireEvent.change(stepInput, {
      target: { value: "-5" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1); // No new calls
    expect(stepInput.value).toBe("15"); // Value remains unchanged

    // Change to another valid step size
    fireEvent.change(stepInput, {
      target: { value: "20" },
    });
    expect(handleChange).toHaveBeenCalledWith(20);
    expect(stepInput.value).toBe("20");
  });
});
