// Custom hook for counter with initial value, increment, and decrement functionality

// Add localStorage persistence to save the count when it changes

import { useState, useEffect } from "react";
const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count]);

  const increment = () =>
    setCount((prevCount) => prevCount + 1);
  const decrement = () =>
    setCount((prevCount) => prevCount - 1);

  return { count, increment, decrement };
};
export default useCounter;
