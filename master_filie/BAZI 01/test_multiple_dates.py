import requests
import json

# Test multiple different dates to verify rotation
test_dates = [
    {"date": "1987-10-20", "time": "08:08", "description": "Reference date"},
    {"date": "1987-10-21", "time": "08:08", "description": "Next day"},
    {"date": "1987-10-22", "time": "08:08", "description": "Day after"},
    {"date": "1990-01-01", "time": "12:00", "description": "Different year"},
    {"date": "2000-06-15", "time": "14:30", "description": "Different millennium"},
    {"date": "1985-03-10", "time": "06:45", "description": "Earlier year"},
]

print("Testing Bazi calculations for multiple dates...")
print("=" * 80)

for test_case in test_dates:
    try:
        response = requests.post('http://localhost:5000/calculate', 
                               json={
                                   'dateTime': f"{test_case['date']}T{test_case['time']}:00",
                                   'location': 'Asia/Jakarta',
                                   'gender': 1
                               })
        
        if response.status_code == 200:
            result = response.json()
            pillars = result['four_pillars']
            
            print(f"\n{test_case['description']}: {test_case['date']} {test_case['time']}")
            print(f"Year:  {pillars['year_pillar']['heavenly_stem']['character']}{pillars['year_pillar']['earthly_branch']['character']} ({pillars['year_pillar']['heavenly_stem']['name']} + {pillars['year_pillar']['earthly_branch']['name']})")
            print(f"Month: {pillars['month_pillar']['heavenly_stem']['character']}{pillars['month_pillar']['earthly_branch']['character']} ({pillars['month_pillar']['heavenly_stem']['name']} + {pillars['month_pillar']['earthly_branch']['name']})")
            print(f"Day:   {pillars['day_pillar']['heavenly_stem']['character']}{pillars['day_pillar']['earthly_branch']['character']} ({pillars['day_pillar']['heavenly_stem']['name']} + {pillars['day_pillar']['earthly_branch']['name']})")
            print(f"Hour:  {pillars['hour_pillar']['heavenly_stem']['character']}{pillars['hour_pillar']['earthly_branch']['character']} ({pillars['hour_pillar']['heavenly_stem']['name']} + {pillars['hour_pillar']['earthly_branch']['name']})")
            
        else:
            print(f"Error for {test_case['date']}: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"Error testing {test_case['date']}: {e}")

print("\n" + "=" * 80)
print("Check if each date produces DIFFERENT results (proper rotation)")