#!/usr/bin/env python3
"""
Test specific year 2055 to verify Lichun accuracy
"""

import json
from datetime import datetime, timedelta

# Load the generated data
with open('complete_jieqi_data_1909_2183.json', 'r') as f:
    jieqi_data = json.load(f)

print("="*80)
print("YEAR 2055 DETAILED VERIFICATION")
print("="*80)

year = 2055
if str(year) not in jieqi_data:
    print(f"❌ Data not found for year {year}")
else:
    year_data = jieqi_data[str(year)]
    
    print(f"\n📅 Year: {year}")
    print("-" * 80)
    
    # Expected Lichun from Excel
    expected_lichun_wib = "2055-02-04 04:56"
    
    # Get generated Lichun
    generated_lichun_utc = datetime.strptime(year_data['lichun'], '%Y-%m-%d %H:%M:%S')
    generated_lichun_wib = generated_lichun_utc + timedelta(hours=7)
    generated_lichun_str = generated_lichun_wib.strftime('%Y-%m-%d %H:%M')
    
    print(f"\n🎯 LICHUN (Critical - Must Match 100%):")
    print(f"   Excel WIB : {expected_lichun_wib}")
    print(f"   Generated : {generated_lichun_str}")
    
    if generated_lichun_str == expected_lichun_wib:
        print(f"   ✅ MATCH 100%!")
    else:
        print(f"   ❌ MISMATCH!")
        diff_minutes = (generated_lichun_wib - datetime.strptime(expected_lichun_wib, '%Y-%m-%d %H:%M')).total_seconds() / 60
        print(f"   Difference: {abs(diff_minutes):.1f} minutes")
    
    print(f"\n📊 All 24 Solar Terms for {year}:")
    solar_terms_order = [
        "lichun", "yushui", "jingzhe", "chunfen", "qingming", "guyu",
        "lixia", "xiaoman", "mangzhong", "xiazhi", "xiaoshu", "dashu",
        "liqiu", "chushu", "bailu", "qiufen", "hanlu", "shuangjiang",
        "lidong", "xiaoxue", "daxue", "dongzhi", "xiaohan", "dahan"
    ]
    
    for i, term in enumerate(solar_terms_order):
        if term in year_data:
            term_time = datetime.strptime(year_data[term], '%Y-%m-%d %H:%M:%S')
            term_wib = term_time + timedelta(hours=7)
            
            # Mark Lichun specially
            marker = "🎯" if term == "lichun" else "  "
            print(f"{marker} {i+1:2d}. {term:15s}: {term_wib.strftime('%Y-%m-%d %H:%M')} WIB")
        else:
            print(f"   {i+1:2d}. {term:15s}: NOT FOUND")

print("\n" + "="*80)
print("VERIFICATION COMPLETE")
print("="*80)
