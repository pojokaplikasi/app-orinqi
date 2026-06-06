import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants';

// ============================================
// HEAVENLY STEM COMBINATIONS (合化)
// ============================================
export const HS_COMBINATIONS = [
    { stems: [0, 5], element: "Earth", name: "Jia-Ji Combine to Earth" },
    { stems: [1, 6], element: "Metal", name: "Yi-Geng Combine to Metal" },
    { stems: [2, 7], element: "Water", name: "Bing-Xin Combine to Water" },
    { stems: [3, 8], element: "Wood", name: "Ding-Ren Combine to Wood" },
    { stems: [4, 9], element: "Fire", name: "Wu-Gui Combine to Fire" }
];

// ============================================
// SAN HUI (三會) / SEASONAL UNION
// ============================================
export const SEASONAL_UNIONS = [
    { branches: [2, 3, 4], season: "Spring", element: "Wood", name: "Spring Wood Union", icon: "🌿" },
    { branches: [5, 6, 7], season: "Summer", element: "Fire", name: "Summer Fire Union", icon: "🔥" },
    { branches: [8, 9, 10], season: "Autumn", element: "Metal", name: "Autumn Metal Union", icon: "🌾" },
    { branches: [11, 0, 1], season: "Winter", element: "Water", name: "Winter Water Union", icon: "💧" }
];

// ============================================
// SAN HE (三合) / THREE HARMONIES
// ============================================
export const THREE_HARMONIES = [
    { branches: [8, 0, 4], element: "Water", name: "Water Harmony", icon: "💧" },
    { branches: [11, 3, 7], element: "Wood", name: "Wood Harmony", icon: "🌿" },
    { branches: [2, 6, 10], element: "Fire", name: "Fire Harmony", icon: "🔥" },
    { branches: [5, 9, 1], element: "Metal", name: "Metal Harmony", icon: "🌾" }
];

// ============================================
// BAN HE (半合) / HALF COMBINATION
// ============================================
export const HALF_COMBINATIONS = [
    { pair: [8, 0], element: "Water", name: "Water Half Combo", icon: "💧" },
    { pair: [0, 4], element: "Water", name: "Water Half Combo", icon: "💧" },
    { pair: [11, 3], element: "Wood", name: "Wood Half Combo", icon: "🌿" },
    { pair: [3, 7], element: "Wood", name: "Wood Half Combo", icon: "🌿" },
    { pair: [2, 6], element: "Fire", name: "Fire Half Combo", icon: "🔥" },
    { pair: [6, 10], element: "Fire", name: "Fire Half Combo", icon: "🔥" },
    { pair: [5, 9], element: "Metal", name: "Metal Half Combo", icon: "🌾" },
    { pair: [9, 1], element: "Metal", name: "Metal Half Combo", icon: "🌾" }
];

// ============================================
// LIU HE (六合) / SIX HARMONIES
// ============================================
export const SIX_HARMONIES = [
    { pair: [0, 1], element: "Earth", name: "Rat-Ox Harmony", icon: "🐀🐂" },
    { pair: [2, 11], element: "Wood", name: "Tiger-Pig Harmony", icon: "🐅🐖" },
    { pair: [3, 10], element: "Fire", name: "Rabbit-Dog Harmony", icon: "🐇🐕" },
    { pair: [4, 9], element: "Metal", name: "Dragon-Rooster Harmony", icon: "🐉🐔" },
    { pair: [5, 8], element: "Water", name: "Snake-Monkey Harmony", icon: "🐍🐒" },
    { pair: [6, 7], element: "Fire", name: "Horse-Goat Harmony", icon: "🐎🐐" }
];

// ============================================
// XING (刑) / PUNISHMENTS
// ============================================
export const UNGRATEFUL_PUNISHMENT = [{ branches: [2, 5, 8], name: "Ungrateful Punishment", icon: "⚠️" }];
export const ARROGANT_PUNISHMENT = [{ branches: [7, 10, 1], name: "Arrogant Punishment", icon: "⚠️" }];
export const RUDE_PUNISHMENT = [{ pair: [0, 3], name: "Rude Punishment", icon: "⚠️" }];
export const SELF_PUNISHMENT = [
    { branch: 4, name: "Self Punishment", icon: "⚠️" },
    { branch: 6, name: "Self Punishment", icon: "⚠️" },
    { branch: 9, name: "Self Punishment", icon: "⚠️" },
    { branch: 11, name: "Self Punishment", icon: "⚠️" }
];

// ============================================
// LIU CHONG (六冲) / SIX CLASHES
// ============================================
export const SIX_CLASHES = [
    { pair: [0, 6], name: "Rat-Horse Clash", icon: "💥" },
    { pair: [1, 7], name: "Ox-Goat Clash", icon: "💥" },
    { pair: [2, 8], name: "Tiger-Monkey Clash", icon: "💥" },
    { pair: [3, 9], name: "Rabbit-Rooster Clash", icon: "💥" },
    { pair: [4, 10], name: "Dragon-Dog Clash", icon: "💥" },
    { pair: [5, 11], name: "Snake-Pig Clash", icon: "💥" }
];

// ============================================
// XIANG PO (相破) / DESTRUCTION
// ============================================
export const DESTRUCTIONS = [
    { pair: [0, 9], name: "Rat-Rooster Break", icon: "💔" },
    { pair: [1, 4], name: "Ox-Dragon Break", icon: "💔" },
    { pair: [2, 11], name: "Tiger-Pig Break", icon: "💔" },
    { pair: [3, 6], name: "Rabbit-Horse Break", icon: "💔" },
    { pair: [5, 8], name: "Snake-Monkey Break", icon: "💔" },
    { pair: [7, 10], name: "Goat-Dog Break", icon: "💔" }
];

// ============================================
// XIANG HAI (相害) / SIX HARMS
// ============================================
export const SIX_HARMS = [
    { pair: [0, 7], name: "Rat-Goat Harm", icon: "☠️" },
    { pair: [1, 6], name: "Ox-Horse Harm", icon: "☠️" },
    { pair: [2, 5], name: "Tiger-Snake Harm", icon: "☠️" },
    { pair: [3, 4], name: "Rabbit-Dragon Harm", icon: "☠️" },
    { pair: [8, 11], name: "Monkey-Pig Harm", icon: "☠️" },
    { pair: [9, 10], name: "Rooster-Dog Harm", icon: "☠️" }
];

// ============================================
// AN HE (暗合) / HIDDEN COMBINATIONS
// ============================================
export const ANHE_PAIRS = [
    { pair: [2, 1], name: "Tiger-Ox Hidden", icon: "🔮" },
    { pair: [2, 7], name: "Tiger-Goat Hidden", icon: "🔮" },
    { pair: [0, 4], name: "Rat-Dragon Hidden", icon: "🔮" },
    { pair: [0, 10], name: "Rat-Dog Hidden", icon: "🔮" },
    { pair: [9, 5], name: "Rooster-Snake Hidden", icon: "🔮" },
    { pair: [3, 8], name: "Rabbit-Monkey Hidden", icon: "🔮" },
    { pair: [6, 11], name: "Horse-Pig Hidden", icon: "🔮" }
];

// Helper functions for checking combinations
export function canFormSeasonalUnion(branch1Index: number, branch2Index: number) {
    for (const union of SEASONAL_UNIONS) {
        if (union.branches.includes(branch1Index) && union.branches.includes(branch2Index)) {
            return union;
        }
    }
    return null;
}

export function canFormThreeHarmony(branch1Index: number, branch2Index: number) {
    for (const harmony of THREE_HARMONIES) {
        if (harmony.branches.includes(branch1Index) && harmony.branches.includes(branch2Index)) {
            return harmony;
        }
    }
    return null;
}

export function canFormHalfCombination(branch1Index: number, branch2Index: number) {
    for (const half of HALF_COMBINATIONS) {
        if ((half.pair[0] === branch1Index && half.pair[1] === branch2Index) ||
            (half.pair[1] === branch1Index && half.pair[0] === branch2Index)) {
            return half;
        }
    }
    return null;
}

export function canFormSixHarmony(branch1Index: number, branch2Index: number) {
    for (const harmony of SIX_HARMONIES) {
        if ((harmony.pair[0] === branch1Index && harmony.pair[1] === branch2Index) ||
            (harmony.pair[1] === branch1Index && harmony.pair[0] === branch2Index)) {
            return harmony;
        }
    }
    return null;
}

export function canFormUngratefulPunishment(branch1Index: number, branch2Index: number) {
    const branches = UNGRATEFUL_PUNISHMENT[0].branches;
    if (branches.includes(branch1Index) && branches.includes(branch2Index)) {
        return UNGRATEFUL_PUNISHMENT[0];
    }
    return null;
}

export function canFormArrogantPunishment(branch1Index: number, branch2Index: number) {
    const branches = ARROGANT_PUNISHMENT[0].branches;
    if (branches.includes(branch1Index) && branches.includes(branch2Index)) {
        return ARROGANT_PUNISHMENT[0];
    }
    return null;
}

export function canFormRudePunishment(branch1Index: number, branch2Index: number) {
    const pair = RUDE_PUNISHMENT[0].pair;
    if ((pair[0] === branch1Index && pair[1] === branch2Index) ||
        (pair[1] === branch1Index && pair[0] === branch2Index)) {
        return RUDE_PUNISHMENT[0];
    }
    return null;
}

export function canFormSelfPunishment(branch1Index: number, branch2Index: number) {
    if (branch1Index === branch2Index) {
        for (const punishment of SELF_PUNISHMENT) {
            if (punishment.branch === branch1Index) {
                return punishment;
            }
        }
    }
    return null;
}

export function canFormClash(branch1Index: number, branch2Index: number) {
    for (const clash of SIX_CLASHES) {
        if ((clash.pair[0] === branch1Index && clash.pair[1] === branch2Index) ||
            (clash.pair[1] === branch1Index && clash.pair[0] === branch2Index)) {
            return clash;
        }
    }
    return null;
}

export function canFormDestruction(branch1Index: number, branch2Index: number) {
    for (const destruction of DESTRUCTIONS) {
        if ((destruction.pair[0] === branch1Index && destruction.pair[1] === branch2Index) ||
            (destruction.pair[1] === branch1Index && destruction.pair[0] === branch2Index)) {
            return destruction;
        }
    }
    return null;
}

export function canFormHarm(branch1Index: number, branch2Index: number) {
    for (const harm of SIX_HARMS) {
        if ((harm.pair[0] === branch1Index && harm.pair[1] === branch2Index) ||
            (harm.pair[1] === branch1Index && harm.pair[0] === branch2Index)) {
            return harm;
        }
    }
    return null;
}

export function canFormAnhe(branch1Index: number, branch2Index: number) {
    for (const anhe of ANHE_PAIRS) {
        if ((anhe.pair[0] === branch1Index && anhe.pair[1] === branch2Index) ||
            (anhe.pair[1] === branch1Index && anhe.pair[0] === branch2Index)) {
            return anhe;
        }
    }
    return null;
}

export function getHSCombination(stem1Index: number, stem2Index: number) {
    for (const combo of HS_COMBINATIONS) {
        if ((combo.stems[0] === stem1Index && combo.stems[1] === stem2Index) ||
            (combo.stems[1] === stem1Index && combo.stems[0] === stem2Index)) {
            return combo;
        }
    }
    return null;
}

export function detectAllHSCombinations(fourPillars: any, currentPillars: any) {
    const allPillars = [
        { name: 'H', stem: fourPillars.hour_pillar?.heavenly_stem },
        { name: 'D', stem: fourPillars.day_pillar?.heavenly_stem },
        { name: 'M', stem: fourPillars.month_pillar?.heavenly_stem },
        { name: 'Y', stem: fourPillars.year_pillar?.heavenly_stem },
        { name: 'CL', stem: currentPillars.luck?.heavenly_stem },
        { name: 'CY', stem: currentPillars.year?.heavenly_stem },
        { name: 'CM', stem: currentPillars.month?.heavenly_stem },
        { name: 'CD', stem: currentPillars.day?.heavenly_stem }
    ].filter(p => p.stem); // Filter out undefined pillars
    
    const combinations: Record<string, any[]> = {};
    
    allPillars.forEach(p => {
        combinations[p.name] = [];
    });
    
    for (let i = 0; i < allPillars.length; i++) {
        for (let j = i + 1; j < allPillars.length; j++) {
            const pillar1 = allPillars[i];
            const pillar2 = allPillars[j];
            
            const stem1Index = HEAVENLY_STEMS.findIndex(s => s.name === pillar1.stem.name);
            const stem2Index = HEAVENLY_STEMS.findIndex(s => s.name === pillar2.stem.name);
            
            const combo = getHSCombination(stem1Index, stem2Index);
            if (combo) {
                combinations[pillar1.name].push({ partner: pillar2.name, combo: combo });
                combinations[pillar2.name].push({ partner: pillar1.name, combo: combo });
            }
        }
    }
    
    return combinations;
}

// ============================================
// DETECT LUCK PILLAR COMBINATIONS vs NATAL CHART ONLY
// ============================================
export function detectLuckPillarCombinations(luckPillar: any, fourPillars: any): { hsCombos: any[], branchInteractions: any[] } {
    const natalPillars = [
        { name: 'H', stem: fourPillars.hour_pillar?.heavenly_stem, branch: fourPillars.hour_pillar?.earthly_branch },
        { name: 'D', stem: fourPillars.day_pillar?.heavenly_stem, branch: fourPillars.day_pillar?.earthly_branch },
        { name: 'M', stem: fourPillars.month_pillar?.heavenly_stem, branch: fourPillars.month_pillar?.earthly_branch },
        { name: 'Y', stem: fourPillars.year_pillar?.heavenly_stem, branch: fourPillars.year_pillar?.earthly_branch },
    ].filter(p => p.stem && p.branch);

    const hsCombos: any[] = [];
    const branchInteractions: any[] = [];

    if (!luckPillar?.heavenly_stem || !luckPillar?.earthly_branch) {
        return { hsCombos, branchInteractions };
    }

    const luckStemIndex = HEAVENLY_STEMS.findIndex(s => s.name === luckPillar.heavenly_stem.name);
    const luckBranchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === luckPillar.earthly_branch.name);

    natalPillars.forEach(natal => {
        // HS Combinations
        const natalStemIndex = HEAVENLY_STEMS.findIndex(s => s.name === natal.stem.name);
        const combo = getHSCombination(luckStemIndex, natalStemIndex);
        if (combo) {
            hsCombos.push({ partner: natal.name, combo });
        }

        // Branch Interactions
        const natalBranchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === natal.branch.name);
        const checks = [
            { func: canFormSeasonalUnion, type: 'seasonal' },
            { func: canFormThreeHarmony, type: 'sanhe' },
            { func: canFormHalfCombination, type: 'banhe' },
            { func: canFormSixHarmony, type: 'liuhe' },
            { func: canFormAnhe, type: 'anhe' },
            { func: canFormUngratefulPunishment, type: 'ungrateful' },
            { func: canFormArrogantPunishment, type: 'arrogant' },
            { func: canFormRudePunishment, type: 'rude' },
            { func: canFormSelfPunishment, type: 'self' },
            { func: canFormClash, type: 'clash' },
            { func: canFormDestruction, type: 'destruction' },
            { func: canFormHarm, type: 'harm' }
        ];
        checks.forEach(check => {
            const result = check.func(luckBranchIndex, natalBranchIndex);
            if (result) {
                branchInteractions.push({ partner: natal.name, interaction: result, type: check.type });
            }
        });
    });

    return { hsCombos, branchInteractions };
}

export function detectAllBranchInteractions(fourPillars: any, currentPillars: any) {
    const allPillars = [
        { name: 'H', branch: fourPillars.hour_pillar?.earthly_branch },
        { name: 'D', branch: fourPillars.day_pillar?.earthly_branch },
        { name: 'M', branch: fourPillars.month_pillar?.earthly_branch },
        { name: 'Y', branch: fourPillars.year_pillar?.earthly_branch },
        { name: 'CL', branch: currentPillars.luck?.earthly_branch },
        { name: 'CY', branch: currentPillars.year?.earthly_branch },
        { name: 'CM', branch: currentPillars.month?.earthly_branch },
        { name: 'CD', branch: currentPillars.day?.earthly_branch }
    ].filter(p => p.branch);
    
    const interactions: Record<string, any[]> = {};
    
    allPillars.forEach(p => {
        interactions[p.name] = [];
    });
    
    for (let i = 0; i < allPillars.length; i++) {
        for (let j = i + 1; j < allPillars.length; j++) {
            const pillar1 = allPillars[i];
            const pillar2 = allPillars[j];
            
            const branch1Index = EARTHLY_BRANCHES.findIndex(b => b.name === pillar1.branch.name);
            const branch2Index = EARTHLY_BRANCHES.findIndex(b => b.name === pillar2.branch.name);
            
            const checks = [
                { func: canFormSeasonalUnion, type: 'seasonal' },
                { func: canFormThreeHarmony, type: 'sanhe' },
                { func: canFormHalfCombination, type: 'banhe' },
                { func: canFormSixHarmony, type: 'liuhe' },
                { func: canFormAnhe, type: 'anhe' },
                { func: canFormUngratefulPunishment, type: 'ungrateful' },
                { func: canFormArrogantPunishment, type: 'arrogant' },
                { func: canFormRudePunishment, type: 'rude' },
                { func: canFormSelfPunishment, type: 'self' },
                { func: canFormClash, type: 'clash' },
                { func: canFormDestruction, type: 'destruction' },
                { func: canFormHarm, type: 'harm' }
            ];
            
            checks.forEach(check => {
                const result = check.func(branch1Index, branch2Index);
                if (result) {
                    interactions[pillar1.name].push({ 
                        partner: pillar2.name, 
                        interaction: result,
                        type: check.type
                    });
                    interactions[pillar2.name].push({ 
                        partner: pillar1.name, 
                        interaction: result,
                        type: check.type
                    });
                }
            });
        }
    }
    
    return interactions;
}
