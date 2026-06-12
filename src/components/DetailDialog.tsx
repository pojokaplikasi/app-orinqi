/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { HEAVENLY_STEMS } from "@/lib/bazi/constants"
import { getTenGodsRelationship } from "@/lib/bazi/element-analysis"

interface DetailDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedHourData: any
  selectedLuckData: any
  selectedYearData: any
  selectedMonthData: any
  selectedDayData: any
  selectedYear: number | null
  selectedDay: number | null
  baziData: any
  luckyStars: any
}

export default function DetailDialog({
  isOpen,
  onClose,
  selectedHourData,
  selectedLuckData,
  selectedYearData,
  selectedMonthData,
  selectedDayData,
  selectedYear,
  selectedDay,
  baziData,
  luckyStars,
}: DetailDialogProps) {
  if (!isOpen || !selectedHourData) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent flex-col overflow-y-auto rounded-[24px] bg-background shadow-2xl hover:scrollbar-thumb-muted-foreground/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 p-6 backdrop-blur-md">
          <div>
            <h3 className="text-[20px] font-bold text-foreground">
              Detailed Pillar Information
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {selectedLuckData?.year_start}–{selectedLuckData?.year_end} •{" "}
              {selectedYear} • {selectedMonthData?.month_english} • Day{" "}
              {selectedDay} • {selectedHourData.hour_time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
          >
            ✕
          </button>
        </div>

        {/* Dialog Content */}
        <div className="flex flex-col gap-6 p-6">
          {/* Selected Pillars Summary */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              {
                label: "10-Year",
                data: selectedLuckData,
                color: "#8B5CF6",
              },
              {
                label: "Year",
                data: selectedYearData,
                color: "#A855F7",
              },
              {
                label: "Month",
                data: selectedMonthData,
                color: "#F97316",
              },
              {
                label: "Day",
                data: selectedDayData,
                color: "#22C55E",
              },
              { label: "Hour", data: selectedHourData, color: "#06B6D4" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center rounded-[16px] border border-border bg-muted/30 p-3 text-center"
              >
                <span
                  className="mb-2 text-[11px] font-bold tracking-wider uppercase"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <span className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[20px] leading-none text-foreground">
                      {item.data?.heavenly_stem?.character ||
                        item.data?.heavenly_stem?.name_sc ||
                        "?"}
                    </span>
                    <span className="mt-1 text-[9px] text-muted-foreground">
                      {item.data?.heavenly_stem?.name || "?"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[20px] leading-none text-foreground">
                      {item.data?.earthly_branch?.character ||
                        item.data?.earthly_branch?.name_sc ||
                        "?"}
                    </span>
                    <span className="mt-1 text-[9px] text-muted-foreground">
                      {item.data?.earthly_branch?.name || "?"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Info List */}
          <div className="flex flex-col gap-8">
            {[
              {
                label: "10-Year Luck Pillar",
                data: selectedLuckData,
                color: "#8B5CF6",
              },
              {
                label: "Year Pillar",
                data: selectedYearData,
                color: "#A855F7",
              },
              {
                label: "Month Pillar",
                data: selectedMonthData,
                color: "#F97316",
              },
              {
                label: "Day Pillar",
                data: selectedDayData,
                color: "#22C55E",
              },
              {
                label: "Hour Pillar",
                data: selectedHourData,
                color: "#06B6D4",
              },
            ].map((pillarItem, pIdx) => {
              if (!pillarItem.data) return null

              // Calculate Ten God for Heavenly Stem
              let hsTenGodAbbr = pillarItem.data.heavenly_stem?.ten_god || "-"
              if (
                baziData?.four_pillars?.day_pillar?.heavenly_stem?.name &&
                pillarItem.data.heavenly_stem?.name
              ) {
                const dayMasterIndex = HEAVENLY_STEMS.findIndex(
                  (s) =>
                    s.name ===
                    baziData.four_pillars.day_pillar.heavenly_stem.name
                )
                const stemIndex = HEAVENLY_STEMS.findIndex(
                  (s) => s.name === pillarItem.data.heavenly_stem.name
                )
                if (
                  dayMasterIndex >= 0 &&
                  stemIndex >= 0 &&
                  dayMasterIndex !== stemIndex
                ) {
                  hsTenGodAbbr = getTenGodsRelationship(
                    dayMasterIndex,
                    stemIndex
                  )
                }
              }

              // Check Lucky Stars for this branch
              const starsForThisBranch = []
              if (luckyStars && pillarItem.data.earthly_branch?.name) {
                const branchEnglishName = pillarItem.data.earthly_branch.name
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
                  starsForThisBranch.push("👑 Nobleman")
                if (luckyStars.intelligence === branchTraditional)
                  starsForThisBranch.push("🎓 Intelligence")
                if (luckyStars.peachBlossom === branchTraditional)
                  starsForThisBranch.push("🌸 Peach Blossom")
                if (luckyStars.skyHorse === branchTraditional)
                  starsForThisBranch.push("🦄 Sky Horse")
                if (luckyStars.solitary === branchTraditional)
                  starsForThisBranch.push("🌙 Solitary")
                if (luckyStars.heavenlyDoctor === branchTraditional)
                  starsForThisBranch.push("⚕️ Heavenly Doctor")
                if (
                  Array.isArray(luckyStars.kongwang) &&
                  luckyStars.kongwang.includes(branchTraditional)
                )
                  starsForThisBranch.push("☯️ Kong Wang")
              }

              return (
                <div key={pIdx} className="flex flex-col gap-4">
                  <h4
                    className="flex items-center gap-2 border-b border-border pb-2 text-[16px] font-bold"
                    style={{ color: pillarItem.color }}
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: pillarItem.color }}
                    ></div>
                    {pillarItem.label} Details
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Heavenly Stem Details */}
                    <div className="relative rounded-[16px] border border-border bg-card p-4 shadow-sm">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[24px] text-foreground">
                          {pillarItem.data.heavenly_stem?.character ||
                            pillarItem.data.heavenly_stem?.name_sc}
                        </div>
                        <div>
                          <h5 className="text-[14px] font-bold text-foreground">
                            Heavenly Stem
                          </h5>
                          <p className="text-[12px] text-muted-foreground">
                            {pillarItem.data.heavenly_stem?.name}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Element:
                          </span>{" "}
                          <span className="font-medium text-foreground">
                            {pillarItem.data.heavenly_stem?.element}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Ten God:
                          </span>{" "}
                          <span className="font-medium text-foreground">
                            {hsTenGodAbbr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Earthly Branch Details */}
                    <div className="relative rounded-[16px] border border-border bg-card p-4 shadow-sm">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[24px] text-foreground">
                          {pillarItem.data.earthly_branch?.character ||
                            pillarItem.data.earthly_branch?.name_sc}
                        </div>
                        <div>
                          <h5 className="text-[14px] font-bold text-foreground">
                            Earthly Branch
                          </h5>
                          <p className="text-[12px] text-muted-foreground">
                            {pillarItem.data.earthly_branch?.name} (
                            {pillarItem.data.earthly_branch?.zodiac})
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Element:
                          </span>{" "}
                          <span className="font-medium text-foreground">
                            {pillarItem.data.earthly_branch?.element}
                          </span>
                        </div>
                      </div>
                      {/* Lucky Stars Indicator */}
                      {starsForThisBranch.length > 0 && (
                        <div className="mt-3 border-t border-border pt-3">
                          <span className="mb-1 block text-[12px] text-muted-foreground">
                            Lucky Stars:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {starsForThisBranch.map((star, idx) => (
                              <span
                                key={idx}
                                className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {star}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hidden Stems */}
                  {pillarItem.data.hidden_stems && (
                    <div className="mt-2 rounded-[16px] border border-border bg-card p-4 shadow-sm">
                      <h5 className="mb-3 text-[14px] font-bold text-foreground">
                        Hidden Stems
                      </h5>
                      <div className="flex flex-wrap gap-3">
                        {[
                          pillarItem.data.hidden_stems.main_qi,
                          pillarItem.data.hidden_stems.sub_main_qi,
                          pillarItem.data.hidden_stems.residual_qi,
                        ].map((qi, idx) => {
                          if (!qi) return null
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-2 rounded-[10px] border border-border bg-muted/30 px-3 py-2"
                            >
                              <span className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[18px] text-foreground">
                                {qi.character || qi.name_sc}
                              </span>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-foreground">
                                  {qi.name}
                                </span>
                                <span className="text-[9px] text-muted-foreground uppercase">
                                  {qi.ten_gods || "-"}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-[16px] border border-border bg-card p-4 shadow-sm">
                      <h5 className="mb-2 text-[14px] font-bold text-foreground">
                        Life Stage
                      </h5>
                      <p className="text-[14px] font-medium text-purple-600 dark:text-purple-400">
                        {pillarItem.data.life_stage ||
                          pillarItem.data.life_cycle ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="rounded-[16px] border border-border bg-card p-4 shadow-sm">
                      <h5 className="mb-2 text-[14px] font-bold text-foreground">
                        Na Yin (Melodic Element)
                      </h5>
                      <p className="text-[14px] font-medium text-foreground">
                        {pillarItem.data.gan_zhi?.name || "N/A"}
                      </p>
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
