/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { ELEMENT_COLORS } from "@/lib/bazi/constants"
import { HEAVENLY_STEMS } from "@/lib/bazi/constants"
import { getTenGodsRelationship } from "@/lib/bazi/element-analysis"

interface PillarProps {
  title: string
  pillarData: any
  isCurrent?: boolean
  luckyStars?: any
  hsCombos?: any[]
  branchInteractions?: any[]
  periodLabel?: string
  periodValue?: string
  onClick?: () => void
  isSelected?: boolean
  isCompact?: boolean
  dayMasterName?: string
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export default function Pillar({
  title,
  pillarData,
  isCurrent = false,
  luckyStars,
  hsCombos = [],
  branchInteractions = [],
  periodLabel,
  periodValue,
  onClick,
  isSelected = false,
  isCompact = false,
  dayMasterName,
  isExpanded = false,
  onToggleExpand,
}: PillarProps) {
  if (!pillarData) return null

  const { heavenly_stem, earthly_branch, hidden_stems, gan_zhi, life_cycle } =
    pillarData

  // Calculate 10 God abbreviation for heavenly stem (if dayMasterName provided)
  let hsTenGodAbbr = ""
  if (dayMasterName && heavenly_stem?.name) {
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(
      (s) => s.name === dayMasterName
    )
    const stemIndex = HEAVENLY_STEMS.findIndex(
      (s) => s.name === heavenly_stem.name
    )
    if (dayMasterIndex >= 0 && stemIndex >= 0 && dayMasterIndex !== stemIndex) {
      hsTenGodAbbr = getTenGodsRelationship(dayMasterIndex, stemIndex)
    }
  }

  // Get element colors
  const hsElement = heavenly_stem?.element || "Wood"
  const ebElement = earthly_branch?.element || "Wood"
  const nayinElement = gan_zhi?.element_name || "Wood"

  // Check Lucky Stars for this branch
  const starsForThisBranch = []
  if (luckyStars && earthly_branch?.name) {
    const branchEnglishName = earthly_branch.name
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

  // Format HS Combos
  const hsLabel =
    hsCombos.length > 0
      ? `HS Combinations ${hsCombos.map((c) => c.partner).join(", ")}`
      : ""

  // Format Branch Interactions
  const groupedInteractions: Record<string, any[]> = {}
  branchInteractions.forEach((interaction) => {
    if (!groupedInteractions[interaction.type]) {
      groupedInteractions[interaction.type] = []
    }
    groupedInteractions[interaction.type].push(interaction)
  })

  const branchLabels: any[] = []
  const positiveTypes = ["seasonal", "sanhe", "banhe", "liuhe", "anhe"]
  positiveTypes.forEach((type) => {
    if (groupedInteractions[type]) {
      const items = groupedInteractions[type]
      const partners = items.map((i) => i.partner).join(",")
      const icon = items[0].interaction.icon

      const name =
        type === "seasonal"
          ? "Seasonal Unions"
          : type === "sanhe"
            ? "Three Harmonies"
            : type === "banhe"
              ? "Half Combinations"
              : type === "liuhe"
                ? "Six Harmonies"
                : "Hidden Combinations"

      branchLabels.push({
        text: `${icon} ${name} ${partners}`,
        element: items[0].interaction.element,
        tooltip: items[0].interaction.name,
        category: "positive",
      })
    }
  })

  const negativeTypes = [
    "ungrateful",
    "arrogant",
    "rude",
    "self",
    "clash",
    "destruction",
    "harm",
  ]
  negativeTypes.forEach((type) => {
    if (groupedInteractions[type]) {
      const items = groupedInteractions[type]
      const partners = items.map((i) => i.partner).join(",")
      const icon = items[0].interaction.icon

      const name =
        type === "ungrateful"
          ? "Ungrateful Punishment"
          : type === "arrogant"
            ? "Bullying Punishment"
            : type === "rude"
              ? "Uncivilized Punishment"
              : type === "self"
                ? "Self Punishment"
                : type === "clash"
                  ? "Six Clashes"
                  : type === "destruction"
                    ? "Destruction"
                    : "Six Harms"

      branchLabels.push({
        text: `${icon} ${name} ${partners}`,
        element: null,
        tooltip: items[0].interaction.name,
        category: "negative",
      })
    }
  })

  // Base classes
  let pillarClass =
    "flex-none w-[150px] md:w-[180px] lg:w-[200px] h-auto p-4 rounded-[20px] bg-white/72 backdrop-blur-[20px] border border-[#F1F5F9] shadow-[0_6px_24px_rgba(0,0,0,0.05)] text-[#18181B] text-center box-border transition-all duration-200 relative flex flex-col gap-3"

  if (isCurrent) {
    pillarClass += " border-t-[4px] border-t-[#F97316]"
  } else {
    pillarClass += " border-t-[4px] border-t-[#2563EB]"
  }

  if (isSelected) {
    pillarClass += " ring-2 ring-[#E94B4B] ring-offset-2"
  }

  if (onClick) {
    pillarClass +=
      " cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
  }

  // Extract Chinese title if available (e.g., "Hour Pillar (時柱)" -> "Hour Pillar", "時柱")
  let mainTitle = title
  let chineseTitle = ""
  const match = title.match(/(.*?)\s*\((.*?)\)/)
  if (match) {
    mainTitle = match[1]
    chineseTitle = match[2]
  }

  return (
    <div className={pillarClass} onClick={onClick}>
      {/* Header & Ten Gods Badge */}
      <div className="relative flex w-full items-start justify-between">
        <div className="flex flex-col items-start text-left">
          <span className="text-[13px] leading-tight font-semibold text-[#18181B]">
            {mainTitle}
          </span>
          {chineseTitle && (
            <span className="text-[11px] text-[#71717A] opacity-50">
              {chineseTitle}
            </span>
          )}
          {periodLabel && periodValue && (
            <span className="mt-1 text-[11px] font-medium text-[#E94B4B]">
              {periodValue}
            </span>
          )}
        </div>
        {hsTenGodAbbr && (
          <div className="flex h-[22px] items-center justify-center rounded-full bg-[#F3E8FF] px-2 text-[11px] font-bold whitespace-nowrap text-[#7C3AED]">
            {hsTenGodAbbr}
          </div>
        )}
      </div>

      {/* Heavenly Stem */}
      <div className="mt-2 flex flex-col items-center justify-center">
        <strong
          className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[48px] leading-none drop-shadow-sm"
          style={{ color: ELEMENT_COLORS[hsElement] }}
        >
          {heavenly_stem?.character || "?"}
        </strong>
        <div
          className="mt-1 text-[11px] font-bold tracking-wider uppercase"
          style={{ color: ELEMENT_COLORS[hsElement] }}
        >
          {heavenly_stem?.name || "N/A"}
        </div>
      </div>

      {/* Separator */}
      <div className="my-1 h-[1px] w-full bg-[#F1F5F9]"></div>

      {/* Earthly Branch */}
      <div className="relative flex flex-col items-center justify-center">
        <strong
          className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[44px] leading-none drop-shadow-sm"
          style={{ color: ELEMENT_COLORS[ebElement] }}
        >
          {earthly_branch?.character || "?"}
        </strong>
        <div
          className="mt-1 text-[11px] font-bold tracking-wider uppercase"
          style={{ color: ELEMENT_COLORS[ebElement] }}
        >
          {earthly_branch?.name || "N/A"}
        </div>

        {/* Lucky Stars Indicator */}
        {starsForThisBranch.length > 0 && (
          <div className="absolute top-0 right-[-5px] z-10 flex flex-col items-center rounded-md bg-white/90 p-1 shadow-sm">
            {starsForThisBranch.map((star, idx) => (
              <div key={idx} className="text-[12px] leading-tight">
                {star}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Stems (Mini Chips) */}
      <div className="mt-1 flex w-full justify-center gap-2 rounded-[12px] bg-[#F8FAFC] p-[10px]">
        {[
          hidden_stems?.residual_qi,
          hidden_stems?.main_qi,
          hidden_stems?.sub_main_qi,
        ].map((qi, idx) => {
          if (!qi) return null
          return (
            <div key={idx} className="flex flex-col items-center">
              <span
                className="mb-1 font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[14px] leading-none font-bold"
                style={{ color: ELEMENT_COLORS[qi.element] }}
              >
                {qi.character}
              </span>
              <span className="text-[9px] font-bold text-[#64748B] uppercase">
                {qi.ten_gods || "-"}
              </span>
            </div>
          )
        })}
      </div>

      {/* Element Section (Nayin) */}
      <div className="mt-1 flex flex-col items-center justify-center">
        <span className="text-center text-[12px] leading-tight font-semibold text-[#18181B]">
          {gan_zhi?.name || "N/A"}
        </span>
      </div>

      {/* Separator */}
      <div className="my-1 h-[1px] w-full bg-[#F1F5F9]"></div>

      {/* Life Stage */}
      <div className="flex items-center justify-center">
        <span className="text-[13px] font-bold tracking-wide text-[#7C3AED] uppercase">
          {life_cycle || "N/A"}
        </span>
      </div>

      {/* Collapsible Relationship Indicators */}
      {(hsLabel || branchLabels.length > 0) && (
        <div className="mt-2 w-full">
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (onToggleExpand) onToggleExpand()
            }}
            className="flex h-[36px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-[#F8FAFC] text-[12px] font-semibold text-[#475569] transition-colors hover:bg-[#F1F5F9]"
          >
            +{branchLabels.length + (hsLabel ? 1 : 0)} Indicators{" "}
            {isExpanded ? "▲" : "▼"}
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? "mt-2 max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="flex w-full flex-col gap-1 rounded-[12px] border border-[#F1F5F9] bg-white/50 p-2 text-left">
              {hsLabel && (
                <div
                  className="flex items-start gap-1 text-[11px] leading-[1.5] font-medium"
                  style={{ color: "#16A34A" }}
                >
                  <span className="mt-[2px]">🔥</span>
                  <span className="break-words">{hsLabel}</span>
                </div>
              )}
              {branchLabels.map((label, idx) => {
                let color = "#64748B" // Neutral
                if (label.category === "positive") color = "#16A34A"
                else if (label.category === "negative") {
                  if (
                    label.text.includes("Punishment") ||
                    label.text.includes("Harm")
                  )
                    color = "#EAB308" // Warning
                  else color = "#EF4444" // Negative
                }

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-1 text-[11px] leading-[1.5] font-medium"
                    style={{ color }}
                  >
                    <span className="break-words">{label.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
