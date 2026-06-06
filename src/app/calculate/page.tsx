'use client';

import React, { useState, useEffect } from 'react';
import Pillar from '@/components/Pillar';
import LuckyStars from '@/components/LuckyStars';
import ElementStructure from '@/components/ElementStructure';
import TenGods from '@/components/TenGods';
import { calculateLuckyStars } from '@/lib/bazi/lucky-stars';
import { calculateElementStructure, calculateTenGods } from '@/lib/bazi/element-analysis';
import { detectAllHSCombinations, detectAllBranchInteractions, detectLuckPillarCombinations } from '@/lib/bazi/combinations';
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

  return (
    <div className="container mx-auto mt-12 px-4 flex-1 bg-white/95 rounded-2xl mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
      <div className="row justify-center">
        <div className="col-md-10 w-full max-w-6xl mx-auto">
          <h1 className="text-center mb-8 text-[#2c3e50] font-semibold text-shadow-[2px_2px_4px_rgba(52,152,219,0.1)] text-4xl pt-8">Bazi Calculator</h1>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="form-label text-[#34495e] font-medium mb-2 block">Date:</label>
              <input type="date" className="form-control w-full border-2 border-[#bdc3c7] rounded-lg p-3 transition-all duration-300 focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/25 outline-none" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label className="form-label text-[#34495e] font-medium mb-2 block" style={{ opacity: unknownTime ? 0.5 : 1 }}>Time:</label>
              <input type="time" step="1" className="form-control w-full border-2 border-[#bdc3c7] rounded-lg p-3 transition-all duration-300 focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/25 outline-none" value={time} onChange={e => setTime(e.target.value)} disabled={unknownTime} style={{ opacity: unknownTime ? 0.5 : 1 }} />
            </div>
            <div>
              <label className="form-label text-[#34495e] font-medium mb-2 block">Timezone:</label>
              <select className="form-select w-full border-2 border-[#bdc3c7] rounded-lg p-3 transition-all duration-300 focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/25 outline-none" value={timezone} onChange={e => setTimezone(e.target.value)}>
                <option value="" disabled>-- Select Timezone --</option>
                <option value="Asia/Jakarta">(UTC+07:00) Asia/Jakarta</option>
                <option value="Asia/Singapore">(UTC+08:00) Asia/Singapore</option>
                <option value="GMT">(UTC+00:00) UTC, GMT</option>
                {/* Add more timezones as needed */}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center">
              <label className="form-label mr-4 mb-0">Gender:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="0" checked={gender === 0} onChange={() => setGender(0)} className="w-4 h-4 text-[#3498db]" />
                  Female
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="1" checked={gender === 1} onChange={() => setGender(1)} className="w-4 h-4 text-[#3498db]" />
                  Male
                </label>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <input type="checkbox" checked={unknownTime} onChange={e => setUnknownTime(e.target.checked)} className="w-4 h-4 rounded text-[#3498db]" />
                <i className="fas fa-clock"></i> Don't Know Birth Time
              </label>
              <button onClick={handleCalculate} disabled={loading} className="bg-gradient-to-br from-[#f39c12] to-[#e67e22] hover:from-[#e67e22] hover:to-[#d35400] text-white font-semibold py-3 px-8 rounded-xl shadow-[0_4px_15px_rgba(243,156,18,0.3)] hover:shadow-[0_6px_20px_rgba(243,156,18,0.4)] hover:-translate-y-0.5 transition-all duration-300 min-w-[150px]">
                {loading ? 'Calculating...' : 'Calculate'}
              </button>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mt-4 mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" onClick={() => setMode('classic')} className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${mode === 'classic' ? 'bg-gradient-to-br from-[#f39c12] to-[#e67e22] text-white border-[#e67e22] shadow-[0_4px_15px_rgba(243,156,18,0.3)]' : 'bg-white text-gray-900'}`}>
                <i className="fas fa-book mr-2"></i> Classic (经典)
              </button>
              <button type="button" onClick={() => setMode('modern')} className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${mode === 'modern' ? 'bg-gradient-to-br from-[#f39c12] to-[#e67e22] text-white border-[#e67e22] shadow-[0_4px_15px_rgba(243,156,18,0.3)]' : 'bg-white text-gray-900'}`}>
                <i className="fas fa-globe mr-2"></i> Modern
              </button>
            </div>
          </div>

          {error && <div className="bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24] px-4 py-3 rounded-lg mb-6">{error}</div>}

          {/* Results Section */}
          {baziData && (
            <div className="mt-8 p-8 bg-gradient-to-br from-[#f8f9fa] to-white rounded-2xl border border-[#e9ecef] shadow-[0_8px_25px_rgba(0,0,0,0.05)]">
              <h3 className="text-center mb-6 text-[#34495e] font-bold text-2xl">Natal Chart & Current Transiting Pillars (Read Right to Left):</h3>
              
              {/* 8 Pillars Row */}
              <div className="flex flex-nowrap flex-row justify-center items-start gap-[0.6rem] my-8 p-[1.25rem_0.75rem] bg-gradient-to-br from-[#f8f9fa] to-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-visible min-h-[400px]">
                {/* Natal Chart */}
                {!unknownTime ? (
                  <Pillar title="Hour Pillar (時柱)" pillarData={baziData.four_pillars.hour_pillar} luckyStars={luckyStars} hsCombos={hsCombos?.H} branchInteractions={branchInteractions?.H} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} />
                ) : (
                  <div className="pillar flex-none w-[145px] min-h-[520px] h-auto p-0 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] text-[#2c3e50] text-center bg-white box-border transition-all duration-350 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative grid grid-rows-[50px_80px_1px_80px_55px_1px_45px_1px_45px_auto] items-center gap-0 natal-pillar border-3 border-[#3498db] bg-gradient-to-br from-white to-[#f8fbff]">
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-[#3498db] to-[#2980b9]"></div>
                    <div className="pillar-title text-[0.78rem] font-bold text-[#2c3e50] p-[0.5rem_0.35rem] flex items-center justify-center row-start-1 border-b-2 leading-[1.2] min-h-[55px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] tracking-[0.3px] bg-[rgba(52,152,219,0.08)] border-b-[#e8f4f8]">Hour Pillar</div>
                    <div className="pillar-value flex flex-col items-center justify-center p-[0.5rem_0.3rem] relative row-start-2 min-h-[85px]">
                        <strong className="text-[#ccc] text-[2.5rem] font-bold">?</strong>
                    </div>
                    <hr className="border-none h-[1px] w-full m-0 relative row-start-3 bg-gradient-to-r from-transparent via-[rgba(52,152,219,0.25)] to-transparent" />
                    <div className="pillar-value flex flex-col items-center justify-center p-[0.5rem_0.3rem] relative row-start-4 min-h-[85px]">
                        <strong className="text-[#ccc] text-[2.5rem] font-bold">?</strong>
                    </div>
                    <hr className="border-none h-[1px] w-full m-0 relative row-start-6 bg-gradient-to-r from-transparent via-[rgba(52,152,219,0.25)] to-transparent" />
                    <div className="ganzhi-separator font-bold m-0 flex items-center justify-center leading-[1.2] relative row-start-7 text-[0.65rem] p-[0.4rem_0.25rem] min-h-[48px] bg-gradient-to-br from-[rgba(52,152,219,0.08)] to-[rgba(52,152,219,0.03)]">
                        <strong className="text-[#ccc] text-[0.9rem]">N/A</strong>
                    </div>
                    <hr className="border-none h-[1px] w-full m-0 relative row-start-8 bg-gradient-to-r from-transparent via-[rgba(52,152,219,0.25)] to-transparent" />
                    <div className="lifecycle-separator flex items-center justify-center row-start-9 p-[0.4rem_0.25rem] min-h-[48px] bg-gradient-to-br from-[rgba(142,68,173,0.05)] to-[rgba(142,68,173,0.02)]">
                        <div className="text-[#ccc] text-[0.85rem]">N/A</div>
                    </div>
                    <div className="hs-combo-row flex flex-col items-center justify-start relative overflow-y-auto overflow-x-hidden scrollbar-thin row-start-10 p-[0.5rem_0.25rem] min-h-[20px] max-h-[200px] gap-[0.25rem] border-t-2 bg-gradient-to-br from-[rgba(231,76,60,0.08)] to-[rgba(231,76,60,0.03)] border-t-[rgba(231,76,60,0.15)]">
                      <div className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e74c3c] to-transparent"></div>
                    </div>
                  </div>
                )}
                <Pillar title="Day Pillar (日柱)" pillarData={baziData.four_pillars.day_pillar} luckyStars={luckyStars} hsCombos={hsCombos?.D} branchInteractions={branchInteractions?.D} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} />
                <Pillar title="Month Pillar (月柱)" pillarData={baziData.four_pillars.month_pillar} luckyStars={luckyStars} hsCombos={hsCombos?.M} branchInteractions={branchInteractions?.M} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} />
                <Pillar title="Year Pillar (年柱)" pillarData={baziData.four_pillars.year_pillar} luckyStars={luckyStars} hsCombos={hsCombos?.Y} branchInteractions={branchInteractions?.Y} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} />
                
                {/* Visual Separator */}
                <div className="w-[2px] bg-gradient-to-b from-transparent via-[rgba(189,195,199,0.5)] to-transparent mx-2 my-8"></div>

                {/* Current Pillars */}
                <Pillar title="Current Luck Cycle" pillarData={currentPillars?.luck} isCurrent luckyStars={luckyStars} hsCombos={hsCombos?.CL} branchInteractions={branchInteractions?.CL} periodLabel="Period:" periodValue={currentPillars?.luck?.luck_period} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} />
                <Pillar title="Current Year" pillarData={currentPillars?.year} isCurrent luckyStars={luckyStars} hsCombos={hsCombos?.CY} branchInteractions={branchInteractions?.CY} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} />
                <Pillar title="Current Month" pillarData={currentPillars?.month} isCurrent luckyStars={luckyStars} hsCombos={hsCombos?.CM} branchInteractions={branchInteractions?.CM} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} />
                <Pillar title="Current Day" pillarData={currentPillars?.day} isCurrent luckyStars={luckyStars} hsCombos={hsCombos?.CD} branchInteractions={branchInteractions?.CD} dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name} />
              </div>

              {/* Analysis Section */}
              <div className="mt-8 bg-white rounded-[15px] p-10 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
                <div className="flex flex-wrap -mx-4">
                  <LuckyStars stars={luckyStars} mode={mode} />
                  <ElementStructure elementData={elementData} />
                  <TenGods tenGodsData={tenGodsData} />
                </div>
              </div>

              <hr className="border-none h-[2px] bg-gradient-to-r from-[#3498db] via-[#2ecc71] to-[#f39c12] my-8 rounded-[1px]" />

              {/* Time Periods Section */}
              <div className="text-center mb-4">
                <button onClick={handleResetSelection} className="bg-gradient-to-br from-[#e74c3c] to-[#c0392b] text-white border-none py-2 px-5 rounded-full font-semibold cursor-pointer text-[0.9rem] shadow-[0_2px_8px_rgba(231,76,60,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(231,76,60,0.4)]">
                  🔄 Reset to Current Time
                </button>
              </div>

              <h3 className="text-center mb-6 text-[#34495e] font-bold text-2xl">10-Year Luck Pillars:</h3>
              <div className="flex flex-nowrap flex-row-reverse justify-center gap-[0.3rem] my-8 overflow-visible p-[1.5rem_0.3rem] bg-gradient-to-br from-[#f4f4f4] to-white rounded-2xl shadow-inner">
                {baziData.luck_pillars.luck_pillars.map((pillar: any, index: number) => {
                  const isCurrentPeriod = new Date().getFullYear() >= pillar.year_start && new Date().getFullYear() <= pillar.year_end;
                  return (
                    <div key={index} className="relative">
                      {isCurrentPeriod && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#f39c12] to-[#e67e22] text-white py-1 px-4 rounded-full text-[0.7rem] font-extrabold whitespace-nowrap shadow-[0_4px_12px_rgba(243,156,18,0.5)] z-10 border-2 border-white">
                          ⭐ Current Period
                        </div>
                      )}
                      <Pillar 
                        title={`Luck ${pillar.number}`} 
                        pillarData={pillar} 
                        isCurrent={isCurrentPeriod}
                        isSelected={selectedLuck === index}
                        onClick={() => setSelectedLuck(selectedLuck === index ? null : index)}
                        periodLabel="Period:"
                        periodValue={`${pillar.year_start}-${pillar.year_end}`}
                        luckyStars={luckyStars}
                        hsCombos={luckPillarCombos[index]?.hsCombos}
                        branchInteractions={luckPillarCombos[index]?.branchInteractions}
                        dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                        isCompact
                      />
                    </div>
                  );
                })}
              </div>

              {/* Year Pillars */}
              {yearPillars.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-center mb-4 text-[#2c3e50] font-bold text-xl">Year Pillars:</h4>
                  <div className="flex flex-nowrap flex-row-reverse justify-start items-stretch gap-[0.3rem] overflow-x-auto overflow-y-hidden p-[1rem_0.5rem] scrollbar-thin bg-gradient-to-br from-[rgba(52,152,219,0.02)] to-[rgba(255,255,255,0.8)] rounded-[0.8rem] my-2 border border-[rgba(52,152,219,0.1)]">
                    {yearPillars.map((pillar, index) => {
                      const combos = detectLuckPillarCombinations(pillar, baziData.four_pillars);
                      return (
                        <Pillar 
                          key={index}
                          title={pillar.year.toString()}
                          pillarData={pillar}
                          isSelected={selectedYear === pillar.year}
                          onClick={() => setSelectedYear(selectedYear === pillar.year ? null : pillar.year)}
                          luckyStars={luckyStars}
                          hsCombos={combos.hsCombos}
                          branchInteractions={combos.branchInteractions}
                          dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                          isCompact
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Month Pillars */}
              {monthPillars.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-center mb-4 text-[#2c3e50] font-bold text-xl">Month Pillars:</h4>
                  <div className="flex flex-nowrap flex-row-reverse justify-start items-stretch gap-[0.3rem] overflow-x-auto overflow-y-hidden p-[1rem_0.5rem] scrollbar-thin bg-gradient-to-br from-[rgba(52,152,219,0.02)] to-[rgba(255,255,255,0.8)] rounded-[0.8rem] my-2 border border-[rgba(52,152,219,0.1)]">
                    {monthPillars.map((pillar, index) => {
                      const combos = detectLuckPillarCombinations(pillar, baziData.four_pillars);
                      return (
                        <Pillar 
                          key={index}
                          title={pillar.month_english}
                          pillarData={pillar}
                          isSelected={selectedMonth === pillar.month}
                          onClick={() => setSelectedMonth(selectedMonth === pillar.month ? null : pillar.month)}
                          luckyStars={luckyStars}
                          hsCombos={combos.hsCombos}
                          branchInteractions={combos.branchInteractions}
                          dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                          isCompact
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Day Pillars */}
              {dayPillars.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-center mb-4 text-[#2c3e50] font-bold text-xl">Day Pillars:</h4>
                  <div className="flex flex-nowrap flex-row-reverse justify-start items-stretch gap-[0.3rem] overflow-x-auto overflow-y-hidden p-[1rem_0.5rem] scrollbar-thin bg-gradient-to-br from-[rgba(52,152,219,0.02)] to-[rgba(255,255,255,0.8)] rounded-[0.8rem] my-2 border border-[rgba(52,152,219,0.1)]">
                    {dayPillars.map((pillar, index) => {
                      const combos = detectLuckPillarCombinations(pillar, baziData.four_pillars);
                      return (
                        <Pillar 
                          key={index}
                          title={pillar.day.toString()}
                          pillarData={pillar}
                          isSelected={selectedDay === pillar.day}
                          onClick={() => setSelectedDay(selectedDay === pillar.day ? null : pillar.day)}
                          luckyStars={luckyStars}
                          hsCombos={combos.hsCombos}
                          branchInteractions={combos.branchInteractions}
                          dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                          isCompact
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hour Pillars */}
              {hourPillars.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-center mb-4 text-[#2c3e50] font-bold text-xl">Hour Pillars:</h4>
                  <div className="flex flex-nowrap flex-row-reverse justify-start items-stretch gap-[0.3rem] overflow-x-auto overflow-y-hidden p-[1rem_0.5rem] scrollbar-thin bg-gradient-to-br from-[rgba(52,152,219,0.02)] to-[rgba(255,255,255,0.8)] rounded-[0.8rem] my-2 border border-[rgba(52,152,219,0.1)]">
                    {hourPillars.map((pillar, index) => {
                      const combos = detectLuckPillarCombinations(pillar, baziData.four_pillars);
                      return (
                        <Pillar 
                          key={index}
                          title={pillar.hour_time}
                          pillarData={pillar}
                          luckyStars={luckyStars}
                          hsCombos={combos.hsCombos}
                          branchInteractions={combos.branchInteractions}
                          dayMasterName={baziData.four_pillars.day_pillar?.heavenly_stem?.name}
                          isCompact
                        />
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
