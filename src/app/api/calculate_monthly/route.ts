import { NextResponse } from "next/server"
import dayjs from "dayjs"
import { calculateMonthlyPillars } from "@/lib/bazi"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const year = parseInt(data.year)
    const birthTimeStr = data.birth_time

    const birthTime = dayjs(birthTimeStr.replace("Z", "+00:00"))

    const monthlyPillars = calculateMonthlyPillars(year, birthTime)

    return NextResponse.json({ monthly_pillars: monthlyPillars })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in calculate_monthly:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
