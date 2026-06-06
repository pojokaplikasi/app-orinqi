#!/usr/bin/env python3
"""
Test script to verify Bazi calculations against known reference data
"""
import requests
import json

def test_bazi_calculation():
    """Test with a known birth date and expected results"""
    
    # Test data - October 20, 1987, 08:08 (Ho Chi Minh timezone)
    test_data = {
        "dateTime": "1987-10-20T08:08",
        "location": "Asia/Ho_Chi_Minh", 
        "gender": 1
    }
    
    print("Testing Bazi Calculator with:")
    print(f"Date: {test_data['dateTime']}")
    print(f"Timezone: {test_data['location']}")
    print(f"Gender: {'Male' if test_data['gender'] == 1 else 'Female'}")
    print("-" * 50)
    
    try:
        # Send request to our duplicate server
        response = requests.post('http://localhost:5001/calculate', 
                               json=test_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            
            print("CALCULATION RESULTS:")
            print("=" * 50)
            
            # Display Four Pillars
            pillars = result['four_pillars']
            pillar_names = ['year_pillar', 'month_pillar', 'day_pillar', 'hour_pillar']
            
            for pillar_name in pillar_names:
                pillar = pillars[pillar_name]
                stem = pillar['heavenly_stem']
                branch = pillar['earthly_branch']
                ganzhi = pillar['gan_zhi']
                lifecycle = pillar['life_cycle']
                
                print(f"{pillar_name.replace('_', ' ').title()}:")
                print(f"  Heavenly Stem: {stem['name']} ({stem['character']})")
                print(f"  Earthly Branch: {branch['name']} ({branch['character']})")
                print(f"  GanZhi: {ganzhi['name']}")
                print(f"  Life Cycle: {lifecycle}")
                print()
            
            # Display first few Luck Pillars
            luck_pillars = result['luck_pillars']['luck_pillars']
            print("FIRST 3 LUCK PILLARS:")
            print("=" * 50)
            
            for i in range(min(3, len(luck_pillars))):
                lp = luck_pillars[i]
                print(f"Luck Pillar {lp['number']}:")
                print(f"  Period: {lp['year_start']}-{lp['year_end']}")
                print(f"  Heavenly Stem: {lp['heavenly_stem']['name']} ({lp['heavenly_stem']['character']})")
                print(f"  Earthly Branch: {lp['earthly_branch']['name']} ({lp['earthly_branch']['character']})")
                print()
            
            print("✅ Calculation completed successfully!")
            return True
            
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

if __name__ == "__main__":
    print("🪬 Bazi Calculator Verification Test 🪬")
    print("=" * 60)
    success = test_bazi_calculation()
    
    if success:
        print("\n✅ Test completed! Compare these results with the original website.")
        print("If results match exactly, the duplicate is working correctly.")
    else:
        print("\n❌ Test failed! Please check the server and try again.")