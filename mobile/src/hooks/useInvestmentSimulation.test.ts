/** @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useInvestmentSimulation } from "./useInvestmentSimulation";

describe("useInvestmentSimulation", () => {
  it("starts with no yearly reports", () => {
    const { result } = renderHook(() => useInvestmentSimulation());
    expect(result.current.yearlyReports).toEqual([]);
    expect(result.current.isResultEmpty).toBe(true);
  });

  it("does not populate reports until calculate is called", () => {
    const { result } = renderHook(() => useInvestmentSimulation());

    act(() => {
      result.current.setPrincipalText("1000");
      result.current.setAnnualRateText("10");
      result.current.setYearsText("2");
    });

    expect(result.current.yearlyReports).toEqual([]);

    act(() => {
      result.current.calculate();
    });

    expect(result.current.yearlyReports).toHaveLength(2);
    expect(result.current.isResultEmpty).toBe(false);
  });

  it("sanitizes non-numeric characters in field setters", () => {
    const { result } = renderHook(() => useInvestmentSimulation());

    act(() => {
      result.current.setPrincipalText("12a3.4x");
    });

    expect(result.current.principalText).toBe("123.4");
  });

  it("clears reports when calculate cannot parse all fields", () => {
    const { result } = renderHook(() => useInvestmentSimulation());

    act(() => {
      result.current.setPrincipalText("100");
      result.current.setAnnualRateText("5");
      result.current.setYearsText("1");
      result.current.calculate();
    });

    expect(result.current.yearlyReports).toHaveLength(1);

    act(() => {
      result.current.setYearsText("");
      result.current.calculate();
    });

    expect(result.current.yearlyReports).toEqual([]);
    expect(result.current.isResultEmpty).toBe(true);
  });
});
