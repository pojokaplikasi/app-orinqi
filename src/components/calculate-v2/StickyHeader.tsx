"use client"

import React, { useEffect, useState } from "react"

interface StickyHeaderProps {
  chartName: string
  date: string
  time: string
  unknownTime: boolean
  timezone: string
  gender: number | null
  mode: "classic" | "modern"
  setMode: (mode: "classic" | "modern") => void
  /** ref to the hero card element — sticky bar appears when this scrolls out of view */
  heroRef: React.RefObject<HTMLDivElement | null>
}

export default function StickyHeader({
  chartName,
  date,
  time,
  unknownTime,
  timezone,
  gender,
  mode,
  setMode,
  heroRef,
}: StickyHeaderProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const heroBottom = heroRef.current.getBoundingClientRect().bottom
      // Show sticky header once the hero card has scrolled above the viewport
      setVisible(heroBottom < 0)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [heroRef])

  return (
    <div
      className="fixed top-0 left-0 z-50 w-full border-b border-border bg-background shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 250ms ease",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1800px] items-center gap-2 px-3 py-1">
        {/* Avatar */}
        <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border-2 border-background/80 bg-gradient-to-br from-primary to-primary/80">
          <span className="font-serif text-sm font-bold text-primary-foreground">
            命
          </span>
        </div>

        {/* Name · Date · Time */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          <h2 className="shrink-0 text-[15px] font-bold tracking-tight text-foreground">
            {chartName}
          </h2>
          <span className="text-muted-foreground/40">·</span>
          <p className="truncate text-[12px] text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {!unknownTime && time && ` · ${time}`}
          </p>
          <span className="hidden text-muted-foreground/40 sm:inline">·</span>
          <span className="hidden shrink-0 text-[12px] text-muted-foreground sm:inline">
            {gender === 1 ? "Male" : "Female"}
          </span>
          <span className="hidden text-muted-foreground/40 md:inline">·</span>
          <span className="hidden shrink-0 truncate text-[12px] text-muted-foreground md:inline">
            {timezone.split("/").pop()?.replace(/_/g, " ") || timezone}
          </span>

          {/* Classic/Modern toggle */}
          <div className="ml-1.5 hidden shrink-0 rounded-[10px] border border-border bg-background/60 p-0.5 sm:flex">
            <button
              type="button"
              onClick={() => setMode("classic")}
              className={`rounded-[8px] px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                mode === "classic"
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Classic
            </button>
            <button
              type="button"
              onClick={() => setMode("modern")}
              className={`rounded-[8px] px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                mode === "modern"
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Modern
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => window.location.reload()}
            className="rounded-[10px] bg-gradient-to-r from-chart-2 to-chart-2/80 px-2 py-1 text-[12px] font-semibold text-primary-foreground transition-colors hover:from-chart-2/90"
          >
            New
          </button>
        </div>
      </div>
    </div>
  )
}
