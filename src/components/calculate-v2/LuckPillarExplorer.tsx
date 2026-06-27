/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import CompactPillarCard from "@/components/CompactPillarCard"
import Pillar from "@/components/Pillar"
import DetailDialog from "@/components/DetailDialog"
import { detectLuckPillarCombinations } from "@/lib/bazi/combinations"

interface LuckPillarExplorerProps {
  baziData: any
  luckyStars: any
  date: string
  time: string
  timezone: string
  unknownTime: boolean
  mode?: "classic" | "modern"
  onHourSelect?: (pillar: any) => void
}

const ROW_COLORS = [
  "var(--color-primary)",
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
]

const ROW_LABELS = [
  { label: "10-Year Luck", icon: "🔮", zh: "大運" },
  { label: "Year Pillar", icon: "📅", zh: "年柱" },
  { label: "Month Pillar", icon: "🌙", zh: "月柱" },
  { label: "Day Pillar", icon: "☀️", zh: "日柱" },
  { label: "Hour Pillar", icon: "⏰", zh: "時柱" },
]

export default function LuckPillarExplorer({
  baziData,
  luckyStars,
  date,
  time,
  unknownTime,
  mode = "modern",
  onHourSelect,
}: LuckPillarExplorerProps) {
  const dayMasterName =
    baziData?.four_pillars?.day_pillar?.heavenly_stem?.name ?? undefined

  // ── Selection state ──────────────────────────────────────────────────────
  // selectedLuck stores year_start of the luck pillar (unique identifier), not array index
  const [selectedLuck, setSelectedLuck] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // ── Fetched data ─────────────────────────────────────────────────────────
  const [yearPillars, setYearPillars] = useState<any[]>([])
  const [monthPillars, setMonthPillars] = useState<any[]>([])
  const [dayPillars, setDayPillars] = useState<any[]>([])
  const [hourPillars, setHourPillars] = useState<any[]>([])

  // ── Loading states ───────────────────────────────────────────────────────
  const [loadingYear, setLoadingYear] = useState(false)
  const [loadingMonth, setLoadingMonth] = useState(false)
  const [loadingDay, setLoadingDay] = useState(false)
  const [loadingHour, setLoadingHour] = useState(false)

  // ── Dialog state ─────────────────────────────────────────────────────────
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedHourData, setSelectedHourData] = useState<any>(null)

  // ── Row scroll refs ──────────────────────────────────────────────────────
  // Deklarasi di sini agar bisa dipakai di useEffect scroll state di bawah
  const luckPillars: any[] = baziData?.luck_pillars?.luck_pillars ?? []

  const rowRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]

  // Flag to skip cascade useEffect when autoSelectCurrentTime is running
  const isAutoSelectingRef = useRef(false)

  // ── Scroll nav state per row ─────────────────────────────────────────────
  const [canScrollLeft, setCanScrollLeft] = useState([false, false, false, false, false])
  const [canScrollRight, setCanScrollRight] = useState([false, false, false, false, false])

  const updateScrollState = useCallback((rowIndex: number) => {
    const el = rowRefs[rowIndex].current
    if (!el) return
    const left = el.scrollLeft > 4
    const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 4
    setCanScrollLeft(prev => { const n = [...prev]; n[rowIndex] = left; return n })
    setCanScrollRight(prev => { const n = [...prev]; n[rowIndex] = right; return n })
  }, [])

  const scrollRow = useCallback((rowIndex: number, direction: 'left' | 'right') => {
    const el = rowRefs[rowIndex].current
    if (!el) return
    const amount = el.clientWidth * 0.6
    el.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' })
  }, [])

  // Update scroll state whenever pillars change
  useEffect(() => { setTimeout(() => updateScrollState(0), 100) }, [luckPillars])
  useEffect(() => { setTimeout(() => updateScrollState(1), 100) }, [yearPillars])
  useEffect(() => { setTimeout(() => updateScrollState(2), 100) }, [monthPillars])
  useEffect(() => { setTimeout(() => updateScrollState(3), 100) }, [dayPillars])
  useEffect(() => { setTimeout(() => updateScrollState(4), 100) }, [hourPillars])

  const birthTime = unknownTime ? `${date}T12:00` : `${date}T${time}`

  // ── Auto-detect current time and auto-select ─────────────────────────────
  const autoSelectCurrentTime = useCallback(() => {
    if (!baziData?.luck_pillars?.luck_pillars) return

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const currentDay = now.getDate()

    // Find current luck pillar
    const luckPillars: any[] = baziData.luck_pillars.luck_pillars
    const currentLuck = luckPillars.find(
      (p: any) => currentYear >= p.year_start && currentYear <= p.year_end
    )

    if (!currentLuck) return

    // Set flag so cascade useEffects skip their fetch (we handle it here)
    isAutoSelectingRef.current = true
    setSelectedLuck(currentLuck.year_start)

    // Fetch years for that luck pillar, then auto-select current year
    const lp = currentLuck
    setLoadingYear(true)
    fetch("/api/calculate_yearly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_year: lp.year_start,
        end_year: lp.year_end,
        birth_time: birthTime,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const yp: any[] = data.yearly_pillars ?? []
        setYearPillars(yp)
        const matchYear = yp.find((p: any) => p.year === currentYear)
        if (!matchYear) { isAutoSelectingRef.current = false; return }
        setSelectedYear(currentYear)

        // Fetch months for current year, then auto-select current month
        setLoadingMonth(true)
        fetch("/api/calculate_monthly", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year: currentYear, birth_time: birthTime }),
        })
          .then((r) => r.json())
          .then((mdata) => {
            const mp: any[] = mdata.monthly_pillars ?? []
            setMonthPillars(mp)
            const matchMonth = mp.find((p: any) => p.month === currentMonth)
            if (!matchMonth) { isAutoSelectingRef.current = false; return }
            setSelectedMonth(currentMonth)

            // Fetch days for current month, then auto-select current day
            setLoadingDay(true)
            fetch("/api/calculate_daily", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                year: currentYear,
                month: currentMonth,
                birth_time: birthTime,
              }),
            })
              .then((r) => r.json())
              .then((ddata) => {
                const dp: any[] = ddata.daily_pillars ?? []
                setDayPillars(dp)
                const matchDay = dp.find((p: any) => p.day === currentDay)
                if (!matchDay) { isAutoSelectingRef.current = false; return }
                setSelectedDay(currentDay)

                // Fetch hours for current day
                setLoadingHour(true)
                fetch("/api/calculate_hourly", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    year: currentYear,
                    month: currentMonth,
                    day: currentDay,
                    birth_time: birthTime,
                  }),
                })
                  .then((r) => r.json())
                  .then((hdata) => {
                    const hp: any[] = hdata.hourly_pillars ?? []
                    setHourPillars(hp)
                    // Auto-select the hour pillar that covers the current time
                    const currentHour = now.getHours()
                    const currentMinute = now.getMinutes()
                    const currentTotalMin = currentHour * 60 + currentMinute
                    const matchHour = hp.find((p: any) => {
                      // hour_time format: "HH:MM - HH:MM" e.g. "15:00 - 16:59"
                      const parts = p.hour_time?.split(' - ')
                      if (!parts || parts.length < 2) return false
                      const [startH, startM] = parts[0].split(':').map(Number)
                      const [endH, endM] = parts[1].split(':').map(Number)
                      const startMin = startH * 60 + startM
                      const endMin = endH * 60 + endM
                      // Handle midnight-crossing range (23:00 - 00:59)
                      if (startMin > endMin) {
                        return currentTotalMin >= startMin || currentTotalMin <= endMin
                      }
                      return currentTotalMin >= startMin && currentTotalMin <= endMin
                    })
                    if (matchHour) setSelectedHourData(matchHour)
                  })
                  .finally(() => { setLoadingHour(false); isAutoSelectingRef.current = false })
              })
              .finally(() => setLoadingDay(false))
          })
          .finally(() => setLoadingMonth(false))
      })
      .finally(() => setLoadingYear(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baziData])

  // Auto-select on mount — delayed so the page renders first before fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSelectCurrentTime()
    }, 800)
    return () => clearTimeout(timer)
  }, [autoSelectCurrentTime])

  // ── Cascade: Luck → Year ─────────────────────────────────────────────────
  useEffect(() => {
    if (selectedLuck === null || !baziData) return
    // Skip if autoSelectCurrentTime is handling the full cascade
    if (isAutoSelectingRef.current) return
    const lp = baziData.luck_pillars.luck_pillars.find((p: any) => p.year_start === selectedLuck)
    setSelectedYear(null)
    setSelectedMonth(null)
    setSelectedDay(null)
    setYearPillars([])
    setMonthPillars([])
    setDayPillars([])
    setHourPillars([])
    if (!lp) return
    setLoadingYear(true)
    fetch("/api/calculate_yearly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_year: lp.year_start,
        end_year: lp.year_end,
        birth_time: birthTime,
      }),
    })
      .then((r) => r.json())
      .then((data) => setYearPillars(data.yearly_pillars ?? []))
      .catch(console.error)
      .finally(() => setLoadingYear(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLuck])

  // ── Cascade: Year → Month ────────────────────────────────────────────────
  useEffect(() => {
    if (selectedYear === null || !baziData) return
    if (isAutoSelectingRef.current) return
    setSelectedMonth(null)
    setSelectedDay(null)
    setMonthPillars([])
    setDayPillars([])
    setHourPillars([])
    setLoadingMonth(true)
    fetch("/api/calculate_monthly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: selectedYear, birth_time: birthTime }),
    })
      .then((r) => r.json())
      .then((data) => setMonthPillars(data.monthly_pillars ?? []))
      .catch(console.error)
      .finally(() => setLoadingMonth(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear])

  // ── Cascade: Month → Day ─────────────────────────────────────────────────
  useEffect(() => {
    if (selectedMonth === null || selectedYear === null || !baziData) return
    if (isAutoSelectingRef.current) return
    setSelectedDay(null)
    setDayPillars([])
    setHourPillars([])
    setLoadingDay(true)
    fetch("/api/calculate_daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: selectedYear,
        month: selectedMonth,
        birth_time: birthTime,
      }),
    })
      .then((r) => r.json())
      .then((data) => setDayPillars(data.daily_pillars ?? []))
      .catch(console.error)
      .finally(() => setLoadingDay(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear])

  // ── Cascade: Day → Hour ──────────────────────────────────────────────────
  useEffect(() => {
    if (
      selectedDay === null ||
      selectedMonth === null ||
      selectedYear === null ||
      !baziData
    )
      return
    if (isAutoSelectingRef.current) return
    setHourPillars([])
    setLoadingHour(true)
    fetch("/api/calculate_hourly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay,
        birth_time: birthTime,
      }),
    })
      .then((r) => r.json())
      .then((data) => setHourPillars(data.hourly_pillars ?? []))
      .catch(console.error)
      .finally(() => setLoadingHour(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, selectedMonth, selectedYear])

  // ── Auto-scroll selected card into view ──────────────────────────────────
  const scrollToSelected = (rowRef: React.RefObject<HTMLDivElement | null>) => {
    const container = rowRef.current
    if (!container) return
    const selected = container.querySelector('[data-selected="true"]')
    if (!selected) return
    const el = selected as HTMLElement
    container.scrollTo({
      left: el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2,
      behavior: "smooth",
    })
  }

  useEffect(() => { setTimeout(() => scrollToSelected(rowRefs[0]), 150) }, [selectedLuck, luckPillars])
  useEffect(() => scrollToSelected(rowRefs[1]), [selectedLuck, yearPillars])
  useEffect(() => scrollToSelected(rowRefs[2]), [selectedYear, monthPillars])
  useEffect(() => scrollToSelected(rowRefs[3]), [selectedMonth, dayPillars])
  useEffect(() => scrollToSelected(rowRefs[4]), [selectedDay, hourPillars])
  useEffect(() => scrollToSelected(rowRefs[4]), [selectedHourData])

  // ── Reset to current time ────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setSelectedLuck(null)
    setSelectedYear(null)
    setSelectedMonth(null)
    setSelectedDay(null)
    setSelectedHourData(null)
    setYearPillars([])
    setMonthPillars([])
    setDayPillars([])
    setHourPillars([])
    setTimeout(() => autoSelectCurrentTime(), 50)
  }, [autoSelectCurrentTime])

  // Listen for custom event from page.tsx
  useEffect(() => {
    window.addEventListener('reset-to-current-time', handleReset)
    return () => window.removeEventListener('reset-to-current-time', handleReset)
  }, [handleReset])

  // ── Row data ─────────────────────────────────────────────────────────────
  // (luckPillars sudah dideklarasikan di atas)

  const rows = [
    {
      pillars: [...luckPillars].reverse(),
      loading: false,
      isActive: true,
      renderCard: (pillar: any, index: number) => {
        return (
          <div key={index} data-selected={selectedLuck === pillar.year_start}>
            <Pillar
              title={`Luck ${pillar.number} (大運)`}
              periodLabel="Period"
              periodValue={`${pillar.year_start}–${pillar.year_end}`}
              pillarData={pillar}
              isSelected={selectedLuck === pillar.year_start}
              onClick={() => setSelectedLuck(pillar.year_start)}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              mode={mode}
            />
          </div>
        )
      },
    },
    {
      pillars: [...yearPillars].reverse(),
      loading: loadingYear,
      isActive: selectedLuck !== null,
      renderCard: (pillar: any, index: number) => {
        return (
          <div key={index} data-selected={selectedYear === pillar.year}>
            <Pillar
              title={`${pillar.year} (年柱)`}
              periodLabel="Age"
              periodValue={`Age ${pillar.age}`}
              pillarData={pillar}
              isSelected={selectedYear === pillar.year}
              onClick={() => setSelectedYear(pillar.year)}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              mode={mode}
            />
          </div>
        )
      },
    },
    {
      pillars: [...monthPillars].reverse(),
      loading: loadingMonth,
      isActive: selectedYear !== null,
      renderCard: (pillar: any, index: number) => {
        return (
          <div key={index} data-selected={selectedMonth === pillar.month}>
            <Pillar
              title={`${pillar.month_english} (月柱)`}
              periodLabel="Month"
              periodValue={`Month ${pillar.month}`}
              pillarData={pillar}
              isSelected={selectedMonth === pillar.month}
              onClick={() => setSelectedMonth(pillar.month)}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              mode={mode}
            />
          </div>
        )
      },
    },
    {
      pillars: [...dayPillars].reverse(),
      loading: loadingDay,
      isActive: selectedMonth !== null,
      renderCard: (pillar: any, index: number) => {
        return (
          <div key={index} data-selected={selectedDay === pillar.day}>
            <Pillar
              title={`Day ${pillar.day} (日柱)`}
              periodLabel="Month"
              periodValue={
                monthPillars.find((m) => m.month === selectedMonth)
                  ?.month_english ?? ""
              }
              pillarData={pillar}
              isSelected={selectedDay === pillar.day}
              onClick={() => setSelectedDay(pillar.day)}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              mode={mode}
            />
          </div>
        )
      },
    },
    {
      pillars: [...hourPillars].reverse(),
      loading: loadingHour,
      isActive: selectedDay !== null,
      renderCard: (pillar: any, index: number) => {
        return (
          <div key={index} data-selected={selectedHourData?.hour_time === pillar.hour_time}>
            <Pillar
              title={`${pillar.hour_time} (時柱)`}
              periodLabel="Hour"
              periodValue="Hour"
              pillarData={pillar}
              isSelected={selectedHourData?.hour_time === pillar.hour_time}
              onClick={() => {
                setSelectedHourData(pillar)
                setIsDialogOpen(true)
                onHourSelect?.(pillar)
              }}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              mode={mode}
            />
          </div>
        )
      },
    },
  ]

  const selectedLuckData =
    selectedLuck !== null ? luckPillars.find((p: any) => p.year_start === selectedLuck) ?? null : null
  const selectedYearData = yearPillars.find((p) => p.year === selectedYear)
  const selectedMonthData = monthPillars.find((p) => p.month === selectedMonth)
  const selectedDayData = dayPillars.find((p) => p.day === selectedDay)

  return (
    <>
      <div className="flex w-full flex-col gap-0 overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">

        {/* 5 Rows */}
        {rows.map((row, rowIndex) => {
        const isLocked = !row.isActive
        const hasItems = row.pillars.length > 0

        return (
          <div
            key={rowIndex}
            className={`relative flex flex-col border-b border-border last:border-b-0 transition-opacity duration-300 ${isLocked ? "opacity-40" : "opacity-100"}`}
          >
            {/* Prev / Next nav buttons + gradient fade edges */}
            {!isLocked && hasItems && (
              <>
                {/* Left gradient + button */}
                <div className={`absolute left-0 inset-y-0 z-10 flex items-center w-12 transition-opacity duration-200 ${canScrollLeft[rowIndex] ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent rounded-l-[28px]" />
                  <button
                    onClick={() => scrollRow(rowIndex, 'left')}
                    className="relative ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary shadow-sm backdrop-blur-sm transition-all hover:bg-primary/20 hover:border-primary/40 hover:shadow-md active:scale-95"
                    aria-label="Scroll left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                </div>

                {/* Right gradient + button */}
                <div className={`absolute right-0 inset-y-0 z-10 flex items-center justify-end w-12 transition-opacity duration-200 ${canScrollRight[rowIndex] ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <div className="absolute inset-0 bg-gradient-to-l from-card via-card/80 to-transparent rounded-r-[28px]" />
                  <button
                    onClick={() => scrollRow(rowIndex, 'right')}
                    className="relative mr-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary shadow-sm backdrop-blur-sm transition-all hover:bg-primary/20 hover:border-primary/40 hover:shadow-md active:scale-95"
                    aria-label="Scroll right"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* Horizontal scroll area — no overflow-x-auto, scroll via buttons only */}
            <div
              ref={rowRefs[rowIndex]}
              className="flex flex-row flex-nowrap items-stretch gap-3 overflow-x-hidden scroll-smooth px-5 pb-3 pt-3"
              onScroll={() => updateScrollState(rowIndex)}
            >
              {/* Inner wrapper: center when items fit, left-align when overflow */}
              <div className="flex flex-row flex-nowrap items-stretch gap-3 mx-auto">
                {row.loading ? (
                  // Skeleton placeholders
                  Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[200px] w-[130px] flex-none animate-pulse rounded-[16px] bg-muted/50"
                    />
                  ))
                ) : row.pillars.length > 0 ? (
                  row.pillars.map((pillar, index) =>
                    row.renderCard(pillar, index)
                  )
                ) : !isLocked ? (
                  <div className="flex w-full items-center justify-center py-8 text-[13px] text-muted-foreground">
                    No data available.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )
        })}
      </div>

      <DetailDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedHourData={selectedHourData}
        selectedLuckData={selectedLuckData}
        selectedYearData={selectedYearData}
        selectedMonthData={selectedMonthData}
        selectedDayData={selectedDayData}
        selectedYear={selectedYear}
        selectedDay={selectedDay}
        baziData={baziData}
        luckyStars={luckyStars}
      />
    </>
  )
}

function SelectedBadge({ color, text }: { color: string; text: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold"
      style={{
        backgroundColor: color + "18",
        color,
        border: `1px solid ${color}40`,
      }}
    >
      ✓ {text}
    </span>
  )
}
