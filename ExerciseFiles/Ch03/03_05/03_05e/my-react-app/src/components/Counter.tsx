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

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
