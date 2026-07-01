/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { ELEMENT_COLORS } from "@/lib/bazi/constants"
import { HEAVENLY_STEMS } from "@/lib/bazi/constants"
import { getTenGodsRelationship } from "@/lib/bazi/element-analysis"
import {
  formatLifeCycleName,
  formatNayinName,
  getNayinFromStemBranch,
} from "@/lib/bazi/pillar-calculations"

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
  hideRelationships?: boolean
  size?: "default" | "small"
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
  mode = "modern",
  hideRelationships = false,
  size = "default",
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
    (earthly_branch?.name
      ? BRANCH_ASSOCIATIONS[earthly_branch.name]
      : "Wood") ||
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

  // Size variants
  const isSmall = size === "small"

  // Base classes
  let pillarClass = isSmall
    ? `flex-none w-[100px] md:w-[110px] lg:w-[120px] h-full ${hideRelationships ? "" : "min-h-[240px]"} p-1.5 pt-2 rounded-[14px] bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-[24px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-foreground text-center box-border transition-all duration-300 relative flex flex-col gap-1`
    : `flex-none w-[120px] md:w-[140px] lg:w-[160px] h-full ${hideRelationships ? "" : "min-h-[320px]"} p-2 pt-2 rounded-[18px] bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-[24px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-foreground text-center box-border transition-all duration-300 relative flex flex-col gap-1`

  if (isCurrent) {
    pillarClass +=
      " ring-1 ring-orange-500/50 shadow-[0_8px_32px_rgba(249,115,22,0.1)]"
  } else {
    pillarClass += " hover:bg-card/60"
  }

  if (isSelected) {
    pillarClass +=
      " ring-2 ring-primary shadow-[0_8px_32px_rgba(233,75,75,0.15)]"
  }

  if (onClick) {
    pillarClass +=
      " cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
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
      <div
        className={`relative flex w-full items-start justify-between ${isSmall ? "min-h-[20px]" : "min-h-[28px]"}`}
      >
        <div className="flex flex-col items-start text-left">
          <span
            className={`line-clamp-2 font-semibold tracking-tight text-foreground/90 ${isSmall ? "text-[10px]" : "text-[12px]"}`}
          >
            {mainTitle}
          </span>
          {chineseTitle && (
            <span
              className={`mt-0.5 font-medium text-muted-foreground/60 ${isSmall ? "text-[8px]" : "text-[10px]"}`}
            >
              {chineseTitle}
            </span>
          )}
          {periodLabel && periodValue && (
            <span
              className={`mt-0.5 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 font-bold tracking-wide text-primary ${isSmall ? "text-[8px]" : "text-[9px]"}`}
            >
              {periodValue}
            </span>
          )}
        </div>
        {hsTenGodAbbr && (
          <div
            className={`flex items-center justify-center rounded-full border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 font-bold tracking-wide text-purple-600 shadow-sm dark:text-purple-400 ${isSmall ? "h-[20px] px-1.5 text-[9px]" : "h-[24px] px-2.5 text-[11px]"}`}
          >
            {hsTenGodAbbr}
          </div>
        )}
      </div>

      {/* Heavenly Stem */}
      <div className="group relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 dark:to-white/5"></div>
        <strong
          className={`font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] leading-none drop-shadow-sm transition-transform duration-300 group-hover:scale-105 ${isSmall ? "text-[30px]" : "text-[42px]"}`}
          style={{ color: ELEMENT_COLORS[hsElement] }}
        >
          {heavenly_stem?.character || "?"}
        </strong>
        <div
          className={`mt-0.5 font-bold tracking-[0.2em] uppercase opacity-80 ${isSmall ? "text-[7px]" : "text-[9px]"}`}
          style={{ color: ELEMENT_COLORS[hsElement] }}
        >
          {heavenly_stem?.name || "N/A"}
        </div>
      </div>

      {/* Separator */}
      <div
        className={`flex w-full items-center justify-center ${isSmall ? "my-0" : "my-0.5"}`}
      >
        <div
          className={`h-[1px] bg-gradient-to-r from-transparent via-border to-transparent ${isSmall ? "w-6" : "w-8"}`}
        ></div>
      </div>

      {/* Earthly Branch */}
      <div className="group relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 dark:to-white/5"></div>
        <strong
          className={`font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] leading-none drop-shadow-sm transition-transform duration-300 group-hover:scale-105 ${isSmall ? "text-[26px]" : "text-[38px]"}`}
          style={{ color: ELEMENT_COLORS[ebElement] }}
        >
          {earthly_branch?.character || "?"}
        </strong>
        <div
          className={`mt-0.5 font-bold tracking-[0.2em] uppercase opacity-80 ${isSmall ? "text-[7px]" : "text-[9px]"}`}
          style={{ color: ELEMENT_COLORS[ebElement] }}
        >
          {earthly_branch?.name || "N/A"}
        </div>

        {/* Lucky Stars Indicator */}
        {starsForThisBranch.length > 0 && (
          <div
            className={`absolute -top-2 -right-2 z-10 flex flex-col items-center gap-1 rounded-full border border-white/20 bg-white/80 shadow-sm backdrop-blur-md dark:bg-black/80 ${isSmall ? "p-1" : "p-1.5"}`}
          >
            {starsForThisBranch.map((star, idx) => (
              <div
                key={idx}
                className={`leading-none drop-shadow-sm ${isSmall ? "text-[11px]" : "text-[14px]"}`}
              >
                {star}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Stems (Mini Chips) */}
      <div
        className={`flex w-full justify-center gap-0.5 ${isSmall ? "mt-0.5" : "mt-0.5"}`}
      >
        {[
          hidden_stems?.residual_qi,
          hidden_stems?.main_qi,
          hidden_stems?.sub_main_qi,
        ].map((qi, idx) => {
          if (!qi) return null
          return (
            <div
              key={idx}
              className={`flex flex-1 flex-col items-center justify-center border border-black/[0.04] bg-black/[0.02] dark:border-white/[0.04] dark:bg-white/[0.02] ${isSmall ? "rounded-[8px] px-0.5 py-0.5" : "rounded-[10px] px-1 py-1"}`}
            >
              <span
                className={`mb-0.5 font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] leading-none font-bold drop-shadow-sm ${isSmall ? "text-[11px]" : "text-[13px]"}`}
                style={{ color: ELEMENT_COLORS[qi.element] }}
              >
                {qi.character}
              </span>
              <span
                className={`font-bold tracking-wider text-muted-foreground/70 uppercase ${isSmall ? "text-[6px]" : "text-[7px]"}`}
              >
                {qi.ten_gods || "-"}
              </span>
            </div>
          )
        })}
      </div>

      {/* Element Section (Nayin) & Life Stage */}
      <div
        className={`flex w-full items-center justify-between px-0.5 ${isSmall ? "mt-0.5 min-h-[14px]" : "mt-0.5 min-h-[18px]"}`}
      >
        <span
          className={`line-clamp-2 flex-1 pr-1 text-left font-medium text-muted-foreground/80 ${isSmall ? "text-[8px]" : "text-[10px]"}`}
        >
          {heavenly_stem?.name && earthly_branch?.name
            ? formatNayinName(
                getNayinFromStemBranch(heavenly_stem.name, earthly_branch.name),
                mode
              )
            : gan_zhi?.name || "N/A"}
        </span>
        <span
          className={`rounded-full bg-purple-500/10 px-1.5 py-0.5 font-bold tracking-wider whitespace-nowrap text-purple-500/80 uppercase ${isSmall ? "text-[7px]" : "text-[9px]"}`}
        >
          {heavenly_stem?.name && earthly_branch?.name && dayMasterName
            ? formatLifeCycleName(dayMasterName, earthly_branch.name, mode)
            : life_cycle || "N/A"}
        </span>
      </div>

      {/* Spacer to push Relationship Indicators to the bottom */}
      {!hideRelationships && <div className="flex-grow"></div>}

      {/* Relationship Indicators (Always Visible) */}
      {!hideRelationships && (hsLabel || branchLabels.length > 0) && (
        <div className="mt-auto w-full border-t border-border/50 pt-1">
          <div className="flex w-full flex-col gap-1 text-left">
            {hsLabel && (
              <div
                className="flex items-center gap-1 rounded-lg bg-black/[0.02] px-1.5 py-0.5 text-[9px] font-normal dark:bg-white/[0.02]"
                style={{ color: "var(--color-chart-3)" }}
              >
                <div className="h-1 w-1 shrink-0 rounded-full bg-current opacity-50"></div>
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
                  className={`flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[9px] font-normal ${bgColor}`}
                  style={{ color }}
                >
                  <div className="h-1 w-1 shrink-0 rounded-full bg-current opacity-50"></div>
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
