# BAZI CALCULATOR - BACKUP FOLDER

**Backup Date:** May 6, 2026
**Location:** `d:\BAZI\Bahan Software\20251119 kombinasi ok dan tambahan kalkulator\BAZI 01`

---

## 📁 FILES INCLUDED

### Core Application Files:
- ✅ **app.py** (56.9 KB) - Flask backend with all calculation logic
- ✅ **index.html** (10.7 KB) - Frontend HTML structure
- ✅ **script.js** (102.4 KB) - All JavaScript logic + combination detection
- ✅ **style.css** (34.6 KB) - Complete styling with toggle button styles

### Jieqi Data Files:
- ✅ **jieqi_ultra_precise_1909_2183_cst.json** (257 KB) - Ultra-precise 24 Jieqi data (274 years, CST timezone)
- ✅ **complete_jieqi_data_1909_2183.json** (258 KB) - Original complete Jieqi data
- ✅ **corrected_final_jieqi_data_1900_2150.json** (235 KB) - Legacy corrected data

### Documentation Files:
- ✅ **FEATURE_CLASSIC_MODERN_TOGGLE.md** - Classic/Modern terminology toggle feature
- ✅ **UPDATE_CLASSIC_MODERN_TERMINOLOGY.md** - Updated terminology mapping (Pinyin vs English)
- ✅ **FEATURE_CURRENT_DAY_PILLAR.md** - Current Day Pillar implementation
- ✅ **FIX_CURRENT_DAY_COMBINATIONS.md** - Current Day combinations fix
- ✅ **FIX_HOUR_PILLAR_CALCULATION.md** - Hour pillar calculation fix
- ✅ **FIX_TIMEZONE_HOUR_PILLAR.md** - Timezone conversion fix for hour pillar

### Test Files:
- ✅ **test_calculations.py** - Calculation test suite
- ✅ **test_multiple_dates.py** - Multi-date testing

---

## 🎯 FEATURES IMPLEMENTED (as of May 6, 2026)

### 1. Ultra-Precise Jieqi Data
- 274 years of data (1910-2183)
- 24 solar terms per year
- VSOP87 + Kepler calculations
- CST (UTC+8) timezone

### 2. Accurate Pillar Transitions
- **Year:** Based on Lichun (立春) exact moment
- **Month:** Based on 12 Jieqi points
- **Day:** Changes at 23:00 (Zi hour 子时), not midnight
- **Hour:** Correct 2-hour periods (23:00-00:59 = Zi, etc.)

### 3. Current Pillars Display
- Current Year Pillar
- Current Month Pillar
- **NEW:** Current Day Pillar (with 23:00 transition)
- Current Luck Cycle

### 4. Combination Detection
- **Heavenly Stems:** 5 combinations (Tian Gan Wu He / HS Combinations)
- **Earthly Branches:**
  - Positive: San Hui, San He, Ban He, Liu He
  - Negative: Wu En Zhi Xing, Chi Shi Zhi Xing, Wu Li Zhi Xing, Zi Xing, Liu Chong, Xiang Po, Xiang Hai

### 5. Classic/Modern Toggle
- **Classic Mode:** Pinyin terms (San He, Liu Chong, Wu En Zhi Xing)
- **Modern Mode:** English terms (Three Harmonies, Six Clashes, Ungrateful Punishment)
- Toggle button below Calculate button
- Dynamic label updates

### 6. Timezone Handling
- User input in local timezone (e.g., WIB UTC+7)
- Jieqi data in CST (UTC+8)
- Automatic conversion for accurate comparisons
- No timezone shift for user's time

---

## 🚀 HOW TO RUN

### Option 1: Using Flask Server (Current Setup)
```bash
cd "d:\BAZI\Bahan Software\20251119 kombinasi ok dan tambahan kalkulator\BAZI 01"
python app.py
```
Then open browser to: http://localhost:5000

### Requirements:
- Python 3.x
- Flask
- pytz
- tzlocal

---

## 📊 KEY IMPROVEMENTS MADE TODAY

1. ✅ Fixed Hour Pillar timezone issue (was off by 1 hour)
2. ✅ Added Current Day Pillar with combinations
3. ✅ Implemented Classic/Modern terminology toggle
4. ✅ Fixed all timezone conversions (user time vs Jieqi time)
5. ✅ Updated all combination labels (Pinyin vs English)

---

## 🔧 IMPORTANT FILES

- **app.py** - Main backend logic (DO NOT DELETE)
- **jieqi_ultra_precise_1909_2183_cst.json** - Critical Jieqi data (DO NOT DELETE)
- **script.js** - All frontend logic including combinations
- **index.html** - UI structure with toggle buttons

---

## ⚠️ NOTES

- This is a **BACKUP** folder - original files remain in `bazica-duplicate`
- All calculations are **server-side** (Python/Flask)
- JavaScript handles UI and combination detection only
- Timezone conversion is critical for accuracy

---

**Created by:** Bazi Calculator Development Team
**Last Updated:** May 6, 2026 11:17 PM
**Status:** ✅ COMPLETE BACKUP
