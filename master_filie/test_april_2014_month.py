#!/usr/bin/env python3
"""
Test Month Transition - April 2014
Verifikasi transisi bulan Qingming 2014
"""

import json
from datetime import datetime, timedelta
from dateutil import tz

# Load Jieqi data
with open('jieqi_ultra_precise_1909_2183_cst.json', 'r') as f:
    jieqi_data = json.load(f)

print("=" * 80)
print("TEST TRANSISI BULAN - APRIL 2014")
print("=" * 80)
print()

# Get Qingming 2014
qingming_2014_str = jieqi_data['2014']['qingming']
qingming_2014 = datetime.strptime(qingming_2014_str, '%Y-%m-%d %H:%M:%S')

print(f"Qingming 2014: {qingming_2014} CST")
print()

# Test case: 5 April 2014, 4:46 WIB
print("Test Case 1: 5 April 2014, 04:46 WIB")
print("-" * 80)

input_wib = datetime(2014, 4, 5, 4, 46, 0)
wib_tz = tz.gettz('Asia/Jakarta')
input_with_tz = input_wib.replace(tzinfo=wib_tz)

# Convert to CST
cst_tz = tz.gettz('Asia/Shanghai')
input_cst = input_with_tz.astimezone(cst_tz).replace(tzinfo=None)

print(f"Input (WIB):   {input_wib} WIB")
print(f"Converted CST: {input_cst} CST")
print(f"Qingming:      {qingming_2014} CST")
print()

if input_cst < qingming_2014:
    print("Input < Qingming → Month = Mao (卯) Rabbit")
    print("Ini BENAR karena 05:46:00 < 05:46:51 (belum Qingming)")
    diff = (qingming_2014 - input_cst).total_seconds()
    print(f"Selisih: {diff} detik ({diff/60:.2f} menit)")
else:
    print("Input >= Qingming → Month = Chen (辰) Dragon")
    print("Ini BENAR karena sudah melewati Qingming")
    diff = (input_cst - qingming_2014).total_seconds()
    print(f"Selisih: {diff} detik ({diff/60:.2f} menit)")

print()
print()

# Test case 2: 5 April 2014, 5:00 WIB (after Qingming)
print("Test Case 2: 5 April 2014, 05:00 WIB (pasti setelah Qingming)")
print("-" * 80)

input_wib_2 = datetime(2014, 4, 5, 5, 0, 0)
input_with_tz_2 = input_wib_2.replace(tzinfo=wib_tz)
input_cst_2 = input_with_tz_2.astimezone(cst_tz).replace(tzinfo=None)

print(f"Input (WIB):   {input_wib_2} WIB")
print(f"Converted CST: {input_cst_2} CST")
print(f"Qingming:      {qingming_2014} CST")
print()

if input_cst_2 < qingming_2014:
    print("Input < Qingming → Month = Mao (卯) Rabbit")
else:
    print("Input >= Qingming → Month = Chen (辰) Dragon")
    diff = (input_cst_2 - qingming_2014).total_seconds()
    print(f"Selisih: {diff} detik ({diff/60:.2f} menit)")

print()
print()

# Test case 3: 5 April 2014, 4:47 WIB (should be after Qingming)
print("Test Case 3: 5 April 2014, 04:47 WIB (harusnya setelah Qingming)")
print("-" * 80)

input_wib_3 = datetime(2014, 4, 5, 4, 47, 0)
input_with_tz_3 = input_wib_3.replace(tzinfo=wib_tz)
input_cst_3 = input_with_tz_3.astimezone(cst_tz).replace(tzinfo=None)

print(f"Input (WIB):   {input_wib_3} WIB")
print(f"Converted CST: {input_cst_3} CST")
print(f"Qingming:      {qingming_2014} CST")
print()

if input_cst_3 < qingming_2014:
    print("Input < Qingming → Month = Mao (卯) Rabbit")
else:
    print("Input >= Qingming → Month = Chen (辰) Dragon")
    diff = (input_cst_3 - qingming_2014).total_seconds()
    print(f"Selisih: {diff} detik ({diff/60:.2f} menit)")

print()
print()

# Test full calculation with app
print("=" * 80)
print("FULL CALCULATION TEST")
print("=" * 80)
print()

import sys
sys.path.append('bazica_web.tommitoan.com/bazica-web.tommitoan.com/bazica-duplicate')
import importlib.util

spec = importlib.util.spec_from_file_location("app", "bazica_web.tommitoan.com/bazica-web.tommitoan.com/bazica-duplicate/app.py")
app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app)

# Test with app.calculate_pillars
test_birth = datetime(2014, 4, 5, 4, 46, 0, tzinfo=wib_tz)
print(f"Input: 2014-04-05 04:46 WIB")
print(f"Expected: Month = Chen (辰) Dragon (karena user bilang sudah masuk Chen)")
print()

try:
    pillars = app.calculate_pillars(test_birth)
    
    month_stem = pillars['month_pillar']['heavenly_stem']['character']
    month_branch = pillars['month_pillar']['earthly_branch']['character']
    month_name = pillars['month_pillar']['earthly_branch']['name']
    
    print(f"Result Month Pillar: {month_stem}{month_branch} ({month_name})")
    print()
    
    if month_branch == '辰':
        print("✅ MONTH PILLAR CORRECT: Chen (辰) Dragon")
    else:
        print(f"❌ MONTH PILLAR: {month_branch} ({month_name})")
        print(f"   User expects: 辰 (Chen - Dragon)")
        print(f"   Qingming 2014: {qingming_2014} CST")
        print(f"   Input CST:     {input_cst} CST")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
