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
        "description": "Moteur, transmission, freinage, suspension et direction.",
        "categories": [
            {
                "slug": "moteur",
                "label": "Moteur",
                "icon": "engine",
                "image": PEX(4489732),
                "sub_items": [
                    "Groupe moteur", "Bloc moteur", "Vilebrequin", "Culasse",
                    "Distribution", "Lubrification", "Refroidissement", "Alimentation",
                    "Échappement", "Antipollution", "Allumage", "Suralimentation",
                ],
                "parts": [
                    _p("MOT-1001", "Filtre à huile premium", 18.500, "MANN-FILTER", PEX(4489732)),
                    _p("MOT-1002", "Courroie de distribution", 89.900, "GATES", PEX(2244746)),
                    _p("MOT-1003", "Pompe à eau", 145.000, "VALEO", PEX(190574)),
                    _p("MOT-1004", "Filtre à air sport", 32.000, "K&N", PEX(13070069)),
                    _p("MOT-1005", "Bougies d'allumage (x4)", 64.000, "NGK", PEX(190574)),
                    _p("MOT-1006", "Joint de culasse", 210.000, "ELRING", PEX(4489732)),
                ],
            },
            {
                "slug": "boite-vitesses",
                "label": "Ensemble boîte de vitesses",
                "icon": "gearbox",
                "image": PEX(13065690),
                "sub_items": ["Embrayage", "Boîte de vitesses", "Commande de vitesses"],
                "parts": [
                    _p("BV-2001", "Kit embrayage complet", 420.000, "LUK", PEX(13065690)),
                    _p("BV-2002", "Volant moteur bi-masse", 680.000, "SACHS", PEX(13065690)),
                    _p("BV-2003", "Câble de commande de vitesses", 95.000, "FEBI", PEX(2244746)),
                    _p("BV-2004", "Huile boîte 75W-90 (1L)", 38.500, "MOTUL", PEX(13070069)),
                ],
            },
            {
                "slug": "transmission",
                "label": "Transmission",
                "icon": "transmission",
                "image": PEX(2244746),
                "sub_items": ["Boîte transfert", "Pont arrière", "Transmissions", "Roues", "Pneumatiques"],
                "parts": [
                    _p("TR-3001", "Cardan complet avant gauche", 285.000, "GKN", PEX(2244746)),
                    _p("TR-3002", "Cardan complet avant droit", 285.000, "GKN", PEX(2244746)),
                    _p("TR-3003", "Kit soufflet de cardan", 28.000, "FEBI", PEX(2244746)),
                    _p("TR-3004", "Roulement de roue avant", 78.000, "SKF", PEX(1545743)),
                    _p("TR-3005", "Pneumatique 195/65 R15", 165.000, "MICHELIN", PEX(1545743)),
                ],
            },
            {
                "slug": "suspension",
                "label": "Ensemble suspension",
                "icon": "suspension",
                "image": PEX(4480456),
                "sub_items": [
                    "Suspension", "Essieu avant", "Ressorts avant", "Amortisseurs avant",
                    "Barre antidévers avant", "Essieu arrière", "Ressorts arrière", "Amortisseurs arrière",
                ],
                "parts": [
                    _p("SP-4001", "Amortisseur avant (paire)", 280.000, "BILSTEIN", PEX(4480456)),
                    _p("SP-4002", "Amortisseur arrière (paire)", 245.000, "BILSTEIN", PEX(4480456)),
                    _p("SP-4003", "Ressort de suspension avant", 110.000, "KYB", PEX(4480456)),
                    _p("SP-4004", "Rotule de suspension", 45.000, "TRW", PEX(4480456)),
                    _p("SP-4005", "Barre stabilisatrice", 135.000, "FEBI", PEX(4480456)),
                ],
            },
            {
                "slug": "direction",
                "label": "Direction",
                "icon": "steering",
                "image": PEX(3807345),
                "sub_items": [
                    "Volant et commandes sous volant", "Colonne de direction", "Antivol",
                    "Crémaillère", "Direction assistée",
                ],
                "parts": [
                    _p("DR-5001", "Crémaillère de direction", 580.000, "TRW", PEX(3807345)),
                    _p("DR-5002", "Pompe direction assistée", 320.000, "BOSCH", PEX(190574)),
                    _p("DR-5003", "Biellette de direction", 38.000, "MOOG", PEX(4480456)),
                    _p("DR-5004", "Colonne de direction", 410.000, "FEBI", PEX(3807345)),
                ],
            },
            {
                "slug": "freinage",
                "label": "Freinage",
                "icon": "brake",
                "image": PEX(1545743),
                "sub_items": [
                    "Freins avant", "Freins arrière", "Canalisations", "Compensateur",
                    "Assistance de freinage", "Maître-cylindre", "Frein de stationnement",
                    "Pédalier", "ABS/ASR/ESP",
                ],
                "parts": [
                    _p("FR-6001", "Disques de frein avant (paire)", 165.000, "BREMBO", PEX(1545743)),
                    _p("FR-6002", "Plaquettes avant", 78.000, "FERODO", PEX(1545743)),
                    _p("FR-6003", "Disques de frein arrière (paire)", 145.000, "BREMBO", PEX(1545743)),
                    _p("FR-6004", "Plaquettes arrière", 62.000, "FERODO", PEX(1545743)),
                    _p("FR-6005", "Étrier de frein avant", 240.000, "ATE", PEX(1545743)),
                    _p("FR-6006", "Liquide de frein DOT 4 (1L)", 22.000, "BOSCH", PEX(13070069)),
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
