import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants';

export function calculateLuckyStars(fourPillars: any, currentPillars: any) {
    const dayMasterName = fourPillars.day_pillar.heavenly_stem.name;
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => s.name === dayMasterName);
    
    const traditionalStems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    const dayMaster = traditionalStems[dayMasterIndex];
    
    const yearBranchEnglish = fourPillars.year_pillar.earthly_branch.name;
    const dayBranchEnglish = fourPillars.day_pillar.earthly_branch.name;
    const monthBranchEnglish = fourPillars.month_pillar.earthly_branch.name;
    
    const branchNameMap: Record<string, string> = {
        'Rat': 'Zi', 'Ox': 'Chou', 'Tiger': 'Yin', 'Rabbit': 'Mao',
        'Dragon': 'Chen', 'Snake': 'Si', 'Horse': 'Wu', 'Goat': 'Wei',
        'Monkey': 'Shen', 'Rooster': 'You', 'Dog': 'Xu', 'Pig': 'Hai'
    };
    
    const yearBranch = branchNameMap[yearBranchEnglish] || yearBranchEnglish;
    const dayBranch = branchNameMap[dayBranchEnglish] || dayBranchEnglish;
    const monthBranch = branchNameMap[monthBranchEnglish] || monthBranchEnglish;
    
    const stars = {
        nobleman: [] as string[],
        intelligence: '',
        peachBlossom: '',
        skyHorse: '',
        solitary: '',
        heavenlyDoctor: '',
        kongwang: [] as string[]
    };
    
    // 1. Nobleman Star (Tian Yi Gui Ren)
    const noblemanMap: Record<string, string[]> = {
        'Jia': ['Chou', 'Wei'], 'Yi': ['Zi', 'Shen'],
        'Bing': ['Hai', 'You'], 'Ding': ['Hai', 'You'],
        'Wu': ['Chou', 'Wei'], 'Ji': ['Zi', 'Shen'],
        'Geng': ['Chou', 'Wei'], 'Xin': ['Yin', 'Wu'],
        'Ren': ['Mao', 'Si'], 'Gui': ['Mao', 'Si']
    };
    stars.nobleman = noblemanMap[dayMaster] || [];
    
    // 2. Intelligence Star (Wen Chang)
    const intelligenceMap: Record<string, string> = {
        'Jia': 'Si', 'Yi': 'Wu', 'Bing': 'Shen', 'Ding': 'You',
        'Wu': 'Shen', 'Ji': 'You', 'Geng': 'Hai', 'Xin': 'Zi',
        'Ren': 'Yin', 'Gui': 'Mao'
    };
    stars.intelligence = intelligenceMap[dayMaster] || '';
    
    // 3. Peach Blossom Star (Xian Chi)
    const peachBlossomMap: Record<string, string> = {
        'Shen': 'You', 'Zi': 'You', 'Chen': 'You',
        'Hai': 'Zi', 'Mao': 'Zi', 'Wei': 'Zi',
        'Yin': 'Mao', 'Wu': 'Mao', 'Xu': 'Mao',
        'Si': 'Wu', 'You': 'Wu', 'Chou': 'Wu'
    };
    stars.peachBlossom = peachBlossomMap[dayBranch] || '';
    
    // 4. Sky Horse Star (Yi Ma)
    const skyHorseMap: Record<string, string> = {
        'Shen': 'Yin', 'Zi': 'Yin', 'Chen': 'Yin',
        'Hai': 'Shen', 'Mao': 'Shen', 'Wei': 'Shen',
        'Yin': 'Shen', 'Wu': 'Shen', 'Xu': 'Shen',
        'Si': 'Hai', 'You': 'Hai', 'Chou': 'Hai'
    };
    stars.skyHorse = skyHorseMap[dayBranch] || '';
    
    // 5. Solitary Star (Gu Chen)
    const solitaryMap: Record<string, string> = {
        'Hai': 'Yin', 'Zi': 'Yin', 'Chou': 'Yin',
        'Yin': 'Si', 'Mao': 'Si', 'Chen': 'Si',
        'Si': 'Shen', 'Wu': 'Shen', 'Wei': 'Shen',
        'Shen': 'Hai', 'You': 'Hai', 'Xu': 'Hai'
    };
    stars.solitary = solitaryMap[dayBranch] || '';
    
    // 6. Heavenly Doctor Star (Tian Yi)
    const heavenlyDoctorMap: Record<string, string> = {
        'Zi': 'Wu', 'Chou': 'Wei', 'Yin': 'Shen', 'Mao': 'You',
        'Chen': 'Xu', 'Si': 'Hai', 'Wu': 'Zi', 'Wei': 'Chou',
        'Shen': 'Yin', 'You': 'Mao', 'Xu': 'Chen', 'Hai': 'Si'
    };
    stars.heavenlyDoctor = heavenlyDoctorMap[monthBranch] || '';
    
    // 7. Kong Wang (Dead Emptiness)
    const dayStemIndex = dayMasterIndex;
    const dayBranchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === dayBranchEnglish);
    
    const pillarIndex = (dayStemIndex * 6 - dayBranchIndex * 5 + 60) % 60;
    const xunNumber = Math.floor(pillarIndex / 10);
    
    const kongwangByXun = [
        ['Xu', 'Hai'],      // Xun 0: Jia Zi Xun
        ['Shen', 'You'],    // Xun 1: Jia Xu Xun
        ['Wu', 'Wei'],      // Xun 2: Jia Shen Xun
        ['Chen', 'Si'],     // Xun 3: Jia Wu Xun
        ['Yin', 'Mao'],     // Xun 4: Jia Chen Xun
        ['Zi', 'Chou']      // Xun 5: Jia Yin Xun
    ];
    
    stars.kongwang = kongwangByXun[xunNumber] || [];
    
    return stars;
}
