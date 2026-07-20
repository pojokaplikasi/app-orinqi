/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from "react"
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
  onPrev?: () => void
  onNext?: () => void
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
  onPrev,
  onNext,
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
      ? `${mode === "classic" ? "He Hua" : "HS Combinations"} ${hsCombos.map((c) => c.partner).join(", ")}`
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

      let name = ""
      if (mode === "classic") {
        name =
          type === "seasonal"
            ? "San Hui"
            : type === "sanhe"
              ? "San He"
              : type === "banhe"
                ? "Ban He"
                : type === "liuhe"
                  ? "Liu He"
                  : "An He"
      } else {
        name =
          type === "seasonal"
            ? "Seasonal Unions"
            : type === "sanhe"
              ? "Three Harmonies"
              : type === "banhe"
                ? "Half Combinations"
                : type === "liuhe"
                  ? "Six Harmonies"
                  : "Hidden Combinations"
      }

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

      let name = ""
      if (mode === "classic") {
        name =
          type === "ungrateful"
            ? "Wu En Zhi Xing"
            : type === "arrogant"
              ? "Chi Shi Zhi Xing"
              : type === "rude"
                ? "Wu Li Zhi Xing"
                : type === "self"
                  ? "Zi Xing"
                  : type === "clash"
                    ? "Liu Chong"
                    : type === "destruction"
                      ? "Xiang Po"
                      : "Xiang Hai"
      } else {
        name =
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
      }

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
    "w-full h-full min-h-[320px] p-2 pt-2 rounded-[18px] bg-card border border-border shadow-sm text-foreground text-center box-border relative flex flex-col gap-1"

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
    <div className={`${pillarClass} relative`} onClick={onClick}>
      {/* Prev / Next navigation arrows on left & right edges */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute top-[15%] left-0 z-20 flex h-7 w-5 items-center justify-center rounded-r-lg border border-l-0 border-border/50 bg-muted/95 text-foreground/80 shadow-md backdrop-blur-md transition-colors hover:bg-primary/10 hover:text-primary"
          title="Previous"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute top-[15%] right-0 z-20 flex h-7 w-5 items-center justify-center rounded-l-lg border border-r-0 border-border/50 bg-muted/95 text-foreground/80 shadow-md backdrop-blur-md transition-colors hover:bg-primary/10 hover:text-primary"
          title="Next"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Header & Ten Gods Badge */}
      <div className="relative flex min-h-[28px] w-full items-start justify-between">
        <div className="flex flex-col items-start text-left">
          <span className="line-clamp-2 text-[12px] font-semibold tracking-tight text-foreground/90">
            {mainTitle}
          </span>
          {chineseTitle && (
            <span className="mt-0.5 text-[10px] font-medium text-muted-foreground/60">
              {chineseTitle}
            </span>
          )}
          {periodLabel && periodValue && (
            <span className="mt-0.5 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-primary">
              {periodValue}
            </span>
          )}
        </div>
        {hsTenGodAbbr && (
          <div className="flex h-[24px] items-center justify-center rounded-full border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 px-2.5 text-[11px] font-bold tracking-wide text-purple-600 shadow-sm dark:text-purple-400">
            {hsTenGodAbbr}
          </div>
        )}
      </div>

      {/* Heavenly Stem */}
      <div className="relative flex flex-col items-center justify-center">
        <strong
          className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[42px] leading-none"
          style={{ color: ELEMENT_COLORS[hsElement] }}
        >
          {heavenly_stem?.character || "?"}
        </strong>
        <div
          className="mt-0.5 text-[9px] font-bold tracking-[0.2em] uppercase opacity-80"
          style={{ color: ELEMENT_COLORS[hsElement] }}
        >
          {heavenly_stem?.name || "N/A"}
        </div>
      </div>

      {/* Separator */}
      <div className="my-0.5 flex w-full items-center justify-center">
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
          className="mt-0.5 text-[9px] font-bold tracking-[0.2em] uppercase opacity-80"
          style={{ color: ELEMENT_COLORS[ebElement] }}
        >
          {earthly_branch?.name || "N/A"}
        </div>

        {/* Lucky Stars Indicator */}
        {starsForThisBranch.length > 0 && (
          <div className="absolute -top-2 -right-2 z-10 flex flex-col items-center gap-1 rounded-full border border-border bg-background p-1.5 shadow-sm">
            {starsForThisBranch.map((star, idx) => (
              <div
                key={idx}
                className="text-[14px] leading-none drop-shadow-sm"
              >
                {star}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Stems (Mini Chips) */}
      <div className="mt-0.5 flex w-full justify-center gap-0.5">
        {[
          hidden_stems?.residual_qi,
          hidden_stems?.main_qi,
          hidden_stems?.sub_main_qi,
        ].map((qi, idx) => {
          if (!qi) return null
          return (
            <div
              key={idx}
              className="flex flex-1 flex-col items-center justify-center rounded-[10px] border border-black/[0.04] bg-black/[0.02] px-1 py-1 dark:border-white/[0.04] dark:bg-white/[0.02]"
            >
              <span
                className="mb-0.5 font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[14px] leading-none font-extrabold drop-shadow-md"
                style={{ color: ELEMENT_COLORS[qi.element] }}
              >
                {qi.character}
              </span>
              <span className="text-[8px] font-extrabold tracking-wider text-muted-foreground/90 uppercase">
                {qi.ten_gods || "-"}
              </span>
            </div>
          )
        })}
      </div>

      {/* Element Section (Nayin) & Life Stage */}
      <div className="mt-0.5 flex min-h-[18px] w-full items-center justify-between px-0.5">
        <span className="line-clamp-2 flex-1 pr-1 text-left text-[10px] font-bold text-muted-foreground/90">
          {heavenly_stem?.name && earthly_branch?.name
            ? formatNayinName(
                getNayinFromStemBranch(heavenly_stem.name, earthly_branch.name),
                mode
              )
            : gan_zhi?.name || "N/A"}
        </span>
        <span className="rounded-full bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wider whitespace-nowrap text-purple-500/80 uppercase">
          {heavenly_stem?.name && earthly_branch?.name && dayMasterName
            ? formatLifeCycleName(dayMasterName, earthly_branch.name, mode)
            : life_cycle || "N/A"}
        </span>
      </div>

      {/* Spacer to push Relationship Indicators to the bottom */}
      <div className="flex-grow"></div>

      {/* Relationship Indicators (Always Visible) */}
      {(hsLabel || branchLabels.length > 0) && (
        <div className="mt-auto w-full border-t border-border/50 pt-1">
          <div className="flex w-full flex-col gap-1 text-left">
            {hsLabel && (
              <div
                className="flex items-center gap-1 rounded-lg bg-black/[0.02] px-1.5 py-0.5 text-[9px] font-semibold dark:bg-white/[0.02]"
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
                  className={`flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[9px] font-semibold ${bgColor}`}
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

export default memo(Pillar)
