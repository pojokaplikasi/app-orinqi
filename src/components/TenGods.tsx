import React from 'react';

interface TenGodsProps {
  tenGodsData: any;
}

export default function TenGods({ tenGodsData }: TenGodsProps) {
  if (!tenGodsData) return null;

  const tenGodsPoints = tenGodsData.points;
  const tenGodsStems = tenGodsData.stems;

  const tenGodsChinese: Record<string, string> = {
    'Friend': '比肩',
    'Rob Wealth': '劫财',
    'Eating God': '食神',
    'Hurting Officer': '伤官',
    'Direct Wealth': '正财',
    'Indirect Wealth': '偏财',
    'Direct Officer': '正官',
    'Seven Killings': '七杀',
    'Direct Resource': '正印',
    'Indirect Resource': '偏印'
  };

  const tenGodsColors: Record<string, string> = {
    'Friend': '#22C55E',
    'Rob Wealth': '#16A34A',
    'Eating God': '#EF4444',
    'Hurting Officer': '#DC2626',
    'Direct Wealth': '#F59E0B',
    'Indirect Wealth': '#D97706',
    'Direct Officer': '#94A3B8',
    'Seven Killings': '#64748B',
    'Direct Resource': '#3B82F6',
    'Indirect Resource': '#2563EB'
  };

  // Sort 10 Gods by Natal points (descending)
  const sortedGods = Object.entries(tenGodsPoints.natal)
    .sort((a: any, b: any) => b[1] - a[1]);

  const totalNatal = Object.values(tenGodsPoints.natal).reduce((sum: any, p: any) => sum + p, 0) as number;
  const totalAnnual = Object.values(tenGodsPoints.annual).reduce((sum: any, p: any) => sum + p, 0) as number;

  return (
    <div className="flex flex-col gap-4">
      {sortedGods.map(([godName, natalPoints]: [string, any]) => {
        const annualPoints = tenGodsPoints.annual[godName] || 0;
        const chineseChar = tenGodsChinese[godName] || '';
        const color = tenGodsColors[godName] || '#A855F7';
        
        const natalStemsArr = tenGodsStems.natal[godName] || [];
        const annualStemsArr = tenGodsStems.annual[godName] || [];
        
        const allStemsSet = new Set([...natalStemsArr, ...annualStemsArr]);
        const allStems = Array.from(allStemsSet).join(' ');
        
        const natalPercent = totalNatal > 0 ? ((natalPoints / totalNatal) * 100) : 0;
        const annualPercent = totalAnnual > 0 ? ((annualPoints / totalAnnual) * 100) : 0;

        // Only show gods that have some presence
        if (natalPercent === 0 && annualPercent === 0) return null;

        return (
          <div 
            key={godName} 
            className="bg-white rounded-[18px] p-[18px] flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#F1F5F9]"
          >
            <div 
              className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[18px] font-bold flex-shrink-0"
              style={{ 
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${color}20`,
                boxShadow: `0 4px 12px ${color}15`,
                color: color
              }}
            >
              {allStems || chineseChar[0]}
            </div>
            
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#18181B] text-[15px]">{godName}</span>
                <span className="text-[13px] text-[#71717A]">{chineseChar}</span>
              </div>
              
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#94A3B8]">Natal</span>
                  <span className="text-[13px] font-bold" style={{ color }}>{natalPercent.toFixed(1)}%</span>
                </div>
                <div className="w-[3px] h-[3px] rounded-full bg-[#E5E7EB]"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[#94A3B8]">Annual</span>
                  <span className="text-[13px] font-bold" style={{ color, opacity: 0.8 }}>{annualPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
