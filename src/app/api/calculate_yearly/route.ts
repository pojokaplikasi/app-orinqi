import { NextResponse } from "next/server"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { calculateYearlyPillars } from "@/lib/bazi"

dayjs.extend(utc)
dayjs.extend(timezone)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const startYear = parseInt(data.start_year)
    const endYear = parseInt(data.end_year)
    const birthTimeStr = data.birth_time
    const timezoneStr = data.timezone

    if (!timezoneStr) throw new Error("Invalid timezone: missing")
    const birthTime = dayjs.tz(birthTimeStr, timezoneStr)
    if (!birthTime.isValid()) throw new Error("Invalid birth date or time")

    const yearlyPillars = calculateYearlyPillars(startYear, endYear, birthTime)

    return NextResponse.json({ yearly_pillars: yearlyPillars })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in calculate_yearly:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
