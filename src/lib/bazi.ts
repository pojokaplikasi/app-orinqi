import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);
dayjs.extend(dayOfYear);
dayjs.extend(isSameOrAfter);

// Load Jieqi Data
let LEGACY_LICHUN_DATA: any = null;
let COMPLETE_JIEQI_DATA: any = null;

try {
  const legacyDataPath = path.join(process.cwd(), 'master_filie', 'BAZI 01', 'corrected_final_jieqi_data_1900_2150.json');
  const legacyData = fs.readFileSync(legacyDataPath, 'utf8');
  LEGACY_LICHUN_DATA = JSON.parse(legacyData);
} catch (e) {
  console.warn("⚠️ Warning: corrected_final_jieqi_data_1900_2150.json not found");
}

try {
  const completeDataPath = path.join(process.cwd(), 'master_filie', 'BAZI 01', 'jieqi_ultra_precise_1909_2183_cst.json');
  const completeData = fs.readFileSync(completeDataPath, 'utf8');
  COMPLETE_JIEQI_DATA = JSON.parse(completeData);
  console.log("✅ Loaded ULTRA PRECISE 24 Jieqi data from Excel (274 years: 1910-2183)");
} catch (e) {
  console.warn("⚠️ Warning: jieqi_ultra_precise_1909_2183_cst.json not found, using legacy data");
}

// Constants for Bazi calculations
export const HEAVENLY_STEMS = [
    {name: "Yang Wood", character: "甲", element: "Wood"},
    {name: "Yin Wood", character: "乙", element: "Wood"}, 
    {name: "Yang Fire", character: "丙", element: "Fire"},
    {name: "Yin Fire", character: "丁", element: "Fire"},
    {name: "Yang Earth", character: "戊", element: "Earth"},
    {name: "Yin Earth", character: "己", element: "Earth"},
    {name: "Yang Metal", character: "庚", element: "Metal"},
    {name: "Yin Metal", character: "辛", element: "Metal"},
    {name: "Yang Water", character: "壬", element: "Water"},
    {name: "Yin Water", character: "癸", element: "Water"}
];

export const EARTHLY_BRANCHES = [
    {name: "Rat", character: "子", element: "Water"},
    {name: "Ox", character: "丑", element: "Earth"},
    {name: "Tiger", character: "寅", element: "Wood"},
    {name: "Rabbit", character: "卯", element: "Wood"},
    {name: "Dragon", character: "辰", element: "Earth"},
    {name: "Snake", character: "巳", element: "Fire"},
    {name: "Horse", character: "午", element: "Fire"},
    {name: "Goat", character: "未", element: "Earth"},
    {name: "Monkey", character: "申", element: "Metal"},
    {name: "Rooster", character: "酉", element: "Metal"},
    {name: "Dog", character: "戌", element: "Earth"},
    {name: "Pig", character: "亥", element: "Water"}
];

export const GANZHI_COMBINATIONS = [
    {name: "Sea metal", element_name: "Metal"},
    {name: "Furnace fire", element_name: "Fire"},
    {name: "Forest wood", element_name: "Wood"},
    {name: "Road earth", element_name: "Earth"},
    {name: "Sword metal", element_name: "Metal"},
    {name: "Volcanic fire", element_name: "Fire"},
    {name: "Cave water", element_name: "Water"},
    {name: "Fortress earth", element_name: "Earth"},
    {name: "Wax metal", element_name: "Metal"},
    {name: "Willow wood", element_name: "Wood"},
    {name: "Stream water", element_name: "Water"},
    {name: "Roof tiles earth", element_name: "Earth"},
    {name: "Lightning fire", element_name: "Fire"},
    {name: "Conifer wood", element_name: "Wood"},
    {name: "River water", element_name: "Water"},
    {name: "Sand metal", element_name: "Metal"},
    {name: "Forest fire", element_name: "Fire"},
    {name: "Meadow wood", element_name: "Wood"},
    {name: "Adobe earth", element_name: "Earth"},
    {name: "Precious metal", element_name: "Metal"},
    {name: "Lamp fire", element_name: "Fire"},
    {name: "Sky water", element_name: "Water"},
    {name: "Highway earth", element_name: "Earth"},
    {name: "Jewellery metal", element_name: "Metal"},
    {name: "Mulberry wood", element_name: "Wood"},
    {name: "Rapids water", element_name: "Water"},
    {name: "Desert earth", element_name: "Earth"},
    {name: "Sun fire", element_name: "Fire"},
    {name: "Pomegranate wood", element_name: "Wood"},
    {name: "Ocean water", element_name: "Water"},
    {name: "Sea metal", element_name: "Metal"},
    {name: "Furnace fire", element_name: "Fire"},
    {name: "Forest wood", element_name: "Wood"},
    {name: "Road earth", element_name: "Earth"},
    {name: "Sword metal", element_name: "Metal"},
    {name: "Volcanic fire", element_name: "Fire"},
    {name: "Cave water", element_name: "Water"},
    {name: "Fortress earth", element_name: "Earth"},
    {name: "Wax metal", element_name: "Metal"},
    {name: "Willow wood", element_name: "Wood"},
    {name: "Stream water", element_name: "Water"},
    {name: "Roof tiles earth", element_name: "Earth"},
    {name: "Lightning fire", element_name: "Fire"},
    {name: "Conifer wood", element_name: "Wood"},
    {name: "River water", element_name: "Water"},
    {name: "Sand metal", element_name: "Metal"},
    {name: "Forest fire", element_name: "Fire"},
    {name: "Meadow wood", element_name: "Wood"},
    {name: "Adobe earth", element_name: "Earth"},
    {name: "Precious metal", element_name: "Metal"},
    {name: "Lamp fire", element_name: "Fire"},
    {name: "Sky water", element_name: "Water"},
    {name: "Highway earth", element_name: "Earth"},
    {name: "Jewellery metal", element_name: "Metal"},
    {name: "Mulberry wood", element_name: "Wood"},
    {name: "Rapids water", element_name: "Water"},
    {name: "Desert earth", element_name: "Earth"},
    {name: "Sun fire", element_name: "Fire"},
    {name: "Pomegranate wood", element_name: "Wood"},
    {name: "Ocean water", element_name: "Water"}
];

export const LIFE_CYCLES = [
    "Birth", "Bath", "Youth", "Thriving", "Prosperous", "Weakening",
    "Sick", "Death", "Grave", "Extinction", "Conceived", "Nourishing"
];

export const TEN_GODS_TABLE: Record<string, string> = {
    // Day Master: 甲 (Yang Wood, index 0) - Jia
    "0,0": "F",   // 甲 -> 甲 = Friend (比肩) - same element, same polarity
    "0,1": "RW",  // 甲 -> 乙 = Rob Wealth (劫财) - same element, diff polarity
    "0,2": "EG",  // 甲 -> 丙 = Eating God (食神) - output, same polarity
    "0,3": "HO",  // 甲 -> 丁 = Hurting Officer (伤官) - output, diff polarity
    "0,4": "IW",  // 甲 -> 戊 = Indirect Wealth (偏财) - wealth, same polarity
    "0,5": "DW",  // 甲 -> 己 = Direct Wealth (正财) - wealth, diff polarity
    "0,6": "7K",  // 甲 -> 庚 = 7 Killings (七杀) - officer, same polarity
    "0,7": "DO",  // 甲 -> 辛 = Direct Officer (正官) - officer, diff polarity
    "0,8": "IR",  // 甲 -> 壬 = Indirect Resource (偏印) - resource, same polarity
    "0,9": "DR",  // 甲 -> 癸 = Direct Resource (正印) - resource, diff polarity
    
    // Day Master: 乙 (Yin Wood, index 1) - Yi
    "1,0": "RW",  // 乙 -> 甲 = Rob Wealth (劫财)
    "1,1": "F",   // 乙 -> 乙 = Friend (比肩)
    "1,2": "HO",  // 乙 -> 丙 = Hurting Officer (伤官)
    "1,3": "EG",  // 乙 -> 丁 = Eating God (食神)
    "1,4": "DW",  // 乙 -> 戊 = Direct Wealth (正财)
    "1,5": "IW",  // 乙 -> 己 = Indirect Wealth (偏财)
    "1,6": "DO",  // 乙 -> 庚 = Direct Officer (正官)
    "1,7": "7K",  // 乙 -> 辛 = 7 Killings (七杀)
    "1,8": "DR",  // 乙 -> 壬 = Direct Resource (正印)
    "1,9": "IR",  // 乙 -> 癸 = Indirect Resource (偏印)
    
    // Day Master: 丙 (Yang Fire, index 2) - Bing
    "2,0": "IR",  // 丙 -> 甲 = Indirect Resource (偏印)
    "2,1": "DR",  // 丙 -> 乙 = Direct Resource (正印)
    "2,2": "F",   // 丙 -> 丙 = Friend (比肩)
    "2,3": "RW",  // 丙 -> 丁 = Rob Wealth (劫财)
    "2,4": "EG",  // 丙 -> 戊 = Eating God (食神)
    "2,5": "HO",  // 丙 -> 己 = Hurting Officer (伤官)
    "2,6": "IW",  // 丙 -> 庚 = Indirect Wealth (偏财)
    "2,7": "DW",  // 丙 -> 辛 = Direct Wealth (正财)
    "2,8": "7K",  // 丙 -> 壬 = 7 Killings (七杀)
    "2,9": "DO",  // 丙 -> 癸 = Direct Officer (正官)
    
    // Day Master: 丁 (Yin Fire, index 3) - Ding
    "3,0": "DR",  // 丁 -> 甲 = Direct Resource (正印)
    "3,1": "IR",  // 丁 -> 乙 = Indirect Resource (偏印)
    "3,2": "RW",  // 丁 -> 丙 = Rob Wealth (劫财)
    "3,3": "F",   // 丁 -> 丁 = Friend (比肩)
    "3,4": "HO",  // 丁 -> 戊 = Hurting Officer (伤官)
    "3,5": "EG",  // 丁 -> 己 = Eating God (食神)
    "3,6": "DW",  // 丁 -> 庚 = Direct Wealth (正财)
    "3,7": "IW",  // 丁 -> 辛 = Indirect Wealth (偏财)
    "3,8": "DO",  // 丁 -> 壬 = Direct Officer (正官)
    "3,9": "7K",  // 丁 -> 癸 = 7 Killings (七杀)
    
    // Day Master: 戊 (Yang Earth, index 4) - Wu
    "4,0": "7K",  // 戊 -> 甲 = 7 Killings (七杀)
    "4,1": "DO",  // 戊 -> 乙 = Direct Officer (正官)
    "4,2": "IR",  // 戊 -> 丙 = Indirect Resource (偏印)
    "4,3": "DR",  // 戊 -> 丁 = Direct Resource (正印)
    "4,4": "F",   // 戊 -> 戊 = Friend (比肩)
    "4,5": "RW",  // 戊 -> 己 = Rob Wealth (劫财)
    "4,6": "EG",  // 戊 -> 庚 = Eating God (食神)
    "4,7": "HO",  // 戊 -> 辛 = Hurting Officer (伤官)
    "4,8": "IW",  // 戊 -> 壬 = Indirect Wealth (偏财)
    "4,9": "DW",  // 戊 -> 癸 = Direct Wealth (正财)
    
    // Day Master: 己 (Yin Earth, index 5) - Ji
    "5,0": "DO",  // 己 -> 甲 = Direct Officer (正官)
    "5,1": "7K",  // 己 -> 乙 = 7 Killings (七杀)
    "5,2": "DR",  // 己 -> 丙 = Direct Resource (正印)
    "5,3": "IR",  // 己 -> 丁 = Indirect Resource (偏印)
    "5,4": "RW",  // 己 -> 戊 = Rob Wealth (劫财)
    "5,5": "F",   // 己 -> 己 = Friend (比肩)
    "5,6": "HO",  // 己 -> 庚 = Hurting Officer (伤官)
    "5,7": "EG",  // 己 -> 辛 = Eating God (食神)
    "5,8": "DW",  // 己 -> 壬 = Direct Wealth (正财)
    "5,9": "IW",  // 己 -> 癸 = Indirect Wealth (偏财)
    
    // Day Master: 庚 (Yang Metal, index 6) - Geng
    "6,0": "IW",  // 庚 -> 甲 = Indirect Wealth (偏财)
    "6,1": "DW",  // 庚 -> 乙 = Direct Wealth (正财)
    "6,2": "7K",  // 庚 -> 丙 = 7 Killings (七杀)
    "6,3": "DO",  // 庚 -> 丁 = Direct Officer (正官)
    "6,4": "IR",  // 庚 -> 戊 = Indirect Resource (偏印)
    "6,5": "DR",  // 庚 -> 己 = Direct Resource (正印)
    "6,6": "F",   // 庚 -> 庚 = Friend (比肩)
    "6,7": "RW",  // 庚 -> 辛 = Rob Wealth (劫财)
    "6,8": "EG",  // 庚 -> 壬 = Eating God (食神)
    "6,9": "HO",  // 庚 -> 癸 = Hurting Officer (伤官)
    
    // Day Master: 辛 (Yin Metal, index 7) - Xin
    "7,0": "DW",  // 辛 -> 甲 = Direct Wealth (正财)
    "7,1": "IW",  // 辛 -> 乙 = Indirect Wealth (偏财)
    "7,2": "DO",  // 辛 -> 丙 = Direct Officer (正官)
    "7,3": "7K",  // 辛 -> 丁 = 7 Killings (七杀)
    "7,4": "DR",  // 辛 -> 戊 = Direct Resource (正印)
    "7,5": "IR",  // 辛 -> 己 = Indirect Resource (偏印)
    "7,6": "RW",  // 辛 -> 庚 = Rob Wealth (劫财)
    "7,7": "F",   // 辛 -> 辛 = Friend (比肩)
    "7,8": "HO",  // 辛 -> 壬 = Hurting Officer (伤官)
    "7,9": "EG",  // 辛 -> 癸 = Eating God (食神)
    
    // Day Master: 壬 (Yang Water, index 8) - Ren
    "8,0": "EG",  // 壬 -> 甲 = Eating God (食神)
    "8,1": "HO",  // 壬 -> 乙 = Hurting Officer (伤官)
    "8,2": "IW",  // 壬 -> 丙 = Indirect Wealth (偏财)
    "8,3": "DW",  // 壬 -> 丁 = Direct Wealth (正财)
    "8,4": "7K",  // 壬 -> 戊 = 7 Killings (七杀)
    "8,5": "DO",  // 壬 -> 己 = Direct Officer (正官)
    "8,6": "IR",  // 壬 -> 庚 = Indirect Resource (偏印)
    "8,7": "DR",  // 壬 -> 辛 = Direct Resource (正印)
    "8,8": "F",   // 壬 -> 壬 = Friend (比肩)
    "8,9": "RW",  // 壬 -> 癸 = Rob Wealth (劫财)
    
    // Day Master: 癸 (Yin Water, index 9) - Gui
    "9,0": "HO",  // 癸 -> 甲 = Hurting Officer (伤官)
    "9,1": "EG",  // 癸 -> 乙 = Eating God (食神)
    "9,2": "DW",  // 癸 -> 丙 = Direct Wealth (正财)
    "9,3": "IW",  // 癸 -> 丁 = Indirect Wealth (偏财)
    "9,4": "DO",  // 癸 -> 戊 = Direct Officer (正官)
    "9,5": "7K",  // 癸 -> 己 = 7 Killings (七杀)
    "9,6": "DR",  // 癸 -> 庚 = Direct Resource (正印)
    "9,7": "IR",  // 癸 -> 辛 = Indirect Resource (偏印)
    "9,8": "RW",  // 癸 -> 壬 = Rob Wealth (劫财)
    "9,9": "F",   // 癸 -> 癸 = Friend (比肩)
};

export const HIDDEN_STEMS: Record<string, {main_qi: number | null, sub_main_qi: number | null, residual_qi: number | null}> = {
    "Rat": {main_qi: 9, sub_main_qi: null, residual_qi: null},  // 子: 癸 (Yin Water)
    "Ox": {main_qi: 5, sub_main_qi: 9, residual_qi: 7},  // 丑: 己(main), 癸(sub), 辛(res)
    "Tiger": {main_qi: 0, sub_main_qi: 2, residual_qi: 4},  // 寅: 甲(main), 丙(sub), 戊(res)
    "Rabbit": {main_qi: 1, sub_main_qi: null, residual_qi: null},  // 卯: 乙 (Yin Wood)
    "Dragon": {main_qi: 4, sub_main_qi: 1, residual_qi: 9},  // 辰: 戊(main), 乙(sub), 癸(res)
    "Snake": {main_qi: 2, sub_main_qi: 4, residual_qi: 6},  // 巳: 丙(main), 戊(sub), 庚(res)
    "Horse": {main_qi: 3, sub_main_qi: 5, residual_qi: null},  // 午: 丁(main), 己(sub)
    "Goat": {main_qi: 5, sub_main_qi: 3, residual_qi: 1},  // 未: 己(main), 丁(sub), 乙(res)
    "Monkey": {main_qi: 6, sub_main_qi: 8, residual_qi: 4},  // 申: 庚(main), 壬(sub), 戊(res)
    "Rooster": {main_qi: 7, sub_main_qi: null, residual_qi: null},  // 酉: 辛 (Yin Metal)
    "Dog": {main_qi: 4, sub_main_qi: 7, residual_qi: 3},  // 戌: 戊(main), 辛(sub), 丁(res)
    "Pig": {main_qi: 8, sub_main_qi: 0, residual_qi: null}  // 亥: 壬(main), 甲(sub)
};

export function getChineseNewYearBoundary(year: number, convertToLocal: boolean = false): dayjs.Dayjs {
    // PRIORITY 1: Use new complete Jieqi data if available (1909-2183)
    if (COMPLETE_JIEQI_DATA && COMPLETE_JIEQI_DATA[year.toString()]) {
        if (COMPLETE_JIEQI_DATA[year.toString()]['lichun']) {
            const lichunStr = COMPLETE_JIEQI_DATA[year.toString()]['lichun'];
            let lichunDt = dayjs(lichunStr, 'YYYY-MM-DD HH:mm:ss');
            
            // Convert from CST (UTC+8) to local time (UTC+7) if requested
            if (convertToLocal) {
                lichunDt = lichunDt.subtract(1, 'hour');
            }
            
            return lichunDt;
        }
    }
    
    // PRIORITY 2: Fallback to legacy data
    if (LEGACY_LICHUN_DATA && LEGACY_LICHUN_DATA[year.toString()] && LEGACY_LICHUN_DATA[year.toString()]['lichun']) {
        const lichunStr = LEGACY_LICHUN_DATA[year.toString()]['lichun'];
        let lichunDt = dayjs(lichunStr, 'YYYY-MM-DD HH:mm:ss');
        
        // Convert from CST (UTC+8) to local time (UTC+7) if requested
        if (convertToLocal) {
            lichunDt = lichunDt.subtract(1, 'hour');
        }
        
        return lichunDt;
    }
    
    // PRIORITY 3: Fallback to approximate date if data is missing
    return dayjs(`${year}-02-04 00:00:00`);
}

export function getSolarTermMoment(year: number, term: string, convertToLocal: boolean = false): dayjs.Dayjs {
    // PRIORITY 1: Use new complete Jieqi data if available (1909-2183)
    if (COMPLETE_JIEQI_DATA && COMPLETE_JIEQI_DATA[year.toString()]) {
        if (COMPLETE_JIEQI_DATA[year.toString()][term]) {
            const termStr = COMPLETE_JIEQI_DATA[year.toString()][term];
            let termDt = dayjs(termStr, 'YYYY-MM-DD HH:mm:ss');
            
            // Convert from CST (UTC+8) to local time (UTC+7) if requested
            if (convertToLocal) {
                termDt = termDt.subtract(1, 'hour');
            }
            
            return termDt;
        }
    }
    
    // PRIORITY 2: Fallback to legacy data for years before 1909 or after 2183
    if (LEGACY_LICHUN_DATA && LEGACY_LICHUN_DATA[year.toString()] && LEGACY_LICHUN_DATA[year.toString()][term]) {
        const termStr = LEGACY_LICHUN_DATA[year.toString()][term];
        let termDt = dayjs(termStr, 'YYYY-MM-DD HH:mm:ss');
        
        // Convert from CST (UTC+8) to local time (UTC+7) if requested
        if (convertToLocal) {
            termDt = termDt.subtract(1, 'hour');
        }
        
        return termDt;
    }
    
    // PRIORITY 3: Fallback to approximate dates if data is missing
    const termDates: Record<string, [number, number]> = {
        "lichun": [2, 4],      // 立春 - Start of Spring (Tiger month starts)
        "jingzhe": [3, 6],     // 驚蟄 - Awakening of Insects (Rabbit month starts)
        "qingming": [4, 5],    // 清明 - Clear and Bright (Dragon month starts)
        "lixia": [5, 6],       // 立夏 - Start of Summer (Snake month starts)
        "mangzhong": [6, 6],   // 芒種 - Grain in Ear (Horse month starts)
        "xiaoshu": [7, 7],     // 小暑 - Minor Heat (Goat month starts)
        "liqiu": [8, 8],       // 立秋 - Start of Autumn (Monkey month starts)
        "bailu": [9, 8],       // 白露 - White Dew (Rooster month starts)
        "hanlu": [10, 8],      // 寒露 - Cold Dew (Dog month starts)
        "lidong": [11, 7],     // 立冬 - Start of Winter (Pig month starts)
        "daxue": [12, 7],      // 大雪 - Major Snow (Rat month starts)
        "dongzhi": [12, 22],   // 冬至 - Winter Solstice (Ox month starts)
        "xiaohan": [1, 6],     // 小寒 - Minor Cold (Ox month continues)
        "dahan": [1, 20],      // 大寒 - Major Cold (Ox month continues)
        "yushui": [2, 19],     // 雨水 - Rain Water (Tiger month continues)
        "chunfen": [3, 21],    // 春分 - Spring Equinox (Rabbit month continues)
        "guyu": [4, 20],       // 穀雨 - Grain Rain (Dragon month continues)
        "xiaoman": [5, 21],    // 小滿 - Grain Buds (Snake month continues)
        "xiazhi": [6, 22],     // 夏至 - Summer Solstice (Horse month continues)
        "dashu": [7, 23],      // 大暑 - Major Heat (Goat month continues)
        "chushu": [8, 23],     // 處暑 - End of Heat (Monkey month continues)
        "qiufen": [9, 23],     // 秋分 - Autumn Equinox (Rooster month continues)
        "shuangjiang": [10, 24], // 霜降 - Frost's Descent (Dog month continues)
        "xiaoxue": [11, 22]    // 小雪 - Minor Snow (Pig month continues)
    };
    const [month, day] = termDates[term] || [1, 1];
    return dayjs(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 00:00:00`);
}

export function getVerifiedSolarMonth(dt: dayjs.Dayjs): number {
    const year = dt.year();
    
    // Get the exact moments of key solar terms that define month boundaries
    // CRITICAL: Convert from CST (UTC+8) to local time (UTC+7) for accurate comparison
    const lichun = getSolarTermMoment(year, "lichun", true);      // 立春
    const jingzhe = getSolarTermMoment(year, "jingzhe", true);    // 驚蟄
    const qingming = getSolarTermMoment(year, "qingming", true);  // 清明
    const lixia = getSolarTermMoment(year, "lixia", true);        // 立夏
    const mangzhong = getSolarTermMoment(year, "mangzhong", true); // 芒種
    const xiaoshu = getSolarTermMoment(year, "xiaoshu", true);    // 小暑
    const liqiu = getSolarTermMoment(year, "liqiu", true);        // 立秋
    const bailu = getSolarTermMoment(year, "bailu", true);        // 白露
    const hanlu = getSolarTermMoment(year, "hanlu", true);        // 寒露
    const lidong = getSolarTermMoment(year, "lidong", true);      // 立冬
    const daxue = getSolarTermMoment(year, "daxue", true);        // 大雪
    const dongzhi = getSolarTermMoment(year, "dongzhi", true);    // 冬至
    
    // Determine which solar month we're in based on the exact moments
    // Use >= to ensure that AT the exact moment of solar term, it's considered as the new month
    if (dt.isBefore(dongzhi)) {
        // Before 冬至 - Need to check if before or after Lichun
        if (dt.isBefore(lichun)) {
            // Before 立春 - Still in Ox month from previous year
            // We need to check the previous year's solar terms
            const prevYear = year - 1;
            const prevDongzhi = getSolarTermMoment(prevYear, "dongzhi", true);
            const prevLidong = getSolarTermMoment(prevYear, "lidong", true);
            const prevDaxue = getSolarTermMoment(prevYear, "daxue", true);
            
            if (dt.isSameOrAfter(prevDongzhi)) {
                return 12;  // Ox month (丑月)
            } else if (dt.isSameOrAfter(prevLidong)) {
                return 11;  // Pig month (亥月)
            } else if (dt.isSameOrAfter(prevDaxue)) {
                return 10;  // Dog month (戌月)
            } else {
                // This would be an edge case, but we'll default to Ox month
                return 12;  // Ox month (丑月)
            }
        } else if (dt.isBefore(jingzhe)) {
            return 1;   // Tiger month (寅月)
        } else if (dt.isBefore(qingming)) {
            return 2;   // Rabbit month (卯月)
        } else if (dt.isBefore(lixia)) {
            return 3;   // Dragon month (辰月)
        } else if (dt.isBefore(mangzhong)) {
            return 4;   // Snake month (巳月)
        } else if (dt.isBefore(xiaoshu)) {
            return 5;   // Horse month (午月)
        } else if (dt.isBefore(liqiu)) {
            return 6;   // Goat month (未月)
        } else if (dt.isBefore(bailu)) {
            return 7;   // Monkey month (申月)
        } else if (dt.isBefore(hanlu)) {
            return 8;   // Rooster month (酉月)
        } else if (dt.isBefore(lidong)) {
            return 9;   // Dog month (戌月)
        } else if (dt.isBefore(daxue)) {
            return 10;  // Pig month (亥月)
        } else {
            // After 大雪 but before 冬至 - Rat month (子月)
            return 11;  // Rat month (子月)
        }
    } else {
        // After 冬至 - In Ox month
        return 12;  // Ox month (丑月)
    }
}

export function getTenGodsRelationship(dayMasterIndex: number, otherStemIndex: number): string {
    const key = `${dayMasterIndex},${otherStemIndex}`;
    return TEN_GODS_TABLE[key] || "--";
}

export function getHiddenStemsWithTenGods(branchIndex: number, dayMasterIndex: number): any {
    const branchName = EARTHLY_BRANCHES[branchIndex].name;
    const hiddenData = HIDDEN_STEMS[branchName] || {main_qi: null, sub_main_qi: null, residual_qi: null};
    
    const result: any = {};
    
    if (hiddenData.main_qi !== null) {
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
    
    if (hiddenData.sub_main_qi !== null) {
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
    
    if (hiddenData.residual_qi !== null) {
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

export function calculatePillars(birthTime: dayjs.Dayjs): any {
    // CRITICAL: Keep birth_time in user's local timezone for ALL calculations!
    // DO NOT convert to CST - user's time is what matters for Bazi
    
    const birthTimeLocal = birthTime;
    
    // =============================================================================
    // DAY PILLAR CALCULATION (Using proper 60-day rotating cycle)
    // =============================================================================
    // CRITICAL: In Bazi, the day changes at 23:00 (Zi hour 子时), NOT at midnight 00:00!
    // If time is >= 23:00, it belongs to the NEXT day
    
    let birthTimeForDay = birthTimeLocal;
    if (birthTimeLocal.hour() >= 23) {
        // After 23:00, it's already the next day in Bazi calendar
        birthTimeForDay = birthTimeLocal.add(1, 'day');
    }
    
    // Use verified reference: Jan 1, 1900 = 辛亥 (indices 7, 11)
    // But we need to calibrate to get Oct 20, 1987 = 壬寅 (indices 8, 2)
    const refDate = dayjs('1900-01-01 00:00:00');
    // Calculate days difference correctly considering timezones/DST
    const daysSinceRef = Math.floor(birthTimeForDay.diff(refDate, 'day', true));
    
    // Oct 20, 1987 should be 壬寅 (Yang Water + Tiger) = indices 8, 2
    const oct20_1987 = dayjs('1987-10-20 00:00:00');
    const daysToOct1987 = Math.floor(oct20_1987.diff(refDate, 'day', true));
    
    const targetStem = 8;  // 壬 (Yang Water)
    const targetBranch = 2;  // 寅 (Tiger)
    const refStem = (targetStem - (daysToOct1987 % 10) + 10) % 10;
    const refBranch = (targetBranch - (daysToOct1987 % 12) + 12) % 12;
    
    // Calculate using proper 60-day cycle (this rotates for all dates)
    const dayStemIndex = (refStem + (daysSinceRef % 10) + 10) % 10;
    const dayBranchIndex = (refBranch + (daysSinceRef % 12) + 12) % 12;
    
    // =============================================================================
    // YEAR PILLAR CALCULATION 
    // =============================================================================
    let year = birthTimeLocal.year();
    
    // Chinese New Year boundary - use accurate Lichun moment from Excel data
    // CRITICAL: Convert Lichun from CST (UTC+8) to local time (UTC+7) for comparison
    const lichunMomentLocal = getChineseNewYearBoundary(year, true);
    
    if (birthTimeLocal.isSameOrAfter(lichunMomentLocal)) {
        // Already at or after Lichun, keep the current year
    } else {
        // Before Lichun, use previous year
        year -= 1;
    }
    
    // For 1987, should be 丁卯 (indices 3, 3)
    // Use 1984 as 甲子 (indices 0, 0) reference
    const yearOffset = year - 1984;
    const yearStemIndex = (yearOffset % 10 + 10) % 10;
    const yearBranchIndex = (yearOffset % 12 + 12) % 12;
    
    // =============================================================================
    // MONTH PILLAR CALCULATION (Using traditional rotating formula)
    // =============================================================================
    // Determine Chinese solar month (1=Tiger month, 2=Rabbit month, etc.)
    const chineseMonth = getVerifiedSolarMonth(birthTimeLocal);
    
    const yearStemType = yearStemIndex % 5;
    const monthStemStarts = [2, 4, 6, 8, 0];  // 丙, 戊, 庚, 壬, 甲
    const monthStemBase = monthStemStarts[yearStemType];
    
    // Calculate month stem (starting from 寅月 = Chinese month 1)
    const monthStemIndex = (monthStemBase + chineseMonth - 1) % 10;
    
    // Month branch mapping
    const monthBranchIndex = (chineseMonth + 1) % 12;
    
    // =============================================================================
    // HOUR PILLAR CALCULATION (Using traditional rotating formula)
    // =============================================================================
    const hour = birthTimeLocal.hour();
    
    let hourBranchIndex;
    if (hour >= 23 || hour === 0) {
        hourBranchIndex = 0;   // 子 (Zi) - 23:00-00:59
    } else if (hour <= 2) {
        hourBranchIndex = 1;   // 丑 (Chou) - 01:00-02:59
    } else if (hour <= 4) {
        hourBranchIndex = 2;   // 寅 (Yin) - 03:00-04:59
    } else if (hour <= 6) {
        hourBranchIndex = 3;   // 卯 (Mao) - 05:00-06:59
    } else if (hour <= 8) {
        hourBranchIndex = 4;   // 辰 (Chen) - 07:00-08:59
    } else if (hour <= 10) {
        hourBranchIndex = 5;   // 巳 (Si) - 09:00-10:59
    } else if (hour <= 12) {
        hourBranchIndex = 6;   // 午 (Wu) - 11:00-12:59
    } else if (hour <= 14) {
        hourBranchIndex = 7;   // 未 (Wei) - 13:00-14:59
    } else if (hour <= 16) {
        hourBranchIndex = 8;   // 申 (Shen) - 15:00-16:59
    } else if (hour <= 18) {
        hourBranchIndex = 9;   // 酉 (You) - 17:00-18:59
    } else if (hour <= 20) {
        hourBranchIndex = 10;  // 戌 (Xu) - 19:00-20:59
    } else {
        hourBranchIndex = 11;  // 亥 (Hai) - 21:00-22:59
    }
    
    const dayStemType = dayStemIndex % 5;
    const hourStemStarts = [0, 2, 4, 6, 8];  // 甲, 丙, 戊, 庚, 壬
    const hourStemBase = hourStemStarts[dayStemType];
    
    const hourStemIndex = (hourStemBase + hourBranchIndex) % 10;
    
    // Create pillar data structures
    const yearPillar = {
        heavenly_stem: {
            name: HEAVENLY_STEMS[yearStemIndex].name,
            character: HEAVENLY_STEMS[yearStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[yearBranchIndex].name, 
            character: EARTHLY_BRANCHES[yearBranchIndex].character
        },
        hidden_stems: getHiddenStemsWithTenGods(yearBranchIndex, dayStemIndex),
        gan_zhi: GANZHI_COMBINATIONS[(yearStemIndex * 6 + Math.floor(yearBranchIndex / 2)) % 60],
        life_cycle: LIFE_CYCLES[(yearStemIndex + yearBranchIndex) % 12]
    };
    
    const monthPillar = {
        heavenly_stem: {
            name: HEAVENLY_STEMS[monthStemIndex].name,
            character: HEAVENLY_STEMS[monthStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[monthBranchIndex].name,
            character: EARTHLY_BRANCHES[monthBranchIndex].character
        },
        hidden_stems: getHiddenStemsWithTenGods(monthBranchIndex, dayStemIndex),
        gan_zhi: GANZHI_COMBINATIONS[(monthStemIndex * 6 + Math.floor(monthBranchIndex / 2)) % 60],
        life_cycle: LIFE_CYCLES[(monthStemIndex + monthBranchIndex) % 12]
    };
    
    const dayPillar = {
        heavenly_stem: {
            name: HEAVENLY_STEMS[dayStemIndex].name,
            character: HEAVENLY_STEMS[dayStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[dayBranchIndex].name,
            character: EARTHLY_BRANCHES[dayBranchIndex].character
        },
        hidden_stems: getHiddenStemsWithTenGods(dayBranchIndex, dayStemIndex),
        gan_zhi: GANZHI_COMBINATIONS[(dayStemIndex * 6 + Math.floor(dayBranchIndex / 2)) % 60],
        life_cycle: LIFE_CYCLES[(dayStemIndex + dayBranchIndex) % 12]
    };
    
    const hourPillar = {
        heavenly_stem: {
            name: HEAVENLY_STEMS[hourStemIndex].name,
            character: HEAVENLY_STEMS[hourStemIndex].character
        },
        earthly_branch: {
            name: EARTHLY_BRANCHES[hourBranchIndex].name,
            character: EARTHLY_BRANCHES[hourBranchIndex].character
        },
        hidden_stems: getHiddenStemsWithTenGods(hourBranchIndex, dayStemIndex),
        gan_zhi: GANZHI_COMBINATIONS[(hourStemIndex * 6 + Math.floor(hourBranchIndex / 2)) % 60],
        life_cycle: LIFE_CYCLES[(hourStemIndex + hourBranchIndex) % 12]
    };
    
    return {
        year_pillar: yearPillar,
        month_pillar: monthPillar, 
        day_pillar: dayPillar,
        hour_pillar: hourPillar
    };
}

export function calculateDayunStartAge(birthTime: dayjs.Dayjs, fourPillars: any, forward: boolean): [number, number] {
    const year = birthTime.year();
    
    const jieqiList: [string, number][] = [
        ['lichun', 2],     // 立春 - Start of Spring (Tiger month)
        ['jingzhe', 3],    // 驚蟄 - Awakening of Insects (Rabbit month)
        ['qingming', 4],   // 清明 - Clear and Bright (Dragon month)
        ['lixia', 5],      // 立夏 - Start of Summer (Snake month)
        ['mangzhong', 6],  // 芒種 - Grain in Ear (Horse month)
        ['xiaoshu', 7],    // 小暑 - Minor Heat (Goat month)
        ['liqiu', 8],      // 立秋 - Start of Autumn (Monkey month)
        ['bailu', 9],      // 白露 - White Dew (Rooster month)
        ['hanlu', 10],     // 寒露 - Cold Dew (Dog month)
        ['lidong', 11],    // 立冬 - Start of Winter (Pig month)
        ['daxue', 12],     // 大雪 - Major Snow (Rat month)
        ['dongzhi', 1],    // 冬至 - Winter Solstice (Ox month)
    ];
    
    const jieqiMoments: {name: string, time: dayjs.Dayjs}[] = [];
    
    for (const [jieqiName, monthNum] of jieqiList) {
        const jq = getSolarTermMoment(year, jieqiName, true);
        jieqiMoments.push({name: jieqiName, time: jq});
        
        const jqNext = getSolarTermMoment(year + 1, jieqiName, true);
        jieqiMoments.push({name: jieqiName, time: jqNext});
    }
    
    jieqiMoments.sort((a, b) => a.time.valueOf() - b.time.valueOf());
    
    let timeDiffMs = 0;
    
    if (forward) {
        let nextJieqiTime: dayjs.Dayjs | null = null;
        
        for (const jq of jieqiMoments) {
            if (jq.time.isAfter(birthTime)) {
                nextJieqiTime = jq.time;
                break;
            }
        }
        
        if (!nextJieqiTime) {
            return [3, 0];
        }
        
        timeDiffMs = nextJieqiTime.diff(birthTime);
    } else {
        let prevJieqiTime: dayjs.Dayjs | null = null;
        
        for (let i = jieqiMoments.length - 1; i >= 0; i--) {
            if (jieqiMoments[i].time.isBefore(birthTime)) {
                prevJieqiTime = jieqiMoments[i].time;
                break;
            }
        }
        
        if (!prevJieqiTime) {
            return [3, 0];
        }
        
        timeDiffMs = birthTime.diff(prevJieqiTime);
    }
    
    const totalDays = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(totalDays / 3);
    const remainingDays = totalDays % 3;
    const months = remainingDays * 4;
    
    return [years, months];
}

export function calculateLuckPillars(birthTime: dayjs.Dayjs, gender: number, fourPillars: any): any {
    const luckPillars = [];
    
    const yearStemName = fourPillars.year_pillar.heavenly_stem.name;
    const yangYear = yearStemName.includes("Yang");
    
    const forward = (yangYear && gender === 1) || (!yangYear && gender === 0);
    
    const startStemIdx = HEAVENLY_STEMS.findIndex(stem => stem.name === fourPillars.month_pillar.heavenly_stem.name);
    const startBranchIdx = EARTHLY_BRANCHES.findIndex(branch => branch.name === fourPillars.month_pillar.earthly_branch.name);
    
    const dayStemIdx = HEAVENLY_STEMS.findIndex(stem => stem.name === fourPillars.day_pillar.heavenly_stem.name);
    
    const [startYears, startMonths] = calculateDayunStartAge(birthTime, fourPillars, forward);
    let baseAge = startYears;
    
    if (startMonths >= 6) {
        baseAge += 1;
    }
    
    for (let i = 0; i < 10; i++) {
        let stemIdx, branchIdx;
        if (forward) {
            stemIdx = (startStemIdx + i + 1) % 10;
            branchIdx = (startBranchIdx + i + 1) % 12;
        } else {
            stemIdx = (startStemIdx - i - 1 + 10) % 10;
            branchIdx = (startBranchIdx - i - 1 + 12) % 12;
        }
        
        const startAge = baseAge + (i * 10);
        const startYear = birthTime.year() + startAge;
        const endYear = startYear + 9;
        
        let luckStartTime;
        try {
            luckStartTime = birthTime.year(startYear);
        } catch (e) {
            luckStartTime = birthTime.year(startYear).month(1).date(28); // Feb 28
        }
        
        const luckPillar = {
            number: i + 1,
            heavenly_stem: {
                name: HEAVENLY_STEMS[stemIdx].name,
                character: HEAVENLY_STEMS[stemIdx].character
            },
            earthly_branch: {
                name: EARTHLY_BRANCHES[branchIdx].name,
                character: EARTHLY_BRANCHES[branchIdx].character
            },
            hidden_stems: getHiddenStemsWithTenGods(branchIdx, dayStemIdx),
            gan_zhi: GANZHI_COMBINATIONS[(stemIdx * 6 + Math.floor(branchIdx / 2)) % 60],
            life_cycle: LIFE_CYCLES[(stemIdx + branchIdx) % 12],
            year_start: startYear,
            year_end: endYear,
            time: luckStartTime.toISOString()
        };
        
        luckPillars.push(luckPillar);
    }
    
    return { luck_pillars: luckPillars };
}

export function calculateYearlyPillars(startYear: number, endYear: number, birthTime: dayjs.Dayjs): any[] {
    const yearlyPillars = [];
    
    const refDate = dayjs('1900-01-01 00:00:00');
    const oct20_1987 = dayjs('1987-10-20 00:00:00');
    const daysToOct1987 = Math.floor(oct20_1987.diff(refDate, 'day', true));
    const targetStem = 8;
    const targetBranch = 2;
    const refStem = (targetStem - (daysToOct1987 % 10) + 10) % 10;
    const daysSinceRef = Math.floor(birthTime.diff(refDate, 'day', true));
    const dayStemIndex = (refStem + (daysSinceRef % 10) + 10) % 10;
    
    for (let year = startYear; year <= endYear; year++) {
        const yearOffset = year - 1984;
        const yearStemIndex = (yearOffset % 10 + 10) % 10;
        const yearBranchIndex = (yearOffset % 12 + 12) % 12;
        
        const yearlyPillar = {
            year: year,
            heavenly_stem: {
                name: HEAVENLY_STEMS[yearStemIndex].name,
                character: HEAVENLY_STEMS[yearStemIndex].character
            },
            earthly_branch: {
                name: EARTHLY_BRANCHES[yearBranchIndex].name,
                character: EARTHLY_BRANCHES[yearBranchIndex].character
            },
            hidden_stems: getHiddenStemsWithTenGods(yearBranchIndex, dayStemIndex),
            gan_zhi: GANZHI_COMBINATIONS[(yearStemIndex * 6 + Math.floor(yearBranchIndex / 2)) % 60],
            life_cycle: LIFE_CYCLES[(yearStemIndex + yearBranchIndex) % 12]
        };
        yearlyPillars.push(yearlyPillar);
    }
    
    return yearlyPillars;
}

export function calculateMonthlyPillars(year: number, birthTime: dayjs.Dayjs): any[] {
    const monthlyPillars = [];
    
    const refDate = dayjs('1900-01-01 00:00:00');
    const oct20_1987 = dayjs('1987-10-20 00:00:00');
    const daysToOct1987 = Math.floor(oct20_1987.diff(refDate, 'day', true));
    const targetStem = 8;
    const refStem = (targetStem - (daysToOct1987 % 10) + 10) % 10;
    const daysSinceRef = Math.floor(birthTime.diff(refDate, 'day', true));
    const dayStemIndex = (refStem + (daysSinceRef % 10) + 10) % 10;
    
    const yearOffset = year - 1984;
    const yearStemIndex = (yearOffset % 10 + 10) % 10;
    const yearStemType = yearStemIndex % 5;
    const monthStemStarts = [2, 4, 6, 8, 0];
    const monthStemBase = monthStemStarts[yearStemType];
    
    const chineseMonthNames = ["寅月", "卯月", "辰月", "巳月", "午月", "未月", 
                           "申月", "酉月", "戌月", "亥月", "子月", "丑月"];
    const englishMonthNames = ["Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat",
                          "Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox"];
                          
    for (let chineseMonth = 1; chineseMonth <= 12; chineseMonth++) {
        const monthStemIndex = (monthStemBase + chineseMonth - 1) % 10;
        const monthBranchIndex = (chineseMonth + 1) % 12;
        
        const monthlyPillar = {
            month: chineseMonth,
            year: year,
            month_name: chineseMonthNames[chineseMonth - 1],
            month_english: englishMonthNames[chineseMonth - 1],
            heavenly_stem: {
                name: HEAVENLY_STEMS[monthStemIndex].name,
                character: HEAVENLY_STEMS[monthStemIndex].character
            },
            earthly_branch: {
                name: EARTHLY_BRANCHES[monthBranchIndex].name,
                character: EARTHLY_BRANCHES[monthBranchIndex].character
            },
            hidden_stems: getHiddenStemsWithTenGods(monthBranchIndex, dayStemIndex),
            gan_zhi: GANZHI_COMBINATIONS[(monthStemIndex * 6 + Math.floor(monthBranchIndex / 2)) % 60],
            life_cycle: LIFE_CYCLES[(monthStemIndex + monthBranchIndex) % 12]
        };
        monthlyPillars.push(monthlyPillar);
    }
    
    return monthlyPillars;
}

export function calculateDailyPillars(year: number, month: number, birthTime: dayjs.Dayjs): any[] {
    const dailyPillars = [];
    
    const refDate = dayjs('1900-01-01 00:00:00');
    const oct20_1987 = dayjs('1987-10-20 00:00:00');
    const daysToOct1987 = Math.floor(oct20_1987.diff(refDate, 'day', true));
    const targetStem = 8;
    const targetBranch = 2;
    const refStem = (targetStem - (daysToOct1987 % 10) + 10) % 10;
    const refBranch = (targetBranch - (daysToOct1987 % 12) + 12) % 12;
    const birthDaysSinceRef = Math.floor(birthTime.diff(refDate, 'day', true));
    const birthDayStemIndex = (refStem + (birthDaysSinceRef % 10) + 10) % 10;
    
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = dayjs(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 00:00:00`);
        const daysSinceRef = Math.floor(currentDate.diff(refDate, 'day', true));
        
        const dayStemIndex = (refStem + (daysSinceRef % 10) + 10) % 10;
        const dayBranchIndex = (refBranch + (daysSinceRef % 12) + 12) % 12;
        
        const dailyPillar = {
            day: day,
            month: month,
            year: year,
            heavenly_stem: {
                name: HEAVENLY_STEMS[dayStemIndex].name,
                character: HEAVENLY_STEMS[dayStemIndex].character
            },
            earthly_branch: {
                name: EARTHLY_BRANCHES[dayBranchIndex].name,
                character: EARTHLY_BRANCHES[dayBranchIndex].character
            },
            hidden_stems: getHiddenStemsWithTenGods(dayBranchIndex, birthDayStemIndex),
            gan_zhi: GANZHI_COMBINATIONS[(dayStemIndex * 6 + Math.floor(dayBranchIndex / 2)) % 60],
            life_cycle: LIFE_CYCLES[(dayStemIndex + dayBranchIndex) % 12]
        };
        dailyPillars.push(dailyPillar);
    }
    
    return dailyPillars;
}

export function calculateHourlyPillars(year: number, month: number, day: number, birthTime: dayjs.Dayjs): any[] {
    const hourlyPillars = [];
    
    const refDate = dayjs('1900-01-01 00:00:00');
    const oct20_1987 = dayjs('1987-10-20 00:00:00');
    const daysToOct1987 = Math.floor(oct20_1987.diff(refDate, 'day', true));
    const targetStem = 8;
    const refStem = (targetStem - (daysToOct1987 % 10) + 10) % 10;
    const birthDaysSinceRef = Math.floor(birthTime.diff(refDate, 'day', true));
    const birthDayStemIndex = (refStem + (birthDaysSinceRef % 10) + 10) % 10;
    
    const currentDate = dayjs(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 00:00:00`);
    const daysSinceRef = Math.floor(currentDate.diff(refDate, 'day', true));
    const dayStemIndex = (refStem + (daysSinceRef % 10) + 10) % 10;
    const dayStemType = dayStemIndex % 5;
    const hourStemStarts = [0, 2, 4, 6, 8];
    const hourStemBase = hourStemStarts[dayStemType];
    
    const hourNames = ["子時", "丑時", "寅時", "卯時", "辰時", "巳時", 
                  "午時", "未時", "申時", "酉時", "戌時", "亥時"];
    const hourTimes = ["23:00-01:00", "01:00-03:00", "03:00-05:00", "05:00-07:00",
                  "07:00-09:00", "09:00-11:00", "11:00-13:00", "13:00-15:00",
                  "15:00-17:00", "17:00-19:00", "19:00-21:00", "21:00-23:00"];
                  
    for (let hourIdx = 0; hourIdx < 12; hourIdx++) {
        const hourStemIndex = (hourStemBase + hourIdx) % 10;
        const hourBranchIndex = hourIdx;
        
        const hourlyPillar = {
            hour_name: hourNames[hourIdx],
            hour_time: hourTimes[hourIdx],
            day: day,
            month: month,
            year: year,
            heavenly_stem: {
                name: HEAVENLY_STEMS[hourStemIndex].name,
                character: HEAVENLY_STEMS[hourStemIndex].character
            },
            earthly_branch: {
                name: EARTHLY_BRANCHES[hourBranchIndex].name,
                character: EARTHLY_BRANCHES[hourBranchIndex].character
            },
            hidden_stems: getHiddenStemsWithTenGods(hourBranchIndex, birthDayStemIndex),
            gan_zhi: GANZHI_COMBINATIONS[(hourStemIndex * 6 + Math.floor(hourBranchIndex / 2)) % 60],
            life_cycle: LIFE_CYCLES[(hourStemIndex + hourBranchIndex) % 12]
        };
        hourlyPillars.push(hourlyPillar);
    }
    
    return hourlyPillars;
}
