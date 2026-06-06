#!/usr/bin/env python3
"""
Test Day Transition at 23:00 (Zi Hour)
Verifikasi apakah hari Bazi berganti pada jam 23:00
"""

import requests
import json

print("=" * 80)
print("TEST TRANSISI HARI BAZI - HARUSNYA JAM 23:00 (ZI HOUR)")
print("=" * 80)
print()

# Test case: Same date, different times around 23:00
# In Bazi, 23:00 starts the NEXT day

test_cases = [
    ("2024-06-15T22:59:00", "June 15, 2024 22:59 - Should still be June 15 day pillar"),
    ("2024-06-15T23:00:00", "June 15, 2024 23:00 - Should be June 16 day pillar (Zi hour)"),
    ("2024-06-15T23:30:00", "June 15, 2024 23:30 - Should be June 16 day pillar"),
    ("2024-06-16T00:00:00", "June 16, 2024 00:00 - Should be June 16 day pillar"),
]

for datetime_str, description in test_cases:
    print(f"\n{description}")
    print(f"Input: {datetime_str}")
    
    test_data = {
        "dateTime": datetime_str,
        "location": "Asia/Shanghai",  # CST
        "gender": 1
    }
    
    response = requests.post('http://localhost:5000/calculate', json=test_data)
    result = response.json()
    
    pillars = result.get('four_pillars', {})
    day_char = pillars.get('day_pillar', {}).get('heavenly_stem', {}).get('character', '') + \
               pillars.get('day_pillar', {}).get('earthly_branch', {}).get('character', '')
    hour_char = pillars.get('hour_pillar', {}).get('heavenly_stem', {}).get('character', '') + \
                pillars.get('hour_pillar', {}).get('earthly_branch', {}).get('character', '')
    hour_branch = pillars.get('hour_pillar', {}).get('earthly_branch', {}).get('character', '')
    hour_name = pillars.get('hour_pillar', {}).get('earthly_branch', {}).get('name', '')
    
    print(f"  Day Pillar:  {day_char}")
    print(f"  Hour Pillar: {hour_char} ({hour_name})")

print("\n" + "="*80)
print("EXPECTED BEHAVIOR:")
print("="*80)
print("In Bazi calendar:")
print("  - Day changes at 23:00 (Zi hour 子时), NOT at midnight 00:00")
print("  - 22:59 on June 15 = June 15 day pillar")
print("  - 23:00 on June 15 = June 16 day pillar (early Zi hour)")
print("  - 00:00 on June 16 = June 16 day pillar")
print()
print("If 22:59 and 23:00 show DIFFERENT day pillars → CORRECT ✅")
print("If 22:59 and 23:00 show SAME day pillar → WRONG ❌")
