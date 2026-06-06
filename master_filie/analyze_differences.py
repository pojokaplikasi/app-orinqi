import json

# Load the differences
with open('comparison_differences.json', 'r', encoding='utf-8') as f:
    differences = json.load(f)

print("="*80)
print("ANALISIS STATISTIK PERBEDAIAN DATA 24 JIEQI")
print("Excel (complete_jieqi_data_1909_2183.json) vs Aplikasi (corrected_final_jieqi_data_1900_2150.json)")
print("="*80)

# Calculate statistics
total_differences = len(differences)
years_affected = set(diff['year'] for diff in differences)
jieqi_types_affected = set(diff['jieqi'] for diff in differences)

print(f"\n📊 STATISTIK UMUM:")
print(f"   Total perbedaan: {total_differences}")
print(f"   Tahun terdampak: {len(years_affected)} tahun")
print(f"   Jenis Jieqi terdampak: {len(jieqi_types_affected)} dari 24 Jieqi")
print(f"   Range tahun: {min(years_affected)} - {max(years_affected)}")

# Group by Jieqi type
jieqi_diff_count = {}
for diff in differences:
    jieqi = diff['jieqi']
    if jieqi not in jieqi_diff_count:
        jieqi_diff_count[jieqi] = []
    jieqi_diff_count[jieqi].append(diff['difference_seconds'])

print(f"\n📋 PERBEDAAN PER JIEQI (diurutkan berdasarkan jumlah perbedaan):")
jieqi_sorted = sorted(jieqi_diff_count.items(), key=lambda x: len(x[1]), reverse=True)
for jieqi, diffs in jieqi_sorted:
    avg_diff = sum(diffs) / len(diffs)
    max_diff = max(diffs)
    min_diff = min(diffs)
    print(f"   {jieqi:15}: {len(diffs):3} perbedaan | Rata-rata: {avg_diff/3600:.1f} jam | Min: {min_diff/3600:.1f}j | Max: {max_diff/3600:.1f}j")

# Group by year
year_diff_count = {}
for diff in differences:
    year = diff['year']
    if year not in year_diff_count:
        year_diff_count[year] = []
    year_diff_count[year].append(diff['difference_seconds'])

print(f"\n📅 10 TAHUN DENGAN PERBEDAAN TERBANYAK:")
year_sorted = sorted(year_diff_count.items(), key=lambda x: len(x[1]), reverse=True)[:10]
for year, diffs in year_sorted:
    avg_diff = sum(diffs) / len(diffs)
    total_diff_hours = sum(diffs) / 3600
    print(f"   Tahun {year}: {len(diffs):2} perbedaan | Rata-rata: {avg_diff/3600:.2f} jam | Total: {total_diff_hours:.1f} jam")

# Calculate time difference statistics
all_diffs_seconds = [diff['difference_seconds'] for diff in differences if diff['difference_seconds'] is not None]
if all_diffs_seconds:
    avg_diff_seconds = sum(all_diffs_seconds) / len(all_diffs_seconds)
    median_diff_seconds = sorted(all_diffs_seconds)[len(all_diffs_seconds)//2]
    max_diff_seconds = max(all_diffs_seconds)
    min_diff_seconds = min(all_diffs_seconds)
    
    print(f"\n⏱️  STATISTIK SELISIH WAKTU:")
    print(f"   Rata-rata selisih: {avg_diff_seconds:.0f} detik ({avg_diff_seconds/3600:.2f} jam)")
    print(f"   Median selisih: {median_diff_seconds:.0f} detik ({median_diff_seconds/3600:.2f} jam)")
    print(f"   Selisih minimum: {min_diff_seconds:.0f} detik ({min_diff_seconds/60:.1f} menit)")
    print(f"   Selisih maksimum: {max_diff_seconds:.0f} detik ({max_diff_seconds/3600:.2f} jam)")
    
    # Categorize differences
    small_diffs = len([d for d in all_diffs_seconds if d < 300])  # < 5 menit
    medium_diffs = len([d for d in all_diffs_seconds if 300 <= d < 3600])  # 5 menit - 1 jam
    large_diffs = len([d for d in all_diffs_seconds if 3600 <= d < 86400])  # 1 jam - 24 jam
    huge_diffs = len([d for d in all_diffs_seconds if d >= 86400])  # >= 24 jam
    
    print(f"\n📊 KATEGORI PERBEDAAN:")
    print(f"   Kecil (< 5 menit):     {small_diffs:4} ({small_diffs/len(all_diffs_seconds)*100:.1f}%)")
    print(f"   Sedang (5-60 menit):   {medium_diffs:4} ({medium_diffs/len(all_diffs_seconds)*100:.1f}%)")
    print(f"   Besar (1-24 jam):      {large_diffs:4} ({large_diffs/len(all_diffs_seconds)*100:.1f}%)")
    print(f"   Sangat besar (> 24h):  {huge_diffs:4} ({huge_diffs/len(all_diffs_seconds)*100:.1f}%)")

# Check specific important Jieqi
important_jieqi = ['lichun', 'chunfen', 'xiazhi', 'qiufen', 'dongzhi']
print(f"\n🎯 PERBEDAAN PADA JIEQI PENTING:")
for jieqi in important_jieqi:
    if jieqi in jieqi_diff_count:
        diffs = jieqi_diff_count[jieqi]
        avg_diff = sum(diffs) / len(diffs)
        print(f"   {jieqi:10}: {len(diffs):3} perbedaan | Rata-rata: {avg_diff/3600:.2f} jam")

# Show sample of smallest and largest differences
print(f"\n🔍 5 PERBEDAAN TERKECIL:")
sorted_by_diff = sorted(differences, key=lambda x: x['difference_seconds'] if x['difference_seconds'] else 0)
for i, diff in enumerate(sorted_by_diff[:5], 1):
    print(f"   {i}. Tahun {diff['year']} - {diff['jieqi']}")
    print(f"      Excel:      {diff['excel']}")
    print(f"      Kalkulasi:  {diff['calculated']}")
    print(f"      Selisih:    {diff['difference_seconds']} detik ({diff['difference_seconds']/60:.1f} menit)")

print(f"\n🔥 5 PERBEDAAN TERBESAR:")
sorted_by_diff_desc = sorted(differences, key=lambda x: x['difference_seconds'] if x['difference_seconds'] else 0, reverse=True)
for i, diff in enumerate(sorted_by_diff_desc[:5], 1):
    print(f"   {i}. Tahun {diff['year']} - {diff['jieqi']}")
    print(f"      Excel:      {diff['excel']}")
    print(f"      Kalkulasi:  {diff['calculated']}")
    print(f"      Selisih:    {diff['difference_seconds']} detik ({diff['difference_seconds']/3600:.2f} jam)")

print("\n" + "="*80)
print("KESIMPULAN:")
print("="*80)
print("""
Data Excel (complete_jieqi_data_1909_2183.json) dan data kalkulasi 
(corrected_final_jieqi_data_1900_2150.json) menunjukkan PERBEDAAN SIGNIFIKAN.

Semua 5808 perbandingan (100%) menunjukkan perbedaan, dengan karakteristik:
- Tidak ada satupun data yang sama persis
- Perbedaan rata-rata berkisar beberapa jam hingga hari
- Semua 24 Jieqi terdampak perbedaan
- Semua tahun dari 1909-2150 terdampak

REKOMENDASI:
Perlu investigasi lebih lanjut untuk menentukan sumber perbedaan:
1. Apakah perbedaan timezone/konversi waktu?
2. Apakah perbedaan algoritma astronomi yang digunakan?
3. Apakah perbedaan ΔT (delta T) model yang diterapkan?
4. Apakah perbedaan epoch atau referensi koordinat?

Disarankan untuk memvalidasi kedua dataset terhadap sumber referensi independen
(Purple Mountain Observatory, NASA JPL Horizons, atau standar lainnya).
""")

print("="*80)
