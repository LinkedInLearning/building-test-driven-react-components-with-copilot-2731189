import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import useCounter from "../hooks/useCounter";
import { analytics } from "../services/analytics";

// Counter component that uses the useCounter hook and accepts initialValue as a prop
interface CounterProps {
  initialValue?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
}) => {
  const { count, increment, decrement, reset } =
    useCounter(initialValue);

  // Counter name state
  const [counterName, setCounterName] = useState("");
  const [inputValue, setInputValue] = useState("");

  // --- Add count history state ---
  const [countHistory, setCountHistory] = useState<
    number[]
  >([initialValue]);

  // Log count changes to the console and update history
  useEffect(() => {
    try {
      if (count !== initialValue) {
        analytics.trackEvent("count_changed", { count });
      }
      console.log(`Count changed: ${count}`);
      setCountHistory((prev) => [...prev, count]);
    } catch (error) {
      console.error("Error in count effect:", error);
    }
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
