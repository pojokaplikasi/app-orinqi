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
    Friend: "比肩",
    "Rob Wealth": "劫财",
    "Eating God": "食神",
    "Hurting Officer": "伤官",
    "Direct Wealth": "正财",
    "Indirect Wealth": "偏财",
    "Direct Officer": "正官",
    "Seven Killings": "七杀",
    "Direct Resource": "正印",
    "Indirect Resource": "偏印",
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
    <div className="flex flex-col gap-4">
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

        // Only show gods that have some presence
        if (natalPercent === 0 && annualPercent === 0) return null

        return (
          <div
            key={godName}
            className="flex items-center gap-4 rounded-[18px] border border-border bg-card p-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <div
              className="flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded-full text-[18px] font-bold"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${color}20`,
                boxShadow: `0 4px 12px ${color}15`,
                color: color,
              }}
            >
              {allStems || chineseChar[0]}
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-foreground">
                  {godName}
                </span>
                <span className="text-[13px] text-muted-foreground">
                  {chineseChar}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-muted-foreground">
                    Natal
                  </span>
                  <span className="text-[13px] font-bold" style={{ color }}>
                    {natalPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-[3px] w-[3px] rounded-full bg-border"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-muted-foreground">
                    Annual
                  </span>
                  <span
                    className="text-[13px] font-bold"
                    style={{ color, opacity: 0.8 }}
                  >
                    {annualPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
