import { useMemo, useState, type ReactElement } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  computeYearlyReports,
  parsePositiveNumber,
  sanitizeNumericText,
  type YearlyReport,
} from "../domain/investmentSimulator";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatMoney(value: number): string {
  return currency.format(value);
}

export function InvestmentSimulatorScreen(): ReactElement {
  const [principalText, setPrincipalText] = useState("");
  const [rateText, setRateText] = useState("");
  const [yearsText, setYearsText] = useState("");
  const [rows, setRows] = useState<YearlyReport[]>([]);

  const listEmpty = useMemo(() => rows.length === 0, [rows.length]);

  const handleCalculate = (): void => {
    const principal = parsePositiveNumber(principalText);
    const annualRate = parsePositiveNumber(rateText);
    const years = parsePositiveNumber(yearsText);

    if (principal === null || annualRate === null || years === null) {
      setRows([]);
      return;
    }

    setRows(computeYearlyReports({ principal, annualRate, years }));
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-4 pt-2">
          <Text className="text-2xl font-semibold text-slate-50">
            Investment simulator
          </Text>
          <Text className="mt-1 text-sm text-slate-400">
            Compound growth A = P(1 + r)^t. Results update when you tap
            Calculate.
          </Text>

          <View className="mt-6 gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <LabeledField
              label="Principal (USD)"
              value={principalText}
              onChangeText={(t) => setPrincipalText(sanitizeNumericText(t))}
              testID="input-principal"
            />
            <LabeledField
              label="Annual rate (%)"
              value={rateText}
              onChangeText={(t) => setRateText(sanitizeNumericText(t))}
              testID="input-rate"
            />
            <LabeledField
              label="Years"
              value={yearsText}
              onChangeText={(t) => setYearsText(sanitizeNumericText(t))}
              testID="input-years"
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Calculate simulation"
              className="mt-2 items-center rounded-xl bg-emerald-500 py-3 active:bg-emerald-600"
              onPress={handleCalculate}
              testID="button-calculate"
            >
              <Text className="text-base font-semibold text-slate-950">
                Calculate
              </Text>
            </Pressable>
          </View>

          <Text className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Yearly breakdown
          </Text>

          {listEmpty ? (
            <Text className="mt-2 text-sm text-slate-500" testID="empty-state">
              Enter values and tap Calculate to see each year's balance and
              interest.
            </Text>
          ) : (
            <FlatList
              className="mt-2 flex-1"
              data={rows}
              keyExtractor={(item) => String(item.year)}
              renderItem={({ item }) => (
                <View className="mb-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                  <Text className="text-xs font-semibold uppercase text-slate-500">
                    Year {item.year}
                  </Text>
                  <View className="mt-2 flex-row justify-between">
                    <Text className="text-sm text-slate-400">Balance</Text>
                    <Text className="text-sm font-semibold text-slate-50">
                      {formatMoney(item.balance)}
                    </Text>
                  </View>
                  <View className="mt-1 flex-row justify-between">
                    <Text className="text-sm text-slate-400">
                      Interest this year
                    </Text>
                    <Text className="text-sm font-semibold text-emerald-300">
                      {formatMoney(item.interestEarned)}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type LabeledFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  testID?: string;
};

function LabeledField({
  label,
  value,
  onChangeText,
  testID,
}: LabeledFieldProps): ReactElement {
  return (
    <View>
      <Text className="mb-1 text-xs font-semibold uppercase text-slate-500">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        inputMode="decimal"
        placeholder="0"
        placeholderTextColor="#64748b"
        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-base text-slate-50"
        testID={testID}
      />
    </View>
  );
}
