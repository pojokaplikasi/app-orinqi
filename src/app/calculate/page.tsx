/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  detectAllBranchInteractions,
  detectAllHSCombinations,
} from "@/lib/bazi/combinations"
import {
  calculateElementStructure,
  calculateTenGods,
} from "@/lib/bazi/element-analysis"
import { calculateLuckyStars } from "@/lib/bazi/lucky-stars"
import {
  calculateCurrentDayPillar,
  calculateCurrentLuckPillar,
  calculateCurrentMonthPillar,
  calculateCurrentYearPillar,
} from "@/lib/bazi/pillar-calculations"
import CompactPillarCard from "@/components/CompactPillarCard"
import DetailDialog from "@/components/DetailDialog"
import ElementStructure from "@/components/ElementStructure"
import HeroForm from "@/components/HeroForm"
import LuckyStars from "@/components/LuckyStars"
import Pillar from "@/components/Pillar"
import TenGods from "@/components/TenGods"

export default function BaziCalculator() {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [timezone, setTimezone] = useState("")
  const [gender, setGender] = useState<number | null>(null)
  const [unknownTime, setUnknownTime] = useState(false)
  const [mode, setMode] = useState<"classic" | "modern">("modern")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [baziData, setBaziData] = useState<any>(null)

  // Derived data
  const [luckyStars, setLuckyStars] = useState<any>(null)
  const [elementData, setElementData] = useState<any>(null)
  const [tenGodsData, setTenGodsData] = useState<any>(null)
  const [hsCombos, setHsCombos] = useState<any>(null)
  const [branchInteractions, setBranchInteractions] = useState<any>(null)
  const [currentPillars, setCurrentPillars] = useState<any>(null)

  // Selection state for drill-down
  const [selectedLuck, setSelectedLuck] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // Time period data
  const [yearPillars, setYearPillars] = useState<any[]>([])
  const [monthPillars, setMonthPillars] = useState<any[]>([])
  const [dayPillars, setDayPillars] = useState<any[]>([])
  const [hourPillars, setHourPillars] = useState<any[]>([])

  // Expanded Pillar State
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null)

  // Mobile Tab State for Destiny Insights
  const [activeInsightTab, setActiveInsightTab] = useState<
    "elements" | "stars" | "gods"
  >("elements")

  // Explorer State
  const [explorerStep, setExplorerStep] = useState<
    "luck" | "year" | "month" | "day" | "hour"
  >("luck")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [selectedHourData, setSelectedHourData] = useState<any>(null)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const explorerScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (baziData && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      setTimeout(() => {
        if (container) {
          container.scrollLeft =
            (container.scrollWidth - container.clientWidth) / 2
        }
      }, 100)
    }
  }, [baziData, currentPillars])

  const handleCalculate = async () => {
    setError("")

    if (!date) {
      setError("Please select a birth date.")
      return
    }
    if (!unknownTime && !time) {
      setError("Please select a birth time.")
      return
    }
    if (!timezone) {
      setError("Please select a timezone.")
      return
    }
    if (gender === null) {
      setError("Please select a gender.")
      return
    }

    setLoading(true)

    const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`

    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateTime: actualDateTime,
          location: timezone,
          gender: gender,
          unknownBirthTime: unknownTime,
        }),
      })

      if (!response.ok) throw new Error("Network response was not ok")

      const data = await response.json()
      setBaziData(data)

      // Calculate current pillars
      const now = new Date()
      const birthTimeData = { dateTime: actualDateTime }

      const currYear = calculateCurrentYearPillar(now, data.four_pillars)
      const currMonth = calculateCurrentMonthPillar(now, data.four_pillars)
      const currDay = calculateCurrentDayPillar(now, data.four_pillars)
      const currLuck = calculateCurrentLuckPillar(
        now,
        birthTimeData,
        data.four_pillars,
        data.luck_pillars
      )

      const currentPillarsObj = {
        luck: currLuck,
        year: currYear,
        month: currMonth,
        day: currDay,
      }

      setCurrentPillars(currentPillarsObj)

      // Calculate derived data
      const stars = calculateLuckyStars(data.four_pillars, currentPillarsObj)
      setLuckyStars(stars)

      const elements = calculateElementStructure(
        data.four_pillars,
        currentPillarsObj
      )
      setElementData(elements)

      const tenGods = calculateTenGods(data.four_pillars, currentPillarsObj)
      setTenGodsData(tenGods)

      const combos = detectAllHSCombinations(
        data.four_pillars,
        currentPillarsObj
      )
      setHsCombos(combos)

      const interactions = detectAllBranchInteractions(
        data.four_pillars,
        currentPillarsObj
      )
      setBranchInteractions(interactions)

      // Reset selections
      handleResetSelection()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetSelection = () => {
    setSelectedLuck(null)
    setSelectedYear(null)
    setSelectedMonth(null)
    setSelectedDay(null)
    setYearPillars([])
    setMonthPillars([])
    setDayPillars([])
    setHourPillars([])
    setExplorerStep("luck")
  }

  // Fetch Year Pillars when Luck Pillar is selected
  useEffect(() => {
    if (selectedLuck !== null && baziData) {
      const luckPillar = baziData.luck_pillars.luck_pillars[selectedLuck]
      const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`

      fetch("/api/calculate_yearly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_year: luckPillar.year_start,
          end_year: luckPillar.year_end,
          birth_time: actualDateTime,
        }),
      })
        .then((res) => res.json())
        .then((data) => setYearPillars(data.yearly_pillars))
        .catch(console.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLuck, baziData])

  // Fetch Month Pillars when Year Pillar is selected
  useEffect(() => {
    if (selectedYear !== null && baziData) {
      const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`

      fetch("/api/calculate_monthly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: selectedYear,
          birth_time: actualDateTime,
        }),
      })
        .then((res) => res.json())
        .then((data) => setMonthPillars(data.monthly_pillars))
        .catch(console.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, baziData])

  // Fetch Day Pillars when Month Pillar is selected
  useEffect(() => {
    if (selectedMonth !== null && selectedYear !== null && baziData) {
      const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`

      fetch("/api/calculate_daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: selectedYear,
          month: selectedMonth,
          birth_time: actualDateTime,
        }),
      })
        .then((res) => res.json())
        .then((data) => setDayPillars(data.daily_pillars))
        .catch(console.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear, baziData])

  // Fetch Hour Pillars when Day Pillar is selected
  useEffect(() => {
    if (
      selectedDay !== null &&
      selectedMonth !== null &&
      selectedYear !== null &&
      baziData
    ) {
      const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`

      fetch("/api/calculate_hourly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
          birth_time: actualDateTime,
        }),
      })
        .then((res) => res.json())
        .then((data) => setHourPillars(data.hourly_pillars))
        .catch(console.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, selectedMonth, selectedYear, baziData])

  // Auto-scroll explorer to center selected item
  useEffect(() => {
    if (explorerScrollRef.current) {
      const container = explorerScrollRef.current
      const selectedElement = container.querySelector('[data-selected="true"]')
      if (selectedElement) {
        const containerWidth = container.clientWidth
        const elementOffset = (selectedElement as HTMLElement).offsetLeft
        const elementWidth = (selectedElement as HTMLElement).clientWidth
        container.scrollTo({
          left: elementOffset - containerWidth / 2 + elementWidth / 2,
          behavior: "smooth",
        })
      }
    }
  }, [explorerStep, selectedLuck, selectedYear, selectedMonth, selectedDay])

  // Helper to get selected pillar data
  const getSelectedLuckData = () =>
    selectedLuck !== null
      ? baziData?.luck_pillars?.luck_pillars[selectedLuck]
      : null
  const getSelectedYearData = () =>
    yearPillars.find((p) => p.year === selectedYear)
  const getSelectedMonthData = () =>
    monthPillars.find((p) => p.month === selectedMonth)
  const getSelectedDayData = () => dayPillars.find((p) => p.day === selectedDay)

  const steps = [
    { id: "luck", label: "10-Year", color: "var(--color-primary)" },
    { id: "year", label: "Year", color: "var(--color-chart-1)" },
    { id: "month", label: "Month", color: "var(--color-chart-2)" },
    { id: "day", label: "Day", color: "var(--color-chart-3)" },
    { id: "hour", label: "Hour", color: "var(--color-chart-4)" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === explorerStep)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="row justify-center">
          <div className="col-md-10 mx-auto w-full max-w-[1400px]">
            <HeroForm
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              timezone={timezone}
              setTimezone={setTimezone}
              gender={gender}
              setGender={setGender}
              unknownTime={unknownTime}
              setUnknownTime={setUnknownTime}
              mode={mode}
              setMode={setMode}
              onCalculate={handleCalculate}
              loading={loading}
              baziData={baziData}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto mb-8 flex-1 px-4">
        <div className="row justify-center">
          <div className="col-md-10 mx-auto w-full max-w-[1400px]">
            {error && (
              <div className="mt-6 mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
                {error}
              </div>
            )}

            {/* Results Section */}
            {baziData && (
              <div className="mt-8 flex flex-col gap-12">
                {/* Combined Chart Section */}
                <div className="relative flex w-full flex-col rounded-[24px] border border-border bg-card/70 p-6 shadow-sm backdrop-blur-[20px] md:p-8">
                  {/* Header */}
                  <div className="mb-3 flex flex-col items-center justify-center border-b border-border pb-4">
                    <h3 className="text-center text-[20px] font-bold text-foreground md:text-[24px]">
                      Natal Chart & Current Transits
                    </h3>
                  </div>

                  {/* Horizontal Scroll Guide */}
                  <div className="mb-4 flex flex-col items-center justify-center opacity-50">
                    <div className="flex w-full max-w-[300px] items-center justify-center gap-3">
                      <div className="h-[1px] flex-1 bg-border"></div>
                      <span className="text-[12px] font-medium whitespace-nowrap text-muted-foreground">
                        ← Scroll to Explore →
                      </span>
                      <div className="h-[1px] flex-1 bg-border"></div>
                    </div>
                    <span className="mt-1 text-[11px] text-muted-foreground">
                      Default view is centered on the current time pillars.
                    </span>
                  </div>

                  <div
                    ref={scrollContainerRef}
                    className="flex w-full scrollbar-thin flex-row flex-nowrap items-stretch gap-4 overflow-x-auto pb-6 pt-1 px-1"
                  >
                    {/* Natal Chart */}
                    {!unknownTime ? (
                      <Pillar
                        title="Hour Pillar (時柱)"
                        pillarData={baziData.four_pillars.hour_pillar}
                        luckyStars={luckyStars}
                        hsCombos={hsCombos?.H}
                        branchInteractions={branchInteractions?.H}
                        dayMasterName={
                          baziData.four_pillars.day_pillar?.heavenly_stem?.name
                        }
                        isExpanded={expandedPillarId === "natal-H"}
                        onToggleExpand={() =>
                          setExpandedPillarId(
                            expandedPillarId === "natal-H" ? null : "natal-H"
                          )
                        }
                      />
                    ) : (
                      <div className="relative box-border flex h-full min-h-[450px] w-[150px] flex-none flex-col gap-3 rounded-[20px] border border-t-[4px] border-border border-t-primary bg-card/70 p-4 text-center text-foreground shadow-sm backdrop-blur-[20px] transition-all duration-200 md:w-[180px] lg:w-[200px]">
                        <div className="relative flex w-full items-start justify-between min-h-[40px]">
                          <div className="flex flex-col items-start text-left">
                            <span className="text-[13px] leading-tight font-semibold text-foreground">
                              Hour Pillar
                            </span>
                            <span className="text-[11px] text-muted-foreground opacity-50">
                              時柱
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-col items-center justify-center">
                          <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[48px] leading-none text-muted-foreground drop-shadow-sm">
                            ?
                          </strong>
                        </div>
                        <div className="my-1 h-[1px] w-full bg-border"></div>
                        <div className="relative flex flex-col items-center justify-center">
                          <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[44px] leading-none text-muted-foreground drop-shadow-sm">
                            ?
                          </strong>
                        </div>
                        <div className="mt-1 flex min-h-[40px] w-full justify-center gap-2 rounded-[12px] bg-muted/50 p-[10px]">
                          <span className="text-[12px] font-medium text-muted-foreground">
                            N/A
                          </span>
                        </div>
                        <div className="mt-1 flex flex-col items-center justify-center">
                          <span className="text-center text-[12px] leading-tight font-semibold text-muted-foreground">
                            N/A
                          </span>
                        </div>
                        <div className="my-1 h-[1px] w-full bg-border"></div>
                        <div className="flex items-center justify-center">
                          <span className="text-[13px] font-bold tracking-wide text-muted-foreground uppercase">
                            N/A
                          </span>
                        </div>
                      </div>
                    )}
                    <Pillar
                      title="Day Pillar (日柱)"
                      pillarData={baziData.four_pillars.day_pillar}
                      luckyStars={luckyStars}
                      hsCombos={hsCombos?.D}
                      branchInteractions={branchInteractions?.D}
                      dayMasterName={
                        baziData.four_pillars.day_pillar?.heavenly_stem?.name
                      }
                      isExpanded={expandedPillarId === "natal-D"}
                      onToggleExpand={() =>
                        setExpandedPillarId(
                          expandedPillarId === "natal-D" ? null : "natal-D"
                        )
                      }
                    />
                    <Pillar
                      title="Month Pillar (月柱)"
                      pillarData={baziData.four_pillars.month_pillar}
                      luckyStars={luckyStars}
                      hsCombos={hsCombos?.M}
                      branchInteractions={branchInteractions?.M}
                      dayMasterName={
                        baziData.four_pillars.day_pillar?.heavenly_stem?.name
                      }
                      isExpanded={expandedPillarId === "natal-M"}
                      onToggleExpand={() =>
                        setExpandedPillarId(
                          expandedPillarId === "natal-M" ? null : "natal-M"
                        )
                      }
                    />
                    <Pillar
                      title="Year Pillar (年柱)"
                      pillarData={baziData.four_pillars.year_pillar}
                      luckyStars={luckyStars}
                      hsCombos={hsCombos?.Y}
                      branchInteractions={branchInteractions?.Y}
                      dayMasterName={
                        baziData.four_pillars.day_pillar?.heavenly_stem?.name
                      }
                      isExpanded={expandedPillarId === "natal-Y"}
                      onToggleExpand={() =>
                        setExpandedPillarId(
                          expandedPillarId === "natal-Y" ? null : "natal-Y"
                        )
                      }
                    />

                    {/* Divider */}
                    <div className="mx-2 w-[2px] flex-shrink-0 rounded-full bg-border"></div>

                    {/* Current Transits */}
                    <Pillar
                      title="Current Cycle"
                      pillarData={currentPillars?.luck}
                      isCurrent
                      luckyStars={luckyStars}
                      hsCombos={hsCombos?.CL}
                      branchInteractions={branchInteractions?.CL}
                      periodLabel="Period"
                      periodValue={currentPillars?.luck?.luck_period}
                      dayMasterName={
                        baziData.four_pillars.day_pillar?.heavenly_stem?.name
                      }
                      isExpanded={expandedPillarId === "transit-L"}
                      onToggleExpand={() =>
                        setExpandedPillarId(
                          expandedPillarId === "transit-L" ? null : "transit-L"
                        )
                      }
                    />
                    <Pillar
                      title="Current Year"
                      pillarData={currentPillars?.year}
                      isCurrent
                      luckyStars={luckyStars}
                      hsCombos={hsCombos?.CY}
                      branchInteractions={branchInteractions?.CY}
                      periodLabel="Year"
                      periodValue={currentPillars?.year?.year?.toString()}
                      dayMasterName={
                        baziData.four_pillars.day_pillar?.heavenly_stem?.name
                      }
                      isExpanded={expandedPillarId === "transit-Y"}
                      onToggleExpand={() =>
                        setExpandedPillarId(
                          expandedPillarId === "transit-Y" ? null : "transit-Y"
                        )
                      }
                    />
                    <Pillar
                      title="Current Month"
                      pillarData={currentPillars?.month}
                      isCurrent
                      luckyStars={luckyStars}
                      hsCombos={hsCombos?.CM}
                      branchInteractions={branchInteractions?.CM}
                      periodLabel="Month"
                      periodValue={currentPillars?.month?.month_english}
                      dayMasterName={
                        baziData.four_pillars.day_pillar?.heavenly_stem?.name
                      }
                      isExpanded={expandedPillarId === "transit-M"}
                      onToggleExpand={() =>
                        setExpandedPillarId(
                          expandedPillarId === "transit-M" ? null : "transit-M"
                        )
                      }
                    />
                    <Pillar
                      title="Current Day"
                      pillarData={currentPillars?.day}
                      isCurrent
                      luckyStars={luckyStars}
                      hsCombos={hsCombos?.CD}
                      branchInteractions={branchInteractions?.CD}
                      periodLabel="Day"
                      periodValue={currentPillars?.day?.day?.toString()}
                      dayMasterName={
                        baziData.four_pillars.day_pillar?.heavenly_stem?.name
                      }
                      isExpanded={expandedPillarId === "transit-D"}
                      onToggleExpand={() =>
                        setExpandedPillarId(
                          expandedPillarId === "transit-D" ? null : "transit-D"
                        )
                      }
                    />
                  </div>

                  {/* Legend (Bottom Right) */}
                  <div className="mt-4 flex flex-col items-end gap-2">
                    <div className="flex flex-wrap items-center justify-end gap-3 rounded-[12px] border border-border bg-muted/30 px-3 py-2 text-[11px] font-medium text-muted-foreground">
                      <div
                        className="flex items-center gap-1.5"
                        title="Seasonal Unions, Three Harmonies, Six Harmonies, Hidden Combinations"
                      >
                        <div className="h-2 w-2 rounded-full bg-[var(--color-chart-3)]"></div>
                        <span>Positive</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5"
                        title="Informational Items"
                      >
                        <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                        <span>Neutral</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5"
                        title="Self Punishment, Ungrateful Punishment"
                      >
                        <div className="h-2 w-2 rounded-full bg-[var(--color-chart-2)]"></div>
                        <span>Warning</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5"
                        title="Clashes, Harms, Destruction, Half Combinations"
                      >
                        <div className="h-2 w-2 rounded-full bg-destructive"></div>
                        <span>Negative</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5"
                        title="Life Stage, Rare Combinations, Special Indicators"
                      >
                        <div className="h-2 w-2 rounded-full bg-[var(--color-chart-1)]"></div>
                        <span>Special</span>
                      </div>
                    </div>

                    {/* Ten Gods Legend */}
                    <div className="flex max-w-[600px] flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[10px] font-medium text-muted-foreground">
                      <span title="Direct Wealth">DW: Direct Wealth</span>
                      <span title="Indirect Wealth">IW: Indirect Wealth</span>
                      <span title="Direct Officer">DO: Direct Officer</span>
                      <span title="Seven Killings">7K: Seven Killings</span>
                      <span title="Direct Resource">DR: Direct Resource</span>
                      <span title="Indirect Resource">
                        IR: Indirect Resource
                      </span>
                      <span title="Eating God">EG: Eating God</span>
                      <span title="Hurting Officer">HO: Hurting Officer</span>
                      <span title="Friend">F: Friend</span>
                      <span title="Rob Wealth">RW: Rob Wealth</span>
                    </div>
                  </div>
                </div>

                {/* Destiny Insights Dashboard */}
                <div className="flex w-full flex-col rounded-[28px] border border-border bg-card/70 p-8 shadow-sm backdrop-blur-[24px]">
                  {/* Dashboard Header */}
                  <div className="mb-8 flex flex-col items-center justify-center">
                    <h3 className="text-center text-[32px] leading-tight font-bold text-foreground">
                      Destiny Insights
                    </h3>
                    <p className="mt-2 text-center text-[15px] text-muted-foreground">
                      Understand the balance of your chart, stars, and life
                      influences.
                    </p>
                  </div>

                  {/* Mobile Tabs (Hidden on Desktop) */}
                  <div className="mx-auto mb-8 flex w-full max-w-[400px] rounded-[16px] bg-muted p-1 lg:hidden">
                    <button
                      onClick={() => setActiveInsightTab("elements")}
                      className={`flex-1 rounded-[12px] py-2.5 text-[14px] font-semibold transition-all duration-200 ${activeInsightTab === "elements" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Elements
                    </button>
                    <button
                      onClick={() => setActiveInsightTab("stars")}
                      className={`flex-1 rounded-[12px] py-2.5 text-[14px] font-semibold transition-all duration-200 ${activeInsightTab === "stars" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Stars
                    </button>
                    <button
                      onClick={() => setActiveInsightTab("gods")}
                      className={`flex-1 rounded-[12px] py-2.5 text-[14px] font-semibold transition-all duration-200 ${activeInsightTab === "gods" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      10 Gods
                    </button>
                  </div>

                  {/* Dashboard Grid */}
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left Column: Element Composition */}
                    <div
                      className={`flex-col lg:order-2 lg:col-span-4 ${activeInsightTab === "elements" ? "flex" : "hidden lg:flex"}`}
                    >
                      <h4 className="mb-4 text-center text-[18px] font-bold text-foreground">
                        Element Composition
                      </h4>
                      <ElementStructure elementData={elementData} />
                    </div>

                    {/* Middle Column: Lucky Stars */}
                    <div
                      className={`flex-col lg:order-1 lg:col-span-4 ${activeInsightTab === "stars" ? "flex" : "hidden lg:flex"}`}
                    >
                      <h4 className="mb-4 text-center text-[18px] font-bold text-foreground lg:text-left">
                        Lucky Stars
                      </h4>
                      <LuckyStars stars={luckyStars} mode={mode} />
                    </div>

                    {/* Right Column: 10 Gods */}
                    <div
                      className={`flex-col lg:order-3 lg:col-span-4 ${activeInsightTab === "gods" ? "flex" : "hidden lg:flex"}`}
                    >
                      <h4 className="mb-4 text-center text-[18px] font-bold text-foreground lg:text-left">
                        10 Gods
                      </h4>
                      <TenGods tenGodsData={tenGodsData} />
                    </div>
                  </div>

                  {/* Insight Card (Full Width Bottom) */}
                  <div className="mt-8 w-full rounded-[20px] border border-border bg-card/60 p-6 shadow-sm backdrop-blur-[20px]">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-[20px]">💡</span>
                      <span className="text-[16px] font-bold text-foreground">
                        Destiny Insight
                      </span>
                    </div>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">
                      Your chart shows a unique distribution of elements. The
                      balance between these energies shapes your approach to
                      life, relationships, and career. Pay attention to the
                      dominant elements and how the annual transits interact
                      with your natal chart.
                    </p>
                  </div>
                </div>

                <hr className="my-1 h-[1px] border-none bg-border" />

                {/* Interactive Explorer Experience */}
                <div className="relative flex w-full flex-col gap-6 lg:flex-row">
                  {/* Mobile Sidebar Toggle */}
                  <button
                    className="flex w-full items-center justify-between rounded-[16px] border border-border bg-card/70 p-4 shadow-sm backdrop-blur-[20px] lg:hidden"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    <span className="font-bold text-foreground">
                      Current Selection
                    </span>
                    <span className="text-primary">
                      {isSidebarOpen ? "Close" : "View"}
                    </span>
                  </button>

                  {/* Sidebar */}
                  <div
                    className={`flex flex-shrink-0 flex-col gap-4 transition-all duration-300 lg:w-[320px] ${isSidebarOpen ? "block" : "hidden lg:flex"}`}
                  >
                    {/* Sidebar Header */}
                    <div className="rounded-[20px] border border-border bg-card/70 p-6 shadow-sm backdrop-blur-[20px]">
                      <h3 className="flex items-center gap-2 text-[20px] font-bold text-foreground">
                        <span>✨</span> Luck Pillars Explorer
                      </h3>
                      <p className="mt-2 text-[13px] text-muted-foreground">
                        Explore your destiny cycles step by step.
                      </p>
                    </div>

                    {/* Current Selection Panel */}
                    <div className="flex-1 rounded-[20px] border border-border bg-card/60 p-6 shadow-sm backdrop-blur-[20px]">
                      <h4 className="mb-6 text-[16px] font-bold text-foreground">
                        Current Selection
                      </h4>

                      <div className="relative flex flex-col gap-0">
                        {/* Vertical Line */}
                        <div className="absolute top-[10px] bottom-[10px] left-[7px] z-0 w-[2px] bg-border"></div>

                        {/* 10-Year Selection */}
                        <div className="relative z-10 mb-6 flex gap-4">
                          <div
                            className={`mt-1 h-[16px] w-[16px] flex-shrink-0 rounded-full border-4 border-background shadow-sm ${selectedLuck !== null ? "bg-[var(--color-primary)]" : "bg-muted"}`}
                          ></div>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-semibold text-muted-foreground">
                              10-Year Luck
                            </span>
                            {selectedLuck !== null ? (
                              <>
                                <span className="text-[14px] font-bold text-foreground">
                                  {getSelectedLuckData()?.year_start}–
                                  {getSelectedLuckData()?.year_end}
                                </span>
                                <span className="mt-1 text-[13px] text-muted-foreground">
                                  {getSelectedLuckData()?.heavenly_stem?.name}{" "}
                                  {getSelectedLuckData()?.earthly_branch?.name}
                                </span>
                              </>
                            ) : (
                              <span className="mt-1 text-[13px] text-muted-foreground italic">
                                Not selected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Year Selection */}
                        <div className="relative z-10 mb-6 flex gap-4">
                          <div
                            className={`mt-1 h-[16px] w-[16px] flex-shrink-0 rounded-full border-4 border-background shadow-sm ${selectedYear !== null ? "bg-[var(--color-chart-1)]" : "bg-muted"}`}
                          ></div>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-semibold text-muted-foreground">
                              Year Pillar
                            </span>
                            {selectedYear !== null ? (
                              <>
                                <span className="text-[14px] font-bold text-foreground">
                                  {selectedYear}
                                </span>
                                <span className="mt-1 text-[13px] text-muted-foreground">
                                  {getSelectedYearData()?.heavenly_stem?.name}{" "}
                                  {getSelectedYearData()?.earthly_branch?.name}
                                </span>
                              </>
                            ) : (
                              <span className="mt-1 text-[13px] text-muted-foreground italic">
                                Not selected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Month Selection */}
                        <div className="relative z-10 mb-6 flex gap-4">
                          <div
                            className={`mt-1 h-[16px] w-[16px] flex-shrink-0 rounded-full border-4 border-background shadow-sm ${selectedMonth !== null ? "bg-[var(--color-chart-2)]" : "bg-muted"}`}
                          ></div>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-semibold text-muted-foreground">
                              Month Pillar
                            </span>
                            {selectedMonth !== null ? (
                              <>
                                <span className="text-[14px] font-bold text-foreground">
                                  {getSelectedMonthData()?.month_english}{" "}
                                  {selectedYear}
                                </span>
                                <span className="mt-1 text-[13px] text-muted-foreground">
                                  {getSelectedMonthData()?.heavenly_stem?.name}{" "}
                                  {getSelectedMonthData()?.earthly_branch?.name}
                                </span>
                              </>
                            ) : (
                              <span className="mt-1 text-[13px] text-muted-foreground italic">
                                Not selected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Day Selection */}
                        <div className="relative z-10 mb-6 flex gap-4">
                          <div
                            className={`mt-1 h-[16px] w-[16px] flex-shrink-0 rounded-full border-4 border-background shadow-sm ${selectedDay !== null ? "bg-[var(--color-chart-3)]" : "bg-muted"}`}
                          ></div>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-semibold text-muted-foreground">
                              Day Pillar
                            </span>
                            {selectedDay !== null ? (
                              <>
                                <span className="text-[14px] font-bold text-foreground">
                                  Day {selectedDay}
                                </span>
                                <span className="mt-1 text-[13px] text-muted-foreground">
                                  {getSelectedDayData()?.heavenly_stem?.name}{" "}
                                  {getSelectedDayData()?.earthly_branch?.name}
                                </span>
                              </>
                            ) : (
                              <span className="mt-1 text-[13px] text-muted-foreground italic">
                                Not selected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Hour Selection */}
                        <div className="relative z-10 flex gap-4">
                          <div
                            className={`mt-1 h-[16px] w-[16px] flex-shrink-0 rounded-full border-4 border-background bg-muted shadow-sm`}
                          ></div>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-semibold text-muted-foreground">
                              Hour Pillar
                            </span>
                            <span className="mt-1 text-[13px] text-muted-foreground italic">
                              Not selected
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="rounded-[20px] border border-border bg-card/50 p-5 backdrop-blur-[20px]">
                      <h4 className="mb-3 text-[14px] font-bold text-foreground">
                        How to Use
                      </h4>
                      <ol className="list-decimal space-y-2 pl-4 text-[12px] text-muted-foreground">
                        <li>Start from 10-Year Luck Pillars</li>
                        <li>Select a specific Year</li>
                        <li>Select Month</li>
                        <li>Select Day</li>
                        <li>Select Hour</li>
                        <li>Explore detailed influence</li>
                      </ol>
                    </div>
                  </div>

                  {/* Main Explorer Area */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    {/* Top Breadcrumb */}
                    <div className="mb-4 flex flex-wrap items-center gap-2 px-2 text-[14px] text-muted-foreground">
                      <span
                        className={`cursor-pointer hover:text-foreground ${explorerStep === "luck" ? "font-semibold text-foreground" : ""}`}
                        onClick={() => setExplorerStep("luck")}
                      >
                        10-Year Luck Breadcrumb
                      </span>
                    </div>

                    {/* Progress Navigation */}
                    <div className="mb-8 flex items-center justify-between px-2">
                      {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                          <div
                            className="flex cursor-pointer flex-col items-center gap-2"
                            onClick={() => {
                              // Only allow clicking if previous steps are completed
                              if (index === 0) setExplorerStep("luck")
                              if (index === 1 && selectedLuck !== null)
                                setExplorerStep("year")
                              if (index === 2 && selectedYear !== null)
                                setExplorerStep("month")
                              if (index === 3 && selectedMonth !== null)
                                setExplorerStep("day")
                              if (index === 4 && selectedDay !== null)
                                setExplorerStep("hour")
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                                  index <= currentStepIndex
                                    ? "scale-125"
                                    : "opacity-30"
                                }`}
                                style={{
                                  backgroundColor:
                                    index <= currentStepIndex
                                      ? step.color
                                      : "var(--muted-foreground)",
                                }}
                              ></div>
                              <span
                                className={`hidden text-[13px] transition-all duration-300 sm:block ${
                                  index === currentStepIndex
                                    ? "font-bold text-foreground"
                                    : index < currentStepIndex
                                      ? "font-medium text-muted-foreground"
                                      : "text-muted-foreground opacity-50"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          </div>
                          {index < steps.length - 1 && (
                            <div className="relative mx-2 h-[2px] flex-1 overflow-hidden rounded-full bg-border sm:mx-4">
                              <div
                                className="absolute top-0 bottom-0 left-0 transition-all duration-500"
                                style={{
                                  width:
                                    index < currentStepIndex ? "100%" : "0%",
                                  backgroundColor: steps[index].color,
                                }}
                              ></div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Explorer Hero Area */}
                    <div
                      className="relative mb-8 flex h-[180px] flex-col justify-center overflow-hidden rounded-[24px] border border-border/50 p-6 shadow-sm sm:h-[220px] sm:p-8"
                      style={{
                        background:
                          "linear-gradient(180deg, hsl(var(--card) / 0.8) 0%, hsl(var(--card) / 0.4) 100%)",
                      }}
                    >
                      {/* Abstract Background Elements */}
                      <div
                        className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-20 blur-[40px]"
                        style={{
                          backgroundColor: steps[currentStepIndex].color,
                        }}
                      ></div>
                      <div
                        className="absolute right-20 -bottom-10 h-32 w-32 rounded-full opacity-10 blur-[30px]"
                        style={{
                          backgroundColor: steps[currentStepIndex].color,
                        }}
                      ></div>

                      <div className="relative z-10">
                        <span
                          className="mb-2 block text-[12px] font-bold tracking-wider uppercase"
                          style={{ color: steps[currentStepIndex].color }}
                        >
                          Step {currentStepIndex + 1} of 5
                        </span>
                        <h2 className="mb-3 text-[24px] font-bold text-foreground sm:text-[32px]">
                          {explorerStep === "luck" && "Select 10-Year Luck"}
                          {explorerStep === "year" && "Select Year Pillar"}
                          {explorerStep === "month" && "Select Month Pillar"}
                          {explorerStep === "day" && "Select Day Pillar"}
                          {explorerStep === "hour" && "Select Hour Pillar"}
                        </h2>
                        <p className="max-w-[400px] text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                          {explorerStep === "luck" &&
                            "Choose a 10-year period to explore the overarching themes and energies of that decade."}
                          {explorerStep === "year" &&
                            `Choose a year within the ${getSelectedLuckData()?.year_start}–${getSelectedLuckData()?.year_end} period to explore annual influences.`}
                          {explorerStep === "month" &&
                            `Choose a month within ${selectedYear} to explore more detailed seasonal influences.`}
                          {explorerStep === "day" &&
                            `Choose a specific day in ${getSelectedMonthData()?.month_english} ${selectedYear} to see daily energies.`}
                          {explorerStep === "hour" &&
                            `Explore the two-hour periods for Day ${selectedDay}.`}
                        </p>
                      </div>
                    </div>

                    {/* Pillar Cards Area */}
                    <div className="relative w-full">
                      <div
                        ref={explorerScrollRef}
                        className="-mx-4 flex scrollbar-thin flex-row flex-nowrap items-stretch gap-4 overflow-x-auto scroll-smooth px-4 pt-4 pb-8"
                      >
                        {/* 10-Year Luck Pillars */}
                        {explorerStep === "luck" &&
                          baziData.luck_pillars.luck_pillars.map(
                            (pillar: any, index: number) => (
                              <div
                                key={index}
                                data-selected={selectedLuck === index}
                              >
                                <CompactPillarCard
                                  title={`Luck ${pillar.number}`}
                                  subtitle={`${pillar.year_start}-${pillar.year_end}`}
                                  pillarData={pillar}
                                  isSelected={selectedLuck === index}
                                  onClick={() => {
                                    setSelectedLuck(index)
                                    setTimeout(
                                      () => setExplorerStep("year"),
                                      300
                                    )
                                  }}
                                  color="var(--color-primary)"
                                  dayMasterName={
                                    baziData.four_pillars.day_pillar
                                      ?.heavenly_stem?.name
                                  }
                                  luckyStars={luckyStars}
                                />
                              </div>
                            )
                          )}

                        {/* Year Pillars */}
                        {explorerStep === "year" &&
                          yearPillars.map((pillar, index) => (
                            <div
                              key={index}
                              data-selected={selectedYear === pillar.year}
                            >
                              <CompactPillarCard
                                title={pillar.year.toString()}
                                subtitle={`Age ${pillar.age}`}
                                pillarData={pillar}
                                isSelected={selectedYear === pillar.year}
                                onClick={() => {
                                  setSelectedYear(pillar.year)
                                  setTimeout(
                                    () => setExplorerStep("month"),
                                    300
                                  )
                                }}
                                color="var(--color-chart-1)"
                                dayMasterName={
                                  baziData.four_pillars.day_pillar
                                    ?.heavenly_stem?.name
                                }
                                luckyStars={luckyStars}
                              />
                            </div>
                          ))}

                        {/* Month Pillars */}
                        {explorerStep === "month" &&
                          monthPillars.map((pillar, index) => (
                            <div
                              key={index}
                              data-selected={selectedMonth === pillar.month}
                            >
                              <CompactPillarCard
                                title={pillar.month_english}
                                subtitle={`Month ${pillar.month}`}
                                pillarData={pillar}
                                isSelected={selectedMonth === pillar.month}
                                onClick={() => {
                                  setSelectedMonth(pillar.month)
                                  setTimeout(() => setExplorerStep("day"), 300)
                                }}
                                color="var(--color-chart-2)"
                                dayMasterName={
                                  baziData.four_pillars.day_pillar
                                    ?.heavenly_stem?.name
                                }
                                luckyStars={luckyStars}
                              />
                            </div>
                          ))}

                        {/* Day Pillars */}
                        {explorerStep === "day" &&
                          dayPillars.map((pillar, index) => (
                            <div
                              key={index}
                              data-selected={selectedDay === pillar.day}
                            >
                              <CompactPillarCard
                                title={`Day ${pillar.day}`}
                                subtitle={
                                  getSelectedMonthData()?.month_english || ""
                                }
                                pillarData={pillar}
                                isSelected={selectedDay === pillar.day}
                                onClick={() => {
                                  setSelectedDay(pillar.day)
                                  setTimeout(() => setExplorerStep("hour"), 300)
                                }}
                                color="var(--color-chart-3)"
                                dayMasterName={
                                  baziData.four_pillars.day_pillar
                                    ?.heavenly_stem?.name
                                }
                                luckyStars={luckyStars}
                              />
                            </div>
                          ))}

                        {/* Hour Pillars */}
                        {explorerStep === "hour" &&
                          hourPillars.map((pillar, index) => (
                            <div key={index}>
                              <CompactPillarCard
                                title={pillar.hour_time}
                                subtitle={`Hour`}
                                pillarData={pillar}
                                isSelected={selectedHourData === pillar}
                                onClick={() => {
                                  setSelectedHourData(pillar)
                                  setIsDialogOpen(true)
                                }}
                                color="var(--color-chart-4)"
                                dayMasterName={
                                  baziData.four_pillars.day_pillar
                                    ?.heavenly_stem?.name
                                }
                                luckyStars={luckyStars}
                              />
                            </div>
                          ))}

                        {/* Empty States */}
                        {explorerStep === "year" &&
                          yearPillars.length === 0 && (
                            <div className="w-full py-12 text-center text-muted-foreground">
                              Please select a 10-Year Luck Pillar first.
                            </div>
                          )}
                        {explorerStep === "month" &&
                          monthPillars.length === 0 && (
                            <div className="w-full py-12 text-center text-muted-foreground">
                              Please select a Year Pillar first.
                            </div>
                          )}
                        {explorerStep === "day" && dayPillars.length === 0 && (
                          <div className="w-full py-12 text-center text-muted-foreground">
                            Please select a Month Pillar first.
                          </div>
                        )}
                        {explorerStep === "hour" &&
                          hourPillars.length === 0 && (
                            <div className="w-full py-12 text-center text-muted-foreground">
                              Please select a Day Pillar first.
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-6">
                      <button
                        onClick={() => {
                          if (explorerStep === "year") setExplorerStep("luck")
                          if (explorerStep === "month") setExplorerStep("year")
                          if (explorerStep === "day") setExplorerStep("month")
                          if (explorerStep === "hour") setExplorerStep("day")
                        }}
                        className={`rounded-[12px] px-5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                          explorerStep === "luck"
                            ? "pointer-events-none opacity-0"
                            : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        ← Change{" "}
                        {explorerStep === "year"
                          ? "10-Year Luck"
                          : explorerStep === "month"
                            ? "Year"
                            : explorerStep === "day"
                              ? "Month"
                              : explorerStep === "hour"
                                ? "Day"
                                : ""}
                      </button>

                      <button
                        onClick={() => {
                          if (explorerStep === "luck" && selectedLuck !== null)
                            setExplorerStep("year")
                          if (explorerStep === "year" && selectedYear !== null)
                            setExplorerStep("month")
                          if (
                            explorerStep === "month" &&
                            selectedMonth !== null
                          )
                            setExplorerStep("day")
                          if (explorerStep === "day" && selectedDay !== null)
                            setExplorerStep("hour")
                        }}
                        className={`rounded-[12px] px-5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                          (explorerStep === "luck" && selectedLuck === null) ||
                          (explorerStep === "year" && selectedYear === null) ||
                          (explorerStep === "month" &&
                            selectedMonth === null) ||
                          (explorerStep === "day" && selectedDay === null) ||
                          explorerStep === "hour"
                            ? "cursor-not-allowed bg-muted text-muted-foreground opacity-50"
                            : "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        }`}
                      >
                        Next →
                      </button>
                    </div>

                    {/* Floating Tip Card */}
                    <div className="mt-8 flex items-start gap-3 rounded-[20px] border border-border bg-card/70 p-4 shadow-sm backdrop-blur-[20px]">
                      <span className="text-[20px] leading-none">💡</span>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">
                        <strong className="text-foreground">Tip:</strong> Start
                        from 10-Year Luck Pillars and drill down to see more
                        specific influences. Your selections are saved in the
                        sidebar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <DetailDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedHourData={selectedHourData}
        selectedLuckData={getSelectedLuckData()}
        selectedYearData={getSelectedYearData()}
        selectedMonthData={getSelectedMonthData()}
        selectedDayData={getSelectedDayData()}
        selectedYear={selectedYear}
        selectedDay={selectedDay}
        baziData={baziData}
        luckyStars={luckyStars}
      />
    </div>
  )
}
