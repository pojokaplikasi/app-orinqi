import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { push, ref, set } from "firebase/database"
import { rtdb } from "@/lib/firebase"
import { useAuth } from "@/components/providers/AuthProvider"

interface HeroFormProps {
  date: string
  setDate: (date: string) => void
  time: string
  setTime: (time: string) => void
  timezone: string
  setTimezone: (timezone: string) => void
  gender: number | null
  setGender: (gender: number | null) => void
  unknownTime: boolean
  setUnknownTime: (unknownTime: boolean) => void
  mode: "classic" | "modern"
  setMode: (mode: "classic" | "modern") => void
  onCalculate: () => void
  loading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baziData?: any
  /** Ref forwarded from page — StickyHeader watches this element's position */
  heroRef?: React.RefObject<HTMLDivElement | null>
  /** Lifted state so StickyHeader can read chartName */
  chartName: string
  setChartName: (name: string) => void
}

export default function HeroForm({
  date,
  setDate,
  time,
  setTime,
  timezone,
  setTimezone,
  gender,
  setGender,
  unknownTime,
  setUnknownTime,
  mode,
  setMode,
  onCalculate,
  loading,
  baziData,
  heroRef,
  chartName,
  setChartName,
}: HeroFormProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  const handleEditClick = () => {
    setTempName(chartName)
    setIsEditingName(true)
  }

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempName.trim()) {
      setChartName(tempName.trim())
    }
    setIsEditingName(false)
  }

  const handleCalculateWithSave = async () => {
    // Panggil fungsi calculate asli
    await onCalculate()

    // Jika user login dan nama chart sudah diisi, simpan ke Firebase
    if (user && chartName.trim() && date && timezone && gender !== null) {
      try {
        const historyRef = ref(rtdb, `users/${user.uid}/history`)
        const newRecordRef = push(historyRef)
        await set(newRecordRef, {
          name: chartName,
          date: date,
          time: unknownTime ? null : time,
          timezone: timezone,
          gender: gender,
          unknownTime: unknownTime,
          createdAt: Date.now(),
        })
      } catch (error) {
        console.error("Failed to save history to Firebase:", error)
      }
    }
  }

  // If data is present, show the static hero info card
  if (baziData) {
    return (
      <>
        {/* Hero card — StickyHeader watches this element's bottom edge */}
        <div ref={heroRef} className="w-full px-0 py-1">
          <div className="mx-auto w-full max-w-[1800px]">
            <div className="relative overflow-hidden rounded-[18px] border border-border bg-card px-3 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                  <span className="font-serif text-xl font-bold text-primary-foreground">
                    命
                  </span>
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <h2 className="truncate text-[16px] leading-tight font-bold text-foreground">
                      {chartName}
                    </h2>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-primary"
                      title="Go to Dashboard"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="truncate text-[12px] text-muted-foreground">
                    {new Date(date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {!unknownTime && time && ` • ${time}`}
                    {" • "}
                    {(() => {
                      try {
                        const raw =
                          new Intl.DateTimeFormat("en", {
                            timeZone: timezone,
                            timeZoneName: "shortOffset",
                          })
                            .formatToParts(new Date())
                            .find((p) => p.type === "timeZoneName")?.value ?? ""
                        return raw.replace("GMT", "UTC") || timezone
                      } catch {
                        return timezone
                      }
                    })()}
                  </p>
                </div>

                {/* Badges + Mode toggle */}
                <div className="flex shrink-0 items-center gap-1">
                  {/* Gender icon */}
                  <span
                    className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[13px]"
                    title={gender === 1 ? "Male" : "Female"}
                  >
                    {gender === 1 ? "♂" : "♀"}
                  </span>

                  <div className="flex rounded-[10px] border border-border bg-muted/50 p-0.5">
                    <button
                      type="button"
                      onClick={() => setMode("classic")}
                      className={`rounded-[8px] px-2 py-0.5 text-[11px] font-semibold transition-colors ${mode === "classic" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Classic
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("modern")}
                      className={`rounded-[8px] px-2 py-0.5 text-[11px] font-semibold transition-colors ${mode === "modern" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Modern
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Name Dialog */}
        {isEditingName && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setIsEditingName(false)}
          >
            <div
              className="flex w-full max-w-md flex-col overflow-hidden rounded-[24px] bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border p-6">
                <h3 className="text-[20px] font-bold text-foreground">
                  Edit Chart Name
                </h3>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveName} className="p-6">
                <div className="mb-6">
                  <label className="mb-2 block text-[14px] font-medium text-muted-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="h-[56px] w-full rounded-[16px] border border-input bg-background px-4 text-[16px] text-foreground transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                    placeholder="e.g. Hendro's Chart"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="rounded-[12px] px-6 py-2.5 text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-[12px] bg-primary px-6 py-2.5 text-[14px] font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    Save Name
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="relative flex min-h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
          <div className="mb-6 flex h-[80px] w-[80px] animate-pulse items-center justify-center rounded-full border-4 border-border bg-gradient-to-br from-primary to-primary/80 shadow-sm">
            <span className="font-serif text-4xl font-bold text-primary-foreground">
              命
            </span>
          </div>
          <h3 className="mb-2 text-[24px] font-bold text-foreground">
            Calculating Destiny...
          </h3>
          <p className="text-[15px] text-muted-foreground">
            Analyzing heavenly stems and earthly branches
          </p>
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        {/* Subtle Cloud/Wave Pattern - Top Right */}
        <svg
          className="absolute top-[-10%] right-[-5%] h-[50%] w-[50%] text-primary opacity-[0.03]"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,97.4,-2.4C98.1,13.3,93.4,29.3,84.3,42.5C75.2,55.7,61.7,66.1,46.8,73.1C31.9,80.1,15.9,83.7,0.3,83.2C-15.3,82.7,-30.6,78.1,-44.2,70.2C-57.8,62.3,-69.7,51.1,-78.1,37.5C-86.5,23.9,-91.4,7.9,-89.8,-7.3C-88.2,-22.5,-80.1,-36.9,-69.5,-48.4C-58.9,-59.9,-45.8,-68.5,-32.1,-75.1C-18.4,-81.7,-4.1,-86.3,10.5,-85.5C25.1,-84.7,30.6,-83.6,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
        {/* Subtle Cloud/Wave Pattern - Bottom Left */}
        <svg
          className="absolute bottom-[-10%] left-[-5%] h-[60%] w-[60%] text-primary opacity-[0.03]"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M39.9,-65.7C54.1,-60.5,69.6,-53.8,79.5,-41.9C89.4,-30,93.7,-12.9,91.3,3.4C88.9,19.7,79.8,35.2,68.1,47.4C56.4,59.6,42.1,68.5,26.6,73.5C11.1,78.5,-5.6,79.6,-21.5,75.4C-37.4,71.2,-52.5,61.7,-63.4,49.1C-74.3,36.5,-81,20.8,-82.6,4.7C-84.2,-11.4,-80.7,-27.9,-71.6,-40.8C-62.5,-53.7,-47.8,-63,-33.4,-68.5C-19,-74,-4.5,-75.7,9.1,-73.1C22.7,-70.5,35.4,-63.6,39.9,-65.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center gap-12 lg:flex-row">
        {/* Left Side: Large SVG Illustration */}
        <div className="hidden w-1/2 flex-col items-center justify-center lg:flex">
          <div className="relative aspect-square w-full max-w-[520px]">
            <svg
              viewBox="0 0 520 520"
              className="h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="bg-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.08"
                  />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient
                  id="pillar-fill"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.05"
                  />
                </linearGradient>
                <linearGradient
                  id="pillar-fill-day"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.5"
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.1"
                  />
                </linearGradient>
                <linearGradient
                  id="core-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="1"
                  />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="1" />
                </linearGradient>
                <linearGradient
                  id="ring-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity="0.6"
                  />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* ── Background Circle ── */}
              <circle cx="260" cy="260" r="230" fill="url(#bg-grad)" />

              {/* ── Outer Decorative Ring ── */}
              <circle
                cx="260"
                cy="260"
                r="228"
                fill="none"
                stroke="url(#ring-grad)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <circle
                cx="260"
                cy="260"
                r="210"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/15"
              />

              {/* ── BaGua Octagon ── */}
              <polygon
                points="260,50 380,100 430,220 380,340 260,390 140,340 90,220 140,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-primary/30"
              />
              {/* BaGua inner octagon */}
              <polygon
                points="260,80 360,120 400,220 360,320 260,360 160,320 120,220 160,120"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                className="text-primary/15"
              />

              {/* ── BaGua Trigram Lines (8 directions) ── */}
              {[
                { x1: 260, y1: 50, x2: 260, y2: 80 },
                { x1: 380, y1: 100, x2: 360, y2: 120 },
                { x1: 430, y1: 220, x2: 400, y2: 220 },
                { x1: 380, y1: 340, x2: 360, y2: 320 },
                { x1: 260, y1: 390, x2: 260, y2: 360 },
                { x1: 140, y1: 340, x2: 160, y2: 320 },
                { x1: 90, y1: 220, x2: 120, y2: 220 },
                { x1: 140, y1: 100, x2: 160, y2: 120 },
              ].map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary/40"
                />
              ))}

              {/* ── Trigram symbols at 8 directions ── */}
              {/* North - ☵ Kan (Water) */}
              <g transform="translate(260, 38)">
                <rect
                  x="-12"
                  y="-4"
                  width="24"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="-12"
                  y="0"
                  width="9"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="3"
                  y="0"
                  width="9"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="-12"
                  y="4"
                  width="24"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
              </g>
              {/* South - ☲ Li (Fire) */}
              <g transform="translate(260, 402)">
                <rect
                  x="-12"
                  y="-4"
                  width="24"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="-12"
                  y="0"
                  width="9"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="3"
                  y="0"
                  width="9"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="-12"
                  y="4"
                  width="24"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
              </g>
              {/* East - ☳ Zhen (Thunder) */}
              <g transform="translate(445, 220)">
                <rect
                  x="-12"
                  y="-4"
                  width="24"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="-12"
                  y="0"
                  width="9"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="3"
                  y="0"
                  width="9"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="-12"
                  y="4"
                  width="24"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
              </g>
              {/* West - ☱ Dui (Lake) */}
              <g transform="translate(75, 220)">
                <rect
                  x="-12"
                  y="-4"
                  width="24"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="-12"
                  y="0"
                  width="24"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="-12"
                  y="4"
                  width="9"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <rect
                  x="3"
                  y="4"
                  width="9"
                  height="2.5"
                  rx="1"
                  fill="currentColor"
                  className="text-primary/60"
                />
              </g>

              {/* ── Inner Circle ── */}
              <circle
                cx="260"
                cy="220"
                r="130"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border/50"
              />

              {/* ── Four Pillars ── */}
              {/* Year Pillar */}
              <g transform="translate(120, 130)">
                <rect
                  x="0"
                  y="0"
                  width="52"
                  height="130"
                  rx="8"
                  fill="url(#pillar-fill)"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/30"
                />
                <rect
                  x="0"
                  y="0"
                  width="52"
                  height="30"
                  rx="8"
                  fill="url(#pillar-fill)"
                />
                <rect
                  x="0"
                  y="20"
                  width="52"
                  height="10"
                  fill="url(#pillar-fill)"
                />
                <line
                  x1="0"
                  y1="65"
                  x2="52"
                  y2="65"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  className="text-border/50"
                />
                <text
                  x="26"
                  y="22"
                  textAnchor="middle"
                  fontSize="14"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-foreground/70"
                >
                  年
                </text>
                <text
                  x="26"
                  y="50"
                  textAnchor="middle"
                  fontSize="18"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-primary/80"
                >
                  甲
                </text>
                <text
                  x="26"
                  y="90"
                  textAnchor="middle"
                  fontSize="18"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-foreground/60"
                >
                  子
                </text>
                <text
                  x="26"
                  y="118"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="sans-serif"
                  fill="currentColor"
                  className="text-muted-foreground/60"
                >
                  YEAR
                </text>
                <circle cx="26" cy="128" r="3" fill="#4CAF50" opacity="0.8" />
              </g>
              {/* Month Pillar */}
              <g transform="translate(182, 110)">
                <rect
                  x="0"
                  y="0"
                  width="52"
                  height="150"
                  rx="8"
                  fill="url(#pillar-fill)"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/30"
                />
                <rect
                  x="0"
                  y="0"
                  width="52"
                  height="30"
                  rx="8"
                  fill="url(#pillar-fill)"
                />
                <rect
                  x="0"
                  y="20"
                  width="52"
                  height="10"
                  fill="url(#pillar-fill)"
                />
                <line
                  x1="0"
                  y1="65"
                  x2="52"
                  y2="65"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  className="text-border/50"
                />
                <text
                  x="26"
                  y="22"
                  textAnchor="middle"
                  fontSize="14"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-foreground/70"
                >
                  月
                </text>
                <text
                  x="26"
                  y="50"
                  textAnchor="middle"
                  fontSize="18"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-primary/80"
                >
                  丙
                </text>
                <text
                  x="26"
                  y="90"
                  textAnchor="middle"
                  fontSize="18"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-foreground/60"
                >
                  午
                </text>
                <text
                  x="26"
                  y="138"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="sans-serif"
                  fill="currentColor"
                  className="text-muted-foreground/60"
                >
                  MONTH
                </text>
                <circle cx="26" cy="148" r="3" fill="#f44336" opacity="0.8" />
              </g>
              {/* Day Pillar (highlighted - Day Master) */}
              <g transform="translate(244, 90)">
                <rect
                  x="0"
                  y="0"
                  width="56"
                  height="170"
                  rx="8"
                  fill="url(#pillar-fill-day)"
                  stroke="url(#core-grad)"
                  strokeWidth="2"
                />
                <rect
                  x="0"
                  y="0"
                  width="56"
                  height="32"
                  rx="8"
                  fill="url(#pillar-fill-day)"
                />
                <rect
                  x="0"
                  y="22"
                  width="56"
                  height="10"
                  fill="url(#pillar-fill-day)"
                />
                <line
                  x1="0"
                  y1="68"
                  x2="56"
                  y2="68"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  className="text-primary/30"
                />
                <text
                  x="28"
                  y="23"
                  textAnchor="middle"
                  fontSize="14"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-foreground/90"
                >
                  日
                </text>
                <text
                  x="28"
                  y="54"
                  textAnchor="middle"
                  fontSize="22"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="hsl(var(--primary))"
                >
                  戊
                </text>
                <text
                  x="28"
                  y="98"
                  textAnchor="middle"
                  fontSize="22"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-foreground/80"
                >
                  午
                </text>
                <text
                  x="28"
                  y="148"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="sans-serif"
                  fill="hsl(var(--primary))"
                  fontWeight="bold"
                >
                  DAY
                </text>
                <text
                  x="28"
                  y="160"
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fill="currentColor"
                  className="text-muted-foreground/60"
                >
                  MASTER
                </text>
                <circle cx="28" cy="168" r="4" fill="url(#core-grad)" />
              </g>
              {/* Hour Pillar */}
              <g transform="translate(310, 120)">
                <rect
                  x="0"
                  y="0"
                  width="52"
                  height="140"
                  rx="8"
                  fill="url(#pillar-fill)"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary/30"
                />
                <rect
                  x="0"
                  y="0"
                  width="52"
                  height="30"
                  rx="8"
                  fill="url(#pillar-fill)"
                />
                <rect
                  x="0"
                  y="20"
                  width="52"
                  height="10"
                  fill="url(#pillar-fill)"
                />
                <line
                  x1="0"
                  y1="65"
                  x2="52"
                  y2="65"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  className="text-border/50"
                />
                <text
                  x="26"
                  y="22"
                  textAnchor="middle"
                  fontSize="14"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-foreground/70"
                >
                  時
                </text>
                <text
                  x="26"
                  y="50"
                  textAnchor="middle"
                  fontSize="18"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-primary/80"
                >
                  壬
                </text>
                <text
                  x="26"
                  y="90"
                  textAnchor="middle"
                  fontSize="18"
                  fontFamily="STKaiti, KaiTi, serif"
                  fill="currentColor"
                  className="text-foreground/60"
                >
                  子
                </text>
                <text
                  x="26"
                  y="128"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="sans-serif"
                  fill="currentColor"
                  className="text-muted-foreground/60"
                >
                  HOUR
                </text>
                <circle cx="26" cy="138" r="3" fill="#2196F3" opacity="0.8" />
              </g>

              {/* ── Bottom Label ── */}
              <text
                x="260"
                y="310"
                textAnchor="middle"
                fontSize="11"
                fontFamily="sans-serif"
                letterSpacing="4"
                fill="currentColor"
                className="text-muted-foreground/50"
              >
                FOUR PILLARS OF DESTINY
              </text>

              {/* ── Five Elements Row ── */}
              <g transform="translate(260, 350)">
                {[
                  { label: "木", color: "#4CAF50", x: -80 },
                  { label: "火", color: "#f44336", x: -40 },
                  { label: "土", color: "#bc8a60", x: 0 },
                  { label: "金", color: "#96a6ae", x: 40 },
                  { label: "水", color: "#2196F3", x: 80 },
                ].map((el) => (
                  <g key={el.label} transform={`translate(${el.x}, 0)`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill={el.color}
                      opacity="0.15"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill="none"
                      stroke={el.color}
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <text
                      x="0"
                      y="6"
                      textAnchor="middle"
                      fontSize="14"
                      fontFamily="STKaiti, KaiTi, serif"
                      fill={el.color}
                    >
                      {el.label}
                    </text>
                  </g>
                ))}
              </g>

              {/* ── Corner Decorations ── */}
              <g
                className="text-primary/20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M30 30 L30 55 M30 30 L55 30" />
                <path d="M490 30 L490 55 M490 30 L465 30" />
                <path d="M30 490 L30 465 M30 490 L55 490" />
                <path d="M490 490 L490 465 M490 490 L465 490" />
              </g>
            </svg>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="flex w-full flex-col items-center lg:w-1/2 lg:items-start">
          {/* Hero Header */}
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-4 flex items-center justify-center lg:justify-start">
              {/* App Mark (Seal) */}
              <div className="mr-4 flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-border bg-gradient-to-br from-primary to-primary/80 shadow-sm md:h-[56px] md:w-[56px]">
                <span className="font-serif text-xl font-bold text-primary-foreground md:text-2xl">
                  命
                </span>
              </div>
              <h1 className="text-[32px] leading-tight font-bold tracking-tight text-foreground md:text-[40px]">
                Orinqi Calculator
              </h1>
            </div>
            <p className="text-[15px] font-medium tracking-wide text-muted-foreground md:text-[16px]">
              Chinese Four Pillars Destiny Reading
            </p>
          </div>

          {/* Main Form Container (Liquid Glass) */}
          <div className="w-full rounded-[24px] border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6 flex flex-col">
              <label className="mb-2 ml-1 text-[14px] font-medium text-muted-foreground">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="h-[56px] w-full rounded-[16px] border border-input bg-background px-4 text-[16px] text-foreground transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                  value={chartName === "Your Destiny Chart" ? "" : chartName}
                  onChange={(e) =>
                    setChartName(e.target.value || "Your Destiny Chart")
                  }
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Desktop: 2 columns, Mobile: 1 column */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Date Input */}
              <div className="flex flex-col">
                <label className="mb-2 ml-1 text-[14px] font-medium text-muted-foreground">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="h-[56px] w-full appearance-none rounded-[16px] border border-input bg-background px-4 text-[16px] text-foreground transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Time Input */}
              <div className="flex flex-col">
                <label
                  className="mb-2 ml-1 text-[14px] font-medium text-muted-foreground transition-opacity duration-200"
                  style={{ opacity: unknownTime ? 0.5 : 1 }}
                >
                  Time of Birth
                </label>
                <div className="relative">
                  <input
                    type="time"
                    step="1"
                    className="h-[56px] w-full appearance-none rounded-[16px] border border-input bg-background px-4 text-[16px] text-foreground transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none disabled:bg-muted disabled:text-muted-foreground"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={unknownTime}
                    style={{ opacity: unknownTime ? 0.5 : 1 }}
                  />
                </div>
              </div>

              {/* Timezone Input (Full Width) */}
              <div className="flex flex-col md:col-span-2">
                <label className="mb-2 ml-1 text-[14px] font-medium text-muted-foreground">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    className="h-[56px] w-full appearance-none rounded-[16px] border border-input bg-background px-4 pr-10 text-[16px] text-foreground transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Timezone
                    </option>
                    <option value="Etc/GMT+12">
                      (UTC-12:00) International Date Line West
                    </option>
                    <option value="Pacific/Midway">
                      (UTC-11:00) Pacific/Midway, US/Samoa
                    </option>
                    <option value="Pacific/Honolulu">
                      (UTC-10:00) Pacific/Honolulu, US/Hawaii
                    </option>
                    <option value="America/Anchorage">
                      (UTC-09:00) America/Anchorage, US/Alaska
                    </option>
                    <option value="America/Los_Angeles">
                      (UTC-08:00) America/Los_Angeles
                    </option>
                    <option value="America/Denver">
                      (UTC-07:00) America/Denver
                    </option>
                    <option value="America/Chicago">
                      (UTC-06:00) America/Chicago
                    </option>
                    <option value="America/New_York">
                      (UTC-05:00) America/New_York
                    </option>
                    <option value="America/Halifax">
                      (UTC-04:00) America/Halifax
                    </option>
                    <option value="America/Argentina/Buenos_Aires">
                      (UTC-03:00) America/Argentina/Buenos_Aires
                    </option>
                    <option value="America/Noronha">
                      (UTC-02:00) America/Noronha
                    </option>
                    <option value="Atlantic/Cape_Verde">
                      (UTC-01:00) Atlantic/Cape_Verde
                    </option>
                    <option value="GMT">(UTC+00:00) UTC, GMT</option>
                    <option value="Europe/London">
                      (UTC+01:00) Europe/London
                    </option>
                    <option value="Europe/Helsinki">
                      (UTC+02:00) Europe/Helsinki
                    </option>
                    <option value="Europe/Moscow">
                      (UTC+03:00) Europe/Moscow
                    </option>
                    <option value="Asia/Dubai">(UTC+04:00) Asia/Dubai</option>
                    <option value="Asia/Karachi">
                      (UTC+05:00) Asia/Karachi
                    </option>
                    <option value="Asia/Dhaka">(UTC+06:00) Asia/Dhaka</option>
                    <option value="Asia/Bangkok">
                      (UTC+07:00) Asia/Bangkok
                    </option>
                    <option value="Asia/Ho_Chi_Minh">
                      (UTC+07:00) Asia/Ho_Chi_Minh
                    </option>
                    <option value="Asia/Jakarta">
                      (UTC+07:00) Asia/Jakarta
                    </option>
                    <option value="Asia/Singapore">
                      (UTC+08:00) Asia/Singapore
                    </option>
                    <option value="Asia/Shanghai">
                      (UTC+08:00) Asia/Shanghai
                    </option>
                    <option value="Asia/Taipei">(UTC+08:00) Asia/Taipei</option>
                    <option value="Asia/Tokyo">(UTC+09:00) Asia/Tokyo</option>
                    <option value="Asia/Seoul">(UTC+09:00) Asia/Seoul</option>
                    <option value="Australia/Brisbane">
                      (UTC+10:00) Australia/Brisbane
                    </option>
                    <option value="Australia/Sydney">
                      (UTC+10:00) Australia/Sydney
                    </option>
                    <option value="Pacific/Noumea">
                      (UTC+11:00) Pacific/Noumea
                    </option>
                    <option value="Pacific/Auckland">
                      (UTC+12:00) Pacific/Auckland
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Row */}
            <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              {/* Left side: Gender & Unknown Time */}
              <div className="flex w-full flex-col items-start gap-6 md:w-auto md:flex-row md:items-center">
                {/* Gender Segmented Control */}
                <div className="flex w-full flex-col md:w-auto">
                  <label className="mb-2 ml-1 text-[14px] font-medium text-muted-foreground md:hidden">
                    Gender
                  </label>
                  <div className="flex w-full rounded-[16px] bg-muted p-1 md:w-auto">
                    <button
                      type="button"
                      onClick={() => setGender(0)}
                      className={`flex-1 rounded-[12px] px-6 py-2.5 text-[15px] font-medium transition-all duration-200 md:flex-none ${gender === 0 ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender(1)}
                      className={`flex-1 rounded-[12px] px-6 py-2.5 text-[15px] font-medium transition-all duration-200 md:flex-none ${gender === 1 ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Male
                    </button>
                  </div>
                </div>

                {/* Unknown Time Checkbox */}
                <label className="group mt-2 flex cursor-pointer items-center gap-3 md:mt-0">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={unknownTime}
                      onChange={(e) => setUnknownTime(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-[6px] border-2 border-input transition-all duration-200 checked:border-primary checked:bg-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                    />
                    <svg
                      className="pointer-events-none absolute h-3 w-3 text-primary-foreground opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-[15px] text-muted-foreground transition-colors duration-200 select-none group-hover:text-foreground">
                    I don&apos;t know my birth time
                  </span>
                </label>
              </div>
            </div>

            {/* Bottom Row: Calculate Button & Mode Toggle */}
            <div className="flex flex-col items-center gap-8">
              {/* Calculate Button */}
              <button
                onClick={handleCalculateWithSave}
                disabled={loading}
                className="flex h-[56px] w-full min-w-[280px] items-center justify-center rounded-[18px] bg-gradient-to-r from-primary to-secondary text-[16px] font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100 md:w-auto"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin text-primary-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Calculating...</span>
                  </div>
                ) : (
                  "Calculate"
                )}
              </button>

              {/* Classic / Modern Toggle (Liquid Glass) */}
              <div className="flex rounded-[16px] border border-border bg-card/50 p-1 shadow-sm backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setMode("classic")}
                  className={`rounded-[12px] px-6 py-2 text-[14px] font-medium transition-all duration-200 ${mode === "classic" ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Classic
                </button>
                <button
                  type="button"
                  onClick={() => setMode("modern")}
                  className={`rounded-[12px] px-6 py-2 text-[14px] font-medium transition-all duration-200 ${mode === "modern" ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Modern
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
