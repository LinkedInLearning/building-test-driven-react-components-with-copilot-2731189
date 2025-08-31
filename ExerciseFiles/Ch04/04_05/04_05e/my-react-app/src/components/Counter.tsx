import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  FormEvent,
} from "react";
import { analytics } from "../services/analytics";

// Counter component that uses the useCounter hook and accepts initialValue as a prop
export interface CounterProps {
  initialValue?: number;
}

const LOCAL_STORAGE_KEY = "counter-state";

const Counter: React.FC<CounterProps> = React.memo(
  ({ initialValue = 0 }) => {
    // Restore count from localStorage if available
    // Restore count from localStorage if available
    const getRestoredValue = useCallback((): number => {
      try {
        const stored = localStorage.getItem(
          LOCAL_STORAGE_KEY
        );
        if (stored) {
          const parsed = JSON.parse(stored);
          if (
            typeof parsed === "number" &&
            !isNaN(parsed)
          ) {
            return parsed;
          }
        }
      } catch (e) {
        console.error(
          "Failed to read counter from localStorage",
          e
        );
      }
      return initialValue;
    }, [initialValue]);

    const [count, setCount] = useState<number>(
      getRestoredValue
    );
    const [counterName, setCounterName] =
      useState<string>("");
    const [inputValue, setInputValue] =
      useState<string>("");
    const [countHistory, setCountHistory] = useState<
      number[]
    >([getRestoredValue()]);
    const isFirstRender = useRef<boolean>(true);

    // Memoized increment/decrement/reset for performance
    const increment = useCallback(
      (): void => setCount((prev) => prev + 1),
      []
    );
    const decrement = useCallback(
      (): void => setCount((prev) => prev - 1),
      []
    );
    const reset = useCallback((): void => {
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
    }, [initialValue]);

    // Log count changes, update history, and persist to localStorage
    useEffect(() => {
      try {
        if (!isFirstRender.current) {
          analytics.trackEvent("count_changed", { count });
          setCountHistory((prev) => [...prev, count]);
        } else {
          isFirstRender.current = false;
        }
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

    // Keyboard navigation: handle keys only when focused on the counter region
    const counterRegionRef = useRef<HTMLDivElement>(null);
    const handleKeyDown = useCallback(
      (event: ReactKeyboardEvent<HTMLDivElement>): void => {
        switch (event.key) {
          case "ArrowUp":
          case "ArrowRight":
          case " ":
          case "Spacebar":
            event.preventDefault();
            increment();
            break;
          case "ArrowDown":
          case "ArrowLeft":
            event.preventDefault();
            decrement();
            break;
          case "Home":
            event.preventDefault();
            reset();
            break;
          default:
            break;
        }
      },
      [increment, decrement, reset]
    );

    // Handle form submission for counter name
    const handleNameSubmit = useCallback(
      (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setCounterName(inputValue);
      },
      [inputValue]
    );

    return (
      <div
        ref={counterRegionRef}
        role="region"
        aria-label={
          counterName
            ? `Counter: ${counterName}`
            : "Counter"
        }
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{ outline: "none" }}
        data-testid="counter-region"
      >
        <form
          data-testid="name-form"
          onSubmit={handleNameSubmit}
          aria-label="Set counter name"
        >
          <label htmlFor="counter-name-input">
            Counter Name:
          </label>
          <input
            id="counter-name-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="Counter name input"
          />
          <button
            type="submit"
            aria-label="Set counter name"
          >
            Set Name
          </button>
        </form>
        {counterName && (
          <h2 aria-live="polite">
            Counter Name: {counterName}
          </h2>
        )}
        <h1 aria-live="polite" aria-atomic="true">
          Count: {count}
        </h1>
        <div role="group" aria-label="Counter controls">
          <button
            onClick={increment}
            aria-label="Increment count"
          >
            Increment
          </button>
          <button
            onClick={decrement}
            aria-label="Decrement count"
          >
            Decrement
          </button>
          <button onClick={reset} aria-label="Reset count">
            Reset Counter
          </button>
        </div>
        {/* --- Render count history --- */}
        <div>
          <h3>Count History:</h3>
          <ul aria-label="Count history list">
            {countHistory.map((c, i) => (
              <li
                key={`history-${i}`}
                data-testid="count-history-item"
                aria-label={`History item ${i + 1}: ${c}`}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "#666",
          }}
        >
          <p>
            Keyboard: Arrow keys/Space to change, Home to
            reset the counter. Focus this region to use
            keys.
          </p>
        </div>
      </div>
    );
  }
);

export default Counter;
