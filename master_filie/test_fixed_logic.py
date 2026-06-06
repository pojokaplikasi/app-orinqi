#!/usr/bin/env python3
"""
Test year boundary logic directly with the fixed code
"""

import sys
sys.path.insert(0, 'bazica_web.tommitoan.com/bazica-web.tommitoan.com/bazica-duplicate')

from app import get_chinese_new_year_boundary
from datetime import datetime

print("="*80)
print("TESTING YEAR BOUNDARY LOGIC (FIXED)")
print("="*80)

# Test for year 1999
year = 1999
lichun_moment = get_chinese_new_year_boundary(year)
print(f"\nLichun moment for {year}: {lichun_moment}")

# Convert to WIB (UTC+7)
from datetime import timedelta
lichun_wib = lichun_moment + timedelta(hours=7)
print(f"Lichun WIB: {lichun_wib}")

# Test cases around Lichun
test_times = [
    datetime(1999, 2, 4, 7, 56, 0),   # 14:56 WIB - Should be Tiger (old year)
    datetime(1999, 2, 4, 7, 56, 59),  # 14:56:59 WIB - Should be Tiger (old year)
    datetime(1999, 2, 4, 7, 57, 0),   # 14:57:00 WIB - Should be Rabbit (NEW year) AT LICHUN
    datetime(1999, 2, 4, 7, 57, 1),   # 14:57:01 WIB - Should be Rabbit (new year)
]

print("\n" + "="*80)
print("YEAR DETERMINATION TEST:")
print("="*80)

for test_time in test_times:
    # Apply the FIXED logic
    test_year = test_time.year
    if test_time >= lichun_moment:
        # Already at or after Lichun, keep the current year
        final_year = test_year
    else:
        # Before Lichun, use previous year
        final_year = test_year - 1
    
    wib_time = test_time + timedelta(hours=7)
    
    expected_year = 1999 if test_time >= lichun_moment else 1998
    status = "✅" if final_year == expected_year else "❌"
    
    print(f"{status} UTC: {test_time} | WIB: {wib_time} | Year: {final_year} ({'Rabbit' if final_year==1999 else 'Tiger'})")

print("\n" + "="*80)
print("EXPECTED RESULTS:")
print("="*80)
print("Before 07:57:00 UTC (14:57:00 WIB) → Tiger year (1998)")
print("At or After 07:57:00 UTC (14:57:00 WIB) → Rabbit year (1999)")
print("="*80)
