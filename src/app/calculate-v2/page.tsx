/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { Suspense, lazy, useEffect, useRef, useState } from "react"
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
import LuckyStars from "@/components/calculate-v2/LuckyStars"
import Pillar from "@/components/calculate-v2/Pillar"
import StickyHeader from "@/components/calculate-v2/StickyHeader"
import TenGods from "@/components/calculate-v2/TenGods"

const LuckPillarExplorer = lazy(
  () => import("@/components/calculate-v2/LuckPillarExplorer")
)
const ElementStructure = lazy(
  () => import("@/components/calculate-v2/ElementStructure")
)

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

  // Explorer state is managed inside LuckPillarExplorer

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Legend — fixed bottom-left of page */}
      {baziData && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-medium text-muted-foreground shadow-sm">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[var(--color-chart-3)]"></div>
              <span>Positive</span>
            </div>
            <div className="h-3 w-px bg-border"></div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
              <span>Neutral</span>
            </div>
            <div className="h-3 w-px bg-border"></div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[var(--color-chart-2)]"></div>
              <span>Warning</span>
            </div>
            <div className="h-3 w-px bg-border"></div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-destructive"></div>
              <span>Negative</span>
            </div>
            <div className="h-3 w-px bg-border"></div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[var(--color-chart-1)]"></div>
              <span>Special</span>
            </div>
          </div>
        </div>
      )}

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
      <div className="w-full flex-1 px-4">
        {error && (
          <div className="mt-6 mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
            {error}
          </div>
        )}

        {/* Before calculation: centered form */}
        {!baziData && (
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
        )}

        {/* After calculation: grid layout */}
        {baziData && (
          <div className="flex flex-col gap-1 pb-4">
            {/* ── Baris 1: [Hero + TenGods + ElementStructure] | [8 Pillars] ── */}
            <div className="grid grid-cols-1 gap-1 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,5fr)]">
              {/* Col A: Hero (full-width) + TenGods | ElementStructure (side-by-side) */}
              <div className="flex flex-col gap-1">
                {/* Hero — full width */}
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
                {/* TenGods + LuckyStars side-by-side */}
                <div className="grid grid-cols-2 gap-1">
                  <div className="rounded-[16px] border border-border bg-card p-2 shadow-sm">
                    <TenGods tenGodsData={tenGodsData} />
                  </div>
                  <div className="rounded-[16px] border border-border bg-card p-2 shadow-sm">
                    <h4 className="mb-1 text-[14px] font-bold text-foreground">
                      ✨ Lucky Stars
                    </h4>
                    <LuckyStars stars={luckyStars} mode={mode} />
                  </div>
                </div>
              </div>

              {/* Col B: 8 Pillars */}
              <div
                className="rounded-[16px] border border-border bg-card p-2 shadow-sm md:p-3"
                id="bazi-result-area"
              >
                <div
                  ref={scrollContainerRef}
                  className="grid w-full gap-1"
                  style={{
                    gridTemplateColumns:
                      "repeat(4, minmax(0, 1fr)) 2px repeat(4, minmax(0, 1fr))",
                  }}
                >
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
                      mode={mode}
                    />
                  ) : (
                    <div className="relative box-border flex h-full min-h-[320px] w-full flex-col gap-1 rounded-[18px] border border-white/20 bg-gradient-to-b from-card/80 to-card/40 p-2 pt-2 text-center text-foreground backdrop-blur-[24px] transition-all duration-200">
                      <div className="relative flex min-h-[28px] w-full items-start justify-between">
                        <div className="flex flex-col items-start text-left">
                          <span className="text-[13px] leading-tight font-semibold text-foreground">
                            Hour Pillar
                          </span>
                          <span className="text-[11px] text-muted-foreground opacity-50">
                            時柱
                          </span>
                        </div>
                      </div>
                      <div className="mt-0.5 flex flex-col items-center justify-center">
                        <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[48px] leading-none text-muted-foreground drop-shadow-sm">
                          ?
                        </strong>
                      </div>
                      <div className="my-0.5 h-[1px] w-full bg-border"></div>
                      <div className="relative flex flex-col items-center justify-center">
                        <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[44px] leading-none text-muted-foreground drop-shadow-sm">
                          ?
                        </strong>
                      </div>
                      <div className="mt-0.5 flex min-h-[40px] w-full justify-center gap-1 rounded-[12px] bg-muted/50 p-1.5">
                        <span className="text-[12px] font-medium text-muted-foreground">
                          N/A
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-col items-center justify-center">
                        <span className="text-center text-[12px] leading-tight font-semibold text-muted-foreground">
                          N/A
                        </span>
                      </div>
                      <div className="my-0.5 h-[1px] w-full bg-border"></div>
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
                    mode={mode}
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
                    mode={mode}
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
                    dayMasterName={
                      baziData.four_pillars.day_pillar?.heavenly_stem?.name
                    }
                    isExpanded={expandedPillarId === "transit-L"}
                    onToggleExpand={() =>
                      setExpandedPillarId(
                        expandedPillarId === "transit-L" ? null : "transit-L"
                      )
                    }
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
                    dayMasterName={
                      baziData.four_pillars.day_pillar?.heavenly_stem?.name
                    }
                    isExpanded={expandedPillarId === "transit-Y"}
                    onToggleExpand={() =>
                      setExpandedPillarId(
                        expandedPillarId === "transit-Y" ? null : "transit-Y"
                      )
                    }
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
                    dayMasterName={
                      baziData.four_pillars.day_pillar?.heavenly_stem?.name
                    }
                    isExpanded={expandedPillarId === "transit-M"}
                    onToggleExpand={() =>
                      setExpandedPillarId(
                        expandedPillarId === "transit-M" ? null : "transit-M"
                      )
                    }
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
                    dayMasterName={
                      baziData.four_pillars.day_pillar?.heavenly_stem?.name
                    }
                    isExpanded={expandedPillarId === "transit-D"}
                    onToggleExpand={() =>
                      setExpandedPillarId(
                        expandedPillarId === "transit-D" ? null : "transit-D"
                      )
                    }
                    mode={mode}
                  />
                </div>
              </div>
            </div>

            {/* ── Baris 2: [Element Structure] | [Luck Pillar Explorer] ── */}
            <div className="grid grid-cols-1 gap-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,10fr)]">
              {/* Element Structure */}
              <div className="rounded-[16px] border border-border bg-card p-2 shadow-sm">
                <Suspense
                  fallback={
                    <div className="h-40 animate-pulse rounded-[12px] bg-muted" />
                  }
                >
                  <ElementStructure elementData={elementData} />
                </Suspense>
              </div>

              {/* Luck Pillar Explorer */}
              <Suspense
                fallback={
                  <div className="h-64 animate-pulse rounded-[28px] bg-muted" />
                }
              >
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
        )}
      </div>
    </div>
  )
}
