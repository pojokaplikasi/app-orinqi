import { 
    HEAVENLY_STEMS, 
    EARTHLY_BRANCHES, 
    GANZHI_COMBINATIONS,
    STEM_NAME_TO_PINYIN,
    BRANCH_NAME_TO_PINYIN,
    NAYIN_TABLE,
    NAYIN_CLASSIC_NAMES,
    LIFECYCLE_TABLE,
    LIFE_CYCLES_ENGLISH,
    LIFE_CYCLES_PINYIN
} from './constants';
import { getHiddenStemsWithTenGods, getHiddenStems } from './element-analysis';

export function stemToPinyin(englishName: string): string {
    return STEM_NAME_TO_PINYIN[englishName] || englishName;
}

export function branchToPinyin(englishName: string): string {
    return BRANCH_NAME_TO_PINYIN[englishName] || englishName;
}

export function getNayinElement(nayinName: string): string {
    if (!nayinName || nayinName === "N/A") return "";
    const lowerName = nayinName.toLowerCase();
    if (lowerName.includes("metal")) return "Metal";
    if (lowerName.includes("wood")) return "Wood";
    if (lowerName.includes("water")) return "Water";
    if (lowerName.includes("fire")) return "Fire";
    if (lowerName.includes("earth")) return "Earth";
    return "";
}

export function getNayinFromStemBranch(stemName: string, branchName: string): string {
    const pinyinStem = stemToPinyin(stemName);
    const pinyinBranch = branchToPinyin(branchName);
    const key = `${pinyinStem}-${pinyinBranch}`;
    return NAYIN_TABLE[key] || "N/A";
}

export function getLifeCycleIndex(stemName: string, branchName: string): number {
    const pinyinStem = stemToPinyin(stemName);
    const pinyinBranch = branchToPinyin(branchName);
    if (!LIFECYCLE_TABLE[pinyinStem]) {
        return -1;
    }
    const index = LIFECYCLE_TABLE[pinyinStem][pinyinBranch];
    return index !== undefined ? index : -1;
}

export function formatLifeCycleName(stemName: string, branchName: string, style: 'classic' | 'modern' = 'modern'): string {
    if (!stemName || !branchName) return "";
    const index = getLifeCycleIndex(stemName, branchName);
    if (index < 0) return "";
    return style === 'classic' ? LIFE_CYCLES_PINYIN[index] : LIFE_CYCLES_ENGLISH[index];
}

export function formatNayinName(name: string, style: 'classic' | 'modern' = 'modern'): string {
    if (!name || name === "N/A" || name === "Not Active") return name || "N/A";
    return style === 'classic' ? (NAYIN_CLASSIC_NAMES[name] || name) : name;
}

export function calculateCurrentYearPillar(currentDate: Date, fourPillarsData: any) {
    let year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    
    if (month < 2 || (month === 2 && day < 4)) {
        year -= 1;
    }
    
    const yearOffset = year - 1984;
    const yearStemIndex = (yearOffset % 10 + 10) % 10;
    const yearBranchIndex = (yearOffset % 12 + 12) % 12;
    
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => 
        s.name === fourPillarsData.day_pillar.heavenly_stem.name
    );
    
    return {
        year: year,
        heavenly_stem: {
            name: HEAVENLY_STEMS[yearStemIndex].name,
            character: HEAVENLY_STEMS[yearStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[yearBranchIndex].name,
            character: EARTHLY_BRANCHES[yearBranchIndex].character
        },
        hidden_stems: getHiddenStemsWithTenGods(yearBranchIndex, dayMasterIndex),
        gan_zhi: GANZHI_COMBINATIONS[(yearStemIndex * 6 + Math.floor(yearBranchIndex / 2)) % 60],
        life_cycle: formatLifeCycleName(HEAVENLY_STEMS[yearStemIndex].name, EARTHLY_BRANCHES[yearBranchIndex].name)
    };
}

export function calculateCurrentMonthPillar(currentDate: Date, fourPillarsData: any) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    
    let chineseMonth;
    if (month === 1) chineseMonth = 12;
    else if (month === 2) chineseMonth = day < 4 ? 12 : 1;
    else if (month === 3) chineseMonth = day < 6 ? 1 : 2;
    else if (month === 4) chineseMonth = day < 5 ? 2 : 3;
    else if (month === 5) chineseMonth = day < 6 ? 3 : 4;
    else if (month === 6) chineseMonth = day < 6 ? 4 : 5;
    else if (month === 7) chineseMonth = day < 7 ? 5 : 6;
    else if (month === 8) chineseMonth = day < 8 ? 6 : 7;
    else if (month === 9) chineseMonth = day < 8 ? 7 : 8;
    else if (month === 10) chineseMonth = day < 8 ? 8 : 9;
    else if (month === 11) chineseMonth = day < 7 ? 9 : 10;
    else chineseMonth = day < 7 ? 10 : 11;
    
    let currentYear = year;
    if (month < 2 || (month === 2 && day < 4)) {
        currentYear -= 1;
    }
    
    const yearOffset = currentYear - 1984;
    const yearStemIndex = (yearOffset % 10 + 10) % 10;
    const yearStemType = yearStemIndex % 5;
    const monthStemStarts = [2, 4, 6, 8, 0];
    const monthStemBase = monthStemStarts[yearStemType];
    
    const monthStemIndex = (monthStemBase + chineseMonth - 1) % 10;
    const monthBranchIndex = (chineseMonth + 1) % 12;
    
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => 
        s.name === fourPillarsData.day_pillar.heavenly_stem.name
    );
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    return {
        month: month,
        month_english: monthNames[month - 1],
        heavenly_stem: {
            name: HEAVENLY_STEMS[monthStemIndex].name,
            character: HEAVENLY_STEMS[monthStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[monthBranchIndex].name,
            character: EARTHLY_BRANCHES[monthBranchIndex].character
        },
        hidden_stems: getHiddenStemsWithTenGods(monthBranchIndex, dayMasterIndex),
        gan_zhi: GANZHI_COMBINATIONS[(monthStemIndex * 6 + Math.floor(monthBranchIndex / 2)) % 60],
        life_cycle: formatLifeCycleName(HEAVENLY_STEMS[monthStemIndex].name, EARTHLY_BRANCHES[monthBranchIndex].name)
    };
}

export function calculateCurrentDayPillar(currentDate: Date, fourPillarsData: any) {
    let dayForCalculation = new Date(currentDate);
    if (currentDate.getHours() >= 23) {
        dayForCalculation.setDate(dayForCalculation.getDate() + 1);
    }
    
    const refDate = new Date(1900, 0, 1);
    const daysSinceRef = Math.floor((dayForCalculation.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const oct20_1987 = new Date(1987, 9, 20);
    const daysToOct1987 = Math.floor((oct20_1987.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const targetStem = 8;
    const targetBranch = 2;
    const refStem = (targetStem - (daysToOct1987 % 10) + 10) % 10;
    const refBranch = (targetBranch - (daysToOct1987 % 12) + 12) % 12;
    
    const dayStemIndex = (refStem + (daysSinceRef % 10) + 10) % 10;
    const dayBranchIndex = (refBranch + (daysSinceRef % 12) + 12) % 12;
    
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => 
        s.name === fourPillarsData.day_pillar.heavenly_stem.name
    );
    
    return {
        day: dayForCalculation.getDate(),
        heavenly_stem: {
            name: HEAVENLY_STEMS[dayStemIndex].name,
            character: HEAVENLY_STEMS[dayStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[dayBranchIndex].name,
            character: EARTHLY_BRANCHES[dayBranchIndex].character
        },
        hidden_stems: getHiddenStemsWithTenGods(dayBranchIndex, dayMasterIndex),
        gan_zhi: GANZHI_COMBINATIONS[(dayStemIndex * 6 + Math.floor(dayBranchIndex / 2)) % 60],
        life_cycle: formatLifeCycleName(HEAVENLY_STEMS[dayStemIndex].name, EARTHLY_BRANCHES[dayBranchIndex].name)
    };
}

export function calculateCurrentLuckPillar(currentDate: Date, birthTimeData: any, fourPillarsData: any, luckPillarsData: any) {
    if (!birthTimeData) {
        return {
            heavenly_stem: { name: "N/A", character: "?"},
            earthly_branch: { name: "N/A", character: "?"},
            gan_zhi: { name: "Not Active", element_name: ""},
            life_cycle: "N/A"
        };
    }
    
    const birthDate = new Date(birthTimeData.dateTime);
    const currentAge = currentDate.getFullYear() - birthDate.getFullYear();
    
    const firstLuckPillar = luckPillarsData.luck_pillars[0];
    const baseAge = firstLuckPillar.year_start - birthDate.getFullYear();
    const luckPillarIndex = Math.floor((currentAge - baseAge) / 10);
    
    if (luckPillarIndex >= 0 && luckPillarIndex < luckPillarsData.luck_pillars.length) {
        const activeLuckPillar = luckPillarsData.luck_pillars[luckPillarIndex];
        const nayinName = getNayinFromStemBranch(activeLuckPillar.heavenly_stem.name, activeLuckPillar.earthly_branch.name);
        const phrase12 = formatLifeCycleName(activeLuckPillar.heavenly_stem.name, activeLuckPillar.earthly_branch.name);
        
        const branchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === activeLuckPillar.earthly_branch.name);
        
        return {
            heavenly_stem: activeLuckPillar.heavenly_stem,
            earthly_branch: activeLuckPillar.earthly_branch,
            hidden_stems: activeLuckPillar.hidden_stems || getHiddenStems(branchIndex),
            gan_zhi: { name: nayinName, element_name: "" },
            life_cycle: phrase12,
            luck_period: `${activeLuckPillar.year_start}-${activeLuckPillar.year_end}`
        };
    }
    
    return {
        heavenly_stem: { name: "N/A", character: "?"},
        earthly_branch: { name: "N/A", character: "?"},
        gan_zhi: { name: "Not Active", element_name: ""},
        life_cycle: "N/A"
    };
}
