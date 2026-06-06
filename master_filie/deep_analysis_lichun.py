#!/usr/bin/env python3
"""
DEEP ANALYSIS: Why Lichun year transition is not working correctly?
Testing the ENTIRE calculation flow from frontend input to backend calculation
"""

import sys
sys.path.insert(0, 'bazica_web.tommitoan.com/bazica-web.tommitoan.com/bazica-duplicate')

from app import get_chinese_new_year_boundary, get_solar_term_moment, get_verified_solar_month
from datetime import datetime, timedelta
import json

print("="*120)
print("DEEP ROOT CAUSE ANALYSIS - LICHUN YEAR TRANSITION")
print("="*120)

# Test case: 1999-02-04 14:57:00 WIB (EXACT Lichun time)
test_wib = datetime(1999, 2, 4, 14, 57, 0)
test_utc = test_wib - timedelta(hours=7)  # Convert to UTC

print(f"\n🎯 TEST CASE:")
print(f"   Input (WIB): {test_wib}")
print(f"   Input (UTC): {test_utc}")
print()

# ============================================================================
# STEP 1: Check what Lichun moment the system returns
# ============================================================================
print("="*120)
print("STEP 1: Get Lichun Moment from System")
print("="*120)

lichun_from_system = get_chinese_new_year_boundary(1999)
print(f"Lichun moment for 1999 (UTC): {lichun_from_system}")
print(f"Lichun moment for 1999 (WIB): {lichun_from_system + timedelta(hours=7)}")

# Load actual data from JSON to compare
with open('complete_jieqi_data_1909_2183.json', 'r') as f:
    jieqi_data = json.load(f)

lichun_from_json = datetime.strptime(jieqi_data['1999']['lichun'], '%Y-%m-%d %H:%M:%S')
print(f"Lichun in JSON (UTC):         {lichun_from_json}")
print(f"Lichun in JSON (WIB):         {lichun_from_json + timedelta(hours=7)}")

if lichun_from_system == lichun_from_json:
    print("✅ Lichun moment CORRECT")
else:
    print("❌ Lichun moment MISMATCH!")
    print(f"   Difference: {(lichun_from_system - lichun_from_json).total_seconds()} seconds")

print()

# ============================================================================
# STEP 2: Simulate the year determination logic in calculate_bazi_pillars
# ============================================================================
print("="*120)
print("STEP 2: Year Determination Logic Simulation")
print("="*120)

birth_time = test_utc  # The input time in UTC
year = birth_time.year
print(f"Input year from birth_time: {year}")
print(f"Birth time (UTC): {birth_time}")
print(f"Lichun (UTC):     {lichun_from_system}")
print()

# Current FIXED logic
print("Current logic (FIXED):")
print(f"  if birth_time >= lichun_moment:")
print(f"      pass  # Keep current year")
print(f"  else:")
print(f"      year -= 1")
print()

comparison_result = birth_time >= lichun_from_system
print(f"Comparison: {birth_time} >= {lichun_from_system}")
print(f"Result: {comparison_result}")
print()

if comparison_result:
    final_year = year
    print(f"✅ Decision: Keep year {final_year} (Rabbit)")
else:
    year -= 1
    final_year = year
    print(f"❌ Decision: Decrement to year {final_year} (Tiger)")

print()

# ============================================================================
# STEP 3: Check what the ACTUAL expectation is
# ============================================================================
print("="*120)
print("STEP 3: Expected Result")
print("="*120)

expected_animal = "Rabbit" if final_year == 1999 else "Tiger"
print(f"At EXACT Lichun (14:57:00 WIB), should be: Rabbit year (1999)")
print(f"System calculates: {'Rabbit' if final_year == 1999 else 'Tiger'} year ({final_year})")

if final_year == 1999:
    print("✅ CORRECT!")
else:
    print("❌ WRONG! Need investigation...")

print()

# ============================================================================
# STEP 4: Test edge cases around Lichun
# ============================================================================
print("="*120)
print("STEP 4: Edge Case Testing (1 second precision)")
print("="*120)

edge_cases = [
    ("1 second before", datetime(1999, 2, 4, 7, 56, 59)),  # 14:56:59 WIB
    ("AT Lichun", datetime(1999, 2, 4, 7, 57, 0)),        # 14:57:00 WIB
    ("1 second after", datetime(1999, 2, 4, 7, 57, 1)),   # 14:57:01 WIB
]

for label, test_time in edge_cases:
    test_year = test_time.year
    if test_time >= lichun_from_system:
        result_year = test_year
        animal = "Rabbit"
    else:
        result_year = test_year - 1
        animal = "Tiger"
    
    wib_time = test_time + timedelta(hours=7)
    expected = "Rabbit" if test_time >= lichun_from_system else "Tiger"
    status = "✅" if animal == expected else "❌"
    
    print(f"{status} {label:20s}: UTC={test_time} | WIB={wib_time} | Year={result_year} ({animal})")

print()

# ============================================================================
# STEP 5: Check if there's timezone confusion in the code
# ============================================================================
print("="*120)
print("STEP 5: Timezone Analysis")
print("="*120)

print("Question: Is the birth_time passed to calculate_bazi_pillars in UTC or WIB?")
print()
print("Scenario A: If birth_time is in WIB (user input)")
print("  - User inputs: 1999-02-04 14:57:00 WIB")
print("  - birth_time = datetime(1999, 2, 4, 14, 57, 0) WIB")
print("  - lichun_moment = datetime(1999, 2, 4, 7, 57, 0) UTC")
print("  - Comparison: WIB vs UTC → WRONG! Timezone mismatch!")
print()
print("Scenario B: If birth_time is converted to UTC first")
print("  - User inputs: 1999-02-04 14:57:00 WIB")
print("  - birth_time = datetime(1999, 2, 4, 7, 57, 0) UTC")
print("  - lichun_moment = datetime(1999, 2, 4, 7, 57, 0) UTC")
print("  - Comparison: UTC vs UTC → CORRECT!")
print()

print("⚠️  POTENTIAL ROOT CAUSE: Timezone mismatch in comparison!")
print()

# ============================================================================
# STEP 6: Trace the actual API call flow
# ============================================================================
print("="*120)
print("STEP 6: API Flow Analysis")
print("="*120)

print("Frontend sends:")
print("  year=1999, month=2, day=4, hour=14, minute=57, second=0")
print()
print("Backend receives and creates:")
print("  Option 1: datetime(1999, 2, 4, 14, 57, 0) in WIB")
print("  Option 2: datetime(1999, 2, 4, 7, 57, 0) in UTC (after -7 hours)")
print()
print("Need to check the actual /calculate endpoint code!")

print("\n" + "="*120)
print("CONCLUSION:")
print("="*120)
print("The issue is likely:")
print("1. Frontend sends time in WIB")
print("2. Backend might NOT convert to UTC before comparison")
print("3. Comparing WIB time with UTC Lichun → Wrong result!")
print()
print("NEXT STEP: Check the /calculate endpoint to see how birth_time is constructed")
print("="*120)
