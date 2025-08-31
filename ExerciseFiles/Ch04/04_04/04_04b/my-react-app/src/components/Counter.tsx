import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import useCounter from "../hooks/useCounter";
import { analytics } from "../services/analytics";

// Counter component that uses the useCounter hook and accepts initialValue as a prop
interface CounterProps {
  initialValue?: number;
}

const LOCAL_STORAGE_KEY = "counter-state";

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
}) => {
  // Restore count from localStorage if available
  let restoredValue = initialValue;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === "number" && !isNaN(parsed)) {
        restoredValue = parsed;
      }
    }
  } catch (e) {
    console.error(
      "Failed to read counter from localStorage",
      e
    );
  }
  const [count, setCount] = useState(restoredValue);
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  // Custom reset to also update localStorage and countHistory
  const reset = () => {
    try {
      setCount(initialValue);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(initialValue)
      );
      setCountHistory([initialValue]);
    } catch (e) {
      console.error("Error resetting counter:", e);
    }
  };

  // Counter name state
  const [counterName, setCounterName] = useState("");
  const [inputValue, setInputValue] = useState("");

  // --- Add count history state ---
  const [countHistory, setCountHistory] = useState<
    number[]
  >([restoredValue]);

  // Track if first render to avoid saving initial value immediately
  const isFirstRender = useRef(true);

  // Log count changes, update history, and persist to localStorage
  useEffect(() => {
    try {
      if (!isFirstRender.current) {
        analytics.trackEvent("count_changed", { count });
        setCountHistory((prev) => [...prev, count]);
      } else {
        isFirstRender.current = false;
      }
      // Save to localStorage
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(count)
      );
    } catch (error) {
      console.error(
        "Error in count effect or saving to localStorage:",
        error
      );
    }
    // eslint-disable-next-line
  }, [count]);

  // Add keyboard event handling for arrow keys and spacebar to control the Counter component
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowRight":
      case " ":
        event.preventDefault();
        increment();
        break;
      case "ArrowDown":
      case "ArrowLeft":
        event.preventDefault();
        decrement();
        break;
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [increment, decrement]);

  // Handle form submission for counter name
  const handleNameSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCounterName(inputValue);
  };

  return (
    <div>
      <form
        data-testid="name-form"
        onSubmit={handleNameSubmit}
      >
        <label htmlFor="counter-name-input">
          Counter Name:
        </label>
        <input
          id="counter-name-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Set Name</button>
      </form>
      {counterName && <h2>Counter Name: {counterName}</h2>}
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
      {/* --- Render count history --- */}
      <div>
        <h3>Count History:</h3>
        <ul>
          {countHistory.map((c, i) => (
            <li
              key={`history-${i}`}
              data-testid="count-history-item"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Counter;
