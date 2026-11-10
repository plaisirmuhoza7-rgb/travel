import type { Locale } from "./config";
import type { Category, ServiceItem, Vehicle } from "../seed-data";
import type { ServiceVisual } from "../service-visuals";
import type { AssetSlot } from "../assets";

interface CategoryTranslation {
  name: string;
  description: string;
}

interface ServiceTranslation {
  name: string;
  shortSummary: string;
  fullDescription: string;
}

interface VehicleTranslation {
  name: string;
  subtitle: string;
  description: string;
  transmission?: string;
  fuelType?: string;
  suitableUses: string[];
  includedItems: string[];
  excludedItems: string[];
}

interface ServiceVisualTranslation {
  alt: string;
  badge: string;
  fleetTag: string;
  highlights: string[];
}

interface AssetSlotTranslation {
  title: string;
  alt: string;
  description: string;
}

const FR_CATEGORIES: Record<string, CategoryTranslation> = {
  "cat-suv": {
    name: "SUV Premium",
    description:
      "4x4 et crossovers spacieux à garde au sol élevée, parfaits pour Kigali, les déplacements VIP et les routes panoramiques du Rwanda.",
  },
  "cat-electric": {
    name: "Électrique & Hybride",
    description:
      "SUV électriques, hybrides rechargeables et à prolongation d’autonomie alliant silence feutré et grande autonomie.",
  },
  "cat-executive": {
    name: "Berlines exécutives",
    description:
      "Berlines raffinées et confortables pensées pour vos réunions d’affaires, arrivées à l’aéroport et trajets urbains.",
  },
  "cat-van": {
    name: "Vans & Bus",
    description:
      "Vans de passagers à toit surélevé et minibus Toyota Coaster 28 places pour délégations et groupes familiaux.",
  },
  "cat-wedding": {
    name: "Mariage & VIP",
    description:
      "SUV exécutifs de prestige, berlines et navettes Coaster coordonnées pour les mariages, Gusaba et sommets officiels.",
  },
};

const FR_SERVICES: Record<string, ServiceTranslation> = {
  "srv-car-rental": {
    name: "Location de voiture",
    shortSummary:
      "Location souple à la journée ou sur plusieurs jours à Kigali et partout au Rwanda.",
    fullDescription:
      "Location de véhicules fiables pour déplacements personnels, familiaux ou professionnels au Rwanda. Contrats clairs, entretien vérifié et assistance locale dédiée tout au long de votre séjour.",
  },
  "srv-airport-transfer": {
    name: "Transferts aéroport",
    shortSummary:
      "Arrivées et départs ponctuels à l’aéroport international de Kigali (KGL).",
    fullDescription:
      "Arrivez au Rwanda l’esprit serein. Nous suivons votre vol en direct, prenons en charge vos bagages et assurons un trajet fluide vers votre domicile, hôtel ou réunion à Kigali et en province.",
  },
  "srv-wedding-event": {
    name: "Mariages & Cérémonies",
    shortSummary:
      "Cortèges nuptiaux d’exception et transport des invités pour vos grands événements.",
    fullDescription:
      "Transport coordonné pour les cérémonies traditionnelles Gusaba, mariages civils et réceptions. Associez nos véhicules VIP (V8, TXL, K5) aux spacieux bus Coaster pour vos proches et invités.",
  },
  "srv-group-transport": {
    name: "Vans, Coasters & Groupes",
    shortSummary:
      "Transport coordonné pour délégations, retrouvailles familiales de la diaspora et organisations.",
    fullDescription:
      "Vans de passagers (classe HiAce, Starex) et minibus Toyota Coaster équipés pour transporter confortablement groupes, bagages volumineux et délégations partout au Rwanda.",
  },
  "srv-corporate-transport": {
    name: "Transport d’entreprise & événements",
    shortSummary:
      "Logistique terrestre professionnelle pour conférences, ONG et dirigeants en visite.",
    fullDescription:
      "Logistique de transport terrestre pour sommets à Kigali, missions d’ONG et événements corporate. Protocole soigné, ponctualité stricte et coordination dédiée.",
  },
  "srv-self-drive": {
    name: "Location sans chauffeur",
    shortSummary:
      "Non publié — requiert la confirmation des conditions d’assurance et de conduite par la direction.",
    fullDescription:
      "Option de location en conduite autonome. Maintenue hors ligne jusqu’à validation finale des polices d’assurance, cautions et conditions par la direction.",
  },
  "srv-chauffeur-service": {
    name: "Service chauffeur dédié",
    shortSummary:
      "Non publié — requiert la confirmation des règles tarifaires chauffeur par la direction.",
    fullDescription:
      "Service de chauffeur dédié à la journée. Maintenu hors ligne jusqu’à validation des indemnités journalières et horaires de travail.",
  },
  "srv-tours": {
    name: "Transport touristique régional",
    shortSummary:
      "Non publié — Travel Rwanda ne propose pas de circuits packagés non validés.",
    fullDescription:
      "Transport vers les destinations régionales telles que le lac Kivu, Musanze ou Akagera. Maintenu hors ligne jusqu’à confirmation d’itinéraires précis par la direction.",
  },
};

const FR_VEHICLES: Record<string, VehicleTranslation> = {
  "veh-prado-txl": {
    name: "Toyota Land Cruiser Prado TXL",
    subtitle:
      "4x4 exécutif noir brillant conçu pour les trajets VIP à Kigali, mariages et routes de province",
    description:
      "Présenté dans une finition noir brillant irréprochable, le Land Cruiser Prado TXL allie calandre chromée verticale emblématique, climatisation bizone, trois rangées en cuir et transmission 4x4 permanente. Un grand classique pour les mariages, diplomates et déplacements à travers le Rwanda.",
    transmission: "Automatique (6 vitesses)",
    fuelType: "Diesel (2.8L D-4D 4WD)",
    suitableUses: [
      "Transport exécutif à Kigali",
      "Cortèges de mariage & cérémonies Gusaba",
      "Voyages panoramiques en province",
      "Accueil VIP à l’aéroport de Kigali",
    ],
    includedItems: [
      "Préparation extérieure et intérieure état neuf",
      "Support coordination dispatch 24h/24 et 7j/7",
      "Motricité 4x4 permanente route et montagne",
    ],
    excludedItems: [
      "Carburant (livré avec relevé initial documenté)",
      "Hébergement chauffeur sur trajets provinciaux de plusieurs jours si applicable",
    ],
  },
  "veh-prado-safari": {
    name: "Toyota Land Cruiser Prado 4x4 Expédition",
    subtitle:
      "Land Cruiser 4x4 renforcé à pare-chocs acier conçu pour les parcs nationaux et reliefs exigeants",
    description:
      "Spécialement équipé d’un pare-chocs avant acier haute résistance de type ARB, feux antibrouillard intégrés, barres de toit et pneus tout-terrain renforcés. Conçu pour aborder les pistes d’Akagera, la forêt de Nyungwe et le parc des Volcans en toute confiance.",
    transmission: "Automatique (4x4 gamme courte)",
    fuelType: "Diesel (Turbo 4x4)",
    suitableUses: [
      "Excursions aux parcs Akagera, Volcans & Nyungwe",
      "Missions terrain & ONG en province",
      "Équipes photo & bagages d’expédition",
    ],
    includedItems: [
      "Contrôle de sécurité tout-terrain avant départ",
      "Préparation pneus et suspension renforcée",
      "Ligne d’assistance routière 24h/24 et 7j/7",
    ],
    excludedItems: [
      "Carburant",
      "Droits d’entrée véhicule dans les parcs nationaux",
    ],
  },
  "veh-yangwang-u8": {
    name: "Yangwang U8 Luxe 4x4",
    subtitle:
      "4x4 ultra-luxe phare électrique à prolongation d’autonomie bleu sarcelle Dragonstone pour VIP et mariages",
    description:
      "Le SUV ultra-luxe phare de BYD offre un couple silencieux exceptionnel grâce aux quatre moteurs indépendants e4 et à la suspension hydraulique intelligente DiSus-P. Son éclairage signature Time-Space Portal et son autonomie combinée EREV de 1 000 km subliment sommets officiels et cérémonies VIP.",
    transmission: "Automatique (Quadri-moteur e4 Direct Drive)",
    fuelType: "Électrique à prolongation d’autonomie (EREV)",
    suitableUses: [
      "Protocole diplomatique et chefs d’État",
      "Voiture de tête de luxe pour mariages",
      "Arrivées de sommets exécutifs de haut niveau",
    ],
    includedItems: [
      "Préparation exécutive avec chauffeur",
      "Habitacle ultra-silencieux avec climatisation exécutive",
      "Coordination conciergerie et dispatch dédiée",
    ],
    excludedItems: [
      "Carburant / recharge pour trajets longue distance",
      "Décoration florale personnalisée de mariage (en option)",
    ],
  },
  "veh-byd-seal-u": {
    name: "BYD Seal U SUV Exécutif",
    subtitle:
      "Crossover silencieux et spacieux argent métallisé de la série Ocean pensé pour le confort à Kigali",
    description:
      "Aérodynamisme contemporain et technologie BYD Blade Battery. À bord, les passagers profitent d’un plancher arrière plat offrant un bel espace aux jambes, sellerie similicuir, toit panoramique et un coffre modulable de 425 à 1 440 L idéal pour les valises et trajets quotidiens.",
    transmission: "Automatique mono-rapport",
    fuelType: "Électrique / Hybride rechargeable (DM-i)",
    suitableUses: [
      "Rendez-vous exécutifs silencieux à Kigali",
      "Arrivées à l’aéroport de Kigali (KGL) & transferts hôtels",
      "Mobilité d’entreprise écoresponsable",
    ],
    includedItems: [
      "Préparation esthétique complète intérieure et extérieure",
      "Climatisation automatique bizone",
      "Ligne dispatch directe 24h/24 et 7j/7",
    ],
    excludedItems: [
      "Recharge / carburant au-delà du niveau de remise",
    ],
  },
  "veh-kia-k5": {
    name: "Kia K5 Berline Exécutive",
    subtitle:
      "Berline fastback noire 2025 au profil acéré avec feux LED Star-Map pour affaires & transferts KGL",
    description:
      "Lignes tendues, signature lumineuse Star-Map LED, isolation acoustique soignée et grand coffre rendent la Kia K5 2025 incontournable pour dirigeants, voyageurs solos, couples et escortes de mariage à Kigali.",
    transmission: "Automatique (8 vitesses)",
    fuelType: "Essence",
    suitableUses: [
      "Transferts d’entreprises et ministères à Kigali",
      "Prises en charge rapides à l’aéroport KGL",
      "Cortège du marié et d’honneur",
    ],
    includedItems: [
      "Désinfection et propreté irréprochable de l’habitacle",
      "Climatisation automatique",
      "Coordinateur joignable directement sur WhatsApp",
    ],
    excludedItems: ["Carburant"],
  },
  "veh-kia-sorento-2025": {
    name: "Kia Sorento 2025 Exécutif",
    subtitle:
      "SUV exécutif 3 rangées bleu ardoise nouvelle génération à phares verticaux et jantes noires",
    description:
      "Doté des nouveaux phares quadruples LED verticaux, feux de jour ambrés en T, jantes alliage noires et habitacle modulable 3 rangées offrant jusqu’à 2 085 L de chargement banquette rabattue. Idéal pour dirigeants, mariages et familles.",
    transmission: "Automatique",
    fuelType: "Hybride / Essence",
    suitableUses: [
      "Déplacements hôtels et conférences",
      "Arrivées familiales avec bagages supplémentaires",
      "Cortège de mariage moderne",
    ],
    includedItems: [
      "Inspection mécanique préalable au départ",
      "Intérieur cuir 3 rangées soigné",
      "Assistance permanente à Kigali",
    ],
    excludedItems: ["Carburant"],
  },
  "veh-kia-sorento": {
    name: "Kia Sorento SUV 7 places",
    subtitle:
      "Crossover bleu Pacifique à trois rangées conjuguant confort routier et modularité familiale",
    description:
      "En finition bleu Pacifique avec sa calandre signature, le Kia Sorento accueille confortablement jusqu’à 7 passagers avec climatisation multizone et espace bagages adaptable pour les familles de la diaspora et petits groupes.",
    transmission: "Automatique",
    fuelType: "Diesel / Essence",
    suitableUses: [
      "Familles en visite et groupes de la diaspora",
      "Trajets confort Kigali – lac Kivu",
      "Transferts aéroport avec bagages familiaux",
    ],
    includedItems: [
      "Entretien mécanique régulier",
      "Habitacle propre et climatisation vérifiée",
      "Ligne directe avec le coordinateur",
    ],
    excludedItems: ["Carburant"],
  },
  "veh-hyundai-tucson-horizon": {
    name: "Hyundai Tucson Nouvelle Génération",
    subtitle:
      "Crossover bronze métallisé sculpté avec signature lumineuse LED H-Edge pleine largeur",
    description:
      "Exprimant le design Art of Steel de Hyundai avec une assise élargie, barre lumineuse horizontale et espace accru aux places arrière comme dans le coffre pour vos déplacements quotidiens et trajets en province.",
    transmission: "Automatique",
    fuelType: "Hybride / Électrifié",
    suitableUses: [
      "Mobilité professionnelle urbaine moderne",
      "Trajets quotidiens diplomates & ONG à Kigali",
      "Escapades de week-end au Rwanda",
    ],
    includedItems: [
      "Préparation showroom",
      "Aides à la conduite opérationnelles",
      "Assistance téléphonique dispatch 24/7",
    ],
    excludedItems: ["Carburant / Recharge"],
  },
  "veh-hyundai-tucson": {
    name: "Hyundai Tucson Hybride Rechargeable",
    subtitle:
      "SUV hybride rechargeable bleu nuit HTRAC AWD alliant sobriété silencieuse et adhérence sûre",
    description:
      "Équipé de la transmission intégrale Hyundai HTRAC et de l’efficience hybride rechargeable, ce Tucson bleu nuit assure des trajets électriques silencieux en ville, une tenue de route sereine dans les collines de Kigali et un coffre généreux.",
    transmission: "Automatique (6 vitesses HTRAC AWD)",
    fuelType: "Hybride rechargeable (PHEV)",
    suitableUses: [
      "Courses urbaines et trajets professionnels à Kigali",
      "Arrivées aéroport pour couples et familles",
      "Trajets provinciaux économiques",
    ],
    includedItems: [
      "Révision complète et contrôle freinage",
      "Climatisation intérieure",
      "Interlocuteur d’assistance dédié",
    ],
    excludedItems: ["Carburant / Recharge"],
  },
  "veh-passenger-van-hiace": {
    name: "Van Toyota HiAce Passagers",
    subtitle:
      "Van gris métallisé H200 toit surélevé 14 places conçu pour les délégations et groupes",
    description:
      "Réputé à travers le Rwanda et l’Afrique de l’Est pour son endurance et sa hauteur sous pavillon. Large porte latérale coulissante, vitres panoramiques teintées, 14 places confortables et fiabilité diesel éprouvée.",
    transmission: "Manuelle",
    fuelType: "Diesel",
    suitableUses: [
      "Équipes projet et missions terrain d’ONG",
      "Transferts aéroport de groupes avec bagages",
      "Réunions familiales et regroupements en province",
    ],
    includedItems: [
      "Cabine 14 places nettoyée avec soin",
      "Coordination dispatch habituée aux groupes",
    ],
    excludedItems: [
      "Carburant",
      "Indemnité d’hébergement chauffeur sur déplacements provinciaux de plusieurs jours",
    ],
  },
  "veh-toyota-coaster": {
    name: "Bus Toyota Coaster",
    subtitle:
      "Flotte de minibus exécutifs climatisés 28–30 places pour mariages, conférences et délégations",
    description:
      "Déployés à l’unité ou en convois coordonnés, nos Toyota Coaster blancs offrent climatisation plafonnier, sièges haut dossier confortables, vues panoramiques et soute à bagages spacieuse pour conférences, invités de Gusaba et grandes délégations.",
    transmission: "Manuelle",
    fuelType: "Diesel",
    suitableUses: [
      "Navettes d’invités de mariage (Gusaba & réception)",
      "Navettes de sommets et conférences à Kigali",
      "Excursions institutionnelles et scolaires",
    ],
    includedItems: [
      "Assainissement complet de l’habitacle",
      "Dispatch horaire synchronisé entre les lieux",
    ],
    excludedItems: [
      "Carburant",
      "Frais d’hébergement chauffeur hors Kigali sur plusieurs jours",
    ],
  },
  "veh-land-cruiser-v8": {
    name: "Toyota Land Cruiser V8",
    subtitle: "SUV de prestige pour arrivées VIP et cortèges nuptiaux",
    description:
      "Fiche historique Land Cruiser V8 VIP conservée pour compatibilité avec les demandes antérieures.",
    transmission: "Automatique",
    fuelType: "Essence / Diesel",
    suitableUses: ["Transport VIP et délégations"],
    includedItems: ["Préparation irréprochable du véhicule"],
    excludedItems: ["Carburant"],
  },
  "veh-hyundai-starex": {
    name: "Monospace Hyundai Starex",
    subtitle: "Minivan spacieux pour groupes familiaux",
    description:
      "Fiche historique minivan Hyundai Starex conservée pour compatibilité avec les demandes antérieures.",
    transmission: "Automatique",
    fuelType: "Diesel",
    suitableUses: ["Arrivées de groupes à l’aéroport"],
    includedItems: ["Préparation du véhicule"],
    excludedItems: ["Carburant"],
  },
  "veh-wedding-bridal-fleet": {
    name: "Forfait Cortège Nuptial & Mariage",
    subtitle:
      "Combinaison multi-véhicules sur mesure adaptée aux cérémonies au Rwanda",
    description:
      "Fiche historique de forfait nuptial conservée pour compatibilité avec les demandes antérieures.",
    suitableUses: ["Cérémonies traditionnelles Gusaba"],
    includedItems: ["Coordination dédiée du cortège"],
    excludedItems: ["Compositions florales personnalisées"],
  },
};

const FR_SERVICE_VISUALS: Record<string, ServiceVisualTranslation> = {
  "car-rental": {
    alt: "Remise de clés pour location de voiture devant un SUV noir de luxe à Kigali",
    badge: "Journée & Séjours",
    fleetTag: "SUV · Berlines · 4x4",
    highlights: [
      "Trajets à Kigali et dans tout le pays",
      "Véhicules contrôlés & contrats transparents",
    ],
  },
  "airport-transfer": {
    alt: "Véhicule exécutif prêt pour une prise en charge à l’aéroport international de Kigali",
    badge: "Arrivées KGL 24/7",
    fleetTag: "Vol suivi · Accueil terminal",
    highlights: [
      "Suivi en direct des retards à KGL",
      "Accueil au terminal & gestion bagages",
    ],
  },
  "wedding-event": {
    alt: "Flotte coordonnée de SUV et berlines haut de gamme pour mariages et cérémonies",
    badge: "Flotte nuptiale & VIP",
    fleetTag: "Prado TXL · U8 · K5",
    highlights: [
      "Horaires coordonnés Gusaba & cortège",
      "Navettes Coaster invités en option",
    ],
  },
  "group-transport": {
    alt: "Van Toyota HiAce gris pour déplacements de groupes et familles au Rwanda",
    badge: "Vans groupes & familles",
    fleetTag: "HiAce 14 places · Vans",
    highlights: [
      "Places spacieuses & vaste compartiment bagages",
      "Conçu pour délégations & réunions de famille",
    ],
  },
  "corporate-transport": {
    alt: "Alignement de minibus Toyota Coaster blancs pour conférences et sommets",
    badge: "Sommets & Délégations",
    fleetTag: "Flotte Coaster · Protocole",
    highlights: [
      "Navettes synchronisées entre les sites",
      "Coordinateur dispatch dédié",
    ],
  },
  fallback: {
    alt: "Véhicule de transport terrestre Travel Rwanda",
    badge: "Service de transport",
    fleetTag: "Flotte vérifiée",
    highlights: [
      "Support dispatch 24h/24 et 7j/7",
      "Devis clair avant chaque départ",
    ],
  },
};

const FR_ASSET_SLOTS: Record<string, AssetSlotTranslation> = {
  "brand-logo": {
    title: "Logo officiel de la marque",
    alt: "Travel Rwanda — Services de transport",
    description: "Logo officiel de l’entreprise.",
  },
  "hero-primary-vehicle": {
    title: "Véhicule principal d’accueil",
    alt: "Véhicule de transport premium Travel Rwanda au Rwanda",
    description:
      "Véhicule phare mis en scène dans un décor authentique du Rwanda (Kigali ou collines verdoyantes).",
  },
  "editorial-diaspora": {
    title: "Arrivées diaspora & voyages familiaux",
    alt: "Chauffeur Travel Rwanda accueillant des voyageurs de la diaspora avec leurs bagages devant un van et un SUV",
    description:
      "Illustre la sérénité du retour au Rwanda avec transfert aéroport et trajets familiaux organisés.",
  },
  "editorial-weddings": {
    title: "Cortège mariages & cérémonies",
    alt: "Cortège de transport pour mariage au Rwanda",
    description:
      "Véhicule nuptial ou cortège coordonné pour cérémonies Gusaba et mariages.",
  },
  "editorial-airport": {
    title: "Transfert Aéroport International de Kigali",
    alt: "Accueil transport à l’aéroport international de Kigali (KGL)",
    description:
      "Accueil chaleureux et professionnel et coordination de transfert à l’aéroport.",
  },
  "editorial-about": {
    title: "Opérations & équipe Travel Rwanda",
    alt: "Opérations de flotte Travel Rwanda à Kicukiro, Gahanga",
    description:
      "Présentation des opérations Travel Rwanda basées au Centre de Gahanga, Kicukiro.",
  },
  "service-car-rental": {
    title: "Location de voiture",
    alt: "Remise des clés de location de voiture devant un SUV haut de gamme",
    description: "Image principale du service Location de voiture.",
  },
  "service-airport-transfer": {
    title: "Transferts aéroport",
    alt: "Véhicule exécutif prêt sur la piste pour transfert à l’aéroport de Kigali",
    description: "Image principale du service Transferts aéroport.",
  },
  "service-wedding-event": {
    title: "Mariages & Cérémonies",
    alt: "Alignement de véhicules haut de gamme pour mariages et cérémonies",
    description: "Image principale du service Mariages & Cérémonies.",
  },
  "service-group-transport": {
    title: "Vans, Coasters & Transport de groupe",
    alt: "Van Toyota HiAce gris pour transport de groupe",
    description: "Image principale du service Vans & Transport de groupe.",
  },
  "service-corporate-transport": {
    title: "Transport d’entreprise & événements",
    alt: "Flotte de bus Toyota Coaster blancs pour conférences et entreprises",
    description:
      "Image principale du service Transport d’entreprise & événements.",
  },
  "fleet-txl-main": {
    title: "Toyota Land Cruiser Prado TXL",
    alt: "Toyota Land Cruiser Prado TXL 4x4 VIP noir brillant",
    description:
      "Photo extérieure showroom principale du Toyota Land Cruiser Prado TXL noir brillant.",
  },
  "fleet-prado-safari": {
    title: "Toyota Land Cruiser Prado 4x4 Expédition",
    alt: "Toyota Land Cruiser Prado 4x4 noir équipé de pare-chocs acier et pneus tout-terrain",
    description:
      "Photo extérieure du Toyota Land Cruiser Prado 4x4 version expédition.",
  },
  "fleet-yangwang-u8": {
    title: "Yangwang U8 Luxe 4x4",
    alt: "BYD Yangwang U8 4x4 de luxe bleu sarcelle Dragonstone",
    description:
      "Photo studio extérieure principale du SUV ultra-luxe BYD Yangwang U8.",
  },
  "fleet-byd-seal-u": {
    title: "BYD Seal U SUV Exécutif",
    alt: "SUV crossover exécutif BYD Seal U Ocean-Series argent métallisé",
    description:
      "Photo studio extérieure principale du BYD Seal U argent métallisé.",
  },
  "fleet-kia-k5-main": {
    title: "Kia K5 Berline Exécutive",
    alt: "Berline fastback Kia K5 2025 noire avec feux LED Star-Map",
    description:
      "Photo extérieure principale de la berline exécutive Kia K5 2025 noire.",
  },
  "fleet-kia-sorento-2025": {
    title: "Kia Sorento 2025 Exécutif",
    alt: "Kia Sorento Exécutif 2025 bleu ardoise avec feux de jour ambrés et jantes noires",
    description:
      "Photo extérieure principale du Kia Sorento Exécutif restylé 2025.",
  },
  "fleet-sorento-main": {
    title: "Kia Sorento SUV 7 places",
    alt: "SUV 3 rangées Kia Sorento 7 places bleu Pacifique",
    description:
      "Photo studio extérieure du Kia Sorento 7 places bleu Pacifique.",
  },
  "fleet-tucson-horizon": {
    title: "Hyundai Tucson Nouvelle Génération",
    alt: "SUV Hyundai Tucson nouvelle génération bronze métallisé à éclairage H-Edge",
    description:
      "Photo studio extérieure du Hyundai Tucson Art of Steel nouvelle génération.",
  },
  "fleet-tucson-main": {
    title: "Hyundai Tucson Hybride Rechargeable",
    alt: "SUV Hyundai Tucson Hybride Rechargeable AWD bleu nuit vue trois-quarts arrière",
    description:
      "Photo extérieure du Hyundai Tucson Hybride Rechargeable AWD bleu nuit.",
  },
  "fleet-hiace-main": {
    title: "Van Toyota HiAce Passagers",
    alt: "Van Toyota HiAce H200 toit surélevé 14 places gris métallisé",
    description: "Photo extérieure principale du van Toyota HiAce gris.",
  },
  "fleet-coaster-main": {
    title: "Bus Toyota Coaster",
    alt: "Alignement de minibus blancs Toyota Coaster prêts au départ pour groupes",
    description: "Photo extérieure principale de la flotte de bus Toyota Coaster.",
  },
  "fleet-v8-main": {
    title: "Toyota Land Cruiser V8",
    alt: "Toyota Land Cruiser V8 roulant au Rwanda",
    description: "Emplacement de référence historique pour Land Cruiser V8.",
  },
  "fleet-starex-main": {
    title: "Monospace Hyundai Starex",
    alt: "Monospace de flotte Hyundai Starex",
    description: "Emplacement de référence historique pour Hyundai Starex.",
  },
  "fleet-wedding-bridal": {
    title: "Véhicule de cortège nuptial",
    alt: "Cortège nuptial de mariage",
    description: "Emplacement de référence historique pour cortège nuptial.",
  },
  fallback: {
    title: "Emplacement d’image personnalisé",
    alt: "Véhicule ou service de transport Travel Rwanda",
    description: "Emplacement visuel personnalisé pour photo de la flotte.",
  },
};

export function localizeCategory(cat: Category, locale: Locale): Category {
  if (locale !== "fr") return cat;
  const tr = FR_CATEGORIES[cat.id];
  if (!tr) return cat;
  return {
    ...cat,
    name: tr.name,
    description: tr.description,
  };
}

export function localizeService(
  srv: ServiceItem,
  locale: Locale
): ServiceItem {
  if (locale !== "fr") return srv;
  const tr = FR_SERVICES[srv.id];
  if (!tr) return srv;
  return {
    ...srv,
    name: tr.name,
    shortSummary: tr.shortSummary,
    fullDescription: tr.fullDescription,
  };
}

export function localizeVehicle(v: Vehicle, locale: Locale): Vehicle {
  if (locale !== "fr") return v;
  const tr = FR_VEHICLES[v.id];
  if (!tr) return v;
  return {
    ...v,
    name: tr.name,
    subtitle: tr.subtitle,
    description: tr.description,
    transmission: v.transmission ? tr.transmission ?? v.transmission : null,
    fuelType: v.fuelType ? tr.fuelType ?? v.fuelType : null,
    suitableUses: tr.suitableUses,
    includedItems: tr.includedItems,
    excludedItems: tr.excludedItems,
  };
}

export function localizeServiceVisual(
  visual: ServiceVisual,
  slug: string,
  locale: Locale
): ServiceVisual {
  if (locale !== "fr") return visual;
  const tr = FR_SERVICE_VISUALS[slug] ?? FR_SERVICE_VISUALS.fallback;
  return {
    ...visual,
    alt: tr.alt,
    badge: tr.badge,
    fleetTag: tr.fleetTag,
    highlights: tr.highlights,
  };
}

export function localizeAssetSlot(slot: AssetSlot, locale: Locale): AssetSlot {
  if (locale !== "fr") return slot;
  const tr = FR_ASSET_SLOTS[slot.id] ?? FR_ASSET_SLOTS.fallback;
  return {
    ...slot,
    title: tr.title,
    alt: tr.alt,
    description: tr.description,
  };
}
