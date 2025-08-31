// Custom hook for counter with initial value, increment, and decrement functionality
import { useState } from "react";
const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = () =>
    setCount((prevCount) => prevCount + 1);
  const decrement = () =>
    setCount((prevCount) => prevCount - 1);

  return { count, increment, decrement };
};
export default useCounter;
