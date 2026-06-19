/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ELEMENT_COLORS } from "@/lib/bazi/constants"

// ─── Element metadata ────────────────────────────────────────────────────────
const ELEMENT_META: Record<
  string,
  { chinese: string; bold: string; parenthetical: string; icon: string; description: string }
> = {
  Metal: {
    chinese: "創作型",
    bold: "Output",
    parenthetical: "Creators",
    icon: "⚙️",
    description: "Expression, creativity, and production of results.",
  },
  Water: {
    chinese: "智慧型",
    bold: "Influence",
    parenthetical: "Thinkers",
    icon: "💧",
    description: "Wisdom, strategy, and intellectual depth.",
  },
  Wood: {
    chinese: "進取型",
    bold: "Wealth",
    parenthetical: "Achievers",
    icon: "🌳",
    description: "Growth, ambition, and material accumulation.",
  },
  Fire: {
    chinese: "表現型",
    bold: "Power",
    parenthetical: "Leaders",
    icon: "🔥",
    description: "Authority, visibility, and commanding presence.",
  },
  Earth: {
    chinese: "穩定型",
    bold: "Resource",
    parenthetical: "Supporters",
    icon: "🌍",
    description: "Stability, nurturing, and foundational support.",
  },
}

const ELEMENT_ORDER = ["Metal", "Water", "Wood", "Fire", "Earth"]

// ─── Custom Angle-Axis Tick ──────────────────────────────────────────────────
const CustomAngleTick = (props: any) => {
  const { x, y, cx, cy, payload } = props
  const elem = payload.value as string
  const meta = ELEMENT_META[elem]
  if (!meta) return null

  // Direction vector from center to this tick
  const dx = x - cx
  const dy = y - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const nx = dx / dist
  const ny = dy / dist

  // Push label further out from the axis tip
  const OFFSET = 52
  const lx = x + nx * OFFSET
  const ly = y + ny * OFFSET

  // Total height of 4 rows: badge(18) + gap(4) + chinese(14) + gap(4) + bold(14) + gap(4) + paren(14) = 72
  // Center the whole block around ly
  const totalH = 72
  const startY = ly - totalH / 2

  const boxW = 68
  const boxH = 18

  return (
    <g>
      {/* Row 1: Element badge */}
      <rect
        x={lx - boxW / 2}
        y={startY}
        width={boxW}
        height={boxH}
        rx={4}
        fill={ELEMENT_COLORS[elem] ?? "#6D4C41"}
      />
      <text
        x={lx}
        y={startY + boxH / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize={11}
        fontWeight="bold"
      >
        {elem.toUpperCase()}
      </text>

      {/* Row 2: Chinese */}
      <text
        x={lx}
        y={startY + boxH + 4 + 7}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#555"
        fontSize={11}
      >
        {meta.chinese}
      </text>

      {/* Row 3: Bold title */}
      <text
        x={lx}
        y={startY + boxH + 4 + 14 + 4 + 7}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#222"
        fontSize={12}
        fontWeight="bold"
      >
        {meta.bold}
      </text>

      {/* Row 4: Parenthetical */}
      <text
        x={lx}
        y={startY + boxH + 4 + 14 + 4 + 14 + 4 + 7}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#777"
        fontSize={11}
      >
        {meta.parenthetical}
      </text>
    </g>
  )
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null
  const elem = payload[0]?.payload?.subject as string
  const meta = ELEMENT_META[elem]
  const color = ELEMENT_COLORS[elem] ?? "#888"
  const natal = payload.find((p: any) => p.dataKey === "natal")?.value ?? "-"
  const annual = payload.find((p: any) => p.dataKey === "annual")?.value ?? "-"

  return (
    <div
      style={{
        background: "rgba(20,20,20,0.92)",
        borderRadius: 10,
        padding: "10px 16px",
        color: "#fff",
        fontSize: 13,
        minWidth: 160,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{meta?.icon}</span>
        <span style={{ color }}>{elem}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "#D2B48C" }}>Natal</span>
          <span style={{ fontWeight: "bold", color }}>{natal}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ color: "#9B59B6" }}>Annual</span>
          <span style={{ fontWeight: "bold" }}>{annual}%</span>
        </div>
      </div>
    </div>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface ElementStructureWideProps {
  elementData: any
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ElementStructureWide({ elementData }: ElementStructureWideProps) {
  const [showNatal, setShowNatal] = useState(true)
  const [showAnnual, setShowAnnual] = useState(true)

  if (!elementData) return null

  const data = ELEMENT_ORDER.map((elem) => ({
    subject: elem,
    natal: parseFloat(elementData.natal[elem] ?? "0"),
    annual: parseFloat(elementData.annual[elem] ?? "0"),
  }))

  return (
    <div className="w-full rounded-[24px] border border-border bg-card/70 shadow-sm backdrop-blur-[20px] overflow-hidden">
      {/* ── Header ── */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg, #C9A96E 0%, #B8860B 100%)" }}
      >
        <div>
          <h4 className="text-[16px] font-bold tracking-[0.15em] text-white uppercase">
            🌐 Element Structure
          </h4>
          <p className="text-[12px] text-white/70 mt-0.5">
            Distribution of the 5 elements across natal &amp; annual pillars
          </p>
        </div>
        {/* Legend toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNatal((v) => !v)}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all"
            style={{
              background: showNatal ? "#F5DEB3" : "rgba(255,255,255,0.15)",
              color: showNatal ? "#5C4033" : "rgba(255,255,255,0.5)",
              border: `2px solid ${showNatal ? "#D2B48C" : "rgba(255,255,255,0.2)"}`,
            }}
          >
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#D2B48C" }} />
            Natal
          </button>
          <button
            onClick={() => setShowAnnual((v) => !v)}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all"
            style={{
              background: showAnnual ? "#E8D5F5" : "rgba(255,255,255,0.15)",
              color: showAnnual ? "#6B21A8" : "rgba(255,255,255,0.5)",
              border: `2px solid ${showAnnual ? "#9B59B6" : "rgba(255,255,255,0.2)"}`,
            }}
          >
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#9B59B6" }} />
            Annual
          </button>
        </div>
      </div>

      {/* ── Body: Chart + Cards side by side ── */}
      <div className="flex flex-col gap-0 lg:flex-row">

        {/* ── LEFT: Radar Chart ── */}
        <div className="flex items-center justify-center lg:w-[480px] xl:w-[540px] shrink-0 p-4">
          <div className="w-full" style={{ height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={data}
                margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
              >
                <PolarGrid gridType="polygon" stroke="#ccc" strokeWidth={1} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={<CustomAngleTick />}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tickCount={6}
                  tick={{ fontSize: 10, fill: "#999" }}
                  axisLine={false}
                  tickLine={false}
                />
                {showNatal && (
                  <Radar
                    name="Natal"
                    dataKey="natal"
                    stroke="#D2B48C"
                    strokeWidth={2}
                    fill="#F5DEB3"
                    fillOpacity={0.45}
                    dot={{ r: 4, fill: "#222", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#222" }}
                  />
                )}
                {showAnnual && (
                  <Radar
                    name="Annual"
                    dataKey="annual"
                    stroke="#8B2FC9"
                    strokeWidth={2}
                    fill="#9B59B6"
                    fillOpacity={0.3}
                    dot={{ r: 4, fill: "#8B2FC9", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#8B2FC9" }}
                  />
                )}
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="hidden lg:block w-[1px] bg-border my-6" />
        <div className="block lg:hidden h-[1px] bg-border mx-6" />

        {/* ── RIGHT: 5 Element Cards in 2-row grid (3 + 2) ── */}
        <div className="flex flex-1 items-center p-4 lg:p-6">
          <div className="grid w-full grid-cols-3 gap-3">
            {ELEMENT_ORDER.map((elem) => {
              const meta = ELEMENT_META[elem]
              const color = ELEMENT_COLORS[elem] ?? "#888"
              const natal = parseFloat(elementData.natal[elem] ?? "0")
              const annual = parseFloat(elementData.annual[elem] ?? "0")
              const maxVal = Math.max(natal, annual, 1)

              return (
                <div
                  key={elem}
                  className="flex flex-col rounded-[16px] border border-border bg-card overflow-hidden shadow-sm"
                >
                  {/* Colour top strip */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: color }}
                  />

                  {/* Body */}
                  <div className="flex flex-col items-center gap-2 px-3 py-3">
                    {/* Icon + badge */}
                    <div className="flex w-full items-center justify-between">
                      <span className="text-[20px] leading-none">{meta.icon}</span>
                      <div
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase"
                        style={{ backgroundColor: color }}
                      >
                        {elem}
                      </div>
                    </div>

                    {/* Labels */}
                    <div className="w-full">
                      <div className="text-[12px] font-bold text-foreground leading-tight">
                        {meta.bold}
                      </div>
                      <div className="text-[10px] text-muted-foreground leading-tight">
                        {meta.parenthetical}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-border" />

                    {/* Bar rows */}
                    <div className="flex w-full flex-col gap-2">
                      {/* Natal bar */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wide">
                          Natal
                        </span>
                        <span className="text-[13px] font-bold" style={{ color }}>
                          {natal}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${(natal / maxVal) * 100}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>

                    {/* Annual bar */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wide">
                          Annual
                        </span>
                        <span className="text-[13px] font-bold" style={{ color: "#9B59B6" }}>
                          {annual}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${(annual / maxVal) * 100}%`, backgroundColor: "#9B59B6" }}
                        />
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
