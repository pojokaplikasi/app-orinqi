import { Metadata } from "next"
import BaziCalculator from "./page"

export const metadata: Metadata = {
  title: "Calculator - Orinqi",
  description: "Calculate your BaZi destiny chart",
}

export default function CalculateLayout() {
  return <BaziCalculator />
}
