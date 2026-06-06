"""
Test Hour Pillar Calculation - Verifying correct 2-hour periods
"""
from datetime import datetime
from app import calculate_pillars

print("=" * 70)
print("HOUR PILLAR CALCULATION TEST")
print("=" * 70)

test_cases = [
    # (datetime, expected_branch, expected_branch_name)
    (datetime(1987, 10, 20, 23, 30), 0, "Zi (Rat) 23:00-00:59"),
    (datetime(1987, 10, 20, 0, 30), 0, "Zi (Rat) 23:00-00:59"),
    (datetime(1987, 10, 20, 1, 30), 1, "Chou (Ox) 01:00-02:59"),
    (datetime(1987, 10, 20, 2, 30), 1, "Chou (Ox) 01:00-02:59"),
    (datetime(1987, 10, 20, 3, 30), 2, "Yin (Tiger) 03:00-04:59"),
    (datetime(1987, 10, 20, 4, 30), 2, "Yin (Tiger) 03:00-04:59"),
    (datetime(1987, 10, 20, 5, 30), 3, "Mao (Rabbit) 05:00-06:59"),
    (datetime(1987, 10, 20, 6, 30), 3, "Mao (Rabbit) 05:00-06:59"),
    (datetime(1987, 10, 20, 7, 30), 4, "Chen (Dragon) 07:00-08:59"),
    (datetime(1987, 10, 20, 8, 30), 4, "Chen (Dragon) 07:00-08:59"),
    (datetime(1987, 10, 20, 9, 30), 5, "Si (Snake) 09:00-10:59"),
    (datetime(1987, 10, 20, 10, 30), 5, "Si (Snake) 09:00-10:59"),
    (datetime(1987, 10, 20, 11, 30), 6, "Wu (Horse) 11:00-12:59"),
    (datetime(1987, 10, 20, 12, 30), 6, "Wu (Horse) 11:00-12:59"),
    (datetime(1987, 10, 20, 13, 30), 7, "Wei (Goat) 13:00-14:59"),
    (datetime(1987, 10, 20, 14, 30), 7, "Wei (Goat) 13:00-14:59"),
    (datetime(1987, 10, 20, 15, 30), 8, "Shen (Monkey) 15:00-16:59"),
    (datetime(1987, 10, 20, 16, 30), 8, "Shen (Monkey) 15:00-16:59"),
    (datetime(1987, 10, 20, 17, 30), 9, "You (Rooster) 17:00-18:59"),
    (datetime(1987, 10, 20, 18, 30), 9, "You (Rooster) 17:00-18:59"),
    (datetime(1987, 10, 20, 19, 30), 10, "Xu (Dog) 19:00-20:59"),
    (datetime(1987, 10, 20, 20, 30), 10, "Xu (Dog) 19:00-20:59"),
    (datetime(1987, 10, 20, 21, 30), 11, "Hai (Pig) 21:00-22:59"),
    (datetime(1987, 10, 20, 22, 30), 11, "Hai (Pig) 21:00-22:59"),
]

from tzlocal import get_localzone
import pytz

all_passed = True

for test_time, expected_branch, expected_name in test_cases:
    # Convert to WIB (UTC+7) for input
    wib = pytz.timezone('Asia/Jakarta')
    test_time_wib = wib.localize(test_time)
    
    result = calculate_pillars(test_time_wib)
    actual_branch = result['hour_pillar']['earthly_branch']['name'].upper()
    
    # Get branch index
    branches = ['RAT', 'OX', 'TIGER', 'RABBIT', 'DRAGON', 'SNAKE', 
                'HORSE', 'GOAT', 'MONKEY', 'ROOSTER', 'DOG', 'PIG']
    actual_branch_idx = branches.index(actual_branch)
    
    passed = actual_branch_idx == expected_branch
    status = "✅ PASS" if passed else "❌ FAIL"
    
    if not passed:
        all_passed = False
    
    print(f"\n{status} {test_time.strftime('%H:%M')} → {actual_branch} (idx {actual_branch_idx})")
    print(f"   Expected: {expected_name} (idx {expected_branch})")

print("\n" + "=" * 70)
if all_passed:
    print("✅ ALL TESTS PASSED!")
else:
    print("❌ SOME TESTS FAILED!")
print("=" * 70)
