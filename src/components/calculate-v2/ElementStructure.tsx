/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ELEMENT_COLORS } from "@/lib/bazi/constants"

// ─── Element metadata ────────────────────────────────────────────────────────
const ELEMENT_META: Record<
  string,
  { chinese: string; bold: string; parenthetical: string; icon: string }
> = {
  Metal: {
    chinese: "創作型",
    bold: "Output",
    parenthetical: "(Creators)",
    icon: "⚙️",
  },
  Water: {
    chinese: "智慧型",
    bold: "Influence",
    parenthetical: "(Thinkers)",
    icon: "💧",
  },
  Wood: {
    chinese: "進取型",
    bold: "Wealth",
    parenthetical: "(Achievers)",
    icon: "🌳",
  },
  Fire: {
    chinese: "表現型",
    bold: "Power",
    parenthetical: "(Leaders)",
    icon: "🔥",
  },
  Earth: {
    chinese: "穩定型",
    bold: "Resource",
    parenthetical: "(Supporters)",
    icon: "🌍",
  },
}

// Order for pentagon radar (top → clockwise)
const ELEMENT_ORDER = ["Metal", "Water", "Wood", "Fire", "Earth"]

// ─── Custom Angle-Axis Tick (multi-line label) ───────────────────────────────
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
      <div
        style={{
          fontWeight: "bold",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{meta?.icon}</span>
        <span style={{ color }}>{elem}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          <span style={{ color: "#D2B48C" }}>Natal</span>
          <span style={{ fontWeight: "bold", color }}>{natal}%</span>
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          <span style={{ color: "#9B59B6" }}>Annual 2026</span>
          <span style={{ fontWeight: "bold" }}>{annual}%</span>
        </div>
      </div>
    </div>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface ElementStructureProps {
  elementData: any
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ElementStructure({
  elementData,
}: ElementStructureProps) {
  const [showNatal, setShowNatal] = useState(true)
  const [showAnnual, setShowAnnual] = useState(true)

  if (!elementData) return null

  // Build recharts data array
  const data = ELEMENT_ORDER.map((elem) => ({
    subject: elem,
    natal: parseFloat(elementData.natal[elem] ?? "0"),
    annual: parseFloat(elementData.annual[elem] ?? "0"),
  }))

  return (
    <div className="flex w-full flex-col items-center gap-0">
      {/* ── Header ── */}
      <div
        className="w-full rounded-t-[16px] py-2 text-center text-[13px] font-bold tracking-[0.2em] text-white uppercase"
        style={{
          background: "linear-gradient(90deg, #C9A96E 0%, #B8860B 100%)",
        }}
      >
        5 Structures
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center justify-center gap-4 py-2">
        <button
          onClick={() => setShowNatal((v) => !v)}
          className="flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold transition-all"
          style={{
            background: showNatal ? "#F5DEB3" : "#e5e7eb",
            color: showNatal ? "#5C4033" : "#9ca3af",
            border: `2px solid ${showNatal ? "#D2B48C" : "#d1d5db"}`,
            opacity: showNatal ? 1 : 0.6,
          }}
        >
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ background: "#D2B48C" }}
          />
          Natal
        </button>
        <button
          onClick={() => setShowAnnual((v) => !v)}
          className="flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold transition-all"
          style={{
            background: showAnnual ? "#E8D5F5" : "#e5e7eb",
            color: showAnnual ? "#6B21A8" : "#9ca3af",
            border: `2px solid ${showAnnual ? "#9B59B6" : "#d1d5db"}`,
            opacity: showAnnual ? 1 : 0.6,
          }}
        >
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ background: "#9B59B6" }}
          />
          Annual 2026
        </button>
      </div>

      {/* ── Radar Chart ── */}
      <div className="w-full" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            margin={{ top: 40, right: 55, bottom: 40, left: 55 }}
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
                name="Annual 2026"
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

      {/* ── Element Cards ── */}
      <div className="mt-2 grid w-full grid-cols-2 gap-1.5">
        {ELEMENT_ORDER.map((elem) => {
          const meta = ELEMENT_META[elem]
          const color = ELEMENT_COLORS[elem] ?? "#888"
          const natal = elementData.natal[elem] ?? "0"
          const annual = elementData.annual[elem] ?? "0"
          return (
            <div
              key={elem}
              className="flex flex-col overflow-hidden rounded-[8px] border border-border bg-card"
            >
              {/* Header */}
              <div
                className="flex items-center gap-1.5 px-2 py-1"
                style={{ backgroundColor: color + "18" }}
              >
                <span className="text-[13px] leading-none">{meta.icon}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1">
                    <div
                      className="inline-block shrink-0 rounded-sm px-1 text-[8px] font-bold tracking-wide text-white"
                      style={{ backgroundColor: color }}
                    >
                      {elem}
                    </div>
                    <div className="truncate text-[9px] leading-tight font-semibold text-muted-foreground">
                      ({meta.bold})
                    </div>
                  </div>
                </div>
              </div>

              {/* Values */}
              <div className="flex divide-x divide-border">
                <div className="flex flex-1 flex-col items-center py-1">
                  <span className="mb-0.5 text-[11px] leading-none font-semibold tracking-wide text-muted-foreground uppercase">
                    N
                  </span>
                  <span
                    className="text-[11px] leading-none font-bold"
                    style={{ color }}
                  >
                    {natal}%
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center py-1">
                  <span className="mb-0.5 text-[11px] leading-none font-semibold tracking-wide text-muted-foreground uppercase">
                    A
                  </span>
                  <span
                    className="text-[11px] leading-none font-bold"
                    style={{ color: "#9B59B6" }}
                  >
                    {annual}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
