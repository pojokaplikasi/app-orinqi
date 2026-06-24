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
    <div className="flex flex-col gap-2">
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
            className="flex items-center gap-3 rounded-[12px] border border-border bg-card p-3"
          >
            <div
              className="flex h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-full text-[14px] font-bold"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${color}20`,
                boxShadow: `0 4px 12px ${color}15`,
                color: color,
              }}
            >
              {allStems || chineseChar.split(" ").pop()?.[0] || "?"}
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-foreground">
                  {godName}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  ({chineseChar})
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
