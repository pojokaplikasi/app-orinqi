#!/usr/bin/env python3
"""
Test script to verify Jieqi calculation accuracy
Compares calculated solar terms with expected values
"""

import json
from datetime import datetime

# Load the generated data
with open('complete_jieqi_data_1909_2183.json', 'r') as f:
    jieqi_data = json.load(f)

print("="*80)
print("JIEQI ACCURACY TEST")
print("="*80)

# Test sample years
test_years = [1909, 1950, 1987, 2024, 2025, 2050]

for year in test_years:
    print(f"\n📅 Year {year}:")
    print("-" * 80)
    
    if str(year) not in jieqi_data:
        print(f"  ❌ Data not found for year {year}")
        continue
    
    year_data = jieqi_data[str(year)]
    
    # Show all 24 solar terms
    solar_terms_order = [
        "lichun", "yushui", "jingzhe", "chunfen", "qingming", "guyu",
        "lixia", "xiaoman", "mangzhong", "xiazhi", "xiaoshu", "dashu",
        "liqiu", "chushu", "bailu", "qiufen", "hanlu", "shuangjiang",
        "lidong", "xiaoxue", "daxue", "dongzhi", "xiaohan", "dahan"
    ]
    
    for i, term in enumerate(solar_terms_order):
        if term in year_data:
            term_time = datetime.strptime(year_data[term], '%Y-%m-%d %H:%M:%S')
            # Convert back to WIB for display (add 7 hours)
            from datetime import timedelta
            term_wib = term_time + timedelta(hours=7)
            print(f"  {i+1:2d}. {term:15s}: {term_wib.strftime('%Y-%m-%d %H:%M')} WIB")
        else:
            print(f"  {i+1:2d}. {term:15s}: NOT FOUND")

# Verify Lichun matches original Excel data
print("\n" + "="*80)
print("LICHUN VERIFICATION (Comparing with Excel data)")
print("="*80)

excel_lichun_data = {
    1909: "1909-02-04 18:33",
    1950: "1950-02-04 17:21",
    1987: "1987-02-04 16:52",
    2024: "2024-02-04 16:27",
    2025: "2025-02-03 22:10",
}

for year, excel_time_str in excel_lichun_data.items():
    generated_data = jieqi_data[str(year)]
    generated_lichun_utc = datetime.strptime(generated_data['lichun'], '%Y-%m-%d %H:%M:%S')
    
    # Convert generated UTC to WIB using timedelta
    from datetime import timedelta
    generated_lichun_wib = generated_lichun_utc + timedelta(hours=7)
    generated_str = generated_lichun_wib.strftime('%Y-%m-%d %H:%M')
    
    excel_dt = datetime.strptime(excel_time_str, '%Y-%m-%d %H:%M')
    
    match = "✅" if generated_str == excel_time_str else "❌"
    print(f"{match} {year}: Excel={excel_time_str} | Generated={generated_str}")

print("\n" + "="*80)
print("TEST COMPLETE")
print("="*80)
print(f"Total years in database: {len(jieqi_data)}")
print(f"Years tested: {len(test_years)}")
print("All 24 solar terms are calculated using astronomical intervals")
print("with corrections for Earth's elliptical orbit.")
print("="*80)
