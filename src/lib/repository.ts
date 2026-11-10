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
  InvoiceRecord,
  InvoiceLineItem,
  COMPANY_INVOICE_DETAILS,
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
  invoices?: InvoiceRecord[];
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
    invoices: [],
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
    const parsed = JSON.parse(raw);
    if (!parsed.invoices) parsed.invoices = [];
    return parsed;
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

  // Invoices & Billing
  getInvoices(filter?: { status?: string; search?: string }): InvoiceRecord[] {
    const data = readStore();
    let result = [...(data.invoices || [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (filter?.status && filter.status !== "all") {
      result = result.filter((i) => i.status.toLowerCase() === filter.status?.toLowerCase());
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          (i.referenceCode && i.referenceCode.toLowerCase().includes(q)) ||
          i.clientName.toLowerCase().includes(q) ||
          i.clientPhone.toLowerCase().includes(q) ||
          (i.clientEmail && i.clientEmail.toLowerCase().includes(q)) ||
          (i.clientCompany && i.clientCompany.toLowerCase().includes(q)) ||
          (i.vehicleName && i.vehicleName.toLowerCase().includes(q))
      );
    }

    return result;
  },

  getInvoiceById(id: string): InvoiceRecord | null {
    const data = readStore();
    return (data.invoices || []).find((i) => i.id === id) || null;
  },

  getInvoiceByNumber(invoiceNumber: string): InvoiceRecord | null {
    const data = readStore();
    return (data.invoices || []).find((i) => i.invoiceNumber.toLowerCase() === invoiceNumber.toLowerCase()) || null;
  },

  getInvoiceByEnquiryId(enquiryId: string): InvoiceRecord | null {
    const data = readStore();
    return (data.invoices || []).find((i) => i.enquiryId === enquiryId) || null;
  },

  saveInvoice(invoice: InvoiceRecord): InvoiceRecord {
    const data = readStore();
    if (!data.invoices) data.invoices = [];
    const index = data.invoices.findIndex((i) => i.id === invoice.id);
    if (index >= 0) {
      data.invoices[index] = { ...invoice, updatedAt: new Date().toISOString() };
    } else {
      data.invoices.push(invoice);
    }
    writeStore(data);
    return invoice;
  },

  updateInvoice(id: string, updates: Partial<InvoiceRecord>): InvoiceRecord | null {
    const data = readStore();
    if (!data.invoices) data.invoices = [];
    const index = data.invoices.findIndex((i) => i.id === id);
    if (index === -1) return null;

    data.invoices[index] = {
      ...data.invoices[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeStore(data);
    return data.invoices[index];
  },

  deleteInvoice(id: string): boolean {
    const data = readStore();
    if (!data.invoices) return false;
    const index = data.invoices.findIndex((i) => i.id === id);
    if (index === -1) return false;

    data.invoices.splice(index, 1);
    writeStore(data);
    return true;
  },

  generateInvoiceForEnquiry(enquiryId: string, authorEmail = "admin@travelrwanda.rw"): InvoiceRecord | null {
    const data = readStore();
    const enquiry = data.enquiries.find((e) => e.id === enquiryId);
    if (!enquiry) return null;

    if (!data.invoices) data.invoices = [];
    const existing = data.invoices.find((i) => i.enquiryId === enquiryId);
    if (existing) return existing;

    const todayStr = new Date().toISOString().slice(0, 10);
    const dateStamp = todayStr.replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = `INV-${dateStamp}-${randomSuffix}`;

    // Calculate line items based on service and quote
    let quantity = 1;
    if (enquiry.pickupDate && enquiry.returnDate) {
      const p = new Date(enquiry.pickupDate).getTime();
      const r = new Date(enquiry.returnDate).getTime();
      const diff = Math.ceil((r - p) / (1000 * 60 * 60 * 24));
      if (diff > 0) quantity = diff;
    }

    const unitPrice = enquiry.quotedPriceRwf
      ? Math.round(enquiry.quotedPriceRwf / quantity)
      : (enquiry.serviceType === "airport-transfer" ? 40000 : 85000);
    const subtotal = quantity * unitPrice;

    const serviceName = enquiry.serviceType
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const items: InvoiceLineItem[] = [
      {
        id: `item-${Date.now()}-1`,
        description: `${serviceName} - Route: ${enquiry.pickupLocation} to ${enquiry.dropoffLocation || "Kigali Destination"}${
          enquiry.assignedVehicleName ? ` [Vehicle: ${enquiry.assignedVehicleName}]` : ""
        }${enquiry.serviceSpecificData?.flightNumber ? ` (Flight: ${enquiry.serviceSpecificData.flightNumber})` : ""}`,
        quantity,
        unitPriceRwf: unitPrice,
        totalRwf: subtotal,
      },
    ];

    const invoice: InvoiceRecord = {
      id: `inv-${Date.now()}-${randomSuffix.toLowerCase()}`,
      invoiceNumber,
      enquiryId: enquiry.id,
      referenceCode: enquiry.referenceCode,
      issueDate: todayStr,
      dueDate: enquiry.pickupDate || todayStr,
      status: enquiry.status === "Completed" ? "Paid" : enquiry.status === "Confirmed" ? "Issued" : "Draft",
      clientName: enquiry.customerName,
      clientCompany: (enquiry.serviceSpecificData?.organizationName as string) || null,
      clientPhone: enquiry.customerPhone,
      clientEmail: enquiry.customerEmail,
      clientAddress: enquiry.pickupLocation,
      clientTin: null,
      serviceType: enquiry.serviceType,
      pickupLocation: enquiry.pickupLocation,
      dropoffLocation: enquiry.dropoffLocation || null,
      pickupDate: enquiry.pickupDate,
      pickupTime: enquiry.pickupTime,
      returnDate: enquiry.returnDate || null,
      returnTime: enquiry.returnTime || null,
      vehicleName: enquiry.assignedVehicleName || null,
      driverName: enquiry.driverName || null,
      driverPhone: enquiry.driverPhone || null,
      passengerCount: enquiry.passengerCount,
      flightNumber: (enquiry.serviceSpecificData?.flightNumber as string) || null,
      items,
      subtotalRwf: subtotal,
      taxRatePercent: 0,
      taxAmountRwf: 0,
      discountRwf: 0,
      totalRwf: subtotal,
      currency: "RWF",
      bankName: COMPANY_INVOICE_DETAILS.bankName,
      bankAccountNumber: COMPANY_INVOICE_DETAILS.bankAccountNumber,
      bankAccountName: COMPANY_INVOICE_DETAILS.bankAccountName,
      momoMerchantCode: COMPANY_INVOICE_DETAILS.momoMerchantCode,
      paymentMethod: "MTN Mobile Money / Bank Transfer",
      paymentReference: enquiry.referenceCode,
      notes: enquiry.customerNotes || "Official Transport Reservation Voucher & Tax Invoice. Thank you for choosing Travel Rwanda.",
      termsAndConditions: COMPANY_INVOICE_DETAILS.defaultTerms,
      issuedByEmail: authorEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.invoices.push(invoice);
    writeStore(data);
    return invoice;
  },
};
