#!/usr/bin/env python3
"""
Quick test untuk verifikasi fix CST timezone
Test dengan contoh: 4 Februari 2027, 9:46 pagi WIB
"""

import requests
import json

# Test case dari user: 4 Feb 2027, 9:46 pagi WIB
# WIB = UTC+7

test_data = {
    "dateTime": "2027-02-04T09:46:00",
    "location": "Asia/Jakarta",  # WIB timezone
    "gender": 1
}

print("=" * 80)
print("TEST: 4 Februari 2027, 9:46 WIB")
print("=" * 80)
print()
print(f"Request: {json.dumps(test_data, indent=2)}")
print()

try:
    response = requests.post('http://localhost:5000/calculate', json=test_data)
    result = response.json()
    
    print("RESPONSE:")
    print(f"Status Code: {response.status_code}")
    print()
    
    if 'error' in result:
        print(f"ERROR: {result['error']}")
    else:
        print(f"Full response keys: {result.keys()}")
        print(f"Full response: {json.dumps(result, indent=2, ensure_ascii=False)}")
        print()
        
        pillars = result.get('four_pillars', {})
        if not pillars:
            print("No four_pillars in response!")
        else:
            print("Four Pillars:")
            print(f"  Year:   {pillars.get('year_pillar', {}).get('heavenly_stem', {}).get('character', '')}{pillars.get('year_pillar', {}).get('earthly_branch', {}).get('character', '')}")
            print(f"  Month:  {pillars.get('month_pillar', {}).get('heavenly_stem', {}).get('character', '')}{pillars.get('month_pillar', {}).get('earthly_branch', {}).get('character', '')}")
            print(f"  Day:    {pillars.get('day_pillar', {}).get('heavenly_stem', {}).get('character', '')}{pillars.get('day_pillar', {}).get('earthly_branch', {}).get('character', '')}")
            print(f"  Hour:   {pillars.get('hour_pillar', {}).get('heavenly_stem', {}).get('character', '')}{pillars.get('hour_pillar', {}).get('earthly_branch', {}).get('character', '')}")
            print()
            
            # Cek apakah Year Pillar benar
            year_stem = pillars.get('year_pillar', {}).get('heavenly_stem', {}).get('character', '')
            year_branch = pillars.get('year_pillar', {}).get('earthly_branch', {}).get('character', '')
            year_char = year_stem + year_branch
            
            if year_char == '丁未':
                print("✅ YEAR PILLAR CORRECT: 丁未 (Ding Wei - Fire Goat)")
                print("   Transisi tahun sudah BENAR!")
            else:
                print(f"❌ YEAR PILLAR WRONG!")
                print(f"   Expected: 丁未 (Ding Wei)")
                print(f"   Got:      {year_char} ({year_stem}{year_branch})")
                print("   Transisi tahun masih SALAH!")
            
except Exception as e:
    print(f"Error: {e}")
