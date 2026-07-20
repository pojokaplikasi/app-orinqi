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

    console.log("[BAZI API] Environment:", {
      serverTime: new Date().toString(),
      serverISOString: new Date().toISOString(),
      serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      processTZ: process.env.TZ || "not set",
    })
    console.log("[BAZI API] Input:", {
      dateTimeStr,
      timezoneStr,
      gender,
      unknownBirthTime: data.unknownBirthTime,
    })

    let birthTime
    if (dateTimeStr.includes("T")) {
      birthTime = dayjs(dateTimeStr.replace("Z", "+00:00"))
    } else {
      birthTime = dayjs(dateTimeStr, "YYYY-MM-DD HH:mm")
    }

    console.log("[BAZI API] Parsed before timezone:", {
      formatted: birthTime.format(),
      offset: birthTime.format("Z"),
      isValid: birthTime.isValid(),
    })

    if (timezoneStr) {
      try {
        birthTime = birthTime.tz(timezoneStr, true)
      } catch (e) {
        console.error("[BAZI API] Timezone error:", e)
      }
    }

    console.log("[BAZI API] Parsed after timezone:", {
      formatted: birthTime.format(),
      offset: birthTime.format("Z"),
      timezone: birthTime.format("z"),
      iso: birthTime.toISOString(),
    })

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
