import React from 'react';

interface LuckyStarsProps {
  stars: any;
  mode?: 'classic' | 'modern';
}

export default function LuckyStars({ stars, mode = 'modern' }: LuckyStarsProps) {
  if (!stars) return null;

  const getBranchInfo = (branchTraditionalName: string) => {
    if (!branchTraditionalName) return { character: '', english: '' };
    
    const traditionalToEnglishMap: Record<string, string> = {
        'Zi': 'Rat', 'Chou': 'Ox', 'Yin': 'Tiger', 'Mao': 'Rabbit',
        'Chen': 'Dragon', 'Si': 'Snake', 'Wu': 'Horse', 'Wei': 'Goat',
        'Shen': 'Monkey', 'You': 'Rooster', 'Xu': 'Dog', 'Hai': 'Pig'
    };
    
    const englishName = traditionalToEnglishMap[branchTraditionalName] || branchTraditionalName;
    
    // Hardcode characters to avoid importing EARTHLY_BRANCHES
    const branchChars: Record<string, string> = {
      'Rat': '子', 'Ox': '丑', 'Tiger': '寅', 'Rabbit': '卯',
      'Dragon': '辰', 'Snake': '巳', 'Horse': '午', 'Goat': '未',
      'Monkey': '申', 'Rooster': '酉', 'Dog': '戌', 'Pig': '亥'
    };
    
    return { character: branchChars[englishName] || branchTraditionalName, english: englishName };
  };

  const icons = {
    nobleman: '👑',
    intelligence: '🎓',
    peachBlossom: '🌸',
    skyHorse: '🦄',
    solitary: '🌙',
    heavenlyDoctor: '⚕️'
  };

  const colors = {
    nobleman: '#28a745',
    intelligence: '#007bff',
    peachBlossom: '#e83e8c',
    skyHorse: '#fd7e14',
    solitary: '#9c27b0',
    heavenlyDoctor: '#20c997'
  };

  const noblemanBranches = stars.nobleman && stars.nobleman.length > 0 
    ? stars.nobleman.map((b: string) => {
        const info = getBranchInfo(b);
        return `${info.character} ${info.english}`;
      }).join(', ') 
    : 'None';

  const intelInfo = stars.intelligence ? getBranchInfo(stars.intelligence) : { character: '', english: '' };
  const peachInfo = stars.peachBlossom ? getBranchInfo(stars.peachBlossom) : { character: '', english: '' };
  const skyInfo = stars.skyHorse ? getBranchInfo(stars.skyHorse) : { character: '', english: '' };
  const solitaryInfo = stars.solitary ? getBranchInfo(stars.solitary) : { character: '', english: '' };
  const doctorInfo = stars.heavenlyDoctor ? getBranchInfo(stars.heavenlyDoctor) : { character: '', english: '' };

  const kongwangBranches = stars.kongwang && stars.kongwang.length > 0 
    ? stars.kongwang.map((kw: string) => {
        const kwInfo = getBranchInfo(kw);
        return kwInfo.character ? `${kwInfo.character} ${kwInfo.english}` : '';
      }).join(', ')
    : 'None';

  const kongwangLabel = mode === 'modern' ? 'DEAD EMPTINESS 空亡' : 'KONG WANG 空亡';

  return (
    <div className="col-md-3 pr-8">
      <h3 className="text-center mb-4 font-bold text-[#2c3e50] border-b-3 border-[#3498db] pb-2 text-[1.8rem]">Lucky Stars</h3>
      <div className="lucky-stars-table bg-[#f8f9fa] rounded-[10px] p-6 mt-4">
        <table className="w-full border-separate border-spacing-y-[10px]">
          <tbody>
            {/* Nobleman */}
            <tr>
              <td className="p-[14px_18px] bg-white rounded-l-[8px] font-semibold align-middle text-[1.05rem]" style={{ color: colors.nobleman }}>
                <span className="text-[1.5rem] mr-[10px]">{icons.nobleman}</span>
                NOBLE PEOPLE 贵人
              </td>
              <td className="p-[14px_18px] bg-white rounded-r-[8px] font-bold text-[1.15rem] align-middle text-right" style={{ color: colors.nobleman }}>
                {noblemanBranches}
              </td>
            </tr>
            
            {/* Intelligence */}
            <tr>
              <td className="p-[14px_18px] bg-white rounded-l-[8px] font-semibold align-middle text-[1.05rem]" style={{ color: colors.intelligence }}>
                <span className="text-[1.5rem] mr-[10px]">{icons.intelligence}</span>
                INTELLIGENCE 文昌
              </td>
              <td className="p-[14px_18px] bg-white rounded-r-[8px] font-bold text-[1.15rem] align-middle text-right" style={{ color: colors.intelligence }}>
                {intelInfo.character ? `${intelInfo.character} ${intelInfo.english}` : 'None'}
              </td>
            </tr>

            {/* Peach Blossom */}
            <tr>
              <td className="p-[14px_18px] bg-white rounded-l-[8px] font-semibold align-middle text-[1.05rem]" style={{ color: colors.peachBlossom }}>
                <span className="text-[1.5rem] mr-[10px]">{icons.peachBlossom}</span>
                PEACH BLOSSOM 桃花
              </td>
              <td className="p-[14px_18px] bg-white rounded-r-[8px] font-bold text-[1.15rem] align-middle text-right" style={{ color: colors.peachBlossom }}>
                {peachInfo.character ? `${peachInfo.character} ${peachInfo.english}` : 'None'}
              </td>
            </tr>

            {/* Sky Horse */}
            <tr>
              <td className="p-[14px_18px] bg-white rounded-l-[8px] font-semibold align-middle text-[1.05rem]" style={{ color: colors.skyHorse }}>
                <span className="text-[1.5rem] mr-[10px]">{icons.skyHorse}</span>
                SKY HORSE 驛馬
              </td>
              <td className="p-[14px_18px] bg-white rounded-r-[8px] font-bold text-[1.15rem] align-middle text-right" style={{ color: colors.skyHorse }}>
                {skyInfo.character ? `${skyInfo.character} ${skyInfo.english}` : 'None'}
              </td>
            </tr>

            {/* Solitary */}
            <tr>
              <td className="p-[14px_18px] bg-white rounded-l-[8px] font-semibold align-middle text-[1.05rem]" style={{ color: colors.solitary }}>
                <span className="text-[1.5rem] mr-[10px]">{icons.solitary}</span>
                SOLITARY 孤辰
              </td>
              <td className="p-[14px_18px] bg-white rounded-r-[8px] font-bold text-[1.15rem] align-middle text-right" style={{ color: colors.solitary }}>
                {solitaryInfo.character ? `${solitaryInfo.character} ${solitaryInfo.english}` : 'None'}
              </td>
            </tr>

            {/* Heavenly Doctor */}
            <tr>
              <td className="p-[14px_18px] bg-white rounded-l-[8px] font-semibold align-middle text-[1.05rem]" style={{ color: colors.heavenlyDoctor }}>
                <span className="text-[1.5rem] mr-[10px]">{icons.heavenlyDoctor}</span>
                HEAVENLY DOCTOR 天医
              </td>
              <td className="p-[14px_18px] bg-white rounded-r-[8px] font-bold text-[1.15rem] align-middle text-right" style={{ color: colors.heavenlyDoctor }}>
                {doctorInfo.character ? `${doctorInfo.character} ${doctorInfo.english}` : 'None'}
              </td>
            </tr>

            {/* Kong Wang */}
            <tr>
              <td className="p-[14px_18px] bg-white rounded-l-[8px] font-semibold align-middle text-[1.05rem] text-[#9B59B6]">
                <span className="text-[1.5rem] mr-[10px]">☯️</span>
                {kongwangLabel}
              </td>
              <td className="p-[14px_18px] bg-white rounded-r-[8px] font-bold text-[1.15rem] align-middle text-right text-[#9B59B6]">
                {kongwangBranches}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
