import React, { useState } from 'react';

interface HeroFormProps {
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  timezone: string;
  setTimezone: (timezone: string) => void;
  gender: number | null;
  setGender: (gender: number | null) => void;
  unknownTime: boolean;
  setUnknownTime: (unknownTime: boolean) => void;
  mode: 'classic' | 'modern';
  setMode: (mode: 'classic' | 'modern') => void;
  onCalculate: () => void;
  loading: boolean;
  baziData?: any; // Added to check if form is submitted
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
  baziData
}: HeroFormProps) {
  
  const [chartName, setChartName] = useState('Your Destiny Chart');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const handleEditClick = () => {
    setTempName(chartName);
    setIsEditingName(true);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setChartName(tempName.trim());
    }
    setIsEditingName(false);
  };

  // If data is present, show the info card instead of the form
  if (baziData) {
    return (
      <div className="relative w-full flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FAFAFB]">
        <div className="relative z-10 w-full max-w-[1400px] mx-auto">
          <div className="relative bg-white/40 backdrop-blur-[30px] border border-white/60 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-8 overflow-hidden group">
            {/* Liquid Background Effects */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#E94B4B]/20 to-[#F97316]/20 rounded-full blur-3xl mix-blend-multiply opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-[#8B5CF6]/20 to-[#3B82F6]/20 rounded-full blur-3xl mix-blend-multiply opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#E94B4B] to-[#c0392b] flex items-center justify-center shadow-[0_4px_20px_rgba(233,75,75,0.4)] border-4 border-white/80 shrink-0">
                  <span className="text-white font-serif text-4xl font-bold">命</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[28px] font-bold text-[#18181B] tracking-tight">{chartName}</h2>
                    <button 
                      onClick={handleEditClick}
                      className="p-1.5 text-[#94A3B8] hover:text-[#E94B4B] hover:bg-white/60 rounded-full transition-colors"
                      title="Edit Name"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    </button>
                  </div>
                  <p className="text-[15px] text-[#71717A] font-medium">
                    {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                    {!unknownTime && time && ` • ${time}`}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="px-3 py-1 bg-white/60 rounded-full text-[12px] font-semibold text-[#475569] border border-white/80 shadow-sm">
                      {gender === 1 ? 'Male' : 'Female'}
                    </span>
                    <span className="px-3 py-1 bg-white/60 rounded-full text-[12px] font-semibold text-[#475569] border border-white/80 shadow-sm">
                      {timezone.split('/')[1] || timezone}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-semibold text-[14px] rounded-[16px] shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] hover:-translate-y-[1px] shrink-0"
              >
                New Calculation
              </button>
            </div>
          </div>
        </div>

        {/* Edit Name Dialog */}
        {isEditingName && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsEditingName(false)}
          >
            <div 
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
                <h3 className="text-[20px] font-bold text-[#18181B]">Edit Chart Name</h3>
                <button 
                  onClick={() => setIsEditingName(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveName} className="p-6">
                <div className="mb-6">
                  <label className="block text-[14px] text-[#71717A] font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full h-[56px] bg-white border border-[#ECECEC] rounded-[16px] px-4 text-[#18181B] text-[16px] transition-all duration-200 focus:outline-none focus:border-[#E94B4B] focus:ring-4 focus:ring-[#E94B4B]/10"
                    placeholder="e.g. Hendro's Chart"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-6 py-2.5 rounded-[12px] text-[14px] font-medium text-[#71717A] hover:bg-[#F1F5F9] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-[12px] text-[14px] font-medium bg-[#18181B] text-white hover:bg-[#27272A] transition-colors shadow-sm"
                  >
                    Save Name
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[600px] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FAFAFB]">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#E94B4B] to-[#c0392b] flex items-center justify-center shadow-[0_4px_20px_rgba(233,75,75,0.4)] border-4 border-white/80 animate-pulse mb-6">
            <span className="text-white font-serif text-4xl font-bold">命</span>
          </div>
          <h3 className="text-[24px] font-bold text-[#18181B] mb-2">Calculating Destiny...</h3>
          <p className="text-[#71717A] text-[15px]">Analyzing heavenly stems and earthly branches</p>
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Subtle Cloud/Wave Pattern - Top Right */}
        <svg className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] opacity-[0.03] text-[#E94B4B]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,97.4,-2.4C98.1,13.3,93.4,29.3,84.3,42.5C75.2,55.7,61.7,66.1,46.8,73.1C31.9,80.1,15.9,83.7,0.3,83.2C-15.3,82.7,-30.6,78.1,-44.2,70.2C-57.8,62.3,-69.7,51.1,-78.1,37.5C-86.5,23.9,-91.4,7.9,-89.8,-7.3C-88.2,-22.5,-80.1,-36.9,-69.5,-48.4C-58.9,-59.9,-45.8,-68.5,-32.1,-75.1C-18.4,-81.7,-4.1,-86.3,10.5,-85.5C25.1,-84.7,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
        {/* Subtle Cloud/Wave Pattern - Bottom Left */}
        <svg className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] opacity-[0.03] text-[#E94B4B]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M39.9,-65.7C54.1,-60.5,69.6,-53.8,79.5,-41.9C89.4,-30,93.7,-12.9,91.3,3.4C88.9,19.7,79.8,35.2,68.1,47.4C56.4,59.6,42.1,68.5,26.6,73.5C11.1,78.5,-5.6,79.6,-21.5,75.4C-37.4,71.2,-52.5,61.7,-63.4,49.1C-74.3,36.5,-81,20.8,-82.6,4.7C-84.2,-11.4,-80.7,-27.9,-71.6,-40.8C-62.5,-53.7,-47.8,-63,-33.4,-68.5C-19,-74,-4.5,-75.7,9.1,-73.1C22.7,-70.5,35.4,-63.6,39.9,-65.7Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center">
        
        {/* Hero Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            {/* App Mark (Seal) */}
            <div className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-full bg-gradient-to-br from-[#E94B4B] to-[#c0392b] flex items-center justify-center shadow-[0_4px_15px_rgba(233,75,75,0.3)] mr-4 border-2 border-white/50">
              <span className="text-white font-serif text-2xl md:text-3xl font-bold">命</span>
            </div>
            <h1 className="text-[40px] md:text-[48px] font-bold text-[#18181B] tracking-tight leading-tight">
              Bazi Calculator
            </h1>
          </div>
          <p className="text-[16px] md:text-[18px] text-[#71717A] font-medium tracking-wide">
            Chinese Four Pillars Destiny Reading
          </p>
        </div>

        {/* Main Form Container (Liquid Glass) */}
        <div className="w-full bg-white/75 backdrop-blur-[20px] border border-white/70 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6 md:p-8 lg:p-10">
          
          {/* Desktop: 3 columns, Mobile: 1 column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Date Input */}
            <div className="flex flex-col">
              <label className="text-[14px] text-[#71717A] font-medium mb-2 ml-1">Date of Birth</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full h-[56px] bg-white border border-[#ECECEC] rounded-[16px] px-4 text-[#18181B] text-[16px] transition-all duration-200 focus:outline-none focus:border-[#E94B4B] focus:ring-4 focus:ring-[#E94B4B]/10 appearance-none"
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                />
              </div>
            </div>

            {/* Time Input */}
            <div className="flex flex-col">
              <label className="text-[14px] text-[#71717A] font-medium mb-2 ml-1 transition-opacity duration-200" style={{ opacity: unknownTime ? 0.5 : 1 }}>Time of Birth</label>
              <div className="relative">
                <input 
                  type="time" 
                  step="1" 
                  className="w-full h-[56px] bg-white border border-[#ECECEC] rounded-[16px] px-4 text-[#18181B] text-[16px] transition-all duration-200 focus:outline-none focus:border-[#E94B4B] focus:ring-4 focus:ring-[#E94B4B]/10 disabled:bg-gray-50 disabled:text-gray-400 appearance-none"
                  value={time} 
                  onChange={e => setTime(e.target.value)} 
                  disabled={unknownTime} 
                  style={{ opacity: unknownTime ? 0.5 : 1 }} 
                />
              </div>
            </div>

            {/* Timezone Input */}
            <div className="flex flex-col">
              <label className="text-[14px] text-[#71717A] font-medium mb-2 ml-1">Timezone</label>
              <div className="relative">
                <select 
                  className="w-full h-[56px] bg-white border border-[#ECECEC] rounded-[16px] px-4 text-[#18181B] text-[16px] transition-all duration-200 focus:outline-none focus:border-[#E94B4B] focus:ring-4 focus:ring-[#E94B4B]/10 appearance-none pr-10"
                  value={timezone} 
                  onChange={e => setTimezone(e.target.value)}
                >
                  <option value="" disabled>Select Timezone</option>
                  <option value="Asia/Jakarta">(UTC+07:00) Asia/Jakarta</option>
                  <option value="Asia/Singapore">(UTC+08:00) Asia/Singapore</option>
                  <option value="GMT">(UTC+00:00) UTC, GMT</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#71717A]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            
            {/* Left side: Gender & Unknown Time */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">
              
              {/* Gender Segmented Control */}
              <div className="flex flex-col w-full md:w-auto">
                <label className="text-[14px] text-[#71717A] font-medium mb-2 ml-1 md:hidden">Gender</label>
                <div className="flex bg-gray-100/80 p-1 rounded-[16px] w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setGender(0)}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-[12px] text-[15px] font-medium transition-all duration-200 ${gender === 0 ? 'bg-white text-[#E94B4B] shadow-sm' : 'text-[#71717A] hover:text-[#18181B]'}`}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender(1)}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-[12px] text-[15px] font-medium transition-all duration-200 ${gender === 1 ? 'bg-white text-[#E94B4B] shadow-sm' : 'text-[#71717A] hover:text-[#18181B]'}`}
                  >
                    Male
                  </button>
                </div>
              </div>

              {/* Unknown Time Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer group mt-2 md:mt-0">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={unknownTime} 
                    onChange={e => setUnknownTime(e.target.checked)} 
                    className="peer appearance-none w-5 h-5 border-2 border-[#ECECEC] rounded-[6px] checked:bg-[#E94B4B] checked:border-[#E94B4B] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#E94B4B]/10"
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-[15px] text-[#71717A] group-hover:text-[#18181B] transition-colors duration-200 select-none">
                  I don&apos;t know my birth time
                </span>
              </label>
            </div>

          </div>

          {/* Bottom Row: Calculate Button & Mode Toggle */}
          <div className="flex flex-col items-center gap-8">
            
            {/* Calculate Button */}
            <button 
              onClick={onCalculate} 
              disabled={loading} 
              className="w-full md:w-auto min-w-[280px] h-[56px] bg-gradient-to-r from-[#E94B4B] to-[#F97316] text-white font-semibold text-[16px] rounded-[18px] shadow-[0_10px_30px_rgba(233,75,75,0.25)] hover:shadow-[0_12px_35px_rgba(233,75,75,0.35)] hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Calculating...</span>
                </div>
              ) : (
                'Calculate'
              )}
            </button>

            {/* Classic / Modern Toggle (Liquid Glass) */}
            <div className="flex bg-white/50 backdrop-blur-md border border-white/60 p-1 rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
              <button
                type="button"
                onClick={() => setMode('classic')}
                className={`px-6 py-2 rounded-[12px] text-[14px] font-medium transition-all duration-200 ${mode === 'classic' ? 'bg-gradient-to-r from-[#E94B4B] to-[#F97316] text-white shadow-md' : 'text-[#71717A] hover:text-[#18181B]'}`}
              >
                Classic
              </button>
              <button
                type="button"
                onClick={() => setMode('modern')}
                className={`px-6 py-2 rounded-[12px] text-[14px] font-medium transition-all duration-200 ${mode === 'modern' ? 'bg-gradient-to-r from-[#E94B4B] to-[#F97316] text-white shadow-md' : 'text-[#71717A] hover:text-[#18181B]'}`}
              >
                Modern
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
