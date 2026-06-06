import React from 'react';

interface TenGodsProps {
  tenGodsData: any;
}

export default function TenGods({ tenGodsData }: TenGodsProps) {
  if (!tenGodsData) return null;

  const tenGodsPoints = tenGodsData.points;
  const tenGodsStems = tenGodsData.stems;

  const tenGodsChinese: Record<string, string> = {
    'Friend': 'Bi Jian 比肩',
    'Rob Wealth': 'Jie Cai 劫财',
    'Eating God': 'Shi Shen 食神',
    'Hurting Officer': 'Shang Guan 伤官',
    'Direct Wealth': 'Zheng Cai 正财',
    'Indirect Wealth': 'Pian Cai 偏财',
    'Direct Officer': 'Zheng Guan 正官',
    'Seven Killings': 'Qi Sha 七杀',
    'Direct Resource': 'Zheng Yin 正印',
    'Indirect Resource': 'Pian Yin 偏印'
  };

  // Sort 10 Gods by Natal points (descending)
  const sortedGods = Object.entries(tenGodsPoints.natal)
    .sort((a: any, b: any) => b[1] - a[1]);

  const totalNatal = Object.values(tenGodsPoints.natal).reduce((sum: any, p: any) => sum + p, 0) as number;
  const totalAnnual = Object.values(tenGodsPoints.annual).reduce((sum: any, p: any) => sum + p, 0) as number;

  return (
    <div className="col-md-4 pl-8">
      <h3 className="text-center mb-4 font-bold text-[#2c3e50] border-b-3 border-[#9b59b6] pb-2 text-[1.8rem]">10 GODS</h3>
      <div id="tenGodsContainer" className="mt-4 bg-[#f8f9fa] rounded-[10px] p-6">
        <div className="flex flex-col gap-2">
          {sortedGods.map(([godName, natalPoints]: [string, any]) => {
            const annualPoints = tenGodsPoints.annual[godName] || 0;
            const pinyinChinese = tenGodsChinese[godName] || '';
            
            const natalStemsArr = tenGodsStems.natal[godName] || [];
            const annualStemsArr = tenGodsStems.annual[godName] || [];
            
            const allStemsSet = new Set([...natalStemsArr, ...annualStemsArr]);
            const allStems = Array.from(allStemsSet).join(' ');
            
            const natalStems = natalStemsArr.length > 0 ? natalStemsArr.join(' ') : '';
            const annualStems = annualStemsArr.length > 0 ? annualStemsArr.join(' ') : '';
            
            const natalPercent = totalNatal > 0 ? ((natalPoints / totalNatal) * 100).toFixed(1) : '0.0';
            const annualPercent = totalAnnual > 0 ? ((annualPoints / totalAnnual) * 100).toFixed(1) : '0.0';

            return (
              <div key={godName} className="bg-white rounded-[8px] p-[14px_16px] flex justify-between items-center shadow-[0_2px_4px_rgba(0,0,0,0.08)] border-l-[4px] border-[#9b59b6]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-[3px]">
                    <span className="text-[1.2rem] font-bold text-[#9b59b6] min-w-[30px] text-center">{allStems}</span>
                    <span className="font-bold text-[#2c3e50] text-[0.95rem]">{godName}</span>
                  </div>
                  <div className="text-[0.85rem] text-[#7f8c8d] font-medium">
                    ({pinyinChinese})
                  </div>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="text-right min-w-[75px]">
                    <div className="text-[#95a5a6] text-[0.7rem] uppercase tracking-[0.5px] mb-[2px]">Natal</div>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-[0.9rem] text-[#9b59b6] font-semibold">{natalStems}</span>
                      <span className="text-[#e74c3c] font-bold text-[1rem]">{natalPercent}%</span>
                    </div>
                  </div>
                  <div className="text-right min-w-[75px]">
                    <div className="text-[#95a5a6] text-[0.7rem] uppercase tracking-[0.5px] mb-[2px]">Annual</div>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-[0.9rem] text-[#9b59b6] font-semibold">{annualStems}</span>
                      <span className="text-[#3498db] font-bold text-[1rem]">{annualPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
