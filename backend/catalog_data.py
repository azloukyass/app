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
                "slug": "partie-avant",
                "label": "Partie avant",
                "icon": "car-front",
                "image": PEX(919073),
                "sub_items": [
                    "Pare-chocs avant", "Façade", "Aile avant", "Capot", "Pare-brise",
                    "Traverse", "Calandre", "Berceau", "Brancard", "Plancher avant",
                    "Protection sous caisse", "Insonorisant",
                ],
                "parts": [
                    _p("CR-12001", "Pare-chocs avant", 380.000, "OEM", PEX(919073)),
                    _p("CR-12002", "Capot moteur", 520.000, "OEM", PEX(919073)),
                    _p("CR-12003", "Aile avant gauche", 165.000, "OEM", PEX(919073)),
                    _p("CR-12004", "Aile avant droite", 165.000, "OEM", PEX(919073)),
                    _p("CR-12005", "Calandre chromée", 95.000, "OEM", PEX(919073)),
                    _p("CR-12006", "Pare-brise feuilleté", 420.000, "SAINT-GOBAIN", PEX(919073)),
                ],
            },
            {
                "slug": "partie-arriere",
                "label": "Partie arrière",
                "icon": "car-back",
                "image": PEX(112460),
                "sub_items": [
                    "Pare-chocs arrière", "Plancher arrière", "Cloison de cabine / séparation arrière",
                    "Volet / porte", "Aile arrière", "Lunette", "Soubassement", "Custode",
                    "Garniture", "Serrure", "Monogramme", "Attelage de remorque et faisceaux",
                ],
                "parts": [
                    _p("CR-13001", "Pare-chocs arrière", 340.000, "OEM", PEX(112460)),
                    _p("CR-13002", "Hayon arrière", 580.000, "OEM", PEX(112460)),
                    _p("CR-13003", "Aile arrière gauche", 195.000, "OEM", PEX(919073)),
                    _p("CR-13004", "Lunette arrière", 280.000, "SAINT-GOBAIN", PEX(112460)),
                    _p("CR-13005", "Serrure de hayon", 78.000, "FEBI", PEX(244553)),
                ],
            },
            {
                "slug": "partie-laterale",
                "label": "Partie latérale",
                "icon": "car-side",
                "image": PEX(1638459),
                "sub_items": [
                    "Pied avant", "Bas de caisse", "Pied central",
                    "Panneau de coté", "Vitre latérale fixe",
                ],
                "parts": [
                    _p("CR-PL-001", "Bas de caisse gauche", 145.000, "OEM", PEX(1638459)),
                    _p("CR-PL-002", "Bas de caisse droit", 145.000, "OEM", PEX(1638459)),
                    _p("CR-PL-003", "Panneau de côté", 220.000, "OEM", PEX(1638459)),
                    _p("CR-PL-004", "Vitre latérale fixe", 95.000, "SAINT-GOBAIN", PEX(1638459)),
                ],
            },
            {
                "slug": "portes-avant",
                "label": "Portes avant et garnissage",
                "icon": "door",
                "image": PEX(1638459),
                "sub_items": [
                    "Portes avant", "Vitres de porte avant", "Commande de porte avant",
                    "Garnissage de porte avant", "Rétroviseurs",
                ],
                "parts": [
                    _p("CR-14001", "Porte avant gauche", 480.000, "OEM", PEX(1638459)),
                    _p("CR-14002", "Porte avant droite", 480.000, "OEM", PEX(1638459)),
                    _p("CR-14003", "Vitre de porte avant", 145.000, "SAINT-GOBAIN", PEX(1638459)),
                    _p("CR-14004", "Poignée extérieure", 38.000, "FEBI", PEX(244553)),
                    _p("CR-14005", "Garniture de porte", 165.000, "OEM", PEX(1638459)),
                    _p("CR-15001", "Rétroviseur extérieur gauche", 195.000, "OEM", PEX(100650)),
                    _p("CR-15002", "Rétroviseur extérieur droit", 195.000, "OEM", PEX(100650)),
                ],
            },
            {
                "slug": "portes-arriere",
                "label": "Portes arrière et garnissage",
                "icon": "door",
                "image": PEX(1638459),
                "sub_items": [
                    "Portes arrière", "Vitres de porte arrière",
                    "Commande de porte arrière", "Garnissage de porte arrière",
                ],
                "parts": [
                    _p("CR-PA-001", "Porte arrière gauche", 460.000, "OEM", PEX(1638459)),
                    _p("CR-PA-002", "Porte arrière droite", 460.000, "OEM", PEX(1638459)),
                    _p("CR-PA-003", "Vitre de porte arrière", 135.000, "SAINT-GOBAIN", PEX(1638459)),
                    _p("CR-PA-004", "Garnissage porte arrière", 155.000, "OEM", PEX(1638459)),
                ],
            },
            {
                "slug": "pavillon",
                "label": "Ensemble pavillon et garnissage",
                "icon": "roof",
                "image": PEX(1429775),
                "sub_items": [
                    "Pavillon", "Arc de pavillon", "Garnitures du pavillon", "Toit ouvrant / capote",
                ],
                "parts": [
                    _p("CR-16001", "Garniture de pavillon", 240.000, "OEM", PEX(1429775)),
                    _p("CR-16002", "Mécanisme toit ouvrant", 580.000, "OEM", PEX(1429775)),
                    _p("CR-16003", "Antenne de toit", 38.000, "HIRSCHMANN", PEX(1429775)),
                    _p("CR-16004", "Barres de toit", 165.000, "THULE", PEX(1429775)),
                ],
            },
            {
                "slug": "caisse",
                "label": "Caisse",
                "icon": "car-body",
                "image": PEX(1638459),
                "sub_items": [
                    "Caisse nue", "Obturateurs de caisse", "Plateau-cabine", "Personnalisation",
                ],
                "parts": [
                    _p("CR-CA-001", "Obturateur de caisse", 28.000, "OEM", PEX(1638459)),
                    _p("CR-CA-002", "Plateau cabine", 320.000, "OEM", PEX(1638459)),
                    _p("CR-CA-003", "Kit personnalisation", 180.000, "OEM", PEX(1638459)),
                ],
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
