/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { detectLuckPillarCombinations } from "@/lib/bazi/combinations"
import DetailDialog from "@/components/DetailDialog"
import Pillar from "@/components/Pillar"

export interface ExplorerSelection {
  luck: any | null
  year: any | null
  month: any | null
  day: any | null
}

export interface LuckPillarExplorerHandle {
  navigateLuck: (direction: "prev" | "next") => void
  navigateYear: (direction: "prev" | "next") => void
  navigateMonth: (direction: "prev" | "next") => void
  navigateDay: (direction: "prev" | "next") => void
}

interface LuckPillarExplorerProps {
  baziData: any
  luckyStars: any
  date: string
  time: string
  timezone: string
  unknownTime: boolean
  mode?: "classic" | "modern"
  onHourSelect?: (pillar: any) => void
  onSelectionChange?: (selection: ExplorerSelection) => void
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

const LuckPillarExplorer = forwardRef<
  LuckPillarExplorerHandle,
  LuckPillarExplorerProps
>(function LuckPillarExplorer(
  {
    baziData,
    luckyStars,
    date,
    time,
    unknownTime,
    mode = "modern",
    onHourSelect,
    onSelectionChange,
  },
  ref
) {
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

  // ── Collapsible state per row (hide/show relationship indicators) ────────
  const [collapsedRows, setCollapsedRows] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
  })
  const toggleRowCollapse = (rowIndex: number) => {
    setCollapsedRows((prev) => ({ ...prev, [rowIndex]: !prev[rowIndex] }))
  }

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
    const currentGregorianMonth = now.getMonth() + 1
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
            // Match by gregorian_month (the actual calendar month)
            const matchMonth = mp.find(
              (p: any) => p.gregorian_month === currentGregorianMonth
            )
            if (!matchMonth) return
            setSelectedMonth(matchMonth.month)

            // Fetch days for current month using Gregorian month
            setLoadingDay(true)
            fetch("/api/calculate_daily", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                year: currentYear,
                month: currentGregorianMonth,
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
                    month: currentGregorianMonth,
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

  // ── Cascade handlers (event-driven, not effect-driven) ───────────────────
  // Each handler auto-selects the first item in the next level and cascades down.

  const fetchYearsAndCascade = useCallback(
    (lp: any) => {
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
          if (yp.length > 0) {
            const firstYear = yp[0].year
            setSelectedYear(firstYear)
            // Cascade: fetch months for first year
            setLoadingMonth(true)
            fetch("/api/calculate_monthly", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ year: firstYear, birth_time: birthTime }),
            })
              .then((r) => r.json())
              .then((mdata) => {
                const mp: any[] = mdata.monthly_pillars ?? []
                setMonthPillars(mp)
                if (mp.length > 0) {
                  const firstMonth = mp[0].month
                  const firstGregorianMonth =
                    mp[0].gregorian_month ?? firstMonth
                  setSelectedMonth(firstMonth)
                  // Cascade: fetch days for first month (use Gregorian month)
                  setLoadingDay(true)
                  fetch("/api/calculate_daily", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      year: firstYear,
                      month: firstGregorianMonth,
                      birth_time: birthTime,
                    }),
                  })
                    .then((r) => r.json())
                    .then((ddata) => {
                      const dp: any[] = ddata.daily_pillars ?? []
                      setDayPillars(dp)
                      if (dp.length > 0) {
                        const firstDay = dp[0].day
                        setSelectedDay(firstDay)
                        // Cascade: fetch hours for first day
                        setLoadingHour(true)
                        fetch("/api/calculate_hourly", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            year: firstYear,
                            month: firstGregorianMonth,
                            day: firstDay,
                            birth_time: birthTime,
                          }),
                        })
                          .then((r) => r.json())
                          .then((hdata) => {
                            setHourPillars(hdata.hourly_pillars ?? [])
                          })
                          .finally(() => setLoadingHour(false))
                      }
                    })
                    .finally(() => setLoadingDay(false))
                }
              })
              .finally(() => setLoadingMonth(false))
          }
        })
        .catch(console.error)
        .finally(() => setLoadingYear(false))
    },
    [birthTime]
  )

  const fetchMonthsAndCascade = useCallback(
    (year: number) => {
      setLoadingMonth(true)
      fetch("/api/calculate_monthly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, birth_time: birthTime }),
      })
        .then((r) => r.json())
        .then((mdata) => {
          const mp: any[] = mdata.monthly_pillars ?? []
          setMonthPillars(mp)
          if (mp.length > 0) {
            const firstMonth = mp[0].month
            const firstGregorianMonth = mp[0].gregorian_month ?? firstMonth
            setSelectedMonth(firstMonth)
            // Cascade: fetch days for first month (use Gregorian month)
            setLoadingDay(true)
            fetch("/api/calculate_daily", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                year,
                month: firstGregorianMonth,
                birth_time: birthTime,
              }),
            })
              .then((r) => r.json())
              .then((ddata) => {
                const dp: any[] = ddata.daily_pillars ?? []
                setDayPillars(dp)
                if (dp.length > 0) {
                  const firstDay = dp[0].day
                  setSelectedDay(firstDay)
                  // Cascade: fetch hours for first day
                  setLoadingHour(true)
                  fetch("/api/calculate_hourly", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      year,
                      month: firstGregorianMonth,
                      day: firstDay,
                      birth_time: birthTime,
                    }),
                  })
                    .then((r) => r.json())
                    .then((hdata) => {
                      setHourPillars(hdata.hourly_pillars ?? [])
                    })
                    .finally(() => setLoadingHour(false))
                }
              })
              .finally(() => setLoadingDay(false))
          }
        })
        .catch(console.error)
        .finally(() => setLoadingMonth(false))
    },
    [birthTime]
  )

  // Helper: get Gregorian month from a Chinese month number using monthPillars data
  const getGregorianMonth = useCallback(
    (chineseMonth: number, pillars: any[]) => {
      const found = pillars.find((p: any) => p.month === chineseMonth)
      return found?.gregorian_month ?? chineseMonth
    },
    []
  )

  const fetchDaysAndCascade = useCallback(
    (chineseMonth: number, year: number, gregorianMonth?: number) => {
      // Use provided gregorianMonth, or derive from monthPillars
      const gMonth =
        gregorianMonth ?? getGregorianMonth(chineseMonth, monthPillars)
      setLoadingDay(true)
      fetch("/api/calculate_daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          month: gMonth,
          birth_time: birthTime,
        }),
      })
        .then((r) => r.json())
        .then((ddata) => {
          const dp: any[] = ddata.daily_pillars ?? []
          setDayPillars(dp)
          if (dp.length > 0) {
            const firstDay = dp[0].day
            setSelectedDay(firstDay)
            // Cascade: fetch hours for first day
            setLoadingHour(true)
            fetch("/api/calculate_hourly", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                year,
                month: gMonth,
                day: firstDay,
                birth_time: birthTime,
              }),
            })
              .then((r) => r.json())
              .then((hdata) => {
                setHourPillars(hdata.hourly_pillars ?? [])
              })
              .finally(() => setLoadingHour(false))
          }
        })
        .catch(console.error)
        .finally(() => setLoadingDay(false))
    },
    [birthTime, monthPillars, getGregorianMonth]
  )

  const handleSelectLuck = useCallback(
    (luckIdx: number) => {
      if (!baziData) return
      setSelectedLuck(luckIdx)
      setSelectedYear(null)
      setSelectedMonth(null)
      setSelectedDay(null)
      setYearPillars([])
      setMonthPillars([])
      setDayPillars([])
      setHourPillars([])
      const lp = baziData.luck_pillars.luck_pillars[luckIdx]
      fetchYearsAndCascade(lp)
    },
    [baziData, fetchYearsAndCascade]
  )

  const handleSelectYear = useCallback(
    (year: number) => {
      if (!baziData) return
      setSelectedYear(year)
      setSelectedMonth(null)
      setSelectedDay(null)
      setMonthPillars([])
      setDayPillars([])
      setHourPillars([])
      fetchMonthsAndCascade(year)
    },
    [baziData, fetchMonthsAndCascade]
  )

  const handleSelectMonth = useCallback(
    (chineseMonth: number, year: number) => {
      if (!baziData) return
      setSelectedMonth(chineseMonth)
      setSelectedDay(null)
      setDayPillars([])
      setHourPillars([])
      // Look up the Gregorian month from the pillar data
      const pillar = monthPillars.find((p: any) => p.month === chineseMonth)
      const gregorianMonth = pillar?.gregorian_month ?? chineseMonth
      fetchDaysAndCascade(chineseMonth, year, gregorianMonth)
    },
    [baziData, fetchDaysAndCascade, monthPillars]
  )

  const handleSelectDay = useCallback(
    (day: number, chineseMonth: number, year: number) => {
      if (!baziData) return
      setSelectedDay(day)
      setHourPillars([])
      setLoadingHour(true)
      // Look up the Gregorian month from the pillar data
      const pillar = monthPillars.find((p: any) => p.month === chineseMonth)
      const gregorianMonth = pillar?.gregorian_month ?? chineseMonth
      fetch("/api/calculate_hourly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          month: gregorianMonth,
          day,
          birth_time: birthTime,
        }),
      })
        .then((r) => r.json())
        .then((data) => setHourPillars(data.hourly_pillars ?? []))
        .catch(console.error)
        .finally(() => setLoadingHour(false))
    },
    [baziData, birthTime, monthPillars]
  )

  // ── Expose navigation methods to parent via ref ───────────────────────────
  useImperativeHandle(
    ref,
    () => ({
      navigateLuck: (direction: "prev" | "next") => {
        if (!baziData?.luck_pillars?.luck_pillars) return
        const luckPillarsArr: any[] = baziData.luck_pillars.luck_pillars
        if (selectedLuck === null) return
        // flex-row-reverse: visually right = lower index, left = higher index
        const newIdx =
          direction === "next" ? selectedLuck - 1 : selectedLuck + 1
        if (newIdx < 0 || newIdx >= luckPillarsArr.length) return
        handleSelectLuck(newIdx)
      },
      navigateYear: (direction: "prev" | "next") => {
        if (yearPillars.length === 0 || selectedYear === null) return
        const currentIdx = yearPillars.findIndex((p) => p.year === selectedYear)
        if (currentIdx === -1) return
        // flex-row-reverse: visually right = lower index, left = higher index
        const newIdx = direction === "next" ? currentIdx - 1 : currentIdx + 1
        if (newIdx < 0 || newIdx >= yearPillars.length) return
        handleSelectYear(yearPillars[newIdx].year)
      },
      navigateMonth: (direction: "prev" | "next") => {
        if (
          monthPillars.length === 0 ||
          selectedMonth === null ||
          selectedYear === null
        )
          return
        const currentIdx = monthPillars.findIndex(
          (p) => p.month === selectedMonth
        )
        if (currentIdx === -1) return
        // flex-row-reverse: visually right = lower index, left = higher index
        const newIdx = direction === "next" ? currentIdx - 1 : currentIdx + 1
        if (newIdx < 0 || newIdx >= monthPillars.length) return
        handleSelectMonth(monthPillars[newIdx].month, selectedYear)
      },
      navigateDay: (direction: "prev" | "next") => {
        if (
          dayPillars.length === 0 ||
          selectedDay === null ||
          selectedMonth === null ||
          selectedYear === null
        )
          return
        const currentIdx = dayPillars.findIndex((p) => p.day === selectedDay)
        if (currentIdx === -1) return
        // flex-row-reverse: visually right = lower index, left = higher index
        const newIdx = direction === "next" ? currentIdx - 1 : currentIdx + 1
        if (newIdx < 0 || newIdx >= dayPillars.length) return
        handleSelectDay(dayPillars[newIdx].day, selectedMonth, selectedYear)
      },
    }),
    [
      baziData,
      selectedLuck,
      selectedYear,
      selectedMonth,
      selectedDay,
      yearPillars,
      monthPillars,
      dayPillars,
      handleSelectLuck,
      handleSelectYear,
      handleSelectMonth,
      handleSelectDay,
    ]
  )

  // ── Auto-scroll selected card into view ──────────────────────────────────
  // With flex-row-reverse the scroll origin is on the right (scrollLeft is
  // negative in most browsers). We centre the selected card in the viewport.
  const scrollToSelected = (rowRef: React.RefObject<HTMLDivElement | null>) => {
    const container = rowRef.current
    if (!container) return
    const selected = container.querySelector('[data-selected="true"]')
    if (!selected) return
    const el = selected as HTMLElement
    // offsetLeft is still measured from the left content edge.
    // Target: centre the element horizontally in the visible area.
    const targetScroll =
      el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2
    container.scrollTo({ left: targetScroll, behavior: "smooth" })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => scrollToSelected(rowRefs[1]), [selectedLuck, yearPillars])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => scrollToSelected(rowRefs[2]), [selectedYear, monthPillars])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => scrollToSelected(rowRefs[3]), [selectedMonth, dayPillars])
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      pillars: luckPillars,
      loading: false,
      isActive: true,
      renderCard: (pillar: any, index: number) => {
        const { hsCombos: lhc, branchInteractions: lbi } =
          detectLuckPillarCombinations(pillar, baziData.four_pillars)
        return (
          <div
            key={index}
            data-selected={selectedLuck === index}
            className="min-w-0 flex-1"
          >
            <Pillar
              title={`Luck ${pillar.number} (大運)`}
              periodLabel="Period"
              periodValue={`${pillar.year_start}–${pillar.year_end}`}
              pillarData={pillar}
              isSelected={selectedLuck === index}
              onClick={() => handleSelectLuck(index)}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              hsCombos={lhc}
              branchInteractions={lbi}
              mode={mode}
              hideRelationships={collapsedRows[0]}
              className="w-full"
            />
          </div>
        )
      },
    },
    {
      pillars: yearPillars,
      loading: loadingYear,
      isActive: selectedLuck !== null,
      renderCard: (pillar: any, index: number) => {
        const { hsCombos: yhc, branchInteractions: ybi } =
          detectLuckPillarCombinations(pillar, baziData.four_pillars)
        return (
          <div
            key={index}
            data-selected={selectedYear === pillar.year}
            className="min-w-0 flex-1"
          >
            <Pillar
              title={`${pillar.year} (年柱)`}
              periodLabel="Age"
              periodValue={`Age ${pillar.age}`}
              pillarData={pillar}
              isSelected={selectedYear === pillar.year}
              onClick={() => handleSelectYear(pillar.year)}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              hsCombos={yhc}
              branchInteractions={ybi}
              mode={mode}
              hideRelationships={collapsedRows[1]}
              className="w-full"
            />
          </div>
        )
      },
    },
    {
      pillars: [...monthPillars].sort(
        (a, b) =>
          (a.gregorian_month ?? a.month) - (b.gregorian_month ?? b.month)
      ),
      loading: loadingMonth,
      isActive: selectedYear !== null,
      renderCard: (pillar: any, index: number) => {
        const { hsCombos: mhc, branchInteractions: mbi } =
          detectLuckPillarCombinations(pillar, baziData.four_pillars)
        return (
          <div
            key={index}
            data-selected={selectedMonth === pillar.month}
            className="min-w-0 flex-1"
          >
            <Pillar
              title={`${pillar.gregorian_month_label ?? pillar.month_english} (月柱)`}
              periodLabel="Month"
              periodValue={pillar.month_english}
              pillarData={pillar}
              isSelected={selectedMonth === pillar.month}
              onClick={() => handleSelectMonth(pillar.month, selectedYear!)}
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              hsCombos={mhc}
              branchInteractions={mbi}
              mode={mode}
              hideRelationships={collapsedRows[2]}
              size="small"
              className="w-full"
            />
          </div>
        )
      },
    },
    {
      pillars: dayPillars,
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
              onClick={() =>
                handleSelectDay(pillar.day, selectedMonth!, selectedYear!)
              }
              dayMasterName={dayMasterName}
              luckyStars={luckyStars}
              hsCombos={dhc}
              branchInteractions={dbi}
              mode={mode}
              hideRelationships={collapsedRows[3]}
              size="small"
            />
          </div>
        )
      },
    },
    {
      pillars: hourPillars,
      loading: loadingHour,
      isActive: selectedDay !== null,
      renderCard: (pillar: any, index: number) => {
        const { hsCombos: hhc, branchInteractions: hbi } =
          detectLuckPillarCombinations(pillar, baziData.four_pillars)
        return (
          <div key={index} className="min-w-0 flex-1">
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
              hideRelationships={collapsedRows[4]}
              size="small"
              className="w-full"
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

  // ── Notify parent of selection changes ───────────────────────────────────
  useEffect(() => {
    onSelectionChange?.({
      luck: selectedLuckData ?? null,
      year: selectedYearData ?? null,
      month: selectedMonthData ?? null,
      day: selectedDayData ?? null,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLuckData, selectedYearData, selectedMonthData, selectedDayData])

  return (
    <>
      <div className="flex w-full flex-col gap-0 overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
        {/* 5 Rows */}
        {rows.map((row, rowIndex) => {
          const meta = ROW_LABELS[rowIndex]
          const color = ROW_COLORS[rowIndex]
          const isLocked = !row.isActive

          return (
            <div
              key={rowIndex}
              className={`relative flex flex-col border-b border-border transition-opacity duration-300 last:border-b-0 ${isLocked ? "opacity-40" : "opacity-100"}`}
            >
              {/* Row Label */}
              <div
                className="flex items-center gap-1.5 px-3 py-1"
                style={{ borderLeft: `3px solid ${color}` }}
              >
                <span className="text-[16px] leading-none">{meta.icon}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[14px] font-bold text-foreground">
                    {meta.label}
                  </span>
                  <span className="text-[12px] font-medium text-muted-foreground">
                    {meta.zh}
                  </span>
                </div>

                {/* Reset button — on 10-Year Luck row */}
                {rowIndex === 0 && (
                  <button
                    onClick={handleReset}
                    className="ml-auto flex items-center gap-1 rounded-[10px] border border-primary/50 bg-primary/5 px-2 py-0.5 text-[12px] font-medium text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <svg
                      className="h-3 w-3"
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
                    Reset
                  </button>
                )}

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
                    text={(() => {
                      const mp = monthPillars.find(
                        (m) => m.month === selectedMonth
                      )
                      return (
                        mp?.gregorian_month_label ??
                        mp?.month_english ??
                        String(selectedMonth)
                      )
                    })()}
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
                className={`flex scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent flex-row-reverse flex-nowrap items-stretch gap-1.5 scroll-smooth px-3 pt-1 pb-1.5 hover:scrollbar-thumb-border/70 ${
                  rowIndex === 0 ||
                  rowIndex === 1 ||
                  rowIndex === 2 ||
                  rowIndex === 4
                    ? "w-full overflow-hidden"
                    : "overflow-x-auto"
                }`}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0,0,0,0.15) transparent",
                }}
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

              {/* Collapse/expand relationship indicators toggle (Bottom Left) */}
              {!isLocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleRowCollapse(rowIndex)
                  }}
                  className="absolute -bottom-3 left-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
                  title={
                    collapsedRows[rowIndex]
                      ? "Show combinations"
                      : "Hide combinations"
                  }
                >
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      collapsedRows[rowIndex] ? "" : "rotate-180"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
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
})

export default LuckPillarExplorer

function SelectedBadge({ color, text }: { color: string; text: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold"
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
