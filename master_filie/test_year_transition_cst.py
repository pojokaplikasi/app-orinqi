#!/usr/bin/env python3
"""
Test Year/Month/Day Transition with CST Fix
Verifikasi bahwa transisi tahun, bulan, hari sudah benar menggunakan CST
"""

import sys
import datetime
from dateutil import tz

# Add app.py to path
sys.path.append('bazica_web.tommitoan.com/bazica-web.tommitoan.com/bazica-duplicate')

# Import functions from app
import importlib.util
spec = importlib.util.spec_from_file_location("app", "bazica_web.tommitoan.com/bazica-web.tommitoan.com/bazica-duplicate/app.py")
app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app)

print("=" * 80)
print("TEST TRANSISI TAHUN/BULAN/HARI DENGAN CST (UTC+8)")
print("=" * 80)
print()

# Test Case 1: 4 Februari 2027, 9:46 pagi WIB
print("TEST CASE 1: 4 Februari 2027, 9:46 pagi WIB")
print("-" * 80)

# User input: 2027-02-04 09:46 WIB
# WIB = UTC+7, so this is 2027-02-04 02:46 UTC
# CST = UTC+8, so this is 2027-02-04 10:46 CST

# Check Lichun 2027
lichun_2027 = app.get_chinese_new_year_boundary(2027)
print(f"Lichun 2027: {lichun_2027} CST")

# Convert input to CST
# 9:46 WIB = 10:46 CST (add 1 hour)
birth_wib = datetime.datetime(2027, 2, 4, 9, 46, 0)
wib_tz = tz.gettz('Asia/Jakarta')
birth_with_tz = birth_wib.replace(tzinfo=wib_tz)

# Convert to CST
cst_tz = tz.gettz('Asia/Shanghai')
birth_cst = birth_with_tz.astimezone(cst_tz).replace(tzinfo=None)

print(f"Input (WIB):    {birth_wib} WIB")
print(f"Converted CST:  {birth_cst} CST")
print()

# Determine year
if birth_cst >= lichun_2027:
    bazi_year = 2027
    print(f"Birth >= Lichun → Bazi Year = 2027")
else:
    bazi_year = 2026
    print(f"Birth < Lichun → Bazi Year = 2026")

# Calculate year pillar
year_offset = bazi_year - 1984
year_stem_index = year_offset % 10
year_branch_index = year_offset % 12

year_stem = app.HEAVENLY_STEMS[year_stem_index]
year_branch = app.EARTHLY_BRANCHES[year_branch_index]

print(f"Year Pillar: {year_stem['character']}{year_branch['character']} ({year_stem['name']} {year_branch['name']})")
print(f"  Stem: {year_stem['character']} ({year_stem['name']}, index {year_stem_index})")
print(f"  Branch: {year_branch['character']} ({year_branch['name']}, index {year_branch_index})")
print()

# Expected: 丁未 (Ding Wei) = Fire Goat
# 丁 = index 3, 未 = index 7
# Year 2027: (2027-1984) % 10 = 43 % 10 = 3 (丁)
# Year 2027: (2027-1984) % 12 = 43 % 12 = 7 (未)
print("Expected: 丁未 (Ding Wei - Fire Goat)")
if year_stem_index == 3 and year_branch_index == 7:
    print("✅ CORRECT! Year pillar is 丁未")
else:
    print(f"❌ WRONG! Got index stem={year_stem_index}, branch={year_branch_index}")

print()
print()

# Test Case 2: Same date but AFTER Lichun
print("TEST CASE 2: 4 Februari 2027, 18:00 WIB (setelah Lichun)")
print("-" * 80)

birth_wib_2 = datetime.datetime(2027, 2, 4, 18, 0, 0)
birth_with_tz_2 = birth_wib_2.replace(tzinfo=wib_tz)
birth_cst_2 = birth_with_tz_2.astimezone(cst_tz).replace(tzinfo=None)

print(f"Input (WIB):    {birth_wib_2} WIB")
print(f"Converted CST:  {birth_cst_2} CST")
print(f"Lichun 2027:    {lichun_2027} CST")

if birth_cst_2 >= lichun_2027:
    bazi_year_2 = 2027
    print(f"Birth >= Lichun → Bazi Year = 2027")
else:
    bazi_year_2 = 2026
    print(f"Birth < Lichun → Bazi Year = 2026")

year_offset_2 = bazi_year_2 - 1984
year_stem_index_2 = year_offset_2 % 10
year_branch_index_2 = year_offset_2 % 12

year_stem_2 = app.HEAVENLY_STEMS[year_stem_index_2]
year_branch_2 = app.EARTHLY_BRANCHES[year_branch_index_2]

print(f"Year Pillar: {year_stem_2['character']}{year_branch_2['character']} ({year_stem_2['name']} {year_branch_2['name']})")
print()

print()

# Test Case 3: Test month transition
print("TEST CASE 3: Month transition test (5 Maret 2024)")
print("-" * 80)

# Get Jingzhe 2024
jingzhe_2024 = app.get_solar_term_moment(2024, 'jingzhe')
print(f"Jingzhe 2024: {jingzhe_2024} CST")

# Test before Jingzhe
birth_wib_3 = datetime.datetime(2024, 3, 5, 10, 0, 0)  # 10:00 WIB
birth_with_tz_3 = birth_wib_3.replace(tzinfo=wib_tz)
birth_cst_3 = birth_with_tz_3.astimezone(cst_tz).replace(tzinfo=None)

print(f"Input (WIB):    {birth_wib_3} WIB")
print(f"Converted CST:  {birth_cst_3} CST")

if birth_cst_3 < jingzhe_2024:
    print("Birth < Jingzhe → Month 1 (Tiger 寅)")
    month_num = 1
else:
    print("Birth >= Jingzhe → Month 2 (Rabbit 卯)")
    month_num = 2

print()

# Test after Jingzhe
birth_wib_4 = datetime.datetime(2024, 3, 5, 13, 0, 0)  # 13:00 WIB
birth_with_tz_4 = birth_wib_4.replace(tzinfo=wib_tz)
birth_cst_4 = birth_with_tz_4.astimezone(cst_tz).replace(tzinfo=None)

print(f"Input (WIB):    {birth_wib_4} WIB")
print(f"Converted CST:  {birth_cst_4} CST")

if birth_cst_4 < jingzhe_2024:
    print("Birth < Jingzhe → Month 1 (Tiger 寅)")
else:
    print("Birth >= Jingzhe → Month 2 (Rabbit 卯)")
    month_num = 2

print()

print("=" * 80)
print("FULL PILLAR CALCULATION TEST")
print("=" * 80)
print()

# Test full calculation with app.calculate_pillars
print("Testing full calculate_pillars function:")
print()

# Create test datetime with timezone
test_birth = datetime.datetime(2027, 2, 4, 9, 46, 0, tzinfo=wib_tz)
print(f"Input: 2027-02-04 09:46 WIB")

try:
    pillars = app.calculate_pillars(test_birth)
    print()
    print("Result:")
    print(f"  Year Pillar:  {pillars['year']['character']}")
    print(f"  Month Pillar: {pillars['month']['character']}")
    print(f"  Day Pillar:   {pillars['day']['character']}")
    print(f"  Hour Pillar:  {pillars['hour']['character']}")
    print()
    
    if pillars['year']['character'] == '丁未':
        print("✅ YEAR PILLAR CORRECT: 丁未 (Ding Wei)")
    else:
        print(f"❌ YEAR PILLAR WRONG: Expected 丁未, got {pillars['year']['character']}")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
