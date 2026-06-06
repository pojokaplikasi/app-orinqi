import React from 'react';
import { ELEMENT_COLORS } from '@/lib/bazi/constants';
import { getTenGodsRelationship } from '@/lib/bazi/element-analysis';
import { HEAVENLY_STEMS } from '@/lib/bazi/constants';

interface PillarProps {
  title: string;
  pillarData: any;
  isCurrent?: boolean;
  luckyStars?: any;
  hsCombos?: any[];
  branchInteractions?: any[];
  periodLabel?: string;
  periodValue?: string;
  onClick?: () => void;
  isSelected?: boolean;
  isCompact?: boolean;
  dayMasterName?: string;
}

export default function Pillar({
  title,
  pillarData,
  isCurrent = false,
  luckyStars,
  hsCombos = [],
  branchInteractions = [],
  periodLabel,
  periodValue,
  onClick,
  isSelected = false,
  isCompact = false,
  dayMasterName
}: PillarProps) {
  if (!pillarData) return null;

  const { heavenly_stem, earthly_branch, hidden_stems, gan_zhi, life_cycle } = pillarData;
  
  // Calculate 10 God abbreviation for heavenly stem (if dayMasterName provided)
  let hsTenGodAbbr = '';
  if (dayMasterName && heavenly_stem?.name) {
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => s.name === dayMasterName);
    const stemIndex = HEAVENLY_STEMS.findIndex(s => s.name === heavenly_stem.name);
    if (dayMasterIndex >= 0 && stemIndex >= 0 && dayMasterIndex !== stemIndex) {
      hsTenGodAbbr = getTenGodsRelationship(dayMasterIndex, stemIndex);
    }
  }
  
  // Get element colors
  const hsElement = heavenly_stem?.element || "Wood";
  const ebElement = earthly_branch?.element || "Wood";
  const nayinElement = gan_zhi?.element_name || "Wood";

  // Check Lucky Stars for this branch
  const starsForThisBranch = [];
  if (luckyStars && earthly_branch?.name) {
    const branchEnglishName = earthly_branch.name;
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

  // Format HS Combos
  const hsLabel = hsCombos.length > 0 ? `HS Combinations ${hsCombos.map(c => c.partner).join(', ')}` : '';
  
  // Format Branch Interactions
  const groupedInteractions: Record<string, any[]> = {};
  branchInteractions.forEach(interaction => {
      if (!groupedInteractions[interaction.type]) {
          groupedInteractions[interaction.type] = [];
      }
      groupedInteractions[interaction.type].push(interaction);
  });

  const branchLabels: any[] = [];
  const positiveTypes = ['seasonal', 'sanhe', 'banhe', 'liuhe', 'anhe'];
  positiveTypes.forEach(type => {
      if (groupedInteractions[type]) {
          const items = groupedInteractions[type];
          const partners = items.map(i => i.partner).join(',');
          const icon = items[0].interaction.icon;
          
          const name = type === 'seasonal' ? 'Seasonal Unions' :
                 type === 'sanhe' ? 'Three Harmonies' :
                 type === 'banhe' ? 'Half Combinations' :
                 type === 'liuhe' ? 'Six Harmonies' :
                 'Hidden Combinations';
          
          branchLabels.push({
              text: `${icon} ${name} ${partners}`,
              element: items[0].interaction.element,
              tooltip: items[0].interaction.name,
              category: 'positive'
          });
      }
  });

  const negativeTypes = ['ungrateful', 'arrogant', 'rude', 'self', 'clash', 'destruction', 'harm'];
  negativeTypes.forEach(type => {
      if (groupedInteractions[type]) {
          const items = groupedInteractions[type];
          const partners = items.map(i => i.partner).join(',');
          const icon = items[0].interaction.icon;
          
          const name = type === 'ungrateful' ? 'Ungrateful Punishment' :
                 type === 'arrogant' ? 'Bullying Punishment' :
                 type === 'rude' ? 'Uncivilized Punishment' :
                 type === 'self' ? 'Self Punishment' :
                 type === 'clash' ? 'Six Clashes' :
                 type === 'destruction' ? 'Destruction' :
                 'Six Harms';
          
          branchLabels.push({
              text: `${icon} ${name} ${partners}`,
              element: null,
              tooltip: items[0].interaction.name,
              category: 'negative'
          });
      }
  });

  // Base classes
  let pillarClass = "pillar flex-none w-[145px] min-h-[520px] h-auto p-0 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] text-[#2c3e50] text-center bg-white box-border transition-all duration-350 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative grid grid-rows-[50px_80px_1px_80px_55px_1px_45px_1px_45px_auto] items-center gap-0 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(0,0,0,0.15)]";
  
  if (isCompact) {
    pillarClass = "time-period-pillar flex-none w-[90px] min-h-[560px] h-auto p-[0.4rem_0.25rem] m-0 rounded-[0.6rem] text-[0.58rem] text-center border-2 border-[#bdc3c7] bg-gradient-to-br from-white to-[#f8f9fa] shadow-[0_3px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative grid grid-rows-[48px_64px_1px_64px_58px_1px_38px_1px_38px_auto] items-center gap-0 hover:-translate-y-[3px] hover:scale-105 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] hover:border-[#95a5a6] cursor-pointer";
  } else if (isCurrent) {
    pillarClass += " current-pillar border-3 border-[#e67e22] bg-gradient-to-br from-[#fff8f0] to-[#ffecd1] hover:border-[#d35400] hover:shadow-[0_12px_35px_rgba(230,126,34,0.3)]";
  } else {
    pillarClass += " natal-pillar border-3 border-[#3498db] bg-gradient-to-br from-white to-[#f8fbff] hover:border-[#2980b9] hover:shadow-[0_12px_35px_rgba(52,152,219,0.25)]";
  }

  if (isSelected) {
    pillarClass += " border-3 border-[#e74c3c] bg-[rgba(231,76,60,0.1)]";
  }

  return (
    <div className={pillarClass} onClick={onClick}>
      {/* Top Border Gradient */}
      {!isCompact && (
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${isCurrent ? 'bg-gradient-to-r from-[#e67e22] to-[#d35400]' : 'bg-gradient-to-r from-[#3498db] to-[#2980b9]'}`}></div>
      )}

      {/* Title */}
      <div className={`pillar-title text-[0.78rem] font-bold text-[#2c3e50] p-[0.5rem_0.35rem] flex items-center justify-center row-start-1 border-b-2 leading-[1.2] min-h-[55px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] tracking-[0.3px] ${isCompact ? 'text-[0.58rem] p-[0.35rem_0.2rem] bg-[rgba(52,152,219,0.1)] rounded-t-[0.4rem] min-h-[48px] border-none' : isCurrent ? 'bg-[rgba(230,126,34,0.1)] border-b-[#f4e4d1] text-[#d35400]' : 'bg-[rgba(52,152,219,0.08)] border-b-[#e8f4f8]'}`}>
        {title}
      </div>

      {/* Heavenly Stem */}
      <div className={`pillar-value flex flex-col items-center justify-center p-[0.5rem_0.3rem] relative row-start-2 ${isCompact ? 'min-h-[68px]' : 'min-h-[85px]'}`}>
        <div className="relative inline-block">
          <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] font-bold leading-[0.9] mb-[0.3rem] block drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[3px_3px_6px_rgba(0,0,0,0.2)]" style={{ color: ELEMENT_COLORS[hsElement], fontSize: isCompact ? '2.2rem' : '3.5rem' }}>
            {heavenly_stem?.character || '?'}
          </strong>
          {/* 10 God Abbreviation Badge */}
          {hsTenGodAbbr && (
            <span className="absolute bg-white rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.2)] font-bold text-[#9b59b6] leading-none" style={{ top: isCompact ? '-3px' : '-5px', right: isCompact ? '-18px' : '-25px', fontSize: isCompact ? '0.55rem' : '0.75rem', padding: isCompact ? '1px 3px' : '2px 4px' }}>
              {hsTenGodAbbr}
            </span>
          )}
        </div>
        <div className="font-bold mt-[0.2rem] leading-[1.2] uppercase tracking-[0.5px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]" style={{ color: ELEMENT_COLORS[hsElement], fontSize: isCompact ? '0.52rem' : '0.75rem' }}>
          {heavenly_stem?.name || 'N/A'}
        </div>
      </div>

      {/* HR 1 */}
      <hr className="border-none h-[1px] w-full m-0 relative row-start-3" style={{ background: `linear-gradient(90deg, transparent 0%, ${isCurrent ? 'rgba(230,126,34,0.3)' : 'rgba(52,152,219,0.25)'} 15%, ${isCurrent ? 'rgba(230,126,34,0.3)' : 'rgba(52,152,219,0.25)'} 85%, transparent 100%)` }} />

      {/* Earthly Branch */}
      <div className={`pillar-value flex flex-col items-center justify-center p-[0.5rem_0.3rem] relative row-start-4 ${isCompact ? 'min-h-[68px]' : 'min-h-[85px]'}`}>
        <strong className="font-['STKaiti','KaiTi','SimSun','Microsoft_YaHei',serif] font-bold leading-[0.9] mb-[0.3rem] block drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[3px_3px_6px_rgba(0,0,0,0.2)]" style={{ color: ELEMENT_COLORS[ebElement], fontSize: isCompact ? '2.2rem' : '3.5rem' }}>
          {earthly_branch?.character || '?'}
        </strong>
        <div className="font-bold mt-[0.2rem] leading-[1.2] uppercase tracking-[0.5px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]" style={{ color: ELEMENT_COLORS[ebElement], fontSize: isCompact ? '0.52rem' : '0.75rem' }}>
          {earthly_branch?.name || 'N/A'}
        </div>
        
        {/* Lucky Stars Indicator */}
        {starsForThisBranch.length > 0 && (
          <div className="absolute top-[10px] right-[5px] flex flex-col items-center bg-[rgba(255,255,255,0.95)] rounded-[5px] p-[3px_4px] shadow-[0_2px_5px_rgba(0,0,0,0.25)] z-10">
            {starsForThisBranch.map((star, idx) => (
              <div key={idx} className="text-[0.95rem] leading-[1.2] mb-[2px]">{star}</div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden Stems */}
      <div className={`hidden-stems-container row-start-5 p-[0.35rem_0.3rem] rounded-[0.4rem] m-[0.2rem_0.3rem] flex flex-col items-center justify-center border shadow-[0_2px_5px_rgba(0,0,0,0.03)] ${isCurrent ? 'bg-gradient-to-br from-[rgba(230,126,34,0.06)] to-[rgba(230,126,34,0.03)] border-[rgba(230,126,34,0.2)]' : 'bg-gradient-to-br from-[rgba(149,165,166,0.05)] to-[rgba(149,165,166,0.02)] border-[rgba(149,165,166,0.1)]'}`}>
        <div className="hidden-stems-grid grid grid-cols-3 justify-items-center items-center gap-[0.7rem] w-full max-w-full">
          {/* Residual Qi */}
          <div className="hidden-stem-column flex flex-col items-center justify-center w-full">
            <div className="hidden-stem-char font-['Times_New_Roman',serif] font-bold mb-[0.2rem] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] leading-[1] text-center" style={{ color: hidden_stems?.residual_qi ? ELEMENT_COLORS[hidden_stems.residual_qi.element] : '#ccc', fontSize: isCompact ? '0.63rem' : '0.85rem' }}>
              {hidden_stems?.residual_qi?.character || '-'}
            </div>
            <div className="ten-gods-label font-bold text-[#3498db] uppercase tracking-[0.02em] drop-shadow-[0_1px_1px_rgba(52,152,219,0.1)] p-[0.12rem_0.28rem] bg-gradient-to-br from-[rgba(52,152,219,0.08)] to-[rgba(52,152,219,0.04)] rounded-[0.25rem] border border-[rgba(52,152,219,0.12)] whitespace-nowrap min-w-[26px] text-center inline-block" style={{ fontSize: isCompact ? '0.45rem' : '0.62rem' }}>
              {hidden_stems?.residual_qi?.ten_gods || '--'}
            </div>
          </div>
          
          {/* Main Qi */}
          <div className="hidden-stem-column flex flex-col items-center justify-center w-full">
            <div className="hidden-stem-char font-['Times_New_Roman',serif] font-bold mb-[0.2rem] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] leading-[1] text-center" style={{ color: hidden_stems?.main_qi ? ELEMENT_COLORS[hidden_stems.main_qi.element] : '#ccc', fontSize: isCompact ? '0.85rem' : '1.1rem' }}>
              {hidden_stems?.main_qi?.character || '-'}
            </div>
            <div className="ten-gods-label font-bold text-[#3498db] uppercase tracking-[0.02em] drop-shadow-[0_1px_1px_rgba(52,152,219,0.1)] p-[0.12rem_0.28rem] bg-gradient-to-br from-[rgba(52,152,219,0.08)] to-[rgba(52,152,219,0.04)] rounded-[0.25rem] border border-[rgba(52,152,219,0.12)] whitespace-nowrap min-w-[26px] text-center inline-block" style={{ fontSize: isCompact ? '0.45rem' : '0.62rem' }}>
              {hidden_stems?.main_qi?.ten_gods || '--'}
            </div>
          </div>
          
          {/* Sub Main Qi */}
          <div className="hidden-stem-column flex flex-col items-center justify-center w-full">
            <div className="hidden-stem-char font-['Times_New_Roman',serif] font-bold mb-[0.2rem] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] leading-[1] text-center" style={{ color: hidden_stems?.sub_main_qi ? ELEMENT_COLORS[hidden_stems.sub_main_qi.element] : '#ccc', fontSize: isCompact ? '0.63rem' : '0.85rem' }}>
              {hidden_stems?.sub_main_qi?.character || '-'}
            </div>
            <div className="ten-gods-label font-bold text-[#3498db] uppercase tracking-[0.02em] drop-shadow-[0_1px_1px_rgba(52,152,219,0.1)] p-[0.12rem_0.28rem] bg-gradient-to-br from-[rgba(52,152,219,0.08)] to-[rgba(52,152,219,0.04)] rounded-[0.25rem] border border-[rgba(52,152,219,0.12)] whitespace-nowrap min-w-[26px] text-center inline-block" style={{ fontSize: isCompact ? '0.45rem' : '0.62rem' }}>
              {hidden_stems?.sub_main_qi?.ten_gods || '--'}
            </div>
          </div>
        </div>
      </div>

      {/* HR 2 */}
      <hr className="border-none h-[1px] w-full m-0 relative row-start-6" style={{ background: `linear-gradient(90deg, transparent 0%, ${isCurrent ? 'rgba(230,126,34,0.3)' : 'rgba(52,152,219,0.25)'} 15%, ${isCurrent ? 'rgba(230,126,34,0.3)' : 'rgba(52,152,219,0.25)'} 85%, transparent 100%)` }} />

      {/* Nayin */}
      <div className={`ganzhi-separator font-bold m-0 flex items-center justify-center leading-[1.2] relative row-start-7 ${isCompact ? 'text-[0.50rem] p-[0.3rem_0.15rem] bg-[rgba(52,152,219,0.05)] rounded-[0.2rem] min-h-[38px]' : 'text-[0.65rem] p-[0.4rem_0.25rem] min-h-[48px]'} ${!isCompact && isCurrent ? 'bg-gradient-to-br from-[rgba(230,126,34,0.08)] to-[rgba(230,126,34,0.03)]' : !isCompact ? 'bg-gradient-to-br from-[rgba(52,152,219,0.08)] to-[rgba(52,152,219,0.03)]' : ''}`}>
        <strong style={{ color: ELEMENT_COLORS[nayinElement] }}>{gan_zhi?.name || 'N/A'}</strong>
      </div>

      {/* HR 3 */}
      <hr className="border-none h-[1px] w-full m-0 relative row-start-8" style={{ background: `linear-gradient(90deg, transparent 0%, ${isCurrent ? 'rgba(230,126,34,0.3)' : 'rgba(52,152,219,0.25)'} 15%, ${isCurrent ? 'rgba(230,126,34,0.3)' : 'rgba(52,152,219,0.25)'} 85%, transparent 100%)` }} />

      {/* 12 Phrase */}
      <div className={`lifecycle-separator flex items-center justify-center row-start-9 ${isCompact ? 'text-[0.50rem] font-bold text-[#8e44ad] min-h-[38px] p-[0.3rem_0.15rem] leading-[1.1] m-0' : 'p-[0.4rem_0.25rem] min-h-[48px] bg-gradient-to-br from-[rgba(142,68,173,0.05)] to-[rgba(142,68,173,0.02)]'}`}>
        <div className="text-[#8e44ad] font-extrabold uppercase tracking-[0.4px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]" style={{ fontSize: isCompact ? 'inherit' : '0.65rem' }}>
          {life_cycle || 'N/A'}
        </div>
      </div>

      {/* Combinations Row */}
      <div className={`hs-combo-row flex flex-col items-center justify-start relative overflow-y-auto overflow-x-hidden scrollbar-thin ${isCompact ? 'row-start-10 min-h-auto max-h-[200px] p-[0.35rem_0.15rem] gap-[0.2rem]' : 'row-start-10 p-[0.5rem_0.25rem] min-h-auto max-h-[200px] gap-[0.25rem] border-t-2'} ${!isCompact && isCurrent ? 'bg-gradient-to-br from-[rgba(230,126,34,0.1)] to-[rgba(230,126,34,0.05)] border-t-[rgba(230,126,34,0.25)]' : !isCompact ? 'bg-gradient-to-br from-[rgba(231,76,60,0.08)] to-[rgba(231,76,60,0.03)] border-t-[rgba(231,76,60,0.15)]' : ''}`}>
        {!isCompact && (
          <div className={`absolute top-0 left-[20%] right-[20%] h-[2px] ${isCurrent ? 'bg-gradient-to-r from-transparent via-[#e67e22] to-transparent' : 'bg-gradient-to-r from-transparent via-[#e74c3c] to-transparent'}`}></div>
        )}
        
        {hsLabel || branchLabels.length > 0 ? (
          <>
            {hsLabel && (
              <div className="hs-combo-label font-bold text-center uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-300 w-full block break-words" style={{ color: ELEMENT_COLORS[hsCombos[0].combo.element], fontSize: isCompact ? '0.46rem' : '0.62rem', lineHeight: isCompact ? '1.1' : '1.35', padding: isCompact ? '0.1rem 0.12rem' : '0.2rem 0.25rem' }} title={hsCombos.map(c => c.combo.name).join(', ')}>
                <i className="fas fa-link mr-[0.15rem] opacity-85" style={{ fontSize: isCompact ? '0.45rem' : '0.58rem' }}></i> {hsLabel}
              </div>
            )}
            {branchLabels.map((label, idx) => (
              <div key={idx} className={`branch-interaction-label font-semibold text-center uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all duration-300 w-full block break-words ${label.category === 'positive' ? 'border-t-0' : 'border-t-0 opacity-90'}`} style={{ color: label.element ? ELEMENT_COLORS[label.element] : label.category === 'negative' ? '#e74c3c' : '#27ae60', fontSize: isCompact ? '0.42rem' : '0.58rem', lineHeight: isCompact ? '1.05' : '1.3', padding: isCompact ? '0.1rem 0.12rem' : '0.2rem 0.25rem', letterSpacing: isCompact ? '0.1px' : '0.15px' }} title={label.tooltip}>
                {label.text}
              </div>
            ))}
          </>
        ) : (
          <div className="hs-combo-label empty text-[#bdc3c7] font-semibold">
            <span className="text-[1rem] opacity-50">-</span>
          </div>
        )}
      </div>

      {/* Period Label (for Current/Luck Pillars) */}
      {periodLabel && periodValue && (
        <div className={`text-center ${isCompact ? 'p-[0.3rem_0.15rem] mt-[0.2rem]' : 'p-[0.5rem] bg-[rgba(0,0,0,0.03)] rounded-[8px] mt-[0.5rem]'}`}>
          <div className="font-bold text-[#666]" style={{ fontSize: isCompact ? '0.45rem' : '0.85rem' }}>{periodLabel}</div>
          <div className="font-bold text-[#333]" style={{ fontSize: isCompact ? '0.52rem' : '1rem', marginTop: isCompact ? '0.1rem' : '0.2rem' }}>{periodValue}</div>
        </div>
      )}
    </div>
  );
}
