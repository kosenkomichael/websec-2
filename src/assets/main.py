import csv

INPUT_FILE = "data_allsettlements_anon_156_v20251217.csv"
OUTPUT_FILE = "top1000_cities.csv"

cities = []

with open(INPUT_FILE, encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter=';')
    
    for row in reader:
        if row["object_level"] not in ["Населенный пункт", "Город федерального значения"]:
            continue
        
        try:
            name = row["settlement"]
            lat = float(row["latitude_dadata"])
            lon = float(row["longitude_dadata"])
            population = int(row["population"])
        except (ValueError, TypeError):
            continue

        if not name:
            continue

        cities.append({
            "name": name,
            "lat": lat,
            "lon": lon,
            "population": population
        })

cities.sort(key=lambda x: x["population"], reverse=True)

top_cities = cities[:1000]

with open(OUTPUT_FILE, "w", newline='', encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "lat", "lon", "population"])
    writer.writeheader()
    writer.writerows(top_cities)

print("top1000_cities.csv")