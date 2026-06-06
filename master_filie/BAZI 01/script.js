const vietnameseTerms = {
    "Yang Wood": "Giáp", "Yin Wood": "Ất", "Yang Fire": "Bính", "Yin Fire": "Đinh",
    "Yang Earth": "Mậu", "Yin Earth": "Kỷ", "Yang Metal": "Canh", "Yin Metal": "Tân",
    "Yang Water": "Nhâm", "Yin Water": "Quý", "Rat": "Tý", "Ox": "Sửu", "Tiger": "Dần",
    "Rabbit": "Mão", "Dragon": "Thìn", "Snake": "Tỵ", "Horse": "Ngọ", "Goat": "Mùi",
    "Monkey": "Thân", "Rooster": "Dậu", "Dog": "Tuất", "Pig": "Hợi",

    // GanZhi Translations
    "Sea metal": "Hải Trung Kim",
    "Furnace fire": "Lò Trung Hỏa",
    "Forest wood": "Đại Lâm Mộc",
    "Road earth": "Lộ Bàng Thổ",
    "Sword metal": "Kiếm Phong Kim",
    "Volcanic fire": "Sơn Đầu Hỏa",
    "Cave water": "Giản Hạ Thủy",
    "Fortress earth": "Thành Đầu Thổ",
    "Wax metal": "Bạch Lạp Kim",
    "Willow wood": "Dương Liễu Mộc",
    "Stream water": "Tuyền Trung Thủy",
    "Roof tiles earth": "Ốc Thượng Thổ",
    "Lightning fire": "Tích Lịch Hỏa",
    "Conifer wood": "Tùng Bách Mộc",
    "River water": "Trường Lưu Thủy",
    "Sand metal": "Sa Trung Kim",
    "Forest fire": "Sơn Hạ Hỏa",
    "Meadow wood": "Bình Địa Mộc",
    "Adobe earth": "Bích Thượng Thổ",
    "Precious metal": "Kim Bạch Kim",
    "Lamp fire": "Phúc Đăng Hỏa",
    "Sky water": "Thiên Hà Thủy",
    "Highway earth": "Đại Trạch Thổ",
    "Jewellery metal": "Thoa Xuyến Kim",
    "Mulberry wood": "Tang Đố Mộc",
    "Rapids water": "Đại Khê Thủy",
    "Desert earth": "Sa Trung Thổ",
    "Sun fire": "Thiên Thượng Hỏa",
    "Pomegranate wood": "Thạch Lựu Mộc",
    "Ocean water": "Đại Hải Thủy",

    // LifeCycle Translations
    "Birth": "Sinh",
    "Bath": "Mộc Dục",
    "Youth": "Quan Đới",
    "Thriving": "Lâm Quan",
    "Prosperous": "Đế Vượng",
    "Weakening": "Suy",
    "Sick": "Bệnh",
    "Death": "Tử",
    "Grave": "Mộ",
    "Extinction": "Tuyệt",
    "Conceived": "Thai",
    "Nourishing": "Dưỡng",

};

// Global variable for combination style (classic or modern)
let combinationStyle = 'modern'; // Default to modern

const LIFE_CYCLE_CLASSIC_NAMES = [
    "Chang Sheng", "Mu Yu", "Guan Dai", "Lin Guan",
    "Di Wang", "Shuai", "Bing", "Si",
    "Mu", "Jue", "Tai", "Yang"
];

const LIFE_CYCLE_MODERN_NAMES = [
    "Birth", "Bath", "Youth", "Thriving",
    "Prosperous", "Weakening", "Sick", "Death",
    "Grave", "Extinction", "Conceived", "Nourishing"
];

const LIFE_CYCLE_NAME_TO_INDEX = {
    "Birth": 0, "Chang Sheng": 0,
    "Bath": 1, "Mu Yu": 1,
    "Youth": 2, "Guan Dai": 2,
    "Thriving": 3, "Prosperity": 3, "Lin Guan": 3,
    "Prosperous": 4, "Peak": 4, "Di Wang": 4,
    "Weakening": 5, "Shuai": 5,
    "Sick": 6, "Sickness": 6, "Bing": 6,
    "Death": 7, "Si": 7,
    "Grave": 8, "Tomb": 8, "Mu": 8,
    "Extinction": 9, "Jue": 9,
    "Conceived": 10, "Conception": 10, "Tai": 10,
    "Nourishing": 11, "Nurturing": 11, "Yang": 11
};

const NAYIN_TABLE = {
    "Jia-Zi": "Sea metal", "Yi-Chou": "Sea metal",
    "Bing-Yin": "Furnace fire", "Ding-Mao": "Furnace fire",
    "Wu-Chen": "Forest wood", "Ji-Si": "Forest wood",
    "Geng-Wu": "Road earth", "Xin-Wei": "Road earth",
    "Ren-Shen": "Sword metal", "Gui-You": "Sword metal",
    "Jia-Xu": "Volcanic fire", "Yi-Hai": "Volcanic fire",
    "Bing-Zi": "Cave water", "Ding-Chou": "Cave water",
    "Wu-Yin": "Fortress earth", "Ji-Mao": "Fortress earth",
    "Geng-Chen": "Wax metal", "Xin-Si": "Wax metal",
    "Ren-Wu": "Willow wood", "Gui-Wei": "Willow wood",
    "Jia-Shen": "Stream water", "Yi-You": "Stream water",
    "Bing-Xu": "Roof tiles earth", "Ding-Hai": "Roof tiles earth",
    "Wu-Zi": "Lightning fire", "Ji-Chou": "Lightning fire",
    "Geng-Yin": "Conifer wood", "Xin-Mao": "Conifer wood",
    "Ren-Chen": "River water", "Gui-Si": "River water",
    "Jia-Wu": "Sand metal", "Yi-Wei": "Sand metal",
    "Bing-Shen": "Forest fire", "Ding-You": "Forest fire",
    "Wu-Xu": "Meadow wood", "Ji-Hai": "Meadow wood",
    "Geng-Zi": "Adobe earth", "Xin-Chou": "Adobe earth",
    "Ren-Yin": "Precious metal", "Gui-Mao": "Precious metal",
    "Jia-Chen": "Lamp fire", "Yi-Si": "Lamp fire",
    "Bing-Wu": "Sky water", "Ding-Wei": "Sky water",
    "Wu-Shen": "Highway earth", "Ji-You": "Highway earth",
    "Geng-Xu": "Jewellery metal", "Xin-Hai": "Jewellery metal",
    "Ren-Zi": "Mulberry wood", "Gui-Chou": "Mulberry wood",
    "Jia-Yin": "Rapids water", "Yi-Mao": "Rapids water",
    "Bing-Chen": "Desert earth", "Ding-Si": "Desert earth",
    "Wu-Wu": "Sun fire", "Ji-Wei": "Sun fire",
    "Geng-Shen": "Pomegranate wood", "Xin-You": "Pomegranate wood",
    "Ren-Xu": "Ocean water", "Gui-Hai": "Ocean water"
};

const LIFECYCLE_TABLE = {
    "Jia": {
        "Hai": 0, "Zi": 1, "Chou": 2, "Yin": 3, "Mao": 4, "Chen": 5,
        "Si": 6, "Wu": 7, "Wei": 8, "Shen": 9, "You": 10, "Xu": 11
    },
    "Yi": {
        "Wu": 0, "Si": 1, "Chen": 2, "Mao": 3, "Yin": 4, "Chou": 5,
        "Zi": 6, "Hai": 7, "Xu": 8, "You": 9, "Shen": 10, "Wei": 11
    },
    "Bing": {
        "Yin": 0, "Mao": 1, "Chen": 2, "Si": 3, "Wu": 4, "Wei": 5,
        "Shen": 6, "You": 7, "Xu": 8, "Hai": 9, "Zi": 10, "Chou": 11
    },
    "Ding": {
        "You": 0, "Shen": 1, "Wei": 2, "Wu": 3, "Si": 4, "Chen": 5,
        "Mao": 6, "Yin": 7, "Chou": 8, "Zi": 9, "Hai": 10, "Xu": 11
    },
    "Wu": {
        "Yin": 0, "Mao": 1, "Chen": 2, "Si": 3, "Wu": 4, "Wei": 5,
        "Shen": 6, "You": 7, "Xu": 8, "Hai": 9, "Zi": 10, "Chou": 11
    },
    "Ji": {
        "You": 0, "Shen": 1, "Wei": 2, "Wu": 3, "Si": 4, "Chen": 5,
        "Mao": 6, "Yin": 7, "Chou": 8, "Zi": 9, "Hai": 10, "Xu": 11
    },
    "Geng": {
        "Si": 0, "Wu": 1, "Wei": 2, "Shen": 3, "You": 4, "Xu": 5,
        "Hai": 6, "Zi": 7, "Chou": 8, "Yin": 9, "Mao": 10, "Chen": 11
    },
    "Xin": {
        "Zi": 0, "Hai": 1, "Xu": 2, "You": 3, "Shen": 4, "Wei": 5,
        "Wu": 6, "Si": 7, "Chen": 8, "Mao": 9, "Yin": 10, "Chou": 11
    },
    "Ren": {
        "Shen": 0, "You": 1, "Xu": 2, "Hai": 3, "Zi": 4, "Chou": 5,
        "Yin": 6, "Mao": 7, "Chen": 8, "Si": 9, "Wu": 10, "Wei": 11
    },
    "Gui": {
        "Mao": 0, "Yin": 1, "Chou": 2, "Zi": 3, "Hai": 4, "Xu": 5,
        "You": 6, "Shen": 7, "Wei": 8, "Wu": 9, "Si": 10, "Chen": 11
    }
};

// Map English stem names to Pinyin names for lookup tables
const STEM_NAME_TO_PINYIN = {
    "Yang Wood": "Jia", "Yin Wood": "Yi",
    "Yang Fire": "Bing", "Yin Fire": "Ding",
    "Yang Earth": "Wu", "Yin Earth": "Ji",
    "Yang Metal": "Geng", "Yin Metal": "Xin",
    "Yang Water": "Ren", "Yin Water": "Gui"
};

// Map English branch names to Pinyin names for lookup tables
const BRANCH_NAME_TO_PINYIN = {
    "Rat": "Zi", "Ox": "Chou", "Tiger": "Yin", "Rabbit": "Mao",
    "Dragon": "Chen", "Snake": "Si", "Horse": "Wu", "Goat": "Wei",
    "Monkey": "Shen", "Rooster": "You", "Dog": "Xu", "Pig": "Hai"
};

function stemToPinyin(englishName) {
    return STEM_NAME_TO_PINYIN[englishName] || englishName;
}

function branchToPinyin(englishName) {
    return BRANCH_NAME_TO_PINYIN[englishName] || englishName;
}

// Helper function to extract element from Nayin name
function getNayinElement(nayinName) {
    if (!nayinName || nayinName === "N/A") return "";
    const lowerName = nayinName.toLowerCase();
    if (lowerName.includes("metal")) return "Metal";
    if (lowerName.includes("wood")) return "Wood";
    if (lowerName.includes("water")) return "Water";
    if (lowerName.includes("fire")) return "Fire";
    if (lowerName.includes("earth")) return "Earth";
    return "";
}

function getNayinFromStemBranch(stemName, branchName) {
    const pinyinStem = stemToPinyin(stemName);
    const pinyinBranch = branchToPinyin(branchName);
    const key = `${pinyinStem}-${pinyinBranch}`;
    const result = NAYIN_TABLE[key] || "N/A";
    console.log(`Nayin lookup: ${stemName} + ${branchName} -> ${pinyinStem}-${pinyinBranch} -> ${result}`);
    return result;
}

function getLifeCycleIndex(stemName, branchName) {
    const pinyinStem = stemToPinyin(stemName);
    const pinyinBranch = branchToPinyin(branchName);
    if (!LIFECYCLE_TABLE[pinyinStem]) {
        console.warn(`LifeCycle: Unknown stem ${stemName} (${pinyinStem})`);
        return -1;
    }
    const index = LIFECYCLE_TABLE[pinyinStem][pinyinBranch];
    console.log(`LifeCycle lookup: ${stemName} + ${branchName} -> ${pinyinStem}-${pinyinBranch} -> index ${index}`);
    return index !== undefined ? index : -1;
}

const NAYIN_CLASSIC_NAMES = {
    "Sea metal": "Hai Zhong Jin",
    "Furnace fire": "Lu Zhong Huo",
    "Forest wood": "Da Lin Mu",
    "Road earth": "Lu Pang Tu",
    "Sword metal": "Jian Feng Jin",
    "Volcanic fire": "Shan Tou Huo",
    "Cave water": "Jian Xia Shui",
    "Fortress earth": "Cheng Tou Tu",
    "Wax metal": "Bai La Jin",
    "Willow wood": "Yang Liu Mu",
    "Stream water": "Quan Zhong Shui",
    "Roof tiles earth": "Wu Shang Tu",
    "Lightning fire": "Pi Li Huo",
    "Conifer wood": "Song Bai Mu",
    "River water": "Chang Liu Shui",
    "Sand metal": "Sha Zhong Jin",
    "Forest fire": "Shan Xia Huo",
    "Meadow wood": "Ping Di Mu",
    "Adobe earth": "Bi Shang Tu",
    "Precious metal": "Jin Bo Jin",
    "Lamp fire": "Fu Deng Huo",
    "Sky water": "Tian He Shui",
    "Highway earth": "Da Yi Tu",
    "Jewellery metal": "Chai Chuan Jin",
    "Mulberry wood": "Sang Zhe Mu",
    "Rapids water": "Da Xi Shui",
    "Desert earth": "Sha Zhong Tu",
    "Sun fire": "Tian Shang Huo",
    "Pomegranate wood": "Shi Liu Mu",
    "Ocean water": "Da Hai Shui"
};

function formatLifeCycleName(stemName, branchName) {
    if (!stemName || !branchName) return "";
    const index = getLifeCycleIndex(stemName, branchName);
    if (index < 0) return "";
    return combinationStyle === 'classic'
        ? LIFE_CYCLE_CLASSIC_NAMES[index]
        : LIFE_CYCLE_MODERN_NAMES[index];
}

function formatNayinName(name) {
    if (!name || name === "N/A" || name === "Not Active") return name || "N/A";
    return combinationStyle === 'classic' ? (NAYIN_CLASSIC_NAMES[name] || name) : name;
}

const languageStrings = {
    English: {
        pageTitle: "Bazi Calculator",
        mainHeading: "Bazi Calculator",
        dateTimeLabel: "Date and Time:",
        locationLabel: "Timezone:",
        fourPillarsHeading: "Natal Chart & Current Transiting Pillars (Read Right to Left):",
        luckPillarsHeading: "10-Year Luck Pillars (Right to Left):",
        yearPillarsHeading: "Year Pillars:",
        monthPillarsHeading: "Month Pillars:",
        dayPillarsHeading: "Day Pillars:",
        hourPillarsHeading: "Hour Pillars:",
        YearPillar: "Year Pillar (年柱)",
        MonthPillar: "Month Pillar (月柱)",
        DayPillar: "Day Pillar (日柱)",
        HourPillar: "Hour Pillar (時柱)",
        CurrentMonthPillar: "Current Month",
        CurrentDayPillar: "Current Day",
        CurrentYearPillar: "Current Year",
        CurrentLuckPillar: "Current Luck Cycle",
        calculateButton: "Calculate",
        genderLabel: "Gender:",
        femaleLabel: "Female",
        maleLabel: "Male",
        noTimezoneSelected: "Please select a timezone.",
        noGenderSelected: "Please select a gender.",
        noDateTimeSelected: "Please select a date and time.",
    }
};

const elementColors = {
    "Fire": "#f44336",    // A more vibrant red
    "Wood": "#4CAF50",    // A darker, richer green
    "Earth": "#bc8a60",   // A warmer brown with a hint of orange
    "Water": "#2196F3",    // A classic, slightly deeper blue
    "Metal": "#96a6ae",    // A darker, more legible gray
};

const branchAssociations = {
    "Tiger": "Wood", "Dần": "Wood",
    "Rabbit": "Wood", "Mão": "Wood",
    "Snake": "Fire", "Tỵ": "Fire",
    "Horse": "Fire", "Ngọ": "Fire",
    "Monkey": "Metal", "Thân": "Metal",
    "Rooster": "Metal", "Dậu": "Metal",
    "Pig": "Water", "Hợi": "Water",
    "Rat": "Water", "Tý": "Water",
    "Dragon": "Earth", "Thìn": "Earth",
    "Goat": "Earth", "Mùi": "Earth",
    "Dog": "Earth", "Tuất": "Earth",
    "Ox": "Earth", "Sửu": "Earth"
};

let currentLanguage = 'English';
let birthTimeData = null; // Store birth time for hierarchical calculations
let selectedPillars = {
    luck: null,          // Selected luck pillar index
    year: null,          // Selected year
    month: null,         // Selected month
    day: null,           // Selected day
    yearPillar: null,    // Selected Year Pillar object
    monthPillar: null,   // Selected Month Pillar object
    dayPillar: null      // Selected Day Pillar object
}; // Track selected pillars for drill-down interaction

// Reset all pillar selections to current time
function resetPillarSelection() {
    selectedPillars.luck = null;
    selectedPillars.year = null;
    selectedPillars.month = null;
    selectedPillars.day = null;
    selectedPillars.yearPillar = null;
    selectedPillars.monthPillar = null;
    selectedPillars.dayPillar = null;
    
    // Update all visual indicators
    updateLuckPillarSelection();
    updateYearPillarSelection();
    updateMonthPillarSelection();
    updateDayPillarSelection();
    
    // Refresh display with current time
    if (window.currentBaziData) {
        displayTimePeriodRows(window.currentBaziData.four_pillars, window.currentBaziData.luck_pillars);
        displayCurrentPillars(window.currentBaziData.four_pillars, window.currentBaziData.luck_pillars);
    }
    
    console.log('Reset to current time');
}
let currentExpandedLevel = null; // Track which level is currently expanded
let hsCombinations = {}; // Store Heavenly Stem combinations

// Hidden Stems mapping (same as backend)
const HIDDEN_STEMS_MAP = {
    "Rat": {main_qi: 9, sub_main_qi: null, residual_qi: null},  // 子: 癸
    "Ox": {main_qi: 5, sub_main_qi: 9, residual_qi: 7},  // 丑: 己(main), 癸(sub), 辛(res)
    "Tiger": {main_qi: 0, sub_main_qi: 2, residual_qi: 4},  // 寅: 甲(main), 丙(sub), 戊(res)
    "Rabbit": {main_qi: 1, sub_main_qi: null, residual_qi: null},  // 卯: 乙
    "Dragon": {main_qi: 4, sub_main_qi: 1, residual_qi: 9},  // 辰: 戊(main), 乙(sub), 癸(res)
    "Snake": {main_qi: 2, sub_main_qi: 4, residual_qi: 6},  // 巳: 丙(main), 戊(sub), 庚(res)
    "Horse": {main_qi: 3, sub_main_qi: 5, residual_qi: null},  // 午: 丁(main), 己(sub)
    "Goat": {main_qi: 5, sub_main_qi: 3, residual_qi: 1},  // 未: 己(main), 丁(sub), 乙(res)
    "Monkey": {main_qi: 6, sub_main_qi: 8, residual_qi: 4},  // 申: 庚(main), 壬(sub), 戊(res)
    "Rooster": {main_qi: 7, sub_main_qi: null, residual_qi: null},  // 酉: 辛
    "Dog": {main_qi: 4, sub_main_qi: 7, residual_qi: 3},  // 戌: 戊(main), 辛(sub), 丁(res)
    "Pig": {main_qi: 8, sub_main_qi: 0, residual_qi: null}  // 亥: 壬(main), 甲(sub)
};

// 10 Gods calculation function - Based on Wu Xing 5 Elements Theory
function getTenGodsRelationship(dayMasterIndex, stemIndex) {
    // Same element check
    const dayMasterElement = Math.floor(dayMasterIndex / 2);
    const stemElement = Math.floor(stemIndex / 2);
    const sameElement = (dayMasterElement === stemElement);
    
    // Same polarity check (both Yang or both Yin)
    const dayMasterPolarity = dayMasterIndex % 2;
    const stemPolarity = stemIndex % 2;
    const samePolarity = (dayMasterPolarity === stemPolarity);
    
    // Same element relationships (Companion)
    if (sameElement) {
        return samePolarity ? "F" : "RW";  // Friend : Rob Wealth
    }
    
    // Five Elements cycle: Wood(0) -> Fire(1) -> Earth(2) -> Metal(3) -> Water(4) -> Wood
    const produces = (dayMasterElement + 1) % 5 === stemElement;  // DM produces stem (Output)
    const controls = (dayMasterElement + 2) % 5 === stemElement;  // DM controls stem (Wealth)
    const controlledBy = (stemElement + 2) % 5 === dayMasterElement;  // DM controlled by stem (Officer/Power)
    const producedBy = (stemElement + 1) % 5 === dayMasterElement;  // DM produced by stem (Resource)
    
    if (produces) {
        return samePolarity ? "EG" : "HO";  // Eating God : Hurting Officer (Output)
    } else if (controls) {
        return samePolarity ? "IW" : "DW";  // Indirect Wealth : Direct Wealth (Wealth)
    } else if (controlledBy) {
        return samePolarity ? "7K" : "DO";  // 7 Killings : Direct Officer (Power)
    } else if (producedBy) {
        return samePolarity ? "IR" : "DR";  // Indirect Resource : Direct Resource (Resource)
    }
    
    return "--";  // Fallback
}

function getHiddenStemsWithTenGods(branchIndex, dayMasterIndex) {
    // Get hidden stems with 10 Gods relationships for an earthly branch
    const branchName = EARTHLY_BRANCHES[branchIndex].name;
    const hiddenData = HIDDEN_STEMS_MAP[branchName] || {};
    
    const result = {};
    
    if (hiddenData.main_qi !== null && hiddenData.main_qi !== undefined) {
        const idx = hiddenData.main_qi;
        result.main_qi = {
            name: HEAVENLY_STEMS[idx].name,
            character: HEAVENLY_STEMS[idx].character,
            element: HEAVENLY_STEMS[idx].element,
            ten_gods: getTenGodsRelationship(dayMasterIndex, idx)
        };
    } else {
        result.main_qi = null;
    }
    
    if (hiddenData.sub_main_qi !== null && hiddenData.sub_main_qi !== undefined) {
        const idx = hiddenData.sub_main_qi;
        result.sub_main_qi = {
            name: HEAVENLY_STEMS[idx].name,
            character: HEAVENLY_STEMS[idx].character,
            element: HEAVENLY_STEMS[idx].element,
            ten_gods: getTenGodsRelationship(dayMasterIndex, idx)
        };
    } else {
        result.sub_main_qi = null;
    }
    
    if (hiddenData.residual_qi !== null && hiddenData.residual_qi !== undefined) {
        const idx = hiddenData.residual_qi;
        result.residual_qi = {
            name: HEAVENLY_STEMS[idx].name,
            character: HEAVENLY_STEMS[idx].character,
            element: HEAVENLY_STEMS[idx].element,
            ten_gods: getTenGodsRelationship(dayMasterIndex, idx)
        };
    } else {
        result.residual_qi = null;
    }
    
    return result;
}

function getHiddenStems(branchIndex) {
    const branchName = EARTHLY_BRANCHES[branchIndex].name;
    const hiddenData = HIDDEN_STEMS_MAP[branchName] || {};
    
    const result = {};
    
    if (hiddenData.main_qi !== null && hiddenData.main_qi !== undefined) {
        const idx = hiddenData.main_qi;
        result.main_qi = {
            name: HEAVENLY_STEMS[idx].name,
            character: HEAVENLY_STEMS[idx].character,
            element: HEAVENLY_STEMS[idx].element
        };
    } else {
        result.main_qi = null;
    }
    
    if (hiddenData.sub_main_qi !== null && hiddenData.sub_main_qi !== undefined) {
        const idx = hiddenData.sub_main_qi;
        result.sub_main_qi = {
            name: HEAVENLY_STEMS[idx].name,
            character: HEAVENLY_STEMS[idx].character,
            element: HEAVENLY_STEMS[idx].element
        };
    } else {
        result.sub_main_qi = null;
    }
    
    if (hiddenData.residual_qi !== null && hiddenData.residual_qi !== undefined) {
        const idx = hiddenData.residual_qi;
        result.residual_qi = {
            name: HEAVENLY_STEMS[idx].name,
            character: HEAVENLY_STEMS[idx].character,
            element: HEAVENLY_STEMS[idx].element
        };
    } else {
        result.residual_qi = null;
    }
    
    return result;
}

// Set combination style (classic or modern)
function setCombinationStyle(style) {
    combinationStyle = style;
    
    // Update button states
    const classicBtn = document.getElementById('classicBtn');
    const modernBtn = document.getElementById('modernBtn');
    
    if (style === 'classic') {
        classicBtn.classList.add('active');
        modernBtn.classList.remove('active');
    } else {
        modernBtn.classList.add('active');
        classicBtn.classList.remove('active');
    }
    
    // Refresh display if data exists
    if (window.currentBaziData && window.currentBaziData.four_pillars) {
        displayFourPillars(window.currentBaziData.four_pillars);
        displayLuckPillars(window.currentBaziData.luck_pillars);
        displayCurrentPillars(window.currentBaziData.four_pillars, window.currentBaziData.luck_pillars);
        displayTimePeriodRows(window.currentBaziData.four_pillars, window.currentBaziData.luck_pillars);
        detectAndDisplayHSCombinations(window.currentBaziData.four_pillars, window.currentBaziData.luck_pillars);
    }
}

// Toggle Birth Time Field visibility based on checkbox
function toggleBirthTimeField() {
    const checkbox = document.getElementById('unknownBirthTime');
    const timeInput = document.getElementById('birthTime');
    const timeLabel = document.getElementById('birthTimeLabel');
    
    if (checkbox.checked) {
        // Disable and clear time input
        timeInput.disabled = true;
        timeInput.value = '';
        timeInput.style.opacity = '0.5';
        timeLabel.style.opacity = '0.5';
        console.log("Birth time field disabled - unknown birth time mode");
    } else {
        // Enable time input
        timeInput.disabled = false;
        timeInput.style.opacity = '1';
        timeLabel.style.opacity = '1';
        console.log("Birth time field enabled - normal mode");
    }
}

// Calculate Lucky Stars based on Day Master and Year/Day/Month Branches
function calculateLuckyStars(fourPillars, currentPillars) {
    // Get Day Master stem index to determine Jia/Yi/Bing/etc.
    const dayMasterName = fourPillars.day_pillar.heavenly_stem.name;
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => s.name === dayMasterName);
    
    // Convert index to traditional name (Jia, Yi, Bing, etc.)
    const traditionalStems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    const dayMaster = traditionalStems[dayMasterIndex];
    
    // Get branch names and convert to traditional Chinese names
    const yearBranchEnglish = fourPillars.year_pillar.earthly_branch.name;
    const dayBranchEnglish = fourPillars.day_pillar.earthly_branch.name;
    const monthBranchEnglish = fourPillars.month_pillar.earthly_branch.name;
    
    // Convert English branch names to traditional (Zi, Chou, Yin, etc.)
    const branchNameMap = {
        'Rat': 'Zi', 'Ox': 'Chou', 'Tiger': 'Yin', 'Rabbit': 'Mao',
        'Dragon': 'Chen', 'Snake': 'Si', 'Horse': 'Wu', 'Goat': 'Wei',
        'Monkey': 'Shen', 'Rooster': 'You', 'Dog': 'Xu', 'Pig': 'Hai'
    };
    
    // Convert back to English
    const traditionalToEnglishMap = {
        'Zi': 'Rat', 'Chou': 'Ox', 'Yin': 'Tiger', 'Mao': 'Rabbit',
        'Chen': 'Dragon', 'Si': 'Snake', 'Wu': 'Horse', 'Wei': 'Goat',
        'Shen': 'Monkey', 'You': 'Rooster', 'Xu': 'Dog', 'Hai': 'Pig'
    };
    
    const yearBranch = branchNameMap[yearBranchEnglish] || yearBranchEnglish;
    const dayBranch = branchNameMap[dayBranchEnglish] || dayBranchEnglish;
    const monthBranch = branchNameMap[monthBranchEnglish] || monthBranchEnglish;
    
    console.log("DEBUG - Calculating Lucky Stars:");
    console.log("Day Master (English):", dayMasterName);
    console.log("Day Master (Traditional):", dayMaster);
    console.log("Year Branch (English):", yearBranchEnglish, "→", yearBranch);
    console.log("Day Branch (English):", dayBranchEnglish, "→", dayBranch);
    console.log("Month Branch (English):", monthBranchEnglish, "→", monthBranch);
    
    const stars = {
        nobleman: [],
        intelligence: '',
        peachBlossom: '',
        skyHorse: '',
        solitary: '',
        heavenlyDoctor: '',
        kongwang: []  // Dead Emptiness / Kong Wang (空亡)
    };
    
    // 1. Nobleman Star (Tian Yi Gui Ren) - Based on Day Master
    const noblemanMap = {
        'Jia': ['Chou', 'Wei'], 'Yi': ['Zi', 'Shen'],
        'Bing': ['Hai', 'You'], 'Ding': ['Hai', 'You'],
        'Wu': ['Chou', 'Wei'], 'Ji': ['Zi', 'Shen'],
        'Geng': ['Chou', 'Wei'], 'Xin': ['Yin', 'Wu'],
        'Ren': ['Mao', 'Si'], 'Gui': ['Mao', 'Si']
    };
    stars.nobleman = noblemanMap[dayMaster] || [];
    
    // 2. Intelligence Star (Wen Chang) - Based on Day Master
    const intelligenceMap = {
        'Jia': 'Si', 'Yi': 'Wu', 'Bing': 'Shen', 'Ding': 'You',
        'Wu': 'Shen', 'Ji': 'You', 'Geng': 'Hai', 'Xin': 'Zi',
        'Ren': 'Yin', 'Gui': 'Mao'
    };
    stars.intelligence = intelligenceMap[dayMaster] || '';
    
    // 3. Peach Blossom Star (Xian Chi) - Based on Day Branch ONLY
    // Shen-Zi-Chen (Monkey-Rat-Dragon) → You (Rooster)
    // Hai-Mao-Wei (Pig-Rabbit-Goat) → Zi (Rat)
    // Yin-Wu-Xu (Tiger-Horse-Dog) → Mao (Rabbit)
    // Si-You-Chou (Snake-Rooster-Ox) → Wu (Horse)
    const peachBlossomMap = {
        'Shen': 'You', 'Zi': 'You', 'Chen': 'You',  // Monkey-Rat-Dragon → Rooster
        'Hai': 'Zi', 'Mao': 'Zi', 'Wei': 'Zi',      // Pig-Rabbit-Goat → Rat
        'Yin': 'Mao', 'Wu': 'Mao', 'Xu': 'Mao',     // Tiger-Horse-Dog → Rabbit
        'Si': 'Wu', 'You': 'Wu', 'Chou': 'Wu'       // Snake-Rooster-Ox → Horse
    };
    stars.peachBlossom = peachBlossomMap[dayBranch] || '';  // Day Branch ONLY
    
    // Debug Peach Blossom calculation
    console.log("DEBUG PEACH BLOSSOM:");
    console.log("  dayBranch:", dayBranch, "→ map:", peachBlossomMap[dayBranch]);
    console.log("  Result:", stars.peachBlossom);
    
    // 4. Sky Horse Star (Yi Ma) - Based on Day Branch ONLY
    // Shen-Zi-Chen (Monkey-Rat-Dragon) → Yin (Tiger)
    // Hai-Mao-Wei (Pig-Rabbit-Goat) → Shen (Monkey)
    // Yin-Wu-Xu (Tiger-Horse-Dog) → Shen (Monkey)
    // Si-You-Chou (Snake-Rooster-Ox) → Hai (Pig)
    const skyHorseMap = {
        'Shen': 'Yin', 'Zi': 'Yin', 'Chen': 'Yin',  // Monkey-Rat-Dragon → Tiger
        'Hai': 'Shen', 'Mao': 'Shen', 'Wei': 'Shen', // Pig-Rabbit-Goat → Monkey
        'Yin': 'Shen', 'Wu': 'Shen', 'Xu': 'Shen',   // Tiger-Horse-Dog → Monkey
        'Si': 'Hai', 'You': 'Hai', 'Chou': 'Hai'     // Snake-Rooster-Ox → Pig
    };
    stars.skyHorse = skyHorseMap[dayBranch] || '';  // Day Branch ONLY
    
    // 5. Solitary Star (Gu Chen) - Based on Day Branch ONLY
    // Hai-Zi-Chou (North/Water) → Yin (Tiger)
    // Yin-Mao-Chen (East/Wood) → Si (Snake)
    // Si-Wu-Wei (South/Fire) → Shen (Monkey)
    // Shen-You-Xu (West/Metal) → Hai (Pig)
    const solitaryMap = {
        'Hai': 'Yin', 'Zi': 'Yin', 'Chou': 'Yin',    // Water → Tiger
        'Yin': 'Si', 'Mao': 'Si', 'Chen': 'Si',      // Wood → Snake
        'Si': 'Shen', 'Wu': 'Shen', 'Wei': 'Shen',   // Fire → Monkey
        'Shen': 'Hai', 'You': 'Hai', 'Xu': 'Hai'     // Metal → Pig
    };
    stars.solitary = solitaryMap[dayBranch] || '';  // Day Branch ONLY
    
    // 6. Heavenly Doctor Star (Tian Yi) - Based on Month Branch
    // Each month's doctor is 6 positions away in the branch cycle
    // Zi(1)→Wu(7), Chou(2)→Wei(8), Yin(3)→Shen(9), Mao(4)→You(10)
    // Chen(5)→Xu(11), Si(6)→Hai(12), Wu(7)→Zi(1), Wei(8)→Chou(2)
    // Shen(9)→Yin(3), You(10)→Mao(4), Xu(11)→Chen(5), Hai(12)→Si(6)
    const heavenlyDoctorMap = {
        'Zi': 'Wu', 'Chou': 'Wei', 'Yin': 'Shen', 'Mao': 'You',
        'Chen': 'Xu', 'Si': 'Hai', 'Wu': 'Zi', 'Wei': 'Chou',
        'Shen': 'Yin', 'You': 'Mao', 'Xu': 'Chen', 'Hai': 'Si'
    };
    stars.heavenlyDoctor = heavenlyDoctorMap[monthBranch] || '';
    
    // 7. Kong Wang (Dead Emptiness / 空亡) - Based on Day Pillar Xun
    // 6 Xun cycles (旬), each 10 pillars, with 2 empty branches
    const dayStemIndex = dayMasterIndex; // 0-9 (Jia=0, Yi=1, ..., Gui=9)
    const dayBranchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === dayBranchEnglish);
    
    // Calculate Day Pillar position in 60-cycle: (Stem * 6 - Branch * 5) % 60
    // But simpler: use the formula for finding which Xun
    // Each Xun has 10 pillars. We need to find which pillar number (0-59) the Day Pillar is
    
    // Calculate pillar index in 60-cycle
    // For each stem (0-9), branches cycle through in pairs
    // Jia(0) goes with: Zi(0), Yin(2), Chen(4), Wu(6), Shen(8), Xu(10)
    // Yi(1) goes with: Chou(1), Mao(3), Si(5), Wei(7), You(9), Hai(11)
    // Pattern: stem index % 2 determines if branch index is even or odd
    
    const pillarIndex = (dayStemIndex * 6 - dayBranchIndex * 5 + 60) % 60;
    const xunNumber = Math.floor(pillarIndex / 10); // 0-5
    
    // Xun mapping based on your data:
    // Xun 0 (Jia Zi): Xu(10), Hai(11) - Dog, Pig
    // Xun 1 (Jia Xu): Shen(8), You(9) - Monkey, Rooster
    // Xun 2 (Jia Shen): Wu(6), Wei(7) - Horse, Goat
    // Xun 3 (Jia Wu): Chen(4), Si(5) - Dragon, Snake
    // Xun 4 (Jia Chen): Yin(2), Mao(3) - Tiger, Rabbit
    // Xun 5 (Jia Yin): Zi(0), Chou(1) - Rat, Ox
    
    const kongwangByXun = [
        ['Xu', 'Hai'],      // Xun 0: Jia Zi Xun
        ['Shen', 'You'],    // Xun 1: Jia Xu Xun
        ['Wu', 'Wei'],      // Xun 2: Jia Shen Xun
        ['Chen', 'Si'],     // Xun 3: Jia Wu Xun
        ['Yin', 'Mao'],     // Xun 4: Jia Chen Xun
        ['Zi', 'Chou']      // Xun 5: Jia Yin Xun
    ];
    
    stars.kongwang = kongwangByXun[xunNumber] || [];
    
    console.log("Day Pillar:", dayMasterName, dayBranchEnglish);
    console.log("Pillar Index in 60-cycle:", pillarIndex);
    console.log("Xun Number:", xunNumber);
    console.log("Kong Wang (Dead Emptiness):", stars.kongwang);
    
    console.log("DEBUG - Lucky Stars calculated:", stars);
    console.log("DEBUG - Final Lucky Stars Summary:");
    console.log("  Noble People:", stars.nobleman);
    console.log("  Intelligence:", stars.intelligence);
    console.log("  Peach Blossom:", stars.peachBlossom);
    console.log("  Sky Horse:", stars.skyHorse);
    console.log("  Solitary:", stars.solitary);
    console.log("  Heavenly Doctor:", stars.heavenlyDoctor);
    console.log("  Kong Wang (Dead Emptiness):", stars.kongwang);
    
    // Now check which pillars contain these stars
    const allPillars = [
        fourPillars.year_pillar,
        fourPillars.month_pillar,
        fourPillars.day_pillar,
        fourPillars.hour_pillar
    ];
    
    // Add current pillars if available
    if (currentPillars) {
        if (currentPillars.current_luck) allPillars.push(currentPillars.current_luck);
        if (currentPillars.current_year) allPillars.push(currentPillars.current_year);
        if (currentPillars.current_month) allPillars.push(currentPillars.current_month);
        if (currentPillars.current_day) allPillars.push(currentPillars.current_day);
    }
    
    // Create a map of branch traditional names to pillars
    const branchToPillars = {};
    allPillars.forEach(pillar => {
        const branchEnglish = pillar.earthly_branch.name;
        const branchTraditional = branchNameMap[branchEnglish] || branchEnglish;
        if (!branchToPillars[branchTraditional]) {
            branchToPillars[branchTraditional] = [];
        }
        branchToPillars[branchTraditional].push(pillar);
    });
    
    console.log("DEBUG - Branch to Pillars mapping:", branchToPillars);
    
    // For each star type, verify if it exists in any pillar
    // Note: nobleman is an array, others are single values
    if (stars.peachBlossom && !branchToPillars[stars.peachBlossom]) {
        console.log("WARNING: Peach Blossom", stars.peachBlossom, "not found in any pillar");
    }
    if (stars.skyHorse && !branchToPillars[stars.skyHorse]) {
        console.log("WARNING: Sky Horse", stars.skyHorse, "not found in any pillar");
    }
    if (stars.solitary && !branchToPillars[stars.solitary]) {
        console.log("WARNING: Solitary", stars.solitary, "not found in any pillar");
    }
    if (stars.heavenlyDoctor && !branchToPillars[stars.heavenlyDoctor]) {
        console.log("WARNING: Heavenly Doctor", stars.heavenlyDoctor, "not found in any pillar");
    }
    
    return stars;
}

// Display Lucky Stars in the UI - Table Format
function displayLuckyStars(stars) {
    const luckyStarsTableBody = document.getElementById('luckyStarsTableBody');
    if (!luckyStarsTableBody) return;
    
    // Helper function to get branch character and English name from traditional name
    const getBranchInfo = (branchTraditionalName) => {
        if (!branchTraditionalName) return { character: '', english: '' };
        
        // Convert traditional name to English name
        const traditionalToEnglishMap = {
            'Zi': 'Rat', 'Chou': 'Ox', 'Yin': 'Tiger', 'Mao': 'Rabbit',
            'Chen': 'Dragon', 'Si': 'Snake', 'Wu': 'Horse', 'Wei': 'Goat',
            'Shen': 'Monkey', 'You': 'Rooster', 'Xu': 'Dog', 'Hai': 'Pig'
        };
        
        const englishName = traditionalToEnglishMap[branchTraditionalName] || branchTraditionalName;
        const branch = EARTHLY_BRANCHES.find(b => b.name === englishName);
        
        return branch ? { character: branch.character, english: branch.name } : { character: branchTraditionalName, english: englishName };
    };
    
    // Custom icons for each star
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
    
    // Build table rows
    let html = '';
    
    // 1. Nobleman Star
    const noblemanBranches = stars.nobleman.length > 0 ? stars.nobleman.map(b => {
        const info = getBranchInfo(b);
        return `${info.character} ${info.english}`;
    }).join(', ') : 'None';
    
    html += `
        <tr>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; font-weight: 600; color: ${colors.nobleman}; vertical-align: middle; font-size: 1.05rem;">
                <span style="font-size: 1.5rem; margin-right: 10px;">${icons.nobleman}</span>
                NOBLE PEOPLE 贵人
            </td>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; color: ${colors.nobleman}; font-weight: 700; font-size: 1.15rem; vertical-align: middle; text-align: right;">
                ${noblemanBranches}
            </td>
        </tr>
    `;
    
    // 2. Intelligence Star
    const intelInfo = stars.intelligence ? getBranchInfo(stars.intelligence) : { character: '', english: '' };
    html += `
        <tr>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; font-weight: 600; color: ${colors.intelligence}; vertical-align: middle; font-size: 1.05rem;">
                <span style="font-size: 1.5rem; margin-right: 10px;">${icons.intelligence}</span>
                INTELLIGENCE 文昌
            </td>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; color: ${colors.intelligence}; font-weight: 700; font-size: 1.15rem; vertical-align: middle; text-align: right;">
                ${intelInfo.character ? `${intelInfo.character} ${intelInfo.english}` : 'None'}
            </td>
        </tr>
    `;
    
    // 3. Peach Blossom Star
    const peachInfo = stars.peachBlossom ? getBranchInfo(stars.peachBlossom) : { character: '', english: '' };
    html += `
        <tr>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; font-weight: 600; color: ${colors.peachBlossom}; vertical-align: middle; font-size: 1.05rem;">
                <span style="font-size: 1.5rem; margin-right: 10px;">${icons.peachBlossom}</span>
                PEACH BLOSSOM 桃花
            </td>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; color: ${colors.peachBlossom}; font-weight: 700; font-size: 1.15rem; vertical-align: middle; text-align: right;">
                ${peachInfo.character ? `${peachInfo.character} ${peachInfo.english}` : 'None'}
            </td>
        </tr>
    `;
    
    // 4. Sky Horse Star
    const skyInfo = stars.skyHorse ? getBranchInfo(stars.skyHorse) : { character: '', english: '' };
    html += `
        <tr>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; font-weight: 600; color: ${colors.skyHorse}; vertical-align: middle; font-size: 1.05rem;">
                <span style="font-size: 1.5rem; margin-right: 10px;">${icons.skyHorse}</span>
                SKY HORSE 驛馬
            </td>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; color: ${colors.skyHorse}; font-weight: 700; font-size: 1.15rem; vertical-align: middle; text-align: right;">
                ${skyInfo.character ? `${skyInfo.character} ${skyInfo.english}` : 'None'}
            </td>
        </tr>
    `;
    
    // 5. Solitary Star
    const solitaryInfo = stars.solitary ? getBranchInfo(stars.solitary) : { character: '', english: '' };
    html += `
        <tr>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; font-weight: 600; color: ${colors.solitary}; vertical-align: middle; font-size: 1.05rem;">
                <span style="font-size: 1.5rem; margin-right: 10px;">${icons.solitary}</span>
                SOLITARY 孤辰
            </td>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; color: ${colors.solitary}; font-weight: 700; font-size: 1.15rem; vertical-align: middle; text-align: right;">
                ${solitaryInfo.character ? `${solitaryInfo.character} ${solitaryInfo.english}` : 'None'}
            </td>
        </tr>
    `;
    
    // 6. Heavenly Doctor Star
    const doctorInfo = stars.heavenlyDoctor ? getBranchInfo(stars.heavenlyDoctor) : { character: '', english: '' };
    html += `
        <tr>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; font-weight: 600; color: ${colors.heavenlyDoctor}; vertical-align: middle; font-size: 1.05rem;">
                <span style="font-size: 1.5rem; margin-right: 10px;">${icons.heavenlyDoctor}</span>
                HEAVENLY DOCTOR 天医
            </td>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; color: ${colors.heavenlyDoctor}; font-weight: 700; font-size: 1.15rem; vertical-align: middle; text-align: right;">
                ${doctorInfo.character ? `${doctorInfo.character} ${doctorInfo.english}` : 'None'}
            </td>
        </tr>
    `;
    
    // 7. Kong Wang (Dead Emptiness / 空亡)
    const kongwangBranches = stars.kongwang && stars.kongwang.length > 0 
        ? stars.kongwang.map(kw => {
            const kwInfo = getBranchInfo(kw);
            return kwInfo.character ? `${kwInfo.character} ${kwInfo.english}` : '';
        }).join(', ')
        : 'None';
    
    // Determine label based on mode
    const kongwangLabel = window.currentMode === 'modern' 
        ? 'DEAD EMPTINESS 空亡' 
        : 'KONG WANG 空亡';
    
    html += `
        <tr>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; font-weight: 600; color: #9B59B6; vertical-align: middle; font-size: 1.05rem;">
                <span style="font-size: 1.5rem; margin-right: 10px;">☯️</span>
                ${kongwangLabel}
            </td>
            <td style="padding: 14px 18px; background: white; border-radius: 8px; color: #9B59B6; font-weight: 700; font-size: 1.15rem; vertical-align: middle; text-align: right;">
                ${kongwangBranches}
            </td>
        </tr>
    `;
    
    luckyStarsTableBody.innerHTML = html;
}

// Calculate Element Structure with Weighted Method
// Heavenly Stem = 1.0, Main Qi = 0.7/0.8, Sub Main Qi = 0.2, Residual Qi = 0.1/0
// Special case: Hai (Pig) and Wu (Horse) have Main Qi = 0.8, NO Residual Qi
function calculateElementStructure(fourPillars, currentPillars) {
    // Initialize element counters
    const elements = {
        'Wood': { natal: 0, annual: 0 },
        'Fire': { natal: 0, annual: 0 },
        'Earth': { natal: 0, annual: 0 },
        'Metal': { natal: 0, annual: 0 },
        'Water': { natal: 0, annual: 0 }
    };
    
    // Element mapping for each stem index
    // CORRECTED: Use Math.floor(index / 2) to get element
    // Index 0,1 = Wood (Jia, Yi)
    // Index 2,3 = Fire (Bing, Ding)
    // Index 4,5 = Earth (Wu, Ji)
    // Index 6,7 = Metal (Geng, Xin)
    // Index 8,9 = Water (Ren, Gui)
    const STEM_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    
    // Get element from stem index (0-9)
    const getElementFromIndex = (stemIndex) => {
        // CORRECTED: Use Math.floor to map pairs of stems to same element
        // 0,1 → Wood; 2,3 → Fire; 4,5 → Earth; 6,7 → Metal; 8,9 → Water
        return STEM_ELEMENTS[Math.floor(stemIndex / 2)];
    };
    
    // Calculate for a single pillar - Weighted Method
    const calculatePillar = (pillar, isNatal) => {
        if (!pillar) return;
        
        const target = isNatal ? 'natal' : 'annual';
        
        // Check branch type for special Qi weights
        const branchName = pillar.earthly_branch ? pillar.earthly_branch.name : '';
        
        // Three types of branches:
        // 1. Mao (Rabbit), You (Rooster), Zi (Rat): Main Qi ONLY = 1.0, NO Sub/Residual
        // 2. Hai (Pig), Wu (Horse): Main Qi = 0.8, Sub Main Qi = 0.2, NO Residual
        // 3. Other branches: Main Qi = 0.7, Sub Main Qi = 0.2, Residual Qi = 0.1
        const isMaoYouZi = branchName === 'Rabbit' || branchName === 'Rooster' || branchName === 'Rat';
        const isHaiOrWu = branchName === 'Pig' || branchName === 'Horse';
        
        let mainQiWeight, subMainQiWeight, residualQiWeight;
        
        if (isMaoYouZi) {
            // Type 1: Only Main Qi, no Sub/Residual
            mainQiWeight = 1.0;
            subMainQiWeight = 0;
            residualQiWeight = 0;
        } else if (isHaiOrWu) {
            // Type 2: Main + Sub, no Residual
            mainQiWeight = 0.8;
            subMainQiWeight = 0.2;
            residualQiWeight = 0;
        } else {
            // Type 3: Normal - Main + Sub + Residual
            mainQiWeight = 0.7;
            subMainQiWeight = 0.2;
            residualQiWeight = 0.1;
        }
        
        // 1. Count Heavenly Stem (weight 1.0)
        if (pillar.heavenly_stem) {
            const stemIndex = pillar.heavenly_stem.index ?? 
                              HEAVENLY_STEMS.findIndex(s => s.name === pillar.heavenly_stem.name);
            if (stemIndex >= 0) {
                const element = getElementFromIndex(stemIndex);
                elements[element][target] += 1.0;
            }
        }
        
        // 2. Count Hidden Stems from Earthly Branch (weighted)
        if (pillar.hidden_stems) {
            // Main Qi
            if (pillar.hidden_stems.main_qi) {
                const mainIndex = pillar.hidden_stems.main_qi.index ?? 
                                 pillar.hidden_stems.main_qi.stem_index ??
                                 HEAVENLY_STEMS.findIndex(s => 
                                     s.name === pillar.hidden_stems.main_qi.name || 
                                     s.name === pillar.hidden_stems.main_qi.stem_name
                                 );
                if (mainIndex >= 0) {
                    const element = getElementFromIndex(mainIndex);
                    elements[element][target] += mainQiWeight;
                }
            }
            
            // Sub Main Qi (only if weight > 0)
            if (pillar.hidden_stems.sub_main_qi && subMainQiWeight > 0) {
                const subIndex = pillar.hidden_stems.sub_main_qi.index ?? 
                                pillar.hidden_stems.sub_main_qi.stem_index ??
                                HEAVENLY_STEMS.findIndex(s => 
                                    s.name === pillar.hidden_stems.sub_main_qi.name || 
                                    s.name === pillar.hidden_stems.sub_main_qi.stem_name
                                );
                if (subIndex >= 0) {
                    const element = getElementFromIndex(subIndex);
                    elements[element][target] += subMainQiWeight;
                }
            }
            
            // Residual Qi (only if weight > 0)
            if (pillar.hidden_stems.residual_qi && residualQiWeight > 0) {
                const residualIndex = pillar.hidden_stems.residual_qi.index ?? 
                                     pillar.hidden_stems.residual_qi.stem_index ??
                                     HEAVENLY_STEMS.findIndex(s => 
                                         s.name === pillar.hidden_stems.residual_qi.name || 
                                         s.name === pillar.hidden_stems.residual_qi.stem_name
                                     );
                if (residualIndex >= 0) {
                    const element = getElementFromIndex(residualIndex);
                    elements[element][target] += residualQiWeight;
                }
            }
        }
    };
    
    // Calculate Natal Chart (4 Pillars ONLY)
    calculatePillar(fourPillars.year_pillar, true);
    calculatePillar(fourPillars.month_pillar, true);
    calculatePillar(fourPillars.day_pillar, true);
    calculatePillar(fourPillars.hour_pillar, true);
    
    // Calculate Annual Chart (ALL 8 Pillars: 4 Natal + 4 Current)
    // IMPORTANT: Recalculate ALL pillars from scratch for annual, don't copy from natal
    // Reset annual counters first
    Object.keys(elements).forEach(elem => {
        elements[elem].annual = 0;
    });
    
    // Add 4 Natal Pillars to Annual
    calculatePillar(fourPillars.year_pillar, false);
    calculatePillar(fourPillars.month_pillar, false);
    calculatePillar(fourPillars.day_pillar, false);
    calculatePillar(fourPillars.hour_pillar, false);
    
    // Add 4 Current Pillars to Annual
    if (currentPillars && currentPillars.current_luck) {
        calculatePillar(currentPillars.current_luck, false);
    }
    
    if (currentPillars && currentPillars.current_year) {
        calculatePillar(currentPillars.current_year, false);
    }
    
    if (currentPillars && currentPillars.current_month) {
        calculatePillar(currentPillars.current_month, false);
    }
    
    if (currentPillars && currentPillars.current_day) {
        calculatePillar(currentPillars.current_day, false);
    }
    
    // Calculate percentages - Based on actual count
    const natalTotal = Object.values(elements).reduce((sum, e) => sum + e.natal, 0);
    const annualTotal = Object.values(elements).reduce((sum, e) => sum + e.annual, 0);
    
    const natalPercentages = {};
    const annualPercentages = {};
    
    Object.keys(elements).forEach(elem => {
        natalPercentages[elem] = natalTotal > 0 
            ? (elements[elem].natal / natalTotal * 100).toFixed(1) 
            : 0;
        annualPercentages[elem] = annualTotal > 0 
            ? (elements[elem].annual / annualTotal * 100).toFixed(1) 
            : 0;
    });
    
    return {
        natal: natalPercentages,
        annual: annualPercentages,
        natalPoints: elements,
        annualPoints: elements,
        natalTotal: natalTotal,
        annualTotal: annualTotal
    };
}

// Display Element Structure with Radar Chart
function displayElementStructure(elementData) {
    const elementSection = document.getElementById('luckyStarsAndElementSection');
    if (!elementSection) return;
    
    // Show the section
    elementSection.style.display = 'block';
    
    // Update percentages display
    const percentagesDiv = document.getElementById('elementPercentages');
    if (percentagesDiv) {
        const elementColors = {
            'Wood': '#28a745',
            'Fire': '#dc3545',
            'Earth': '#ffc107',
            'Metal': '#6c757d',
            'Water': '#007bff'
        };
        
        const elementIcons = {
            'Wood': '🌳',
            'Fire': '🔥',
            'Earth': '🌍',
            'Metal': '⚙️',
            'Water': '💧'
        };
        
        let html = '<div style="margin-top: 1rem;">';
        
        Object.keys(elementData.natal).forEach(elem => {
            const natalPercent = elementData.natal[elem];
            const annualPercent = elementData.annual[elem];
            const color = elementColors[elem];
            const icon = elementIcons[elem];
            
            html += `
                <div style="margin-bottom: 1.8rem;">
                    <div style="display: flex; align-items: center; margin-bottom: 0.8rem;">
                        <span style="font-size: 1.4rem; margin-right: 0.6rem;">${icon}</span>
                        <strong style="color: ${color}; font-size: 1.1rem; font-weight: 700; text-transform: uppercase;">${elem}</strong>
                    </div>
                    <div style="margin-bottom: 0.6rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                            <span style="font-size: 0.85rem; color: #6c757d; font-weight: 600;">Natal</span>
                            <span style="font-size: 0.95rem; font-weight: 700; color: ${color};">${natalPercent}%</span>
                        </div>
                        <div style="background: #e8f5e9; border-radius: 10px; height: 8px; overflow: hidden;">
                            <div style="background: ${color}; width: ${natalPercent}%; height: 100%; border-radius: 10px; transition: width 0.5s ease;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                            <span style="font-size: 0.85rem; color: #6c757d; font-weight: 600;">Annual</span>
                            <span style="font-size: 0.95rem; font-weight: 700; color: ${color}; opacity: 0.8;">${annualPercent}%</span>
                        </div>
                        <div style="background: #f3e5f5; border-radius: 10px; height: 8px; overflow: hidden;">
                            <div style="background: ${color}; width: ${annualPercent}%; height: 100%; border-radius: 10px; opacity: 0.6; transition: width 0.5s ease;"></div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        percentagesDiv.innerHTML = html;
    }
    
    // Create/Update Radar Chart
    const ctx = document.getElementById('elementRadarChart');
    if (!ctx) return;
    
    // Destroy existing chart if exists and is a valid Chart instance
    if (window.elementRadarChart && typeof window.elementRadarChart.destroy === 'function') {
        window.elementRadarChart.destroy();
    }
    
    const labels = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const natalData = labels.map(elem => parseFloat(elementData.natal[elem]));
    const annualData = labels.map(elem => parseFloat(elementData.annual[elem]));
    
    window.elementRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Natal Chart',
                    data: natalData,
                    backgroundColor: 'rgba(245, 222, 179, 0.5)',  // Beige
                    borderColor: 'rgba(210, 180, 140, 1)',      // Darker beige
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(210, 180, 140, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(210, 180, 140, 1)'
                },
                {
                    label: 'Annual 2026',
                    data: annualData,
                    backgroundColor: 'rgba(147, 112, 219, 0.4)', // Purple
                    borderColor: 'rgba(138, 43, 226, 1)',        // Darker purple
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(138, 43, 226, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(138, 43, 226, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 13
                        },
                        color: '#6c757d'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.15)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.15)'
                    },
                    pointLabels: {
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#2c3e50'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 25,
                        font: {
                            size: 15,
                            weight: '700'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.r + '%';
                        }
                    }
                }
            }
        }
    });
    
    console.log("DEBUG - Element Structure displayed");
}

function calculateBazi() {
    const birthDateInput = document.getElementById("birthDate");
    const birthTimeInput = document.getElementById("birthTime");
    const locationInput = document.getElementById("location");
    const luckPillarsDiv = document.getElementById("luckPillars");
    const errorDiv = document.getElementById("error");

    // Get selected gender
    const genderRadios = document.getElementsByName("gender");
    let selectedGender = null; // Initialize as null
    for (const radio of genderRadios) {
        if (radio.checked) {
            selectedGender = parseInt(radio.value, 10);
            break;
        }
    }

    // Clear previous error message
    errorDiv.style.display = 'none';

    // Check if date is selected
    if (!birthDateInput.value) {
        errorDiv.textContent = "Please select a birth date.";
        errorDiv.style.display = 'block';
        return;
    }

    // Check if "Don't Know Birth Time" is checked
    const unknownBirthTimeCheckbox = document.getElementById("unknownBirthTime");
    
    console.log("DEBUG - Birth Date:", birthDateInput.value);
    console.log("DEBUG - Birth Time:", birthTimeInput.value);
    console.log("DEBUG - Unknown Birth Time:", unknownBirthTimeCheckbox.checked);
    
    // Combine date and time into datetime string
    let actualDateTime = '';
    
    if (unknownBirthTimeCheckbox.checked) {
        // MODE: Don't Know Birth Time - use 12:00 noon
        actualDateTime = birthDateInput.value + 'T12:00';
        console.log("DEBUG - Using 12:00 (noon) for unknown birth time");
    } else {
        // MODE: Normal - require time
        if (!birthTimeInput.value) {
            errorDiv.textContent = "Please select a birth time.";
            errorDiv.style.display = 'block';
            return;
        }
        actualDateTime = birthDateInput.value + 'T' + birthTimeInput.value;
        console.log("DEBUG - Using provided birth time");
    }
    
    console.log("DEBUG - Combined datetime:", actualDateTime);
    
    const inputDate = new Date(actualDateTime);
    const startYear = 1900;
    const endYear = 2100;

    if (inputDate.getFullYear() < startYear || inputDate.getFullYear() > endYear) {
        errorDiv.textContent = `Year must be between ${startYear} and ${endYear}`;
        errorDiv.style.display = 'block';
        return;
    }

    // Check if timezone is selected
    if (!locationInput.value) {
        errorDiv.textContent = languageStrings[currentLanguage].noTimezoneSelected;
        errorDiv.style.display = 'block';
        return;
    }

    // Check if gender is selected
    if (selectedGender === null) {
        errorDiv.textContent = languageStrings[currentLanguage].noGenderSelected;
        errorDiv.style.display = 'block';
        return;
    }

    luckPillarsDiv.style.display = "none";
    errorDiv.style.display = "none";
    
    // Hide all hierarchical containers - simplified since we removed them
    // No longer needed

    // Create a new object before sending the data.
    const requestData = {
        dateTime: actualDateTime,
        location: locationInput.value,
        gender: selectedGender,
        unknownBirthTime: unknownBirthTimeCheckbox.checked  // Send flag to backend
    };
    
    // Store birth time data for hierarchical calculations
    birthTimeData = {
        dateTime: actualDateTime,
        location: locationInput.value,
        gender: selectedGender,
        unknownBirthTime: unknownBirthTimeCheckbox.checked
    };

    fetch('/calculate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData), // Send the requestData object
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            // Store data for combination detection
            window.currentBaziData = data;
            
            // Prepare current pillars for Lucky Stars calculation
            const currentPillars = {
                current_luck: data.current_luck_cycle,
                current_year: data.current_year_pillar,
                current_month: data.current_month_pillar,
                current_day: data.current_day_pillar
            };
            
            // IMPORTANT: Calculate Lucky Stars FIRST before displaying pillars
            // This ensures window.currentLuckyStars is available for pillar indicators
            const luckyStars = calculateLuckyStars(data.four_pillars, currentPillars);
            window.currentLuckyStars = luckyStars;
            console.log("✓ Lucky Stars calculated and stored BEFORE pillar display");
            
            // Display the Four Pillars (Natal Chart) - NOW with Lucky Stars indicators
            displayPillar(data.four_pillars.year_pillar, "YearPillar");
            displayPillar(data.four_pillars.month_pillar, "MonthPillar");
            displayPillar(data.four_pillars.day_pillar, "DayPillar");
            
            // Check if birth time is unknown - if so, clear Hour Pillar completely
            if (birthTimeData && birthTimeData.unknownBirthTime) {
                // Clear Hour Pillar display - completely empty, NO combinations
                const hourPillarDiv = document.getElementById("HourPillar");
                if (hourPillarDiv) {
                    hourPillarDiv.innerHTML = `
                        <div class="pillar-title">Hour Pillar</div>
                        <div class="pillar-value">
                            <strong style="color: #ccc; font-size: 2.5rem;">?</strong>
                        </div>
                        <hr>
                        <div class="pillar-value">
                            <strong style="color: #ccc; font-size: 2.5rem;">?</strong>
                        </div>
                        <hr>
                        <div class="ganzhi-separator">
                            <strong style="color: #ccc; font-size: 0.9rem;">N/A</strong>
                        </div>
                        <hr>
                        <div class="lifecycle-separator">
                            <div style="color: #ccc; font-size: 0.85rem;">N/A</div>
                        </div>
                        <div class="combinations-section" style="min-height: 20px;">
                            <!-- Empty - no combinations when birth time unknown -->
                        </div>
                    `;
                }
                console.log("Hour Pillar cleared completely - birth time unknown, no combinations");
            } else {
                // Display Hour Pillar normally
                displayPillar(data.four_pillars.hour_pillar, "HourPillar");
            }
            
            // Display the Luck Pillars
            displayLuckPillars(data.luck_pillars);
            
            // Lucky Stars already calculated above, just display them now
            displayLuckyStars(window.currentLuckyStars);
            
            // Calculate and Display Element Structure
            const elementData = calculateElementStructure(data.four_pillars, {
                current_luck: data.current_luck_cycle,
                current_year: data.current_year_pillar,
                current_month: data.current_month_pillar,
                current_day: data.current_day_pillar
            });
            displayElementStructure(elementData);
            
            // Display Current Transiting Pillars (Current Luck Cycle, Current Year, Current Month)
            displayCurrentPillars(data.four_pillars, data.luck_pillars);
            
            // Display Time Period Rows (Year, Month, Day, Hour Pillars)
            displayTimePeriodRows(data.four_pillars, data.luck_pillars);
            
            // Detect and display Heavenly Stem combinations
            detectAndDisplayHSCombinations(data.four_pillars, data.luck_pillars);
            
            // Show the results
            document.getElementById("luckPillars").style.display = "flex";
            document.getElementById("resultsContainer").style.display = "block";
        })
        .catch(error => {
            errorDiv.textContent = "Error: " + error.message;
            errorDiv.style.display = "block";
        });

    // GSAP animation on successful calculation (commented out for stability)
    // gsap.from("#result", { duration: 1, opacity: 0, y: 50, stagger: 0.2 });
    // gsap.from(".luckPillar", { duration: 1, opacity: 0, y: 50, stagger: 0.2 });
    // gsap.from("#resultsContainer", { duration: 1, opacity: 0, y: 50 });
}

function displayPillar(pillarData, element) {
    let div;
    if (typeof element === 'string') {
        div = document.getElementById(element);
    } else {
        div = element;
    }

    let heavenlyStemName = pillarData.heavenly_stem.name;
    let heavenlyStemCharacter = pillarData.heavenly_stem.character;
    let earthlyBranchName = pillarData.earthly_branch.name;
    let earthlyBranchCharacter = pillarData.earthly_branch.character;

    // Get element and branch element before translation
    let heavenlyStemElement = heavenlyStemName.split(" ")[1];
    let earthlyBranchElement = branchAssociations[earthlyBranchName];

    // Extract Nayin (GanZhi) information - Calculate from Stem-Branch combination
    let nayinName = getNayinFromStemBranch(heavenlyStemName, earthlyBranchName);
    let nayinElement = getNayinElement(nayinName);
    // Override with backend element if available
    if (pillarData.gan_zhi && pillarData.gan_zhi.element_name) {
        nayinElement = pillarData.gan_zhi.element_name;
    }
    const displayNayinName = formatNayinName(nayinName);

    // Extract 12 Phrase (Life Cycle) information - Calculate from Stem-Branch combination
    let phrase12Name = formatLifeCycleName(heavenlyStemName, earthlyBranchName);
    
    // Extract Hidden Stems information with 10 Gods
    let hiddenStemsHTML = "";
    if (pillarData.hidden_stems) {
        const hiddenStems = pillarData.hidden_stems;
        let stemColumns = [];
        
        // Residual Qi (left column)
        if (hiddenStems.residual_qi) {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.residual_qi.element]}">${hiddenStems.residual_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.residual_qi.ten_gods || "--"}</div>
                </div>
            `);
        } else {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `);
        }
        
        // Main Qi (center column)
        if (hiddenStems.main_qi) {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.main_qi.element]}">${hiddenStems.main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.main_qi.ten_gods || "--"}</div>
                </div>
            `);
        } else {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `);
        }
        
        // Sub Main Qi (right column)
        if (hiddenStems.sub_main_qi) {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.sub_main_qi.element]}">${hiddenStems.sub_main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.sub_main_qi.ten_gods || "--"}</div>
                </div>
            `);
        } else {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `);
        }
        
        hiddenStemsHTML = `
            <div class="hidden-stems-container">
                <div class="hidden-stems-grid">
                    ${stemColumns.join('')}
                </div>
            </div>
        `;
    }

    // Get title for this pillar
    let title = languageStrings[currentLanguage][div.id] || div.id;
    if (div.id && div.id.startsWith('Current')) {
        title = languageStrings[currentLanguage][div.id] || div.id.replace('Current', 'Current ');
    }
    
    // Calculate 10 Gods abbreviation for this Heavenly Stem
    let tenGodAbbreviation = '';
    if (pillarData.heavenly_stem && window.currentBaziData) {
        const stemName = pillarData.heavenly_stem.name;
        const stemIndex = HEAVENLY_STEMS.findIndex(s => s.name === stemName);
        
        if (stemIndex >= 0) {
            // Get Day Master info
            const dayMasterName = window.currentBaziData.four_pillars.day_pillar.heavenly_stem.name;
            const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => s.name === dayMasterName);
            const dayMasterElement = Math.floor(dayMasterIndex / 2);
            const dayMasterYinYang = dayMasterIndex % 2;
            
            // Calculate 10 God
            const element = Math.floor(stemIndex / 2);
            const yinYang = stemIndex % 2;
            
            let tenGodName = '';
            
            // Same element
            if (element === dayMasterElement) {
                tenGodName = yinYang === dayMasterYinYang ? 'Friend' : 'Rob Wealth';
            }
            // Output (Day Master produces)
            else if ((dayMasterElement + 1) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Eating God' : 'Hurting Officer';
            }
            // Wealth (Day Master controls)
            else if ((dayMasterElement + 2) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Indirect Wealth' : 'Direct Wealth';
            }
            // Officer (Controls Day Master)
            else if ((dayMasterElement + 3) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Seven Killings' : 'Direct Officer';
            }
            // Resource (Produces Day Master)
            else if ((dayMasterElement + 4) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Direct Resource' : 'Indirect Resource';
            }
            
            // Map to abbreviation
            const tenGodAbbrevMap = {
                'Friend': 'F',
                'Rob Wealth': 'RW',
                'Eating God': 'EG',
                'Hurting Officer': 'HO',
                'Direct Wealth': 'DW',
                'Indirect Wealth': 'IW',
                'Direct Officer': 'DO',
                'Seven Killings': '7K',
                'Direct Resource': 'DR',
                'Indirect Resource': 'IR'
            };
            
            tenGodAbbreviation = tenGodAbbrevMap[tenGodName] || '';
        }
    }
    
    // Heavenly Stem display with 10 Gods abbreviation at top-right
    const heavenlyStemHTML = `
        <div style="position: relative; display: inline-block;">
            <strong id="bigCharacter" style="color: ${elementColors[heavenlyStemElement]}; font-size: 3.5rem; line-height: 0.9; margin-bottom: 0.3rem; display: block;">${heavenlyStemCharacter}</strong>
            ${tenGodAbbreviation ? `<span style="position: absolute; top: -5px; right: -25px; font-size: 0.75rem; font-weight: 700; color: #9b59b6; background: white; padding: 2px 4px; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">${tenGodAbbreviation}</span>` : ''}
        </div>
        <div id="bigValue" style="color: ${elementColors[heavenlyStemElement]}; font-size: 0.75rem; font-weight: 700; margin-top: 0.2rem;">${heavenlyStemName}</div>
    `;

    // Build pillar HTML - ALL pillars have same structure:
    // Title (top) -> Heavenly Stem -> HR -> Earthly Branch -> Hidden Stems with 10 Gods -> HR -> Nayin -> HR -> 12 Phrase
    
    // Check if this pillar's earthly branch has any Lucky Stars
    let luckyStarsIndicator = '';
    if (pillarData.earthly_branch && pillarData.earthly_branch.name) {
        console.log(`\n=== CHECKING LUCKY STARS FOR PILLAR: ${div.id} ===`);
        // Get traditional branch name
        const branchEnglishName = pillarData.earthly_branch.name;
        const branchNameMap = {
            'Rat': 'Zi', 'Ox': 'Chou', 'Tiger': 'Yin', 'Rabbit': 'Mao',
            'Dragon': 'Chen', 'Snake': 'Si', 'Horse': 'Wu', 'Goat': 'Wei',
            'Monkey': 'Shen', 'Rooster': 'You', 'Dog': 'Xu', 'Pig': 'Hai'
        };
        const branchTraditional = branchNameMap[branchEnglishName] || branchEnglishName;
        
        console.log(`Branch: ${branchEnglishName} → ${branchTraditional}`);
        console.log(`window.currentLuckyStars:`, window.currentLuckyStars);
        
        // Check if this branch is in any lucky stars
        const starsForThisBranch = [];
        if (window.currentLuckyStars) {
            // Nobleman is an array - check if branch is in the array
            if (Array.isArray(window.currentLuckyStars.nobleman) && window.currentLuckyStars.nobleman.includes(branchTraditional)) {
                console.log(`✓ Nobleman: ${branchTraditional} found in`, window.currentLuckyStars.nobleman);
                starsForThisBranch.push('👑');
            }
            // Others are strings - check exact match
            if (window.currentLuckyStars.intelligence && window.currentLuckyStars.intelligence === branchTraditional) {
                console.log(`✓ Intelligence: ${branchTraditional} matches`);
                starsForThisBranch.push('🎓');
            }
            if (window.currentLuckyStars.peachBlossom && window.currentLuckyStars.peachBlossom === branchTraditional) {
                console.log(`✓ Peach Blossom: ${branchTraditional} matches`);
                starsForThisBranch.push('🌸');
            }
            if (window.currentLuckyStars.skyHorse && window.currentLuckyStars.skyHorse === branchTraditional) {
                console.log(`✓ Sky Horse: ${branchTraditional} matches`);
                starsForThisBranch.push('🦄');
            }
            if (window.currentLuckyStars.solitary && window.currentLuckyStars.solitary === branchTraditional) {
                console.log(`✓ Solitary: ${branchTraditional} matches`);
                starsForThisBranch.push('🌙');
            }
            if (window.currentLuckyStars.heavenlyDoctor && window.currentLuckyStars.heavenlyDoctor === branchTraditional) {
                console.log(`✓ Heavenly Doctor: ${branchTraditional} matches`);
                starsForThisBranch.push('⚕️');
            }
            
            // Kong Wang (Dead Emptiness) - Array of 2 branches
            if (Array.isArray(window.currentLuckyStars.kongwang) && window.currentLuckyStars.kongwang.includes(branchTraditional)) {
                console.log(`✓ Kong Wang (Dead Emptiness): ${branchTraditional} matches`, window.currentLuckyStars.kongwang);
                starsForThisBranch.push('☯️');  // Just the symbol, no text
            }
                    
            console.log(`Stars found for ${branchTraditional}:`, starsForThisBranch);
        } else {
            console.log(`✗ window.currentLuckyStars is NOT set!`);
        }
        
        // If there are lucky stars, show indicator
        if (starsForThisBranch.length > 0) {
            // Stack stars vertically (top to bottom)
            const stackedStars = starsForThisBranch.map(star => 
                `<div style="font-size: 0.95rem; line-height: 1.2; margin-bottom: 2px;">${star}</div>`
            ).join('');
            
            luckyStarsIndicator = `<div style="position: absolute; top: 10px; right: 5px; display: flex; flex-direction: column; align-items: center; background: rgba(255,255,255,0.95); border-radius: 5px; padding: 3px 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.25); z-index: 10;">${stackedStars}</div>`;
            console.log(`✅ Indicator CREATED for ${branchTraditional}: ${starsForThisBranch.join(', ')}`);
        } else {
            console.log(`❌ No stars for ${branchTraditional}`);
        }
        console.log(`=== END CHECKING ${div.id} ===\n`);
    } else {
        console.log(`⚠️ No earthly_branch data for ${div.id}`);
    }
    
    // For Current Pillars, show combinations, Nayin, 12 Life Stage, and period
    const isCurrentPillar = div.id && div.id.startsWith('Current');
    
    // 12 Phrase / Life Stage
    const lifecycleHTML = `
        <hr>
        <div class="lifecycle-separator">
            <div id="lifeCycle">${phrase12Name || ''}</div>
        </div>
    `;
    
    // Period display for Current Pillars
    let periodHTML = '';
    if (isCurrentPillar && pillarData.period_label && pillarData.period_value) {
        periodHTML = `
            <div style="padding: 0.5rem; background: rgba(0,0,0,0.03); border-radius: 8px; text-align: center; margin-top: 0.5rem;">
                <div style="font-size: 0.85rem; font-weight: 700; color: #666;">${pillarData.period_label}</div>
                <div style="font-size: 1rem; font-weight: 700; color: #333; margin-top: 0.2rem;">${pillarData.period_value}</div>
            </div>
        `;
    }
    
    // Combinations section - TETAP untuk semua pillars (termasuk Current)
    const combinationsHTML = `
        <div class="combinations-section" style="min-height: 20px;">
            <!-- Combinations will be populated dynamically -->
        </div>
    `;
    
    const pillarHTML = `
        <div style="position: relative;">
            <div class="pillar-title">${title}</div>
            <div class="pillar-value" style="padding-top: 1.5rem; padding-bottom: 0.8rem; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                ${heavenlyStemHTML}
            </div>
            <hr>
            <div class="pillar-value" style="position: relative; padding-top: 1.5rem; padding-bottom: 0.8rem; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <strong id="bigCharacter" style="color: ${elementColors[earthlyBranchElement]}; font-size: 3.5rem; line-height: 0.9; margin-bottom: 0.3rem; display: block;">${earthlyBranchCharacter}</strong>
                <div id="bigValue" style="color: ${elementColors[earthlyBranchElement]}; font-size: 0.75rem; font-weight: 700; margin-top: 0.2rem;">${earthlyBranchName}</div>
                ${luckyStarsIndicator}
            </div>
            ${hiddenStemsHTML}
            <hr>
            <div class="ganzhi-separator">
                <strong style="color: ${elementColors[nayinElement]}">${displayNayinName}</strong>
            </div>
            ${lifecycleHTML}
            ${combinationsHTML}
            ${periodHTML}
        </div>
    `;

    div.innerHTML = pillarHTML;
}

// Removed toggleLanguage function as Vietnamese support is no longer needed

// updateTextElements function
function updateTextElements() {
    // Update all text elements with their corresponding translations
    for (const [id, text] of Object.entries(languageStrings[currentLanguage])) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    // Update the Calculate button text
    const calculateButton = document.getElementById("calculateButton");
    if (calculateButton) {
        calculateButton.textContent = languageStrings[currentLanguage].calculateButton;
    }

    // Update gender labels
    document.getElementById("femaleRadio").nextElementSibling.textContent = languageStrings[currentLanguage].femaleLabel;
    document.getElementById("maleRadio").nextElementSibling.textContent = languageStrings[currentLanguage].maleLabel;

    const currentYearSpan = document.getElementById("current-year");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

// Initial call to set text on page load
updateTextElements();

// Add missing calculation functions for Current and Time Period pillars
function calculateCurrentYearPillar(currentDate, fourPillarsData) {
    let year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    
    // Chinese New Year boundary - before Feb 4th counts as previous year
    if (month < 2 || (month === 2 && day < 4)) {
        year -= 1;
    }
    
    const yearOffset = year - 1984;
    const yearStemIndex = yearOffset % 10;
    const yearBranchIndex = yearOffset % 12;
    
    // Get Day Master index from birth chart for 10 Gods calculation
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => 
        s.name === fourPillarsData.day_pillar.heavenly_stem.name
    );
    
    return {
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
        life_cycle: getLifeCycleName((yearStemIndex + yearBranchIndex) % 12)
    };
}

function calculateCurrentDayPillar(currentDate, fourPillarsData) {
    // In Bazi, the day changes at 23:00 (Zi hour), not midnight
    let dayForCalculation = new Date(currentDate);
    if (currentDate.getHours() >= 23) {
        // After 23:00, it's already the next day in Bazi calendar
        dayForCalculation.setDate(dayForCalculation.getDate() + 1);
    }
    
    // Calculate days since reference date (Jan 1, 1900)
    const refDate = new Date(1900, 0, 1);
    const daysSinceRef = Math.floor((dayForCalculation - refDate) / (1000 * 60 * 60 * 24));
    
    // Reference: Oct 20, 1987 = 壬寅 (indices 8, 2)
    const oct20_1987 = new Date(1987, 9, 20);
    const daysToOct1987 = Math.floor((oct20_1987 - refDate) / (1000 * 60 * 60 * 24));
    
    // Calculate reference stem and branch
    const targetStem = 8;  // 壬 (Yang Water)
    const targetBranch = 2; // 寅 (Tiger)
    const refStem = (targetStem - daysToOct1987) % 10;
    const refBranch = (targetBranch - daysToOct1987) % 12;
    
    // Calculate day stem and branch
    const dayStemIndex = (refStem + daysSinceRef) % 10;
    const dayBranchIndex = (refBranch + daysSinceRef) % 12;
    
    // Get Day Master index from birth chart for 10 Gods calculation
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => 
        s.name === fourPillarsData.day_pillar.heavenly_stem.name
    );
    
    return {
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
        life_cycle: getLifeCycleName((dayStemIndex + dayBranchIndex) % 12)
    };
}

function calculateCurrentLuckPillar(currentDate, fourPillarsData, luckPillarsData) {
    if (!birthTimeData) {
        return {
            heavenly_stem: { name: "N/A", character: "?"},
            earthly_branch: { name: "N/A", character: "?"},
            gan_zhi: { name: "N/A", element_name: ""},
            life_cycle: "N/A"
        };
    }
    
    const birthDate = new Date(birthTimeData.dateTime);
    const currentAge = currentDate.getFullYear() - birthDate.getFullYear();
    
    // Use the actual start age from the first luck pillar
    const firstLuckPillar = luckPillarsData.luck_pillars[0];
    const baseAge = firstLuckPillar.year_start - birthDate.getFullYear();
    const luckPillarIndex = Math.floor((currentAge - baseAge) / 10);
    
    if (luckPillarIndex >= 0 && luckPillarIndex < luckPillarsData.luck_pillars.length) {
        const activeLuckPillar = luckPillarsData.luck_pillars[luckPillarIndex];
        
        // Calculate Nayin and 12 Phrase from Stem-Branch combination
        const nayinName = getNayinFromStemBranch(activeLuckPillar.heavenly_stem.name, activeLuckPillar.earthly_branch.name);
        const phrase12 = formatLifeCycleName(activeLuckPillar.heavenly_stem.name, activeLuckPillar.earthly_branch.name);
        
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

function calculateYearPillar(year) {
    const yearOffset = year - 1984;
    const yearStemIndex = yearOffset % 10;
    const yearBranchIndex = yearOffset % 12;
    
    return {
        heavenly_stem: {
            name: HEAVENLY_STEMS[yearStemIndex].name,
            character: HEAVENLY_STEMS[yearStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[yearBranchIndex].name,
            character: EARTHLY_BRANCHES[yearBranchIndex].character
        },
        hidden_stems: getHiddenStems(yearBranchIndex),
        gan_zhi: GANZHI_COMBINATIONS[(yearStemIndex * 6 + Math.floor(yearBranchIndex / 2)) % 60],
        life_cycle: getLifeCycleName((yearStemIndex + yearBranchIndex) % 12)
    };
}

function calculateMonthPillar(year, month) {
    // Use same logic as calculateCurrentMonthPillar but for specific year/month
    const day = 15; // Use middle of month for calculation
    let chineseMonth;
    
    if (month === 1) {
        chineseMonth = 12;
    } else if (month === 2) {
        chineseMonth = day < 4 ? 12 : 1;
    } else if (month === 3) {
        chineseMonth = day < 6 ? 1 : 2;
    } else if (month === 4) {
        chineseMonth = day < 5 ? 2 : 3;
    } else if (month === 5) {
        chineseMonth = day < 6 ? 3 : 4;
    } else if (month === 6) {
        chineseMonth = day < 6 ? 4 : 5;
    } else if (month === 7) {
        chineseMonth = day < 7 ? 5 : 6;
    } else if (month === 8) {
        chineseMonth = day < 8 ? 6 : 7;
    } else if (month === 9) {
        chineseMonth = day < 8 ? 7 : 8;
    } else if (month === 10) {
        chineseMonth = day < 8 ? 8 : 9;
    } else if (month === 11) {
        chineseMonth = day < 7 ? 9 : 10;
    } else if (month === 12) {
        chineseMonth = day < 7 ? 10 : 11;
    }
    
    let currentYear = year;
    if (month < 2 || (month === 2 && day < 4)) {
        currentYear -= 1;
    }
    
    const yearOffset = currentYear - 1984;
    const yearStemIndex = yearOffset % 10;
    const yearStemType = yearStemIndex % 5;
    const monthStemStarts = [2, 4, 6, 8, 0];
    const monthStemBase = monthStemStarts[yearStemType];
    
    const monthStemIndex = (monthStemBase + chineseMonth - 1) % 10;
    const monthBranchIndex = (chineseMonth + 1) % 12;
    
    return {
        heavenly_stem: {
            name: HEAVENLY_STEMS[monthStemIndex].name,
            character: HEAVENLY_STEMS[monthStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[monthBranchIndex].name,
            character: EARTHLY_BRANCHES[monthBranchIndex].character
        },
        hidden_stems: getHiddenStems(monthBranchIndex),
        gan_zhi: GANZHI_COMBINATIONS[(monthStemIndex * 6 + Math.floor(monthBranchIndex / 2)) % 60],
        life_cycle: getLifeCycleName((monthStemIndex + monthBranchIndex) % 12)
    };
}

function calculateDayPillar(year, month, day) {
    const date = new Date(year, month - 1, day);
    const refDate = new Date(1900, 0, 1);
    const daysDiff = Math.floor((date - refDate) / (1000 * 60 * 60 * 24));
    
    const oct_20_1987 = new Date(1987, 9, 20);
    const daysToOct1987 = Math.floor((oct_20_1987 - refDate) / (1000 * 60 * 60 * 24));
    const targetStem = 8;
    const targetBranch = 2;
    const refStem = (targetStem - daysToOct1987) % 10;
    const refBranch = (targetBranch - daysToOct1987) % 12;
    
    const dayStemIndex = (refStem + daysDiff) % 10;
    const dayBranchIndex = (refBranch + daysDiff) % 12;
    
    return {
        heavenly_stem: {
            name: HEAVENLY_STEMS[dayStemIndex].name,
            character: HEAVENLY_STEMS[dayStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[dayBranchIndex].name,
            character: EARTHLY_BRANCHES[dayBranchIndex].character
        },
        hidden_stems: getHiddenStems(dayBranchIndex),
        gan_zhi: GANZHI_COMBINATIONS[(dayStemIndex * 6 + Math.floor(dayBranchIndex / 2)) % 60],
        life_cycle: getLifeCycleName((dayStemIndex + dayBranchIndex) % 12)
    };
}

function calculateHourPillar(year, month, day, hour) {
    // First get the day pillar for this date to determine hour stem
    const dayPillar = calculateDayPillar(year, month, day);
    const dayStemIndex = HEAVENLY_STEMS.findIndex(stem => stem.name === dayPillar.heavenly_stem.name);
    
    const dayStemType = dayStemIndex % 5;
    const hourStemStarts = [0, 2, 4, 6, 8];
    const hourStemBase = hourStemStarts[dayStemType];
    
    const hourStemIndex = (hourStemBase + hour) % 10;
    const hourBranchIndex = hour;
    
    return {
        heavenly_stem: {
            name: HEAVENLY_STEMS[hourStemIndex].name,
            character: HEAVENLY_STEMS[hourStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[hourBranchIndex].name,
            character: EARTHLY_BRANCHES[hourBranchIndex].character
        },
        hidden_stems: getHiddenStems(hourBranchIndex),
        gan_zhi: GANZHI_COMBINATIONS[(hourStemIndex * 6 + Math.floor(hourBranchIndex / 2)) % 60],
        life_cycle: getLifeCycleName((hourStemIndex + hourBranchIndex) % 12)
    };
}

function displayFourPillars(fourPillarsData) {
    displayPillar(fourPillarsData.year_pillar, "YearPillar");
    displayPillar(fourPillarsData.month_pillar, "MonthPillar");
    displayPillar(fourPillarsData.day_pillar, "DayPillar");
    displayPillar(fourPillarsData.hour_pillar, "HourPillar");
}

function displayLuckPillars(luckPillarsData) {
    const luckPillarsDiv = document.getElementById("luckPillars");

    // Clear existing Luck Pillars
    while (luckPillarsDiv.firstChild) {
        luckPillarsDiv.removeChild(luckPillarsDiv.firstChild);
    }

    // Find current luck pillar
    const currentPillarIndex = getCurrentLuckPillar(luckPillarsData.luck_pillars);

    // Display from right to left: Pillar 1 on the right
    // We need to reverse the array AND use normal flex direction
    const pillarsArray = luckPillarsData.luck_pillars;
    
    // Display in reverse order (last to first) so Pillar 1 appears on the right
    for (let i = pillarsArray.length - 1; i >= 0; i--) {
        const pillar = pillarsArray[i];
        const pillarDiv = document.createElement("div");
        pillarDiv.classList.add("pillar");
        
        // Add current period indicator
        if (i === currentPillarIndex) {
            pillarDiv.classList.add("current-period");
        }
        
        // Display the pillar with all information
        displayLuckPillar(pillar, pillarDiv);
        luckPillarsDiv.appendChild(pillarDiv);
    }
}

function getCurrentLuckPillar(luckPillarsData) {
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < luckPillarsData.length; i++) {
        const pillar = luckPillarsData[i];
        if (currentYear >= pillar.year_start && currentYear <= pillar.year_end) {
            return i; // Return the index of the current luck pillar
        }
    }
    
    return -1; // No current pillar found (before first or after last)
}

// Specialized function to display Luck Pillars with period labels and 12 Phrase
function displayLuckPillar(pillarData, div) {
    let heavenlyStemName = pillarData.heavenly_stem.name;
    let heavenlyStemCharacter = pillarData.heavenly_stem.character;
    let earthlyBranchName = pillarData.earthly_branch.name;
    let earthlyBranchCharacter = pillarData.earthly_branch.character;

    // Get element colors
    let heavenlyStemElement = heavenlyStemName.split(" ")[1];
    let earthlyBranchElement = branchAssociations[earthlyBranchName];
    
    // Calculate 10 Gods abbreviation for this Heavenly Stem
    let tenGodAbbreviation = '';
    if (pillarData.heavenly_stem && window.currentBaziData) {
        const stemName = pillarData.heavenly_stem.name;
        const stemIndex = HEAVENLY_STEMS.findIndex(s => s.name === stemName);
        
        if (stemIndex >= 0) {
            // Get Day Master info
            const dayMasterName = window.currentBaziData.four_pillars.day_pillar.heavenly_stem.name;
            const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => s.name === dayMasterName);
            const dayMasterElement = Math.floor(dayMasterIndex / 2);
            const dayMasterYinYang = dayMasterIndex % 2;
            
            // Calculate 10 God
            const element = Math.floor(stemIndex / 2);
            const yinYang = stemIndex % 2;
            
            let tenGodName = '';
            
            // Same element
            if (element === dayMasterElement) {
                tenGodName = yinYang === dayMasterYinYang ? 'Friend' : 'Rob Wealth';
            }
            // Output (Day Master produces)
            else if ((dayMasterElement + 1) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Eating God' : 'Hurting Officer';
            }
            // Wealth (Day Master controls)
            else if ((dayMasterElement + 2) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Indirect Wealth' : 'Direct Wealth';
            }
            // Officer (Controls Day Master)
            else if ((dayMasterElement + 3) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Seven Killings' : 'Direct Officer';
            }
            // Resource (Produces Day Master)
            else if ((dayMasterElement + 4) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Direct Resource' : 'Indirect Resource';
            }
            
            // Map to abbreviation
            const tenGodAbbrevMap = {
                'Friend': 'F',
                'Rob Wealth': 'RW',
                'Eating God': 'EG',
                'Hurting Officer': 'HO',
                'Direct Wealth': 'DW',
                'Indirect Wealth': 'IW',
                'Direct Officer': 'DO',
                'Seven Killings': '7K',
                'Direct Resource': 'DR',
                'Indirect Resource': 'IR'
            };
            
            tenGodAbbreviation = tenGodAbbrevMap[tenGodName] || '';
        }
    }

    // Calculate Nayin from Stem-Branch combination
    const nayinName = formatNayinName(getNayinFromStemBranch(heavenlyStemName, earthlyBranchName));
    const nayinElement = pillarData.gan_zhi ? pillarData.gan_zhi.element_name || "" : "";

    // Calculate 12 Phrase from Stem-Branch combination
    const phrase12 = formatLifeCycleName(heavenlyStemName, earthlyBranchName);
    
    // Extract Hidden Stems with 10 Gods - NEW FORMAT
    let hiddenStemsHTML = "";
    if (pillarData.hidden_stems) {
        const hiddenStems = pillarData.hidden_stems;
        let stemColumns = [];
        
        // Residual Qi (left column)
        if (hiddenStems.residual_qi) {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.residual_qi.element]}">${hiddenStems.residual_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.residual_qi.ten_gods || "--"}</div>
                </div>
            `);
        } else {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `);
        }
        
        // Main Qi (center column)
        if (hiddenStems.main_qi) {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.main_qi.element]}">${hiddenStems.main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.main_qi.ten_gods || "--"}</div>
                </div>
            `);
        } else {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `);
        }
        
        // Sub Main Qi (right column)
        if (hiddenStems.sub_main_qi) {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.sub_main_qi.element]}">${hiddenStems.sub_main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.sub_main_qi.ten_gods || "--"}</div>
                </div>
            `);
        } else {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `);
        }
        
        hiddenStemsHTML = `
            <div class="hidden-stems-container">
                <div class="hidden-stems-grid">
                    ${stemColumns.join('')}
                </div>
            </div>
        `;
    }

    // Get pillar number and period
    const pillarNumber = pillarData.number || "";
    const yearStart = pillarData.year_start || "";
    const yearEnd = pillarData.year_end || "";
    const title = pillarNumber ? `Luck ${pillarNumber}` : "Luck Pillar";
    
    // Check if this pillar's earthly branch has any Lucky Stars
    let luckyStarsIndicator = '';
    if (pillarData.earthly_branch && pillarData.earthly_branch.name) {
        // Get traditional branch name
        const branchEnglishName = pillarData.earthly_branch.name;
        const branchNameMap = {
            'Rat': 'Zi', 'Ox': 'Chou', 'Tiger': 'Yin', 'Rabbit': 'Mao',
            'Dragon': 'Chen', 'Snake': 'Si', 'Horse': 'Wu', 'Goat': 'Wei',
            'Monkey': 'Shen', 'Rooster': 'You', 'Dog': 'Xu', 'Pig': 'Hai'
        };
        const branchTraditional = branchNameMap[branchEnglishName] || branchEnglishName;
        
        // Check if this branch is in any lucky stars
        const starsForThisBranch = [];
        if (window.currentLuckyStars) {
            // Nobleman is an array
            if (Array.isArray(window.currentLuckyStars.nobleman) && window.currentLuckyStars.nobleman.includes(branchTraditional)) {
                starsForThisBranch.push('👑');
            }
            // Others are strings
            if (window.currentLuckyStars.intelligence && window.currentLuckyStars.intelligence === branchTraditional) {
                starsForThisBranch.push('🎓');
            }
            if (window.currentLuckyStars.peachBlossom && window.currentLuckyStars.peachBlossom === branchTraditional) {
                starsForThisBranch.push('');
            }
            if (window.currentLuckyStars.skyHorse && window.currentLuckyStars.skyHorse === branchTraditional) {
                starsForThisBranch.push('🦄');
            }
            if (window.currentLuckyStars.solitary && window.currentLuckyStars.solitary === branchTraditional) {
                starsForThisBranch.push('🌙');
            }
            if (window.currentLuckyStars.heavenlyDoctor && window.currentLuckyStars.heavenlyDoctor === branchTraditional) {
                starsForThisBranch.push('⚕️');
            }
            // Kong Wang (Dead Emptiness) - Array of 2 branches
            if (Array.isArray(window.currentLuckyStars.kongwang) && window.currentLuckyStars.kongwang.includes(branchTraditional)) {
                starsForThisBranch.push('☯️');  // Just the symbol, no text
            }
            
            // If there are lucky stars, show indicator
            if (starsForThisBranch.length > 0) {
                const stackedStars = starsForThisBranch.map(star => 
                    `<div style="font-size: 0.95rem; line-height: 1.2; margin-bottom: 2px;">${star}</div>`
                ).join('');
                
                luckyStarsIndicator = `<div style="position: absolute; top: 10px; right: 5px; display: flex; flex-direction: column; align-items: center; background: rgba(255,255,255,0.95); border-radius: 5px; padding: 3px 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.25); z-index: 10;">${stackedStars}</div>`;
            }
        }
    }

    // Build HTML with period label at bottom - matching main pillar structure
    const pillarHTML = `
        <div class="pillar-title">${title}</div>
        <div class="pillar-value">
            <div style="position: relative; display: inline-block;">
                <strong id="bigCharacter" style="color: ${elementColors[heavenlyStemElement]}">${heavenlyStemCharacter}</strong>
                ${tenGodAbbreviation ? `<span style="position: absolute; top: -5px; right: -25px; font-size: 0.75rem; font-weight: 700; color: #9b59b6; background: white; padding: 2px 4px; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">${tenGodAbbreviation}</span>` : ''}
            </div>
            <div id="bigValue" style="color: ${elementColors[heavenlyStemElement]}">${heavenlyStemName}</div>
        </div>
        <hr>
        <div class="pillar-value" style="position: relative;">
            <strong id="bigCharacter" style="color: ${elementColors[earthlyBranchElement]}">${earthlyBranchCharacter}</strong>
            <div id="bigValue" style="color: ${elementColors[earthlyBranchElement]}">${earthlyBranchName}</div>
            ${luckyStarsIndicator}
        </div>
        ${hiddenStemsHTML}
        <hr>
        <div class="ganzhi-separator">
            <strong style="color: ${elementColors[nayinElement]}">${nayinName}</strong>
        </div>
        <hr>
        <div class="lifecycle-separator">
            <div id="lifeCycle">${phrase12}</div>
        </div>
        <hr>
        <div class="luck-period-label">
            <div class="luck-period-number">Period:</div>
            <div>${yearStart}-${yearEnd}</div>
        </div>
    `;

    div.innerHTML = pillarHTML;
    
    // Add click event for drill-down interaction
    div.style.cursor = 'pointer';
    div.addEventListener('click', function() {
        handleLuckPillarClick(pillarData, div);
    });
}

// Handle Luck Pillar click - drill down to show Year/Month/Day/Hour for that period
function handleLuckPillarClick(pillarData, clickedDiv) {
    const luckPillarsData = window.currentBaziData.luck_pillars.luck_pillars;
    const pillarIndex = luckPillarsData.findIndex(p => p === pillarData);
    
    // If clicking the same pillar, deselect (go back to current)
    if (selectedPillars.luck === pillarIndex) {
        selectedPillars.luck = null;
        selectedPillars.year = null;
        selectedPillars.month = null;
        selectedPillars.day = null;
        selectedPillars.yearPillar = null;
        selectedPillars.monthPillar = null;
        selectedPillars.dayPillar = null;
    } else {
        // Select this luck pillar and reset lower levels
        selectedPillars.luck = pillarIndex;
        selectedPillars.year = null;
        selectedPillars.month = null;
        selectedPillars.day = null;
        selectedPillars.yearPillar = null;
        selectedPillars.monthPillar = null;
        selectedPillars.dayPillar = null;
    }
    
    // Update visual indicators
    updateLuckPillarSelection();
    
    // Refresh dependent rows, Current pillars, and interactive Annual calculations
    refreshInteractivePillars();
}

// Update visual indicators for selected Luck Pillar
function updateLuckPillarSelection() {
    const luckPillarsDiv = document.getElementById("luckPillars");
    const allPillars = luckPillarsDiv.querySelectorAll('.pillar');
    
    allPillars.forEach((pillarDiv, index) => {
        // Find the actual pillar index (reversed order)
        const luckPillarsData = window.currentBaziData.luck_pillars.luck_pillars;
        const actualIndex = luckPillarsData.length - 1 - index;
        
        if (actualIndex === selectedPillars.luck) {
            pillarDiv.classList.add('selected-pillar');
            pillarDiv.style.border = '3px solid #e74c3c';
            pillarDiv.style.background = 'rgba(231, 76, 60, 0.1)';
        } else {
            pillarDiv.classList.remove('selected-pillar');
            pillarDiv.style.border = '';
            pillarDiv.style.background = '';
        }
    });
}

function addCurrentPeriodMetadata(pillar, label, value) {
    return {
        ...pillar,
        period_label: label,
        period_value: value
    };
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getCurrentLuckPillarIndexForDate(currentDate, luckPillarsData) {
    const currentYear = currentDate.getFullYear();
    for (let i = 0; i < luckPillarsData.luck_pillars.length; i++) {
        const pillar = luckPillarsData.luck_pillars[i];
        if (currentYear >= pillar.year_start && currentYear <= pillar.year_end) {
            return i;
        }
    }
    return -1;
}

function enrichLuckPillarForCurrent(pillar) {
    if (!pillar) return null;
    const stemName = pillar.heavenly_stem.name;
    const branchName = pillar.earthly_branch.name;
    const branchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === branchName);
    const nayinName = getNayinFromStemBranch(stemName, branchName);
    const phrase12 = formatLifeCycleName(stemName, branchName);
    
    return addCurrentPeriodMetadata({
        heavenly_stem: pillar.heavenly_stem,
        earthly_branch: pillar.earthly_branch,
        hidden_stems: pillar.hidden_stems || getHiddenStemsWithTenGods(branchIndex, HEAVENLY_STEMS.findIndex(s => s.name === window.currentBaziData.four_pillars.day_pillar.heavenly_stem.name)),
        gan_zhi: { name: nayinName, element_name: "" },
        life_cycle: phrase12,
        luck_period: `${pillar.year_start}-${pillar.year_end}`
    }, 'Period:', `${pillar.year_start}-${pillar.year_end}`);
}

function getActiveCurrentContext(luckPillarsData) {
    const realDate = new Date();
    const activeLuckPillar = selectedPillars.luck !== null ? luckPillarsData.luck_pillars[selectedPillars.luck] : null;
    
    let year = selectedPillars.year;
    if (year === null) {
        if (activeLuckPillar) {
            const realYear = realDate.getFullYear();
            year = realYear >= activeLuckPillar.year_start && realYear <= activeLuckPillar.year_end
                ? realYear
                : activeLuckPillar.year_start;
        } else {
            year = realDate.getFullYear();
        }
    }
    
    const month = selectedPillars.month !== null ? selectedPillars.month : realDate.getMonth() + 1;
    const maxDay = getDaysInMonth(year, month);
    const day = selectedPillars.day !== null ? Math.min(selectedPillars.day, maxDay) : Math.min(realDate.getDate(), maxDay);
    const activeDate = new Date(year, month - 1, day, realDate.getHours(), realDate.getMinutes(), realDate.getSeconds());
    
    return { activeDate, year, month, day, activeLuckPillar };
}

function getActiveCurrentPillars(fourPillarsData, luckPillarsData) {
    const monthNamesFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const context = getActiveCurrentContext(luckPillarsData);
    
    const currentLuckPillar = selectedPillars.luck !== null
        ? enrichLuckPillarForCurrent(luckPillarsData.luck_pillars[selectedPillars.luck])
        : (() => {
            const pillar = calculateCurrentLuckPillar(new Date(), fourPillarsData, luckPillarsData);
            return pillar.luck_period ? addCurrentPeriodMetadata(pillar, 'Period:', pillar.luck_period) : pillar;
        })();
    
    const currentYearPillar = addCurrentPeriodMetadata(
        selectedPillars.yearPillar || calculateCurrentYearPillar(context.activeDate, fourPillarsData),
        'Year:',
        String(context.year)
    );
    
    const currentMonthPillar = addCurrentPeriodMetadata(
        selectedPillars.monthPillar || calculateCurrentMonthPillar(context.activeDate, fourPillarsData),
        'Month:',
        `${monthNamesFull[context.month - 1]} ${context.year}`
    );
    
    const currentDayPillar = addCurrentPeriodMetadata(
        selectedPillars.dayPillar || calculateCurrentDayPillar(context.activeDate, fourPillarsData),
        'Date:',
        `${context.day} ${monthNamesShort[context.month - 1]} ${context.year}`
    );
    
    return {
        current_luck: currentLuckPillar,
        current_year: currentYearPillar,
        current_month: currentMonthPillar,
        current_day: currentDayPillar,
        context
    };
}

function refreshInteractivePillars() {
    if (!window.currentBaziData) return;
    displayTimePeriodRows(window.currentBaziData.four_pillars, window.currentBaziData.luck_pillars);
    displayCurrentPillars(window.currentBaziData.four_pillars, window.currentBaziData.luck_pillars);
}

function displayCurrentPillars(fourPillarsData, luckPillarsData) {
    const activeCurrentPillars = getActiveCurrentPillars(fourPillarsData, luckPillarsData);
    
    displayPillar(activeCurrentPillars.current_month, "CurrentMonthPillar");
    displayPillar(activeCurrentPillars.current_day, "CurrentDayPillar");
    displayPillar(activeCurrentPillars.current_year, "CurrentYearPillar");
    displayPillar(activeCurrentPillars.current_luck, "CurrentLuckPillar");
    
    // Update combinations for all pillars
    detectAndDisplayHSCombinations(fourPillarsData, luckPillarsData);
    
    // Update Element Composition and 10 Gods using the same active Current pillars
    updateElementComposition(fourPillarsData, luckPillarsData, activeCurrentPillars);
}

// Update Element Composition with current pillars
function updateElementComposition(fourPillarsData, luckPillarsData, activeCurrentPillars = null) {
    const currentPillars = activeCurrentPillars || getActiveCurrentPillars(fourPillarsData, luckPillarsData);
    
    // Recalculate element structure
    const elementData = calculateElementStructure(fourPillarsData, currentPillars);
    displayElementStructure(elementData);
    
    // Calculate and display 10 Gods
    const tenGodsData = calculateTenGods(fourPillarsData, currentPillars);
    displayTenGods(tenGodsData);
    
    console.log("Element Composition and 10 Gods updated with current pillars");
}

// Calculate 10 Gods points
function calculateTenGods(fourPillarsData, currentPillars) {
    const dayMasterName = fourPillarsData.day_pillar.heavenly_stem.name;
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => s.name === dayMasterName);
    const dayMasterElement = Math.floor(dayMasterIndex / 2); // 0=Wood, 1=Fire, 2=Earth, 3=Metal, 4=Water
    
    // CORRECTED: Even index = Yang, Odd index = Yin
    // Jia(0)=Yang, Yi(1)=Yin, Bing(2)=Yang, Ding(3)=Yin, etc.
    const dayMasterYinYang = dayMasterIndex % 2; // 0=Yang, 1=Yin
    
    // 10 Gods definitions
    const tenGodsNames = [
        'Friend',         // Bi Jian 比肩 - Same element, same yin/yang (both Yang or both Yin)
        'Rob Wealth',     // Jie Cai 劫财 - Same element, different yin/yang
        'Eating God',     // Shi Shen 食神 - Output, same yin/yang
        'Hurting Officer', // Shang Guan 伤官 - Output, different yin/yang
        'Direct Wealth',   // Zheng Cai 正财 - Wealth, different yin/yang
        'Indirect Wealth', // Pian Cai 偏财 - Wealth, same yin/yang
        'Direct Officer',  // Zheng Guan 正官 - Officer, different yin/yang
        'Seven Killings',  // Qi Sha 七杀 - Officer, same yin/yang
        'Direct Resource', // Zheng Yin 正印 - Resource, same yin/yang
        'Indirect Resource' // Pian Yin 偏印 - Resource, different yin/yang
    ];
    
    // Initialize points for each 10 God
    const tenGodsPoints = {
        natal: {},   // 4 pillars only
        annual: {}   // 4 pillars + current pillars
    };
    
    // Track which stems contribute to each 10 God
    const tenGodsStems = {
        natal: {},   // Track stem characters for natal
        annual: {}   // Track stem characters for annual
    };
    
    tenGodsNames.forEach(name => {
        tenGodsPoints.natal[name] = 0;
        tenGodsPoints.annual[name] = 0;
        tenGodsStems.natal[name] = new Set();  // Use Set to avoid duplicates
        tenGodsStems.annual[name] = new Set();
    });
    
    // Helper function to determine 10 God from stem index
    const getTenGodFromStem = (stemIndex) => {
        const element = Math.floor(stemIndex / 2);
        const yinYang = stemIndex % 2;
        
        // Same element
        if (element === dayMasterElement) {
            return yinYang === dayMasterYinYang ? 'Friend' : 'Rob Wealth';
        }
        
        // Output (Day Master produces)
        if ((dayMasterElement + 1) % 5 === element) {
            return yinYang === dayMasterYinYang ? 'Eating God' : 'Hurting Officer';
        }
        
        // Wealth (Day Master controls)
        if ((dayMasterElement + 2) % 5 === element) {
            return yinYang === dayMasterYinYang ? 'Indirect Wealth' : 'Direct Wealth';
        }
        
        // Officer (Controls Day Master)
        if ((dayMasterElement + 3) % 5 === element) {
            return yinYang === dayMasterYinYang ? 'Seven Killings' : 'Direct Officer';
        }
        
        // Resource (Produces Day Master)
        if ((dayMasterElement + 4) % 5 === element) {
            return yinYang === dayMasterYinYang ? 'Direct Resource' : 'Indirect Resource';
        }
        
        return null;
    };
    
    // Helper function to add points
    const addPoints = (stemIndex, targetType, weight) => {
        const tenGod = getTenGodFromStem(stemIndex);
        if (tenGod) {
            tenGodsPoints[targetType][tenGod] += weight;
            // Track the stem character
            const stemChar = HEAVENLY_STEMS[stemIndex].character;
            tenGodsStems[targetType][tenGod].add(stemChar);
        }
    };
    
    // Calculate for Natal Chart (4 pillars only)
    const natalPillars = [
        fourPillarsData.year_pillar,
        fourPillarsData.month_pillar,
        fourPillarsData.day_pillar,
        fourPillarsData.hour_pillar
    ];
    
    natalPillars.forEach(pillar => {
        if (!pillar) return;
        
        // Heavenly Stem - weight 1.0
        if (pillar.heavenly_stem) {
            const stemIndex = pillar.heavenly_stem.index ?? HEAVENLY_STEMS.findIndex(s => s.name === pillar.heavenly_stem.name);
            addPoints(stemIndex, 'natal', 1.0);
        }
        
        // Hidden Stems
        if (pillar.hidden_stems) {
            const hiddenStems = pillar.hidden_stems;
            
            // Check branch type for special Qi weights
            const branchName = pillar.earthly_branch ? pillar.earthly_branch.name : '';
            const isMaoYouZi = branchName === 'Rabbit' || branchName === 'Rooster' || branchName === 'Rat';
            const isHaiOrWu = branchName === 'Pig' || branchName === 'Horse';
            
            let mainQiWeight, subMainQiWeight, residualQiWeight;
            
            if (isMaoYouZi) {
                // Type 1: Only Main Qi, no Sub/Residual
                mainQiWeight = 1.0;
                subMainQiWeight = 0;
                residualQiWeight = 0;
            } else if (isHaiOrWu) {
                // Type 2: Main + Sub, no Residual
                mainQiWeight = 0.8;
                subMainQiWeight = 0.2;
                residualQiWeight = 0;
            } else {
                // Type 3: Normal - Main + Sub + Residual
                mainQiWeight = 0.7;
                subMainQiWeight = 0.2;
                residualQiWeight = 0.1;
            }
            
            // Main Qi
            if (hiddenStems.main_qi) {
                const mainIndex = hiddenStems.main_qi.index ?? HEAVENLY_STEMS.findIndex(s => s.name === hiddenStems.main_qi.name);
                addPoints(mainIndex, 'natal', mainQiWeight);
            }
            
            // Sub Main Qi (only if weight > 0)
            if (hiddenStems.sub_main_qi && subMainQiWeight > 0) {
                const subIndex = hiddenStems.sub_main_qi.index ?? HEAVENLY_STEMS.findIndex(s => s.name === hiddenStems.sub_main_qi.name);
                addPoints(subIndex, 'natal', subMainQiWeight);
            }
            
            // Residual Qi (only if weight > 0)
            if (hiddenStems.residual_qi && residualQiWeight > 0) {
                const residualIndex = hiddenStems.residual_qi.index ?? HEAVENLY_STEMS.findIndex(s => s.name === hiddenStems.residual_qi.name);
                addPoints(residualIndex, 'natal', residualQiWeight);
            }
        }
    });
    
    // Calculate for Annual (ALL 8 pillars: 4 natal + 4 current)
    // Reset annual points first
    tenGodsNames.forEach(name => {
        tenGodsPoints.annual[name] = 0;
    });
    
    // Add 4 Natal Pillars
    natalPillars.forEach(pillar => {
        if (!pillar) return;
        
        // Heavenly Stem - weight 1.0
        if (pillar.heavenly_stem) {
            const stemIndex = pillar.heavenly_stem.index ?? HEAVENLY_STEMS.findIndex(s => s.name === pillar.heavenly_stem.name);
            addPoints(stemIndex, 'annual', 1.0);
        }
        
        // Hidden Stems
        if (pillar.hidden_stems) {
            const hiddenStems = pillar.hidden_stems;
            
            // Check branch type for special Qi weights
            const branchName = pillar.earthly_branch ? pillar.earthly_branch.name : '';
            const isMaoYouZi = branchName === 'Rabbit' || branchName === 'Rooster' || branchName === 'Rat';
            const isHaiOrWu = branchName === 'Pig' || branchName === 'Horse';
            
            let mainQiWeight, subMainQiWeight, residualQiWeight;
            
            if (isMaoYouZi) {
                mainQiWeight = 1.0;
                subMainQiWeight = 0;
                residualQiWeight = 0;
            } else if (isHaiOrWu) {
                mainQiWeight = 0.8;
                subMainQiWeight = 0.2;
                residualQiWeight = 0;
            } else {
                mainQiWeight = 0.7;
                subMainQiWeight = 0.2;
                residualQiWeight = 0.1;
            }
            
            if (hiddenStems.main_qi) {
                const mainIndex = hiddenStems.main_qi.index ?? HEAVENLY_STEMS.findIndex(s => s.name === hiddenStems.main_qi.name);
                addPoints(mainIndex, 'annual', mainQiWeight);
            }
            
            if (hiddenStems.sub_main_qi && subMainQiWeight > 0) {
                const subIndex = hiddenStems.sub_main_qi.index ?? HEAVENLY_STEMS.findIndex(s => s.name === hiddenStems.sub_main_qi.name);
                addPoints(subIndex, 'annual', subMainQiWeight);
            }
            
            if (hiddenStems.residual_qi && residualQiWeight > 0) {
                const residualIndex = hiddenStems.residual_qi.index ?? HEAVENLY_STEMS.findIndex(s => s.name === hiddenStems.residual_qi.name);
                addPoints(residualIndex, 'annual', residualQiWeight);
            }
        }
    });
    
    // Add 4 Current Pillars
    const currentPillarsList = [];
    if (currentPillars.current_luck) currentPillarsList.push(currentPillars.current_luck);
    if (currentPillars.current_year) currentPillarsList.push(currentPillars.current_year);
    if (currentPillars.current_month) currentPillarsList.push(currentPillars.current_month);
    if (currentPillars.current_day) currentPillarsList.push(currentPillars.current_day);
    
    currentPillarsList.forEach(pillar => {
        if (!pillar) return;
        
        // Heavenly Stem - weight 1.0
        if (pillar.heavenly_stem) {
            const stemIndex = pillar.heavenly_stem.index ?? HEAVENLY_STEMS.findIndex(s => s.name === pillar.heavenly_stem.name);
            addPoints(stemIndex, 'annual', 1.0);
        }
        
        // Hidden Stems
        if (pillar.hidden_stems) {
            const hiddenStems = pillar.hidden_stems;
            
            // Check branch type for special Qi weights
            const branchName = pillar.earthly_branch ? pillar.earthly_branch.name : '';
            const isMaoYouZi = branchName === 'Rabbit' || branchName === 'Rooster' || branchName === 'Rat';
            const isHaiOrWu = branchName === 'Pig' || branchName === 'Horse';
            
            let mainQiWeight, subMainQiWeight, residualQiWeight;
            
            if (isMaoYouZi) {
                mainQiWeight = 1.0;
                subMainQiWeight = 0;
                residualQiWeight = 0;
            } else if (isHaiOrWu) {
                mainQiWeight = 0.8;
                subMainQiWeight = 0.2;
                residualQiWeight = 0;
            } else {
                mainQiWeight = 0.7;
                subMainQiWeight = 0.2;
                residualQiWeight = 0.1;
            }
            
            if (hiddenStems.main_qi) {
                const mainIndex = hiddenStems.main_qi.index ?? HEAVENLY_STEMS.findIndex(s => s.name === hiddenStems.main_qi.name);
                addPoints(mainIndex, 'annual', mainQiWeight);
            }
            
            if (hiddenStems.sub_main_qi && subMainQiWeight > 0) {
                const subIndex = hiddenStems.sub_main_qi.index ?? HEAVENLY_STEMS.findIndex(s => s.name === hiddenStems.sub_main_qi.name);
                addPoints(subIndex, 'annual', subMainQiWeight);
            }
            
            if (hiddenStems.residual_qi && residualQiWeight > 0) {
                const residualIndex = hiddenStems.residual_qi.index ?? HEAVENLY_STEMS.findIndex(s => s.name === hiddenStems.residual_qi.name);
                addPoints(residualIndex, 'annual', residualQiWeight);
            }
        }
    });
    
    return {
        points: tenGodsPoints,
        stems: tenGodsStems
    };
}

// Display 10 Gods sorted by points
function displayTenGods(tenGodsData) {
    const container = document.getElementById('tenGodsContainer');
    if (!container) return;
    
    // Extract points and stems from the new structure
    const tenGodsPoints = tenGodsData.points;
    const tenGodsStems = tenGodsData.stems;
    
    // Correct Chinese characters with proper Unicode - Pinyin + Chinese
    const tenGodsChinese = {
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
        .sort((a, b) => b[1] - a[1]);
    
    // Calculate totals for percentage
    const totalNatal = Object.values(tenGodsPoints.natal).reduce((sum, p) => sum + p, 0);
    const totalAnnual = Object.values(tenGodsPoints.annual).reduce((sum, p) => sum + p, 0);
    
    // Build HTML with better layout
    let html = '<div style="display: flex; flex-direction: column; gap: 8px;">';
    
    sortedGods.forEach(([godName, natalPoints]) => {
        const annualPoints = tenGodsPoints.annual[godName] || 0;
        const pinyinChinese = tenGodsChinese[godName] || '';
        
        // Get stem characters from both Natal and Annual
        const natalStemsSet = tenGodsStems.natal[godName] || new Set();
        const annualStemsSet = tenGodsStems.annual[godName] || new Set();
        
        // Combine all stems from Natal and Annual - every 10 God must have stem characters
        const allStemsSet = new Set([...natalStemsSet, ...annualStemsSet]);
        const allStems = Array.from(allStemsSet).join(' ');
        
        // Separate stems by source for display
        const natalStems = natalStemsSet.size > 0 
            ? Array.from(natalStemsSet).join(' ') 
            : '';  // Empty if no natal stems
        const annualStems = annualStemsSet.size > 0 
            ? Array.from(annualStemsSet).join(' ') 
            : '';  // Empty if no annual stems
        
        // DEBUG: Log each 10 God
        console.log(`10 God: ${godName} | Natal: ${natalPoints} (${natalStems || 'none'}) | Annual: ${annualPoints} (${annualStems || 'none'}) | Combined: ${allStems}`);
        
        // Calculate percentages
        const natalPercent = totalNatal > 0 ? (natalPoints / totalNatal * 100).toFixed(1) : '0.0';
        const annualPercent = totalAnnual > 0 ? (annualPoints / totalAnnual * 100).toFixed(1) : '0.0';
        
        html += `
            <div style="background: white; border-radius: 8px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.08); border-left: 4px solid #9b59b6;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
                        <span style="font-size: 1.2rem; font-weight: 700; color: #9b59b6; min-width: 30px; text-align: center;">${allStems}</span>
                        <span style="font-weight: 700; color: #2c3e50; font-size: 0.95rem;">
                            ${godName}
                        </span>
                    </div>
                    <div style="font-size: 0.85rem; color: #7f8c8d; font-weight: 500;">
                        (${pinyinChinese})
                    </div>
                </div>
                <div style="display: flex; gap: 24px; align-items: center;">
                    <div style="text-align: right; min-width: 75px;">
                        <div style="color: #95a5a6; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Natal</div>
                        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                            <span style="font-size: 0.9rem; color: #9b59b6; font-weight: 600;">${natalStems}</span>
                            <span style="color: #e74c3c; font-weight: 700; font-size: 1rem;">${natalPercent}%</span>
                        </div>
                    </div>
                    <div style="text-align: right; min-width: 75px;">
                        <div style="color: #95a5a6; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Annual</div>
                        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                            <span style="font-size: 0.9rem; color: #9b59b6; font-weight: 600;">${annualStems}</span>
                            <span style="color: #3498db; font-weight: 700; font-size: 1rem;">${annualPercent}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function displayTimePeriodRows(fourPillarsData, luckPillarsData) {
    if (!birthTimeData) return;
    
    const birthDate = new Date(birthTimeData.dateTime);
    const currentDate = new Date();
    const currentAge = currentDate.getFullYear() - birthDate.getFullYear();
    
    // Use the actual start age from the first luck pillar instead of fixed values
    const firstLuckPillar = luckPillarsData.luck_pillars[0];
    const baseAge = firstLuckPillar.year_start - birthDate.getFullYear();
    const luckPillarIndex = Math.floor((currentAge - baseAge) / 10);
    
    // Check if we have selected pillars (from drill-down interaction)
    const selectedLuck = selectedPillars.luck;
    const selectedYear = selectedPillars.year;
    const selectedMonth = selectedPillars.month;
    
    if (selectedLuck !== null) {
        // Use selected luck pillar
        const activeLuckPillar = luckPillarsData.luck_pillars[selectedLuck];
        const startYear = activeLuckPillar.year_start;
        const endYear = activeLuckPillar.year_end;
        
        fetchAndDisplayYearPillars(startYear, endYear);
        
        const activeContext = getActiveCurrentContext(luckPillarsData);
        fetchAndDisplayMonthPillars(activeContext.year);
        fetchAndDisplayDayPillars(activeContext.year, activeContext.month);
        fetchAndDisplayHourPillars(activeContext.year, activeContext.month, activeContext.day);
    } else if (selectedYear !== null) {
        // Year selected, show that year's months
        fetchAndDisplayYearPillars(selectedYear, selectedYear);
        
        const activeContext = getActiveCurrentContext(luckPillarsData);
        fetchAndDisplayMonthPillars(selectedYear);
        fetchAndDisplayDayPillars(selectedYear, activeContext.month);
        fetchAndDisplayHourPillars(selectedYear, activeContext.month, activeContext.day);
    } else if (selectedMonth !== null) {
        // Month selected, show that month's days
        const activeContext = getActiveCurrentContext(luckPillarsData);
        const yearToShow = activeContext.year;
        fetchAndDisplayMonthPillars(yearToShow);
        fetchAndDisplayDayPillars(yearToShow, selectedMonth);
        fetchAndDisplayHourPillars(yearToShow, selectedMonth, activeContext.day);
    } else if (selectedPillars.day !== null) {
        // Day selected, show that day's hours
        const activeContext = getActiveCurrentContext(luckPillarsData);
        fetchAndDisplayDayPillars(activeContext.year, activeContext.month);
        fetchAndDisplayHourPillars(activeContext.year, activeContext.month, selectedPillars.day);
    } else {
        // Default: show current time periods
        if (luckPillarIndex >= 0 && luckPillarIndex < luckPillarsData.luck_pillars.length) {
            const activeLuckPillar = luckPillarsData.luck_pillars[luckPillarIndex];
            const startYear = activeLuckPillar.year_start;
            const endYear = activeLuckPillar.year_end;
            
            // Fetch year pillars for the current 10-year period from backend
            fetchAndDisplayYearPillars(startYear, endYear);
            
            // Fetch month pillars for the current year from backend
            fetchAndDisplayMonthPillars(currentDate.getFullYear());
            
            // Fetch day pillars for the current month from backend
            fetchAndDisplayDayPillars(currentDate.getFullYear(), currentDate.getMonth() + 1);
            
            // Fetch hour pillars for today from backend
            fetchAndDisplayHourPillars(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
        }
    }
}

function fetchAndDisplayYearPillars(startYear, endYear) {
    const requestData = {
        start_year: startYear,
        end_year: endYear,
        birth_time: birthTimeData.dateTime
    };
    
    fetch('/calculate_yearly', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("yearPillarsRow");
        container.innerHTML = '';
        
        const yearPillars = data.yearly_pillars;
        yearPillars.forEach((yearPillar, index) => {
            const pillarDiv = createTimePeriodPillar(yearPillar, yearPillar.year.toString());
            
            // Add click event for drill-down
            pillarDiv.style.cursor = 'pointer';
            pillarDiv.addEventListener('click', function() {
                handleYearPillarClick(yearPillar, pillarDiv);
            });
            
            // Detect both HS and Branch interactions for this year pillar
            const {hsCombos, branchInteractions} = detectTimePeriodCombinations(yearPillar, yearPillars, index, 'year');
            addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions);
            
            container.appendChild(pillarDiv);
        });
        
        // Update visual selection
        updateYearPillarSelection();
    })
    .catch(error => console.error('Error fetching year pillars:', error));
}

// Handle Year Pillar click - drill down to show Month/Day/Hour for that year
function handleYearPillarClick(pillarData, clickedDiv) {
    const year = pillarData.year;
    
    // If clicking the same year, deselect
    if (selectedPillars.year === year) {
        selectedPillars.year = null;
        selectedPillars.month = null;
        selectedPillars.day = null;
        selectedPillars.yearPillar = null;
        selectedPillars.monthPillar = null;
        selectedPillars.dayPillar = null;
    } else {
        // Select this year and reset lower levels
        selectedPillars.year = year;
        selectedPillars.month = null;
        selectedPillars.day = null;
        selectedPillars.yearPillar = pillarData;
        selectedPillars.monthPillar = null;
        selectedPillars.dayPillar = null;
    }
    
    // Update visual indicators
    updateYearPillarSelection();
    
    // Refresh dependent rows, Current pillars, and interactive Annual calculations
    refreshInteractivePillars();
}

// Update visual indicators for selected Year Pillar
function updateYearPillarSelection() {
    const container = document.getElementById("yearPillarsRow");
    const allPillars = container.querySelectorAll('.time-period-pillar');
    
    allPillars.forEach(pillarDiv => {
        const yearText = pillarDiv.querySelector('.time-period-title')?.textContent;
        const year = parseInt(yearText);
        
        if (year === selectedPillars.year) {
            pillarDiv.classList.add('selected-pillar');
            pillarDiv.style.border = '3px solid #e74c3c';
            pillarDiv.style.background = 'rgba(231, 76, 60, 0.1)';
        } else {
            pillarDiv.classList.remove('selected-pillar');
            pillarDiv.style.border = '';
            pillarDiv.style.background = '';
        }
    });
}

function fetchAndDisplayMonthPillars(year) {
    const requestData = {
        year: year,
        birth_time: birthTimeData.dateTime
    };
    
    fetch('/calculate_monthly', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("monthPillarsRow");
        container.innerHTML = '';
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const monthPillars = data.monthly_pillars;
        monthPillars.forEach((monthPillar, index) => {
            const pillarDiv = createTimePeriodPillar(monthPillar, monthNames[index] || monthPillar.month_english);
            
            // Add click event for drill-down
            pillarDiv.style.cursor = 'pointer';
            pillarDiv.addEventListener('click', function() {
                handleMonthPillarClick(monthPillar, pillarDiv, index + 1);
            });
            
            // Detect both HS and Branch interactions for this month pillar
            const {hsCombos, branchInteractions} = detectTimePeriodCombinations(monthPillar, monthPillars, index, 'month');
            addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions);
            
            container.appendChild(pillarDiv);
        });
        
        // Update visual selection
        updateMonthPillarSelection();
    })
    .catch(error => console.error('Error fetching month pillars:', error));
}

// Handle Month Pillar click - drill down to show Day/Hour for that month
function handleMonthPillarClick(pillarData, clickedDiv, monthNum) {
    // If clicking the same month, deselect
    if (selectedPillars.month === monthNum) {
        selectedPillars.month = null;
        selectedPillars.day = null;
        selectedPillars.monthPillar = null;
        selectedPillars.dayPillar = null;
    } else {
        // Select this month and reset lower levels
        selectedPillars.month = monthNum;
        selectedPillars.day = null;
        selectedPillars.monthPillar = pillarData;
        selectedPillars.dayPillar = null;
    }
    
    // Update visual indicators
    updateMonthPillarSelection();
    
    // Refresh dependent rows, Current pillars, and interactive Annual calculations
    refreshInteractivePillars();
}

// Update visual indicators for selected Month Pillar
function updateMonthPillarSelection() {
    const container = document.getElementById("monthPillarsRow");
    const allPillars = container.querySelectorAll('.time-period-pillar');
    
    allPillars.forEach((pillarDiv, index) => {
        const monthNum = index + 1; // Jan=1, Feb=2, etc.
        
        if (monthNum === selectedPillars.month) {
            pillarDiv.classList.add('selected-pillar');
            pillarDiv.style.border = '3px solid #e74c3c';
            pillarDiv.style.background = 'rgba(231, 76, 60, 0.1)';
        } else {
            pillarDiv.classList.remove('selected-pillar');
            pillarDiv.style.border = '';
            pillarDiv.style.background = '';
        }
    });
}

function fetchAndDisplayDayPillars(year, month) {
    const requestData = {
        year: year,
        month: month,
        birth_time: birthTimeData.dateTime
    };
    
    fetch('/calculate_daily', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("dayPillarsRow");
        container.innerHTML = '';
        
        const dayPillars = data.daily_pillars;
        dayPillars.forEach((dayPillar, index) => {
            const pillarDiv = createTimePeriodPillar(dayPillar, dayPillar.day.toString());
            
            // Add click event for drill-down
            pillarDiv.style.cursor = 'pointer';
            pillarDiv.addEventListener('click', function() {
                handleDayPillarClick(dayPillar, pillarDiv, dayPillar.day);
            });
            
            // Detect both HS and Branch interactions for this day pillar
            const {hsCombos, branchInteractions} = detectTimePeriodCombinations(dayPillar, dayPillars, index, 'day');
            addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions);
            
            container.appendChild(pillarDiv);
        });
        
        // Update visual selection
        updateDayPillarSelection();
    })
    .catch(error => console.error('Error fetching day pillars:', error));
}

// Handle Day Pillar click - drill down to show Hour for that day
function handleDayPillarClick(pillarData, clickedDiv, dayNum) {
    // If clicking the same day, deselect
    if (selectedPillars.day === dayNum) {
        selectedPillars.day = null;
        selectedPillars.dayPillar = null;
    } else {
        // Select this day
        selectedPillars.day = dayNum;
        selectedPillars.dayPillar = pillarData;
    }
    
    // Update visual indicators
    updateDayPillarSelection();
    
    // Refresh dependent rows, Current pillars, and interactive Annual calculations
    refreshInteractivePillars();
}

// Update visual indicators for selected Day Pillar
function updateDayPillarSelection() {
    const container = document.getElementById("dayPillarsRow");
    const allPillars = container.querySelectorAll('.time-period-pillar');
    
    allPillars.forEach((pillarDiv, index) => {
        const pillarTitle = pillarDiv.querySelector('.time-period-title')?.textContent;
        const pillarDay = parseInt(pillarTitle);
        
        if (pillarDay === selectedPillars.day) {
            pillarDiv.classList.add('selected-pillar');
            pillarDiv.style.border = '3px solid #e74c3c';
            pillarDiv.style.background = 'rgba(231, 76, 60, 0.1)';
        } else {
            pillarDiv.classList.remove('selected-pillar');
            pillarDiv.style.border = '';
            pillarDiv.style.background = '';
        }
    });
}

function fetchAndDisplayHourPillars(year, month, day) {
    const requestData = {
        year: year,
        month: month,
        day: day,
        birth_time: birthTimeData.dateTime
    };
    
    fetch('/calculate_hourly', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("hourPillarsRow");
        container.innerHTML = '';
        
        const hourTimes = ["23-01", "01-03", "03-05", "05-07", "07-09", "09-11",
                          "11-13", "13-15", "15-17", "17-19", "19-21", "21-23"];
        
        const hourPillars = data.hourly_pillars;
        hourPillars.forEach((hourPillar, index) => {
            const pillarDiv = createTimePeriodPillar(hourPillar, hourTimes[index] || hourPillar.hour_time);
            
            // Detect both HS and Branch interactions for this hour pillar
            const {hsCombos, branchInteractions} = detectTimePeriodCombinations(hourPillar, hourPillars, index, 'hour');
            addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions);
            
            container.appendChild(pillarDiv);
        });
    })
    .catch(error => console.error('Error fetching hour pillars:', error));
}

function createTimePeriodPillar(pillarData, title) {
    const div = document.createElement('div');
    div.className = 'time-period-pillar';
    
    const heavenlyStemElement = pillarData.heavenly_stem.name.split(" ")[1];
    const earthlyBranchElement = branchAssociations[pillarData.earthly_branch.name];
    const ganZhiName = formatNayinName(getNayinFromStemBranch(pillarData.heavenly_stem.name, pillarData.earthly_branch.name));
    const ganZhiElement = pillarData.gan_zhi ? pillarData.gan_zhi.element_name : "";
    const lifeCycleName = formatLifeCycleName(pillarData.heavenly_stem.name, pillarData.earthly_branch.name);
    
    // Calculate 10 Gods abbreviation for this Heavenly Stem
    let tenGodAbbreviation = '';
    if (pillarData.heavenly_stem && window.currentBaziData) {
        const stemName = pillarData.heavenly_stem.name;
        const stemIndex = HEAVENLY_STEMS.findIndex(s => s.name === stemName);
        
        if (stemIndex >= 0) {
            // Get Day Master info
            const dayMasterName = window.currentBaziData.four_pillars.day_pillar.heavenly_stem.name;
            const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => s.name === dayMasterName);
            const dayMasterElement = Math.floor(dayMasterIndex / 2);
            const dayMasterYinYang = dayMasterIndex % 2;
            
            // Calculate 10 God
            const element = Math.floor(stemIndex / 2);
            const yinYang = stemIndex % 2;
            
            let tenGodName = '';
            
            // Same element
            if (element === dayMasterElement) {
                tenGodName = yinYang === dayMasterYinYang ? 'Friend' : 'Rob Wealth';
            }
            // Output (Day Master produces)
            else if ((dayMasterElement + 1) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Eating God' : 'Hurting Officer';
            }
            // Wealth (Day Master controls)
            else if ((dayMasterElement + 2) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Indirect Wealth' : 'Direct Wealth';
            }
            // Officer (Controls Day Master)
            else if ((dayMasterElement + 3) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Seven Killings' : 'Direct Officer';
            }
            // Resource (Produces Day Master)
            else if ((dayMasterElement + 4) % 5 === element) {
                tenGodName = yinYang === dayMasterYinYang ? 'Direct Resource' : 'Indirect Resource';
            }
            
            // Map to abbreviation
            const tenGodAbbrevMap = {
                'Friend': 'F',
                'Rob Wealth': 'RW',
                'Eating God': 'EG',
                'Hurting Officer': 'HO',
                'Direct Wealth': 'DW',
                'Indirect Wealth': 'IW',
                'Direct Officer': 'DO',
                'Seven Killings': '7K',
                'Direct Resource': 'DR',
                'Indirect Resource': 'IR'
            };
            
            tenGodAbbreviation = tenGodAbbrevMap[tenGodName] || '';
        }
    }
    
    // Check Lucky Stars for this Earthly Branch
    let luckyStarsIndicator = '';
    if (pillarData.earthly_branch && pillarData.earthly_branch.name && window.currentLuckyStars) {
        const branchEnglishName = pillarData.earthly_branch.name;
        const branchNameMap = {
            'Rat': 'Zi', 'Ox': 'Chou', 'Tiger': 'Yin', 'Rabbit': 'Mao',
            'Dragon': 'Chen', 'Snake': 'Si', 'Horse': 'Wu', 'Goat': 'Wei',
            'Monkey': 'Shen', 'Rooster': 'You', 'Dog': 'Xu', 'Pig': 'Hai'
        };
        const branchTraditional = branchNameMap[branchEnglishName] || branchEnglishName;
        
        const starsForThisBranch = [];
        
        // Nobleman is an array
        if (Array.isArray(window.currentLuckyStars.nobleman) && window.currentLuckyStars.nobleman.includes(branchTraditional)) {
            starsForThisBranch.push('👑');
        }
        // Others are strings
        if (window.currentLuckyStars.intelligence && window.currentLuckyStars.intelligence === branchTraditional) {
            starsForThisBranch.push('🎓');
        }
        if (window.currentLuckyStars.peachBlossom && window.currentLuckyStars.peachBlossom === branchTraditional) {
            starsForThisBranch.push('');
        }
        if (window.currentLuckyStars.skyHorse && window.currentLuckyStars.skyHorse === branchTraditional) {
            starsForThisBranch.push('🦄');
        }
        if (window.currentLuckyStars.solitary && window.currentLuckyStars.solitary === branchTraditional) {
            starsForThisBranch.push('🌙');
        }
        if (window.currentLuckyStars.heavenlyDoctor && window.currentLuckyStars.heavenlyDoctor === branchTraditional) {
            starsForThisBranch.push('️');
        }
        // Kong Wang (Dead Emptiness) - Array of 2 branches
        if (Array.isArray(window.currentLuckyStars.kongwang) && window.currentLuckyStars.kongwang.includes(branchTraditional)) {
            starsForThisBranch.push('☯️');
        }
        
        // If there are lucky stars, show indicator
        if (starsForThisBranch.length > 0) {
            const stackedStars = starsForThisBranch.map(star => 
                `<div style="font-size: 0.95rem; line-height: 1.2; margin-bottom: 2px;">${star}</div>`
            ).join('');
            
            luckyStarsIndicator = `<div style="position: absolute; top: 10px; right: 5px; display: flex; flex-direction: column; align-items: center; background: rgba(255,255,255,0.95); border-radius: 5px; padding: 3px 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.25); z-index: 10;">${stackedStars}</div>`;
        }
    }
    
    // Extract Hidden Stems with 10 Gods - NEW FORMAT
    let hiddenStemsHTML = "";
    if (pillarData.hidden_stems) {
        const hiddenStems = pillarData.hidden_stems;
        let stemColumns = [];
        
        // Residual Qi (left column)
        if (hiddenStems.residual_qi) {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.residual_qi.element]}">${hiddenStems.residual_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.residual_qi.ten_gods || "--"}</div>
                </div>
            `);
        } else {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `);
        }
        
        // Main Qi (center column)
        if (hiddenStems.main_qi) {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.main_qi.element]}">${hiddenStems.main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.main_qi.ten_gods || "--"}</div>
                </div>
            `);
        } else {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `);
        }
        
        // Sub Main Qi (right column)
        if (hiddenStems.sub_main_qi) {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.sub_main_qi.element]}">${hiddenStems.sub_main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.sub_main_qi.ten_gods || "--"}</div>
                </div>
            `);
        } else {
            stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `);
        }
        
        hiddenStemsHTML = `
            <div class="hidden-stems-container">
                <div class="hidden-stems-grid">
                    ${stemColumns.join('')}
                </div>
            </div>
        `;
    }
    
    // Build HTML with grid structure matching main pillars
    div.innerHTML = `
        <div class="pillar-title">${title}</div>
        <div class="pillar-value">
            <div style="position: relative; display: inline-block;">
                <strong class="bigCharacter" style="color: ${elementColors[heavenlyStemElement]}">${pillarData.heavenly_stem.character}</strong>
                ${tenGodAbbreviation ? `<span style="position: absolute; top: -5px; right: -25px; font-size: 0.75rem; font-weight: 700; color: #9b59b6; background: white; padding: 2px 4px; border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">${tenGodAbbreviation}</span>` : ''}
            </div>
            <div class="bigValue" style="color: ${elementColors[heavenlyStemElement]}">${pillarData.heavenly_stem.name}</div>
        </div>
        <hr>
        <div class="pillar-value" style="position: relative;">
            <strong class="bigCharacter" style="color: ${elementColors[earthlyBranchElement]}">${pillarData.earthly_branch.character}</strong>
            <div class="bigValue" style="color: ${elementColors[earthlyBranchElement]}">${pillarData.earthly_branch.name}</div>
            ${luckyStarsIndicator}
        </div>
        ${hiddenStemsHTML}
        <hr>
        <div class="ganzhi-separator">
            <strong style="color: ${elementColors[ganZhiElement]}">${ganZhiName}</strong>
        </div>
        <hr>
        <div class="lifecycle-separator">
            <div class="lifeCycle">${lifeCycleName}</div>
        </div>
    `;
    
    return div;
}

function calculateCurrentMonthPillar(currentDate, fourPillarsData) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // JavaScript months are 0-based
    const day = currentDate.getDate();
    
    // Get Chinese solar month (same logic as in Python backend)
    let chineseMonth;
    if (month === 1) {
        chineseMonth = 12; // January is always 丑月 (Ox month) until 立春
    } else if (month === 2) {
        chineseMonth = day < 4 ? 12 : 1; // 立春 around Feb 4 starts 寅月 (Tiger month)
    } else if (month === 3) {
        chineseMonth = day < 6 ? 1 : 2; // 驚蟄 around Mar 6 starts 卯月 (Rabbit month)
    } else if (month === 4) {
        chineseMonth = day < 5 ? 2 : 3; // 清明 around Apr 5 starts 辰月 (Dragon month)
    } else if (month === 5) {
        chineseMonth = day < 6 ? 3 : 4; // 立夏 around May 6 starts 巳月 (Snake month)
    } else if (month === 6) {
        chineseMonth = day < 6 ? 4 : 5; // 芒种 around Jun 6 starts 午月 (Horse month)
    } else if (month === 7) {
        chineseMonth = day < 7 ? 5 : 6; // 小暑 around Jul 7 starts 未月 (Goat month)
    } else if (month === 8) {
        chineseMonth = day < 8 ? 6 : 7; // 立秋 around Aug 8 starts 申月 (Monkey month)
    } else if (month === 9) {
        chineseMonth = day < 8 ? 7 : 8; // 白露 around Sep 8 starts 酉月 (Rooster month)
    } else if (month === 10) {
        chineseMonth = day < 8 ? 8 : 9; // 寒露 around Oct 8 starts 戌月 (Dog month)
    } else if (month === 11) {
        chineseMonth = day < 7 ? 9 : 10; // 立冬 around Nov 7 starts 亥月 (Pig month)
    } else if (month === 12) {
        chineseMonth = day < 7 ? 10 : 11; // 大雪 around Dec 7 starts 子月 (Rat month)
    }
    
    // Calculate year stem for month stem calculation
    let currentYear = year;
    if (month < 2 || (month === 2 && day < 4)) {
        currentYear -= 1; // Before Chinese New Year
    }
    
    const yearOffset = currentYear - 1984;
    const yearStemIndex = yearOffset % 10;
    const yearStemType = yearStemIndex % 5;
    const monthStemStarts = [2, 4, 6, 8, 0]; // 丙, 戊, 庚, 壬, 甲
    const monthStemBase = monthStemStarts[yearStemType];
    
    const monthStemIndex = (monthStemBase + chineseMonth - 1) % 10;
    const monthBranchIndex = (chineseMonth + 1) % 12;
    
    // Get Day Master index from birth chart for 10 Gods calculation
    const dayMasterIndex = HEAVENLY_STEMS.findIndex(s => 
        s.name === fourPillarsData.day_pillar.heavenly_stem.name
    );
    
    return {
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
        life_cycle: getLifeCycleName((monthStemIndex + monthBranchIndex) % 12)
    };
}


function calculateCurrentLuckPillar(currentDate, fourPillarsData, luckPillarsData) {
    if (!birthTimeData) {
        // Fallback if birth data not available
        return {
            heavenly_stem: { name: "N/A", character: "?"},
            earthly_branch: { name: "N/A", character: "?"},
            gan_zhi: { name: "N/A", element_name: ""},
            life_cycle: "N/A"
        };
    }
    
    const birthDate = new Date(birthTimeData.dateTime);
    const currentAge = currentDate.getFullYear() - birthDate.getFullYear();
    
    // Determine which luck pillar is active - use actual start age from first pillar
    const firstLuckPillar = luckPillarsData.luck_pillars[0];
    const baseAge = firstLuckPillar.year_start - birthDate.getFullYear();
    const luckPillarIndex = Math.floor((currentAge - baseAge) / 10);
    
    if (luckPillarIndex >= 0 && luckPillarIndex < luckPillarsData.luck_pillars.length) {
        const activeLuckPillar = luckPillarsData.luck_pillars[luckPillarIndex];
        
        // Calculate Nayin and 12 Phrase from Stem-Branch combination
        const nayinName = getNayinFromStemBranch(activeLuckPillar.heavenly_stem.name, activeLuckPillar.earthly_branch.name);
        const phrase12 = formatLifeCycleName(activeLuckPillar.heavenly_stem.name, activeLuckPillar.earthly_branch.name);
        
        return {
            heavenly_stem: activeLuckPillar.heavenly_stem,
            earthly_branch: activeLuckPillar.earthly_branch,
            hidden_stems: activeLuckPillar.hidden_stems,
            gan_zhi: { name: nayinName, element_name: "" },
            life_cycle: phrase12,
            luck_period: `${activeLuckPillar.year_start}-${activeLuckPillar.year_end}`
        };
    }
    
    // If no active luck pillar found
    return {
        heavenly_stem: { name: "N/A", character: "?"},
        earthly_branch: { name: "N/A", character: "?"},
        gan_zhi: { name: "Not Active", element_name: ""},
        life_cycle: "N/A"
    };
}

function calculateYearPillar(year) {
    // Chinese New Year boundary - before Feb 4th counts as previous year
    const yearOffset = year - 1984;
    const yearStemIndex = yearOffset % 10;
    const yearBranchIndex = yearOffset % 12;
    
    return {
        heavenly_stem: {
            name: HEAVENLY_STEMS[yearStemIndex].name,
            character: HEAVENLY_STEMS[yearStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[yearBranchIndex].name,
            character: EARTHLY_BRANCHES[yearBranchIndex].character
        },
        hidden_stems: getHiddenStems(yearBranchIndex),
        gan_zhi: GANZHI_COMBINATIONS[(yearStemIndex * 6 + Math.floor(yearBranchIndex / 2)) % 60],
        life_cycle: getLifeCycleName((yearStemIndex + yearBranchIndex) % 12)
    };
}

function calculateMonthPillar(year, month) {
    // Get Chinese solar month (same logic as in calculateCurrentMonthPillar)
    const day = 15; // Use middle of month for consistency
    let chineseMonth;
    if (month === 1) {
        chineseMonth = 12;
    } else if (month === 2) {
        chineseMonth = day < 4 ? 12 : 1;
    } else if (month === 3) {
        chineseMonth = day < 6 ? 1 : 2;
    } else if (month === 4) {
        chineseMonth = day < 5 ? 2 : 3;
    } else if (month === 5) {
        chineseMonth = day < 6 ? 3 : 4;
    } else if (month === 6) {
        chineseMonth = day < 6 ? 4 : 5;
    } else if (month === 7) {
        chineseMonth = day < 7 ? 5 : 6;
    } else if (month === 8) {
        chineseMonth = day < 8 ? 6 : 7;
    } else if (month === 9) {
        chineseMonth = day < 8 ? 7 : 8;
    } else if (month === 10) {
        chineseMonth = day < 8 ? 8 : 9;
    } else if (month === 11) {
        chineseMonth = day < 7 ? 9 : 10;
    } else if (month === 12) {
        chineseMonth = day < 7 ? 10 : 11;
    }
    
    const yearOffset = year - 1984;
    const yearStemIndex = yearOffset % 10;
    const yearStemType = yearStemIndex % 5;
    const monthStemStarts = [2, 4, 6, 8, 0];
    const monthStemBase = monthStemStarts[yearStemType];
    
    const monthStemIndex = (monthStemBase + chineseMonth - 1) % 10;
    const monthBranchIndex = (chineseMonth + 1) % 12;
    
    return {
        heavenly_stem: {
            name: HEAVENLY_STEMS[monthStemIndex].name,
            character: HEAVENLY_STEMS[monthStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[monthBranchIndex].name,
            character: EARTHLY_BRANCHES[monthBranchIndex].character
        },
        hidden_stems: getHiddenStems(monthBranchIndex),
        gan_zhi: GANZHI_COMBINATIONS[(monthStemIndex * 6 + Math.floor(monthBranchIndex / 2)) % 60],
        life_cycle: getLifeCycleName((monthStemIndex + monthBranchIndex) % 12)
    };
}

function calculateDayPillar(year, month, day) {
    const date = new Date(year, month - 1, day);
    const refDate = new Date(1900, 0, 1);
    const daysDiff = Math.floor((date - refDate) / (1000 * 60 * 60 * 24));
    
    const oct_20_1987 = new Date(1987, 9, 20);
    const daysToOct1987 = Math.floor((oct_20_1987 - refDate) / (1000 * 60 * 60 * 24));
    const targetStem = 8;
    const targetBranch = 2;
    const refStem = (targetStem - daysToOct1987) % 10;
    const refBranch = (targetBranch - daysToOct1987) % 12;
    
    const dayStemIndex = (refStem + daysDiff) % 10;
    const dayBranchIndex = (refBranch + daysDiff) % 12;
    
    return {
        heavenly_stem: {
            name: HEAVENLY_STEMS[dayStemIndex].name,
            character: HEAVENLY_STEMS[dayStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[dayBranchIndex].name,
            character: EARTHLY_BRANCHES[dayBranchIndex].character
        },
        hidden_stems: getHiddenStems(dayBranchIndex),
        gan_zhi: GANZHI_COMBINATIONS[(dayStemIndex * 6 + Math.floor(dayBranchIndex / 2)) % 60],
        life_cycle: getLifeCycleName((dayStemIndex + dayBranchIndex) % 12)
    };
}

function calculateHourPillar(year, month, day, hourIndex) {
    const dayPillar = calculateDayPillar(year, month, day);
    const dayStemIndex = HEAVENLY_STEMS.findIndex(stem => stem.name === dayPillar.heavenly_stem.name);
    const dayStemType = dayStemIndex % 5;
    const hourStemStarts = [0, 2, 4, 6, 8];
    const hourStemBase = hourStemStarts[dayStemType];
    
    const hourStemIndex = (hourStemBase + hourIndex) % 10;
    const hourBranchIndex = hourIndex;
    
    return {
        heavenly_stem: {
            name: HEAVENLY_STEMS[hourStemIndex].name,
            character: HEAVENLY_STEMS[hourStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[hourBranchIndex].name,
            character: EARTHLY_BRANCHES[hourBranchIndex].character
        },
        hidden_stems: getHiddenStems(hourBranchIndex),
        gan_zhi: GANZHI_COMBINATIONS[(hourStemIndex * 6 + Math.floor(hourBranchIndex / 2)) % 60],
        life_cycle: getLifeCycleName((hourStemIndex + hourBranchIndex) % 12)
    };
}

// Constants for current pillar calculations
const HEAVENLY_STEMS = [
    {"name": "Yang Wood", "character": "甲", "element": "Wood"},
    {"name": "Yin Wood", "character": "乙", "element": "Wood"}, 
    {"name": "Yang Fire", "character": "丙", "element": "Fire"},
    {"name": "Yin Fire", "character": "丁", "element": "Fire"},
    {"name": "Yang Earth", "character": "戊", "element": "Earth"},
    {"name": "Yin Earth", "character": "己", "element": "Earth"},
    {"name": "Yang Metal", "character": "庚", "element": "Metal"},
    {"name": "Yin Metal", "character": "辛", "element": "Metal"},
    {"name": "Yang Water", "character": "壬", "element": "Water"},
    {"name": "Yin Water", "character": "癸", "element": "Water"}
];

const EARTHLY_BRANCHES = [
    {"name": "Rat", "character": "子", "element": "Water"},
    {"name": "Ox", "character": "丑", "element": "Earth"},
    {"name": "Tiger", "character": "寅", "element": "Wood"},
    {"name": "Rabbit", "character": "卯", "element": "Wood"},
    {"name": "Dragon", "character": "辰", "element": "Earth"},
    {"name": "Snake", "character": "巳", "element": "Fire"},
    {"name": "Horse", "character": "午", "element": "Fire"},
    {"name": "Goat", "character": "未", "element": "Earth"},
    {"name": "Monkey", "character": "申", "element": "Metal"},
    {"name": "Rooster", "character": "酉", "element": "Metal"},
    {"name": "Dog", "character": "戌", "element": "Earth"},
    {"name": "Pig", "character": "亥", "element": "Water"}
];

const GANZHI_COMBINATIONS = [
    {"name": "Sea metal", "element_name": "Metal"},
    {"name": "Furnace fire", "element_name": "Fire"},
    {"name": "Forest wood", "element_name": "Wood"},
    {"name": "Road earth", "element_name": "Earth"},
    {"name": "Sword metal", "element_name": "Metal"},
    {"name": "Volcanic fire", "element_name": "Fire"},
    {"name": "Cave water", "element_name": "Water"},
    {"name": "Fortress earth", "element_name": "Earth"},
    {"name": "Wax metal", "element_name": "Metal"},
    {"name": "Willow wood", "element_name": "Wood"},
    {"name": "Stream water", "element_name": "Water"},
    {"name": "Roof tiles earth", "element_name": "Earth"},
    {"name": "Lightning fire", "element_name": "Fire"},
    {"name": "Conifer wood", "element_name": "Wood"},
    {"name": "River water", "element_name": "Water"},
    {"name": "Sand metal", "element_name": "Metal"},
    {"name": "Forest fire", "element_name": "Fire"},
    {"name": "Meadow wood", "element_name": "Wood"},
    {"name": "Adobe earth", "element_name": "Earth"},
    {"name": "Precious metal", "element_name": "Metal"},
    {"name": "Lamp fire", "element_name": "Fire"},
    {"name": "Sky water", "element_name": "Water"},
    {"name": "Highway earth", "element_name": "Earth"},
    {"name": "Jewellery metal", "element_name": "Metal"},
    {"name": "Mulberry wood", "element_name": "Wood"},
    {"name": "Rapids water", "element_name": "Water"},
    {"name": "Desert earth", "element_name": "Earth"},
    {"name": "Sun fire", "element_name": "Fire"},
    {"name": "Pomegranate wood", "element_name": "Wood"},
    {"name": "Ocean water", "element_name": "Water"},
    {"name": "Sea metal", "element_name": "Metal"},
    {"name": "Furnace fire", "element_name": "Fire"},
    {"name": "Forest wood", "element_name": "Wood"},
    {"name": "Road earth", "element_name": "Earth"},
    {"name": "Sword metal", "element_name": "Metal"},
    {"name": "Volcanic fire", "element_name": "Fire"},
    {"name": "Cave water", "element_name": "Water"},
    {"name": "Fortress earth", "element_name": "Earth"},
    {"name": "Wax metal", "element_name": "Metal"},
    {"name": "Willow wood", "element_name": "Wood"},
    {"name": "Stream water", "element_name": "Water"},
    {"name": "Roof tiles earth", "element_name": "Earth"},
    {"name": "Lightning fire", "element_name": "Fire"},
    {"name": "Conifer wood", "element_name": "Wood"},
    {"name": "River water", "element_name": "Water"},
    {"name": "Sand metal", "element_name": "Metal"},
    {"name": "Forest fire", "element_name": "Fire"},
    {"name": "Meadow wood", "element_name": "Wood"},
    {"name": "Adobe earth", "element_name": "Earth"},
    {"name": "Precious metal", "element_name": "Metal"},
    {"name": "Lamp fire", "element_name": "Fire"},
    {"name": "Sky water", "element_name": "Water"},
    {"name": "Highway earth", "element_name": "Earth"},
    {"name": "Jewellery metal", "element_name": "Metal"},
    {"name": "Mulberry wood", "element_name": "Wood"},
    {"name": "Rapids water", "element_name": "Water"},
    {"name": "Desert earth", "element_name": "Earth"},
    {"name": "Sun fire", "element_name": "Fire"},
    {"name": "Pomegranate wood", "element_name": "Wood"},
    {"name": "Ocean water", "element_name": "Water"}
];

// 12 Life Stages (12 Phases / 12 Tahap Kehidupan)
// Classic = Pinyin, Modern = English
const LIFE_CYCLES_PINYIN = [
    "Chang Sheng", "Mu Yu", "Guan Dai", "Lin Guan", 
    "Di Wang", "Shuai", "Bing", "Si", 
    "Mu", "Jue", "Tai", "Yang"
];

const LIFE_CYCLES_ENGLISH = [
    "Birth", "Bath", "Youth", "Prosperity", 
    "Peak", "Weakening", "Sickness", "Death", 
    "Tomb", "Extinction", "Conception", "Nurturing"
];

// Helper function to get life cycle name based on combination style
function getLifeCycleName(index) {
    return formatLifeCycleName(index);
}

const LIFE_CYCLES = LIFE_CYCLES_ENGLISH; // Default for backward compatibility

// ============================================
// HEAVENLY STEM COMBINATIONS (合化)
// ============================================

// Heavenly Stem Combination Pairs
const HS_COMBINATIONS = [
    { stems: [0, 5], element: "Earth", name: "Jia-Ji Combine to Earth" },    // 甲+己 → Earth
    { stems: [1, 6], element: "Metal", name: "Yi-Geng Combine to Metal" },    // 乙+庚 → Metal
    { stems: [2, 7], element: "Water", name: "Bing-Xin Combine to Water" },   // 丙+辛 → Water
    { stems: [3, 8], element: "Wood", name: "Ding-Ren Combine to Wood" },     // 丁+壬 → Wood
    { stems: [4, 9], element: "Fire", name: "Wu-Gui Combine to Fire" }        // 戊+癸 → Fire
];

// ============================================
// SAN HUI (三會) / SEASONAL UNION - EARTHLY BRANCHES
// ============================================

// Seasonal Union Combinations (3 branches forming a season)
const SEASONAL_UNIONS = [
    { 
        branches: [2, 3, 4],  // Tiger (寅), Rabbit (卯), Dragon (辰)
        season: "Spring",
        element: "Wood",
        name: "Spring Wood Union",
        icon: "🌿"
    },
    { 
        branches: [5, 6, 7],  // Snake (巳), Horse (午), Goat (未)
        season: "Summer",
        element: "Fire",
        name: "Summer Fire Union",
        icon: "🔥"
    },
    { 
        branches: [8, 9, 10], // Monkey (申), Rooster (酉), Dog (戌)
        season: "Autumn",
        element: "Metal",
        name: "Autumn Metal Union",
        icon: "🌾"
    },
    { 
        branches: [11, 0, 1], // Pig (亥), Rat (子), Ox (丑)
        season: "Winter",
        element: "Water",
        name: "Winter Water Union",
        icon: "💧"
    }
];

// ============================================
// SAN HE (三合) / THREE HARMONIES
// ============================================

const THREE_HARMONIES = [
    {
        branches: [8, 0, 4],  // Monkey (申), Rat (子), Dragon (辰)
        element: "Water",
        name: "Water Harmony",
        icon: "💧"
    },
    {
        branches: [11, 3, 7], // Pig (亥), Rabbit (卯), Goat (未)
        element: "Wood",
        name: "Wood Harmony",
        icon: "🌿"
    },
    {
        branches: [2, 6, 10], // Tiger (寅), Horse (午), Dog (戌)
        element: "Fire",
        name: "Fire Harmony",
        icon: "🔥"
    },
    {
        branches: [5, 9, 1],  // Snake (巳), Rooster (酉), Ox (丑)
        element: "Metal",
        name: "Metal Harmony",
        icon: "🌾"
    }
];

// ============================================
// BAN HE (半合) / HALF COMBINATION
// ============================================

const HALF_COMBINATIONS = [
    { pair: [8, 0], element: "Water", name: "Water Half Combo", icon: "💧" },  // Monkey-Rat
    { pair: [0, 4], element: "Water", name: "Water Half Combo", icon: "💧" },  // Rat-Dragon
    { pair: [11, 3], element: "Wood", name: "Wood Half Combo", icon: "🌿" },   // Pig-Rabbit
    { pair: [3, 7], element: "Wood", name: "Wood Half Combo", icon: "🌿" },    // Rabbit-Goat
    { pair: [2, 6], element: "Fire", name: "Fire Half Combo", icon: "🔥" },    // Tiger-Horse
    { pair: [6, 10], element: "Fire", name: "Fire Half Combo", icon: "🔥" },   // Horse-Dog
    { pair: [5, 9], element: "Metal", name: "Metal Half Combo", icon: "🌾" },  // Snake-Rooster
    { pair: [9, 1], element: "Metal", name: "Metal Half Combo", icon: "🌾" }   // Rooster-Ox
];

// ============================================
// LIU HE (六合) / SIX HARMONIES
// ============================================

const SIX_HARMONIES = [
    { pair: [0, 1], element: "Earth", name: "Rat-Ox Harmony", icon: "🐀🐂" },      // Zi-Chou
    { pair: [2, 11], element: "Wood", name: "Tiger-Pig Harmony", icon: "🐅🐖" },   // Yin-Hai
    { pair: [3, 10], element: "Fire", name: "Rabbit-Dog Harmony", icon: "🐇🐕" },  // Mao-Xu
    { pair: [4, 9], element: "Metal", name: "Dragon-Rooster Harmony", icon: "🐉🐔" }, // Chen-You
    { pair: [5, 8], element: "Water", name: "Snake-Monkey Harmony", icon: "🐍🐒" }, // Si-Shen
    { pair: [6, 7], element: "Fire", name: "Horse-Goat Harmony", icon: "🐎🐐" }    // Wu-Wei
];

// ============================================
// XING (刑) / PUNISHMENTS
// ============================================

// Wu En Zhi Xing (无恩之刑) / Ungrateful Punishment
const UNGRATEFUL_PUNISHMENT = [
    { branches: [2, 5, 8], name: "Ungrateful Punishment", icon: "⚠️" }  // Yin-Si-Shen
];

// Chi Shi Zhi Xing (持势之刑) / Arrogant Punishment  
const ARROGANT_PUNISHMENT = [
    { branches: [7, 10, 1], name: "Arrogant Punishment", icon: "⚠️" }  // Wei-Xu-Chou
];

// Wu Li Zhi Xing (无礼之刑) / Rude Punishment
const RUDE_PUNISHMENT = [
    { pair: [0, 3], name: "Rude Punishment", icon: "⚠️" }  // Zi-Mao
];

// Zi Xing (自刑) / Self Punishment
const SELF_PUNISHMENT = [
    { branch: 4, name: "Self Punishment", icon: "⚠️" },   // Chen-Chen
    { branch: 6, name: "Self Punishment", icon: "⚠️" },   // Wu-Wu
    { branch: 9, name: "Self Punishment", icon: "⚠️" },   // You-You
    { branch: 11, name: "Self Punishment", icon: "⚠️" }   // Hai-Hai
];

// ============================================
// LIU CHONG (六冲) / SIX CLASHES
// ============================================

const SIX_CLASHES = [
    { pair: [0, 6], name: "Rat-Horse Clash", icon: "💥" },      // Zi-Wu
    { pair: [1, 7], name: "Ox-Goat Clash", icon: "💥" },        // Chou-Wei
    { pair: [2, 8], name: "Tiger-Monkey Clash", icon: "💥" },   // Yin-Shen
    { pair: [3, 9], name: "Rabbit-Rooster Clash", icon: "💥" }, // Mao-You
    { pair: [4, 10], name: "Dragon-Dog Clash", icon: "💥" },    // Chen-Xu
    { pair: [5, 11], name: "Snake-Pig Clash", icon: "💥" }      // Si-Hai
];

// ============================================
// XIANG PO (相破) /破 DESTRUCTION
// ============================================

const DESTRUCTIONS = [
    { pair: [0, 9], name: "Rat-Rooster Break", icon: "💔" },     // Zi-You
    { pair: [1, 4], name: "Ox-Dragon Break", icon: "💔" },       // Chou-Chen
    { pair: [2, 11], name: "Tiger-Pig Break", icon: "💔" },      // Yin-Hai
    { pair: [3, 6], name: "Rabbit-Horse Break", icon: "💔" },    // Mao-Wu
    { pair: [5, 8], name: "Snake-Monkey Break", icon: "💔" },    // Si-Shen
    { pair: [7, 10], name: "Goat-Dog Break", icon: "💔" }        // Wei-Xu
];

// ============================================
// XIANG HAI (相害) / SIX HARMS
// ============================================

const SIX_HARMS = [
    { pair: [0, 7], name: "Rat-Goat Harm", icon: "☠️" },        // Zi-Wei
    { pair: [1, 6], name: "Ox-Horse Harm", icon: "☠️" },        // Chou-Wu
    { pair: [2, 5], name: "Tiger-Snake Harm", icon: "☠️" },     // Yin-Si
    { pair: [3, 4], name: "Rabbit-Dragon Harm", icon: "☠️" },   // Mao-Chen
    { pair: [8, 11], name: "Monkey-Pig Harm", icon: "☠️" },     // Shen-Hai
    { pair: [9, 10], name: "Rooster-Dog Harm", icon: "☠️" }     // You-Xu
];

// ============================================
// AN HE (暗合) / HIDDEN COMBINATIONS
// ============================================
// Based on hidden stems combinations (地合/暗合)
// These are combinations based on hidden Heavenly Stems within Earthly Branches

const ANHE_PAIRS = [
    { pair: [2, 1], name: "Tiger-Ox Hidden", icon: "🔮" },      // Yin-Chou (Tiger-Ox): 甲己合
    { pair: [2, 7], name: "Tiger-Goat Hidden", icon: "🔮" },    // Yin-Wei (Tiger-Goat): 甲己合
    { pair: [0, 4], name: "Rat-Dragon Hidden", icon: "🔮" },    // Zi-Chen (Rat-Dragon): 戊癸合
    { pair: [0, 10], name: "Rat-Dog Hidden", icon: "🔮" },      // Zi-Xu (Rat-Dog): 戊癸合
    { pair: [9, 5], name: "Rooster-Snake Hidden", icon: "🔮" }, // You-Si (Rooster-Snake): 乙庚合
    { pair: [3, 8], name: "Rabbit-Monkey Hidden", icon: "🔮" }, // Mao-Shen (Rabbit-Monkey): 乙庚合
    { pair: [6, 11], name: "Horse-Pig Hidden", icon: "🔮" }     // Wu-Hai (Horse-Pig): 丁壬合
];

// Check if two branches can form part of a seasonal union
function canFormSeasonalUnion(branch1Index, branch2Index) {
    for (const union of SEASONAL_UNIONS) {
        if (union.branches.includes(branch1Index) && union.branches.includes(branch2Index)) {
            return union;
        }
    }
    return null;
}

// Check San He / Three Harmonies
function canFormThreeHarmony(branch1Index, branch2Index) {
    for (const harmony of THREE_HARMONIES) {
        if (harmony.branches.includes(branch1Index) && harmony.branches.includes(branch2Index)) {
            return harmony;
        }
    }
    return null;
}

// Check Ban He / Half Combination
function canFormHalfCombination(branch1Index, branch2Index) {
    for (const half of HALF_COMBINATIONS) {
        if ((half.pair[0] === branch1Index && half.pair[1] === branch2Index) ||
            (half.pair[1] === branch1Index && half.pair[0] === branch2Index)) {
            return half;
        }
    }
    return null;
}

// Check Liu He / Six Harmonies
function canFormSixHarmony(branch1Index, branch2Index) {
    for (const harmony of SIX_HARMONIES) {
        if ((harmony.pair[0] === branch1Index && harmony.pair[1] === branch2Index) ||
            (harmony.pair[1] === branch1Index && harmony.pair[0] === branch2Index)) {
            return harmony;
        }
    }
    return null;
}

// Check Ungrateful Punishment
function canFormUngratefulPunishment(branch1Index, branch2Index) {
    const branches = UNGRATEFUL_PUNISHMENT[0].branches;
    if (branches.includes(branch1Index) && branches.includes(branch2Index)) {
        return UNGRATEFUL_PUNISHMENT[0];
    }
    return null;
}

// Check Arrogant Punishment
function canFormArrogantPunishment(branch1Index, branch2Index) {
    const branches = ARROGANT_PUNISHMENT[0].branches;
    if (branches.includes(branch1Index) && branches.includes(branch2Index)) {
        return ARROGANT_PUNISHMENT[0];
    }
    return null;
}

// Check Rude Punishment
function canFormRudePunishment(branch1Index, branch2Index) {
    const pair = RUDE_PUNISHMENT[0].pair;
    if ((pair[0] === branch1Index && pair[1] === branch2Index) ||
        (pair[1] === branch1Index && pair[0] === branch2Index)) {
        return RUDE_PUNISHMENT[0];
    }
    return null;
}

// Check Self Punishment (same branch appears twice)
function canFormSelfPunishment(branch1Index, branch2Index) {
    if (branch1Index === branch2Index) {
        for (const punishment of SELF_PUNISHMENT) {
            if (punishment.branch === branch1Index) {
                return punishment;
            }
        }
    }
    return null;
}

// Check Liu Chong / Six Clashes
function canFormClash(branch1Index, branch2Index) {
    for (const clash of SIX_CLASHES) {
        if ((clash.pair[0] === branch1Index && clash.pair[1] === branch2Index) ||
            (clash.pair[1] === branch1Index && clash.pair[0] === branch2Index)) {
            return clash;
        }
    }
    return null;
}

// Check Xiang Po / Destruction
function canFormDestruction(branch1Index, branch2Index) {
    for (const destruction of DESTRUCTIONS) {
        if ((destruction.pair[0] === branch1Index && destruction.pair[1] === branch2Index) ||
            (destruction.pair[1] === branch1Index && destruction.pair[0] === branch2Index)) {
            return destruction;
        }
    }
    return null;
}

// Check Xiang Hai / Six Harms
function canFormHarm(branch1Index, branch2Index) {
    for (const harm of SIX_HARMS) {
        if ((harm.pair[0] === branch1Index && harm.pair[1] === branch2Index) ||
            (harm.pair[1] === branch1Index && harm.pair[0] === branch2Index)) {
            return harm;
        }
    }
    return null;
}

// Check An He / Hidden Combinations
function canFormAnhe(branch1Index, branch2Index) {
    for (const anhe of ANHE_PAIRS) {
        if ((anhe.pair[0] === branch1Index && anhe.pair[1] === branch2Index) ||
            (anhe.pair[1] === branch1Index && anhe.pair[0] === branch2Index)) {
            return anhe;
        }
    }
    return null;
}

// Get combination info between two stems
function getHSCombination(stem1Index, stem2Index) {
    for (const combo of HS_COMBINATIONS) {
        if ((combo.stems[0] === stem1Index && combo.stems[1] === stem2Index) ||
            (combo.stems[1] === stem1Index && combo.stems[0] === stem2Index)) {
            return combo;
        }
    }
    return null;
}

// Detect all Heavenly Stem combinations in the chart
function detectAllHSCombinations(fourPillars, currentPillars) {
    const allPillars = [
        { name: 'H', stem: fourPillars.hour_pillar.heavenly_stem },
        { name: 'D', stem: fourPillars.day_pillar.heavenly_stem },
        { name: 'M', stem: fourPillars.month_pillar.heavenly_stem },
        { name: 'Y', stem: fourPillars.year_pillar.heavenly_stem },
        { name: 'CL', stem: currentPillars.luck.heavenly_stem },
        { name: 'CY', stem: currentPillars.year.heavenly_stem },
        { name: 'CM', stem: currentPillars.month.heavenly_stem },
        { name: 'CD', stem: currentPillars.day.heavenly_stem }
    ];
    
    const combinations = {};
    
    // Initialize empty arrays for each pillar
    allPillars.forEach(p => {
        combinations[p.name] = [];
    });
    
    // Check all pairs
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

// Format combination label for display
function formatHSComboLabel(combos) {
    if (!combos || combos.length === 0) return '';
    
    const labels = combos.map(c => c.partner).join(', ');
    
    // Classic vs Modern naming
    if (combinationStyle === 'classic') {
        return `Tian Gan Wu He ${labels}`;
    } else {
        return `HS Combinations ${labels}`;
    }
}

// Detect all Earthly Branch interactions in the chart
function detectAllBranchInteractions(fourPillars, currentPillars) {
    const allPillars = [
        { name: 'H', branch: fourPillars.hour_pillar.earthly_branch },
        { name: 'D', branch: fourPillars.day_pillar.earthly_branch },
        { name: 'M', branch: fourPillars.month_pillar.earthly_branch },
        { name: 'Y', branch: fourPillars.year_pillar.earthly_branch },
        { name: 'CL', branch: currentPillars.luck.earthly_branch },
        { name: 'CY', branch: currentPillars.year.earthly_branch },
        { name: 'CM', branch: currentPillars.month.earthly_branch },
        { name: 'CD', branch: currentPillars.day.earthly_branch }
    ];
    
    const interactions = {};
    
    // Initialize empty arrays for each pillar
    allPillars.forEach(p => {
        interactions[p.name] = [];
    });
    
    // Check all pairs for ALL types of interactions
    for (let i = 0; i < allPillars.length; i++) {
        for (let j = i + 1; j < allPillars.length; j++) {
            const pillar1 = allPillars[i];
            const pillar2 = allPillars[j];
            
            const branch1Index = EARTHLY_BRANCHES.findIndex(b => b.name === pillar1.branch.name);
            const branch2Index = EARTHLY_BRANCHES.findIndex(b => b.name === pillar2.branch.name);
            
            // Check all interaction types
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

// Format seasonal union label for display
function formatSeasonalLabel(combos) {
    if (!combos || combos.length === 0) return '';
    
    const labels = combos.map(c => c.partner).join(', ');
    const icon = combos[0].union.icon;
    
    // Classic vs Modern naming
    if (combinationStyle === 'classic') {
        return `${icon} San Hui ${labels}`;
    } else {
        return `${icon} Seasonal Unions ${labels}`;
    }
}

// Format branch interaction labels by type
function formatBranchInteractionLabels(interactions) {
    if (!interactions || interactions.length === 0) return [];
    
    // Group by type
    const grouped = {};
    interactions.forEach(interaction => {
        if (!grouped[interaction.type]) {
            grouped[interaction.type] = [];
        }
        grouped[interaction.type].push(interaction);
    });
    
    // Format labels
    const labels = [];
    
    // Positive interactions (order matters for display)
    const positiveTypes = ['seasonal', 'sanhe', 'banhe', 'liuhe', 'anhe'];
    positiveTypes.forEach(type => {
        if (grouped[type]) {
            const items = grouped[type];
            const partners = items.map(i => i.partner).join(',');
            const icon = items[0].interaction.icon;
            
            // Classic vs Modern naming
            let name;
            if (combinationStyle === 'classic') {
                name = type === 'seasonal' ? 'San Hui' :
                       type === 'sanhe' ? 'San He' :
                       type === 'banhe' ? 'Ban He' :
                       type === 'liuhe' ? 'Liu He' :
                       'An He';
            } else {
                name = type === 'seasonal' ? 'Seasonal Unions' :
                       type === 'sanhe' ? 'Three Harmonies' :
                       type === 'banhe' ? 'Half Combinations' :
                       type === 'liuhe' ? 'Six Harmonies' :
                       'Hidden Combinations';
            }
            
            labels.push({
                text: `${icon} ${name} ${partners}`,
                element: items[0].interaction.element,
                tooltip: items[0].interaction.name,
                category: 'positive'
            });
        }
    });
    
    // Negative interactions
    const negativeTypes = ['ungrateful', 'arrogant', 'rude', 'self', 'clash', 'destruction', 'harm'];
    negativeTypes.forEach(type => {
        if (grouped[type]) {
            const items = grouped[type];
            const partners = items.map(i => i.partner).join(',');
            const icon = items[0].interaction.icon;
            
            // Classic vs Modern naming
            let name;
            if (combinationStyle === 'classic') {
                name = type === 'ungrateful' ? 'Wu En Zhi Xing' :
                       type === 'arrogant' ? 'Chi Shi Zhi Xing' :
                       type === 'rude' ? 'Wu Li Zhi Xing' :
                       type === 'self' ? 'Zi Xing' :
                       type === 'clash' ? 'Liu Chong' :
                       type === 'destruction' ? 'Xiang Po' :
                       'Xiang Hai';
            } else {
                name = type === 'ungrateful' ? 'Ungrateful Punishment' :
                       type === 'arrogant' ? 'Bullying Punishment' :
                       type === 'rude' ? 'Uncivilized Punishment' :
                       type === 'self' ? 'Self Punishment' :
                       type === 'clash' ? 'Six Clashes' :
                       type === 'destruction' ? 'Destruction' :
                       'Six Harms';
            }
            
            labels.push({
                text: `${icon} ${name} ${partners}`,
                element: null,  // No element for negative
                tooltip: items[0].interaction.name,
                category: 'negative'
            });
        }
    });
    
    return labels;
}

// Detect and display HS combinations for all pillars
function detectAndDisplayHSCombinations(fourPillars, luckPillarsData) {
    const currentDate = new Date();
    
    // Calculate current pillars
    const currentYearPillar = calculateCurrentYearPillar(currentDate, fourPillars);
    const currentMonthPillar = calculateCurrentMonthPillar(currentDate, fourPillars);
    const currentDayPillar = calculateCurrentDayPillar(currentDate, fourPillars);
    const currentLuckPillar = calculateCurrentLuckPillar(currentDate, fourPillars, luckPillarsData);
    
    // Detect all HS combinations for main pillars
    const hsCombinations = detectAllHSCombinations(fourPillars, {
        luck: currentLuckPillar,
        year: currentYearPillar,
        month: currentMonthPillar,
        day: currentDayPillar
    });
    
    // Detect all Branch interactions for main pillars
    const branchInteractions = detectAllBranchInteractions(fourPillars, {
        luck: currentLuckPillar,
        year: currentYearPillar,
        month: currentMonthPillar,
        day: currentDayPillar
    });
    
    // Add combination rows to main pillars (both HS and Branch interactions)
    // Skip Hour Pillar if birth time is unknown
    if (birthTimeData && birthTimeData.unknownBirthTime) {
        console.log("Skipping Hour Pillar combinations - birth time unknown");
    } else {
        addCombinationRow('HourPillar', hsCombinations['H'], branchInteractions['H']);
    }
    addCombinationRow('DayPillar', hsCombinations['D'], branchInteractions['D']);
    addCombinationRow('MonthPillar', hsCombinations['M'], branchInteractions['M']);
    addCombinationRow('YearPillar', hsCombinations['Y'], branchInteractions['Y']);
    addCombinationRow('CurrentLuckPillar', hsCombinations['CL'], branchInteractions['CL']);
    addCombinationRow('CurrentYearPillar', hsCombinations['CY'], branchInteractions['CY']);
    addCombinationRow('CurrentMonthPillar', hsCombinations['CM'], branchInteractions['CM']);
    addCombinationRow('CurrentDayPillar', hsCombinations['CD'], branchInteractions['CD']);
    
    // Detect and add combinations for Luck Pillars
    detectLuckPillarsCombinations(luckPillarsData, fourPillars);
    
    // Detect and add combinations for Time Period Pillars
    // These will be added when the pillars are created
}

// Add combination row to a pillar (both HS and Branch interactions)
function addCombinationRow(pillarId, hsCombos, branchInteractions) {
    const pillar = document.getElementById(pillarId);
    if (!pillar) return;
    
    // Remove existing combination row if any
    const existingCombo = pillar.querySelector('.hs-combo-row');
    if (existingCombo) {
        existingCombo.remove();
    }
    
    // Create combination row
    const comboRow = document.createElement('div');
    comboRow.className = 'hs-combo-row';
    
    const hsLabel = (hsCombos && hsCombos.length > 0) ? formatHSComboLabel(hsCombos) : '';
    const branchLabels = formatBranchInteractionLabels(branchInteractions);
    
    if (hsLabel || branchLabels.length > 0) {
        let content = '';
        
        // HS Combinations
        if (hsLabel) {
            const hsElement = hsCombos[0].combo.element;
            const hsTooltip = hsCombos.map(c => c.combo.name).join(', ');
            content += `
                <div class="hs-combo-label" style="color: ${elementColors[hsElement]}" title="${hsTooltip}">
                    <i class="fas fa-link"></i> ${hsLabel}
                </div>
            `;
        }
        
        // Branch Interactions
        branchLabels.forEach(label => {
            const colorStyle = label.element ? `color: ${elementColors[label.element]}` : 
                             label.category === 'negative' ? 'color: #e74c3c' : 'color: #27ae60';
            content += `
                <div class="branch-interaction-label ${label.category}" style="${colorStyle}" title="${label.tooltip}">
                    ${label.text}
                </div>
            `;
        });
        
        comboRow.innerHTML = content;
    } else {
        comboRow.innerHTML = `
            <div class="hs-combo-label empty">
                <span>-</span>
            </div>
        `;
    }
    
    // Append to pillar
    pillar.appendChild(comboRow);
}

// Detect combinations for Luck Pillars (only with Natal Chart)
function detectLuckPillarsCombinations(luckPillarsData, fourPillars) {
    const luckPillars = luckPillarsData.luck_pillars;
    
    // For each luck pillar, check combinations ONLY with natal chart
    luckPillars.forEach((pillar, index) => {
        const pillarDiv = document.querySelectorAll('#luckPillars .pillar')[luckPillars.length - 1 - index];
        if (!pillarDiv) return;
        
        const hsCombos = [];
        const branchInteractions = [];
        
        const stemIndex = HEAVENLY_STEMS.findIndex(s => s.name === pillar.heavenly_stem.name);
        const branchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === pillar.earthly_branch.name);
        
        // Check ONLY against natal pillars (NOT other luck pillars)
        const natalPillars = [
            { name: 'H', stem: fourPillars.hour_pillar.heavenly_stem, branch: fourPillars.hour_pillar.earthly_branch },
            { name: 'D', stem: fourPillars.day_pillar.heavenly_stem, branch: fourPillars.day_pillar.earthly_branch },
            { name: 'M', stem: fourPillars.month_pillar.heavenly_stem, branch: fourPillars.month_pillar.earthly_branch },
            { name: 'Y', stem: fourPillars.year_pillar.heavenly_stem, branch: fourPillars.year_pillar.earthly_branch }
        ];
        
        natalPillars.forEach(natalPillar => {
            const natalStemIndex = HEAVENLY_STEMS.findIndex(s => s.name === natalPillar.stem.name);
            const natalBranchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === natalPillar.branch.name);
            
            // Check HS combinations
            const hsCombo = getHSCombination(stemIndex, natalStemIndex);
            if (hsCombo) {
                hsCombos.push({ partner: natalPillar.name, combo: hsCombo });
            }
            
            // Check all branch interactions
            const checkFunctions = [
                { func: canFormSeasonalUnion, type: 'seasonal' },
                { func: canFormThreeHarmony, type: 'sanhe' },
                { func: canFormHalfCombination, type: 'banhe' },
                { func: canFormSixHarmony, type: 'liuhe' },
                { func: canFormUngratefulPunishment, type: 'ungrateful' },
                { func: canFormArrogantPunishment, type: 'arrogant' },
                { func: canFormRudePunishment, type: 'rude' },
                { func: canFormSelfPunishment, type: 'self' },
                { func: canFormClash, type: 'clash' },
                { func: canFormDestruction, type: 'destruction' },
                { func: canFormHarm, type: 'harm' }
            ];
            
            checkFunctions.forEach(check => {
                const result = check.func(branchIndex, natalBranchIndex);
                if (result) {
                    branchInteractions.push({ 
                        partner: natalPillar.name, 
                        interaction: result,
                        type: check.type
                    });
                }
            });
        });
        
        // Add combination row
        addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions);
    });
}

// Add combination row directly to a pillar element (for dynamic pillars)
function addCombinationRowToPillar(pillarElement, hsCombos, branchInteractions) {
    if (!pillarElement) return;
    
    // Remove existing combination row if any
    const existingCombo = pillarElement.querySelector('.hs-combo-row');
    if (existingCombo) {
        existingCombo.remove();
    }
    
    // Create combination row
    const comboRow = document.createElement('div');
    comboRow.className = 'hs-combo-row';
    
    const hsLabel = (hsCombos && hsCombos.length > 0) ? formatHSComboLabel(hsCombos) : '';
    const branchLabels = formatBranchInteractionLabels(branchInteractions);
    
    if (hsLabel || branchLabels.length > 0) {
        let content = '';
        
        // HS Combinations
        if (hsLabel) {
            const hsElement = hsCombos[0].combo.element;
            const hsTooltip = hsCombos.map(c => c.combo.name).join(', ');
            content += `
                <div class="hs-combo-label" style="color: ${elementColors[hsElement]}" title="${hsTooltip}">
                    <i class="fas fa-link"></i> ${hsLabel}
                </div>
            `;
        }
        
        // Branch Interactions
        branchLabels.forEach(label => {
            const colorStyle = label.element ? `color: ${elementColors[label.element]}` : 
                             label.category === 'negative' ? 'color: #e74c3c' : 'color: #27ae60';
            content += `
                <div class="branch-interaction-label ${label.category}" style="${colorStyle}" title="${label.tooltip}">
                    ${label.text}
                </div>
            `;
        });
        
        comboRow.innerHTML = content;
    } else {
        comboRow.innerHTML = `
            <div class="hs-combo-label empty">
                <span>-</span>
            </div>
        `;
    }
    
    // Append to pillar
    pillarElement.appendChild(comboRow);
}

// Detect combinations for time period pillars (hierarchical/cascading)
// Returns {hsCombos, branchInteractions}
function detectTimePeriodCombinations(currentPillar, allPillars, currentIndex, type) {
    const hsCombos = [];
    const branchInteractions = [];
    
    const currentStemIndex = HEAVENLY_STEMS.findIndex(s => s.name === currentPillar.heavenly_stem.name);
    const currentBranchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === currentPillar.earthly_branch.name);
    
    // Always check combinations with natal pillars
    if (window.currentBaziData && window.currentBaziData.four_pillars) {
        const fourPillars = window.currentBaziData.four_pillars;
        const natalPillars = [
            { name: 'H', stem: fourPillars.hour_pillar.heavenly_stem, branch: fourPillars.hour_pillar.earthly_branch },
            { name: 'D', stem: fourPillars.day_pillar.heavenly_stem, branch: fourPillars.day_pillar.earthly_branch },
            { name: 'M', stem: fourPillars.month_pillar.heavenly_stem, branch: fourPillars.month_pillar.earthly_branch },
            { name: 'Y', stem: fourPillars.year_pillar.heavenly_stem, branch: fourPillars.year_pillar.earthly_branch }
        ];
        
        natalPillars.forEach(natalPillar => {
            const natalStemIndex = HEAVENLY_STEMS.findIndex(s => s.name === natalPillar.stem.name);
            const natalBranchIndex = EARTHLY_BRANCHES.findIndex(b => b.name === natalPillar.branch.name);
            
            // Check HS combinations
            const hsCombo = getHSCombination(currentStemIndex, natalStemIndex);
            if (hsCombo) {
                hsCombos.push({ partner: natalPillar.name, combo: hsCombo });
            }
            
            // Check all branch interactions
            const checkFunctions = [
                { func: canFormSeasonalUnion, type: 'seasonal' },
                { func: canFormThreeHarmony, type: 'sanhe' },
                { func: canFormHalfCombination, type: 'banhe' },
                { func: canFormSixHarmony, type: 'liuhe' },
                { func: canFormUngratefulPunishment, type: 'ungrateful' },
                { func: canFormArrogantPunishment, type: 'arrogant' },
                { func: canFormRudePunishment, type: 'rude' },
                { func: canFormSelfPunishment, type: 'self' },
                { func: canFormClash, type: 'clash' },
                { func: canFormDestruction, type: 'destruction' },
                { func: canFormHarm, type: 'harm' }
            ];
            
            checkFunctions.forEach(check => {
                const result = check.func(currentBranchIndex, natalBranchIndex);
                if (result) {
                    branchInteractions.push({ 
                        partner: natalPillar.name, 
                        interaction: result,
                        type: check.type
                    });
                }
            });
        });
    }
    
    // Get current transiting pillars for hierarchical checks
    const currentDate = new Date();
    const fourPillars = window.currentBaziData?.four_pillars;
    const luckPillarsData = window.currentBaziData?.luck_pillars;
    
    if (!fourPillars || !luckPillarsData) return {hsCombos, branchInteractions};
    
    // Calculate current transiting pillars
    const currentLuckPillar = calculateCurrentLuckPillar(currentDate, fourPillars, luckPillarsData);
    const currentYearPillar = calculateCurrentYearPillar(currentDate, fourPillars);
    const currentMonthPillar = calculateCurrentMonthPillar(currentDate, fourPillars);
    const currentDayPillar = calculateCurrentDayPillar(currentDate, fourPillars);
    
    // Helper function to check both HS and Branch interactions for a current pillar
    const checkCurrentPillar = (pillar, label) => {
        if (!pillar || !pillar.heavenly_stem || !pillar.earthly_branch) return;
        
        const stemIdx = HEAVENLY_STEMS.findIndex(s => s.name === pillar.heavenly_stem.name);
        const branchIdx = EARTHLY_BRANCHES.findIndex(b => b.name === pillar.earthly_branch.name);
        
        // HS Combination
        const hsCombo = getHSCombination(currentStemIndex, stemIdx);
        if (hsCombo) {
            hsCombos.push({ partner: label, combo: hsCombo });
        }
        
        // All branch interactions
        const checkFunctions = [
            { func: canFormSeasonalUnion, type: 'seasonal' },
            { func: canFormThreeHarmony, type: 'sanhe' },
            { func: canFormHalfCombination, type: 'banhe' },
            { func: canFormSixHarmony, type: 'liuhe' },
            { func: canFormUngratefulPunishment, type: 'ungrateful' },
            { func: canFormArrogantPunishment, type: 'arrogant' },
            { func: canFormRudePunishment, type: 'rude' },
            { func: canFormSelfPunishment, type: 'self' },
            { func: canFormClash, type: 'clash' },
            { func: canFormDestruction, type: 'destruction' },
            { func: canFormHarm, type: 'harm' }
        ];
        
        checkFunctions.forEach(check => {
            const result = check.func(currentBranchIndex, branchIdx);
            if (result) {
                branchInteractions.push({ 
                    partner: label, 
                    interaction: result,
                    type: check.type
                });
            }
        });
    };
    
    // Hierarchical checks based on type
    if (type === 'year') {
        checkCurrentPillar(currentDayPillar, 'CD');
        checkCurrentPillar(currentLuckPillar, 'CL');
    } else if (type === 'month') {
        checkCurrentPillar(currentDayPillar, 'CD');
        checkCurrentPillar(currentYearPillar, 'CY');
        checkCurrentPillar(currentLuckPillar, 'CL');
    } else if (type === 'day') {
        checkCurrentPillar(currentMonthPillar, 'CM');
        checkCurrentPillar(currentDayPillar, 'CD');
        checkCurrentPillar(currentYearPillar, 'CY');
        checkCurrentPillar(currentLuckPillar, 'CL');
    } else if (type === 'hour') {
        const currentDayPillar = allPillars[currentDate.getDate() - 1];
        if (currentDayPillar && currentDayPillar.heavenly_stem && currentDayPillar.earthly_branch) {
            const dayLabel = currentDayPillar.day || currentDate.getDate();
            checkCurrentPillar(currentDayPillar, dayLabel.toString());
        }
        checkCurrentPillar(currentMonthPillar, 'CM');
        checkCurrentPillar(currentYearPillar, 'CY');
        checkCurrentPillar(currentLuckPillar, 'CL');
    }
    
    return {hsCombos, branchInteractions};
}

// End of script