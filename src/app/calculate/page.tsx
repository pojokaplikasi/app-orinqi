'use client';

import React, { useState, useEffect, useRef } from 'react';
import Pillar from '@/components/Pillar';
import CompactPillarCard from '@/components/CompactPillarCard';
import LuckyStars from '@/components/LuckyStars';
import ElementStructure from '@/components/ElementStructure';
import TenGods from '@/components/TenGods';
import HeroForm from '@/components/HeroForm';
import { calculateLuckyStars } from '@/lib/bazi/lucky-stars';
import { calculateElementStructure, calculateTenGods, getTenGodsRelationship } from '@/lib/bazi/element-analysis';
import { detectAllHSCombinations, detectAllBranchInteractions, detectLuckPillarCombinations } from '@/lib/bazi/combinations';
import { HEAVENLY_STEMS } from '@/lib/bazi/constants';
import { 
  calculateCurrentYearPillar, 
  calculateCurrentMonthPillar, 
  calculateCurrentDayPillar, 
  calculateCurrentLuckPillar 
} from '@/lib/bazi/pillar-calculations';

export default function BaziCalculator() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState('');
  const [gender, setGender] = useState<number | null>(null);
  const [unknownTime, setUnknownTime] = useState(false);
  const [mode, setMode] = useState<'classic' | 'modern'>('modern');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [baziData, setBaziData] = useState<any>(null);
  
  // Derived data
  const [luckyStars, setLuckyStars] = useState<any>(null);
  const [elementData, setElementData] = useState<any>(null);
  const [tenGodsData, setTenGodsData] = useState<any>(null);
  const [hsCombos, setHsCombos] = useState<any>(null);
  const [branchInteractions, setBranchInteractions] = useState<any>(null);
  const [luckPillarCombos, setLuckPillarCombos] = useState<any[]>([]);
  const [currentPillars, setCurrentPillars] = useState<any>(null);

  // Selection state for drill-down
  const [selectedLuck, setSelectedLuck] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Time period data
  const [yearPillars, setYearPillars] = useState<any[]>([]);
  const [monthPillars, setMonthPillars] = useState<any[]>([]);
  const [dayPillars, setDayPillars] = useState<any[]>([]);
  const [hourPillars, setHourPillars] = useState<any[]>([]);

  // Expanded Pillar State
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null);

  // Mobile Tab State for Destiny Insights
  const [activeInsightTab, setActiveInsightTab] = useState<'elements' | 'stars' | 'gods'>('elements');

  // Explorer State
  const [explorerStep, setExplorerStep] = useState<'luck' | 'year' | 'month' | 'day' | 'hour'>('luck');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedHourData, setSelectedHourData] = useState<any>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const explorerScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (baziData && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setTimeout(() => {
        if (container) {
          container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
        }
      }, 100);
    }
  }, [baziData, currentPillars]);

  const handleCalculate = async () => {
    setError('');
    
    if (!date) {
      setError('Please select a birth date.');
      return;
    }
    if (!unknownTime && !time) {
      setError('Please select a birth time.');
      return;
    }
    if (!timezone) {
      setError('Please select a timezone.');
      return;
    }
    if (gender === null) {
      setError('Please select a gender.');
      return;
    }

    setLoading(true);
    
    const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`;
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateTime: actualDateTime,
          location: timezone,
          gender: gender,
          unknownBirthTime: unknownTime
        })
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setBaziData(data);
      
      // Calculate current pillars
      const now = new Date();
      const birthTimeData = { dateTime: actualDateTime };
      
      const currYear = calculateCurrentYearPillar(now, data.four_pillars);
      const currMonth = calculateCurrentMonthPillar(now, data.four_pillars);
      const currDay = calculateCurrentDayPillar(now, data.four_pillars);
      const currLuck = calculateCurrentLuckPillar(now, birthTimeData, data.four_pillars, data.luck_pillars);
      
      const currentPillarsObj = {
        luck: currLuck,
        year: currYear,
        month: currMonth,
        day: currDay
      };
      
      setCurrentPillars(currentPillarsObj);
      
      // Calculate derived data
      const stars = calculateLuckyStars(data.four_pillars, currentPillarsObj);
      setLuckyStars(stars);
      
      const elements = calculateElementStructure(data.four_pillars, currentPillarsObj);
      setElementData(elements);
      
      const tenGods = calculateTenGods(data.four_pillars, currentPillarsObj);
      setTenGodsData(tenGods);
      
      const combos = detectAllHSCombinations(data.four_pillars, currentPillarsObj);
      setHsCombos(combos);
      
      const interactions = detectAllBranchInteractions(data.four_pillars, currentPillarsObj);
      setBranchInteractions(interactions);
      
      // Calculate per-luck-pillar combinations (vs natal chart only)
      const luckCombos = data.luck_pillars.luck_pillars.map((lp: any) =>
        detectLuckPillarCombinations(lp, data.four_pillars)
      );
      setLuckPillarCombos(luckCombos);
      
      // Reset selections
      handleResetSelection();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSelection = () => {
    setSelectedLuck(null);
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedDay(null);
    setYearPillars([]);
    setMonthPillars([]);
    setDayPillars([]);
    setHourPillars([]);
    setExplorerStep('luck');
  };

  // Fetch Year Pillars when Luck Pillar is selected
  useEffect(() => {
    if (selectedLuck !== null && baziData) {
      const luckPillar = baziData.luck_pillars.luck_pillars[selectedLuck];
      const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`;
      
      fetch('/api/calculate_yearly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_year: luckPillar.year_start,
          end_year: luckPillar.year_end,
          birth_time: actualDateTime
        })
      })
      .then(res => res.json())
      .then(data => setYearPillars(data.yearly_pillars))
      .catch(console.error);
    }
  }, [selectedLuck, baziData]);

  // Fetch Month Pillars when Year Pillar is selected
  useEffect(() => {
    if (selectedYear !== null && baziData) {
      const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`;
      
      fetch('/api/calculate_monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: selectedYear,
          birth_time: actualDateTime
        })
      })
      .then(res => res.json())
      .then(data => setMonthPillars(data.monthly_pillars))
      .catch(console.error);
    }
  }, [selectedYear, baziData]);

  // Fetch Day Pillars when Month Pillar is selected
  useEffect(() => {
    if (selectedMonth !== null && selectedYear !== null && baziData) {
      const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`;
      
      fetch('/api/calculate_daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: selectedYear,
          month: selectedMonth,
          birth_time: actualDateTime
        })
      })
      .then(res => res.json())
      .then(data => setDayPillars(data.daily_pillars))
      .catch(console.error);
    }
  }, [selectedMonth, selectedYear, baziData]);

  // Fetch Hour Pillars when Day Pillar is selected
  useEffect(() => {
    if (selectedDay !== null && selectedMonth !== null && selectedYear !== null && baziData) {
      const actualDateTime = unknownTime ? `${date}T12:00` : `${date}T${time}`;
      
      fetch('/api/calculate_hourly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
          birth_time: actualDateTime
        })
      })
      .then(res => res.json())
      .then(data => setHourPillars(data.hourly_pillars))
      .catch(console.error);
    }
  }, [selectedDay, selectedMonth, selectedYear, baziData]);

  // Auto-scroll explorer to center selected item
  useEffect(() => {
    if (explorerScrollRef.current) {
      const container = explorerScrollRef.current;
      const selectedElement = container.querySelector('[data-selected="true"]');
      if (selectedElement) {
        const containerWidth = container.clientWidth;
        const elementOffset = (selectedElement as HTMLElement).offsetLeft;
        const elementWidth = (selectedElement as HTMLElement).clientWidth;
        container.scrollTo({
          left: elementOffset - (containerWidth / 2) + (elementWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [explorerStep, selectedLuck, selectedYear, selectedMonth, selectedDay]);

  // Helper to get selected pillar data
  const getSelectedLuckData = () => selectedLuck !== null ? baziData?.luck_pillars?.luck_pillars[selectedLuck] : null;
  const getSelectedYearData = () => yearPillars.find(p => p.year === selectedYear);
  const getSelectedMonthData = () => monthPillars.find(p => p.month === selectedMonth);
  const getSelectedDayData = () => dayPillars.find(p => p.day === selectedDay);

  const steps = [
    { id: 'luck', label: '10-Year', color: '#8B5CF6' },
    { id: 'year', label: 'Year', color: '#A855F7' },
    { id: 'month', label: 'Month', color: '#F97316' },
    { id: 'day', label: 'Day', color: '#22C55E' },
    { id: 'hour', label: 'Hour', color: '#06B6D4' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === explorerStep);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFB]">
      <HeroForm 
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
        timezone={timezone}
        setTimezone={setTimezone}
        gender={gender}
        setGender={setGender}
        unknownTime={unknownTime}
        setUnknownTime={setUnknownTime}
        mode={mode}
        setMode={setMode}
        onCalculate={handleCalculate}
        loading={loading}
        baziData={baziData}
      />

      <div className="container mx-auto px-4 flex-1 mb-8">
        <div className="row justify-center">
          <div className="col-md-10 w-full max-w-[1400px] mx-auto">
            {error && <div className="bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24] px-4 py-3 rounded-lg mb-6 mt-6">{error}</div>}

            {/* Results Section */}
            {baziData && (
            <div className="mt-8 flex flex-col gap-12">
              
              {/* Combined Chart Section */}
              <div className="bg-white/72 backdrop-blur-[20px] rounded-[24px] p-6 md:p-8 border border-[#F1F5F9] shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col w-full overflow-hidden relative">
                
                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-3 border-b border-[#F1F5F9] pb-4">
                  <h3 className="text-[#18181B] font-bold text-[20px] md:text-[24px] text-center">Natal Chart & Current Transits</h3>
                </div>

                {/* Horizontal Scroll Guide */}
                <div className="flex flex-col items-center justify-center mb-4 opacity-50">
                  <div className="flex items-center justify-center w-full max-w-[300px] gap-3">
                    <div className="h-[1px] bg-[#E5E7EB] flex-1"></div>
                    <span className="text-[12px] font-medium text-[#94A3B8] whitespace-nowrap">← Scroll to Explore →</span>
                    <div className="h-[1px] bg-[#E5E7EB] flex-1"></div>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] mt-1">Default view is centered on the current time pillars.</span>
                </div>

                <div 
                  ref={scrollContainerRef}
                  className="flex flex-nowrap flex-row items-start gap-4 overflow-x-auto pb-6 scrollbar-thin w-full"
                >
                  {/* Natal Chart */}
                  {!unknownTime ? (
                    <Pillar title="Hour Pillar (時柱)" pillarData={baziData.four_pillars.hour_pillar} luckyStars={luckyStars} hsCombos={hsCombos?.H} branchInteractions={branchInteractions?.H} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} isExpanded={expandedPillarId === 'natal-H'} onToggleExpand={() => setExpandedPillarId(expandedPillarId === 'natal-H' ? null : 'natal-H')} />
                  ) : (
                    <div className="flex-none w-[150px] md:w-[180px] lg:w-[200px] h-auto p-4 rounded-[20px] bg-white/72 backdrop-blur-[20px] border border-[#F1F5F9] shadow-[0_6px_24px_rgba(0,0,0,0.05)] text-[#18181B] text-center box-border transition-all duration-200 relative flex flex-col gap-3 border-t-[4px] border-t-[#2563EB]">
                      <div className="flex justify-between items-start w-full relative">
                        <div className="flex flex-col items-start text-left">
                          <span className="text-[13px] font-semibold text-[#18181B] leading-tight">Hour Pillar</span>
                          <span className="text-[11px] opacity-50 text-[#71717A]">時柱</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center mt-2">
                        <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[48px] leading-none drop-shadow-sm text-[#ccc]">?</strong>
                      </div>
                      <div className="w-full h-[1px] bg-[#F1F5F9] my-1"></div>
                      <div className="flex flex-col items-center justify-center relative">
                        <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[44px] leading-none drop-shadow-sm text-[#ccc]">?</strong>
                      </div>
                      <div className="bg-[#F8FAFC] rounded-[12px] p-[10px] flex justify-center gap-2 w-full mt-1 min-h-[40px]">
                        <span className="text-[12px] text-[#ccc] font-medium">N/A</span>
                      </div>
                      <div className="flex flex-col items-center justify-center mt-1">
                        <span className="text-[12px] font-semibold text-[#ccc] text-center leading-tight">N/A</span>
                      </div>
                      <div className="w-full h-[1px] bg-[#F1F5F9] my-1"></div>
                      <div className="flex items-center justify-center">
                        <span className="text-[13px] font-bold text-[#ccc] uppercase tracking-wide">N/A</span>
                      </div>
                    </div>
                  )}
                  <Pillar title="Day Pillar (日柱)" pillarData={baziData.four_pillars.day_pillar} luckyStars={luckyStars} hsCombos={hsCombos?.D} branchInteractions={branchInteractions?.D} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} isExpanded={expandedPillarId === 'natal-D'} onToggleExpand={() => setExpandedPillarId(expandedPillarId === 'natal-D' ? null : 'natal-D')} />
                  <Pillar title="Month Pillar (月柱)" pillarData={baziData.four_pillars.month_pillar} luckyStars={luckyStars} hsCombos={hsCombos?.M} branchInteractions={branchInteractions?.M} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} isExpanded={expandedPillarId === 'natal-M'} onToggleExpand={() => setExpandedPillarId(expandedPillarId === 'natal-M' ? null : 'natal-M')} />
                  <Pillar title="Year Pillar (年柱)" pillarData={baziData.four_pillars.year_pillar} luckyStars={luckyStars} hsCombos={hsCombos?.Y} branchInteractions={branchInteractions?.Y} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} isExpanded={expandedPillarId === 'natal-Y'} onToggleExpand={() => setExpandedPillarId(expandedPillarId === 'natal-Y' ? null : 'natal-Y')} />

                  {/* Divider */}
                  <div className="w-[2px] bg-[#F1F5F9] mx-2 flex-shrink-0 rounded-full"></div>

                  {/* Current Transits */}
                  <Pillar title="Current Luck Cycle" pillarData={currentPillars?.luck} isCurrent luckyStars={luckyStars} hsCombos={hsCombos?.CL} branchInteractions={branchInteractions?.CL} periodLabel="Period" periodValue={currentPillars?.luck?.luck_period} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} isExpanded={expandedPillarId === 'transit-L'} onToggleExpand={() => setExpandedPillarId(expandedPillarId === 'transit-L' ? null : 'transit-L')} />
                  <Pillar title="Current Year" pillarData={currentPillars?.year} isCurrent luckyStars={luckyStars} hsCombos={hsCombos?.CY} branchInteractions={branchInteractions?.CY} periodLabel="Year" periodValue={currentPillars?.year?.year?.toString()} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} isExpanded={expandedPillarId === 'transit-Y'} onToggleExpand={() => setExpandedPillarId(expandedPillarId === 'transit-Y' ? null : 'transit-Y')} />
                  <Pillar title="Current Month" pillarData={currentPillars?.month} isCurrent luckyStars={luckyStars} hsCombos={hsCombos?.CM} branchInteractions={branchInteractions?.CM} periodLabel="Month" periodValue={currentPillars?.month?.month_english} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} isExpanded={expandedPillarId === 'transit-M'} onToggleExpand={() => setExpandedPillarId(expandedPillarId === 'transit-M' ? null : 'transit-M')} />
                  <Pillar title="Current Day" pillarData={currentPillars?.day} isCurrent luckyStars={luckyStars} hsCombos={hsCombos?.CD} branchInteractions={branchInteractions?.CD} periodLabel="Day" periodValue={currentPillars?.day?.day?.toString()} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} isExpanded={expandedPillarId === 'transit-D'} onToggleExpand={() => setExpandedPillarId(expandedPillarId === 'transit-D' ? null : 'transit-D')} />
                </div>

                {/* Legend (Bottom Right) */}
                <div className="flex flex-col items-end mt-4 gap-2">
                  <div className="flex flex-wrap justify-end items-center gap-3 text-[11px] font-medium text-[#475569] bg-[#F8FAFC] px-3 py-2 rounded-[12px] border border-[#E5E7EB]">
                    <div className="flex items-center gap-1.5" title="Seasonal Unions, Three Harmonies, Six Harmonies, Hidden Combinations">
                      <div className="w-2 h-2 rounded-full bg-[#16A34A]"></div>
                      <span>Positive</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Informational Items">
                      <div className="w-2 h-2 rounded-full bg-[#64748B]"></div>
                      <span>Neutral</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Self Punishment, Ungrateful Punishment">
                      <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>
                      <span>Warning</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Clashes, Harms, Destruction, Half Combinations">
                      <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                      <span>Negative</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Life Stage, Rare Combinations, Special Indicators">
                      <div className="w-2 h-2 rounded-full bg-[#7C3AED]"></div>
                      <span>Special</span>
                    </div>
                  </div>
                  
                  {/* Ten Gods Legend */}
                  <div className="flex flex-wrap justify-end items-center gap-x-3 gap-y-1 text-[10px] font-medium text-[#64748B] max-w-[600px]">
                    <span title="Direct Wealth">DW: Direct Wealth</span>
                    <span title="Indirect Wealth">IW: Indirect Wealth</span>
                    <span title="Direct Officer">DO: Direct Officer</span>
                    <span title="Seven Killings">7K: Seven Killings</span>
                    <span title="Direct Resource">DR: Direct Resource</span>
                    <span title="Indirect Resource">IR: Indirect Resource</span>
                    <span title="Eating God">EG: Eating God</span>
                    <span title="Hurting Officer">HO: Hurting Officer</span>
                    <span title="Friend">F: Friend</span>
                    <span title="Rob Wealth">RW: Rob Wealth</span>
                  </div>
                </div>

              </div>

              {/* Destiny Insights Dashboard */}
              <div className="bg-white/72 backdrop-blur-[24px] rounded-[28px] p-8 border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col w-full">
                
                {/* Dashboard Header */}
                <div className="flex flex-col items-center justify-center mb-8">
                  <h3 className="text-[#18181B] font-bold text-[32px] text-center leading-tight">Destiny Insights</h3>
                  <p className="text-[#71717A] text-[15px] text-center mt-2">Understand the balance of your chart, stars, and life influences.</p>
                </div>

                {/* Mobile Tabs (Hidden on Desktop) */}
                <div className="flex lg:hidden bg-[#F1F5F9] p-1 rounded-[16px] mb-8 w-full max-w-[400px] mx-auto">
                  <button 
                    onClick={() => setActiveInsightTab('elements')}
                    className={`flex-1 py-2.5 text-[14px] font-semibold rounded-[12px] transition-all duration-200 ${activeInsightTab === 'elements' ? 'bg-white text-[#18181B] shadow-sm' : 'text-[#71717A] hover:text-[#18181B]'}`}
                  >
                    Elements
                  </button>
                  <button 
                    onClick={() => setActiveInsightTab('stars')}
                    className={`flex-1 py-2.5 text-[14px] font-semibold rounded-[12px] transition-all duration-200 ${activeInsightTab === 'stars' ? 'bg-white text-[#18181B] shadow-sm' : 'text-[#71717A] hover:text-[#18181B]'}`}
                  >
                    Stars
                  </button>
                  <button 
                    onClick={() => setActiveInsightTab('gods')}
                    className={`flex-1 py-2.5 text-[14px] font-semibold rounded-[12px] transition-all duration-200 ${activeInsightTab === 'gods' ? 'bg-white text-[#18181B] shadow-sm' : 'text-[#71717A] hover:text-[#18181B]'}`}
                  >
                    10 Gods
                  </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Element Composition */}
                  <div className={`lg:col-span-4 lg:order-2 flex-col ${activeInsightTab === 'elements' ? 'flex' : 'hidden lg:flex'}`}>
                    <h4 className="text-[18px] font-bold text-[#18181B] mb-4 text-center">Element Composition</h4>
                    <ElementStructure elementData={elementData} />
                  </div>

                  {/* Middle Column: Lucky Stars */}
                  <div className={`lg:col-span-4 lg:order-1 flex-col ${activeInsightTab === 'stars' ? 'flex' : 'hidden lg:flex'}`}>
                    <h4 className="text-[18px] font-bold text-[#18181B] mb-4 text-center lg:text-left">Lucky Stars</h4>
                    <LuckyStars stars={luckyStars} mode={mode} />
                  </div>

                  {/* Right Column: 10 Gods */}
                  <div className={`lg:col-span-4 lg:order-3 flex-col ${activeInsightTab === 'gods' ? 'flex' : 'hidden lg:flex'}`}>
                    <h4 className="text-[18px] font-bold text-[#18181B] mb-4 text-center lg:text-left">10 Gods</h4>
                    <TenGods tenGodsData={tenGodsData} />
                  </div>

                </div>

                {/* Insight Card (Full Width Bottom) */}
                <div className="mt-8 w-full bg-white/65 backdrop-blur-[20px] rounded-[20px] p-6 border border-[#F1F5F9] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[20px]">💡</span>
                    <span className="font-bold text-[#18181B] text-[16px]">Destiny Insight</span>
                  </div>
                  <p className="text-[15px] text-[#475569] leading-relaxed">
                    Your chart shows a unique distribution of elements. The balance between these energies shapes your approach to life, relationships, and career. Pay attention to the dominant elements and how the annual transits interact with your natal chart.
                  </p>
                </div>
              </div>

              <hr className="border-none h-[1px] bg-[#F1F5F9] my-4" />

              {/* Interactive Explorer Experience */}
              <div className="flex flex-col lg:flex-row gap-6 w-full relative">
                
                {/* Mobile Sidebar Toggle */}
                <button 
                  className="lg:hidden w-full bg-white/72 backdrop-blur-[20px] border border-[#F1F5F9] rounded-[16px] p-4 flex justify-between items-center shadow-sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <span className="font-bold text-[#18181B]">Current Selection</span>
                  <span className="text-[#8B5CF6]">{isSidebarOpen ? 'Close' : 'View'}</span>
                </button>

                {/* Sidebar */}
                <div className={`lg:w-[320px] flex-shrink-0 flex flex-col gap-4 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden lg:flex'}`}>
                  
                  {/* Sidebar Header */}
                  <div className="bg-white/72 backdrop-blur-[20px] rounded-[20px] p-6 border border-[#F1F5F9] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                    <h3 className="text-[#18181B] font-bold text-[20px] flex items-center gap-2">
                      <span>✨</span> Luck Pillars Explorer
                    </h3>
                    <p className="text-[#71717A] text-[13px] mt-2">Explore your destiny cycles step by step.</p>
                  </div>

                  {/* Current Selection Panel */}
                  <div className="bg-white/65 backdrop-blur-[20px] rounded-[20px] p-6 border border-[#F1F5F9] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex-1">
                    <h4 className="text-[#18181B] font-bold text-[16px] mb-6">Current Selection</h4>
                    
                    <div className="flex flex-col gap-0 relative">
                      {/* Vertical Line */}
                      <div className="absolute left-[7px] top-[10px] bottom-[10px] w-[2px] bg-[#F1F5F9] z-0"></div>

                      {/* 10-Year Selection */}
                      <div className="flex gap-4 relative z-10 mb-6">
                        <div className={`w-[16px] h-[16px] rounded-full mt-1 flex-shrink-0 border-4 border-white shadow-sm ${selectedLuck !== null ? 'bg-[#8B5CF6]' : 'bg-[#E2E8F0]'}`}></div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-semibold text-[#71717A]">10-Year Luck</span>
                          {selectedLuck !== null ? (
                            <>
                              <span className="text-[14px] font-bold text-[#18181B]">{getSelectedLuckData()?.year_start}–{getSelectedLuckData()?.year_end}</span>
                              <span className="text-[13px] text-[#475569] mt-1">{getSelectedLuckData()?.heavenly_stem?.name} {getSelectedLuckData()?.earthly_branch?.name}</span>
                            </>
                          ) : (
                            <span className="text-[13px] text-[#94A3B8] italic mt-1">Not selected</span>
                          )}
                        </div>
                      </div>

                      {/* Year Selection */}
                      <div className="flex gap-4 relative z-10 mb-6">
                        <div className={`w-[16px] h-[16px] rounded-full mt-1 flex-shrink-0 border-4 border-white shadow-sm ${selectedYear !== null ? 'bg-[#A855F7]' : 'bg-[#E2E8F0]'}`}></div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-semibold text-[#71717A]">Year Pillar</span>
                          {selectedYear !== null ? (
                            <>
                              <span className="text-[14px] font-bold text-[#18181B]">{selectedYear}</span>
                              <span className="text-[13px] text-[#475569] mt-1">{getSelectedYearData()?.heavenly_stem?.name} {getSelectedYearData()?.earthly_branch?.name}</span>
                            </>
                          ) : (
                            <span className="text-[13px] text-[#94A3B8] italic mt-1">Not selected</span>
                          )}
                        </div>
                      </div>

                      {/* Month Selection */}
                      <div className="flex gap-4 relative z-10 mb-6">
                        <div className={`w-[16px] h-[16px] rounded-full mt-1 flex-shrink-0 border-4 border-white shadow-sm ${selectedMonth !== null ? 'bg-[#F97316]' : 'bg-[#E2E8F0]'}`}></div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-semibold text-[#71717A]">Month Pillar</span>
                          {selectedMonth !== null ? (
                            <>
                              <span className="text-[14px] font-bold text-[#18181B]">{getSelectedMonthData()?.month_english} {selectedYear}</span>
                              <span className="text-[13px] text-[#475569] mt-1">{getSelectedMonthData()?.heavenly_stem?.name} {getSelectedMonthData()?.earthly_branch?.name}</span>
                            </>
                          ) : (
                            <span className="text-[13px] text-[#94A3B8] italic mt-1">Not selected</span>
                          )}
                        </div>
                      </div>

                      {/* Day Selection */}
                      <div className="flex gap-4 relative z-10 mb-6">
                        <div className={`w-[16px] h-[16px] rounded-full mt-1 flex-shrink-0 border-4 border-white shadow-sm ${selectedDay !== null ? 'bg-[#22C55E]' : 'bg-[#E2E8F0]'}`}></div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-semibold text-[#71717A]">Day Pillar</span>
                          {selectedDay !== null ? (
                            <>
                              <span className="text-[14px] font-bold text-[#18181B]">Day {selectedDay}</span>
                              <span className="text-[13px] text-[#475569] mt-1">{getSelectedDayData()?.heavenly_stem?.name} {getSelectedDayData()?.earthly_branch?.name}</span>
                            </>
                          ) : (
                            <span className="text-[13px] text-[#94A3B8] italic mt-1">Not selected</span>
                          )}
                        </div>
                      </div>

                      {/* Hour Selection */}
                      <div className="flex gap-4 relative z-10">
                        <div className={`w-[16px] h-[16px] rounded-full mt-1 flex-shrink-0 border-4 border-white shadow-sm bg-[#E2E8F0]`}></div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-semibold text-[#71717A]">Hour Pillar</span>
                          <span className="text-[13px] text-[#94A3B8] italic mt-1">Not selected</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Sidebar Footer */}
                  <div className="bg-white/55 backdrop-blur-[20px] rounded-[20px] p-5 border border-[#F1F5F9]">
                    <h4 className="text-[#18181B] font-bold text-[14px] mb-3">How to Use</h4>
                    <ol className="text-[12px] text-[#475569] space-y-2 pl-4 list-decimal">
                      <li>Start from 10-Year Luck Pillars</li>
                      <li>Select a specific Year</li>
                      <li>Select Month</li>
                      <li>Select Day</li>
                      <li>Select Hour</li>
                      <li>Explore detailed influence</li>
                    </ol>
                  </div>
                </div>

                {/* Main Explorer Area */}
                <div className="flex-1 flex flex-col min-w-0">
                  
                  {/* Top Breadcrumb */}
                  <div className="flex flex-wrap items-center gap-2 text-[14px] text-[#64748B] mb-4 px-2">
                    <span className={`cursor-pointer hover:text-[#18181B] ${explorerStep === 'luck' ? 'text-[#18181B] font-semibold' : ''}`} onClick={() => setExplorerStep('luck')}>
                      10-Year Luck Breadcrumb
                    </span>
                  </div>

                  {/* Progress Navigation */}
                  <div className="flex items-center justify-between mb-8 px-2">
                    {steps.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <div 
                          className="flex flex-col items-center gap-2 cursor-pointer"
                          onClick={() => {
                            // Only allow clicking if previous steps are completed
                            if (index === 0) setExplorerStep('luck');
                            if (index === 1 && selectedLuck !== null) setExplorerStep('year');
                            if (index === 2 && selectedYear !== null) setExplorerStep('month');
                            if (index === 3 && selectedMonth !== null) setExplorerStep('day');
                            if (index === 4 && selectedDay !== null) setExplorerStep('hour');
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                index <= currentStepIndex ? 'scale-125' : 'opacity-30'
                              }`}
                              style={{ backgroundColor: index <= currentStepIndex ? step.color : '#94A3B8' }}
                            ></div>
                            <span className={`text-[13px] hidden sm:block transition-all duration-300 ${
                              index === currentStepIndex ? 'font-bold text-[#18181B]' : 
                              index < currentStepIndex ? 'font-medium text-[#475569]' : 'text-[#94A3B8]'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="flex-1 h-[2px] mx-2 sm:mx-4 rounded-full bg-[#F1F5F9] relative overflow-hidden">
                            <div 
                              className="absolute top-0 left-0 bottom-0 transition-all duration-500"
                              style={{ 
                                width: index < currentStepIndex ? '100%' : '0%',
                                backgroundColor: steps[index].color
                              }}
                            ></div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Explorer Hero Area */}
                  <div className="h-[180px] sm:h-[220px] rounded-[24px] p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden mb-8 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
                       style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)' }}>
                    
                    {/* Abstract Background Elements */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[40px] opacity-20" style={{ backgroundColor: steps[currentStepIndex].color }}></div>
                    <div className="absolute right-20 -bottom-10 w-32 h-32 rounded-full blur-[30px] opacity-10" style={{ backgroundColor: steps[currentStepIndex].color }}></div>
                    
                    <div className="relative z-10">
                      <span className="text-[12px] font-bold tracking-wider uppercase mb-2 block" style={{ color: steps[currentStepIndex].color }}>
                        Step {currentStepIndex + 1} of 5
                      </span>
                      <h2 className="text-[24px] sm:text-[32px] font-bold text-[#18181B] mb-3">
                        {explorerStep === 'luck' && 'Select 10-Year Luck'}
                        {explorerStep === 'year' && 'Select Year Pillar'}
                        {explorerStep === 'month' && 'Select Month Pillar'}
                        {explorerStep === 'day' && 'Select Day Pillar'}
                        {explorerStep === 'hour' && 'Select Hour Pillar'}
                      </h2>
                      <p className="text-[#475569] text-[14px] sm:text-[15px] max-w-[400px] leading-relaxed">
                        {explorerStep === 'luck' && 'Choose a 10-year period to explore the overarching themes and energies of that decade.'}
                        {explorerStep === 'year' && `Choose a year within the ${getSelectedLuckData()?.year_start}–${getSelectedLuckData()?.year_end} period to explore annual influences.`}
                        {explorerStep === 'month' && `Choose a month within ${selectedYear} to explore more detailed seasonal influences.`}
                        {explorerStep === 'day' && `Choose a specific day in ${getSelectedMonthData()?.month_english} ${selectedYear} to see daily energies.`}
                        {explorerStep === 'hour' && `Explore the two-hour periods for Day ${selectedDay}.`}
                      </p>
                    </div>
                  </div>

                  {/* Pillar Cards Area */}
                  <div className="relative w-full">
                    <div 
                      ref={explorerScrollRef}
                      className="flex flex-nowrap flex-row items-stretch gap-4 overflow-x-auto pb-8 pt-4 px-4 -mx-4 scrollbar-thin scroll-smooth"
                    >
                      {/* 10-Year Luck Pillars */}
                      {explorerStep === 'luck' && baziData.luck_pillars.luck_pillars.map((pillar: any, index: number) => (
                        <div key={index} data-selected={selectedLuck === index}>
                          <CompactPillarCard 
                            title={`Luck ${pillar.number}`}
                            subtitle={`${pillar.year_start}-${pillar.year_end}`}
                            pillarData={pillar}
                            isSelected={selectedLuck === index}
                            onClick={() => {
                              setSelectedLuck(index);
                              setTimeout(() => setExplorerStep('year'), 300);
                            }}
                            color="#8B5CF6"
                            dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                            luckyStars={luckyStars}
                          />
                        </div>
                      ))}

                      {/* Year Pillars */}
                      {explorerStep === 'year' && yearPillars.map((pillar, index) => (
                        <div key={index} data-selected={selectedYear === pillar.year}>
                          <CompactPillarCard 
                            title={pillar.year.toString()}
                            subtitle={`Age ${pillar.age}`}
                            pillarData={pillar}
                            isSelected={selectedYear === pillar.year}
                            onClick={() => {
                              setSelectedYear(pillar.year);
                              setTimeout(() => setExplorerStep('month'), 300);
                            }}
                            color="#A855F7"
                            dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                            luckyStars={luckyStars}
                          />
                        </div>
                      ))}

                      {/* Month Pillars */}
                      {explorerStep === 'month' && monthPillars.map((pillar, index) => (
                        <div key={index} data-selected={selectedMonth === pillar.month}>
                          <CompactPillarCard 
                            title={pillar.month_english}
                            subtitle={`Month ${pillar.month}`}
                            pillarData={pillar}
                            isSelected={selectedMonth === pillar.month}
                            onClick={() => {
                              setSelectedMonth(pillar.month);
                              setTimeout(() => setExplorerStep('day'), 300);
                            }}
                            color="#F97316"
                            dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                            luckyStars={luckyStars}
                          />
                        </div>
                      ))}

                      {/* Day Pillars */}
                      {explorerStep === 'day' && dayPillars.map((pillar, index) => (
                        <div key={index} data-selected={selectedDay === pillar.day}>
                          <CompactPillarCard 
                            title={`Day ${pillar.day}`}
                            subtitle={getSelectedMonthData()?.month_english || ''}
                            pillarData={pillar}
                            isSelected={selectedDay === pillar.day}
                            onClick={() => {
                              setSelectedDay(pillar.day);
                              setTimeout(() => setExplorerStep('hour'), 300);
                            }}
                            color="#22C55E"
                            dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                            luckyStars={luckyStars}
                          />
                        </div>
                      ))}

                      {/* Hour Pillars */}
                      {explorerStep === 'hour' && hourPillars.map((pillar, index) => (
                        <div key={index}>
                          <CompactPillarCard 
                            title={pillar.hour_time}
                            subtitle={`Hour`}
                            pillarData={pillar}
                            isSelected={selectedHourData === pillar}
                            onClick={() => {
                              setSelectedHourData(pillar);
                              setIsDialogOpen(true);
                            }}
                            color="#06B6D4"
                            dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                            luckyStars={luckyStars}
                          />
                        </div>
                      ))}

                      {/* Empty States */}
                      {explorerStep === 'year' && yearPillars.length === 0 && (
                        <div className="w-full text-center py-12 text-[#71717A]">Please select a 10-Year Luck Pillar first.</div>
                      )}
                      {explorerStep === 'month' && monthPillars.length === 0 && (
                        <div className="w-full text-center py-12 text-[#71717A]">Please select a Year Pillar first.</div>
                      )}
                      {explorerStep === 'day' && dayPillars.length === 0 && (
                        <div className="w-full text-center py-12 text-[#71717A]">Please select a Month Pillar first.</div>
                      )}
                      {explorerStep === 'hour' && hourPillars.length === 0 && (
                        <div className="w-full text-center py-12 text-[#71717A]">Please select a Day Pillar first.</div>
                      )}
                    </div>
                  </div>

                  {/* Navigation Actions */}
                  <div className="flex justify-between items-center mt-4 pt-6 border-t border-[#F1F5F9]">
                    <button 
                      onClick={() => {
                        if (explorerStep === 'year') setExplorerStep('luck');
                        if (explorerStep === 'month') setExplorerStep('year');
                        if (explorerStep === 'day') setExplorerStep('month');
                        if (explorerStep === 'hour') setExplorerStep('day');
                      }}
                      className={`px-5 py-2.5 rounded-[12px] text-[14px] font-medium transition-all duration-200 ${
                        explorerStep === 'luck' 
                          ? 'opacity-0 pointer-events-none' 
                          : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#18181B]'
                      }`}
                    >
                      ← Change {
                        explorerStep === 'year' ? '10-Year Luck' :
                        explorerStep === 'month' ? 'Year' :
                        explorerStep === 'day' ? 'Month' :
                        explorerStep === 'hour' ? 'Day' : ''
                      }
                    </button>

                    <button 
                      onClick={() => {
                        if (explorerStep === 'luck' && selectedLuck !== null) setExplorerStep('year');
                        if (explorerStep === 'year' && selectedYear !== null) setExplorerStep('month');
                        if (explorerStep === 'month' && selectedMonth !== null) setExplorerStep('day');
                        if (explorerStep === 'day' && selectedDay !== null) setExplorerStep('hour');
                      }}
                      className={`px-5 py-2.5 rounded-[12px] text-[14px] font-medium transition-all duration-200 ${
                        (explorerStep === 'luck' && selectedLuck === null) ||
                        (explorerStep === 'year' && selectedYear === null) ||
                        (explorerStep === 'month' && selectedMonth === null) ||
                        (explorerStep === 'day' && selectedDay === null) ||
                        explorerStep === 'hour'
                          ? 'opacity-50 cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]' 
                          : 'bg-[#18181B] text-white hover:bg-[#27272A] shadow-sm'
                      }`}
                    >
                      Next →
                    </button>
                  </div>

                  {/* Floating Tip Card */}
                  <div className="mt-8 bg-white/70 backdrop-blur-[20px] rounded-[20px] p-4 border border-[#F1F5F9] flex items-start gap-3 shadow-sm">
                    <span className="text-[20px] leading-none">💡</span>
                    <p className="text-[13px] text-[#475569] leading-relaxed">
                      <strong className="text-[#18181B]">Tip:</strong> Start from 10-Year Luck Pillars and drill down to see more specific influences. Your selections are saved in the sidebar.
                    </p>
                  </div>

                </div>
              </div>

            </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      {isDialogOpen && selectedHourData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsDialogOpen(false)}
        >
          <div 
            className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9] sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div>
                <h3 className="text-[20px] font-bold text-[#18181B]">Detailed Pillar Information</h3>
                <p className="text-[13px] text-[#71717A] mt-1">
                  {getSelectedLuckData()?.year_start}–{getSelectedLuckData()?.year_end} • {selectedYear} • {getSelectedMonthData()?.month_english} • Day {selectedDay} • {selectedHourData.hour_time}
                </p>
              </div>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6 flex flex-col gap-6">
              
              {/* Selected Pillars Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: '10-Year', data: getSelectedLuckData(), color: '#8B5CF6' },
                  { label: 'Year', data: getSelectedYearData(), color: '#A855F7' },
                  { label: 'Month', data: getSelectedMonthData(), color: '#F97316' },
                  { label: 'Day', data: getSelectedDayData(), color: '#22C55E' },
                  { label: 'Hour', data: selectedHourData, color: '#06B6D4' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#F8FAFC] rounded-[16px] p-3 border border-[#F1F5F9] flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: item.color }}>{item.label}</span>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <span className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[20px] leading-none">{item.data?.heavenly_stem?.character || item.data?.heavenly_stem?.name_sc || '?'}</span>
                        <span className="text-[9px] text-[#71717A] mt-1">{item.data?.heavenly_stem?.name || '?'}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[20px] leading-none">{item.data?.earthly_branch?.character || item.data?.earthly_branch?.name_sc || '?'}</span>
                        <span className="text-[9px] text-[#71717A] mt-1">{item.data?.earthly_branch?.name || '?'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Info List */}
              <div className="flex flex-col gap-8">
                {[
                  { label: '10-Year Luck Pillar', data: getSelectedLuckData(), color: '#8B5CF6' },
                  { label: 'Year Pillar', data: getSelectedYearData(), color: '#A855F7' },
                  { label: 'Month Pillar', data: getSelectedMonthData(), color: '#F97316' },
                  { label: 'Day Pillar', data: getSelectedDayData(), color: '#22C55E' },
                  { label: 'Hour Pillar', data: selectedHourData, color: '#06B6D4' }
                ].map((pillarItem, pIdx) => {
                  if (!pillarItem.data) return null;
                  
                  // Calculate Ten God for Heavenly Stem
                  let hsTenGodAbbr = pillarItem.data.heavenly_stem?.ten_god || '-';
                  if (baziData?.four_pillars?.day_pillar?.heavenly_stem?.name && pillarItem.data.heavenly_stem?.name) {
                    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => s.name === baziData.four_pillars.day_pillar.heavenly_stem.name);
                    const stemIndex = HEAVENLY_STEMS.findIndex(s => s.name === pillarItem.data.heavenly_stem.name);
                    if (dayMasterIndex >= 0 && stemIndex >= 0 && dayMasterIndex !== stemIndex) {
                      hsTenGodAbbr = getTenGodsRelationship(dayMasterIndex, stemIndex);
                    }
                  }

                  // Check Lucky Stars for this branch
                  const starsForThisBranch = [];
                  if (luckyStars && pillarItem.data.earthly_branch?.name) {
                    const branchEnglishName = pillarItem.data.earthly_branch.name;
                    const branchNameMap: Record<string, string> = {
                        'Rat': 'Zi', 'Ox': 'Chou', 'Tiger': 'Yin', 'Rabbit': 'Mao',
                        'Dragon': 'Chen', 'Snake': 'Si', 'Horse': 'Wu', 'Goat': 'Wei',
                        'Monkey': 'Shen', 'Rooster': 'You', 'Dog': 'Xu', 'Pig': 'Hai'
                    };
                    const branchTraditional = branchNameMap[branchEnglishName] || branchEnglishName;
                    
                    if (Array.isArray(luckyStars.nobleman) && luckyStars.nobleman.includes(branchTraditional)) starsForThisBranch.push('👑 Nobleman');
                    if (luckyStars.intelligence === branchTraditional) starsForThisBranch.push('🎓 Intelligence');
                    if (luckyStars.peachBlossom === branchTraditional) starsForThisBranch.push('🌸 Peach Blossom');
                    if (luckyStars.skyHorse === branchTraditional) starsForThisBranch.push('🦄 Sky Horse');
                    if (luckyStars.solitary === branchTraditional) starsForThisBranch.push('🌙 Solitary');
                    if (luckyStars.heavenlyDoctor === branchTraditional) starsForThisBranch.push('⚕️ Heavenly Doctor');
                    if (Array.isArray(luckyStars.kongwang) && luckyStars.kongwang.includes(branchTraditional)) starsForThisBranch.push('☯️ Kong Wang');
                  }

                  return (
                    <div key={pIdx} className="flex flex-col gap-4">
                      <h4 className="text-[16px] font-bold border-b border-[#F1F5F9] pb-2 flex items-center gap-2" style={{ color: pillarItem.color }}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillarItem.color }}></div>
                        {pillarItem.label} Details
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Heavenly Stem Details */}
                        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-sm relative">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[24px]">
                              {pillarItem.data.heavenly_stem?.character || pillarItem.data.heavenly_stem?.name_sc}
                            </div>
                            <div>
                              <h5 className="font-bold text-[#18181B] text-[14px]">Heavenly Stem</h5>
                              <p className="text-[12px] text-[#71717A]">{pillarItem.data.heavenly_stem?.name}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-[13px]">
                            <div className="flex justify-between"><span className="text-[#64748B]">Element:</span> <span className="font-medium">{pillarItem.data.heavenly_stem?.element}</span></div>
                            <div className="flex justify-between"><span className="text-[#64748B]">Ten God:</span> <span className="font-medium">{hsTenGodAbbr}</span></div>
                          </div>
                        </div>

                        {/* Earthly Branch Details */}
                        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-sm relative">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[24px]">
                              {pillarItem.data.earthly_branch?.character || pillarItem.data.earthly_branch?.name_sc}
                            </div>
                            <div>
                              <h5 className="font-bold text-[#18181B] text-[14px]">Earthly Branch</h5>
                              <p className="text-[12px] text-[#71717A]">{pillarItem.data.earthly_branch?.name} ({pillarItem.data.earthly_branch?.zodiac})</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-[13px]">
                            <div className="flex justify-between"><span className="text-[#64748B]">Element:</span> <span className="font-medium">{pillarItem.data.earthly_branch?.element}</span></div>
                          </div>
                          {/* Lucky Stars Indicator */}
                          {starsForThisBranch.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
                              <span className="text-[#64748B] text-[12px] block mb-1">Lucky Stars:</span>
                              <div className="flex flex-wrap gap-1">
                                {starsForThisBranch.map((star, idx) => (
                                  <span key={idx} className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-[11px] px-2 py-0.5 rounded-md">{star}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hidden Stems */}
                      {pillarItem.data.hidden_stems && (
                        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-sm mt-2">
                          <h5 className="font-bold text-[#18181B] text-[14px] mb-3">Hidden Stems</h5>
                          <div className="flex flex-wrap gap-3">
                            {[pillarItem.data.hidden_stems.main_qi, pillarItem.data.hidden_stems.sub_main_qi, pillarItem.data.hidden_stems.residual_qi].map((qi, idx) => {
                              if (!qi) return null;
                              return (
                                <div key={idx} className="bg-[#F8FAFC] px-3 py-2 rounded-[10px] border border-[#F1F5F9] flex items-center gap-2">
                                  <span className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[18px]">{qi.character || qi.name_sc}</span>
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-bold">{qi.name}</span>
                                    <span className="text-[9px] text-[#64748B] uppercase">{qi.ten_gods || '-'}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-sm">
                          <h5 className="font-bold text-[#18181B] text-[14px] mb-2">Life Stage</h5>
                          <p className="text-[14px] font-medium text-[#7C3AED]">{pillarItem.data.life_stage || pillarItem.data.life_cycle || 'N/A'}</p>
                        </div>
                        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 shadow-sm">
                          <h5 className="font-bold text-[#18181B] text-[14px] mb-2">Na Yin (Melodic Element)</h5>
                          <p className="text-[14px] font-medium">{pillarItem.data.gan_zhi?.name || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
