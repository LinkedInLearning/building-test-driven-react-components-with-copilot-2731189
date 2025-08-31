import { render, screen } from "@testing-library/react";
import Button, { isLoading } from "./Button";

// Test that the button renders with correct text
test("renders button with correct text", () => {
  render(<Button text="Click Me" onClick={() => {}} />);
  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();
});

// Test that the Button shows a loading spinner when isLoading is true
test("shows loading spinner when isLoading is true", () => {
  render(<Button text="Submit" onClick={() => {}} isLoading={true} />);
  const spinnerElement = screen.getByTestId("loading-spinner");
  expect(spinnerElement).toBeInTheDocument();
});

// Test accessibility: ensure LoginForm has proper ARIA attributes
test("button has proper ARIA attributes when loading", () => {
  render(<Button text="Submit" onClick={() => {}} isLoading={true} />);
  const buttonElement = screen.getByRole("button");
  expect(buttonElement).toHaveAttribute("aria-busy", "true");
}