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
                "sub_items": [
                    "Support moteur (Boot / D / G)",
                    "Kit chaîne",
                    "Pompe à eau",
                    "Radiateur d'eau",
                    "Réfrigérant",
                    "Joint culasse",
                    "Radiateur chauffage",
                    "Filtre à huile",
                    "Filtre à air",
                    "Filtre gazoil",
                    "Filtre à essence",
                    "Radiateur turbo",
                    "Filtre habitacle",
                    "Turbo",
                    "Vase d'eau",
                    "Tube d'eau",
                    "Pipette d'eau",
                    "Ventilateur",
                    "Injecteur",
                    "Pompe assistée",
                ],
                "parts": [
                    _p("MOT-1001", "Filtre à huile premium", 18.500, "MANN-FILTER", PEX(4489732)),
                    _p("MOT-1002", "Pompe à eau", 145.000, "VALEO", PEX(190574)),
                    _p("MOT-1003", "Filtre à air", 32.000, "MANN-FILTER", PEX(4489732)),
                    _p("MOT-1004", "Filtre gazoil", 28.500, "BOSCH", PEX(4489732)),
                    _p("MOT-1005", "Filtre habitacle", 24.000, "MAHLE", PEX(4489732)),
                    _p("MOT-1006", "Joint de culasse", 210.000, "ELRING", PEX(4489732)),
                    _p("MOT-1007", "Turbo", 1250.000, "GARRETT", PEX(190574)),
                    _p("MOT-1008", "Injecteur", 320.000, "BOSCH", PEX(190574)),
                    _p("MOT-1009", "Pompe assistée", 280.000, "ZF", PEX(190574)),
                    _p("MOT-1010", "Radiateur d'eau", 195.000, "VALEO", PEX(4489732)),
                    _p("MOT-1011", "Ventilateur", 165.000, "VALEO", PEX(4489732)),
                    _p("MOT-1012", "Support moteur D", 95.000, "FEBI", PEX(4489732)),
                    _p("MOT-1013", "Support moteur G", 95.000, "FEBI", PEX(4489732)),
                    _p("MOT-1014", "Support boot", 55.000, "FEBI", PEX(4489732)),
                    _p("MOT-1015", "Kit chaîne distribution", 320.000, "GATES", PEX(2244746)),
                ],
            },
            {
                "slug": "boite-vitesses",
                "label": "Boîte de vitesses",
                "icon": "gearbox",
                "image": PEX(13065690),
                "sub_items": [
                    "Kit embrayage",
                    "Récepteur embrayage",
                    "Émetteur embrayage",
                    "Butée embrayage",
                    "Volant moteur",
                    "Filtre boîte",
                    "Câble vitesse",
                ],
                "parts": [
                    _p("BV-2001", "Kit embrayage complet", 420.000, "LUK", PEX(13065690)),
                    _p("BV-2002", "Volant moteur bi-masse", 680.000, "SACHS", PEX(13065690)),
                    _p("BV-2003", "Câble de vitesse", 95.000, "FEBI", PEX(2244746)),
                    _p("BV-2004", "Récepteur embrayage", 145.000, "LUK", PEX(13065690)),
                    _p("BV-2005", "Émetteur embrayage", 135.000, "LUK", PEX(13065690)),
                    _p("BV-2006", "Butée embrayage", 78.000, "SACHS", PEX(13065690)),
                    _p("BV-2007", "Filtre boîte automatique", 88.000, "MANN-FILTER", PEX(13065690)),
                ],
            },
            {
                "slug": "suspension",
                "label": "Suspension",
                "icon": "suspension",
                "image": PEX(4480456),
                "sub_items": [
                    # Avant
                    "Amortisseur AV",
                    "Triangle AV (Rotule sup. / Silent bloc)",
                    "Biellette suspension AV",
                    "Ressort à boudin AV",
                    "Moyeu AV",
                    "Roulement AV",
                    # Direction commune
                    "Toc amortisseur",
                    "Fusée moyeu AV",
                    "Crémaillère",
                    "Rotule de direction",
                    "Biellette de direction",
                    "Antichoc",
                    # Arrière
                    "Amortisseur AR",
                    "Biellette suspension AR",
                    "Ressort à boudin AR",
                    "Silent bloc trame AR",
                    "Antichoc AR",
                    "Toc amortisseur AR",
                ],
                "parts": [
                    _p("SP-4001", "Amortisseur AV (paire)", 280.000, "BILSTEIN", PEX(4480456)),
                    _p("SP-4002", "Amortisseur AR (paire)", 245.000, "BILSTEIN", PEX(4480456)),
                    _p("SP-4003", "Ressort à boudin AV", 110.000, "KYB", PEX(4480456)),
                    _p("SP-4004", "Ressort à boudin AR", 95.000, "KYB", PEX(4480456)),
                    _p("SP-4005", "Triangle AV avec rotule sup.", 180.000, "TRW", PEX(4480456)),
                    _p("SP-4006", "Silent bloc trame AR", 38.000, "FEBI", PEX(4480456)),
                    _p("SP-4007", "Biellette suspension AV", 42.000, "MOOG", PEX(4480456)),
                    _p("SP-4008", "Biellette suspension AR", 42.000, "MOOG", PEX(4480456)),
                    _p("SP-4009", "Crémaillère de direction", 580.000, "TRW", PEX(3807345)),
                    _p("SP-4010", "Rotule de direction", 38.000, "TRW", PEX(4480456)),
                    _p("SP-4011", "Biellette de direction", 38.000, "MOOG", PEX(4480456)),
                    _p("SP-4012", "Antichoc AV", 28.000, "FEBI", PEX(4480456)),
                    _p("SP-4013", "Antichoc AR", 28.000, "FEBI", PEX(4480456)),
                    _p("SP-4014", "Moyeu AV", 145.000, "SKF", PEX(1545743)),
                    _p("SP-4015", "Roulement AV", 78.000, "SKF", PEX(1545743)),
                    _p("SP-4016", "Fusée moyeu AV", 220.000, "SKF", PEX(1545743)),
                ],
            },
            {
                "slug": "freinage",
                "label": "Freinage",
                "icon": "brake",
                "image": PEX(1545743),
                "sub_items": [
                    # Avant
                    "Plaquettes AV",
                    "Disque frein AV",
                    "Étrier AV",
                    "Maître-cylindre",
                    "Servo de frein",
                    # Arrière
                    "Plaquettes AR",
                    "Disque AR",
                    "Tambour AR",
                    "Flexible AR",
                    "Étrier AR",
                    "Cylindre de roue",
                ],
                "parts": [
                    _p("FR-6001", "Disques de frein AV (paire)", 165.000, "BREMBO", PEX(1545743)),
                    _p("FR-6002", "Plaquettes AV", 78.000, "FERODO", PEX(1545743)),
                    _p("FR-6003", "Disques de frein AR (paire)", 145.000, "BREMBO", PEX(1545743)),
                    _p("FR-6004", "Plaquettes AR", 62.000, "FERODO", PEX(1545743)),
                    _p("FR-6005", "Étrier AV", 240.000, "ATE", PEX(1545743)),
                    _p("FR-6006", "Étrier AR", 220.000, "ATE", PEX(1545743)),
                    _p("FR-6007", "Maître-cylindre", 195.000, "ATE", PEX(1545743)),
                    _p("FR-6008", "Servo de frein", 320.000, "ATE", PEX(1545743)),
                    _p("FR-6009", "Tambour AR", 110.000, "BREMBO", PEX(1545743)),
                    _p("FR-6010", "Flexible AR", 28.000, "ATE", PEX(1545743)),
                    _p("FR-6011", "Cylindre de roue", 65.000, "ATE", PEX(1545743)),
                ],
            },
        ],
    },
    "electrique": {
        "label": "Électrique",
        "icon": "fuses",
        "description": "Batterie, démarrage, éclairage, électronique embarquée et confort.",
        "categories": [
            {
                "slug": "generalites",
                "label": "Généralités",
                "icon": "fuses",
                "image": PEX(4480455),
                "sub_items": [
                    "Affectation des fusibles", "Prises / bornes / connecteurs", "Épissures",
                    "Interconnexions", "Implantations", "Boîtiers / platines / coffrets", "Divers",
                ],
                "parts": [
                    _p("EL-9001", "Kit de fusibles complet", 28.000, "FEBI", PEX(4480455)),
                    _p("EL-9003", "Boîtier de fusibles", 180.000, "BOSCH", PEX(4480455)),
                ],
            },
            {
                "slug": "electricite-moteur",
                "label": "Électricité moteur",
                "icon": "battery",
                "image": PEX(190574),
                "sub_items": [
                    "Démarrage", "Génération de courant", "Préchauffage", "Batterie", "Batterie de traction",
                ],
                "parts": [
                    _p("EL-7001", "Batterie 60Ah 540A", 240.000, "VARTA", PEX(190574)),
                    _p("EL-7002", "Batterie 70Ah 760A", 295.000, "BOSCH", PEX(190574)),
                    _p("EL-7003", "Démarreur 1.2kW", 380.000, "VALEO", PEX(190574)),
                    _p("EL-7004", "Alternateur 110A", 420.000, "DENSO", PEX(190574)),
                    _p("EL-7005", "Bougie de préchauffage (x4)", 68.000, "NGK", PEX(190574)),
                ],
            },
            {
                "slug": "faisceaux",
                "label": "Faisceaux électriques",
                "icon": "wiring",
                "image": PEX(4480455),
                "sub_items": [
                    "Connectique", "Faisceaux avant", "Faisceaux centraux",
                    "Faisceaux arrière", "Câble haute tension / 12V",
                ],
                "parts": [
                    _p("EL-9002", "Faisceau avant moteur", 320.000, "DELPHI", PEX(4480455)),
                    _p("EL-9004", "Sonde lambda", 145.000, "BOSCH", PEX(4480455)),
                ],
            },
            {
                "slug": "eclairage",
                "label": "Éclairage - signalisation",
                "icon": "headlight",
                "image": PEX(2127733),
                "sub_items": [
                    "Éclairage intérieur", "Éclairage extérieur", "Signalisation", "Commandes sous volant",
                ],
                "parts": [
                    _p("EL-8001", "Phare avant LED gauche", 480.000, "HELLA", PEX(2127733)),
                    _p("EL-8002", "Phare avant LED droit", 480.000, "HELLA", PEX(2127733)),
                    _p("EL-8003", "Feu arrière gauche", 145.000, "VALEO", PEX(112460)),
                    _p("EL-8004", "Feu arrière droit", 145.000, "VALEO", PEX(112460)),
                    _p("EL-8005", "Kit ampoules H7 LED", 95.000, "OSRAM", PEX(2127733)),
                    _p("EL-8006", "Antibrouillard avant", 110.000, "HELLA", PEX(2127733)),
                ],
            },
            {
                "slug": "informations-conducteur",
                "label": "Informations conducteur",
                "icon": "info",
                "image": PEX(3807345),
                "sub_items": [
                    "Combiné", "Messages, sons et témoins éclairage - signalisation",
                    "Messages, sons et témoins groupe motopropulseur",
                    "Messages, sons et témoins protections et ouvrants",
                    "Messages, sons et témoins poste de conduite",
                    "Messages, sons et témoins aide à la conduite",
                    "Messages, sons et témoins lavage et essuyage",
                    "Messages, sons et témoins confort et vie à bord",
                    "Messages, sons et témoins accessoires", "Systèmes d'affichage",
                ],
                "parts": [
                    _p("EL-IC-001", "Combiné d'instruments", 380.000, "VDO", PEX(3807345)),
                    _p("EL-IC-002", "Écran multifonction central", 520.000, "VALEO", PEX(3807345)),
                    _p("EL-IC-003", "Avertisseur sonore (klaxon)", 48.000, "BOSCH", PEX(4480455)),
                ],
            },
            {
                "slug": "lavage-essuyage",
                "label": "Lavage et essuyage",
                "icon": "wiper",
                "image": PEX(919073),
                "sub_items": ["Lavage", "Essuyage", "Commandes sous volant"],
                "parts": [
                    _p("EL-10001", "Balais d'essuie-glace (paire)", 42.000, "BOSCH", PEX(919073)),
                    _p("EL-10002", "Moteur essuie-glace avant", 195.000, "VALEO", PEX(919073)),
                    _p("EL-10003", "Pompe lave-glace", 38.000, "FEBI", PEX(919073)),
                    _p("EL-10004", "Balai essuie-glace arrière", 18.500, "BOSCH", PEX(919073)),
                ],
            },
            {
                "slug": "protections-ouvrants",
                "label": "Protections et ouvrants",
                "icon": "alarm",
                "image": PEX(244553),
                "sub_items": [
                    "Antidémarrage", "Alarme", "Verrouillage / déverrouillage",
                    "Porte latérale coulissante", "Lève-vitres", "Coffre motorisé",
                    "Ceintures de sécurité", "Coussins gonflables", "Choc piéton", "Toit / rideau",
                ],
                "parts": [
                    _p("EL-11001", "Alarme antivol universelle", 240.000, "COBRA", PEX(244553)),
                    _p("EL-11002", "Moteur lève-vitre avant", 165.000, "VALEO", PEX(1638459)),
                    _p("EL-11003", "Centrale clignotants", 35.000, "HELLA", PEX(4480455)),
                    _p("EL-PO-004", "Ceinture de sécurité avant", 95.000, "TRW", PEX(244553)),
                ],
            },
            {
                "slug": "poste-conduite",
                "label": "Poste de conduite",
                "icon": "seat",
                "image": PEX(3807345),
                "sub_items": [
                    "Rétroviseurs", "Colonne de direction", "Sièges",
                    "Mémorisation poste de conduite", "Commandes sous volant",
                ],
                "parts": [
                    _p("EL-PC-001", "Rétroviseur intérieur jour/nuit", 45.000, "OEM", PEX(100650)),
                    _p("EL-PC-002", "Module mémorisation siège", 280.000, "OEM", PEX(3807345)),
                    _p("EL-PC-003", "Commodo sous volant gauche", 95.000, "VALEO", PEX(3807345)),
                ],
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
