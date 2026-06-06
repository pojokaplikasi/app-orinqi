#!/usr/bin/env python3
"""
Specific verification for year 1999
Ultra-detailed check
"""

import json
from datetime import datetime, timedelta

# Load the generated data
with open('complete_jieqi_data_1909_2183.json', 'r') as f:
    jieqi_data = json.load(f)

print("="*80)
print("DETAILED VERIFICATION FOR YEAR 1999")
print("="*80)

# Excel data for 1999 (WIB timezone)
excel_lichun_1999 = datetime(1999, 2, 4, 14, 57, 0)
print(f"\nExcel Lichun 1999 (WIB): {excel_lichun_1999.strftime('%Y-%m-%d %H:%M:%S')}")

# Get generated data
if str(1999) not in jieqi_data:
    print("❌ Data NOT FOUND for year 1999!")
else:
    year_data = jieqi_data[str(1999)]
    
    # Get Lichun in UTC
    generated_lichun_utc = datetime.strptime(year_data['lichun'], '%Y-%m-%d %H:%M:%S')
    print(f"Generated Lichun (UTC): {generated_lichun_utc.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Convert to WIB (UTC+7)
    generated_lichun_wib = generated_lichun_utc + timedelta(hours=7)
    print(f"Generated Lichun (WIB): {generated_lichun_wib.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Calculate difference
    diff_seconds = (generated_lichun_wib - excel_lichun_1999).total_seconds()
    diff_minutes = diff_seconds / 60
    
    print("\n" + "="*80)
    print("COMPARISON:")
    print("="*80)
    print(f"Excel:     {excel_lichun_1999.strftime('%Y-%m-%d %H:%M:%S')} WIB")
    print(f"Generated: {generated_lichun_wib.strftime('%Y-%m-%d %H:%M:%S')} WIB")
    
    if diff_seconds == 0:
        print(f"\n✅ EXACT MATCH! (Difference: 0.000 seconds)")
    else:
        print(f"\n❌ MISMATCH!")
        print(f"Difference: {diff_seconds:.2f} seconds = {diff_minutes:.4f} minutes")
        
        # Show detailed breakdown
        print("\nDetailed Analysis:")
        print(f"  Date match: {'✅' if excel_lichun_1999.date() == generated_lichun_wib.date() else '❌'}")
        print(f"  Hour match: {'✅' if excel_lichun_1999.hour == generated_lichun_wib.hour else '❌'}")
        print(f"  Minute match: {'✅' if excel_lichun_1999.minute == generated_lichun_wib.minute else '❌'}")
        print(f"  Second match: {'✅' if excel_lichun_1999.second == generated_lichun_wib.second else '❌'}")

print("\n" + "="*80)
