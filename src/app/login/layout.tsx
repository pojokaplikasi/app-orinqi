import { Metadata } from "next"
import LoginPage from "./page"

export const metadata: Metadata = {
  title: "Sign In - Orinqi",
  description: "Sign in to your Orinqi account",
}

export default function Login() {
  return <LoginPage />
}
