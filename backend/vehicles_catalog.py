"""
Catalogue de véhicules — pour la recherche manuelle (marque/modèle/année/carburant).
Couvre les modèles les plus populaires sur le marché tunisien et maghrébin.
"""

FUEL_TYPES = ["Essence", "Diesel", "Diesel HDI", "GPL", "Hybride", "Électrique"]

# Année min commune
_YEARS = list(range(2024, 1999, -1))


def y(start: int = 2000, end: int = 2024):
    return list(range(end, start - 1, -1))


VEHICLES = {
    "Volkswagen": {
        "models": [
            "Golf 4", "Golf 5", "Golf 6", "Golf 7", "Golf 8",
            "Polo", "Polo 6", "Passat B6", "Passat B7", "Passat B8",
            "Tiguan", "Touareg", "Touran", "Jetta", "Caddy", "Transporter T5", "Transporter T6", "Up!"
        ],
        "years": y(2000),
        "fuels": ["Essence", "Diesel", "Diesel HDI", "Hybride"],
    },
    "Audi": {
        "models": ["A1", "A3", "A4 B7", "A4 B8", "A4 B9", "A5", "A6 C6", "A6 C7", "A7", "A8", "Q3", "Q5", "Q7", "TT"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
    "Mercedes-Benz": {
        "models": [
            "Classe A W168", "Classe A W169", "Classe A W176", "Classe A W177",
            "Classe B", "Classe C W203", "Classe C W204", "Classe C W205", "Classe C W206",
            "Classe E W211", "Classe E W212", "Classe E W213",
            "CLA", "GLA", "GLB", "GLC", "GLE", "GLK", "ML", "Sprinter", "Vito"
        ],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
    "BMW": {
        "models": ["Série 1 E87", "Série 1 F20", "Série 1 F40", "Série 3 E46", "Série 3 E90", "Série 3 F30", "Série 3 G20", "Série 5 E60", "Série 5 F10", "Série 5 G30", "Série 7", "X1", "X3", "X5", "X6"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
    "Peugeot": {
        "models": ["106", "206", "207", "208", "208 II", "301", "307", "308", "308 II", "407", "508", "2008", "3008", "5008", "Partner", "Boxer", "Expert"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel HDI", "Diesel"],
    },
    "Citroën": {
        "models": ["C1", "C2", "C3", "C3 Picasso", "C4", "C4 Picasso", "C5", "Berlingo", "Jumpy", "Jumper", "DS3", "DS4", "DS5"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel HDI", "Diesel"],
    },
    "Renault": {
        "models": ["Clio II", "Clio III", "Clio IV", "Clio V", "Symbol", "Mégane II", "Mégane III", "Mégane IV", "Scénic", "Captur", "Kadjar", "Koleos", "Talisman", "Trafic", "Master", "Kangoo", "Fluence", "Twingo"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel", "Diesel HDI", "GPL"],
    },
    "Dacia": {
        "models": ["Logan", "Logan II", "Sandero", "Sandero II", "Sandero Stepway", "Duster", "Duster II", "Lodgy", "Dokker", "Spring"],
        "years": y(2004),
        "fuels": ["Essence", "Diesel", "GPL", "Électrique"],
    },
    "Toyota": {
        "models": ["Yaris", "Yaris II", "Yaris III", "Yaris IV", "Corolla", "Corolla E150", "Corolla E170", "Corolla E210", "Auris", "Avensis", "RAV4", "Land Cruiser", "Hilux", "Hiace", "C-HR"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel", "Hybride"],
    },
    "Hyundai": {
        "models": ["i10", "i20", "i30", "i40", "Accent", "Elantra", "Sonata", "Tucson", "Santa Fe", "Kona", "ix35", "H1", "Atos"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel", "Hybride"],
    },
    "Kia": {
        "models": ["Picanto", "Rio", "Cerato", "Ceed", "Optima", "Sportage", "Sorento", "Carnival", "Stonic", "Soul"],
        "years": y(2003),
        "fuels": ["Essence", "Diesel"],
    },
    "Ford": {
        "models": ["Fiesta", "Focus II", "Focus III", "Focus IV", "Mondeo", "Kuga", "EcoSport", "C-Max", "Transit", "Ranger"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
    "Nissan": {
        "models": ["Micra", "Note", "Juke", "Qashqai", "X-Trail", "Pathfinder", "Navara", "Sunny", "Almera"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
    "Opel": {
        "models": ["Corsa C", "Corsa D", "Corsa E", "Astra G", "Astra H", "Astra J", "Astra K", "Insignia", "Mokka", "Zafira", "Vivaro"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
    "Fiat": {
        "models": ["Panda", "500", "Punto", "Punto Evo", "Bravo", "Tipo", "Doblo", "Ducato", "500X", "500L"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
    "Seat": {
        "models": ["Ibiza", "Leon", "Toledo", "Cordoba", "Altea", "Ateca", "Arona", "Tarraco"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
    "Skoda": {
        "models": ["Fabia", "Octavia", "Superb", "Rapid", "Kodiaq", "Karoq", "Yeti", "Roomster"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
    "Honda": {
        "models": ["Civic", "Accord", "CR-V", "Jazz", "HR-V"],
        "years": y(2000),
        "fuels": ["Essence", "Hybride"],
    },
    "Mazda": {
        "models": ["Mazda 2", "Mazda 3", "Mazda 6", "CX-3", "CX-5", "CX-30"],
        "years": y(2002),
        "fuels": ["Essence", "Diesel"],
    },
    "Suzuki": {
        "models": ["Swift", "Vitara", "Jimny", "S-Cross", "Baleno", "Alto"],
        "years": y(2000),
        "fuels": ["Essence", "Diesel"],
    },
}


def get_catalog():
    return {
        "brands": sorted(VEHICLES.keys()),
        "fuels": FUEL_TYPES,
        "data": {
            brand: {
                "models": data["models"],
                "years": data["years"],
                "fuels": data["fuels"],
            }
            for brand, data in VEHICLES.items()
        },
    }


def validate_combo(make: str, model: str, year, fuel: str) -> bool:
    data = VEHICLES.get(make)
    if not data:
        return False
    if model not in data["models"]:
        return False
    try:
        y = int(year)
        if y not in data["years"]:
            return False
    except (TypeError, ValueError):
        return False
    if fuel not in data["fuels"]:
        return False
    return True
