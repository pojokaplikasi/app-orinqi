/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { lazy, Suspense, useEffect, useRef, useState } from "react"
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
import HeroForm from "@/components/calculate-v2/HeroForm"
import StickyHeader from "@/components/calculate-v2/StickyHeader"
import LuckyStars from "@/components/calculate-v2/LuckyStars"
import Pillar from "@/components/calculate-v2/Pillar"
import TenGods from "@/components/calculate-v2/TenGods"
import BaziViewport from "@/components/calculate-v2/BaziViewport"

const LuckPillarExplorer = lazy(() => import("@/components/calculate-v2/LuckPillarExplorer"))
const ElementStructure = lazy(() => import("@/components/calculate-v2/ElementStructure"))

export default function BaziCalculator() {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [timezone, setTimezone] = useState("")
  const [gender, setGender] = useState<number | null>(null)
  const [unknownTime, setUnknownTime] = useState(false)
  const [mode, setMode] = useState<"classic" | "modern">("modern")
  const [chartName, setChartName] = useState("Your Destiny Chart")

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

  // Selection state for drill-down (managed inside LuckPillarExplorer)

  // Expanded Pillar State
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null)

  // Window size state
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  // Explorer state is managed inside LuckPillarExplorer

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Reset to current time function
  const handleResetToCurrentTime = () => {
    // Dispatch a custom event that LuckPillarExplorer can listen to
    window.dispatchEvent(new CustomEvent('reset-to-current-time'))
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

      // Reset selections (explorer manages its own state now)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Window Size Indicator */}
      <div className="fixed top-4 right-4 z-50 rounded-md bg-black/80 px-3 py-1.5 text-xs font-mono text-white shadow-lg backdrop-blur-sm">
        {windowSize.width}px × {windowSize.height}px
      </div>

      {/* Sticky header — independent component, fades in when hero scrolls out of view */}
      {baziData && (
        <StickyHeader
          chartName={chartName}
          date={date}
          time={time}
          unknownTime={unknownTime}
          timezone={timezone}
          gender={gender}
          mode={mode}
          setMode={setMode}
          heroRef={heroRef}
        />
      )}

      {/* ── Main Layout ── */}
      <div className="w-full flex-1 min-h-0 overflow-hidden">
        {error && (
          <div className="mt-6 mb-4 mx-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
            {error}
          </div>
        )}

        {/* Before calculation: centered form */}
        {!baziData && (
          <div className="px-4">
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
              heroRef={heroRef}
              chartName={chartName}
              setChartName={setChartName}
            />
          </div>
        )}

        {/* After calculation: grid layout */}
        {baziData && (
          <div className="h-full w-full min-h-0">
            <BaziViewport>
              {/* ── Main Grid: [Sidebar (2/12)] | [Content (10/12)] ── */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 h-full">

                {/* ── Sidebar (2/12) ── */}
                <div className="flex flex-col gap-4 lg:col-span-2">
                {/* Hero */}
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
                  heroRef={heroRef}
                  chartName={chartName}
                  setChartName={setChartName}
                />

                {/* TenGods */}
                <div className="rounded-[16px] border border-border bg-card p-4 shadow-sm">
                  <TenGods tenGodsData={tenGodsData} />
                </div>

                {/* Element Structure */}
                <div className="rounded-[16px] border border-border bg-card p-4 shadow-sm">
                  <Suspense fallback={<div className="h-40 animate-pulse rounded-[12px] bg-muted" />}>
                    <ElementStructure elementData={elementData} />
                  </Suspense>
                </div>

                {/* Lucky Stars */}
                <div className="flex flex-col rounded-[16px] border border-border bg-card p-4 shadow-sm">
                  <h4 className="mb-2 text-[14px] font-bold text-foreground">✨ Lucky Stars</h4>
                  <div className="flex-1">
                    <LuckyStars stars={luckyStars} mode={mode} />
                  </div>
                  <button
                    onClick={handleResetToCurrentTime}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] border border-primary/50 bg-primary/5 px-4 py-2 text-[13px] font-medium text-primary shadow-sm transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md"
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

                  {/* Legend */}
                  <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-[12px] border border-border bg-muted/20 px-3 py-2 text-[10px] font-medium text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[var(--color-chart-3)]"></div><span>Positive</span></div>
                      <div className="h-3 w-px bg-border"></div>
                      <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-muted-foreground"></div><span>Neutral</span></div>
                      <div className="h-3 w-px bg-border"></div>
                      <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[var(--color-chart-2)]"></div><span>Warning</span></div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-destructive"></div><span>Negative</span></div>
                      <div className="h-3 w-px bg-border"></div>
                      <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-[var(--color-chart-1)]"></div><span>Special</span></div>
                    </div>
                  </div>
                </div>
                </div>

                {/* ── Content (10/12) ── */}
                <div className="flex flex-col gap-4 lg:col-span-10">
                {/* 8 Pillars */}
                <div className="rounded-[16px] border border-border bg-card p-4 shadow-sm md:p-5" id="bazi-result-area">
                <div
                  ref={scrollContainerRef}
                  className="grid w-full gap-3 "
                  style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) 2px repeat(4, minmax(0, 1fr))' }}
                >
                  {!unknownTime ? (
                    <Pillar
                      title="Hour Pillar (時柱)"
                      pillarData={baziData.four_pillars.hour_pillar}
                      luckyStars={luckyStars}
                      hsCombos={hsCombos?.H}
                      branchInteractions={branchInteractions?.H}
                      dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                      isExpanded={expandedPillarId === "natal-H"}
                      onToggleExpand={() => setExpandedPillarId(expandedPillarId === "natal-H" ? null : "natal-H")}
                      mode={mode}
                    />
                  ) : (
                    <div className="relative box-border flex h-full min-h-[320px] w-full flex-col gap-3 rounded-[18px] border border-white/20 bg-gradient-to-b from-card/80 to-card/40 p-3 pt-4 text-center text-foreground backdrop-blur-[24px] transition-all duration-200">
                      <div className="relative flex w-full items-start justify-between min-h-[40px]">
                        <div className="flex flex-col items-start text-left">
                          <span className="text-[13px] leading-tight font-semibold text-foreground">Hour Pillar</span>
                          <span className="text-[11px] text-muted-foreground opacity-50">時柱</span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-col items-center justify-center">
                        <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[48px] leading-none text-muted-foreground drop-shadow-sm">?</strong>
                      </div>
                      <div className="my-1 h-[1px] w-full bg-border"></div>
                      <div className="relative flex flex-col items-center justify-center">
                        <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[44px] leading-none text-muted-foreground drop-shadow-sm">?</strong>
                      </div>
                      <div className="mt-1 flex min-h-[40px] w-full justify-center gap-2 rounded-[12px] bg-muted/50 p-[10px]">
                        <span className="text-[12px] font-medium text-muted-foreground">N/A</span>
                      </div>
                      <div className="mt-1 flex flex-col items-center justify-center">
                        <span className="text-center text-[12px] leading-tight font-semibold text-muted-foreground">N/A</span>
                      </div>
                      <div className="my-1 h-[1px] w-full bg-border"></div>
                      <div className="flex items-center justify-center">
                        <span className="text-[13px] font-bold tracking-wide text-muted-foreground uppercase">N/A</span>
                      </div>
                    </div>
                  )}
                  <Pillar
                    title="Day Pillar (日柱)"
                    pillarData={baziData.four_pillars.day_pillar}
                    luckyStars={luckyStars}
                    hsCombos={hsCombos?.D}
                    branchInteractions={branchInteractions?.D}
                    dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                    isExpanded={expandedPillarId === "natal-D"}
                    onToggleExpand={() => setExpandedPillarId(expandedPillarId === "natal-D" ? null : "natal-D")}
                    mode={mode}
                  />
                  <Pillar
                    title="Month Pillar (月柱)"
                    pillarData={baziData.four_pillars.month_pillar}
                    luckyStars={luckyStars}
                    hsCombos={hsCombos?.M}
                    branchInteractions={branchInteractions?.M}
                    dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                    isExpanded={expandedPillarId === "natal-M"}
                    onToggleExpand={() => setExpandedPillarId(expandedPillarId === "natal-M" ? null : "natal-M")}
                    mode={mode}
                  />
                  <Pillar
                    title="Year Pillar (年柱)"
                    pillarData={baziData.four_pillars.year_pillar}
                    luckyStars={luckyStars}
                    hsCombos={hsCombos?.Y}
                    branchInteractions={branchInteractions?.Y}
                    dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                    isExpanded={expandedPillarId === "natal-Y"}
                    onToggleExpand={() => setExpandedPillarId(expandedPillarId === "natal-Y" ? null : "natal-Y")}
                    mode={mode}
                  />
                  <div className="self-stretch rounded-full bg-border"></div>
                  <Pillar
                    title="Current Cycle"
                    pillarData={currentPillars?.luck}
                    isCurrent
                    luckyStars={luckyStars}
                    hsCombos={hsCombos?.CL}
                    branchInteractions={branchInteractions?.CL}
                    periodLabel="Period"
                    periodValue={currentPillars?.luck?.luck_period}
                    dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                    isExpanded={expandedPillarId === "transit-L"}
                    onToggleExpand={() => setExpandedPillarId(expandedPillarId === "transit-L" ? null : "transit-L")}
                    mode={mode}
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
                    dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                    isExpanded={expandedPillarId === "transit-Y"}
                    onToggleExpand={() => setExpandedPillarId(expandedPillarId === "transit-Y" ? null : "transit-Y")}
                    mode={mode}
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
                    dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                    isExpanded={expandedPillarId === "transit-M"}
                    onToggleExpand={() => setExpandedPillarId(expandedPillarId === "transit-M" ? null : "transit-M")}
                    mode={mode}
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
                    dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                    isExpanded={expandedPillarId === "transit-D"}
                    onToggleExpand={() => setExpandedPillarId(expandedPillarId === "transit-D" ? null : "transit-D")}
                    mode={mode}
                  />
                </div>
              </div>

              {/* Luck Pillar Explorer */}
              <Suspense fallback={<div className="h-64 animate-pulse rounded-[28px] bg-muted" />}>
                <LuckPillarExplorer
                  baziData={baziData}
                  luckyStars={luckyStars}
                  date={date}
                  time={time}
                  timezone={timezone}
                  unknownTime={unknownTime}
                  mode={mode}
                />
              </Suspense>
              </div>

              </div>
            </BaziViewport>
          </div>
        )}

      </div>
    </div>
  )
}
