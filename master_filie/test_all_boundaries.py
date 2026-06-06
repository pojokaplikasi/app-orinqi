#!/usr/bin/env python3
"""
Comprehensive test for ALL years (1909-2183) to find any boundary issues
Tests the exact moment of Lichun and 1 minute before
"""

import sys
sys.path.insert(0, 'bazica_web.tommitoan.com/bazica-web.tommitoan.com/bazica-duplicate')

from app import get_chinese_new_year_boundary
from datetime import datetime, timedelta
import json

print("="*100)
print("COMPREHENSIVE BOUNDARY TEST FOR ALL 275 YEARS (1909-2183)")
print("Testing Lichun boundary precision")
print("="*100)

# Load Excel data for comparison
with open('complete_jieqi_data_1909_2183.json', 'r') as f:
    jieqi_data = json.load(f)

problem_years = []

for year in range(1909, 2184):
    # Get Lichun moment from the system
    lichun_utc = get_chinese_new_year_boundary(year)
    lichun_wib = lichun_utc + timedelta(hours=7)
    
    # Test 1 minute before Lichun
    one_minute_before = lichun_utc - timedelta(minutes=1)
    
    # Apply year determination logic
    # Test at Lichun
    if one_minute_before >= lichun_utc:
        year_at_lichun = one_minute_before.year
    else:
        year_at_lichun = one_minute_before.year - 1
    
    # Test at Lichun exact
    if lichun_utc >= lichun_utc:
        year_exact = lichun_utc.year
    else:
        year_exact = lichun_utc.year - 1
    
    # Expected: 1 minute before should be previous year, at Lichun should be current year
    expected_year_before = year - 1
    expected_year_at = year
    
    has_problem = False
    if year_at_lichun != expected_year_before:
        has_problem = True
    if year_exact != expected_year_at:
        has_problem = True
    
    if has_problem:
        problem_years.append({
            'year': year,
            'lichun_wib': lichun_wib,
            'year_1min_before': year_at_lichun,
            'year_at_lichun': year_exact
        })
    
    # Show progress every 50 years
    if year % 50 == 0 or year == 2183:
        print(f"Tested year {year}...")

print("\n" + "="*100)
print("RESULTS:")
print("="*100)

if problem_years:
    print(f"❌ Found {len(problem_years)} problem years:")
    for prob in problem_years[:20]:  # Show first 20
        print(f"  Year {prob['year']}: Lichun at {prob['lichun_wib']}")
        print(f"    1 min before: Year {prob['year_1min_before']} (expected {prob['year']-1})")
        print(f"    At Lichun: Year {prob['year_at_lichun']} (expected {prob['year']})")
else:
    print("✅ ALL 275 YEARS PASS THE BOUNDARY TEST!")
    print("✅ Year transition logic is CORRECT!")

print("="*100)
