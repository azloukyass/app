"""
BENNOURI Pièces Auto — Catalogue de pièces détachées.
Structure: section -> category -> parts list.
Sections: mecanique, electrique, carrosserie.
Prix en TND (Dinar Tunisien).
"""

# Realistic auto-parts images from Unsplash (hotlinked)
IMG = {
    "moteur_complet": "https://images.unsplash.com/photo-1632733711450-c0c08aacaaca?w=600&h=450&fit=crop",
    "filtre_huile": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=450&fit=crop",
    "courroie": "https://images.unsplash.com/photo-1635770310802-7f9b1aab2fff?w=600&h=450&fit=crop",
    "pompe_eau": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=450&fit=crop",
    "embrayage": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=450&fit=crop",
    "boite_vitesses": "https://images.unsplash.com/photo-1635770310802-7f9b1aab2fff?w=600&h=450&fit=crop",
    "cardan": "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=600&h=450&fit=crop",
    "amortisseur": "https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?w=600&h=450&fit=crop",
    "ressort": "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6c?w=600&h=450&fit=crop",
    "rotule": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=450&fit=crop",
    "cremaillere": "https://images.unsplash.com/photo-1632733711450-c0c08aacaaca?w=600&h=450&fit=crop",
    "disque_frein": "https://images.unsplash.com/photo-1605618313023-d3eb22d92377?w=600&h=450&fit=crop",
    "plaquettes": "https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?w=600&h=450&fit=crop",
    "etrier": "https://images.unsplash.com/photo-1605618313023-d3eb22d92377?w=600&h=450&fit=crop",
    "batterie": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=450&fit=crop",
    "demarreur": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=450&fit=crop",
    "alternateur": "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=600&h=450&fit=crop",
    "phare": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=450&fit=crop",
    "feu_arriere": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    "ampoule": "https://images.unsplash.com/photo-1505845058571-cca538946229?w=600&h=450&fit=crop",
    "essuie_glace": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    "moteur_essuie": "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=600&h=450&fit=crop",
    "alarme": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=450&fit=crop",
    "leve_vitre": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    "fusible": "https://images.unsplash.com/photo-1505845058571-cca538946229?w=600&h=450&fit=crop",
    "pare_choc": "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6c?w=600&h=450&fit=crop",
    "capot": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=450&fit=crop",
    "aile": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    "calandre": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=450&fit=crop",
    "pare_brise": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    "porte": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=450&fit=crop",
    "vitre": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    "retroviseur": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=450&fit=crop",
    "feu_stop": "https://images.unsplash.com/photo-1505845058571-cca538946229?w=600&h=450&fit=crop",
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
                "image": "https://images.unsplash.com/photo-1632733711450-c0c08aacaaca?w=800&h=500&fit=crop",
                "parts": [
                    _p("MOT-1001", "Filtre à huile premium", 18.500, "MANN-FILTER", IMG["filtre_huile"], "Filtre haute filtration compatible moteurs essence et diesel."),
                    _p("MOT-1002", "Courroie de distribution", 89.900, "GATES", IMG["courroie"], "Courroie crantée renforcée — kit complet."),
                    _p("MOT-1003", "Pompe à eau", 145.000, "VALEO", IMG["pompe_eau"], "Pompe à eau avec joint d'étanchéité."),
                    _p("MOT-1004", "Filtre à air sport", 32.000, "K&N", IMG["filtre_huile"], "Filtre lavable haute performance."),
                    _p("MOT-1005", "Bougies d'allumage (x4)", 64.000, "NGK", IMG["filtre_huile"], "Set de 4 bougies iridium longue durée."),
                    _p("MOT-1006", "Joint de culasse", 210.000, "ELRING", IMG["moteur_complet"], "Joint multicouche métallique."),
                ],
            },
            {
                "slug": "boite-vitesses",
                "label": "Boîte de vitesses",
                "icon": "gearbox",
                "image": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=500&fit=crop",
                "parts": [
                    _p("BV-2001", "Kit embrayage complet", 420.000, "LUK", IMG["embrayage"], "Disque + mécanisme + butée."),
                    _p("BV-2002", "Volant moteur bi-masse", 680.000, "SACHS", IMG["boite_vitesses"], "Volant bi-masse pour absorption vibrations."),
                    _p("BV-2003", "Câble de commande de vitesses", 95.000, "FEBI", IMG["embrayage"], "Câble de sélection complet."),
                    _p("BV-2004", "Huile boîte 75W-90 (1L)", 38.500, "MOTUL", IMG["filtre_huile"], "Huile synthétique haute pression."),
                ],
            },
            {
                "slug": "transmission",
                "label": "Transmission",
                "icon": "transmission",
                "image": "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800&h=500&fit=crop",
                "parts": [
                    _p("TR-3001", "Cardan complet avant gauche", 285.000, "GKN", IMG["cardan"], "Arbre de transmission avec soufflets."),
                    _p("TR-3002", "Cardan complet avant droit", 285.000, "GKN", IMG["cardan"], "Arbre de transmission avec soufflets."),
                    _p("TR-3003", "Kit soufflet de cardan", 28.000, "FEBI", IMG["cardan"], "Soufflet + collier + graisse."),
                    _p("TR-3004", "Roulement de roue avant", 78.000, "SKF", IMG["amortisseur"], "Roulement haute précision."),
                    _p("TR-3005", "Pneumatique 195/65 R15", 165.000, "MICHELIN", IMG["amortisseur"], "Pneu été haute performance."),
                ],
            },
            {
                "slug": "suspension",
                "label": "Suspension",
                "icon": "suspension",
                "image": "https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?w=800&h=500&fit=crop",
                "parts": [
                    _p("SP-4001", "Amortisseur avant (paire)", 280.000, "BILSTEIN", IMG["amortisseur"], "Amortisseurs gaz haute pression."),
                    _p("SP-4002", "Amortisseur arrière (paire)", 245.000, "BILSTEIN", IMG["amortisseur"], "Amortisseurs gaz haute pression."),
                    _p("SP-4003", "Ressort de suspension avant", 110.000, "KYB", IMG["ressort"], "Ressort hélicoïdal renforcé."),
                    _p("SP-4004", "Rotule de suspension", 45.000, "TRW", IMG["rotule"], "Rotule inférieure de triangle."),
                    _p("SP-4005", "Barre stabilisatrice", 135.000, "FEBI", IMG["rotule"], "Barre antidévers avec biellettes."),
                ],
            },
            {
                "slug": "direction",
                "label": "Direction",
                "icon": "steering",
                "image": "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6c?w=800&h=500&fit=crop",
                "parts": [
                    _p("DR-5001", "Crémaillère de direction", 580.000, "TRW", IMG["cremaillere"], "Crémaillère hydraulique complète."),
                    _p("DR-5002", "Pompe direction assistée", 320.000, "BOSCH", IMG["pompe_eau"], "Pompe hydraulique remanufacturée."),
                    _p("DR-5003", "Biellette de direction", 38.000, "MOOG", IMG["rotule"], "Biellette extérieure avec rotule."),
                    _p("DR-5004", "Colonne de direction", 410.000, "FEBI", IMG["cremaillere"], "Colonne complète avec articulation."),
                ],
            },
            {
                "slug": "freinage",
                "label": "Freinage",
                "icon": "brake",
                "image": "https://images.unsplash.com/photo-1605618313023-d3eb22d92377?w=800&h=500&fit=crop",
                "parts": [
                    _p("FR-6001", "Disques de frein avant (paire)", 165.000, "BREMBO", IMG["disque_frein"], "Disques ventilés haute performance."),
                    _p("FR-6002", "Plaquettes avant", 78.000, "FERODO", IMG["plaquettes"], "Plaquettes céramique faible poussière."),
                    _p("FR-6003", "Disques de frein arrière (paire)", 145.000, "BREMBO", IMG["disque_frein"], "Disques pleins arrière."),
                    _p("FR-6004", "Plaquettes arrière", 62.000, "FERODO", IMG["plaquettes"], "Plaquettes céramique faible poussière."),
                    _p("FR-6005", "Étrier de frein avant", 240.000, "ATE", IMG["etrier"], "Étrier remanufacturé prêt à monter."),
                    _p("FR-6006", "Liquide de frein DOT 4 (1L)", 22.000, "BOSCH", IMG["filtre_huile"], "Liquide haute température."),
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
                "image": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800&h=500&fit=crop",
                "parts": [
                    _p("EL-7001", "Batterie 60Ah 540A", 240.000, "VARTA", IMG["batterie"], "Batterie sans entretien Blue Dynamic."),
                    _p("EL-7002", "Batterie 70Ah 760A", 295.000, "BOSCH", IMG["batterie"], "Batterie longue durée Silver."),
                    _p("EL-7003", "Démarreur 1.2kW", 380.000, "VALEO", IMG["demarreur"], "Démarreur remanufacturé."),
                    _p("EL-7004", "Alternateur 110A", 420.000, "DENSO", IMG["alternateur"], "Alternateur remanufacturé garanti 2 ans."),
                    _p("EL-7005", "Bougie de préchauffage (x4)", 68.000, "NGK", IMG["fusible"], "Set de 4 bougies diesel."),
                ],
            },
            {
                "slug": "eclairage",
                "label": "Éclairage & Signalisation",
                "icon": "headlight",
                "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop",
                "parts": [
                    _p("EL-8001", "Phare avant LED gauche", 480.000, "HELLA", IMG["phare"], "Phare LED avec feu de jour intégré."),
                    _p("EL-8002", "Phare avant LED droit", 480.000, "HELLA", IMG["phare"], "Phare LED avec feu de jour intégré."),
                    _p("EL-8003", "Feu arrière gauche", 145.000, "VALEO", IMG["feu_arriere"], "Feu arrière complet avec ampoules."),
                    _p("EL-8004", "Feu arrière droit", 145.000, "VALEO", IMG["feu_arriere"], "Feu arrière complet avec ampoules."),
                    _p("EL-8005", "Kit ampoules H7 LED", 95.000, "OSRAM", IMG["ampoule"], "Kit ampoules LED 6500K homologuées."),
                    _p("EL-8006", "Antibrouillard avant", 110.000, "HELLA", IMG["phare"], "Antibrouillard halogène universel."),
                ],
            },
            {
                "slug": "faisceaux",
                "label": "Faisceaux & Connectique",
                "icon": "wiring",
                "image": "https://images.unsplash.com/photo-1505845058571-cca538946229?w=800&h=500&fit=crop",
                "parts": [
                    _p("EL-9001", "Kit de fusibles complet", 28.000, "FEBI", IMG["fusible"], "Boîte de 80 fusibles tailles assorties."),
                    _p("EL-9002", "Faisceau avant moteur", 320.000, "DELPHI", IMG["fusible"], "Faisceau électrique compartiment moteur."),
                    _p("EL-9003", "Boîtier de fusibles", 180.000, "BOSCH", IMG["fusible"], "Boîtier complet avec couvercle."),
                    _p("EL-9004", "Sonde lambda", 145.000, "BOSCH", IMG["alternateur"], "Sonde oxygène 4 fils universelle."),
                ],
            },
            {
                "slug": "lavage-essuyage",
                "label": "Lavage & Essuyage",
                "icon": "wiper",
                "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop",
                "parts": [
                    _p("EL-10001", "Balais d'essuie-glace (paire)", 42.000, "BOSCH", IMG["essuie_glace"], "Balais aerotwin nouvelle génération."),
                    _p("EL-10002", "Moteur essuie-glace avant", 195.000, "VALEO", IMG["moteur_essuie"], "Motoreducteur complet."),
                    _p("EL-10003", "Pompe lave-glace", 38.000, "FEBI", IMG["pompe_eau"], "Pompe double sortie avant/arrière."),
                    _p("EL-10004", "Balai essuie-glace arrière", 18.500, "BOSCH", IMG["essuie_glace"], "Balai arrière spécifique."),
                ],
            },
            {
                "slug": "securite",
                "label": "Sécurité & Confort",
                "icon": "alarm",
                "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop",
                "parts": [
                    _p("EL-11001", "Alarme antivol universelle", 240.000, "COBRA", IMG["alarme"], "Alarme avec télécommande et capteur volumétrique."),
                    _p("EL-11002", "Moteur lève-vitre avant", 165.000, "VALEO", IMG["leve_vitre"], "Mécanisme complet avec moteur."),
                    _p("EL-11003", "Centrale clignotants", 35.000, "HELLA", IMG["fusible"], "Relais clignotants électronique."),
                    _p("EL-11004", "Klaxon double tonalité", 48.000, "BOSCH", IMG["alarme"], "Klaxon compact haute puissance."),
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
                "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop",
                "parts": [
                    _p("CR-12001", "Pare-chocs avant", 380.000, "OEM", IMG["pare_choc"], "Pare-chocs apprêté prêt à peindre."),
                    _p("CR-12002", "Capot moteur", 520.000, "OEM", IMG["capot"], "Capot acier galvanisé."),
                    _p("CR-12003", "Aile avant gauche", 165.000, "OEM", IMG["aile"], "Aile en acier avec passage de roue."),
                    _p("CR-12004", "Aile avant droite", 165.000, "OEM", IMG["aile"], "Aile en acier avec passage de roue."),
                    _p("CR-12005", "Calandre chromée", 95.000, "OEM", IMG["calandre"], "Calandre avec logo intégré."),
                    _p("CR-12006", "Pare-brise feuilleté", 420.000, "SAINT-GOBAIN", IMG["pare_brise"], "Pare-brise athermique avec dégivrage."),
                ],
            },
            {
                "slug": "partie-arriere",
                "label": "Partie arrière",
                "icon": "back",
                "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop",
                "parts": [
                    _p("CR-13001", "Pare-chocs arrière", 340.000, "OEM", IMG["pare_choc"], "Pare-chocs apprêté prêt à peindre."),
                    _p("CR-13002", "Hayon arrière", 580.000, "OEM", IMG["capot"], "Hayon complet sans vitre."),
                    _p("CR-13003", "Aile arrière gauche", 195.000, "OEM", IMG["aile"], "Aile arrière en acier."),
                    _p("CR-13004", "Lunette arrière", 280.000, "SAINT-GOBAIN", IMG["pare_brise"], "Vitre arrière chauffante."),
                    _p("CR-13005", "Serrure de hayon", 78.000, "FEBI", IMG["alarme"], "Serrure électrique avec contacteur."),
                ],
            },
            {
                "slug": "portes",
                "label": "Portes & Vitres",
                "icon": "door",
                "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop",
                "parts": [
                    _p("CR-14001", "Porte avant gauche", 480.000, "OEM", IMG["porte"], "Porte complète avec vitre."),
                    _p("CR-14002", "Porte avant droite", 480.000, "OEM", IMG["porte"], "Porte complète avec vitre."),
                    _p("CR-14003", "Vitre de porte avant", 145.000, "SAINT-GOBAIN", IMG["vitre"], "Vitre teintée avec joint."),
                    _p("CR-14004", "Poignée extérieure", 38.000, "FEBI", IMG["alarme"], "Poignée chromée gauche/droite."),
                    _p("CR-14005", "Garniture de porte", 165.000, "OEM", IMG["porte"], "Panneau de porte tissu."),
                ],
            },
            {
                "slug": "retroviseurs",
                "label": "Rétroviseurs",
                "icon": "mirror",
                "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop",
                "parts": [
                    _p("CR-15001", "Rétroviseur extérieur gauche", 195.000, "OEM", IMG["retroviseur"], "Rétroviseur électrique chauffant."),
                    _p("CR-15002", "Rétroviseur extérieur droit", 195.000, "OEM", IMG["retroviseur"], "Rétroviseur électrique chauffant."),
                    _p("CR-15003", "Coque de rétroviseur", 28.000, "OEM", IMG["retroviseur"], "Coque chromée à peindre."),
                    _p("CR-15004", "Verre de rétroviseur", 18.500, "FEBI", IMG["vitre"], "Miroir chauffant universel."),
                    _p("CR-15005", "Rétroviseur intérieur", 45.000, "OEM", IMG["retroviseur"], "Rétroviseur jour/nuit avec capteur."),
                ],
            },
            {
                "slug": "pavillon",
                "label": "Pavillon & Toit",
                "icon": "roof",
                "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop",
                "parts": [
                    _p("CR-16001", "Garniture de pavillon", 240.000, "OEM", IMG["porte"], "Ciel de toit complet en mousse."),
                    _p("CR-16002", "Mécanisme toit ouvrant", 580.000, "OEM", IMG["alarme"], "Mécanisme complet avec moteur."),
                    _p("CR-16003", "Antenne de toit", 38.000, "HIRSCHMANN", IMG["alarme"], "Antenne sharkfin radio/GPS."),
                    _p("CR-16004", "Barres de toit", 165.000, "THULE", IMG["aile"], "Barres aluminium universelles."),
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
