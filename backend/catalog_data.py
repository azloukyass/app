"""
BENNOURI Pièces Auto — Catalogue de pièces détachées.
Structure: section -> category (avec sub_items inline) -> parts list.
"""

PEX = lambda i: f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=800"


def _p(ref: str, name: str, price: float, brand: str, img: str, desc: str = ""):
    return {
        "ref": ref,
        "name": name,
        "price_tnd": price,
        "brand": brand,
        "image": img,
        "description": desc or f"Pièce d'origine équipementier — {name}",
        "stock": 25,
    }


CATALOG = {
    "mecanique": {
        "label": "Mécanique",
        "icon": "engine",
        "description": "Moteur, boîte de vitesses, suspension et freinage.",
        "categories": [
            {
                "slug": "moteur",
                "label": "Moteur",
                "icon": "engine",
                "image": PEX(4489732),
                "children": [
                    {"slug": "support-moteur", "label": "Support moteur", "children": [
                        {"slug": "support-boot", "label": "Support Boot", "children": []},
                        {"slug": "support-moteur-d", "label": "Support Moteur D", "children": []},
                        {"slug": "support-moteur-g", "label": "Support Moteur G", "children": []},
                    ]},
                    {"slug": "kit-chaine", "label": "Kit chaîne", "children": []},
                    {"slug": "pompe-a-eau", "label": "Pompe à eau", "children": []},
                    {"slug": "radiateur-eau", "label": "Radiateur d'eau", "children": []},
                    {"slug": "refrigerant", "label": "Réfrigérant", "children": []},
                    {"slug": "joint-culasse", "label": "Joint culasse", "children": []},
                    {"slug": "radiateur-chauffage", "label": "Radiateur chauffage", "children": []},
                    {"slug": "filtre-huile", "label": "Filtre à huile", "children": []},
                    {"slug": "filtre-air", "label": "Filtre à air", "children": []},
                    {"slug": "filtre-gazoil", "label": "Filtre gazoil", "children": []},
                    {"slug": "filtre-essence", "label": "Filtre à essence", "children": []},
                    {"slug": "radiateur-turbo", "label": "Radiateur turbo", "children": []},
                    {"slug": "filtre-habitacle", "label": "Filtre habitacle", "children": []},
                    {"slug": "turbo", "label": "Turbo", "children": []},
                    {"slug": "vase-eau", "label": "Vase d'eau", "children": []},
                    {"slug": "tube-eau", "label": "Tube d'eau", "children": []},
                    {"slug": "pipette-eau", "label": "Pipette d'eau", "children": []},
                    {"slug": "ventilateur", "label": "Ventilateur", "children": []},
                    {"slug": "injecteur", "label": "Injecteur", "children": []},
                    {"slug": "pompe-assistee", "label": "Pompe assistée", "children": []},
                ],
                "parts": [],
            },
            {
                "slug": "boite-vitesses",
                "label": "Boîte de vitesses",
                "icon": "gearbox",
                "image": PEX(13065690),
                "children": [
                    {"slug": "kit-embrayage", "label": "Kit embrayage", "children": []},
                    {"slug": "recepteur-embrayage", "label": "Récepteur embrayage", "children": []},
                    {"slug": "emetteur-embrayage", "label": "Émetteur embrayage", "children": []},
                    {"slug": "butee-embrayage", "label": "Butée embrayage", "children": []},
                    {"slug": "volant-moteur", "label": "Volant moteur", "children": []},
                    {"slug": "filtre-boite", "label": "Filtre boîte", "children": []},
                    {"slug": "cable-vitesse", "label": "Câble vitesse", "children": []},
                ],
                "parts": [],
            },
            {
                "slug": "suspension",
                "label": "Suspension",
                "icon": "suspension",
                "image": PEX(4480456),
                "children": [
                    {"slug": "av", "label": "Avant (AV)", "children": [
                        {"slug": "amortisseur-av", "label": "Amortisseur AV", "children": []},
                        {"slug": "triangle-av", "label": "Triangle AV", "children": [
                            {"slug": "rotule-sup", "label": "Rotule supérieure", "children": []},
                            {"slug": "silent-bloc", "label": "Silent bloc", "children": []},
                        ]},
                        {"slug": "biellette-suspension-av", "label": "Biellette suspension AV", "children": []},
                        {"slug": "ressort-boudin-av", "label": "Ressort à boudin AV", "children": []},
                        {"slug": "moyeu-av", "label": "Moyeu AV", "children": []},
                        {"slug": "roulement-av", "label": "Roulement AV", "children": []},
                    ]},
                    {"slug": "direction", "label": "Direction", "children": [
                        {"slug": "toc-amortisseur", "label": "Toc amortisseur", "children": []},
                        {"slug": "fusee-moyeu-av", "label": "Fusée moyeu AV", "children": []},
                        {"slug": "cremaillere", "label": "Crémaillère", "children": []},
                        {"slug": "rotule-direction", "label": "Rotule de direction", "children": []},
                        {"slug": "biellette-direction", "label": "Biellette de direction", "children": []},
                        {"slug": "antichoc", "label": "Antichoc", "children": []},
                    ]},
                    {"slug": "ar", "label": "Arrière (AR)", "children": [
                        {"slug": "amortisseur-ar", "label": "Amortisseur AR", "children": []},
                        {"slug": "biellette-suspension-ar", "label": "Biellette suspension AR", "children": []},
                        {"slug": "ressort-boudin-ar", "label": "Ressort à boudin AR", "children": []},
                        {"slug": "silent-bloc-trame-ar", "label": "Silent bloc trame AR", "children": []},
                        {"slug": "antichoc-ar", "label": "Antichoc AR", "children": []},
                        {"slug": "toc-amortisseur-ar", "label": "Toc amortisseur AR", "children": []},
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "freinage",
                "label": "Freinage",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "av", "label": "Avant (AV)", "children": [
                        {"slug": "plaquettes-av", "label": "Plaquettes AV", "children": []},
                        {"slug": "disque-frein-av", "label": "Disque frein AV", "children": []},
                        {"slug": "etrier-av", "label": "Étrier AV", "children": []},
                        {"slug": "maitre-cylindre", "label": "Maître-cylindre", "children": []},
                        {"slug": "servo-frein", "label": "Servo de frein", "children": []},
                    ]},
                    {"slug": "ar", "label": "Arrière (AR)", "children": [
                        {"slug": "plaquettes-ar", "label": "Plaquettes AR", "children": []},
                        {"slug": "disque-ar", "label": "Disque AR", "children": []},
                        {"slug": "tambour-ar", "label": "Tambour AR", "children": []},
                        {"slug": "flexible-ar", "label": "Flexible AR", "children": []},
                        {"slug": "etrier-ar", "label": "Étrier AR", "children": []},
                        {"slug": "cylindre-roue", "label": "Cylindre de roue", "children": []},
                    ]},
                ],
                "parts": [],
            },
        ],
    },
    "electrique": {
        "label": "Électrique",
        "icon": "fuses",
        "description": "Batterie, démarrage, éclairage, électronique embarquée et confort.",
        "categories": [
            {
                "slug": "bougie",
                "label": "Bougie",
                "icon": "engine",
                "image": PEX(4489732),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "bobine-allumage",
                "label": "Bobine d'allumage",
                "icon": "gearbox",
                "image": PEX(13065690),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "optique",
                "label": "Optique G+D",
                "icon": "suspension",
                "image": PEX(4480456),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "feu-ar",
                "label": "Feu AR G+D",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "feu-de-position",
                "label": "Feu de position",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "culipe-bougie",
                "label": "Culipe bougie",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "capteur-arb-acave",
                "label": "Capteur ARB A'Cave",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "capteur-abs",
                "label": "Capteur ABS",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "antibrouillard",
                "label": "Antibrouillard",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "retrouneuse",
                "label": "Rétroviseur",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "porte-pass",
                "label": "Porte Pass",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "klaxon",
                "label": "Klaxon",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "sond-pompe-a",
                "label": "Sonde pompe A",
                "icon": "brake",
                "image": PEX(1545743),
                "children": [
                    {"slug": "Bouton lave-vitre", "label": "Bouton lave-vitre", "children": [
                    ]},
                ],
                "parts": [],
            },
            {
                "slug": "batterie",
                "label": "Batterie",
                "icon": "brake",
                "image": PEX(1545743),
                "parts": [],
            },
        ],
    },
    "carrosserie": {
        "label": "Carrosserie",
        "icon": "car-front",
        "description": "Pare-chocs, ailes, capots, portes, vitres et pièces de carrosserie.",
        "categories": [
            {
                "slug": "av", "label": "Avant (AV)", "icon": "brake", "image": PEX(1545743), "children": [
                {"slug": "capot-moteur", "label": "Capot moteur", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "aile-av", "label": "Aile AV", "icon": "brake", "image": PEX(1545743), "children": []},
                {
                    "slug": "parechoc-av", "label": "Pare-choc AV", "icon": "brake", "image": PEX(1545743), "children": [
                    {"slug": "spoiler", "label": "Spoiler", "icon": "brake", "image": PEX(1545743), "children": []},
                    {"slug": "grille-centrale", "label": "Grille centrale", "icon": "brake",  "image": PEX(1545743), "children": []},
                    {"slug": "cache-antibrouillard", "label": "Cache antibrouillard", "icon": "brake", "image": PEX(1545743),
                     "children": []},
                ]
                },
                {"slug": "cache-moteur", "label": "Cache moteur", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "calandre", "label": "Calandre", "icon": "brake",  "image": PEX(1545743), "children": []},
                {"slug": "plage-av", "label": "Plage AV",  "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "support-plage", "label": "Support plage", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "traverse-sup", "label": "Traverse supérieure", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "traverse-sup-inf", "label": "Traverse Sup/Inf", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "berceau", "label": "Berceau", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "pare-boue-av", "label": "Pare-boue AV", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "support-parechoc-av", "label": "Support pare-choc AV", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "porte-av", "label": "Porte AV", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "support-parachoc-av2", "label": "Support paracloc AV", "icon": "brake", "image": PEX(1545743), "children": []},
            ]
            },
            {
                "slug": "ar", "label": "Arrière (AR)", "icon": "brake",  "image": PEX(1545743), "children": [
                {"slug": "parechoc-ar", "label": "Pare-choc AR", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "malle-ar", "label": "Malle AR",  "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "traverse-ar", "label": "Traverse AR", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "porte-ar", "label": "Porte AR", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "support-parechoc-ar", "label": "Support pare-choc AR", "icon": "brake", "image": PEX(1545743), "children": []},
                {"slug": "jeep-ar", "label": "Jeep AR",  "icon": "brake", "image": PEX(1545743), "children": []},
            ]
            },
        ],
    },
}


def get_section(section_slug: str):
    return CATALOG.get(section_slug)


def get_category(section_slug: str, category_slug: str):
    section = CATALOG.get(section_slug)
    if not section:
        return None
    for cat in section["categories"]:
        if cat["slug"] == category_slug:
            return cat
    return None


def find_part(ref: str):
    for section in CATALOG.values():
        for cat in section["categories"]:
            for part in cat["parts"]:
                if part["ref"] == ref:
                    return part
    return None
