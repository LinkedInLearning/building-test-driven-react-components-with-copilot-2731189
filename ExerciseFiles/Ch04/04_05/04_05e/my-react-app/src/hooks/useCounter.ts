// Custom hook for counter with initial value, increment, and decrement functionality

import { useState, useEffect } from "react";

const useCounter = (initialValue: number = 0) => {
  const getInitial = () => {
    const stored = localStorage.getItem("count");
    return stored !== null ? Number(stored) : initialValue;
  };
  const [count, setCount] = useState(getInitial);

  useEffect(() => {
    localStorage.setItem("count", String(count));
  }, [count]);

  const increment = () =>
    setCount((prevCount) => prevCount + 1);
  const decrement = () =>
    setCount((prevCount) => prevCount - 1);
  // Reset to initialValue
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
};
export default useCounter;
