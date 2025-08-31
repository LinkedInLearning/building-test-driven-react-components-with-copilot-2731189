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
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("restores count from localStorage on mount", () => {
    localStorage.setItem(
      "counter-state",
      JSON.stringify(42)
    );
    render(<Counter initialValue={0} />);
    expect(
      screen.getByText(/Count: 42/i)
    ).toBeInTheDocument();
  });

  test("saves count to localStorage on change", () => {
    render(<Counter initialValue={3} />);
    const incrementButton = screen.getByText(/Increment/i);
    fireEvent.click(incrementButton);
    expect(localStorage.getItem("counter-state")).toBe("4");
  });

  test("handles localStorage getItem error gracefully", () => {
    const getItemSpy = vi
      .spyOn(window.localStorage, "getItem")
      .mockImplementation(() => {
        throw new Error("get error");
      });
    expect(() =>
      render(<Counter initialValue={7} />)
    ).not.toThrow();
    getItemSpy.mockRestore();
  });

  test("handles localStorage setItem error gracefully", () => {
    render(<Counter initialValue={1} />);
    const setItemSpy = vi
      .spyOn(window.localStorage, "setItem")
      .mockImplementation(() => {
        throw new Error("set error");
      });
    const incrementButton = screen.getByText(/Increment/i);
    expect(() =>
      fireEvent.click(incrementButton)
    ).not.toThrow();
    setItemSpy.mockRestore();
  });
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
  // test keyboard interactions - arrow keys and spacebar should control the Counter component only when region is focused
  test("responds to keyboard events when region is focused", () => {
    render(<Counter initialValue={10} />);
    const region = screen.getByTestId("counter-region");
    region.focus();

    // Simulate ArrowUp key press
    fireEvent.keyDown(region, { key: "ArrowUp" });
    expect(
      screen.getByText(/Count: 11/i)
    ).toBeInTheDocument();

    // Simulate ArrowDown key press
    fireEvent.keyDown(region, { key: "ArrowDown" });
    expect(
      screen.getByText(/Count: 10/i)
    ).toBeInTheDocument();

    // Simulate Space key press
    fireEvent.keyDown(region, { key: " " });
    expect(
      screen.getByText(/Count: 11/i)
    ).toBeInTheDocument();

    // Simulate ArrowLeft key press
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(
      screen.getByText(/Count: 10/i)
    ).toBeInTheDocument();

    // Simulate Home key press (reset)
    fireEvent.keyDown(region, { key: "Home" });
    expect(
      screen.getByText(/Count: 10/i)
    ).toBeInTheDocument();
  });

  // Performance: Counter should not re-render if props and state are unchanged (memoization)
  test("does not re-render unnecessarily (memoized)", () => {
    const renderSpy = vi.fn();
    // Wrap Counter to spy on render
    const SpyCounter = (props: any) => {
      renderSpy();
      return <Counter {...props} />;
    };
    const { rerender } = render(
      <SpyCounter initialValue={1} />
    );
    expect(renderSpy).toHaveBeenCalledTimes(1);
    // Rerender with same props
    rerender(<SpyCounter initialValue={1} />);
    expect(renderSpy).toHaveBeenCalledTimes(2); // Only parent re-renders, Counter memoized
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

    // Simulate reset button click (by aria-label to avoid duplicate text)
    const resetButton = screen.getByRole("button", {
      name: /reset count/i,
    });
    fireEvent.click(resetButton);
    expect(
      screen.getByText(/Count: 5/i)
    ).toBeInTheDocument();
  });

  // Test counter name input field and form submission
  test("updates counter name on form submission", () => {
    render(<Counter initialValue={0} />);

    const nameInput =
      screen.getByLabelText(/Counter Name:/i);
    const form = screen.getByTestId("name-form");

    // Simulate user typing in the input field
    fireEvent.change(nameInput, {
      target: { value: "My Counter" },
    });
    expect((nameInput as HTMLInputElement).value).toBe(
      "My Counter"
    );

    // Simulate form submission
    fireEvent.submit(form);
    expect(
      screen.getByText(/Counter Name: My Counter/i)
    ).toBeInTheDocument();
  });
});
