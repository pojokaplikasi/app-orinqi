import { Metadata } from "next"
import RegisterPage from "./page"

export const metadata: Metadata = {
  title: "Create Account - Orinqi",
  description: "Create a new Orinqi account",
}

export default function Register() {
  return <RegisterPage />
}
