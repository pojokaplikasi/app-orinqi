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

export const LIFE_CYCLES_ENGLISH = [
    "Birth", "Bath", "Youth", "Thriving",
    "Prosperous", "Weakening", "Sick", "Death",
    "Grave", "Extinction", "Conceived", "Nourishing"
];

export const LIFE_CYCLES_PINYIN = [
    "Chang Sheng", "Mu Yu", "Guan Dai", "Lin Guan", 
    "Di Wang", "Shuai", "Bing", "Si", 
    "Mu", "Jue", "Tai", "Yang"
];

export const NAYIN_TABLE: Record<string, string> = {
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

export const NAYIN_CLASSIC_NAMES: Record<string, string> = {
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

export const LIFECYCLE_TABLE: Record<string, Record<string, number>> = {
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

export const STEM_NAME_TO_PINYIN: Record<string, string> = {
    "Yang Wood": "Jia", "Yin Wood": "Yi",
    "Yang Fire": "Bing", "Yin Fire": "Ding",
    "Yang Earth": "Wu", "Yin Earth": "Ji",
    "Yang Metal": "Geng", "Yin Metal": "Xin",
    "Yang Water": "Ren", "Yin Water": "Gui"
};

export const BRANCH_NAME_TO_PINYIN: Record<string, string> = {
    "Rat": "Zi", "Ox": "Chou", "Tiger": "Yin", "Rabbit": "Mao",
    "Dragon": "Chen", "Snake": "Si", "Horse": "Wu", "Goat": "Wei",
    "Monkey": "Shen", "Rooster": "You", "Dog": "Xu", "Pig": "Hai"
};

export const ELEMENT_COLORS: Record<string, string> = {
    "Fire": "#f44336",
    "Wood": "#4CAF50",
    "Earth": "#bc8a60",
    "Water": "#2196F3",
    "Metal": "#96a6ae",
};

export const BRANCH_ASSOCIATIONS: Record<string, string> = {
    "Tiger": "Wood", "Rabbit": "Wood",
    "Snake": "Fire", "Horse": "Fire",
    "Monkey": "Metal", "Rooster": "Metal",
    "Pig": "Water", "Rat": "Water",
    "Dragon": "Earth", "Goat": "Earth",
    "Dog": "Earth", "Ox": "Earth"
};

export const HIDDEN_STEMS_MAP: Record<string, any> = {
    "Rat": {main_qi: 9, sub_main_qi: null, residual_qi: null},
    "Ox": {main_qi: 5, sub_main_qi: 9, residual_qi: 7},
    "Tiger": {main_qi: 0, sub_main_qi: 2, residual_qi: 4},
    "Rabbit": {main_qi: 1, sub_main_qi: null, residual_qi: null},
    "Dragon": {main_qi: 4, sub_main_qi: 1, residual_qi: 9},
    "Snake": {main_qi: 2, sub_main_qi: 4, residual_qi: 6},
    "Horse": {main_qi: 3, sub_main_qi: 5, residual_qi: null},
    "Goat": {main_qi: 5, sub_main_qi: 3, residual_qi: 1},
    "Monkey": {main_qi: 6, sub_main_qi: 8, residual_qi: 4},
    "Rooster": {main_qi: 7, sub_main_qi: null, residual_qi: null},
    "Dog": {main_qi: 4, sub_main_qi: 7, residual_qi: 3},
    "Pig": {main_qi: 8, sub_main_qi: 0, residual_qi: null}
};
