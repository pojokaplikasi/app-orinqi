#!/usr/bin/env python3
"""
Comprehensive Month Transition Test
Test all 12 month transitions for various years
"""

import json
from datetime import datetime
from dateutil import tz

# Load Jieqi data
with open('jieqi_ultra_precise_1909_2183_cst.json', 'r') as f:
    jieqi_data = json.load(f)

print("=" * 80)
print("COMPREHENSIVE MONTH TRANSITION VERIFICATION")
print("=" * 80)
print()

# Month transition mapping
month_transitions = {
    1: ('lichun', '立春', 'Tiger 寅'),
    2: ('jingzhe', '惊蛰', 'Rabbit 卯'),
    3: ('qingming', '清明', 'Dragon 辰'),
    4: ('lixia', '立夏', 'Snake 巳'),
    5: ('mangzhong', '芒种', 'Horse 午'),
    6: ('xiaoshu', '小暑', 'Goat 未'),
    7: ('liqiu', '立秋', 'Monkey 申'),
    8: ('bailu', '白露', 'Rooster 酉'),
    9: ('hanlu', '寒露', 'Dog 戌'),
    10: ('lidong', '立冬', 'Pig 亥'),
    11: ('daxue', '大雪', 'Rat 子'),
    12: ('xiaohan', '小寒', 'Ox 丑'),
}

# Test years
test_years = [2014, 2024, 2027]

for year in test_years:
    print(f"\n{'='*80}")
    print(f"YEAR {year} - ALL MONTH TRANSITIONS")
    print(f"{'='*80}")
    
    for month_num in range(1, 13):
        jieqi_key, jieqi_char, branch_name = month_transitions[month_num]
        
        # Get Jieqi time from data
        jieqi_str = jieqi_data[str(year)][jieqi_key]
        jieqi_cst = datetime.strptime(jieqi_str, '%Y-%m-%d %H:%M:%S')
        
        # Convert to WIB
        from datetime import timedelta
        jieqi_wib = jieqi_cst - timedelta(hours=1)
        
        # Determine which month this Jieqi starts
        if month_num == 12:
            # Xiaohan starts month 12 (Ox) but belongs to next year
            prev_year = year - 1
            print(f"  Month 12 (Ox 丑): Starts at Xiaohan {prev_year}/{year}")
        else:
            print(f"  Month {month_num:2d} ({branch_name:15s}): Starts at {jieqi_char} = {jieqi_wib.strftime('%Y-%m-%d %H:%M:%S')} WIB")

print("\n" + "="*80)
print("SPECIFIC TEST CASES")
print("="*80)

# Test specific cases
test_cases = [
    ("2014-04-05 04:46", "April 5, 2014 04:46 WIB - User says should be Chen"),
    ("2014-04-05 04:47", "April 5, 2014 04:47 WIB - 1 minute later"),
    ("2024-02-04 16:26", "Feb 4, 2024 16:26 WIB - 1 min before Lichun"),
    ("2024-02-04 16:27", "Feb 4, 2024 16:27 WIB - Lichun moment"),
    ("2024-03-05 10:22", "Mar 5, 2024 10:22 WIB - 1 min before Jingzhe"),
    ("2024-03-05 10:23", "Mar 5, 2024 10:23 WIB - 1 min after Jingzhe"),
]

import requests

for datetime_str, description in test_cases:
    print(f"\n{description}")
    print(f"Input: {datetime_str}")
    
    test_data = {
        "dateTime": f"{datetime_str.replace(' ', 'T')}",
        "location": "Asia/Jakarta",
        "gender": 1
    }
    
    response = requests.post('http://localhost:5000/calculate', json=test_data)
    result = response.json()
    
    pillars = result.get('four_pillars', {})
    year_char = pillars.get('year_pillar', {}).get('heavenly_stem', {}).get('character', '') + \
                pillars.get('year_pillar', {}).get('earthly_branch', {}).get('character', '')
    month_char = pillars.get('month_pillar', {}).get('heavenly_stem', {}).get('character', '') + \
                 pillars.get('month_pillar', {}).get('earthly_branch', {}).get('character', '')
    month_branch = pillars.get('month_pillar', {}).get('earthly_branch', {}).get('character', '')
    month_name = pillars.get('month_pillar', {}).get('earthly_branch', {}).get('name', '')
    
    print(f"Result: Year={year_char}, Month={month_char} ({month_name})")
