Jadi setiap 10 God HARUS selalu punya stem character, tidak boleh kosong/dash!#!/usr/bin/env python3
"""
SIMPLE FINAL TEST - Verify timezone conversion fix works
"""

import sys
sys.path.insert(0, 'bazica_web.tommitoan.com/bazica-web.tommitoan.com/bazica-duplicate')

from app import calculate_pillars
from datetime import datetime
from dateutil import tz

print("="*120)
print("TIMEZONE CONVERSION FIX - VERIFICATION")
print("="*120)

test_cases = [
    ("1999-02-04 14:56", "Asia/Bangkok", "Tiger (BEFORE Lichun)"),
    ("1999-02-04 14:57", "Asia/Bangkok", "Rabbit (AT Lichun)"),
    ("1999-02-04 14:58", "Asia/Bangkok", "Rabbit (AFTER Lichun)"),
]

all_pass = True

for dt_str, tz_str, expected_desc in test_cases:
    print(f"\n{'='*120}")
    print(f"TEST: {dt_str} {tz_str}")
    print(f"Expected: {expected_desc}")
    print(f"{'='*120}")
    
    # Parse and apply timezone (simulating frontend flow)
    birth_time = datetime.strptime(dt_str, '%Y-%m-%d %H:%M')
    target_tz = tz.gettz(tz_str)
    if target_tz:
        birth_time = birth_time.replace(tzinfo=target_tz)
    
    # Call calculate_pillars
    try:
        result = calculate_pillars(birth_time)
        
        # Extract year animal from the returned pillars
        # Result structure: {'year': {...}, 'month': {...}, 'day': {...}, 'hour': {...}}
        year_animal = result['year']['earthly_branch']['animal']
        
        expected_animal = expected_desc.split()[0]
        
        if year_animal == expected_animal:
            print(f"✅ PASS: Got {year_animal}")
        else:
            print(f"❌ FAIL: Expected {expected_animal}, got {year_animal}")
            all_pass = False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        all_pass = False

print(f"\n{'='*120}")
print(f"FINAL RESULT: {'✅ ALL TESTS PASSED' if all_pass else '❌ SOME TESTS FAILED'}")
print(f"{'='*120}")
