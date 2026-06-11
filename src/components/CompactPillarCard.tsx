import React from 'react';
import { ELEMENT_COLORS, HEAVENLY_STEMS } from '@/lib/bazi/constants';
import { getTenGodsRelationship } from '@/lib/bazi/element-analysis';

interface CompactPillarCardProps {
  title: string;
  subtitle: string;
  pillarData: any;
  isSelected: boolean;
  onClick: () => void;
  color?: string;
  dayMasterName?: string;
  luckyStars?: any;
}

export default function CompactPillarCard({ 
  title, 
  subtitle, 
  pillarData, 
  isSelected, 
  onClick, 
  color = '#8B5CF6',
  dayMasterName,
  luckyStars
}: CompactPillarCardProps) {
  if (!pillarData) return null;

  const hs = pillarData.heavenly_stem;
  const eb = pillarData.earthly_branch;
  
  const hsElement = hs?.element || "Wood";
  const ebElement = eb?.element || "Wood";

  // Calculate 10 God abbreviation for heavenly stem (if dayMasterName provided)
  let hsTenGodAbbr = '';
  if (dayMasterName && hs?.name) {
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => s.name === dayMasterName);
    const stemIndex = HEAVENLY_STEMS.findIndex(s => s.name === hs.name);
    if (dayMasterIndex >= 0 && stemIndex >= 0 && dayMasterIndex !== stemIndex) {
      hsTenGodAbbr = getTenGodsRelationship(dayMasterIndex, stemIndex);
    }
  }

  // Check Lucky Stars for this branch
  const starsForThisBranch = [];
  if (luckyStars && eb?.name) {
    const branchEnglishName = eb.name;
    const branchNameMap: Record<string, string> = {
        'Rat': 'Zi', 'Ox': 'Chou', 'Tiger': 'Yin', 'Rabbit': 'Mao',
        'Dragon': 'Chen', 'Snake': 'Si', 'Horse': 'Wu', 'Goat': 'Wei',
        'Monkey': 'Shen', 'Rooster': 'You', 'Dog': 'Xu', 'Pig': 'Hai'
    };
    const branchTraditional = branchNameMap[branchEnglishName] || branchEnglishName;
    
    if (Array.isArray(luckyStars.nobleman) && luckyStars.nobleman.includes(branchTraditional)) starsForThisBranch.push('👑');
    if (luckyStars.intelligence === branchTraditional) starsForThisBranch.push('🎓');
    if (luckyStars.peachBlossom === branchTraditional) starsForThisBranch.push('🌸');
    if (luckyStars.skyHorse === branchTraditional) starsForThisBranch.push('🦄');
    if (luckyStars.solitary === branchTraditional) starsForThisBranch.push('🌙');
    if (luckyStars.heavenlyDoctor === branchTraditional) starsForThisBranch.push('⚕️');
    if (Array.isArray(luckyStars.kongwang) && luckyStars.kongwang.includes(branchTraditional)) starsForThisBranch.push('☯️');
  }

  return (
    <div 
      onClick={onClick}
      className={`flex-none w-[160px] md:w-[180px] h-[280px] p-4 rounded-[20px] bg-white/72 backdrop-blur-[20px] border cursor-pointer transition-all duration-300 flex flex-col items-center justify-between relative group ${
        isSelected 
          ? 'shadow-[0_12px_40px_rgba(0,0,0,0.08)]' 
          : 'border-[#F1F5F9] hover:border-[#CBD5E1] hover:shadow-md'
      }`}
      style={{ 
        borderColor: isSelected ? color : undefined,
        borderWidth: isSelected ? '2px' : '1px'
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center w-full relative">
        <span className="text-[14px] font-bold text-[#18181B]">{title}</span>
        <span className="text-[12px] text-[#71717A]">{subtitle}</span>
        
        {/* Ten God Badge */}
        {hsTenGodAbbr && (
          <div className="absolute right-0 top-0 h-[22px] px-2 rounded-full bg-[#F3E8FF] text-[#7C3AED] text-[11px] font-bold flex items-center justify-center whitespace-nowrap">
            {hsTenGodAbbr}
          </div>
        )}
      </div>

      {/* Stem */}
      <div className="flex flex-col items-center mt-2">
        <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[36px] leading-none" style={{ color: ELEMENT_COLORS[hsElement] || hs?.color || '#18181B' }}>
          {hs?.character || hs?.name_sc || hs?.name}
        </strong>
        <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: ELEMENT_COLORS[hsElement] || hs?.color || '#18181B' }}>
          {hs?.name || 'N/A'}
        </div>
      </div>

      {/* Branch */}
      <div className="flex flex-col items-center mt-2 relative">
        <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] text-[36px] leading-none" style={{ color: ELEMENT_COLORS[ebElement] || eb?.color || '#18181B' }}>
          {eb?.character || eb?.name_sc || eb?.name}
        </strong>
        <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: ELEMENT_COLORS[ebElement] || eb?.color || '#18181B' }}>
          {eb?.name || 'N/A'}
        </div>
        
        {/* Lucky Stars Indicator */}
        {starsForThisBranch.length > 0 && (
          <div className="absolute top-0 right-[-15px] flex flex-col items-center bg-white/90 rounded-md p-1 shadow-sm z-10">
            {starsForThisBranch.map((star, idx) => (
              <div key={idx} className="text-[12px] leading-tight">{star}</div>
            ))}
          </div>
        )}
      </div>

      {/* Life Stage */}
      {pillarData.life_stage && (
        <div className="mt-auto pt-3 border-t border-[#F1F5F9] w-full text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>
            {pillarData.life_stage}
          </span>
        </div>
      )}

      {/* Selected Pointer */}
      {isSelected && (
        <div className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 text-[16px]" style={{ color }}>
          ▼
        </div>
      )}
    </div>
  );
}
