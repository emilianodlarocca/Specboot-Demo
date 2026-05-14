import { describe, expect, it } from "vitest";
import {
  computeYearlyReports,
  parsePositiveNumber,
  sanitizeNumericText,
} from "./investmentSimulator";

describe("computeYearlyReports", () => {
  it("returns an empty list when years is 0", () => {
    expect(
      computeYearlyReports({ principal: 1000, annualRate: 5, years: 0 }),
    ).toEqual([]);
  });

  it("returns an empty list when years is negative", () => {
    expect(
      computeYearlyReports({ principal: 1000, annualRate: 5, years: -1 }),
    ).toEqual([]);
  });

  it("matches A = P(1 + r)^t for a 3-year example at 10%", () => {
    const reports = computeYearlyReports({
      principal: 1000,
      annualRate: 10,
      years: 3,
    });

    expect(reports).toHaveLength(3);

    const r = 0.1;
    expect(reports[0].year).toBe(1);
    expect(reports[0].balance).toBeCloseTo(1000 * (1 + r) ** 1, 10);
    expect(reports[0].interestEarned).toBeCloseTo(
      1000 * (1 + r) ** 1 - 1000,
      10,
    );

    expect(reports[1].year).toBe(2);
    expect(reports[1].balance).toBeCloseTo(1000 * (1 + r) ** 2, 10);
    expect(reports[1].interestEarned).toBeCloseTo(
      1000 * (1 + r) ** 2 - 1000 * (1 + r) ** 1,
      10,
    );

    expect(reports[2].year).toBe(3);
    expect(reports[2].balance).toBeCloseTo(1000 * (1 + r) ** 3, 10);
    expect(reports[2].interestEarned).toBeCloseTo(
      1000 * (1 + r) ** 3 - 1000 * (1 + r) ** 2,
      10,
    );
  });

  it("uses whole-year count when a fractional year is provided", () => {
    const full = computeYearlyReports({
      principal: 500,
      annualRate: 4,
      years: 2,
    });
    const truncated = computeYearlyReports({
      principal: 500,
      annualRate: 4,
      years: 2.9,
    });
    expect(truncated).toEqual(full);
  });

  it("returns empty when principal or rate is not finite", () => {
    expect(
      computeYearlyReports({
        principal: Number.NaN,
        annualRate: 5,
        years: 2,
      }),
    ).toEqual([]);
    expect(
      computeYearlyReports({
        principal: 100,
        annualRate: Number.NaN,
        years: 2,
      }),
    ).toEqual([]);
  });

  it("handles 0% rate with constant balance and zero interest", () => {
    const reports = computeYearlyReports({
      principal: 250,
      annualRate: 0,
      years: 4,
    });
    expect(reports).toHaveLength(4);
    reports.forEach((row) => {
      expect(row.balance).toBeCloseTo(250, 10);
      expect(row.interestEarned).toBeCloseTo(0, 10);
    });
  });
});

describe("sanitizeNumericText", () => {
  it("strips letters and symbols", () => {
    expect(sanitizeNumericText("12a3b")).toBe("123");
    expect(sanitizeNumericText("1-2+3")).toBe("123");
  });

  it("keeps a single decimal point", () => {
    expect(sanitizeNumericText("10.5")).toBe("10.5");
    expect(sanitizeNumericText("10.5.6")).toBe("10.56");
  });
});

describe("parsePositiveNumber", () => {
  it("parses valid numbers", () => {
    expect(parsePositiveNumber("0")).toBe(0);
    expect(parsePositiveNumber("  3.25 ")).toBe(3.25);
  });

  it("returns null for empty or invalid input", () => {
    expect(parsePositiveNumber("")).toBeNull();
    expect(parsePositiveNumber("   ")).toBeNull();
    expect(parsePositiveNumber(".")).toBeNull();
  });

  it("returns null when the parsed value is not finite", () => {
    expect(parsePositiveNumber("1e400")).toBeNull();
  });
});
