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
import LuckPillarExplorer from "@/components/LuckPillarExplorer"
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

  // Selection state for drill-down (managed inside LuckPillarExplorer)

  // Expanded Pillar State
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null)

  // Mobile Tab State for Destiny Insights
  const [activeInsightTab, setActiveInsightTab] = useState<
    "elements" | "stars" | "gods"
  >("elements")

  // Explorer state is managed inside LuckPillarExplorer

  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
                        mode={mode}
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
                <div className="mt-6">
                <LuckPillarExplorer
                  baziData={baziData}
                  luckyStars={luckyStars}
                  date={date}
                  time={time}
                  timezone={timezone}
                  unknownTime={unknownTime}
                  mode={mode}
                />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
