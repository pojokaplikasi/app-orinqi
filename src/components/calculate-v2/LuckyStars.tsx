import React from "react"

interface LuckyStarsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stars: any
  mode?: "classic" | "modern"
}

export default function LuckyStars({
  stars,
  mode = "modern",
}: LuckyStarsProps) {
  if (!stars) return null

  const getBranchInfo = (branchTraditionalName: string) => {
    if (!branchTraditionalName) return { character: "", english: "" }

    const traditionalToEnglishMap: Record<string, string> = {
      Zi: "Rat",
      Chou: "Ox",
      Yin: "Tiger",
      Mao: "Rabbit",
      Chen: "Dragon",
      Si: "Snake",
      Wu: "Horse",
      Wei: "Goat",
      Shen: "Monkey",
      You: "Rooster",
      Xu: "Dog",
      Hai: "Pig",
    }

    const englishName =
      traditionalToEnglishMap[branchTraditionalName] || branchTraditionalName

    // Hardcode characters to avoid importing EARTHLY_BRANCHES
    const branchChars: Record<string, string> = {
      Rat: "子",
      Ox: "丑",
      Tiger: "寅",
      Rabbit: "卯",
      Dragon: "辰",
      Snake: "巳",
      Horse: "午",
      Goat: "未",
      Monkey: "申",
      Rooster: "酉",
      Dog: "戌",
      Pig: "亥",
    }

    return {
      character: branchChars[englishName] || branchTraditionalName,
      english: englishName,
    }
  }

  const starConfig = [
    {
      id: "nobleman",
      name: "Noble People",
      chinese: "贵人",
      icon: "👑",
      color: "#16A34A",
      branches:
        stars.nobleman && stars.nobleman.length > 0
          ? stars.nobleman
              .map((b: string) => {
                const info = getBranchInfo(b)
                return `${info.character} ${info.english}`
              })
              .join(", ")
          : null,
    },
    {
      id: "intelligence",
      name: "Intelligence",
      chinese: "文昌",
      icon: "🎓",
      color: "#2563EB",
      branches: stars.intelligence
        ? (() => {
            const info = getBranchInfo(stars.intelligence)
            return `${info.character} ${info.english}`
          })()
        : null,
    },
    {
      id: "peachBlossom",
      name: "Peach Blossom",
      chinese: "桃花",
      icon: "🌸",
      color: "#EC4899",
      branches: stars.peachBlossom
        ? (() => {
            const info = getBranchInfo(stars.peachBlossom)
            return `${info.character} ${info.english}`
          })()
        : null,
    },
    {
      id: "skyHorse",
      name: "Sky Horse",
      chinese: "驿马",
      icon: "🦄",
      color: "#F97316",
      branches: stars.skyHorse
        ? (() => {
            const info = getBranchInfo(stars.skyHorse)
            return `${info.character} ${info.english}`
          })()
        : null,
    },
    {
      id: "solitary",
      name: "Solitary",
      chinese: "孤辰",
      icon: "🌙",
      color: "#9333EA",
      branches: stars.solitary
        ? (() => {
            const info = getBranchInfo(stars.solitary)
            return `${info.character} ${info.english}`
          })()
        : null,
    },
    {
      id: "heavenlyDoctor",
      name: "Heavenly Doctor",
      chinese: "天医",
      icon: "⚕️",
      color: "#10B981",
      branches: stars.heavenlyDoctor
        ? (() => {
            const info = getBranchInfo(stars.heavenlyDoctor)
            return `${info.character} ${info.english}`
          })()
        : null,
    },
    {
      id: "kongwang",
      name: mode === "modern" ? "Dead Emptiness" : "Kong Wang",
      chinese: "空亡",
      icon: "🌪️",
      color: "#8B5CF6",
      branches:
        stars.kongwang && stars.kongwang.length > 0
          ? stars.kongwang
              .map((kw: string) => {
                const kwInfo = getBranchInfo(kw)
                return kwInfo.character
                  ? `${kwInfo.character} ${kwInfo.english}`
                  : ""
              })
              .join(", ")
          : null,
    },
  ]

  const activeStars = starConfig.filter((star) => star.branches)

  return (
    <div className="flex flex-col gap-1">
      {activeStars.length > 0 ? (
        activeStars.map((star) => (
          <div
            key={star.id}
            className="flex items-center gap-1 rounded-[10px] border border-border bg-card px-1.5 py-1"
          >
            {/* Icon */}
            <span className="flex-shrink-0 text-[22px] leading-none">
              {star.icon}
            </span>

            {/* Name + Chinese */}
            <div className="flex min-w-0 flex-1 flex-col gap-0">
              <span className="truncate text-[12px] leading-tight font-semibold text-foreground">
                {star.name}
              </span>
              <span className="text-[10px] leading-tight text-muted-foreground">
                {star.chinese}
              </span>
            </div>

            {/* Branch value */}
            <span
              className="shrink-0 text-[11px] font-medium"
              style={{ color: star.color }}
            >
              {star.branches}
            </span>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center rounded-[18px] border border-border bg-card p-3 text-[14px] text-muted-foreground">
          No active stars found in this chart.
        </div>
      )}
    </div>
  )
}
