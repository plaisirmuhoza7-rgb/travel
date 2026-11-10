export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  categoryIds: string[];
  passengerCapacity: number | null; // NULL until owner verifies
  luggageCapacity: number | null; // NULL until owner verifies
  transmission: string | null; // e.g. "Automatic", NULL until verified
  fuelType: string | null; // NULL until verified
  dailyRateRwf: number | null; // NULL -> shows "Request a quote"
  suitableUses: string[];
  confirmedServices: string[];
  includedItems: string[];
  excludedItems: string[];
  primaryAssetSlot: string;
  isPublished: boolean; // Default false for unverified leads
  isFeatured: boolean;
  isArchived: boolean;
  isDemoSample: boolean; // Flagged sample for demonstration
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortSummary: string;
  fullDescription: string;
  isEnabled: boolean;
  requiresOwnerConfirmation: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface SiteSettings {
  brandName: string;
  brandDescriptor: string;
  brandTagline: string;
  corePromise: string;
  locationDisplay: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  contactEmail: string; // Empty until owner verified
  policiesApproved: boolean; // Draft status indicator
  demoModeActive: boolean;
}

export interface EnquiryRecord {
  id: string;
  referenceCode: string; // e.g. TRW-20261105-8F3K
  idempotencyKey: string;
  serviceType: string;
  status: "New" | "Contacted" | "Quoted" | "Confirmed" | "Completed" | "Cancelled";
  pickupLocation: string;
  dropoffLocation?: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string | null;
  returnTime?: string | null;
  passengerCount: number;
  serviceSpecificData: Record<string, any>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredContactMethod: "whatsapp" | "phone" | "email";
  bookingForSomeoneElse: boolean;
  travellerName?: string | null;
  travellerPhone?: string | null;
  customerNotes?: string | null;
  privacyAccepted: boolean;
  createdAt: string; // ISO UTC
  updatedAt: string; // ISO UTC
  assignedVehicleId?: string | null;
  assignedVehicleName?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  quotedPriceRwf?: number | null;
}

export interface StatusHistoryItem {
  id: string;
  enquiryId: string;
  previousStatus: string;
  newStatus: string;
  changedByEmail: string;
  note: string;
  createdAt: string;
}

export interface EnquiryNoteItem {
  id: string;
  enquiryId: string;
  authorEmail: string;
  body: string;
  createdAt: string;
}

export interface NotificationLogItem {
  id: string;
  enquiryId: string;
  recipientType: "staff" | "customer";
  recipientEmail: string;
  status: "sent" | "failed" | "unconfigured";
  errorMessage?: string;
  attemptCount: number;
  lastAttemptAt: string;
}

// Default Verified Settings
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: "Travel Rwanda",
  brandDescriptor: "Transport Services",
  brandTagline: "Travel with Comfort. Travel with Us!",
  corePromise: "Arrive with confidence. Travel in comfort.",
  locationDisplay: "Kicukiro, Gahanga Center, Rwanda",
  phonePrimary: "+250 784 129 579",
  phoneSecondary: "+250 781 782 882",
  whatsappNumber: "250784129579",
  contactEmail: "", // Explicitly unconfigured per instructions
  policiesApproved: false, // Flagged for owner approval
  demoModeActive: true, // For development and demonstration preview
};

// Seed Categories
export const SEED_CATEGORIES: Category[] = [
  {
    id: "cat-suv",
    slug: "premium-suvs",
    name: "Premium SUVs",
    description: "Spacious, high-clearance 4x4s and crossovers suitable for Kigali travel, VIP events, and scenic upcountry roads.",
    sortOrder: 1,
  },
  {
    id: "cat-electric",
    slug: "electric-hybrid",
    name: "Electric & Hybrid",
    description: "Next-generation electric, range-extended, and plug-in hybrid SUVs combining whisper-quiet refinement with range.",
    sortOrder: 2,
  },
  {
    id: "cat-executive",
    slug: "executive-sedans",
    name: "Executive Cars",
    description: "Comfortable, refined sedans tailored for business meetings, airport arrivals, and city navigation.",
    sortOrder: 3,
  },
  {
    id: "cat-van",
    slug: "vans-group",
    name: "Vans & Buses",
    description: "High-roof passenger vans and 28-seater Toyota Coaster minibuses for delegations and family groups.",
    sortOrder: 4,
  },
  {
    id: "cat-wedding",
    slug: "wedding-fleet",
    name: "Wedding & VIP",
    description: "Flagship executive SUVs, sedans, and coordinated Coaster shuttles for Rwandan weddings, Gusaba, and summits.",
    sortOrder: 5,
  },
];

// Seed Services
export const SEED_SERVICES: ServiceItem[] = [
  {
    id: "srv-car-rental",
    slug: "car-rental",
    name: "Car Rental",
    shortSummary: "Flexible daily and multi-day vehicle rental in Kigali and across Rwanda.",
    fullDescription: "Reliable vehicle rental for personal, family, or business travel in Rwanda. Clear agreements, verified maintenance, and dedicated local support throughout your journey.",
    isEnabled: true,
    requiresOwnerConfirmation: false,
    sortOrder: 1,
  },
  {
    id: "srv-airport-transfer",
    slug: "airport-transfer",
    name: "Airport Transfers",
    shortSummary: "Punctual Kigali International Airport (KGL) arrivals and departures.",
    fullDescription: "Arrive in Rwanda with peace of mind. We track your flight, assist with luggage, and ensure direct, comfortable transfer to your residence, hotel, or meeting in Kigali or upcountry.",
    isEnabled: true,
    requiresOwnerConfirmation: false,
    sortOrder: 2,
  },
  {
    id: "srv-wedding-event",
    slug: "wedding-event",
    name: "Weddings & Ceremonies",
    shortSummary: "Distinguished bridal convoys and guest transport for life’s important celebrations.",
    fullDescription: "Coordinated transport for traditional Gusaba, civil weddings, and receptions. Combine VIP bridal vehicles (V8, TXL, K5) with spacious coaster buses for family and wedding guests.",
    isEnabled: true,
    requiresOwnerConfirmation: false,
    sortOrder: 3,
  },
  {
    id: "srv-group-transport",
    slug: "group-transport",
    name: "Vans, Coasters & Group Transport",
    shortSummary: "Coordinated transport for delegations, diaspora family reunions, and organisations.",
    fullDescription: "Passenger vans (HiAce class, Starex) and Toyota Coaster minibuses equipped to transport groups, large luggage volumes, and organizational delegations across Rwanda.",
    isEnabled: true,
    requiresOwnerConfirmation: false,
    sortOrder: 4,
  },
  {
    id: "srv-corporate-transport",
    slug: "corporate-transport",
    name: "Corporate & Event Transport",
    shortSummary: "Professional ground logistics for conferences, NGOs, and visiting executives.",
    fullDescription: "Ground transport logistics for Kigali summits, NGO missions, and corporate events. Professional protocol, punctual scheduling, and dedicated coordinator support.",
    isEnabled: true,
    requiresOwnerConfirmation: false,
    sortOrder: 5,
  },
  // Unpublished until confirmed by owner
  {
    id: "srv-self-drive",
    slug: "self-drive",
    name: "Self-Drive Rental",
    shortSummary: "Unpublished — requires owner confirmation of insurance terms and driver requirements.",
    fullDescription: "Self-drive rental option. Kept unpublished until insurance policies, security deposits, and age requirements are verified by the business owner.",
    isEnabled: false,
    requiresOwnerConfirmation: true,
    sortOrder: 6,
  },
  {
    id: "srv-chauffeur-service",
    slug: "chauffeur-service",
    name: "Dedicated Chauffeur Service",
    shortSummary: "Unpublished — requires owner confirmation of driver pricing rules.",
    fullDescription: "Professional dedicated driver service for daily hire. Kept unpublished until driver daily allowances and working hours are verified.",
    isEnabled: false,
    requiresOwnerConfirmation: true,
    sortOrder: 7,
  },
  {
    id: "srv-tours",
    slug: "regional-tours",
    name: "Scenic Regional Transport",
    shortSummary: "Unpublished — Travel Rwanda does not offer invented tour packages.",
    fullDescription: "Transport to regional destinations like Lake Kivu, Musanze, or Akagera. Kept unpublished until specific itineraries are confirmed by the owner.",
    isEnabled: false,
    requiresOwnerConfirmation: true,
    sortOrder: 8,
  },
];

// Seed Vehicles (Verified Real Fleet Photos)
export const SEED_VEHICLES: Vehicle[] = [
  {
    id: "veh-prado-txl",
    slug: "toyota-land-cruiser-prado-txl",
    name: "Toyota Land Cruiser Prado TXL",
    subtitle: "Gloss black executive 4x4 tailored for Kigali VIP travel, weddings & provincial routes",
    description: "Presented in gloss black showroom condition, the Land Cruiser Prado TXL pairs a distinctive vertical chrome grille, dual-zone climate comfort, three-row leather seating, and dependable full-time 4WD. A signature favourite for weddings, diplomats, and upcountry Rwanda journeys.",
    categoryIds: ["cat-suv", "cat-wedding"],
    passengerCapacity: 7,
    luggageCapacity: 4,
    transmission: "Automatic (6-Speed)",
    fuelType: "Diesel (2.8L D-4D 4WD)",
    dailyRateRwf: null,
    suitableUses: ["Executive city transport", "Wedding & Gusaba bridal convoys", "Scenic upcountry travel", "VIP Kigali Airport pickup"],
    confirmedServices: ["car-rental", "wedding-event", "airport-transfer", "corporate-transport"],
    includedItems: ["Showroom exterior & interior preparation", "24/7 dispatch coordinator support", "Full-time 4WD mountain & highway readiness"],
    excludedItems: ["Fuel (supplied with documented initial reading)", "Chauffeur accommodation on multi-day upcountry stays if selected"],
    primaryAssetSlot: "fleet-txl-main",
    isPublished: true,
    isFeatured: true,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-prado-safari",
    slug: "toyota-land-cruiser-prado-expedition",
    name: "Toyota Land Cruiser Prado 4x4 Expedition",
    subtitle: "Steel-bumper 4x4 expedition Land Cruiser built for national parks and steep terrain",
    description: "Specially outfitted with a heavy-duty ARB-style steel front protection bumper, integrated fog lights, roof rails, and rugged mud-terrain tires. Engineered to tackle Akagera tracks, Nyungwe Forest hills, and Volcanoes National Park roads with complete confidence.",
    categoryIds: ["cat-suv"],
    passengerCapacity: 7,
    luggageCapacity: 5,
    transmission: "Automatic (4x4 Low-Range)",
    fuelType: "Diesel (Turbo 4x4)",
    dailyRateRwf: null,
    suitableUses: ["Akagera, Volcanoes & Nyungwe park trips", "Field & NGO upcountry missions", "Group photography & expedition luggage"],
    confirmedServices: ["car-rental", "airport-transfer", "corporate-transport"],
    includedItems: ["Pre-trip off-road safety inspection", "Heavy-duty tire & suspension prep", "24/7 roadside assistance line"],
    excludedItems: ["Fuel", "National park vehicle entry permits"],
    primaryAssetSlot: "fleet-prado-safari",
    isPublished: true,
    isFeatured: false,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-yangwang-u8",
    slug: "yangwang-u8-luxury-4x4",
    name: "Yangwang U8 Luxury 4x4",
    subtitle: "Ultra-luxury flagship range-extended electric 4x4 in Dragonstone Teal for VIP & bridal arrivals",
    description: "BYD's flagship ultra-luxury SUV delivers effortless silent torque via the e4 quad-motor independent wheel-drive system and DiSus-P intelligent hydraulic body control suspension. Pair signature Time-Space Portal LED prestige with 1,000 km combined EREV range for high-profile summits and VIP ceremonies.",
    categoryIds: ["cat-suv", "cat-electric", "cat-wedding"],
    passengerCapacity: 5,
    luggageCapacity: 4,
    transmission: "Automatic (e4 Quad-Motor Direct Drive)",
    fuelType: "Range-Extended Electric (EREV)",
    dailyRateRwf: null,
    suitableUses: ["Heads-of-state & diplomatic VIP protocol", "Signature luxury bridal lead vehicle", "High-profile executive summit arrivals"],
    confirmedServices: ["car-rental", "wedding-event", "corporate-transport", "airport-transfer"],
    includedItems: ["Chauffeur-ready executive preparation", "Whisper-quiet cabin with executive climate control", "Dedicated concierge dispatch coordination"],
    excludedItems: ["Fuel / Charging for extended regional range", "Custom floral wedding ribbon dressing (optional)"],
    primaryAssetSlot: "fleet-yangwang-u8",
    isPublished: true,
    isFeatured: true,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-byd-seal-u",
    slug: "byd-seal-u-executive-suv",
    name: "BYD Seal U Executive SUV",
    subtitle: "Quiet, spacious silver metallic Ocean-Series crossover built for Kigali comfort",
    description: "Clean modern aerodynamics paired with BYD Blade Battery refinement. Inside, passengers enjoy a flat rear cabin floor for generous legroom, vegan leather comfort, panoramic sunroof, and a practical 425L–1,440L cargo bay for airport suitcases and daily Kigali travel.",
    categoryIds: ["cat-suv", "cat-electric", "cat-executive"],
    passengerCapacity: 5,
    luggageCapacity: 4,
    transmission: "Single-Speed Automatic",
    fuelType: "Electric / Plug-in Hybrid (DM-i)",
    dailyRateRwf: null,
    suitableUses: ["Silent urban Kigali executive meetings", "Kigali Airport (KGL) arrivals & hotel transfers", "Eco-conscious corporate mobility"],
    confirmedServices: ["car-rental", "airport-transfer", "corporate-transport"],
    includedItems: ["Full interior & exterior detailing", "Dual-zone cabin air conditioning", "24/7 dispatch line"],
    excludedItems: ["Charging / Fuel beyond handover level"],
    primaryAssetSlot: "fleet-byd-seal-u",
    isPublished: true,
    isFeatured: false,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-kia-k5",
    slug: "kia-k5-executive-sedan",
    name: "Kia K5 Executive Sedan",
    subtitle: "Sleek black 2025 fastback sedan with Star-Map LED styling for business & KGL transfers",
    description: "Sharp architectural proportions, signature Star-Map LED daytime lighting, acoustic cabin insulation, and a generous 15.6 cu. ft. trunk make the 2025 Kia K5 the premier choice for executives, solo travellers, couples, and bridal escort duties across Kigali.",
    categoryIds: ["cat-executive", "cat-wedding"],
    passengerCapacity: 5,
    luggageCapacity: 3,
    transmission: "Automatic (8-Speed)",
    fuelType: "Petrol",
    dailyRateRwf: null,
    suitableUses: ["Kigali corporate & ministry transfers", "Speedy KGL Airport pickups", "Groom & bridal party escort"],
    confirmedServices: ["car-rental", "airport-transfer", "corporate-transport", "wedding-event"],
    includedItems: ["Spotless cabin sanitization", "Automatic climate control", "Direct WhatsApp dispatch coordinator"],
    excludedItems: ["Fuel"],
    primaryAssetSlot: "fleet-kia-k5-main",
    isPublished: true,
    isFeatured: true,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-kia-sorento-2025",
    slug: "kia-sorento-2025-executive",
    name: "Kia Sorento 2025 Executive",
    subtitle: "Updated slate-blue three-row executive SUV featuring Star-Map lighting & black alloy wheels",
    description: "Refreshed with bold vertical quad-LED headlights, amber T-bar daytime signatures, black alloy wheels, and a versatile three-row cabin with up to 2,085L expandable storage when rear seats fold. Built for visiting executives, weddings, and family comfort.",
    categoryIds: ["cat-suv", "cat-wedding"],
    passengerCapacity: 7,
    luggageCapacity: 4,
    transmission: "Automatic",
    fuelType: "Hybrid / Petrol",
    dailyRateRwf: null,
    suitableUses: ["Executive hotel & conference mobility", "Family arrivals with extra suitcases", "Modern wedding escort convoy"],
    confirmedServices: ["car-rental", "airport-transfer", "wedding-event", "corporate-transport"],
    includedItems: ["Pre-dispatch mechanical inspection", "Clean three-row leather interior", "On-call Kigali assistance"],
    excludedItems: ["Fuel"],
    primaryAssetSlot: "fleet-kia-sorento-2025",
    isPublished: true,
    isFeatured: false,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-kia-sorento",
    slug: "kia-sorento",
    name: "Kia Sorento 7-Seater SUV",
    subtitle: "Pacific Blue three-row crossover balancing highway comfort with flexible family space",
    description: "Finished in Pacific Blue with signature tiger-nose grille detailing, the Kia Sorento seats up to 7 passengers smoothly with multi-zone cabin cooling and adaptable luggage space for diaspora families and small groups visiting Rwanda.",
    categoryIds: ["cat-suv"],
    passengerCapacity: 7,
    luggageCapacity: 3,
    transmission: "Automatic",
    fuelType: "Diesel / Petrol",
    dailyRateRwf: null,
    suitableUses: ["Visiting family & diaspora group rides", "Kigali to Lake Kivu highway comfort", "Airport transfers with family luggage"],
    confirmedServices: ["car-rental", "airport-transfer", "group-transport"],
    includedItems: ["Routine mechanical servicing", "Clean cabin & cold AC check", "Direct coordinator phone line"],
    excludedItems: ["Fuel"],
    primaryAssetSlot: "fleet-sorento-main",
    isPublished: true,
    isFeatured: false,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-hyundai-tucson-horizon",
    slug: "hyundai-tucson-next-gen",
    name: "Hyundai Tucson Next-Gen",
    subtitle: "Architectural metallic-bronze crossover featuring full-width H-Edge LED lighting",
    description: "Showcasing Hyundai's sculpted Art of Steel design language with a wider stance, clamshell hood, indirect full-width horizontal LED bar, and expanded rear legroom and cargo volume for refined daily commuting and regional highway trips.",
    categoryIds: ["cat-suv", "cat-electric"],
    passengerCapacity: 5,
    luggageCapacity: 4,
    transmission: "Automatic",
    fuelType: "Hybrid / Electrified",
    dailyRateRwf: null,
    suitableUses: ["Modern urban business mobility", "Diplomatic & NGO Kigali commutes", "Weekend trips across Rwanda"],
    confirmedServices: ["car-rental", "airport-transfer", "corporate-transport"],
    includedItems: ["Showroom preparation", "Digital driver assistance readiness", "24/7 dispatch helpline"],
    excludedItems: ["Fuel / Charging"],
    primaryAssetSlot: "fleet-tucson-horizon",
    isPublished: true,
    isFeatured: false,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-hyundai-tucson",
    slug: "hyundai-tucson",
    name: "Hyundai Tucson Plug-in Hybrid",
    subtitle: "Dark navy HTRAC AWD plug-in hybrid SUV combining quiet efficiency with confident grip",
    description: "Equipped with Hyundai HTRAC all-wheel drive and plug-in hybrid efficiency, the dark navy Tucson delivers smooth urban electric cruising, agile handling through Kigali's hills, parametric taillight styling, and generous suitcase capacity.",
    categoryIds: ["cat-suv", "cat-electric"],
    passengerCapacity: 5,
    luggageCapacity: 3,
    transmission: "Automatic (6-Speed HTRAC AWD)",
    fuelType: "Plug-in Hybrid (PHEV)",
    dailyRateRwf: null,
    suitableUses: ["Daily Kigali errands & office commutes", "Airport arrivals for couples & families", "Efficient provincial highway trips"],
    confirmedServices: ["car-rental", "airport-transfer"],
    includedItems: ["Full servicing & brake check", "Interior air conditioning", "Dedicated support contact"],
    excludedItems: ["Fuel / Charging"],
    primaryAssetSlot: "fleet-tucson-main",
    isPublished: true,
    isFeatured: false,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-passenger-van-hiace",
    slug: "passenger-van-hiace-class",
    name: "Toyota HiAce Passenger Van",
    subtitle: "Silver H200 high-roof 14-seater commuter van engineered for group delegations",
    description: "Trusted across Rwanda and East Africa for unmatched stamina and spacious headroom. Features wide sliding door access, privacy-tinted panoramic windows, seating for 14 passengers, and dependable diesel endurance for delegations and family groups.",
    categoryIds: ["cat-van"],
    passengerCapacity: 14,
    luggageCapacity: 8,
    transmission: "Manual",
    fuelType: "Diesel",
    dailyRateRwf: null,
    suitableUses: ["Project teams & NGO field groups", "Airport group luggage transfers", "Upcountry church & family gatherings"],
    confirmedServices: ["group-transport", "wedding-event", "airport-transfer"],
    includedItems: ["Cleaned 14-seat passenger cabin", "Experienced group dispatch coordination"],
    excludedItems: ["Fuel", "Driver overnight allowance on multi-day upcountry trips"],
    primaryAssetSlot: "fleet-hiace-main",
    isPublished: true,
    isFeatured: false,
    isArchived: false,
    isDemoSample: false,
  },
  {
    id: "veh-toyota-coaster",
    slug: "toyota-coaster-bus",
    name: "Toyota Coaster Bus",
    subtitle: "Air-conditioned 28–30 seater executive minibus fleet for weddings, conferences & delegations",
    description: "Deployed individually or in matched multi-bus convoys, our white Toyota Coaster fleet offers overhead air conditioning, comfortable high-back seats, panoramic views, and spacious luggage storage for Kigali conferences, Gusaba guests, and large delegations.",
    categoryIds: ["cat-van", "cat-wedding"],
    passengerCapacity: 28,
    luggageCapacity: 15,
    transmission: "Manual",
    fuelType: "Diesel",
    dailyRateRwf: null,
    suitableUses: ["Wedding guest shuttles (Gusaba & reception)", "Summit & conference delegate shuttles", "Institutional & school excursions"],
    confirmedServices: ["wedding-event", "group-transport", "corporate-transport"],
    includedItems: ["Full interior sanitization", "Synchronized route & venue timing dispatch"],
    excludedItems: ["Fuel", "Multi-day driver overnight stipend outside Kigali"],
    primaryAssetSlot: "fleet-coaster-main",
    isPublished: true,
    isFeatured: true,
    isArchived: false,
    isDemoSample: false,
  },
  // Archived legacy entries preserved only so historical enquiry IDs resolve safely
  {
    id: "veh-land-cruiser-v8",
    slug: "toyota-land-cruiser-v8",
    name: "Toyota Land Cruiser V8",
    subtitle: "Flagship prestige SUV for VIP arrivals and bridal convoys",
    description: "Legacy VIP Land Cruiser V8 record kept for existing enquiry compatibility.",
    categoryIds: ["cat-suv", "cat-wedding"],
    passengerCapacity: 7,
    luggageCapacity: 5,
    transmission: "Automatic",
    fuelType: "Petrol / Diesel",
    dailyRateRwf: null,
    suitableUses: ["VIP and delegation transport"],
    confirmedServices: ["car-rental", "wedding-event"],
    includedItems: ["Spotless vehicle preparation"],
    excludedItems: ["Fuel"],
    primaryAssetSlot: "fleet-v8-main",
    isPublished: false,
    isFeatured: false,
    isArchived: true,
    isDemoSample: true,
  },
  {
    id: "veh-hyundai-starex",
    slug: "hyundai-starex-passenger-van",
    name: "Hyundai Starex Passenger Van",
    subtitle: "Spacious passenger minivan for family groups",
    description: "Legacy passenger minivan record kept for existing enquiry compatibility.",
    categoryIds: ["cat-van"],
    passengerCapacity: 9,
    luggageCapacity: 6,
    transmission: "Automatic",
    fuelType: "Diesel",
    dailyRateRwf: null,
    suitableUses: ["Airport group arrivals"],
    confirmedServices: ["group-transport", "airport-transfer"],
    includedItems: ["Vehicle preparation"],
    excludedItems: ["Fuel"],
    primaryAssetSlot: "fleet-starex-main",
    isPublished: false,
    isFeatured: false,
    isArchived: true,
    isDemoSample: true,
  },
  {
    id: "veh-wedding-bridal-fleet",
    slug: "wedding-bridal-convoy-package",
    name: "Wedding & Bridal Convoy Package",
    subtitle: "Curated multi-vehicle combination tailored for ceremonies in Rwanda",
    description: "Legacy bridal package record kept for existing enquiry compatibility.",
    categoryIds: ["cat-wedding"],
    passengerCapacity: null,
    luggageCapacity: null,
    transmission: null,
    fuelType: null,
    dailyRateRwf: null,
    suitableUses: ["Traditional Gusaba ceremonies"],
    confirmedServices: ["wedding-event"],
    includedItems: ["Custom convoy coordination"],
    excludedItems: ["Custom flower arrangements"],
    primaryAssetSlot: "fleet-wedding-bridal",
    isPublished: false,
    isFeatured: false,
    isArchived: true,
    isDemoSample: true,
  },
];
