/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { ELEMENT_COLORS, HEAVENLY_STEMS } from "@/lib/bazi/constants"
import { getTenGodsRelationship } from "@/lib/bazi/element-analysis"

interface CompactPillarCardProps {
  title: string
  subtitle: string
  pillarData: any
  isSelected: boolean
  onClick: () => void
  color?: string
  dayMasterName?: string
  luckyStars?: any
}

export default function CompactPillarCard({
  title,
  subtitle,
  pillarData,
  isSelected,
  onClick,
  color = "var(--color-primary)",
  dayMasterName,
  luckyStars,
}: CompactPillarCardProps) {
  if (!pillarData) return null

  const hs = pillarData.heavenly_stem
  const eb = pillarData.earthly_branch

  const hsElement = hs?.element || (hs?.name ? hs.name.split(" ")[1] : "Wood")

  const BRANCH_ASSOCIATIONS: Record<string, string> = {
    Tiger: "Wood",
    Rabbit: "Wood",
    Snake: "Fire",
    Horse: "Fire",
    Monkey: "Metal",
    Rooster: "Metal",
    Pig: "Water",
    Rat: "Water",
    Dragon: "Earth",
    Goat: "Earth",
    Dog: "Earth",
    Ox: "Earth",
  }
  const ebElement =
    eb?.element || (eb?.name ? BRANCH_ASSOCIATIONS[eb.name] : "Wood") || "Wood"

  // Calculate 10 God abbreviation for heavenly stem (if dayMasterName provided)
  let hsTenGodAbbr = ""
  if (dayMasterName && hs?.name) {
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(
      (s) => s.name === dayMasterName
    )
    const stemIndex = HEAVENLY_STEMS.findIndex((s) => s.name === hs.name)
    if (dayMasterIndex >= 0 && stemIndex >= 0 && dayMasterIndex !== stemIndex) {
      hsTenGodAbbr = getTenGodsRelationship(dayMasterIndex, stemIndex)
    }
  }

  // Check Lucky Stars for this branch
  const starsForThisBranch = []
  if (luckyStars && eb?.name) {
    const branchEnglishName = eb.name
    const branchNameMap: Record<string, string> = {
      Rat: "Zi",
      Ox: "Chou",
      Tiger: "Yin",
      Rabbit: "Mao",
      Dragon: "Chen",
      Snake: "Si",
      Horse: "Wu",
      Goat: "Wei",
      Monkey: "Shen",
      Rooster: "You",
      Dog: "Xu",
      Pig: "Hai",
    }
    const branchTraditional =
      branchNameMap[branchEnglishName] || branchEnglishName

    if (
      Array.isArray(luckyStars.nobleman) &&
      luckyStars.nobleman.includes(branchTraditional)
    )
      starsForThisBranch.push("👑")
    if (luckyStars.intelligence === branchTraditional)
      starsForThisBranch.push("🎓")
    if (luckyStars.peachBlossom === branchTraditional)
      starsForThisBranch.push("🌸")
    if (luckyStars.skyHorse === branchTraditional) starsForThisBranch.push("🦄")
    if (luckyStars.solitary === branchTraditional) starsForThisBranch.push("🌙")
    if (luckyStars.heavenlyDoctor === branchTraditional)
      starsForThisBranch.push("⚕️")
    if (
      Array.isArray(luckyStars.kongwang) &&
      luckyStars.kongwang.includes(branchTraditional)
    )
      starsForThisBranch.push("☯️")
  }

  return (
    <div
      onClick={onClick}
      className={`group relative flex h-[280px] w-[160px] flex-none cursor-pointer flex-col items-center justify-between rounded-[20px] border bg-card/70 p-4 backdrop-blur-[20px] transition-all duration-300 md:w-[180px] ${
        isSelected
          ? "shadow-md"
          : "border-border hover:border-border/80 hover:shadow-sm"
      }`}
      style={{
        borderColor: isSelected ? color : undefined,
        borderWidth: isSelected ? "2px" : "1px",
      }}
    >
      {/* Header */}
      <div className="relative flex w-full flex-col items-center text-center">
        <span className="text-[14px] font-bold text-foreground">{title}</span>
        <span className="text-[12px] text-muted-foreground">{subtitle}</span>

        {/* Ten God Badge */}
        {hsTenGodAbbr && (
          <div className="absolute top-0 right-0 flex h-[22px] items-center justify-center rounded-full bg-purple-100 px-2 text-[11px] font-bold whitespace-nowrap text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            {hsTenGodAbbr}
          </div>
        )}
      </div>

      {/* Stem */}
      <div className="mt-2 flex flex-col items-center">
        <strong
          className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[36px] leading-none"
          style={{
            color:
              ELEMENT_COLORS[hsElement] || hs?.color || "var(--foreground)",
          }}
        >
          {hs?.character || hs?.name_sc || hs?.name}
        </strong>
        <div
          className="mt-1 text-[10px] font-bold tracking-wider uppercase"
          style={{
            color:
              ELEMENT_COLORS[hsElement] || hs?.color || "var(--foreground)",
          }}
        >
          {hs?.name || "N/A"}
        </div>
      </div>

      {/* Branch */}
      <div className="relative mt-2 flex flex-col items-center">
        <strong
          className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[36px] leading-none"
          style={{
            color:
              ELEMENT_COLORS[ebElement] || eb?.color || "var(--foreground)",
          }}
        >
          {eb?.character || eb?.name_sc || eb?.name}
        </strong>
        <div
          className="mt-1 text-[10px] font-bold tracking-wider uppercase"
          style={{
            color:
              ELEMENT_COLORS[ebElement] || eb?.color || "var(--foreground)",
          }}
        >
          {eb?.name || "N/A"}
        </div>

        {/* Lucky Stars Indicator */}
        {starsForThisBranch.length > 0 && (
          <div className="absolute top-0 right-[-15px] z-10 flex flex-col items-center rounded-md bg-background/90 p-1 shadow-sm">
            {starsForThisBranch.map((star, idx) => (
              <div key={idx} className="text-[12px] leading-tight">
                {star}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Life Stage */}
      {pillarData.life_stage && (
        <div className="mt-auto w-full border-t border-border pt-3 text-center">
          <span
            className="text-[11px] font-semibold tracking-wide uppercase"
            style={{ color }}
          >
            {pillarData.life_stage}
          </span>
        </div>
      )}

      {/* Selected Pointer */}
      {isSelected && (
        <div
          className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 text-[16px]"
          style={{ color }}
        >
          ▼
        </div>
      )}
    </div>
  )
}
