"""
BENNOURI Pièces Auto — Catalogue de pièces détachées.
Structure: section -> category -> parts list.
Sections: mecanique, electrique, carrosserie.
Prix en TND (Dinar Tunisien).
"""

# Reliable Pexels image URLs. Each category image matches its real-world subject.
PEX = lambda i: f"https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?auto=compress&cs=tinysrgb&w=800"

# Category background images (one per subcategory)
CAT_IMG = {
    # Mécanique
    "moteur": PEX(4489732),          # mechanic on engine block
    "boite-vitesses": PEX(13065690), # gearbox-style engine bay
    "transmission": PEX(2244746),    # underbody engine / mechanics
    "suspension": PEX(4480456),      # car undercarriage
    "direction": PEX(3807345),       # steering wheel / cockpit
    "freinage": PEX(1545743),        # brake disc / alloy wheel
    # Électrique
    "batterie-demarrage": PEX(190574),   # battery / charging
    "eclairage": PEX(2127733),           # car headlight close-up
    "faisceaux": PEX(4480455),           # wiring / engine harness
    "lavage-essuyage": PEX(919073),      # car w/ visible windshield
    "securite": PEX(244553),             # car door / alarm
    # Carrosserie
    "partie-avant": PEX(919073),         # front bumper / grille
    "partie-arriere": PEX(112460),       # rear of vehicle
    "portes": PEX(1638459),              # white car body / doors
    "retroviseurs": PEX(100650),         # side mirror close-up
    "pavillon": PEX(1429775),            # car roof / pavilion
}

# Part images grouped by family — each image visually matches the part type.
IMG = {
    # Engine parts
    "filtre_huile":   PEX(13070069),
    "filtre_air":     PEX(13070069),
    "courroie":       PEX(2244746),
    "pompe_eau":      PEX(190574),
    "bougie":         PEX(190574),
    "joint_culasse":  PEX(4489732),
    "moteur_bloc":    PEX(4489732),
    # Boîte de vitesses
    "embrayage":      PEX(13065690),
    "boite":          PEX(13065690),
    "cable_vitesses": PEX(2244746),
    "huile_boite":    PEX(13070069),
    "volant_moteur":  PEX(13065690),
    # Transmission
    "cardan":         PEX(2244746),
    "soufflet":       PEX(2244746),
    "roulement":      PEX(1545743),
    "pneu":           PEX(1545743),
    # Suspension
    "amortisseur":    PEX(4480456),
    "ressort":        PEX(4480456),
    "rotule":         PEX(4480456),
    "barre_stab":     PEX(4480456),
    # Direction
    "cremaillere":    PEX(3807345),
    "pompe_da":       PEX(3807345),
    "biellette":      PEX(3807345),
    "colonne_dir":    PEX(3807345),
    # Freinage
    "disque_frein":   PEX(1545743),
    "plaquettes":     PEX(1545743),
    "etrier":         PEX(1545743),
    "liquide_frein":  PEX(13070069),
    # Batterie / démarrage
    "batterie":       PEX(190574),
    "demarreur":      PEX(190574),
    "alternateur":    PEX(190574),
    # Éclairage
    "phare":          PEX(2127733),
    "feu_arriere":    PEX(112460),
    "ampoule":        PEX(2127733),
    "antibrouillard": PEX(2127733),
    # Faisceaux
    "fusible":        PEX(4480455),
    "faisceau":       PEX(4480455),
    "boitier_fus":    PEX(4480455),
    "sonde":          PEX(4480455),
    # Lavage / Essuyage
    "essuie_glace":   PEX(919073),
    "moteur_essuie":  PEX(919073),
    "pompe_lg":       PEX(919073),
    # Sécurité / Confort
    "alarme":         PEX(244553),
    "leve_vitre":     PEX(1638459),
    "klaxon":         PEX(244553),
    # Carrosserie - avant
    "pare_choc_av":   PEX(919073),
    "capot":          PEX(919073),
    "aile":           PEX(919073),
    "calandre":       PEX(919073),
    "pare_brise":     PEX(919073),
    # Carrosserie - arrière
    "pare_choc_ar":   PEX(112460),
    "hayon":          PEX(112460),
    "lunette":        PEX(112460),
    "serrure":        PEX(112460),
    # Portes
    "porte":          PEX(1638459),
    "vitre":          PEX(1638459),
    "poignee":        PEX(1638459),
    "garniture_porte":PEX(1638459),
    # Rétroviseurs
    "retro_ext":      PEX(100650),
    "retro_int":      PEX(100650),
    "verre_retro":    PEX(100650),
    # Pavillon
    "pavillon":       PEX(1429775),
    "toit_ouvrant":   PEX(1429775),
    "antenne":        PEX(1429775),
    "barres_toit":    PEX(1429775),
}


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
        "description": "Moteur, transmission, freinage, suspension et direction.",
        "categories": [
            {
                "slug": "moteur",
                "label": "Moteur",
                "icon": "engine",
                "image": CAT_IMG["moteur"],
                "parts": [
                    _p("MOT-1001", "Filtre à huile premium", 18.500, "MANN-FILTER", IMG["filtre_huile"]),
                    _p("MOT-1002", "Courroie de distribution", 89.900, "GATES", IMG["courroie"]),
                    _p("MOT-1003", "Pompe à eau", 145.000, "VALEO", IMG["pompe_eau"]),
                    _p("MOT-1004", "Filtre à air sport", 32.000, "K&N", IMG["filtre_air"]),
                    _p("MOT-1005", "Bougies d'allumage (x4)", 64.000, "NGK", IMG["bougie"]),
                    _p("MOT-1006", "Joint de culasse", 210.000, "ELRING", IMG["joint_culasse"]),
                ],
            },
            {
                "slug": "boite-vitesses",
                "label": "Boîte de vitesses",
                "icon": "gearbox",
                "image": CAT_IMG["boite-vitesses"],
                "parts": [
                    _p("BV-2001", "Kit embrayage complet", 420.000, "LUK", IMG["embrayage"]),
                    _p("BV-2002", "Volant moteur bi-masse", 680.000, "SACHS", IMG["volant_moteur"]),
                    _p("BV-2003", "Câble de commande de vitesses", 95.000, "FEBI", IMG["cable_vitesses"]),
                    _p("BV-2004", "Huile boîte 75W-90 (1L)", 38.500, "MOTUL", IMG["huile_boite"]),
                ],
            },
            {
                "slug": "transmission",
                "label": "Transmission",
                "icon": "transmission",
                "image": CAT_IMG["transmission"],
                "parts": [
                    _p("TR-3001", "Cardan complet avant gauche", 285.000, "GKN", IMG["cardan"]),
                    _p("TR-3002", "Cardan complet avant droit", 285.000, "GKN", IMG["cardan"]),
                    _p("TR-3003", "Kit soufflet de cardan", 28.000, "FEBI", IMG["soufflet"]),
                    _p("TR-3004", "Roulement de roue avant", 78.000, "SKF", IMG["roulement"]),
                    _p("TR-3005", "Pneumatique 195/65 R15", 165.000, "MICHELIN", IMG["pneu"]),
                ],
            },
            {
                "slug": "suspension",
                "label": "Suspension",
                "icon": "suspension",
                "image": CAT_IMG["suspension"],
                "parts": [
                    _p("SP-4001", "Amortisseur avant (paire)", 280.000, "BILSTEIN", IMG["amortisseur"]),
                    _p("SP-4002", "Amortisseur arrière (paire)", 245.000, "BILSTEIN", IMG["amortisseur"]),
                    _p("SP-4003", "Ressort de suspension avant", 110.000, "KYB", IMG["ressort"]),
                    _p("SP-4004", "Rotule de suspension", 45.000, "TRW", IMG["rotule"]),
                    _p("SP-4005", "Barre stabilisatrice", 135.000, "FEBI", IMG["barre_stab"]),
                ],
            },
            {
                "slug": "direction",
                "label": "Direction",
                "icon": "steering",
                "image": CAT_IMG["direction"],
                "parts": [
                    _p("DR-5001", "Crémaillère de direction", 580.000, "TRW", IMG["cremaillere"]),
                    _p("DR-5002", "Pompe direction assistée", 320.000, "BOSCH", IMG["pompe_da"]),
                    _p("DR-5003", "Biellette de direction", 38.000, "MOOG", IMG["biellette"]),
                    _p("DR-5004", "Colonne de direction", 410.000, "FEBI", IMG["colonne_dir"]),
                ],
            },
            {
                "slug": "freinage",
                "label": "Freinage",
                "icon": "brake",
                "image": CAT_IMG["freinage"],
                "parts": [
                    _p("FR-6001", "Disques de frein avant (paire)", 165.000, "BREMBO", IMG["disque_frein"]),
                    _p("FR-6002", "Plaquettes avant", 78.000, "FERODO", IMG["plaquettes"]),
                    _p("FR-6003", "Disques de frein arrière (paire)", 145.000, "BREMBO", IMG["disque_frein"]),
                    _p("FR-6004", "Plaquettes arrière", 62.000, "FERODO", IMG["plaquettes"]),
                    _p("FR-6005", "Étrier de frein avant", 240.000, "ATE", IMG["etrier"]),
                    _p("FR-6006", "Liquide de frein DOT 4 (1L)", 22.000, "BOSCH", IMG["liquide_frein"]),
                ],
            },
        ],
    },
    "electrique": {
        "label": "Électrique",
        "icon": "battery",
        "description": "Batterie, démarrage, éclairage et électronique embarquée.",
        "categories": [
            {
                "slug": "batterie-demarrage",
                "label": "Batterie & Démarrage",
                "icon": "battery",
                "image": CAT_IMG["batterie-demarrage"],
                "parts": [
                    _p("EL-7001", "Batterie 60Ah 540A", 240.000, "VARTA", IMG["batterie"]),
                    _p("EL-7002", "Batterie 70Ah 760A", 295.000, "BOSCH", IMG["batterie"]),
                    _p("EL-7003", "Démarreur 1.2kW", 380.000, "VALEO", IMG["demarreur"]),
                    _p("EL-7004", "Alternateur 110A", 420.000, "DENSO", IMG["alternateur"]),
                    _p("EL-7005", "Bougie de préchauffage (x4)", 68.000, "NGK", IMG["bougie"]),
                ],
            },
            {
                "slug": "eclairage",
                "label": "Éclairage & Signalisation",
                "icon": "headlight",
                "image": CAT_IMG["eclairage"],
                "parts": [
                    _p("EL-8001", "Phare avant LED gauche", 480.000, "HELLA", IMG["phare"]),
                    _p("EL-8002", "Phare avant LED droit", 480.000, "HELLA", IMG["phare"]),
                    _p("EL-8003", "Feu arrière gauche", 145.000, "VALEO", IMG["feu_arriere"]),
                    _p("EL-8004", "Feu arrière droit", 145.000, "VALEO", IMG["feu_arriere"]),
                    _p("EL-8005", "Kit ampoules H7 LED", 95.000, "OSRAM", IMG["ampoule"]),
                    _p("EL-8006", "Antibrouillard avant", 110.000, "HELLA", IMG["antibrouillard"]),
                ],
            },
            {
                "slug": "faisceaux",
                "label": "Faisceaux & Connectique",
                "icon": "wiring",
                "image": CAT_IMG["faisceaux"],
                "parts": [
                    _p("EL-9001", "Kit de fusibles complet", 28.000, "FEBI", IMG["fusible"]),
                    _p("EL-9002", "Faisceau avant moteur", 320.000, "DELPHI", IMG["faisceau"]),
                    _p("EL-9003", "Boîtier de fusibles", 180.000, "BOSCH", IMG["boitier_fus"]),
                    _p("EL-9004", "Sonde lambda", 145.000, "BOSCH", IMG["sonde"]),
                ],
            },
            {
                "slug": "lavage-essuyage",
                "label": "Lavage & Essuyage",
                "icon": "wiper",
                "image": CAT_IMG["lavage-essuyage"],
                "parts": [
                    _p("EL-10001", "Balais d'essuie-glace (paire)", 42.000, "BOSCH", IMG["essuie_glace"]),
                    _p("EL-10002", "Moteur essuie-glace avant", 195.000, "VALEO", IMG["moteur_essuie"]),
                    _p("EL-10003", "Pompe lave-glace", 38.000, "FEBI", IMG["pompe_lg"]),
                    _p("EL-10004", "Balai essuie-glace arrière", 18.500, "BOSCH", IMG["essuie_glace"]),
                ],
            },
            {
                "slug": "securite",
                "label": "Sécurité & Confort",
                "icon": "alarm",
                "image": CAT_IMG["securite"],
                "parts": [
                    _p("EL-11001", "Alarme antivol universelle", 240.000, "COBRA", IMG["alarme"]),
                    _p("EL-11002", "Moteur lève-vitre avant", 165.000, "VALEO", IMG["leve_vitre"]),
                    _p("EL-11003", "Centrale clignotants", 35.000, "HELLA", IMG["fusible"]),
                    _p("EL-11004", "Klaxon double tonalité", 48.000, "BOSCH", IMG["klaxon"]),
                ],
            },
        ],
    },
    "carrosserie": {
        "label": "Carrosserie",
        "icon": "car-body",
        "description": "Pare-chocs, ailes, capots, vitres et pièces de carrosserie.",
        "categories": [
            {
                "slug": "partie-avant",
                "label": "Partie avant",
                "icon": "front",
                "image": CAT_IMG["partie-avant"],
                "parts": [
                    _p("CR-12001", "Pare-chocs avant", 380.000, "OEM", IMG["pare_choc_av"]),
                    _p("CR-12002", "Capot moteur", 520.000, "OEM", IMG["capot"]),
                    _p("CR-12003", "Aile avant gauche", 165.000, "OEM", IMG["aile"]),
                    _p("CR-12004", "Aile avant droite", 165.000, "OEM", IMG["aile"]),
                    _p("CR-12005", "Calandre chromée", 95.000, "OEM", IMG["calandre"]),
                    _p("CR-12006", "Pare-brise feuilleté", 420.000, "SAINT-GOBAIN", IMG["pare_brise"]),
                ],
            },
            {
                "slug": "partie-arriere",
                "label": "Partie arrière",
                "icon": "back",
                "image": CAT_IMG["partie-arriere"],
                "parts": [
                    _p("CR-13001", "Pare-chocs arrière", 340.000, "OEM", IMG["pare_choc_ar"]),
                    _p("CR-13002", "Hayon arrière", 580.000, "OEM", IMG["hayon"]),
                    _p("CR-13003", "Aile arrière gauche", 195.000, "OEM", IMG["aile"]),
                    _p("CR-13004", "Lunette arrière", 280.000, "SAINT-GOBAIN", IMG["lunette"]),
                    _p("CR-13005", "Serrure de hayon", 78.000, "FEBI", IMG["serrure"]),
                ],
            },
            {
                "slug": "portes",
                "label": "Portes & Vitres",
                "icon": "door",
                "image": CAT_IMG["portes"],
                "parts": [
                    _p("CR-14001", "Porte avant gauche", 480.000, "OEM", IMG["porte"]),
                    _p("CR-14002", "Porte avant droite", 480.000, "OEM", IMG["porte"]),
                    _p("CR-14003", "Vitre de porte avant", 145.000, "SAINT-GOBAIN", IMG["vitre"]),
                    _p("CR-14004", "Poignée extérieure", 38.000, "FEBI", IMG["poignee"]),
                    _p("CR-14005", "Garniture de porte", 165.000, "OEM", IMG["garniture_porte"]),
                ],
            },
            {
                "slug": "retroviseurs",
                "label": "Rétroviseurs",
                "icon": "mirror",
                "image": CAT_IMG["retroviseurs"],
                "parts": [
                    _p("CR-15001", "Rétroviseur extérieur gauche", 195.000, "OEM", IMG["retro_ext"]),
                    _p("CR-15002", "Rétroviseur extérieur droit", 195.000, "OEM", IMG["retro_ext"]),
                    _p("CR-15003", "Coque de rétroviseur", 28.000, "OEM", IMG["retro_ext"]),
                    _p("CR-15004", "Verre de rétroviseur", 18.500, "FEBI", IMG["verre_retro"]),
                    _p("CR-15005", "Rétroviseur intérieur", 45.000, "OEM", IMG["retro_int"]),
                ],
            },
            {
                "slug": "pavillon",
                "label": "Pavillon & Toit",
                "icon": "roof",
                "image": CAT_IMG["pavillon"],
                "parts": [
                    _p("CR-16001", "Garniture de pavillon", 240.000, "OEM", IMG["pavillon"]),
                    _p("CR-16002", "Mécanisme toit ouvrant", 580.000, "OEM", IMG["toit_ouvrant"]),
                    _p("CR-16003", "Antenne de toit", 38.000, "HIRSCHMANN", IMG["antenne"]),
                    _p("CR-16004", "Barres de toit", 165.000, "THULE", IMG["barres_toit"]),
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
