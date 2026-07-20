import { NextResponse } from "next/server"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { calculateDailyPillars } from "@/lib/bazi"

dayjs.extend(utc)
dayjs.extend(timezone)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const year = parseInt(data.year)
    const month = parseInt(data.month)
    const birthTimeStr = data.birth_time
    const timezoneStr = data.timezone

    console.log("[BAZI API daily] Input", {
      serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      processTZ: process.env.TZ || "not set",
      birthTimeStr,
      timezoneStr,
      year,
      month,
    })

    if (!timezoneStr) throw new Error("Invalid timezone: missing")
    const birthTime = dayjs.tz(birthTimeStr, timezoneStr)
    console.log("[BAZI API daily] Parsed", {
      formatted: birthTime.format(),
      offset: birthTime.format("Z"),
      iso: birthTime.toISOString(),
    })
    if (!birthTime.isValid()) throw new Error("Invalid birth date or time")

    const dailyPillars = calculateDailyPillars(year, month, birthTime)

    return NextResponse.json({ daily_pillars: dailyPillars })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in calculate_daily:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
