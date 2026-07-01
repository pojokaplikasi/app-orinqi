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
  const rowRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]

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
    const currentLuckIdx = luckPillars.findIndex(
      (p: any) => currentYear >= p.year_start && currentYear <= p.year_end
    )

    if (currentLuckIdx === -1) return

    setSelectedLuck(currentLuckIdx)

    // Fetch years for that luck pillar, then auto-select current year
    const lp = luckPillars[currentLuckIdx]
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
        if (!matchYear) return
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
            if (!matchMonth) return
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
                if (!matchDay) return
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
                    setHourPillars(hdata.hourly_pillars ?? [])
                  })
                  .finally(() => setLoadingHour(false))
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
    const lp = baziData.luck_pillars.luck_pillars[selectedLuck]
    setSelectedYear(null)
    setSelectedMonth(null)
    setSelectedDay(null)
    setYearPillars([])
    setMonthPillars([])
    setDayPillars([])
    setHourPillars([])
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

  useEffect(() => scrollToSelected(rowRefs[1]), [selectedLuck, yearPillars])
  useEffect(() => scrollToSelected(rowRefs[2]), [selectedYear, monthPillars])
  useEffect(() => scrollToSelected(rowRefs[3]), [selectedMonth, dayPillars])
  useEffect(() => scrollToSelected(rowRefs[4]), [selectedDay, hourPillars])

  // ── Reset to current time ────────────────────────────────────────────────
  const handleReset = () => {
    setSelectedLuck(null)
    setSelectedYear(null)
    setSelectedMonth(null)
    setSelectedDay(null)
    setYearPillars([])
    setMonthPillars([])
    setDayPillars([])
    setHourPillars([])
    setTimeout(() => autoSelectCurrentTime(), 50)
  }

  // ── Row data ─────────────────────────────────────────────────────────────
  const luckPillars: any[] = baziData?.luck_pillars?.luck_pillars ?? []

  const rows = [
    {
      pillars: [...luckPillars].reverse(),
      loading: false,
      isActive: true,
      renderCard: (pillar: any, index: number) => {
        const { hsCombos: lhc, branchInteractions: lbi } =
          detectLuckPillarCombinations(pillar, baziData.four_pillars)
        return (
          <div key={index} data-selected={selectedLuck === index}>
            <Pillar
              title={`Luck ${pillar.number} (大運)`}
              periodLabel="Period"
              periodValue={`${pillar.year_start}–${pillar.year_end}`}
              pillarData={pillar}
              isSelected={selectedLuck === index}
              onClick={() => setSelectedLuck(index)}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              hsCombos={lhc}
              branchInteractions={lbi}
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
        const { hsCombos: yhc, branchInteractions: ybi } =
          detectLuckPillarCombinations(pillar, baziData.four_pillars)
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
              hsCombos={yhc}
              branchInteractions={ybi}
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
        const { hsCombos: mhc, branchInteractions: mbi } =
          detectLuckPillarCombinations(pillar, baziData.four_pillars)
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
              hsCombos={mhc}
              branchInteractions={mbi}
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
        const { hsCombos: dhc, branchInteractions: dbi } =
          detectLuckPillarCombinations(pillar, baziData.four_pillars)
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
              hsCombos={dhc}
              branchInteractions={dbi}
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
        const { hsCombos: hhc, branchInteractions: hbi } =
          detectLuckPillarCombinations(pillar, baziData.four_pillars)
        return (
          <div key={index}>
            <Pillar
              title={`${pillar.hour_time} (時柱)`}
              periodLabel="Hour"
              periodValue="Hour"
              pillarData={pillar}
              isSelected={selectedHourData === pillar}
              onClick={() => {
                setSelectedHourData(pillar)
                setIsDialogOpen(true)
                onHourSelect?.(pillar)
              }}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              hsCombos={hhc}
              branchInteractions={hbi}
              mode={mode}
            />
          </div>
        )
      },
    },
  ]

  const selectedLuckData =
    selectedLuck !== null ? luckPillars[selectedLuck] : null
  const selectedYearData = yearPillars.find((p) => p.year === selectedYear)
  const selectedMonthData = monthPillars.find((p) => p.month === selectedMonth)
  const selectedDayData = dayPillars.find((p) => p.day === selectedDay)

  return (
    <>
      <div className="flex w-full flex-col gap-0 overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h3 className="flex items-center gap-2 text-[20px] font-bold text-foreground">
            <span>✨</span> Luck Pillars Explorer
          </h3>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Click any pillar to drill down. All rows update automatically.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-[12px] border border-primary/50 bg-primary/5 px-4 py-2 text-[13px] font-medium text-primary shadow-sm transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset to Current Time
        </button>
        </div>

        {/* 5 Rows */}
        {rows.map((row, rowIndex) => {
        const meta = ROW_LABELS[rowIndex]
        const color = ROW_COLORS[rowIndex]
        const isLocked = !row.isActive

        return (
          <div
            key={rowIndex}
            className={`flex flex-col border-b border-border last:border-b-0 transition-opacity duration-300 ${isLocked ? "opacity-40" : "opacity-100"}`}
          >
            {/* Row Label */}
            <div
              className="flex items-center gap-3 px-5 py-2"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <span className="text-[16px] leading-none">{meta.icon}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold text-foreground">
                  {meta.label}
                </span>
                <span className="text-[12px] font-medium text-muted-foreground">
                  {meta.zh}
                </span>
              </div>

              {/* Selected badge */}
              {rowIndex === 0 && selectedLuck !== null && (
                <SelectedBadge
                  color={color}
                  text={`${luckPillars[selectedLuck]?.year_start}–${luckPillars[selectedLuck]?.year_end}`}
                />
              )}
              {rowIndex === 1 && selectedYear !== null && (
                <SelectedBadge color={color} text={String(selectedYear)} />
              )}
              {rowIndex === 2 && selectedMonth !== null && (
                <SelectedBadge
                  color={color}
                  text={
                    monthPillars.find((m) => m.month === selectedMonth)
                      ?.month_english ?? String(selectedMonth)
                  }
                />
              )}
              {rowIndex === 3 && selectedDay !== null && (
                <SelectedBadge color={color} text={`Day ${selectedDay}`} />
              )}

              {/* Loading spinner */}
              {row.loading && (
                <svg
                  className="ml-auto h-4 w-4 animate-spin text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}

              {/* Lock hint */}
              {isLocked && (
                <span className="ml-auto text-[11px] text-muted-foreground">
                  Select{" "}
                  {rowIndex === 1
                    ? "a 10-Year Luck"
                    : rowIndex === 2
                      ? "a Year"
                      : rowIndex === 3
                        ? "a Month"
                        : "a Day"}{" "}
                  first
                </span>
              )}
            </div>

            {/* Horizontal scroll area */}
            <div
              ref={rowRefs[rowIndex]}
              className="flex flex-row flex-nowrap items-stretch gap-3 overflow-x-auto scroll-smooth px-5 pb-3 pt-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/40 hover:scrollbar-thumb-border/70"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.15) transparent' }}
            >
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
