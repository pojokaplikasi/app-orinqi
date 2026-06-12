import { NextResponse } from "next/server"
import dayjs from "dayjs"
import { calculateDailyPillars } from "@/lib/bazi"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const year = parseInt(data.year)
    const month = parseInt(data.month)
    const birthTimeStr = data.birth_time

    const birthTime = dayjs(birthTimeStr.replace("Z", "+00:00"))

    const dailyPillars = calculateDailyPillars(year, month, birthTime)

    return NextResponse.json({ daily_pillars: dailyPillars })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in calculate_daily:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
