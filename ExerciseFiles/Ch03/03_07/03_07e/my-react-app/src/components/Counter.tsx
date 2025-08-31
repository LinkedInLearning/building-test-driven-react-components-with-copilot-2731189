1. Reset the counter to its initial value when clicked
2. Track analytics when reset is used (just like increment / decrement)
3. Works with a keyboard shortcut (pressing "r" key)
4. Comprehensive tests 

import { useEffect } from "react";
import useCounter from "../hooks/useCounter";
import { analytics } from "../services/analytics";

// Counter component that uses the useCounter hook and accepts initialValue as a prop
interface CounterProps {
  initialValue?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
}) => {
  const { count, increment, decrement } =
    useCounter(initialValue);

  // Log count changes to the console
  useEffect(() => {
    if (count !== initialValue) {
      analytics.trackEvent("count_changed", { count });
    }
    console.log(`Count changed: ${count}`);
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

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
