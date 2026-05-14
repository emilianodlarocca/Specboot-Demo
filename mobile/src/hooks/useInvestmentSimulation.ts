import { useCallback, useMemo, useState } from "react";
import {
  computeYearlyReports,
  parsePositiveNumber,
  sanitizeNumericText,
  type YearlyReport,
} from "../domain/investmentSimulator";

export type UseInvestmentSimulationResult = {
  principalText: string;
  setPrincipalText: (value: string) => void;
  annualRateText: string;
  setAnnualRateText: (value: string) => void;
  yearsText: string;
  setYearsText: (value: string) => void;
  yearlyReports: YearlyReport[];
  isResultEmpty: boolean;
  calculate: () => void;
};

export function useInvestmentSimulation(): UseInvestmentSimulationResult {
  const [principalText, setPrincipalTextState] = useState("");
  const [annualRateText, setAnnualRateTextState] = useState("");
  const [yearsText, setYearsTextState] = useState("");
  const [yearlyReports, setYearlyReports] = useState<YearlyReport[]>([]);

  const setPrincipalText = useCallback((value: string) => {
    setPrincipalTextState(sanitizeNumericText(value));
  }, []);

  const setAnnualRateText = useCallback((value: string) => {
    setAnnualRateTextState(sanitizeNumericText(value));
  }, []);

  const setYearsText = useCallback((value: string) => {
    setYearsTextState(sanitizeNumericText(value));
  }, []);

  const calculate = useCallback(() => {
    const principal = parsePositiveNumber(principalText);
    const annualRate = parsePositiveNumber(annualRateText);
    const years = parsePositiveNumber(yearsText);

    if (principal === null || annualRate === null || years === null) {
      setYearlyReports([]);
      return;
    }

    setYearlyReports(
      computeYearlyReports({ principal, annualRate, years }),
    );
  }, [principalText, annualRateText, yearsText]);

  const isResultEmpty = useMemo(
    () => yearlyReports.length === 0,
    [yearlyReports.length],
  );

  return {
    principalText,
    setPrincipalText,
    annualRateText,
    setAnnualRateText,
    yearsText,
    setYearsText,
    yearlyReports,
    isResultEmpty,
    calculate,
  };
}
