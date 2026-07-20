/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { useSearchParams } from "next/navigation"
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
import type {
  ExplorerSelection,
  LuckPillarExplorerHandle,
} from "@/components/calculate-v2/LuckPillarExplorer"
import LuckyStars from "@/components/calculate-v2/LuckyStars"
import Pillar from "@/components/calculate-v2/Pillar"
import StickyHeader from "@/components/calculate-v2/StickyHeader"
import TenGods from "@/components/calculate-v2/TenGods"
import { useAuth } from "@/components/providers/AuthProvider"

const LuckPillarExplorer = lazy(
  () => import("@/components/calculate-v2/LuckPillarExplorer")
)
const ElementStructure = lazy(
  () => import("@/components/calculate-v2/ElementStructure")
)

function BaziCalculatorContent() {
  const { user, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [timezone, setTimezone] = useState("")
  const [gender, setGender] = useState<number | null>(null)
  const [unknownTime, setUnknownTime] = useState(false)
  const [mode, setMode] = useState<"classic" | "modern">("modern")
  const [chartName, setChartName] = useState("Your Destiny Chart")

  const [loading, setLoading] = useState(false)
  const [isAutoCalculating, setIsAutoCalculating] = useState(false)
  const [error, setError] = useState("")
  const [baziData, setBaziData] = useState<any>(null)

  // Derived data
  const [luckyStars, setLuckyStars] = useState<any>(null)
  const [elementData, setElementData] = useState<any>(null)
  const [tenGodsData, setTenGodsData] = useState<any>(null)
  const [hsCombos, setHsCombos] = useState<any>(null)
  const [branchInteractions, setBranchInteractions] = useState<any>(null)
  const [currentPillars, setCurrentPillars] = useState<any>(null)

  // Explorer selection — drives the 4 right-side transit pillars
  const [explorerSelection, setExplorerSelection] =
    useState<ExplorerSelection | null>(null)

  // Expanded Pillar State
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const explorerRef = useRef<LuckPillarExplorerHandle>(null)

  const handleCalculateDirect = async (
    calcDate: string,
    calcTime: string,
    calcTimezone: string,
    calcGender: number,
    calcUnknownTime: boolean
  ) => {
    setError("")
    setLoading(true)

    const actualDateTime = calcUnknownTime
      ? `${calcDate}T12:00`
      : `${calcDate}T${calcTime}`

    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateTime: actualDateTime,
          location: calcTimezone,
          gender: calcGender,
          unknownBirthTime: calcUnknownTime,
        }),
      })

      if (!response.ok) throw new Error("Network response was not ok")

      const data = await response.json()
      setBaziData(data)

      // Calculate current pillars using the browser's local date/time.
      // The browser timezone is the user's selected location in normal usage.
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

      // Reset explorer selection
      setExplorerSelection(null)
      setIsAutoCalculating(false)
    } catch (err: any) {
      setError(err.message)
      setIsAutoCalculating(false)
    } finally {
      setLoading(false)
    }
  }

  // Auto-fill and calculate from URL params
  useEffect(() => {
    const pName = searchParams.get("name")
    const pDate = searchParams.get("date")
    const pTime = searchParams.get("time")
    const pTimezone = searchParams.get("timezone")
    const pGender = searchParams.get("gender")
    const pUnknownTime = searchParams.get("unknownTime")

    if (pDate && pTimezone && pGender !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAutoCalculating(true)
      setChartName(pName || "Your Destiny Chart")
      setDate(pDate)
      setTime(pTime || "")
      setTimezone(pTimezone)
      setGender(parseInt(pGender, 10))
      setUnknownTime(pUnknownTime === "true")

      // Trigger calculation automatically using the URL params directly
      // to avoid waiting for React state batching
      handleCalculateDirect(
        pDate,
        pTime || "",
        pTimezone,
        parseInt(pGender, 10),
        pUnknownTime === "true"
      )
    }
  }, [searchParams])

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

    await handleCalculateDirect(date, time, timezone, gender, unknownTime)
  }

  // ── Recalculate derived data when explorer selection changes ──────────
  const handleExplorerSelectionChange = useCallback(
    (selection: ExplorerSelection) => {
      setExplorerSelection(selection)

      if (!baziData) return

      // Build a currentPillars-compatible object from explorer selection
      const activePillars = {
        luck: selection.luck ?? currentPillars?.luck ?? null,
        year: selection.year ?? currentPillars?.year ?? null,
        month: selection.month ?? currentPillars?.month ?? null,
        day: selection.day ?? currentPillars?.day ?? null,
      }

      // Recalculate all derived data with the new transit pillars
      const stars = calculateLuckyStars(baziData.four_pillars, activePillars)
      setLuckyStars(stars)

      const elements = calculateElementStructure(
        baziData.four_pillars,
        activePillars
      )
      setElementData(elements)

      const tenGods = calculateTenGods(baziData.four_pillars, activePillars)
      setTenGodsData(tenGods)

      const combos = detectAllHSCombinations(
        baziData.four_pillars,
        activePillars
      )
      setHsCombos(combos)

      const interactions = detectAllBranchInteractions(
        baziData.four_pillars,
        activePillars
      )
      setBranchInteractions(interactions)
    },
    [baziData, currentPillars]
  )

  // ── Compute the active transit pillars (explorer overrides current) ─────
  const activeTransitPillars = {
    luck: explorerSelection?.luck ?? currentPillars?.luck ?? null,
    year: explorerSelection?.year ?? currentPillars?.year ?? null,
    month: explorerSelection?.month ?? currentPillars?.month ?? null,
    day: explorerSelection?.day ?? currentPillars?.day ?? null,
  }

  // Show loading state while checking auth or if user is not authenticated yet (waiting for redirect)
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hidden button for auto-calculation from URL params */}
      <button
        id="auto-calc-btn"
        className="hidden"
        onClick={handleCalculate}
      ></button>

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
        {!baziData && !isAutoCalculating && (
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

        {/* Loading state for auto-calculation */}
        {!baziData && isAutoCalculating && (
          <div className="flex min-h-[600px] flex-col items-center justify-center">
            <div className="mb-6 flex h-[80px] w-[80px] animate-pulse items-center justify-center rounded-full border-4 border-border bg-gradient-to-br from-primary to-primary/80 shadow-sm">
              <span className="font-serif text-4xl font-bold text-primary-foreground">
                命
              </span>
            </div>
            <h3 className="mb-2 text-[24px] font-bold text-foreground">
              Loading Chart...
            </h3>
            <p className="text-[15px] text-muted-foreground">
              Retrieving your destiny code
            </p>
          </div>
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
                    title={
                      activeTransitPillars.luck?.year_start
                        ? `Luck ${activeTransitPillars.luck?.number ?? ""} (大運)`
                        : "Current Cycle"
                    }
                    pillarData={activeTransitPillars.luck}
                    isCurrent
                    luckyStars={luckyStars}
                    hsCombos={hsCombos?.CL}
                    branchInteractions={branchInteractions?.CL}
                    periodLabel="Period"
                    periodValue={
                      activeTransitPillars.luck?.year_start
                        ? `${activeTransitPillars.luck.year_start}–${activeTransitPillars.luck.year_end}`
                        : activeTransitPillars.luck?.luck_period
                    }
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
                    onPrev={() => explorerRef.current?.navigateLuck("prev")}
                    onNext={() => explorerRef.current?.navigateLuck("next")}
                  />
                  <Pillar
                    title={
                      activeTransitPillars.year?.year
                        ? `${activeTransitPillars.year.year} (年柱)`
                        : "Current Year"
                    }
                    pillarData={activeTransitPillars.year}
                    isCurrent
                    luckyStars={luckyStars}
                    hsCombos={hsCombos?.CY}
                    branchInteractions={branchInteractions?.CY}
                    periodLabel={
                      activeTransitPillars.year?.age ? "Age" : "Year"
                    }
                    periodValue={
                      activeTransitPillars.year?.age
                        ? `Age ${activeTransitPillars.year.age}`
                        : activeTransitPillars.year?.year?.toString()
                    }
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
                    onPrev={() => explorerRef.current?.navigateYear("prev")}
                    onNext={() => explorerRef.current?.navigateYear("next")}
                  />
                  <Pillar
                    title={
                      activeTransitPillars.month?.gregorian_month_label
                        ? `${activeTransitPillars.month.gregorian_month_label} (月柱)`
                        : activeTransitPillars.month?.month_english
                          ? `${activeTransitPillars.month.month_english} (月柱)`
                          : "Current Month"
                    }
                    pillarData={activeTransitPillars.month}
                    isCurrent
                    luckyStars={luckyStars}
                    hsCombos={hsCombos?.CM}
                    branchInteractions={branchInteractions?.CM}
                    periodLabel="Month"
                    periodValue={
                      activeTransitPillars.month?.month_english ??
                      activeTransitPillars.month?.month?.toString()
                    }
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
                    onPrev={() => explorerRef.current?.navigateMonth("prev")}
                    onNext={() => explorerRef.current?.navigateMonth("next")}
                  />
                  <Pillar
                    title={
                      activeTransitPillars.day?.day
                        ? `Day ${activeTransitPillars.day.day} (日柱)`
                        : "Current Day"
                    }
                    pillarData={activeTransitPillars.day}
                    isCurrent
                    luckyStars={luckyStars}
                    hsCombos={hsCombos?.CD}
                    branchInteractions={branchInteractions?.CD}
                    periodLabel="Day"
                    periodValue={activeTransitPillars.day?.day?.toString()}
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
                    onPrev={() => explorerRef.current?.navigateDay("prev")}
                    onNext={() => explorerRef.current?.navigateDay("next")}
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
                  ref={explorerRef}
                  baziData={baziData}
                  luckyStars={luckyStars}
                  date={date}
                  time={time}
                  timezone={timezone}
                  unknownTime={unknownTime}
                  mode={mode}
                  onSelectionChange={handleExplorerSelectionChange}
                />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BaziCalculator() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">
              Loading calculator...
            </p>
          </div>
        </div>
      }
    >
      <BaziCalculatorContent />
    </Suspense>
  )
}
