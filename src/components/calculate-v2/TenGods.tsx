/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"

interface TenGodsProps {
  tenGodsData: any
}

export default function TenGods({ tenGodsData }: TenGodsProps) {
  if (!tenGodsData) return null

  const tenGodsPoints = tenGodsData.points
  const tenGodsStems = tenGodsData.stems

  const tenGodsChinese: Record<string, string> = {
    Friend: "Bi Jian 比肩",
    "Rob Wealth": "Jie Cai 劫财",
    "Eating God": "Shi Shen 食神",
    "Hurting Officer": "Shang Guan 伤官",
    "Direct Wealth": "Zheng Cai 正财",
    "Indirect Wealth": "Pian Cai 偏财",
    "Direct Officer": "Zheng Guan 正官",
    "Seven Killings": "Qi Sha 七杀",
    "Direct Resource": "Zheng Yin 正印",
    "Indirect Resource": "Pian Yin 偏印",
  }

  const tenGodsColors: Record<string, string> = {
    Friend: "#22C55E",
    "Rob Wealth": "#16A34A",
    "Eating God": "#EF4444",
    "Hurting Officer": "#DC2626",
    "Direct Wealth": "#F59E0B",
    "Indirect Wealth": "#D97706",
    "Direct Officer": "#94A3B8",
    "Seven Killings": "#64748B",
    "Direct Resource": "#3B82F6",
    "Indirect Resource": "#2563EB",
  }

  // Sort 10 Gods by Natal points (descending)
  const sortedGods = Object.entries(tenGodsPoints.natal).sort(
    (a: any, b: any) => b[1] - a[1]
  )

  const totalNatal = Object.values(tenGodsPoints.natal).reduce(
    (sum: any, p: any) => sum + p,
    0
  ) as number
  const totalAnnual = Object.values(tenGodsPoints.annual).reduce(
    (sum: any, p: any) => sum + p,
    0
  ) as number

  return (
    <div className="flex flex-col gap-1">
      {sortedGods.map(([godName, natalPoints]: [string, any]) => {
        const annualPoints = tenGodsPoints.annual[godName] || 0
        const chineseChar = tenGodsChinese[godName] || ""
        const color = tenGodsColors[godName] || "#A855F7"

        const natalStemsArr = tenGodsStems.natal[godName] || []
        const annualStemsArr = tenGodsStems.annual[godName] || []

        const allStemsSet = new Set([...natalStemsArr, ...annualStemsArr])
        const allStems = Array.from(allStemsSet).join(" ")

        const natalPercent =
          totalNatal > 0 ? (natalPoints / totalNatal) * 100 : 0
        const annualPercent =
          totalAnnual > 0 ? (annualPoints / totalAnnual) * 100 : 0

        return (
          <div
            key={godName}
            className="flex items-center gap-1 rounded-[10px] border border-border bg-card px-1.5 py-1"
          >
            {/* Avatar */}
            <span
              className="flex-shrink-0 text-[18px] leading-none font-bold min-w-[20px] text-center"
              style={{ color }}
            >
              {allStems}
            </span>

            {/* Name + Chinese */}
            <div className="flex min-w-0 flex-1 flex-col gap-0">
              <span className="truncate text-[12px] leading-tight font-semibold text-foreground">
                {godName}
              </span>
              <span className="truncate text-[10px] leading-tight text-muted-foreground">
                {chineseChar}
              </span>
            </div>

            {/* Stats */}
            <div className="flex flex-shrink-0 items-center gap-1 text-[11px]">
              <span className="text-muted-foreground">N</span>
              <span className="font-semibold" style={{ color }}>
                {natalPercent.toFixed(1)}%
              </span>
              <div className="h-2.5 w-px bg-border" />
              <span className="text-muted-foreground">A</span>
              <span className="font-semibold" style={{ color, opacity: 0.75 }}>
                {annualPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
