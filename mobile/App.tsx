import "./global.css";
import { StatusBar } from "expo-status-bar";
import type { ReactElement } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { InvestmentSimulatorScreen } from "./src/screens/InvestmentSimulatorScreen";

export default function App(): ReactElement {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <InvestmentSimulatorScreen />
    </SafeAreaProvider>
  );
}
