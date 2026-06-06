#!/usr/bin/env python3
"""
FINAL VERIFICATION: Test the complete flow with timezone conversion
Simulating what happens when frontend sends WIB time and backend converts to UTC
"""

import sys
sys.path.insert(0, 'bazica_web.tommitoan.com/bazica-web.tommitoan.com/bazica-duplicate')

from app import calculate_pillars
from datetime import datetime, timedelta
from dateutil import tz

print("="*120)
print("FINAL VERIFICATION - COMPLETE FLOW TEST")
print("="*120)

# Simulate what frontend sends: 1999-02-04 14:57:00 WIB
frontend_datetime_str = "1999-02-04 14:57"
timezone_str = "Asia/Bangkok"  # WIB (UTC+7)

print(f"\n📥 FRONTEND INPUT:")
print(f"   DateTime: {frontend_datetime_str}")
print(f"   Timezone: {timezone_str} (WIB/UTC+7)")
print()

# Parse datetime (same as line 1021 in app.py)
birth_time = datetime.strptime(frontend_datetime_str, '%Y-%m-%d %H:%M')
print(f"Parsed (naive): {birth_time}")

# Apply timezone (same as lines 1027-1032 in app.py)
if timezone_str and timezone_str != 'GMT':
    target_tz = tz.gettz(timezone_str)
    if target_tz:
        birth_time = birth_time.replace(tzinfo=target_tz)
        print(f"With timezone:  {birth_time}")

print()
print("="*120)
print("🔄 BACKEND PROCESSING (calculate_pillars)")
print("="*120)

# Now call calculate_pillars which will convert to UTC
print("\nCalling calculate_pillars...")
result = calculate_pillars(birth_time)

print()
print("="*120)
print("📊 RESULTS:")
print("="*120)

year_pillar = result['year']
year_stem = year_pillar['heavenly_stem']['name']
year_branch = year_pillar['earthly_branch']['animal']

print(f"Year Pillar: {year_stem} {year_branch}")
print(f"Year Animal: {year_branch}")

expected_animal = "Rabbit"
if year_branch == expected_animal:
    print(f"\n✅ CORRECT! At Lichun 14:57:00 WIB should be Rabbit year")
else:
    print(f"\n❌ WRONG! Expected Rabbit but got {year_branch}")

print()
print("="*120)
print("TEST SUMMARY:")
print("="*120)
print("Input:  1999-02-04 14:57:00 WIB (EXACT Lichun time)")
print("Output: Year = " + year_branch)
print(f"Status: {'✅ PASS' if year_branch == 'Rabbit' else '❌ FAIL'}")
print("="*120)
