export interface InvestmentInput {
  principal: number;
  annualRate: number;
  years: number;
}

export interface YearlyReport {
  year: number;
  balance: number;
  interestEarned: number;
}

const DECIMAL_RATE_DIVISOR = 100;

function wholeYears(years: number): number {
  if (!Number.isFinite(years)) {
    return 0;
  }
  return Math.max(0, Math.floor(years));
}

/**
 * Year-end compound interest breakdown using A = P(1 + r)^t with r = annualRate / 100.
 */
export function computeYearlyReports(input: InvestmentInput): YearlyReport[] {
  const { principal, annualRate, years } = input;
  if (!Number.isFinite(principal) || !Number.isFinite(annualRate)) {
    return [];
  }

  const totalYears = wholeYears(years);
  if (totalYears === 0) {
    return [];
  }

  const rate = annualRate / DECIMAL_RATE_DIVISOR;
  const growth = 1 + rate;
  const reports: YearlyReport[] = [];

  for (let year = 1; year <= totalYears; year += 1) {
    const balance = principal * growth ** year;
    const previousBalance = year === 1 ? principal : principal * growth ** (year - 1);
    const interestEarned = balance - previousBalance;
    reports.push({ year, balance, interestEarned });
  }

  return reports;
}

/**
 * Allows only digits and a single decimal separator for numeric text fields.
 */
export function sanitizeNumericText(raw: string): string {
  const withoutInvalid = raw.replace(/[^0-9.]/g, "");
  const firstDot = withoutInvalid.indexOf(".");
  if (firstDot === -1) {
    return withoutInvalid;
  }
  const head = withoutInvalid.slice(0, firstDot + 1);
  const tail = withoutInvalid.slice(firstDot + 1).replace(/\./g, "");
  return head + tail;
}

export function parsePositiveNumber(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === "" || trimmed === ".") {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return null;
  }
  return value;
}
