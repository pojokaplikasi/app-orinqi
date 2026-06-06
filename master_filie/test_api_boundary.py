#!/usr/bin/env python3
"""
Test API directly for year boundary at 1999-02-04 14:56 and 14:57 WIB
"""

import requests

print("="*80)
print("TESTING API FOR YEAR BOUNDARY 1999")
print("="*80)

# Test 1 minute before Lichun (14:56 WIB = 07:56 UTC)
test_cases = [
    ("1999-02-04 14:55:59", "Should be Tiger year (before Lichun)"),
    ("1999-02-04 14:56:00", "Should be Tiger year (before Lichun)"),
    ("1999-02-04 14:56:59", "Should be Tiger year (before Lichun)"),
    ("1999-02-04 14:57:00", "Should be Rabbit year (AT Lichun)"),
    ("1999-02-04 14:57:01", "Should be Rabbit year (after Lichun)"),
]

for test_time_utc_offset in test_cases:
    # Convert WIB to UTC (WIB = UTC+7)
    from datetime import datetime, timedelta
    
    wib_str = test_time_utc_offset[0]
    expected = test_time_utc_offset[1]
    
    wib_dt = datetime.strptime(wib_str, '%Y-%m-%d %H:%M:%S')
    utc_dt = wib_dt - timedelta(hours=7)
    utc_str = utc_dt.strftime('%Y-%m-%d %H:%M:%S')
    
    # Call API
    url = f"http://localhost:5000/api/calculate?year={wib_dt.year}&month={wib_dt.month}&day={wib_dt.day}&hour={wib_dt.hour}&minute={wib_dt.minute}&second=0"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            result = response.json()
            year_pillar = result.get('four_pillars', {}).get('year', {})
            earthly_branch = year_pillar.get('earthly_branch', {})
            animal = earthly_branch.get('animal', 'Unknown')
            
            print(f"\n{wib_str} WIB ({utc_str} UTC):")
            print(f"  Expected: {expected}")
            print(f"  Result:   Year = {animal}")
        else:
            print(f"\n{wib_str}: API Error {response.status_code}")
    except Exception as e:
        print(f"\n{wib_str}: Connection Error - {e}")

print("\n" + "="*80)
