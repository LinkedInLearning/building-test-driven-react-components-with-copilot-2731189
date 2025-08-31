import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import Counter from "./Counter";
import { vi } from "vitest";

// Mock the analytics service with vitest, on the analytics object with trackEvent
vi.mock("../services/analytics", () => ({
  analytics: {
    trackEvent: vi.fn(),
  },
}));

import { analytics } from "../services/analytics";

// Wrap tests in describe block for better organization
describe("Counter Component", () => {
  // Test that the analytics.trackEvent is called on increment and decrement
  test("calls analytics.trackEvent on increment", () => {
    render(<Counter initialValue={0} />);

    const incrementButton = screen.getByText(/Increment/i);

    // Simulate increment button click
    fireEvent.click(incrementButton);
    expect(analytics.trackEvent).toHaveBeenCalledWith(
      "count_changed",
      { count: 1 }
    );
  });
  test("renders Counter component and responds to button clicks", () => {
    render(<Counter initialValue={5} />);

    // Check initial count
    const countElement = screen.getByText(/Count: 5/i);
    expect(countElement).toBeInTheDocument();

    // Simulate increment button click
    const incrementButton = screen.getByText(/Increment/i);
    fireEvent.click(incrementButton);
    expect(
      screen.getByText(/Count: 6/i)
    ).toBeInTheDocument();

    // Simulate decrement button click
    const decrementButton = screen.getByText(/Decrement/i);
    fireEvent.click(decrementButton);
    expect(
      screen.getByText(/Count: 5/i)
    ).toBeInTheDocument();
  });
  // test keyboard interactions - arrow keys and plus minus should control the Counter component
  test("responds to keyboard events", () => {
    render(<Counter initialValue={10} />);

    // Simulate ArrowUp key press
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(
      screen.getByText(/Count: 11/i)
    ).toBeInTheDocument();

    // Simulate ArrowDown key press
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(
      screen.getByText(/Count: 10/i)
    ).toBeInTheDocument();

    // Simulate Space key press
    fireEvent.keyDown(window, { key: " " });
    expect(
      screen.getByText(/Count: 11/i)
    ).toBeInTheDocument();

    // Simulate ArrowLeft key press
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(
      screen.getByText(/Count: 10/i)
    ).toBeInTheDocument();
  });

  // Test that the reset function returns count to initial initialValue
  test("resets count to initial value", () => {
    render(<Counter initialValue={5} />);

    // Simulate increment button click
    const incrementButton = screen.getByText(/Increment/i);
    fireEvent.click(incrementButton);
    expect(
      screen.getByText(/Count: 6/i)
    ).toBeInTheDocument();

    // Simulate reset button click
    const resetButton = screen.getByText(/Reset/i);
    fireEvent.click(resetButton);
    expect(
      screen.getByText(/Count: 5/i)
    ).toBeInTheDocument();
  });
});
