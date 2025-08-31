import { renderHook, act } from "@testing-library/react";
import useCounter from "./useCounter";

// Test that the useCounter hook starts with initial value and provides increment/decrement functionality

describe("useCounter", () => {
  it("should initialize with the given initial value", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("should increment the count", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it("should decrement the count", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(-1);
  });

  it("should handle multiple increments and decrements", () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.decrement();
    });
    expect(result.current.count).toBe(11);
  });

  //Test that usCounter persists count to localStorage
  it("should persist count to localStorage", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.increment();
    });
    expect(localStorage.getItem("count")).toBe("1");
  });
});
