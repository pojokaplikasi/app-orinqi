import { NextResponse } from "next/server"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { calculateLuckPillars, calculatePillars } from "@/lib/bazi"

dayjs.extend(utc)
dayjs.extend(timezone)

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const dateTimeStr = data.dateTime
    const timezoneStr = data.location
    const gender = parseInt(data.gender)

    if (!timezoneStr) {
      throw new Error("Invalid timezone: missing")
    }

    // Validate the IANA timezone without relying on the Day.js type definition.
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: timezoneStr }).format()
    } catch {
      throw new Error(`Invalid timezone: ${timezoneStr}`)
    }

    // Parse the wall-clock birth time directly in the user's timezone.
    // This keeps the result identical regardless of the server timezone (UTC on Vercel/Firebase).
    const birthTime = dayjs.tz(dateTimeStr, timezoneStr)

    if (!birthTime.isValid()) {
      throw new Error("Invalid birth date or time")
    }

    const fourPillars = calculatePillars(birthTime)
    const luckPillars = calculateLuckPillars(birthTime, gender, fourPillars)

    return NextResponse.json({
      four_pillars: fourPillars,
      luck_pillars: luckPillars,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in calculate_bazi:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
