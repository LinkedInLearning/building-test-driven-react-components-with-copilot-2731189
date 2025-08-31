import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import Counter from "./Counter";

// Test that the Counter component renders with initial count and responds to a button clicks
test("renders Counter component and responds to button clicks", () => {
  render(<Counter initialValue={5} />);

  // Check initial count
  const countElement = screen.getByText(/Count: 5/i);
  expect(countElement).toBeInTheDocument();

  // Simulate increment button click
  const incrementButton = screen.getByText(/Increment/i);
  fireEvent.click(incrementButton);
  expect(screen.getByText(/Count: 6/i)).toBeInTheDocument();

  // Simulate decrement button click
  const decrementButton = screen.getByText(/Decrement/i);
  fireEvent.click(decrementButton);
  expect(screen.getByText(/Count: 5/i)).toBeInTheDocument();
});
