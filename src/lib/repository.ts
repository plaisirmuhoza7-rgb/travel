import fs from "fs";
import path from "path";
import {
  Vehicle,
  ServiceItem,
  Category,
  SiteSettings,
  EnquiryRecord,
  StatusHistoryItem,
  EnquiryNoteItem,
  NotificationLogItem,
  DEFAULT_SITE_SETTINGS,
  SEED_CATEGORIES,
  SEED_SERVICES,
  SEED_VEHICLES,
} from "./seed-data";

interface StoreData {
  settings: SiteSettings;
  categories: Category[];
  services: ServiceItem[];
  vehicles: Vehicle[];
  enquiries: EnquiryRecord[];
  statusHistory: StatusHistoryItem[];
  notes: EnquiryNoteItem[];
  notifications: NotificationLogItem[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

function getInitialData(): StoreData {
  return {
    settings: { ...DEFAULT_SITE_SETTINGS },
    categories: [...SEED_CATEGORIES],
    services: [...SEED_SERVICES],
    vehicles: [...SEED_VEHICLES],
    enquiries: [],
    statusHistory: [],
    notes: [],
    notifications: [],
  };
}

function readStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading store file, falling back to memory seed:", error);
    return getInitialData();
  }
}

function writeStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing store file:", error);
  }
}

// Data Access Layer
export const repository = {
  // Settings
  getSettings(): SiteSettings {
    const data = readStore();
    return data.settings || DEFAULT_SITE_SETTINGS;
  },

  updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    const data = readStore();
    data.settings = { ...data.settings, ...newSettings };
    writeStore(data);
    return data.settings;
  },

  // Categories
  getCategories(): Category[] {
    const data = readStore();
    return data.categories.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  // Services
  getServices(onlyEnabled = true): ServiceItem[] {
    const data = readStore();
    if (onlyEnabled) {
      return data.services.filter((s) => s.isEnabled).sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return data.services.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const data = readStore();
    const index = data.services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    data.services[index] = { ...data.services[index], ...updates };
    writeStore(data);
    return data.services[index];
  },

  // Vehicles
  getVehicles(options: { onlyPublished?: boolean; categorySlug?: string; minCapacity?: number } = {}): Vehicle[] {
    const data = readStore();
    let result = data.vehicles.filter((v) => !v.isArchived);

    if (options.onlyPublished) {
      result = result.filter((v) => v.isPublished);
    }

    if (options.categorySlug) {
      const category = data.categories.find((c) => c.slug === options.categorySlug);
      if (category) {
        result = result.filter((v) => v.categoryIds.includes(category.id));
      }
    }

    if (options.minCapacity !== undefined && options.minCapacity > 0) {
      // Crucial rule: Unknown capacity (null) must NOT satisfy a capacity filter
      result = result.filter(
        (v) => v.passengerCapacity !== null && v.passengerCapacity >= options.minCapacity!
      );
    }

    return result;
  },

  getVehicleBySlug(slug: string): Vehicle | null {
    const data = readStore();
    return data.vehicles.find((v) => v.slug === slug && !v.isArchived) || null;
  },

  getVehicleById(id: string): Vehicle | null {
    const data = readStore();
    return data.vehicles.find((v) => v.id === id) || null;
  },

  saveVehicle(vehicle: Vehicle): Vehicle {
    const data = readStore();
    const index = data.vehicles.findIndex((v) => v.id === vehicle.id);
    if (index >= 0) {
      data.vehicles[index] = vehicle;
    } else {
      data.vehicles.push(vehicle);
    }
    writeStore(data);
    return vehicle;
  },

  // Enquiries
  getEnquiries(filter?: { status?: string; search?: string }): EnquiryRecord[] {
    const data = readStore();
    let result = [...data.enquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (filter?.status && filter.status !== "all") {
      result = result.filter((e) => e.status.toLowerCase() === filter.status?.toLowerCase());
    }

    if (filter?.search) {
      const query = filter.search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.referenceCode.toLowerCase().includes(query) ||
          e.customerName.toLowerCase().includes(query) ||
          e.customerEmail.toLowerCase().includes(query) ||
          e.customerPhone.toLowerCase().includes(query)
      );
    }

    return result;
  },

  getEnquiryById(id: string): EnquiryRecord | null {
    const data = readStore();
    return data.enquiries.find((e) => e.id === id) || null;
  },

  getEnquiryByIdempotencyKey(key: string): EnquiryRecord | null {
    const data = readStore();
    return data.enquiries.find((e) => e.idempotencyKey === key) || null;
  },

  createEnquiry(enquiry: EnquiryRecord): EnquiryRecord {
    const data = readStore();
    // Prevent duplicate saves
    const existing = data.enquiries.find((e) => e.idempotencyKey === enquiry.idempotencyKey);
    if (existing) {
      return existing;
    }

    data.enquiries.push(enquiry);

    // Initial Status History
    data.statusHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      enquiryId: enquiry.id,
      previousStatus: "None",
      newStatus: "New",
      changedByEmail: "System / Online Visitor",
      note: "Initial booking request submitted online.",
      createdAt: new Date().toISOString(),
    });

    writeStore(data);
    return enquiry;
  },

  updateEnquiryStatus(
    id: string,
    newStatus: EnquiryRecord["status"],
    changedByEmail: string,
    note: string
  ): EnquiryRecord | null {
    const data = readStore();
    const index = data.enquiries.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const prev = data.enquiries[index].status;
    data.enquiries[index].status = newStatus;
    data.enquiries[index].updatedAt = new Date().toISOString();

    data.statusHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      enquiryId: id,
      previousStatus: prev,
      newStatus,
      changedByEmail,
      note,
      createdAt: new Date().toISOString(),
    });

    writeStore(data);
    return data.enquiries[index];
  },

  assignVehicleToEnquiry(
    id: string,
    vehicleId: string,
    vehicleName: string,
    changedByEmail: string,
    driverName?: string,
    driverPhone?: string,
    note?: string
  ): EnquiryRecord | null {
    const data = readStore();
    const index = data.enquiries.findIndex((e) => e.id === id);
    if (index === -1) return null;

    data.enquiries[index].assignedVehicleId = vehicleId;
    data.enquiries[index].assignedVehicleName = vehicleName;
    if (driverName !== undefined) data.enquiries[index].driverName = driverName;
    if (driverPhone !== undefined) data.enquiries[index].driverPhone = driverPhone;
    data.enquiries[index].updatedAt = new Date().toISOString();

    data.statusHistory.push({
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      enquiryId: id,
      previousStatus: data.enquiries[index].status,
      newStatus: data.enquiries[index].status,
      changedByEmail,
      note: note || `Vehicle assigned: ${vehicleName}${driverName ? ` (Driver: ${driverName})` : ""}`,
      createdAt: new Date().toISOString(),
    });

    writeStore(data);
    return data.enquiries[index];
  },

  updateEnquiry(
    id: string,
    updates: Partial<EnquiryRecord>,
    changedByEmail?: string,
    auditNote?: string
  ): EnquiryRecord | null {
    const data = readStore();
    const index = data.enquiries.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const prevStatus = data.enquiries[index].status;
    data.enquiries[index] = {
      ...data.enquiries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (auditNote && changedByEmail) {
      data.statusHistory.push({
        id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        enquiryId: id,
        previousStatus: prevStatus,
        newStatus: data.enquiries[index].status,
        changedByEmail,
        note: auditNote,
        createdAt: new Date().toISOString(),
      });
    }

    writeStore(data);
    return data.enquiries[index];
  },

  deleteEnquiry(id: string): boolean {
    const data = readStore();
    const index = data.enquiries.findIndex((e) => e.id === id);
    if (index === -1) return false;

    data.enquiries.splice(index, 1);
    data.notes = data.notes.filter((n) => n.enquiryId !== id);
    data.statusHistory = data.statusHistory.filter((h) => h.enquiryId !== id);
    data.notifications = data.notifications.filter((n) => n.enquiryId !== id);

    writeStore(data);
    return true;
  },

  // Notes
  getNotesForEnquiry(enquiryId: string): EnquiryNoteItem[] {
    const data = readStore();
    return data.notes
      .filter((n) => n.enquiryId === enquiryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addNoteToEnquiry(enquiryId: string, authorEmail: string, body: string): EnquiryNoteItem {
    const data = readStore();
    const note: EnquiryNoteItem = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      enquiryId,
      authorEmail,
      body,
      createdAt: new Date().toISOString(),
    };
    data.notes.push(note);
    writeStore(data);
    return note;
  },

  // Status History
  getStatusHistoryForEnquiry(enquiryId: string): StatusHistoryItem[] {
    const data = readStore();
    return data.statusHistory
      .filter((h) => h.enquiryId === enquiryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Notification Logs
  getNotificationLogsForEnquiry(enquiryId: string): NotificationLogItem[] {
    const data = readStore();
    return data.notifications
      .filter((n) => n.enquiryId === enquiryId)
      .sort((a, b) => new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime());
  },

  addNotificationLog(item: Omit<NotificationLogItem, "id">): NotificationLogItem {
    const data = readStore();
    const record: NotificationLogItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...item,
    };
    data.notifications.push(record);
    writeStore(data);
    return record;
  },
};
