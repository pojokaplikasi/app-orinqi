/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

interface ElementStructureProps {
  elementData: any
}

export default function ElementStructure({
  elementData,
}: ElementStructureProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !elementData) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const labels = ["Wood", "Fire", "Earth", "Metal", "Water"]
    const natalData = labels.map((elem) => parseFloat(elementData.natal[elem]))
    const annualData = labels.map((elem) =>
      parseFloat(elementData.annual[elem])
    )

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Natal Chart",
            data: natalData,
            backgroundColor: "rgba(245, 222, 179, 0.5)", // Beige
            borderColor: "rgba(210, 180, 140, 1)", // Darker beige
            borderWidth: 2,
            pointBackgroundColor: "rgba(210, 180, 140, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(210, 180, 140, 1)",
          },
          {
            label: "Annual 2026",
            data: annualData,
            backgroundColor: "rgba(147, 112, 219, 0.4)", // Purple
            borderColor: "rgba(138, 43, 226, 1)", // Darker purple
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
              stepSize: 20,
              font: {
                size: 13,
              },
              color: "#6c757d",
            },
            grid: {
              color: "rgba(0, 0, 0, 0.15)",
            },
            angleLines: {
              color: "rgba(0, 0, 0, 0.15)",
            },
            pointLabels: {
              font: {
                size: 16,
                weight: "bold",
              },
              color: "#2c3e50",
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 25,
              font: {
                size: 15,
                weight: "bold",
              },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (context) {
                return context.dataset.label + ": " + context.parsed.r + "%"
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [elementData])

  if (!elementData) return null

  const elementColors: Record<string, string> = {
    Wood: "#28a745",
    Fire: "#dc3545",
    Earth: "#ffc107",
    Metal: "#6c757d",
    Water: "#007bff",
  }

  const elementIcons: Record<string, string> = {
    Wood: "🌳",
    Fire: "🔥",
    Earth: "🌍",
    Metal: "⚙️",
    Water: "💧",
  }

  return (
    <div className="flex w-full flex-col items-center">
      {/* Chart Container */}
      <div className="relative mb-6 flex h-[320px] w-full max-w-[320px] items-center justify-center">
        <canvas ref={chartRef} width="320" height="320"></canvas>
      </div>

      {/* Element Labels & Comparison Bars */}
      <div className="grid w-full grid-cols-2 gap-4">
        {Object.keys(elementData.natal).map((elem) => {
          const natalPercent = elementData.natal[elem]
          const annualPercent = elementData.annual[elem]
          const color = elementColors[elem]
          const icon = elementIcons[elem]

          return (
            <div
              key={elem}
              className="flex flex-col items-center gap-3 rounded-[18px] border border-[#F1F5F9] bg-white p-[16px] text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div
                className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-full text-[20px]"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${color}20`,
                  boxShadow: `0 4px 12px ${color}15`,
                }}
              >
                {icon}
              </div>

              <div className="flex w-full flex-col">
                <div
                  className="mb-1 text-[14px] font-bold tracking-wide text-[#18181B] uppercase"
                  style={{ color }}
                >
                  {elem}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-[#94A3B8]">N</span>
                    <span className="text-[12px] font-bold" style={{ color }}>
                      {natalPercent}%
                    </span>
                  </div>
                  <div className="h-[3px] w-[3px] rounded-full bg-[#E5E7EB]"></div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-[#94A3B8]">A</span>
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
