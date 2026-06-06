#!/usr/bin/env python3
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import datetime
import calendar
from dateutil import tz
import json

app = Flask(__name__, static_folder='.')
CORS(app)

# Load the corrected Lichun data
with open('corrected_final_jieqi_data_1900_2150.json', 'r') as f:
    LEGACY_LICHUN_DATA = json.load(f)

# Load the NEW complete Jieqi data (1909-2183) with all 24 solar terms - ULTRA PRECISE from Excel
try:
    with open('jieqi_ultra_precise_1909_2183_cst.json', 'r') as f:
        COMPLETE_JIEQI_DATA = json.load(f)
    print("✅ Loaded ULTRA PRECISE 24 Jieqi data from Excel (274 years: 1910-2183)")
    print("   Timezone: CST (UTC+8) - Converted from WIB (UTC+7)")
except FileNotFoundError:
    print("⚠️ Warning: jieqi_ultra_precise_1909_2183_cst.json not found, using legacy data")
    COMPLETE_JIEQI_DATA = None

# Constants for Bazi calculations
HEAVENLY_STEMS = [
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
]

EARTHLY_BRANCHES = [
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
]

# GanZhi (60-day cycle) combinations
GANZHI_COMBINATIONS = [
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
]

LIFE_CYCLES = [
    "Birth", "Bath", "Youth", "Thriving", "Prosperous", "Weakening",
    "Sick", "Death", "Grave", "Extinction", "Conceived", "Nourishing"
]

# 10 Gods (Shi Shen) mapping - Based on Wu Xing 5 Elements Theory
# Maps (Day Master index, Other Element index) -> 10 Gods name
# Abbreviations (Companion/Resource/Output/Wealth/Power):
# F  = Friend (比肩) - Same element, same polarity (Companion)
# RW = Rob Wealth (劫财) - Same element, different polarity (Companion)
# DR = Direct Resource (正印) - Resource element, different polarity (Resource)
# IR = Indirect Resource (偏印) - Resource element, same polarity (Resource)
# EG = Eating God (食神) - Output element, same polarity (Output)
# HO = Hurting Officer (伤官) - Output element, different polarity (Output)
# DW = Direct Wealth (正财) - Wealth element, different polarity (Wealth)
# IW = Indirect Wealth (偏财) - Wealth element, same polarity (Wealth)
# DO = Direct Officer (正官) - Officer element, different polarity (Power)
# 7K = 7 Killings (七杀) - Officer element, same polarity (Power)
TEN_GODS_TABLE = {
    # Day Master: 甲 (Yang Wood, index 0) - Jia
    (0, 0): "F",   # 甲 -> 甲 = Friend (比肩) - same element, same polarity
    (0, 1): "RW",  # 甲 -> 乙 = Rob Wealth (劫财) - same element, diff polarity
    (0, 2): "EG",  # 甲 -> 丙 = Eating God (食神) - output, same polarity
    (0, 3): "HO",  # 甲 -> 丁 = Hurting Officer (伤官) - output, diff polarity
    (0, 4): "IW",  # 甲 -> 戊 = Indirect Wealth (偏财) - wealth, same polarity
    (0, 5): "DW",  # 甲 -> 己 = Direct Wealth (正财) - wealth, diff polarity
    (0, 6): "7K",  # 甲 -> 庚 = 7 Killings (七杀) - officer, same polarity
    (0, 7): "DO",  # 甲 -> 辛 = Direct Officer (正官) - officer, diff polarity
    (0, 8): "IR",  # 甲 -> 壬 = Indirect Resource (偏印) - resource, same polarity
    (0, 9): "DR",  # 甲 -> 癸 = Direct Resource (正印) - resource, diff polarity
    
    # Day Master: 乙 (Yin Wood, index 1) - Yi
    (1, 0): "RW",  # 乙 -> 甲 = Rob Wealth (劫财)
    (1, 1): "F",   # 乙 -> 乙 = Friend (比肩)
    (1, 2): "HO",  # 乙 -> 丙 = Hurting Officer (伤官)
    (1, 3): "EG",  # 乙 -> 丁 = Eating God (食神)
    (1, 4): "DW",  # 乙 -> 戊 = Direct Wealth (正财)
    (1, 5): "IW",  # 乙 -> 己 = Indirect Wealth (偏财)
    (1, 6): "DO",  # 乙 -> 庚 = Direct Officer (正官)
    (1, 7): "7K",  # 乙 -> 辛 = 7 Killings (七杀)
    (1, 8): "DR",  # 乙 -> 壬 = Direct Resource (正印)
    (1, 9): "IR",  # 乙 -> 癸 = Indirect Resource (偏印)
    
    # Day Master: 丙 (Yang Fire, index 2) - Bing
    (2, 0): "IR",  # 丙 -> 甲 = Indirect Resource (偏印)
    (2, 1): "DR",  # 丙 -> 乙 = Direct Resource (正印)
    (2, 2): "F",   # 丙 -> 丙 = Friend (比肩)
    (2, 3): "RW",  # 丙 -> 丁 = Rob Wealth (劫财)
    (2, 4): "EG",  # 丙 -> 戊 = Eating God (食神)
    (2, 5): "HO",  # 丙 -> 己 = Hurting Officer (伤官)
    (2, 6): "IW",  # 丙 -> 庚 = Indirect Wealth (偏财)
    (2, 7): "DW",  # 丙 -> 辛 = Direct Wealth (正财)
    (2, 8): "7K",  # 丙 -> 壬 = 7 Killings (七杀)
    (2, 9): "DO",  # 丙 -> 癸 = Direct Officer (正官)
    
    # Day Master: 丁 (Yin Fire, index 3) - Ding
    (3, 0): "DR",  # 丁 -> 甲 = Direct Resource (正印)
    (3, 1): "IR",  # 丁 -> 乙 = Indirect Resource (偏印)
    (3, 2): "RW",  # 丁 -> 丙 = Rob Wealth (劫财)
    (3, 3): "F",   # 丁 -> 丁 = Friend (比肩)
    (3, 4): "HO",  # 丁 -> 戊 = Hurting Officer (伤官)
    (3, 5): "EG",  # 丁 -> 己 = Eating God (食神)
    (3, 6): "DW",  # 丁 -> 庚 = Direct Wealth (正财)
    (3, 7): "IW",  # 丁 -> 辛 = Indirect Wealth (偏财)
    (3, 8): "DO",  # 丁 -> 壬 = Direct Officer (正官)
    (3, 9): "7K",  # 丁 -> 癸 = 7 Killings (七杀)
    
    # Day Master: 戊 (Yang Earth, index 4) - Wu
    (4, 0): "7K",  # 戊 -> 甲 = 7 Killings (七杀)
    (4, 1): "DO",  # 戊 -> 乙 = Direct Officer (正官)
    (4, 2): "IR",  # 戊 -> 丙 = Indirect Resource (偏印)
    (4, 3): "DR",  # 戊 -> 丁 = Direct Resource (正印)
    (4, 4): "F",   # 戊 -> 戊 = Friend (比肩)
    (4, 5): "RW",  # 戊 -> 己 = Rob Wealth (劫财)
    (4, 6): "EG",  # 戊 -> 庚 = Eating God (食神)
    (4, 7): "HO",  # 戊 -> 辛 = Hurting Officer (伤官)
    (4, 8): "IW",  # 戊 -> 壬 = Indirect Wealth (偏财)
    (4, 9): "DW",  # 戊 -> 癸 = Direct Wealth (正财)
    
    # Day Master: 己 (Yin Earth, index 5) - Ji
    (5, 0): "DO",  # 己 -> 甲 = Direct Officer (正官)
    (5, 1): "7K",  # 己 -> 乙 = 7 Killings (七杀)
    (5, 2): "DR",  # 己 -> 丙 = Direct Resource (正印)
    (5, 3): "IR",  # 己 -> 丁 = Indirect Resource (偏印)
    (5, 4): "RW",  # 己 -> 戊 = Rob Wealth (劫财)
    (5, 5): "F",   # 己 -> 己 = Friend (比肩)
    (5, 6): "HO",  # 己 -> 庚 = Hurting Officer (伤官)
    (5, 7): "EG",  # 己 -> 辛 = Eating God (食神)
    (5, 8): "DW",  # 己 -> 壬 = Direct Wealth (正财)
    (5, 9): "IW",  # 己 -> 癸 = Indirect Wealth (偏财)
    
    # Day Master: 庚 (Yang Metal, index 6) - Geng
    (6, 0): "IW",  # 庚 -> 甲 = Indirect Wealth (偏财)
    (6, 1): "DW",  # 庚 -> 乙 = Direct Wealth (正财)
    (6, 2): "7K",  # 庚 -> 丙 = 7 Killings (七杀)
    (6, 3): "DO",  # 庚 -> 丁 = Direct Officer (正官)
    (6, 4): "IR",  # 庚 -> 戊 = Indirect Resource (偏印)
    (6, 5): "DR",  # 庚 -> 己 = Direct Resource (正印)
    (6, 6): "F",   # 庚 -> 庚 = Friend (比肩)
    (6, 7): "RW",  # 庚 -> 辛 = Rob Wealth (劫财)
    (6, 8): "EG",  # 庚 -> 壬 = Eating God (食神)
    (6, 9): "HO",  # 庚 -> 癸 = Hurting Officer (伤官)
    
    # Day Master: 辛 (Yin Metal, index 7) - Xin
    (7, 0): "DW",  # 辛 -> 甲 = Direct Wealth (正财)
    (7, 1): "IW",  # 辛 -> 乙 = Indirect Wealth (偏财)
    (7, 2): "DO",  # 辛 -> 丙 = Direct Officer (正官)
    (7, 3): "7K",  # 辛 -> 丁 = 7 Killings (七杀)
    (7, 4): "DR",  # 辛 -> 戊 = Direct Resource (正印)
    (7, 5): "IR",  # 辛 -> 己 = Indirect Resource (偏印)
    (7, 6): "RW",  # 辛 -> 庚 = Rob Wealth (劫财)
    (7, 7): "F",   # 辛 -> 辛 = Friend (比肩)
    (7, 8): "HO",  # 辛 -> 壬 = Hurting Officer (伤官)
    (7, 9): "EG",  # 辛 -> 癸 = Eating God (食神)
    
    # Day Master: 壬 (Yang Water, index 8) - Ren
    (8, 0): "EG",  # 壬 -> 甲 = Eating God (食神)
    (8, 1): "HO",  # 壬 -> 乙 = Hurting Officer (伤官)
    (8, 2): "IW",  # 壬 -> 丙 = Indirect Wealth (偏财)
    (8, 3): "DW",  # 壬 -> 丁 = Direct Wealth (正财)
    (8, 4): "7K",  # 壬 -> 戊 = 7 Killings (七杀)
    (8, 5): "DO",  # 壬 -> 己 = Direct Officer (正官)
    (8, 6): "IR",  # 壬 -> 庚 = Indirect Resource (偏印)
    (8, 7): "DR",  # 壬 -> 辛 = Direct Resource (正印)
    (8, 8): "F",   # 壬 -> 壬 = Friend (比肩)
    (8, 9): "RW",  # 壬 -> 癸 = Rob Wealth (劫财)
    
    # Day Master: 癸 (Yin Water, index 9) - Gui
    (9, 0): "HO",  # 癸 -> 甲 = Hurting Officer (伤官)
    (9, 1): "EG",  # 癸 -> 乙 = Eating God (食神)
    (9, 2): "DW",  # 癸 -> 丙 = Direct Wealth (正财)
    (9, 3): "IW",  # 癸 -> 丁 = Indirect Wealth (偏财)
    (9, 4): "DO",  # 癸 -> 戊 = Direct Officer (正官)
    (9, 5): "7K",  # 癸 -> 己 = 7 Killings (七杀)
    (9, 6): "DR",  # 癸 -> 庚 = Direct Resource (正印)
    (9, 7): "IR",  # 癸 -> 辛 = Indirect Resource (偏印)
    (9, 8): "RW",  # 癸 -> 壬 = Rob Wealth (劫财)
    (9, 9): "F",   # 癸 -> 癸 = Friend (比肩)
}

# Hidden Stems (藏干) for each Earthly Branch
# Format: {"main_qi": index, "sub_main_qi": index, "residual_qi": index}
HIDDEN_STEMS = {
    "Rat": {"main_qi": 9, "sub_main_qi": None, "residual_qi": None},  # 子: 癸 (Yin Water)
    "Ox": {"main_qi": 5, "sub_main_qi": 9, "residual_qi": 7},  # 丑: 己(main), 癸(sub), 辛(res)
    "Tiger": {"main_qi": 0, "sub_main_qi": 2, "residual_qi": 4},  # 寅: 甲(main), 丙(sub), 戊(res)
    "Rabbit": {"main_qi": 1, "sub_main_qi": None, "residual_qi": None},  # 卯: 乙 (Yin Wood)
    "Dragon": {"main_qi": 4, "sub_main_qi": 1, "residual_qi": 9},  # 辰: 戊(main), 乙(sub), 癸(res)
    "Snake": {"main_qi": 2, "sub_main_qi": 4, "residual_qi": 6},  # 巳: 丙(main), 戊(sub), 庚(res)
    "Horse": {"main_qi": 3, "sub_main_qi": 5, "residual_qi": None},  # 午: 丁(main), 己(sub)
    "Goat": {"main_qi": 5, "sub_main_qi": 3, "residual_qi": 1},  # 未: 己(main), 丁(sub), 乙(res)
    "Monkey": {"main_qi": 6, "sub_main_qi": 8, "residual_qi": 4},  # 申: 庚(main), 壬(sub), 戊(res)
    "Rooster": {"main_qi": 7, "sub_main_qi": None, "residual_qi": None},  # 酉: 辛 (Yin Metal)
    "Dog": {"main_qi": 4, "sub_main_qi": 7, "residual_qi": 3},  # 戌: 戊(main), 辛(sub), 丁(res)
    "Pig": {"main_qi": 8, "sub_main_qi": 0, "residual_qi": None}  # 亥: 壬(main), 甲(sub)
}

def get_solar_longitude(dt):
    """Calculate solar longitude for solar calendar calculations"""
    import math
    
    # Day of year
    day_of_year = dt.timetuple().tm_yday
    year = dt.year
    
    # Account for leap years
    days_in_year = 366 if calendar.isleap(year) else 365
    
    # Calculate solar longitude (approximate)
    # Spring equinox (March 20/21) is around day 80, longitude 0°
    solar_long = (day_of_year - 80) * 360.0 / days_in_year
    
    # Normalize to 0-360
    while solar_long < 0:
        solar_long += 360
    while solar_long >= 360:
        solar_long -= 360
        
    return solar_long

def get_chinese_new_year_boundary(year, convert_to_local=False):
    """Get the exact Lichun moment for a given year from corrected data
    
    Args:
        year: Year to get Lichun for
        convert_to_local: If True, convert from CST (UTC+8) to local time (UTC+7)
    """
    from datetime import timedelta
    
    # PRIORITY 1: Use new complete Jieqi data if available (1909-2183)
    if COMPLETE_JIEQI_DATA and str(year) in COMPLETE_JIEQI_DATA:
        if 'lichun' in COMPLETE_JIEQI_DATA[str(year)]:
            lichun_str = COMPLETE_JIEQI_DATA[str(year)]['lichun']
            lichun_dt = datetime.datetime.strptime(lichun_str, '%Y-%m-%d %H:%M:%S')
            
            # Convert from CST (UTC+8) to local time (UTC+7) if requested
            if convert_to_local:
                lichun_dt = lichun_dt - timedelta(hours=1)
            
            return lichun_dt
    
    # PRIORITY 2: Fallback to legacy data
    if str(year) in LEGACY_LICHUN_DATA and 'lichun' in LEGACY_LICHUN_DATA[str(year)]:
        lichun_str = LEGACY_LICHUN_DATA[str(year)]['lichun']
        lichun_dt = datetime.datetime.strptime(lichun_str, '%Y-%m-%d %H:%M:%S')
        
        # Convert from CST (UTC+8) to local time (UTC+7) if requested
        if convert_to_local:
            lichun_dt = lichun_dt - timedelta(hours=1)
        
        return lichun_dt
    
    # PRIORITY 3: Fallback to approximate date if data is missing
    return datetime.datetime(year, 2, 4, 0, 0, 0)

def get_solar_term_moment(year, term, convert_to_local=False):
    """Get the exact moment of a solar term for a given year from corrected data
    
    Args:
        year: Year to get solar term for
        term: Solar term name
        convert_to_local: If True, convert from CST (UTC+8) to local time (UTC+7)
    """
    from datetime import timedelta
    
    # PRIORITY 1: Use new complete Jieqi data if available (1909-2183)
    if COMPLETE_JIEQI_DATA and str(year) in COMPLETE_JIEQI_DATA:
        if term in COMPLETE_JIEQI_DATA[str(year)]:
            term_str = COMPLETE_JIEQI_DATA[str(year)][term]
            term_dt = datetime.datetime.strptime(term_str, '%Y-%m-%d %H:%M:%S')
            
            # Convert from CST (UTC+8) to local time (UTC+7) if requested
            if convert_to_local:
                term_dt = term_dt - timedelta(hours=1)
            
            return term_dt
    
    # PRIORITY 2: Fallback to legacy data for years before 1909 or after 2183
    if str(year) in LEGACY_LICHUN_DATA and term in LEGACY_LICHUN_DATA[str(year)]:
        term_str = LEGACY_LICHUN_DATA[str(year)][term]
        term_dt = datetime.datetime.strptime(term_str, '%Y-%m-%d %H:%M:%S')
        
        # Convert from CST (UTC+8) to local time (UTC+7) if requested
        if convert_to_local:
            term_dt = term_dt - timedelta(hours=1)
        
        return term_dt
    
    # PRIORITY 3: Fallback to approximate dates if data is missing
    term_dates = {
        "lichun": (2, 4),      # 立春 - Start of Spring (Tiger month starts)
        "jingzhe": (3, 6),     # 驚蟄 - Awakening of Insects (Rabbit month starts)
        "qingming": (4, 5),    # 清明 - Clear and Bright (Dragon month starts)
        "lixia": (5, 6),       # 立夏 - Start of Summer (Snake month starts)
        "mangzhong": (6, 6),   # 芒種 - Grain in Ear (Horse month starts)
        "xiaoshu": (7, 7),     # 小暑 - Minor Heat (Goat month starts)
        "liqiu": (8, 8),       # 立秋 - Start of Autumn (Monkey month starts)
        "bailu": (9, 8),       # 白露 - White Dew (Rooster month starts)
        "hanlu": (10, 8),      # 寒露 - Cold Dew (Dog month starts)
        "lidong": (11, 7),     # 立冬 - Start of Winter (Pig month starts)
        "daxue": (12, 7),      # 大雪 - Major Snow (Rat month starts)
        "dongzhi": (12, 22),   # 冬至 - Winter Solstice (Ox month starts)
        "xiaohan": (1, 6),     # 小寒 - Minor Cold (Ox month continues)
        "dahan": (1, 20),      # 大寒 - Major Cold (Ox month continues)
        "yushui": (2, 19),     # 雨水 - Rain Water (Tiger month continues)
        "chunfen": (3, 21),    # 春分 - Spring Equinox (Rabbit month continues)
        "guyu": (4, 20),       # 穀雨 - Grain Rain (Dragon month continues)
        "xiaoman": (5, 21),    # 小滿 - Grain Buds (Snake month continues)
        "xiazhi": (6, 22),     # 夏至 - Summer Solstice (Horse month continues)
        "dashu": (7, 23),      # 大暑 - Major Heat (Goat month continues)
        "chushu": (8, 23),     # 處暑 - End of Heat (Monkey month continues)
        "qiufen": (9, 23),     # 秋分 - Autumn Equinox (Rooster month continues)
        "shuangjiang": (10, 24), # 霜降 - Frost's Descent (Dog month continues)
        "xiaoxue": (11, 22)    # 小雪 - Minor Snow (Pig month continues)
    }
    month, day = term_dates.get(term, (1, 1))
    return datetime.datetime(year, month, day, 0, 0, 0)

def get_verified_solar_month(dt):
    """Get accurate Chinese solar month based on traditional solar terms with corrected data"""
    year = dt.year
    
    # Get the exact moments of key solar terms that define month boundaries
    # CRITICAL: Convert from CST (UTC+8) to local time (UTC+7) for accurate comparison
    lichun = get_solar_term_moment(year, "lichun", convert_to_local=True)      # 立春
    jingzhe = get_solar_term_moment(year, "jingzhe", convert_to_local=True)    # 驚蟄
    qingming = get_solar_term_moment(year, "qingming", convert_to_local=True)  # 清明
    lixia = get_solar_term_moment(year, "lixia", convert_to_local=True)        # 立夏
    mangzhong = get_solar_term_moment(year, "mangzhong", convert_to_local=True) # 芒種
    xiaoshu = get_solar_term_moment(year, "xiaoshu", convert_to_local=True)    # 小暑
    liqiu = get_solar_term_moment(year, "liqiu", convert_to_local=True)        # 立秋
    bailu = get_solar_term_moment(year, "bailu", convert_to_local=True)        # 白露
    hanlu = get_solar_term_moment(year, "hanlu", convert_to_local=True)        # 寒露
    lidong = get_solar_term_moment(year, "lidong", convert_to_local=True)      # 立冬
    daxue = get_solar_term_moment(year, "daxue", convert_to_local=True)        # 大雪
    dongzhi = get_solar_term_moment(year, "dongzhi", convert_to_local=True)    # 冬至
    
    # Determine which solar month we're in based on the exact moments
    # Use >= to ensure that AT the exact moment of solar term, it's considered as the new month
    if dt < dongzhi:
        # Before 冬至 - Need to check if before or after Lichun
        if dt < lichun:
            # Before 立春 - Still in Ox month from previous year
            # We need to check the previous year's solar terms
            prev_year = year - 1
            prev_dongzhi = get_solar_term_moment(prev_year, "dongzhi", convert_to_local=True)
            prev_lidong = get_solar_term_moment(prev_year, "lidong", convert_to_local=True)
            prev_daxue = get_solar_term_moment(prev_year, "daxue", convert_to_local=True)
            
            if dt >= prev_dongzhi:
                return 12  # Ox month (丑月)
            elif dt >= prev_lidong:
                return 11  # Pig month (亥月)
            elif dt >= prev_daxue:
                return 10  # Dog month (戌月)
            else:
                # This would be an edge case, but we'll default to Ox month
                return 12  # Ox month (丑月)
        elif dt < jingzhe:
            return 1   # Tiger month (寅月)
        elif dt < qingming:
            return 2   # Rabbit month (卯月)
        elif dt < lixia:
            return 3   # Dragon month (辰月)
        elif dt < mangzhong:
            return 4   # Snake month (巳月)
        elif dt < xiaoshu:
            return 5   # Horse month (午月)
        elif dt < liqiu:
            return 6   # Goat month (未月)
        elif dt < bailu:
            return 7   # Monkey month (申月)
        elif dt < hanlu:
            return 8   # Rooster month (酉月)
        elif dt < lidong:
            return 9   # Dog month (戌月)
        elif dt < daxue:
            return 10  # Pig month (亥月)
        else:
            # After 大雪 but before 冬至 - Rat month (子月)
            return 11  # Rat month (子月)
    else:
        # After 冬至 - In Ox month
        return 12  # Ox month (丑月)

def get_hidden_stems(branch_index):
    """Get hidden stems for an earthly branch by index"""
    branch_name = EARTHLY_BRANCHES[branch_index]["name"]
    hidden_data = HIDDEN_STEMS.get(branch_name, {})
    
    result = {}
    
    if hidden_data.get("main_qi") is not None:
        idx = hidden_data["main_qi"]
        result["main_qi"] = {
            "name": HEAVENLY_STEMS[idx]["name"],
            "character": HEAVENLY_STEMS[idx]["character"],
            "element": HEAVENLY_STEMS[idx]["element"]
        }
    else:
        result["main_qi"] = None
    
    if hidden_data.get("sub_main_qi") is not None:
        idx = hidden_data["sub_main_qi"]
        result["sub_main_qi"] = {
            "name": HEAVENLY_STEMS[idx]["name"],
            "character": HEAVENLY_STEMS[idx]["character"],
            "element": HEAVENLY_STEMS[idx]["element"]
        }
    else:
        result["sub_main_qi"] = None
    
    if hidden_data.get("residual_qi") is not None:
        idx = hidden_data["residual_qi"]
        result["residual_qi"] = {
            "name": HEAVENLY_STEMS[idx]["name"],
            "character": HEAVENLY_STEMS[idx]["character"],
            "element": HEAVENLY_STEMS[idx]["element"]
        }
    else:
        result["residual_qi"] = None
    
    return result

def get_ten_gods_relationship(day_master_index, other_stem_index):
    """Get 10 Gods relationship between Day Master and another stem"""
    key = (day_master_index, other_stem_index)
    return TEN_GODS_TABLE.get(key, "--")

def get_hidden_stems_with_ten_gods(branch_index, day_master_index):
    """Get hidden stems with 10 Gods relationships for an earthly branch"""
    branch_name = EARTHLY_BRANCHES[branch_index]["name"]
    hidden_data = HIDDEN_STEMS.get(branch_name, {})
    
    result = {}
    
    if hidden_data.get("main_qi") is not None:
        idx = hidden_data["main_qi"]
        result["main_qi"] = {
            "name": HEAVENLY_STEMS[idx]["name"],
            "character": HEAVENLY_STEMS[idx]["character"],
            "element": HEAVENLY_STEMS[idx]["element"],
            "ten_gods": get_ten_gods_relationship(day_master_index, idx)
        }
    else:
        result["main_qi"] = None
    
    if hidden_data.get("sub_main_qi") is not None:
        idx = hidden_data["sub_main_qi"]
        result["sub_main_qi"] = {
            "name": HEAVENLY_STEMS[idx]["name"],
            "character": HEAVENLY_STEMS[idx]["character"],
            "element": HEAVENLY_STEMS[idx]["element"],
            "ten_gods": get_ten_gods_relationship(day_master_index, idx)
        }
    else:
        result["sub_main_qi"] = None
    
    if hidden_data.get("residual_qi") is not None:
        idx = hidden_data["residual_qi"]
        result["residual_qi"] = {
            "name": HEAVENLY_STEMS[idx]["name"],
            "character": HEAVENLY_STEMS[idx]["character"],
            "element": HEAVENLY_STEMS[idx]["element"],
            "ten_gods": get_ten_gods_relationship(day_master_index, idx)
        }
    else:
        result["residual_qi"] = None
    
    return result

def calculate_pillars(birth_time):
    """Calculate the Four Pillars of Destiny - Using user's local time for calculations"""
    
    # CRITICAL: Keep birth_time in user's local timezone for ALL calculations!
    # DO NOT convert to CST - user's time is what matters for Bazi
    from datetime import timedelta
    
    # Remove timezone info but keep the local time values
    if birth_time.tzinfo is not None:
        birth_time_local = birth_time.replace(tzinfo=None)
        print(f"Using local birth_time: {birth_time_local}")
    else:
        birth_time_local = birth_time
        print(f"Using naive birth_time: {birth_time_local}")
    
    # For Jieqi comparisons, we need to convert Jieqi data from CST to user's timezone
    # But for now, we'll work with the local time directly
    
    print(f"Calculating pillars with local time: {birth_time_local}")
    
    # =============================================================================
    # DAY PILLAR CALCULATION (Using proper 60-day rotating cycle)
    # =============================================================================
    # CRITICAL: In Bazi, the day changes at 23:00 (Zi hour 子时), NOT at midnight 00:00!
    # If time is >= 23:00, it belongs to the NEXT day
    
    birth_time_for_day = birth_time_local
    if birth_time_local.hour >= 23:
        # After 23:00, it's already the next day in Bazi calendar
        from datetime import timedelta
        birth_time_for_day = birth_time_local + timedelta(days=1)
        print(f"Hour >= 23:00, using next day for day pillar calculation")
    
    # Use verified reference: Jan 1, 1900 = 辛亥 (indices 7, 11)
    # But we need to calibrate to get Oct 20, 1987 = 壬寅 (indices 8, 2)
    ref_date = datetime.datetime(1900, 1, 1, 0, 0)
    days_since_ref = (birth_time_for_day - ref_date).days
    
    # Oct 20, 1987 should be 壬寅 (Yang Water + Tiger) = indices 8, 2
    # Let's calculate what offset from Jan 1, 1900 gives us the correct result
    oct_20_1987 = datetime.datetime(1987, 10, 20, 0, 0)
    days_to_oct_1987 = (oct_20_1987 - ref_date).days
    
    # We want Oct 20, 1987 to give us indices 8, 2 (壬寅)
    # So we need to find what the reference should be
    # If Oct 20, 1987 has stem=8 and branch=2, and it's days_to_oct_1987 days from ref
    # Then: (ref_stem + days_to_oct_1987) % 10 = 8
    # And: (ref_branch + days_to_oct_1987) % 12 = 2
    
    # Working backwards:
    target_stem = 8  # 壬 (Yang Water)
    target_branch = 2  # 寅 (Tiger)
    ref_stem = (target_stem - days_to_oct_1987) % 10
    ref_branch = (target_branch - days_to_oct_1987) % 12
    
    # Calculate using proper 60-day cycle (this rotates for all dates)
    day_stem_index = (ref_stem + days_since_ref) % 10
    day_branch_index = (ref_branch + days_since_ref) % 12
    
    # =============================================================================
    # YEAR PILLAR CALCULATION 
    # =============================================================================
    year = birth_time_local.year
    month = birth_time_local.month
    day = birth_time_local.day
    
    # Chinese New Year boundary - use accurate Lichun moment from Excel data
    # CRITICAL: Convert Lichun from CST (UTC+8) to local time (UTC+7) for comparison
    lichun_moment_local = get_chinese_new_year_boundary(year, convert_to_local=True)
    
    print(f"Year check: Birth={birth_time_local} | Lichun (converted to local)={lichun_moment_local}")
    if birth_time_local >= lichun_moment_local:
        # Already at or after Lichun, keep the current year
        print(f"Birth >= Lichun: Keeping year {year}")
    else:
        # Before Lichun, use previous year
        year -= 1
        print(f"Birth < Lichun: Using previous year {year}")
    
    # For 1987, should be 丁卯 (indices 3, 3)
    # Use 1984 as 甲子 (indices 0, 0) reference
    year_offset = year - 1984
    year_stem_index = year_offset % 10
    year_branch_index = year_offset % 12
    
    # =============================================================================
    # MONTH PILLAR CALCULATION (Using traditional rotating formula)
    # =============================================================================
    # Determine Chinese solar month (1=Tiger month, 2=Rabbit month, etc.)
    # CRITICAL: Pass birth_time_local for accurate solar term comparison
    # Need to convert Jieqi from CST to local timezone inside get_verified_solar_month
    chinese_month = get_verified_solar_month(birth_time_local)
    
    # Traditional month stem formula based on year stem
    # 甲己之年丙作首 (Years 甲,己 start with 丙寅)
    # 乙庚之歲戊為頭 (Years 乙,庚 start with 戊寅)
    # 丙辛必定尋庚起 (Years 丙,辛 start with 庚寅)
    # 丁壬壬位順行流 (Years 丁,壬 start with 壬寅)
    # 戊癸何方發 甲寅 (Years 戊,癸 start with 甲寅)
    
    year_stem_type = year_stem_index % 5
    month_stem_starts = [2, 4, 6, 8, 0]  # 丙, 戊, 庚, 壬, 甲
    month_stem_base = month_stem_starts[year_stem_type]
    
    # Calculate month stem (starting from 寅月 = Chinese month 1)
    month_stem_index = (month_stem_base + chinese_month - 1) % 10
    
    # Month branch mapping: Chinese month 1(寅月)=Tiger(2), 2(卯月)=Rabbit(3), etc.
    # 寅月=1 -> Tiger=2, 卯月=2 -> Rabbit=3, 辰月=3 -> Dragon=4
    # 巳月=4 -> Snake=5, 午月=5 -> Horse=6, 未月=6 -> Goat=7
    # 申月=7 -> Monkey=8, 酉月=8 -> Rooster=9, 戌月=9 -> Dog=10
    # 亥月=10 -> Pig=11, 子月=11 -> Rat=0, 丑月=12 -> Ox=1
    month_branch_index = (chinese_month + 1) % 12
    
    # =============================================================================
    # HOUR PILLAR CALCULATION (Using traditional rotating formula)
    # =============================================================================
    hour = birth_time_local.hour
    
    # Convert to Chinese double-hour periods (CORRECT mapping)
    # Zi (子): 23:00-00:59
    # Chou (丑): 01:00-02:59
    # Yin (寅): 03:00-04:59
    # Mao (卯): 05:00-06:59
    # Chen (辰): 07:00-08:59
    # Si (巳): 09:00-10:59
    # Wu (午): 11:00-12:59
    # Wei (未): 13:00-14:59
    # Shen (申): 15:00-16:59
    # You (酉): 17:00-18:59
    # Xu (戌): 19:00-20:59
    # Hai (亥): 21:00-22:59
    
    if hour >= 23 or hour == 0:
        hour_branch_index = 0   # 子 (Zi) - 23:00-00:59
    elif hour <= 2:
        hour_branch_index = 1   # 丑 (Chou) - 01:00-02:59
    elif hour <= 4:
        hour_branch_index = 2   # 寅 (Yin) - 03:00-04:59
    elif hour <= 6:
        hour_branch_index = 3   # 卯 (Mao) - 05:00-06:59
    elif hour <= 8:
        hour_branch_index = 4   # 辰 (Chen) - 07:00-08:59
    elif hour <= 10:
        hour_branch_index = 5   # 巳 (Si) - 09:00-10:59
    elif hour <= 12:
        hour_branch_index = 6   # 午 (Wu) - 11:00-12:59
    elif hour <= 14:
        hour_branch_index = 7   # 未 (Wei) - 13:00-14:59
    elif hour <= 16:
        hour_branch_index = 8   # 申 (Shen) - 15:00-16:59
    elif hour <= 18:
        hour_branch_index = 9   # 酉 (You) - 17:00-18:59
    elif hour <= 20:
        hour_branch_index = 10  # 戌 (Xu) - 19:00-20:59
    else:
        hour_branch_index = 11  # 亥 (Hai) - 21:00-22:59
    
    # 08:08 falls in 辰時 (07:00-09:00), so hour_branch_index = 4 (辰)
    # Expected result: 甲辰 (Yang Wood + Dragon) = indices 0, 4
    
    # Traditional hour stem formula based on day stem
    # 甲己還加甲 (Day stems 甲,己 start with 甲子)
    # 乙庚丙作初 (Day stems 乙,庚 start with 丙子)
    # 丙辛從戊起 (Day stems 丙,辛 start with 戊子)
    # 丁壬庚子居 (Day stems 丁,壬 start with 庚子)
    # 戊癸何勞求 壬子時 (Day stems 戊,癸 start with 壬子)
    
    # Our day should be 壬寅 (day_stem_index = 8, Yang Water)
    # For day stem 壬 (index 8), we use type 8%5 = 3, so 庚子時 start (index 6)
    # Hour 辰 is position 4, so hour_stem = (6 + 4) % 10 = 0 (甲)
    # This gives us 甲辰, which matches the expected result!
    
    day_stem_type = day_stem_index % 5
    hour_stem_starts = [0, 2, 4, 6, 8]  # 甲, 丙, 戊, 庚, 壬
    hour_stem_base = hour_stem_starts[day_stem_type]
    
    hour_stem_index = (hour_stem_base + hour_branch_index) % 10
    
    print(f"Rotating calculations - Year:{year_stem_index}/{year_branch_index}, Month:{month_stem_index}/{month_branch_index}, Day:{day_stem_index}/{day_branch_index}, Hour:{hour_stem_index}/{hour_branch_index}")
    print(f"Chinese month: {chinese_month}, Days since 1900: {days_since_ref}, Reference year: {year}")
    
    # Create pillar data structures
    year_pillar = {
        "heavenly_stem": {
            "name": HEAVENLY_STEMS[year_stem_index]["name"],
            "character": HEAVENLY_STEMS[year_stem_index]["character"]
        },
        "earthly_branch": {
            "name": EARTHLY_BRANCHES[year_branch_index]["name"], 
            "character": EARTHLY_BRANCHES[year_branch_index]["character"]
        },
        "hidden_stems": get_hidden_stems_with_ten_gods(year_branch_index, day_stem_index),
        "gan_zhi": GANZHI_COMBINATIONS[(year_stem_index * 6 + year_branch_index // 2) % 60],
        "life_cycle": LIFE_CYCLES[(year_stem_index + year_branch_index) % 12]
    }
    
    month_pillar = {
        "heavenly_stem": {
            "name": HEAVENLY_STEMS[month_stem_index]["name"],
            "character": HEAVENLY_STEMS[month_stem_index]["character"]
        },
        "earthly_branch": {
            "name": EARTHLY_BRANCHES[month_branch_index]["name"],
            "character": EARTHLY_BRANCHES[month_branch_index]["character"]
        },
        "hidden_stems": get_hidden_stems_with_ten_gods(month_branch_index, day_stem_index),
        "gan_zhi": GANZHI_COMBINATIONS[(month_stem_index * 6 + month_branch_index // 2) % 60],
        "life_cycle": LIFE_CYCLES[(month_stem_index + month_branch_index) % 12]
    }
    
    day_pillar = {
        "heavenly_stem": {
            "name": HEAVENLY_STEMS[day_stem_index]["name"],
            "character": HEAVENLY_STEMS[day_stem_index]["character"]
        },
        "earthly_branch": {
            "name": EARTHLY_BRANCHES[day_branch_index]["name"],
            "character": EARTHLY_BRANCHES[day_branch_index]["character"]
        },
        "hidden_stems": get_hidden_stems_with_ten_gods(day_branch_index, day_stem_index),
        "gan_zhi": GANZHI_COMBINATIONS[(day_stem_index * 6 + day_branch_index // 2) % 60],
        "life_cycle": LIFE_CYCLES[(day_stem_index + day_branch_index) % 12]
    }
    
    hour_pillar = {
        "heavenly_stem": {
            "name": HEAVENLY_STEMS[hour_stem_index]["name"],
            "character": HEAVENLY_STEMS[hour_stem_index]["character"]
        },
        "earthly_branch": {
            "name": EARTHLY_BRANCHES[hour_branch_index]["name"],
            "character": EARTHLY_BRANCHES[hour_branch_index]["character"]
        },
        "hidden_stems": get_hidden_stems_with_ten_gods(hour_branch_index, day_stem_index),
        "gan_zhi": GANZHI_COMBINATIONS[(hour_stem_index * 6 + hour_branch_index // 2) % 60],
        "life_cycle": LIFE_CYCLES[(hour_stem_index + hour_branch_index) % 12]
    }
    
    result = {
        "year_pillar": year_pillar,
        "month_pillar": month_pillar, 
        "day_pillar": day_pillar,
        "hour_pillar": hour_pillar
    }
    
    print(f"Pillars calculation completed successfully")
    return result

def calculate_yearly_pillars(start_year, end_year, birth_time):
    """Calculate yearly pillars for a given period"""
    yearly_pillars = []
    
    # Calculate Day Master stem index from birth_time for 10 Gods calculation
    ref_date = datetime.datetime(1900, 1, 1, 0, 0)
    oct_20_1987 = datetime.datetime(1987, 10, 20, 0, 0)
    days_to_oct_1987 = (oct_20_1987 - ref_date).days
    target_stem = 8  # 壬 (Yang Water)
    target_branch = 2  # 寅 (Tiger)
    ref_stem = (target_stem - days_to_oct_1987) % 10
    ref_branch = (target_branch - days_to_oct_1987) % 12
    days_since_ref = (birth_time - ref_date).days
    day_stem_index = (ref_stem + days_since_ref) % 10
    
    for year in range(start_year, end_year + 1):
        # Year stem/branch calculation (same as four pillars year calculation)
        # Adjust year based on accurate Lichun moment
        lichun_moment = get_chinese_new_year_boundary(year)
        adjusted_year = year
        # For yearly calculation, we consider the year itself
        year_offset = adjusted_year - 1984  # 1984 = 甲子 year
        year_stem_index = year_offset % 10
        year_branch_index = year_offset % 12
        
        yearly_pillar = {
            "year": year,
            "heavenly_stem": {
                "name": HEAVENLY_STEMS[year_stem_index]["name"],
                "character": HEAVENLY_STEMS[year_stem_index]["character"]
            },
            "earthly_branch": {
                "name": EARTHLY_BRANCHES[year_branch_index]["name"],
                "character": EARTHLY_BRANCHES[year_branch_index]["character"]
            },
            "hidden_stems": get_hidden_stems_with_ten_gods(year_branch_index, day_stem_index),
            "gan_zhi": GANZHI_COMBINATIONS[(year_stem_index * 6 + year_branch_index // 2) % 60],
            "life_cycle": LIFE_CYCLES[(year_stem_index + year_branch_index) % 12]
        }
        yearly_pillars.append(yearly_pillar)
    
    return yearly_pillars

def calculate_monthly_pillars(year, birth_time):
    """Calculate monthly pillars for a given year"""
    monthly_pillars = []
    
    # Calculate Day Master stem index from birth_time for 10 Gods calculation
    ref_date = datetime.datetime(1900, 1, 1, 0, 0)
    oct_20_1987 = datetime.datetime(1987, 10, 20, 0, 0)
    days_to_oct_1987 = (oct_20_1987 - ref_date).days
    target_stem = 8  # 壬 (Yang Water)
    target_branch = 2  # 寅 (Tiger)
    ref_stem = (target_stem - days_to_oct_1987) % 10
    ref_branch = (target_branch - days_to_oct_1987) % 12
    days_since_ref = (birth_time - ref_date).days
    day_stem_index = (ref_stem + days_since_ref) % 10
    
    # Get year stem for month stem calculation
    year_offset = year - 1984
    year_stem_index = year_offset % 10
    year_stem_type = year_stem_index % 5
    month_stem_starts = [2, 4, 6, 8, 0]  # 丙, 戊, 庚, 壬, 甲
    month_stem_base = month_stem_starts[year_stem_type]
    
    # Generate 12 Chinese months (1=寅月/Tiger to 12=丑月/Ox)
    chinese_month_names = ["寅月", "卯月", "辰月", "巳月", "午月", "未月", 
                           "申月", "酉月", "戌月", "亥月", "子月", "丑月"]
    english_month_names = ["Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat",
                          "Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox"]
    
    for chinese_month in range(1, 13):
        month_stem_index = (month_stem_base + chinese_month - 1) % 10
        # Chinese month 1(寅月)=Tiger(2), 2(卯月)=Rabbit(3), etc.
        month_branch_index = (chinese_month + 1) % 12
        
        monthly_pillar = {
            "month": chinese_month,
            "year": year,
            "month_name": chinese_month_names[chinese_month - 1],
            "month_english": english_month_names[chinese_month - 1],
            "heavenly_stem": {
                "name": HEAVENLY_STEMS[month_stem_index]["name"],
                "character": HEAVENLY_STEMS[month_stem_index]["character"]
            },
            "earthly_branch": {
                "name": EARTHLY_BRANCHES[month_branch_index]["name"],
                "character": EARTHLY_BRANCHES[month_branch_index]["character"]
            },
            "hidden_stems": get_hidden_stems_with_ten_gods(month_branch_index, day_stem_index),
            "gan_zhi": GANZHI_COMBINATIONS[(month_stem_index * 6 + month_branch_index // 2) % 60],
            "life_cycle": LIFE_CYCLES[(month_stem_index + month_branch_index) % 12]
        }
        monthly_pillars.append(monthly_pillar)
    
    return monthly_pillars

def calculate_daily_pillars(year, month, birth_time):
    """Calculate daily pillars for a given month"""
    daily_pillars = []
    
    # Calculate Day Master stem index from birth_time for 10 Gods calculation
    ref_date = datetime.datetime(1900, 1, 1, 0, 0)
    oct_20_1987 = datetime.datetime(1987, 10, 20, 0, 0)
    days_to_oct_1987 = (oct_20_1987 - ref_date).days
    target_stem = 8  # 壬 (Yang Water)
    target_branch = 2  # 寅 (Tiger)
    ref_stem = (target_stem - days_to_oct_1987) % 10
    ref_branch = (target_branch - days_to_oct_1987) % 12
    birth_days_since_ref = (birth_time - ref_date).days
    birth_day_stem_index = (ref_stem + birth_days_since_ref) % 10
    
    # Get number of days in the month
    days_in_month = calendar.monthrange(year, month)[1]
    
    for day in range(1, days_in_month + 1):
        current_date = datetime.datetime(year, month, day, 0, 0)
        days_since_ref = (current_date - ref_date).days
        
        day_stem_index = (ref_stem + days_since_ref) % 10
        day_branch_index = (ref_branch + days_since_ref) % 12
        
        daily_pillar = {
            "day": day,
            "month": month,
            "year": year,
            "heavenly_stem": {
                "name": HEAVENLY_STEMS[day_stem_index]["name"],
                "character": HEAVENLY_STEMS[day_stem_index]["character"]
            },
            "earthly_branch": {
                "name": EARTHLY_BRANCHES[day_branch_index]["name"],
                "character": EARTHLY_BRANCHES[day_branch_index]["character"]
            },
            "hidden_stems": get_hidden_stems_with_ten_gods(day_branch_index, birth_day_stem_index),
            "gan_zhi": GANZHI_COMBINATIONS[(day_stem_index * 6 + day_branch_index // 2) % 60],
            "life_cycle": LIFE_CYCLES[(day_stem_index + day_branch_index) % 12]
        }
        daily_pillars.append(daily_pillar)
    
    return daily_pillars

def calculate_hourly_pillars(year, month, day, birth_time):
    """Calculate hourly pillars for a given day"""
    hourly_pillars = []
    
    # Calculate Day Master stem index from birth_time for 10 Gods calculation
    ref_date = datetime.datetime(1900, 1, 1, 0, 0)
    oct_20_1987 = datetime.datetime(1987, 10, 20, 0, 0)
    days_to_oct_1987 = (oct_20_1987 - ref_date).days
    target_stem = 8  # 壬 (Yang Water)
    target_branch = 2  # 寅 (Tiger)
    ref_stem = (target_stem - days_to_oct_1987) % 10
    ref_branch = (target_branch - days_to_oct_1987) % 12
    birth_days_since_ref = (birth_time - ref_date).days
    birth_day_stem_index = (ref_stem + birth_days_since_ref) % 10
    
    # Get day stem for hour stem calculation
    current_date = datetime.datetime(year, month, day, 0, 0)
    days_since_ref = (current_date - ref_date).days
    day_stem_index = (ref_stem + days_since_ref) % 10
    day_stem_type = day_stem_index % 5
    hour_stem_starts = [0, 2, 4, 6, 8]  # 甲, 丙, 戊, 庚, 壬
    hour_stem_base = hour_stem_starts[day_stem_type]
    
    # Generate 12 double-hour periods
    hour_names = ["子時", "丑時", "寅時", "卯時", "辰時", "巳時", 
                  "午時", "未時", "申時", "酉時", "戌時", "亥時"]
    hour_times = ["23:00-01:00", "01:00-03:00", "03:00-05:00", "05:00-07:00",
                  "07:00-09:00", "09:00-11:00", "11:00-13:00", "13:00-15:00",
                  "15:00-17:00", "17:00-19:00", "19:00-21:00", "21:00-23:00"]
    
    for hour_idx in range(12):
        hour_stem_index = (hour_stem_base + hour_idx) % 10
        hour_branch_index = hour_idx
        
        hourly_pillar = {
            "hour_name": hour_names[hour_idx],
            "hour_time": hour_times[hour_idx],
            "day": day,
            "month": month,
            "year": year,
            "heavenly_stem": {
                "name": HEAVENLY_STEMS[hour_stem_index]["name"],
                "character": HEAVENLY_STEMS[hour_stem_index]["character"]
            },
            "earthly_branch": {
                "name": EARTHLY_BRANCHES[hour_branch_index]["name"],
                "character": EARTHLY_BRANCHES[hour_branch_index]["character"]
            },
            "hidden_stems": get_hidden_stems_with_ten_gods(hour_branch_index, birth_day_stem_index),
            "gan_zhi": GANZHI_COMBINATIONS[(hour_stem_index * 6 + hour_branch_index // 2) % 60],
            "life_cycle": LIFE_CYCLES[(hour_stem_index + hour_branch_index) % 12]
        }
        hourly_pillars.append(hourly_pillar)
    
    return hourly_pillars

def calculate_dayun_start_age(birth_time, four_pillars, forward):
    """Calculate the exact starting age for Dayun (Luck Pillars)
    
    According to Bazi rules:
    - If forward: count days from birth to NEXT Jie Qi (solar term)
    - If backward: count days from birth to PREVIOUS Jie Qi (solar term)
    - 3 days = 1 year
    - 1 day = 4 months (120 days)
    - 1 hour ≈ 10 days
    
    IMPORTANT: We use 24 Solar Terms (Jie Qi), NOT lunar calendar!
    
    Args:
        birth_time: Birth datetime (timezone-naive)
        four_pillars: Dict with four pillars info
        forward: Boolean, True if going forward, False if backward
    
    Returns:
        Tuple: (years, months) - start age breakdown
    """
    year = birth_time.year
    
    # All 24 Jie Qi in order (these are the MAJOR solar terms that matter for Bazi)
    # We only need the 12 that define month boundaries
    jieqi_list = [
        ('lichun', 2),     # 立春 - Start of Spring (Tiger month)
        ('jingzhe', 3),    # 驚蟄 - Awakening of Insects (Rabbit month)
        ('qingming', 4),   # 清明 - Clear and Bright (Dragon month)
        ('lixia', 5),      # 立夏 - Start of Summer (Snake month)
        ('mangzhong', 6),  # 芒種 - Grain in Ear (Horse month)
        ('xiaoshu', 7),    # 小暑 - Minor Heat (Goat month)
        ('liqiu', 8),      # 立秋 - Start of Autumn (Monkey month)
        ('bailu', 9),      # 白露 - White Dew (Rooster month)
        ('hanlu', 10),     # 寒露 - Cold Dew (Dog month)
        ('lidong', 11),    # 立冬 - Start of Winter (Pig month)
        ('daxue', 12),     # 大雪 - Major Snow (Rat month)
        ('dongzhi', 1),    # 冬至 - Winter Solstice (Ox month)
    ]
    
    # Get all Jie Qi moments for current year and next year (for year boundary)
    jieqi_moments = []
    
    for jieqi_name, month_num in jieqi_list:
        # Get current year's Jie Qi
        jq = get_solar_term_moment(year, jieqi_name, convert_to_local=True)
        jieqi_moments.append((jieqi_name, jq))
        
        # Also get next year's Jie Qi (for handling year boundary)
        jq_next = get_solar_term_moment(year + 1, jieqi_name, convert_to_local=True)
        jieqi_moments.append((jieqi_name, jq_next))
    
    # Sort by datetime
    jieqi_moments.sort(key=lambda x: x[1])
    
    # Find the relevant Jie Qi
    if forward:
        # Forward: Find the NEXT Jie Qi after birth_time
        next_jieqi_name = None
        next_jieqi_time = None
        
        for jieqi_name, jq_time in jieqi_moments:
            if jq_time > birth_time:
                next_jieqi_name = jieqi_name
                next_jieqi_time = jq_time
                break
        
        if next_jieqi_time is None:
            # Should not happen, but fallback
            print("Error: Could not find next Jie Qi")
            return 3, 0
        
        # Calculate time difference
        time_diff = next_jieqi_time - birth_time
        
        print(f"Dayun (FORWARD): Birth -> Next Jie Qi ({next_jieqi_name})")
        print(f"  Birth time: {birth_time}")
        print(f"  Next Jie Qi: {next_jieqi_time}")
        
    else:
        # Backward: Find the PREVIOUS Jie Qi before birth_time
        prev_jieqi_name = None
        prev_jieqi_time = None
        
        for jieqi_name, jq_time in reversed(jieqi_moments):
            if jq_time < birth_time:
                prev_jieqi_name = jieqi_name
                prev_jieqi_time = jq_time
                break
        
        if prev_jieqi_time is None:
            # Should not happen, but fallback
            print("Error: Could not find previous Jie Qi")
            return 3, 0
        
        # Calculate time difference
        time_diff = birth_time - prev_jieqi_time
        
        print(f"Dayun (BACKWARD): Previous Jie Qi ({prev_jieqi_name}) -> Birth")
        print(f"  Previous Jie Qi: {prev_jieqi_time}")
        print(f"  Birth time: {birth_time}")
    
    # Calculate total days and hours
    total_days = time_diff.days
    total_seconds = time_diff.seconds
    total_hours = total_seconds / 3600.0
    
    print(f"  Time difference: {total_days} days, {total_hours:.2f} hours")
    
    # Standard method: 3 days = 1 year
    # Convert everything to days first (including hours)
    # 1 hour = 10 days / 24 hours = 0.4167 days (but traditional: 2 hours = 10 days, so 1 hour = 5 days worth of luck)
    # Actually, the traditional formula is simpler:
    # 3 REAL days = 1 luck year
    # So we just divide total days by 3
    
    # For more precision, convert hours to fractional days
    # But standard practice: only count full days, ignore hours for start age
    # OR: if you want precision, 1 day = 24 hours, so add hours/24 to days
    
    # Method 1: Simple (most common)
    # Just use full days
    years = total_days // 3
    remaining_days = total_days % 3
    months = remaining_days * 4  # 1 day = 4 months
    
    # Method 2: With hour precision (optional, more accurate)
    # Uncomment below if you want to include hours
    # total_days_with_hours = total_days + (total_hours / 24.0)
    # years = int(total_days_with_hours / 3)
    # remaining = total_days_with_hours - (years * 3)
    # months = int(remaining * 4)  # 1 day = 4 months
    
    print(f"  Calculated start age: {years} years, {months} months")
    
    return int(years), int(months)


def calculate_luck_pillars(birth_time, gender, four_pillars):
    """Calculate Luck Pillars (Dayun)"""
    
    # Ensure we're working with a timezone-naive datetime for calculations
    if birth_time.tzinfo is not None:
        birth_time = birth_time.replace(tzinfo=None)
    
    luck_pillars = []
    
    # Determine direction and starting age based on gender and year stem polarity
    year_stem_name = four_pillars["year_pillar"]["heavenly_stem"]["name"]
    yang_year = "Yang" in year_stem_name
    
    # Yang year male or Yin year female go forward, others go backward
    forward = (yang_year and gender == 1) or (not yang_year and gender == 0)
    
    # Starting month stem/branch from birth month
    start_stem_idx = next(i for i, stem in enumerate(HEAVENLY_STEMS) 
                         if stem["name"] == four_pillars["month_pillar"]["heavenly_stem"]["name"])
    start_branch_idx = next(i for i, branch in enumerate(EARTHLY_BRANCHES)
                           if branch["name"] == four_pillars["month_pillar"]["earthly_branch"]["name"])
    
    # Get Day Master index for 10 Gods calculation
    day_stem_idx = next(i for i, stem in enumerate(HEAVENLY_STEMS)
                       if stem["name"] == four_pillars["day_pillar"]["heavenly_stem"]["name"])
    
    # Calculate exact starting age based on Jie Qi distance
    start_years, start_months = calculate_dayun_start_age(birth_time, four_pillars, forward)
    base_age = start_years  # Use years as base age
    
    # If months >= 6, round up to next year
    if start_months >= 6:
        base_age += 1
    
    print(f"Luck pillars calculation: forward={forward}, base_age={base_age} (exact: {start_years}y {start_months}m)")
    
    # Generate 10 luck pillars (standard)
    for i in range(10):
        if forward:
            stem_idx = (start_stem_idx + i + 1) % 10
            branch_idx = (start_branch_idx + i + 1) % 12
        else:
            stem_idx = (start_stem_idx - i - 1) % 10
            branch_idx = (start_branch_idx - i - 1) % 12
            
        # Calculate start year and age
        start_age = base_age + (i * 10)
        start_year = birth_time.year + start_age
        end_year = start_year + 9
        
        # Calculate time when this luck pillar begins - use birth month/day
        try:
            luck_start_time = birth_time.replace(year=start_year)
        except ValueError:
            # Handle leap year issues (Feb 29)
            luck_start_time = birth_time.replace(year=start_year, month=2, day=28)
        
        luck_pillar = {
            "number": i + 1,
            "heavenly_stem": {
                "name": HEAVENLY_STEMS[stem_idx]["name"],
                "character": HEAVENLY_STEMS[stem_idx]["character"]
            },
            "earthly_branch": {
                "name": EARTHLY_BRANCHES[branch_idx]["name"],
                "character": EARTHLY_BRANCHES[branch_idx]["character"]
            },
            "hidden_stems": get_hidden_stems_with_ten_gods(branch_idx, day_stem_idx),
            "gan_zhi": GANZHI_COMBINATIONS[(stem_idx * 6 + branch_idx // 2) % 60],
            "year_start": start_year,
            "year_end": end_year,
            "time": luck_start_time.isoformat()
        }
        
        luck_pillars.append(luck_pillar)
    
    print(f"Generated {len(luck_pillars)} luck pillars")
    return {"luck_pillars": luck_pillars}

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/calculate', methods=['POST'])
def calculate_bazi():
    try:
        data = request.get_json()
        print(f"Received data: {data}")  # Debug log
        
        # Parse input data
        date_time_str = data['dateTime']
        timezone_str = data['location']
        gender = int(data['gender'])  # 0 = female, 1 = male
        
        print(f"Parsing datetime: {date_time_str}")
        print(f"Timezone: {timezone_str}")
        print(f"Gender: {gender}")
        
        # Parse datetime - handle both with and without timezone
        if 'T' in date_time_str:
            birth_time = datetime.datetime.fromisoformat(date_time_str.replace('Z', '+00:00'))
        else:
            birth_time = datetime.datetime.strptime(date_time_str, '%Y-%m-%d %H:%M')
        
        # Remove any existing timezone info and apply the selected timezone
        birth_time = birth_time.replace(tzinfo=None)
        
        # Apply timezone if specified
        if timezone_str and timezone_str != 'GMT':
            try:
                target_tz = tz.gettz(timezone_str)
                if target_tz:
                    birth_time = birth_time.replace(tzinfo=target_tz)
                print(f"Applied timezone: {birth_time}")
            except Exception as tz_error:
                print(f"Timezone error: {tz_error}")
                # Continue with naive datetime if timezone fails
        
        print(f"Final birth time: {birth_time}")
        
        # Calculate Four Pillars
        four_pillars = calculate_pillars(birth_time)
        print(f"Four pillars calculated: {list(four_pillars.keys())}")
        
        # Calculate Luck Pillars  
        luck_pillars = calculate_luck_pillars(birth_time, gender, four_pillars)
        print(f"Luck pillars calculated: {len(luck_pillars['luck_pillars'])} pillars")
        
        # Return result
        result = {
            "four_pillars": four_pillars,
            "luck_pillars": luck_pillars
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in calculate_bazi: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/calculate_yearly', methods=['POST'])
def calculate_yearly():
    try:
        data = request.get_json()
        start_year = int(data['start_year'])
        end_year = int(data['end_year'])
        birth_time_str = data['birth_time']
        
        # Parse birth time
        birth_time = datetime.datetime.fromisoformat(birth_time_str.replace('Z', '+00:00'))
        birth_time = birth_time.replace(tzinfo=None)
        
        yearly_pillars = calculate_yearly_pillars(start_year, end_year, birth_time)
        
        return jsonify({"yearly_pillars": yearly_pillars})
        
    except Exception as e:
        print(f"Error in calculate_yearly: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/calculate_monthly', methods=['POST'])
def calculate_monthly():
    try:
        data = request.get_json()
        year = int(data['year'])
        birth_time_str = data['birth_time']
        
        # Parse birth time
        birth_time = datetime.datetime.fromisoformat(birth_time_str.replace('Z', '+00:00'))
        birth_time = birth_time.replace(tzinfo=None)
        
        monthly_pillars = calculate_monthly_pillars(year, birth_time)
        
        return jsonify({"monthly_pillars": monthly_pillars})
        
    except Exception as e:
        print(f"Error in calculate_monthly: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/calculate_daily', methods=['POST'])
def calculate_daily():
    try:
        data = request.get_json()
        year = int(data['year'])
        month = int(data['month'])
        birth_time_str = data['birth_time']
        
        # Parse birth time
        birth_time = datetime.datetime.fromisoformat(birth_time_str.replace('Z', '+00:00'))
        birth_time = birth_time.replace(tzinfo=None)
        
        daily_pillars = calculate_daily_pillars(year, month, birth_time)
        
        return jsonify({"daily_pillars": daily_pillars})
        
    except Exception as e:
        print(f"Error in calculate_daily: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/calculate_hourly', methods=['POST'])
def calculate_hourly():
    try:
        data = request.get_json()
        year = int(data['year'])
        month = int(data['month'])
        day = int(data['day'])
        birth_time_str = data['birth_time']
        
        # Parse birth time
        birth_time = datetime.datetime.fromisoformat(birth_time_str.replace('Z', '+00:00'))
        birth_time = birth_time.replace(tzinfo=None)
        
        hourly_pillars = calculate_hourly_pillars(year, month, day, birth_time)
        
        return jsonify({"hourly_pillars": hourly_pillars})
        
    except Exception as e:
        print(f"Error in calculate_hourly: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Bazi Calculator Server...")
    print("Server will be available at: http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)