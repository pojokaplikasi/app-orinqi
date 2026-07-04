import { Metadata } from "next"
import DashboardPage from "./page"

export const metadata: Metadata = {
  title: "Dashboard - Orinqi",
  description: "Manage your Orinqi destiny charts",
}

export default function Dashboard() {
  return <DashboardPage />
}
