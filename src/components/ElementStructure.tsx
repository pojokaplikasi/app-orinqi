/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const ELEMENT_COLORS: Record<string, string> = {
  Wood: "#28a745",
  Fire: "#dc3545",
  Earth: "#ffc107",
  Metal: "#6c757d",
  Water: "#007bff",
}

const ELEMENT_WORDS: Record<string, string> = {
  Wood: "Growth",
  Fire: "Passion",
  Earth: "Stability",
  Metal: "Structure",
  Water: "Wisdom",
}

const ELEMENT_ICONS: Record<string, string> = {
  Wood: "🌳",
  Fire: "🔥",
  Earth: "🌍",
  Metal: "⚙️",
  Water: "💧",
}

interface ElementStructureProps {
  elementData: any
}

export default function ElementStructure({
  elementData,
}: ElementStructureProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const dialogChartInstance = useRef<Chart | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getChartConfig = useCallback(
    (showTicks: boolean) => {
      if (!elementData) return null

      const baseLabels = ["Wood", "Fire", "Earth", "Metal", "Water"]
      const labels = baseLabels.map((elem) => [elem, ELEMENT_WORDS[elem]])
      const labelColors = baseLabels.map((elem) => ELEMENT_COLORS[elem])

      const natalData = baseLabels.map((elem) =>
        parseFloat(elementData.natal[elem])
      )
      const annualData = baseLabels.map((elem) =>
        parseFloat(elementData.annual[elem])
      )

      return {
        type: "radar" as const,
        data: {
          labels: labels,
          datasets: [
            {
              label: "Natal Chart",
              data: natalData,
              backgroundColor: "rgba(245, 222, 179, 0.5)",
              borderColor: "rgba(210, 180, 140, 1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(210, 180, 140, 1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(210, 180, 140, 1)",
            },
            {
              label: "Annual 2026",
              data: annualData,
              backgroundColor: "rgba(147, 112, 219, 0.4)",
              borderColor: "rgba(138, 43, 226, 1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(138, 43, 226, 1)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(138, 43, 226, 1)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                display: showTicks,
                stepSize: 20,
                font: { size: showTicks ? 13 : 10 },
                color: "#6c757d",
              },
              grid: { color: "rgba(0, 0, 0, 0.15)" },
              angleLines: { color: "rgba(0, 0, 0, 0.15)" },
              pointLabels: {
                font: {
                  size: showTicks ? 14 : 12,
                  weight: "bold" as const,
                },
                color: "#ffffff",
                backdropColor: (context: any) => labelColors[context.index],
                backdropPadding: { top: 4, bottom: 4, left: 8, right: 8 },
                borderRadius: 6,
              },
            },
          },
          plugins: {
            legend: {
              position: "bottom" as const,
              labels: {
                padding: 25,
                font: { size: 15, weight: "bold" as const },
                usePointStyle: true,
                pointStyle: "circle" as const,
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleFont: { size: 14, weight: "bold" as const },
              bodyFont: { size: 13 },
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                title: function (context: any) {
                  const label = context[0].label || ""
                  return Array.isArray(label) ? label[0] : label.split(',')[0]
                },
                label: function (context: any) {
                  return context.dataset.label + ": " + context.parsed.r + "%"
                },
              },
            },
          },
        },
      }
    },
    [elementData]
  )

  useEffect(() => {
    if (!chartRef.current || !elementData) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const config = getChartConfig(false)
    if (!config) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, config)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [elementData, getChartConfig])

  // Dialog chart: use callback ref so chart is created when canvas mounts in portal
  const dialogCanvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      // Destroy previous instance
      if (dialogChartInstance.current) {
        dialogChartInstance.current.destroy()
        dialogChartInstance.current = null
      }

      if (!node || !elementData) return

      const config = getChartConfig(false)
      if (!config) return

      const ctx = node.getContext("2d")
      if (!ctx) return

      dialogChartInstance.current = new Chart(ctx, config)
    },
    [elementData, getChartConfig]
  )

  // Cleanup dialog chart when dialog closes
  useEffect(() => {
    if (!isDialogOpen && dialogChartInstance.current) {
      dialogChartInstance.current.destroy()
      dialogChartInstance.current = null
    }
  }, [isDialogOpen])

  if (!elementData) return null

  return (
    <div className="flex w-full flex-col items-center">
      {/* Chart Container (Clickable) */}
      <div
        className="relative mb-6 flex h-[320px] w-full max-w-[320px] cursor-pointer items-center justify-center rounded-[20px] transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        onClick={() => setIsDialogOpen(true)}
        title="Click to enlarge chart"
      >
        <canvas ref={chartRef} width="320" height="320"></canvas>
        <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-muted/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          Enlarge
        </div>
      </div>

      {/* Dialog for enlarged chart */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[calc(100%-1rem)] p-4 sm:max-w-[90vw] sm:p-6 md:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-center text-[20px] font-bold">
              Element Composition
            </DialogTitle>
          </DialogHeader>
          <div className="flex w-full items-center justify-center overflow-hidden">
            <div className="relative flex aspect-square w-full max-w-[600px] items-center justify-center">
              {isDialogOpen && <canvas ref={dialogCanvasRef}></canvas>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Element Labels & Comparison Bars */}
      <div className="grid w-full grid-cols-2 gap-4">
        {Object.keys(elementData.natal).map((elem) => {
          const natalPercent = elementData.natal[elem]
          const annualPercent = elementData.annual[elem]
          const color = ELEMENT_COLORS[elem]
          const icon = ELEMENT_ICONS[elem]

          return (
            <div
              key={elem}
              className="flex flex-col items-center gap-3 rounded-[18px] border border-border bg-card p-[16px] text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div
                className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full text-[20px]"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${color}20`,
                  boxShadow: `0 4px 12px ${color}15`,
                }}
              >
                {icon}
              </div>

              <div className="flex w-full flex-col items-center">
                <div
                  className="mb-1 rounded-full px-3 py-0.5 text-[12px] font-bold tracking-wide text-white uppercase shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  {elem}
                </div>
                <div className="mb-2 text-[11px] italic text-muted-foreground">
                  {ELEMENT_WORDS[elem]}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-muted-foreground">N</span>
                    <span className="text-[12px] font-bold" style={{ color }}>
                      {natalPercent}%
                    </span>
                  </div>
                  <div className="h-[3px] w-[3px] rounded-full bg-border"></div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-muted-foreground">A</span>
                    <span
                      className="text-[12px] font-bold"
                      style={{ color, opacity: 0.8 }}
                    >
                      {annualPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
