#!/usr/bin/env python3
"""
Test exact minute for April 5, 2014
Find the exact minute when it transitions from Mao to Chen
"""

import requests
import json

print("=" * 80)
print("FIND EXACT TRANSITION TIME - APRIL 5, 2014")
print("=" * 80)
print()

# Qingming 2014: 05 Apr 04:46:51 WIB
# Test each minute from 04:45 to 04:48 WIB

for minute in range(45, 49):
    test_data = {
        "dateTime": f"2014-04-05T04:{minute:02d}:00",
        "location": "Asia/Jakarta",
        "gender": 1
    }
    
    response = requests.post('http://localhost:5000/calculate', json=test_data)
    result = response.json()
    
    pillars = result.get('four_pillars', {})
    month_branch = pillars.get('month_pillar', {}).get('earthly_branch', {}).get('character', '')
    month_name = pillars.get('month_pillar', {}).get('earthly_branch', {}).get('name', '')
    
    print(f"04:{minute:02d} WIB → Month: {month_branch} ({month_name})")

print()
print("Qingming 2014: 04:46:51 WIB")
print()
print("Expected:")
print("  04:45, 04:46 → Mao (卯) - BEFORE Qingming")
print("  04:47, 04:48 → Chen (辰) - AFTER Qingming")
