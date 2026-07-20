import { NextResponse } from "next/server"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { calculateHourlyPillars } from "@/lib/bazi"

dayjs.extend(utc)
dayjs.extend(timezone)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const year = parseInt(data.year)
    const month = parseInt(data.month)
    const day = parseInt(data.day)
    const birthTimeStr = data.birth_time
    const timezoneStr = data.timezone

    console.log("[BAZI API hourly] Input", {
      serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      processTZ: process.env.TZ || "not set",
      birthTimeStr,
      timezoneStr,
      year,
      month,
      day,
    })

    if (!timezoneStr) throw new Error("Invalid timezone: missing")
    const birthTime = dayjs.tz(birthTimeStr, timezoneStr)
    console.log("[BAZI API hourly] Parsed", {
      formatted: birthTime.format(),
      offset: birthTime.format("Z"),
      iso: birthTime.toISOString(),
    })
    if (!birthTime.isValid()) throw new Error("Invalid birth date or time")

    const hourlyPillars = calculateHourlyPillars(year, month, day, birthTime)

    return NextResponse.json({ hourly_pillars: hourlyPillars })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in calculate_hourly:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
