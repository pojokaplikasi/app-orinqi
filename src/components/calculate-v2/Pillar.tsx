/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from "react"
import { ELEMENT_COLORS } from "@/lib/bazi/constants"
import { HEAVENLY_STEMS } from "@/lib/bazi/constants"
import { getTenGodsRelationship } from "@/lib/bazi/element-analysis"
import { formatLifeCycleName, formatNayinName, getNayinFromStemBranch } from "@/lib/bazi/pillar-calculations"

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
  mode?: "classic" | "modern"
}

function Pillar({
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
  mode = "modern",
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
    if (dayMasterIndex >= 0 && stemIndex >= 0) {
      if (title.includes("Day Pillar") && !isCurrent) {
        hsTenGodAbbr = "DM"
      } else {
        hsTenGodAbbr = getTenGodsRelationship(dayMasterIndex, stemIndex)
      }
    }
  }

  // Get element colors robustly
  const hsElement =
    heavenly_stem?.element ||
    (heavenly_stem?.name ? heavenly_stem.name.split(" ")[1] : "Wood")

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
    earthly_branch?.element ||
    (earthly_branch?.name ? BRANCH_ASSOCIATIONS[earthly_branch.name] : "Wood") ||
    "Wood"

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
        text: `${name} ${partners}`,
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
        text: `${name} ${partners}`,
        element: null,
        tooltip: items[0].interaction.name,
        category: "negative",
      })
    }
  })

  // Base classes
  let pillarClass =
    "w-full h-full min-h-[320px] p-3 pt-4 rounded-[18px] bg-card border border-border shadow-sm text-foreground text-center box-border relative flex flex-col gap-2.5"

  if (isCurrent) {
    pillarClass += " ring-1 ring-orange-500/50"
  } else {
    pillarClass += " hover:bg-card/60"
  }

  if (isSelected) {
    pillarClass += " ring-2 ring-primary"
  }

  if (onClick) {
    pillarClass += " cursor-pointer"
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
      <div className="relative flex w-full items-start justify-between mb-0.5 min-h-[32px]">
        <div className="flex flex-col items-start text-left">
          <span className="text-[12px] tracking-tight font-semibold text-foreground/90 line-clamp-2">
            {mainTitle}
          </span>
          {chineseTitle && (
            <span className="text-[10px] font-medium text-muted-foreground/60 mt-0.5">
              {chineseTitle}
            </span>
          )}
          {periodLabel && periodValue && (
            <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-primary">
              {periodValue}
            </span>
          )}
        </div>
        {hsTenGodAbbr && (
          <div className="flex h-[24px] items-center justify-center rounded-full bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 px-2.5 text-[11px] font-bold tracking-wide text-purple-600 dark:text-purple-400 shadow-sm">
            {hsTenGodAbbr}
          </div>
        )}
      </div>

      {/* Heavenly Stem */}
      <div className="flex flex-col items-center justify-center relative">
        <strong
          className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[42px] leading-none"
          style={{ color: ELEMENT_COLORS[hsElement] }}
        >
          {heavenly_stem?.character || "?"}
        </strong>
        <div
          className="mt-1 text-[9px] font-bold tracking-[0.2em] uppercase opacity-80"
          style={{ color: ELEMENT_COLORS[hsElement] }}
        >
          {heavenly_stem?.name || "N/A"}
        </div>
      </div>

      {/* Separator */}
      <div className="my-1 flex items-center justify-center w-full">
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>

      {/* Earthly Branch */}
      <div className="relative flex flex-col items-center justify-center">
        <strong
          className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[38px] leading-none"
          style={{ color: ELEMENT_COLORS[ebElement] }}
        >
          {earthly_branch?.character || "?"}
        </strong>
        <div
          className="mt-1 text-[9px] font-bold tracking-[0.2em] uppercase opacity-80"
          style={{ color: ELEMENT_COLORS[ebElement] }}
        >
          {earthly_branch?.name || "N/A"}
        </div>

        {/* Lucky Stars Indicator */}
        {starsForThisBranch.length > 0 && (
          <div className="absolute -top-2 -right-2 z-10 flex flex-col items-center gap-1 rounded-full bg-background border border-border p-1.5 shadow-sm">
            {starsForThisBranch.map((star, idx) => (
              <div key={idx} className="text-[14px] leading-none drop-shadow-sm">
                {star}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Stems (Mini Chips) */}
      <div className="mt-1 flex w-full justify-center gap-1">
        {[
          hidden_stems?.residual_qi,
          hidden_stems?.main_qi,
          hidden_stems?.sub_main_qi,
        ].map((qi, idx) => {
          if (!qi) return null
          return (
            <div key={idx} className="flex flex-col items-center justify-center rounded-[10px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] px-1.5 py-1.5 flex-1">
              <span
                className="mb-0.5 font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[13px] leading-none font-bold drop-shadow-sm"
                style={{ color: ELEMENT_COLORS[qi.element] }}
              >
                {qi.character}
              </span>
              <span className="text-[7px] font-bold tracking-wider text-muted-foreground/70 uppercase">
                {qi.ten_gods || "-"}
              </span>
            </div>
          )
        })}
      </div>

      {/* Element Section (Nayin) & Life Stage */}
      <div className="mt-1 flex items-center justify-between w-full px-0.5 min-h-[20px]">
        <span className="text-[10px] font-medium text-muted-foreground/80 text-left line-clamp-2 flex-1 pr-1">
          {heavenly_stem?.name && earthly_branch?.name
            ? formatNayinName(
                getNayinFromStemBranch(heavenly_stem.name, earthly_branch.name),
                mode
              )
            : gan_zhi?.name || "N/A"}
        </span>
        <span className="text-[9px] font-bold tracking-wider text-purple-500/80 uppercase bg-purple-500/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
          {heavenly_stem?.name && earthly_branch?.name && dayMasterName
            ? formatLifeCycleName(dayMasterName, earthly_branch.name, mode)
            : life_cycle || "N/A"}
        </span>
      </div>

      {/* Spacer to push Relationship Indicators to the bottom */}
      <div className="flex-grow"></div>

      {/* Relationship Indicators (Always Visible) */}
      {(hsLabel || branchLabels.length > 0) && (
        <div className="mt-auto w-full pt-2 border-t border-border/50">
          <div className="flex w-full flex-col gap-1.5 text-left">
            {hsLabel && (
              <div
                className="flex items-center gap-1.5 text-[10px] font-medium bg-black/[0.02] dark:bg-white/[0.02] rounded-lg px-2 py-1"
                style={{ color: "var(--color-chart-3)" }}
              >
                <div className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0"></div>
                <span className="break-words">{hsLabel}</span>
              </div>
            )}
            {branchLabels.map((label, idx) => {
              let color = "var(--color-muted-foreground)"
              let bgColor = "bg-black/[0.02] dark:bg-white/[0.02]"
              
              if (label.category === "positive") {
                color = "var(--color-chart-3)"
                bgColor = "bg-green-500/5 dark:bg-green-500/10"
              } else if (label.category === "negative") {
                if (
                  label.text.includes("Punishment") ||
                  label.text.includes("Harm")
                ) {
                  color = "var(--color-chart-2)"
                  bgColor = "bg-orange-500/5 dark:bg-orange-500/10"
                } else {
                  color = "var(--color-destructive)"
                  bgColor = "bg-red-500/5 dark:bg-red-500/10"
                }
              }

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 text-[10px] font-medium rounded-lg px-2 py-1 ${bgColor}`}
                  style={{ color }}
                >
                  <div className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0"></div>
                  <span className="break-words">{label.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(Pillar)
