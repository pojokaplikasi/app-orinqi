'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ElementStructureProps {
  elementData: any;
}

export default function ElementStructure({ elementData }: ElementStructureProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !elementData) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const natalData = labels.map(elem => parseFloat(elementData.natal[elem]));
    const annualData = labels.map(elem => parseFloat(elementData.annual[elem]));

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Natal Chart',
            data: natalData,
            backgroundColor: 'rgba(245, 222, 179, 0.5)',  // Beige
            borderColor: 'rgba(210, 180, 140, 1)',      // Darker beige
            borderWidth: 2,
            pointBackgroundColor: 'rgba(210, 180, 140, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(210, 180, 140, 1)'
          },
          {
            label: 'Annual 2026',
            data: annualData,
            backgroundColor: 'rgba(147, 112, 219, 0.4)', // Purple
            borderColor: 'rgba(138, 43, 226, 1)',        // Darker purple
            borderWidth: 2,
            pointBackgroundColor: 'rgba(138, 43, 226, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(138, 43, 226, 1)'
          }
        ]
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
                size: 13
              },
              color: '#6c757d'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.15)'
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.15)'
            },
            pointLabels: {
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#2c3e50'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 25,
              font: {
                size: 15,
                weight: 'bold'
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.r + '%';
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [elementData]);

  if (!elementData) return null;

  const elementColors: Record<string, string> = {
    'Wood': '#28a745',
    'Fire': '#dc3545',
    'Earth': '#ffc107',
    'Metal': '#6c757d',
    'Water': '#007bff'
  };
  
  const elementIcons: Record<string, string> = {
    'Wood': '🌳',
    'Fire': '🔥',
    'Earth': '🌍',
    'Metal': '⚙️',
    'Water': '💧'
  };

  return (
    <div className="col-md-5 px-8">
      <h3 className="text-center mb-4 font-bold text-[#2c3e50] border-b-3 border-[#e74c3c] pb-2 text-[1.8rem]">Element Composition</h3>
      <div className="element-structure-content mt-4">
        <div className="flex flex-wrap items-center">
          {/* Radar Chart */}
          <div className="w-full md:w-1/2">
            <canvas ref={chartRef} width="400" height="400"></canvas>
          </div>
          {/* Element Percentages */}
          <div className="w-full md:w-1/2 p-2">
            <div className="mt-4">
              {Object.keys(elementData.natal).map(elem => {
                const natalPercent = elementData.natal[elem];
                const annualPercent = elementData.annual[elem];
                const color = elementColors[elem];
                const icon = elementIcons[elem];

                return (
                  <div key={elem} className="mb-[1.8rem]">
                    <div className="flex items-center mb-[0.8rem]">
                      <span className="text-[1.4rem] mr-[0.6rem]">{icon}</span>
                      <strong className="text-[1.1rem] font-bold uppercase" style={{ color }}>{elem}</strong>
                    </div>
                    <div className="mb-[0.6rem]">
                      <div className="flex justify-between items-center mb-[0.4rem]">
                        <span className="text-[0.85rem] text-[#6c757d] font-semibold">Natal</span>
                        <span className="text-[0.95rem] font-bold" style={{ color }}>{natalPercent}%</span>
                      </div>
                      <div className="bg-[#e8f5e9] rounded-[10px] h-[8px] overflow-hidden">
                        <div className="h-full rounded-[10px] transition-all duration-500 ease-in-out" style={{ background: color, width: `${natalPercent}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-[0.4rem]">
                        <span className="text-[0.85rem] text-[#6c757d] font-semibold">Annual</span>
                        <span className="text-[0.95rem] font-bold opacity-80" style={{ color }}>{annualPercent}%</span>
                      </div>
                      <div className="bg-[#f3e5f5] rounded-[10px] h-[8px] overflow-hidden">
                        <div className="h-full rounded-[10px] opacity-60 transition-all duration-500 ease-in-out" style={{ background: color, width: `${annualPercent}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
