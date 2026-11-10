"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EnquiryRecord, Vehicle, ServiceItem } from "@/lib/seed-data";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { getServiceLabelBySlug } from "@/lib/i18n";
import { localizeService, localizeVehicle } from "@/lib/i18n/catalog";
import {
  Car,
  Plane,
  Users,
  Sparkles,
  Clock,
  Calendar,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Search,
  Plus,
  Download,
  UserCheck,
  Briefcase,
  Copy,
  RefreshCw,
  X,
  LayoutGrid,
  List,
  Columns3,
  CalendarDays,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface Props {
  initialEnquiries: EnquiryRecord[];
  vehicles: Vehicle[];
  services: ServiceItem[];
  adminEmail: string;
}

type ViewMode = "cards" | "table" | "kanban" | "schedule";

export function AdminBookingsDashboard({
  initialEnquiries,
  vehicles,
  services,
}: Props) {
  const router = useRouter();
  const { locale, dict } = useI18n();
  const db = dict.admin.bookingsDashboard;
  const ed = dict.admin.enquiryDetailClient;
  const dateLocale = locale === "fr" ? "fr-FR" : "en-US";

  const getDisplayVehicleName = useCallback(
    (rawName?: string | null) => {
      if (!rawName) return "";
      const matched = vehicles.find((v) => v.name === rawName);
      return matched ? localizeVehicle(matched, locale).name : rawName;
    },
    [vehicles, locale]
  );

  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(initialEnquiries);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"pickupAsc" | "pickupDesc" | "createdDesc" | "passengers">("pickupAsc");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [assigningEnquiry, setAssigningEnquiry] = useState<EnquiryRecord | null>(null);
  const [quickNoteEnquiry, setQuickNoteEnquiry] = useState<EnquiryRecord | null>(null);

  // Assign modal state
  const [assignVehicleId, setAssignVehicleId] = useState("");
  const [assignVehicleName, setAssignVehicleName] = useState("");
  const [assignDriverName, setAssignDriverName] = useState("");
  const [assignDriverPhone, setAssignDriverPhone] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Quick note modal state
  const [quickNoteText, setQuickNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // New Booking Modal Form
  const [newBookingData, setNewBookingData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    preferredContactMethod: "whatsapp" as "whatsapp" | "phone" | "email",
    serviceType: "car-rental",
    pickupLocation: db.newBookingModal.defaultPickupLocation,
    dropoffLocation: "",
    pickupDate: new Date().toISOString().slice(0, 10),
    pickupTime: "10:00",
    returnDate: "",
    returnTime: "10:00",
    passengerCount: 1,
    assignedVehicleName: "",
    driverName: "",
    driverPhone: "",
    quotedPriceRwf: "",
    flightNumber: "",
    customerNotes: "",
    bookingForSomeoneElse: false,
    travellerName: "",
    travellerPhone: "",
  });
  const [isSubmittingNewBooking, setIsSubmittingNewBooking] = useState(false);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Status Colors & Badges
  const getStatusBadge = (status: EnquiryRecord["status"]) => {
    switch (status) {
      case "New":
        return {
          bg: "bg-yellow-100 text-yellow-950 border-yellow-400",
          dot: "bg-[#FACC15]",
          label: db.statuses.NewBadge,
        };
      case "Contacted":
        return {
          bg: "bg-sky-100 text-sky-900 border-sky-300",
          dot: "bg-sky-500",
          label: db.statuses.Contacted,
        };
      case "Quoted":
        return {
          bg: "bg-purple-100 text-purple-900 border-purple-300",
          dot: "bg-purple-500",
          label: db.statuses.Quoted,
        };
      case "Confirmed":
        return {
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          dot: "bg-emerald-600",
          label: db.statuses.Confirmed,
        };
      case "Completed":
        return {
          bg: "bg-gray-100 text-gray-800 border-gray-300",
          dot: "bg-gray-400",
          label: db.statuses.Completed,
        };
      case "Cancelled":
        return {
          bg: "bg-rose-100 text-rose-900 border-rose-300",
          dot: "bg-rose-500",
          label: db.statuses.Cancelled,
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-800 border-gray-300",
          dot: "bg-gray-400",
          label: status,
        };
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "airport-transfer":
        return <Plane className="h-4 w-4 text-sky-700" />;
      case "wedding-event":
        return <Sparkles className="h-4 w-4 text-purple-700" />;
      case "group-transport":
        return <Users className="h-4 w-4 text-emerald-700" />;
      case "corporate-transport":
        return <Briefcase className="h-4 w-4 text-blue-700" />;
      case "car-rental":
      default:
        return <Car className="h-4 w-4 text-[#0B3D2E]" />;
    }
  };

  const getServiceName = (serviceType: string) => {
    const s = services.find((srv) => srv.slug === serviceType || srv.id === serviceType);
    if (s) return localizeService(s, locale).name;
    return getServiceLabelBySlug(serviceType, dict);
  };

  // Date Proximity Badge
  const getProximityBadge = (dateStr: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    if (dateStr === today) {
      return (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-800 animate-pulse border border-red-200">
          {db.proximity.today}
        </span>
      );
    }
    if (dateStr === tomorrow) {
      return (
        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-900 border border-yellow-300">
          {db.proximity.tomorrow}
        </span>
      );
    }
    if (dateStr < today) {
      return (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 border border-gray-200">
          {db.proximity.past}
        </span>
      );
    }

    const diffDays = Math.ceil((new Date(dateStr).getTime() - new Date(today).getTime()) / 86400000);
    return (
      <span className="rounded-full bg-[#0B3D2E]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0B3D2E] border border-[#0B3D2E]/20">
        {db.proximity.inDaysPrefix}{diffDays}{db.proximity.inDaysSuffix}
      </span>
    );
  };

  // Status Change Handler
  const handleQuickStatusChange = async (enquiryId: string, newStatus: EnquiryRecord["status"]) => {
    try {
      const statusLabel = (db.statuses as Record<string, string>)[newStatus] || newStatus;
      const res = await fetch(`/api/admin/enquiries/${enquiryId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: `${db.quickStatusNotePrefix}${statusLabel}${db.quickStatusNoteSuffix}`,
          locale,
        }),
      });

      if (!res.ok) throw new Error(ed.failedUpdateStatus);

      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
      showToast(`${db.statusUpdatedPrefix}${statusLabel}`);
      router.refresh();
    } catch (err: any) {
      alert(db.errorUpdatingStatus + err.message);
    }
  };

  // Assign Vehicle Handler
  const handleAssignVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningEnquiry || !assignVehicleName) return;

    setIsAssigning(true);
    try {
      const displayVehicleName = getDisplayVehicleName(assignVehicleName);
      const res = await fetch(`/api/admin/enquiries/${assigningEnquiry.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: assignVehicleId,
          vehicleName: assignVehicleName,
          driverName: assignDriverName,
          driverPhone: assignDriverPhone,
          note: `${db.assignNotePrefix}${displayVehicleName}${assignDriverName ? ` (${db.assignNoteDriverPrefix}${assignDriverName})` : ""}`,
          locale,
        }),
      });

      if (!res.ok) throw new Error(ed.failedAssignVehicle);

      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === assigningEnquiry.id
            ? {
                ...e,
                assignedVehicleId: assignVehicleId,
                assignedVehicleName: assignVehicleName,
                driverName: assignDriverName || e.driverName,
                driverPhone: assignDriverPhone || e.driverPhone,
              }
            : e
        )
      );

      showToast(`${db.assignedToastPrefix}${displayVehicleName}${db.assignedToastMid}${assigningEnquiry.referenceCode}`);
      setAssigningEnquiry(null);
      router.refresh();
    } catch (err: any) {
      alert(db.errorGeneric + err.message);
    } finally {
      setIsAssigning(false);
    }
  };

  // Quick Note Handler
  const handleQuickNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteEnquiry || !quickNoteText.trim()) return;

    setIsSubmittingNote(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${quickNoteEnquiry.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: quickNoteText.trim(), locale }),
      });

      if (!res.ok) throw new Error(ed.failedAddNote);

      showToast(`${db.noteAddedPrefix}${quickNoteEnquiry.referenceCode}`);
      setQuickNoteEnquiry(null);
      setQuickNoteText("");
    } catch (err: any) {
      alert(db.errorGeneric + err.message);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Create Manual Booking Handler
  const handleCreateNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNewBooking(true);

    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: newBookingData.customerName,
          customerPhone: newBookingData.customerPhone,
          customerEmail: newBookingData.customerEmail,
          preferredContactMethod: newBookingData.preferredContactMethod,
          serviceType: newBookingData.serviceType,
          pickupLocation: newBookingData.pickupLocation,
          dropoffLocation: newBookingData.dropoffLocation,
          pickupDate: newBookingData.pickupDate,
          pickupTime: newBookingData.pickupTime,
          returnDate: newBookingData.returnDate || null,
          returnTime: newBookingData.returnTime || null,
          passengerCount: newBookingData.passengerCount,
          assignedVehicleName: newBookingData.assignedVehicleName || null,
          driverName: newBookingData.driverName || null,
          driverPhone: newBookingData.driverPhone || null,
          quotedPriceRwf: newBookingData.quotedPriceRwf || null,
          serviceSpecificData: {
            flightNumber: newBookingData.flightNumber || undefined,
          },
          customerNotes: newBookingData.customerNotes || null,
          bookingForSomeoneElse: newBookingData.bookingForSomeoneElse,
          travellerName: newBookingData.travellerName || null,
          travellerPhone: newBookingData.travellerPhone || null,
          status: "Confirmed",
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || dict.admin.apiErrors.failedCreateBooking);

      setEnquiries((prev) => [data.enquiry, ...prev]);
      showToast(`${db.newBookingCreatedPrefix}${data.enquiry.referenceCode}`);
      setIsNewBookingModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(db.errorCreatingBooking + err.message);
    } finally {
      setIsSubmittingNewBooking(false);
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = db.csvHeaders;

    const rows = filteredEnquiries.map((e) => [
      `"${e.referenceCode}"`,
      `"${e.customerName}"`,
      `"${e.customerPhone}"`,
      `"${e.customerEmail}"`,
      `"${getServiceName(e.serviceType)}"`,
      `"${getStatusBadge(e.status).label}"`,
      `"${e.pickupDate}"`,
      `"${e.pickupTime}"`,
      `"${e.pickupLocation.replace(/"/g, '""')}"`,
      `"${(e.dropoffLocation || "").replace(/"/g, '""')}"`,
      e.passengerCount,
      `"${getDisplayVehicleName(e.assignedVehicleName) || db.csvUnassigned}"`,
      `"${e.driverName || dict.common.notApplicable}"`,
      `"${e.driverPhone || dict.common.notApplicable}"`,
      e.quotedPriceRwf || "",
      `"${e.createdAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${db.csvFilenamePrefix}${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(db.csvExportedToast);
  };

  // Filtering & Sorting Logic
  const filteredEnquiries = useMemo(() => {
    let result = [...enquiries];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((e) => {
        const localizedVehicleName = getDisplayVehicleName(e.assignedVehicleName);
        return (
          e.referenceCode.toLowerCase().includes(q) ||
          e.customerName.toLowerCase().includes(q) ||
          e.customerPhone.toLowerCase().includes(q) ||
          e.customerEmail.toLowerCase().includes(q) ||
          e.pickupLocation.toLowerCase().includes(q) ||
          (e.dropoffLocation && e.dropoffLocation.toLowerCase().includes(q)) ||
          (e.assignedVehicleName && e.assignedVehicleName.toLowerCase().includes(q)) ||
          (localizedVehicleName && localizedVehicleName.toLowerCase().includes(q)) ||
          (e.serviceSpecificData?.flightNumber &&
            e.serviceSpecificData.flightNumber.toLowerCase().includes(q))
        );
      });
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter(
        (e) => e.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Service Filter
    if (serviceFilter !== "all") {
      result = result.filter(
        (e) => e.serviceType.toLowerCase() === serviceFilter.toLowerCase()
      );
    }

    // Assignment Filter
    if (assignmentFilter === "assigned") {
      result = result.filter((e) => Boolean(e.assignedVehicleName));
    } else if (assignmentFilter === "unassigned") {
      result = result.filter((e) => !e.assignedVehicleName);
    }

    // Date Filter
    const today = new Date().toISOString().slice(0, 10);
    if (dateFilter === "today") {
      result = result.filter((e) => e.pickupDate === today);
    } else if (dateFilter === "upcoming7") {
      const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
      result = result.filter((e) => e.pickupDate >= today && e.pickupDate <= nextWeek);
    } else if (dateFilter === "past") {
      result = result.filter((e) => e.pickupDate < today);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "pickupAsc") {
        return `${a.pickupDate} ${a.pickupTime}`.localeCompare(`${b.pickupDate} ${b.pickupTime}`);
      }
      if (sortBy === "pickupDesc") {
        return `${b.pickupDate} ${b.pickupTime}`.localeCompare(`${a.pickupDate} ${a.pickupTime}`);
      }
      if (sortBy === "createdDesc") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "passengers") {
        return b.passengerCount - a.passengerCount;
      }
      return 0;
    });

    return result;
  }, [enquiries, searchQuery, statusFilter, serviceFilter, assignmentFilter, dateFilter, sortBy, getDisplayVehicleName]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === "New").length;
    const contactedCount = enquiries.filter((e) => e.status === "Contacted").length;
    const quotedCount = enquiries.filter((e) => e.status === "Quoted").length;
    const confirmedCount = enquiries.filter((e) => e.status === "Confirmed").length;
    const completedCount = enquiries.filter((e) => e.status === "Completed").length;
    const cancelledCount = enquiries.filter((e) => e.status === "Cancelled").length;

    const unassignedConfirmedOrNew = enquiries.filter(
      (e) => (e.status === "Confirmed" || e.status === "New") && !e.assignedVehicleName
    ).length;

    const todayPickups = enquiries.filter((e) => e.pickupDate === today && e.status !== "Cancelled").length;

    const totalPassengers = enquiries
      .filter((e) => e.status === "Confirmed" || e.status === "Completed")
      .reduce((sum, e) => sum + e.passengerCount, 0);

    return {
      total,
      newCount,
      contactedCount,
      quotedCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      unassignedConfirmedOrNew,
      todayPickups,
      totalPassengers,
    };
  }, [enquiries]);

  // Schedule grouping
  const scheduleGroups = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const next7Days = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

    const groups: { title: string; subtitle: string; items: EnquiryRecord[] }[] = [
      {
        title: db.schedule.todayTitle,
        subtitle: `${db.schedule.todaySubtitlePrefix} (${today})`,
        items: filteredEnquiries.filter((e) => e.pickupDate === today),
      },
      {
        title: db.schedule.tomorrowTitle,
        subtitle: `${db.schedule.tomorrowSubtitlePrefix} (${tomorrow})`,
        items: filteredEnquiries.filter((e) => e.pickupDate === tomorrow),
      },
      {
        title: db.schedule.weekTitle,
        subtitle: db.schedule.weekSubtitle,
        items: filteredEnquiries.filter(
          (e) => e.pickupDate > tomorrow && e.pickupDate <= next7Days
        ),
      },
      {
        title: db.schedule.futureTitle,
        subtitle: db.schedule.futureSubtitle,
        items: filteredEnquiries.filter((e) => e.pickupDate > next7Days),
      },
      {
        title: db.schedule.pastTitle,
        subtitle: db.schedule.pastSubtitle,
        items: filteredEnquiries.filter((e) => e.pickupDate < today),
      },
    ];

    return groups.filter((g) => g.items.length > 0);
  }, [filteredEnquiries, db]);

  // Kanban Columns
  const kanbanColumns: { status: EnquiryRecord["status"]; title: string; color: string }[] = [
    { status: "New", title: db.kanban.newRequestsTitle, color: "border-yellow-400 bg-yellow-50/50" },
    { status: "Contacted", title: db.statuses.Contacted, color: "border-sky-400 bg-sky-50/50" },
    { status: "Quoted", title: db.statuses.Quoted, color: "border-purple-400 bg-purple-50/50" },
    { status: "Confirmed", title: db.kanban.confirmedReady, color: "border-emerald-500 bg-emerald-50/50" },
    { status: "Completed", title: db.statuses.Completed, color: "border-gray-300 bg-gray-50/50" },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-[#06281E] text-[#F7F6F2] px-4 py-3 shadow-xl border border-[#BCA77B]/40 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom">
          <CheckCircle className="h-4 w-4 text-[#BCA77B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BCA77B]">
              {db.operationsEyebrow}
            </span>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-300">
              {db.liveFleetBadge}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#0B3D2E] tracking-tight mt-0.5">
            {db.title}
          </h1>
          <p className="text-xs text-[#171D19]/70 mt-1 flex items-center gap-2">
            <span>{db.subtitle}</span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#0B3D2E] bg-white px-2 py-0.5 rounded border border-[var(--color-border-subtle)]">
              <Clock className="h-3 w-3 text-[#BCA77B]" />
              {db.kigaliLocalTime}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded bg-[#0B3D2E] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#06281E] shadow-sm transition-all"
          >
            <Plus className="h-4 w-4 text-[#BCA77B]" />
            <span>{db.newBookingBtn}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded border border-[var(--color-border-subtle)] bg-white px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0B3D2E] hover:bg-[#F7F6F2] shadow-sm transition-all"
            title={db.exportCsvTooltip}
          >
            <Download className="h-3.5 w-3.5 text-[#BCA77B]" />
            <span>{db.exportCsvBtn}</span>
          </button>

          <button
            onClick={() => {
              router.refresh();
              showToast(db.refreshedToast);
            }}
            className="inline-flex items-center gap-1.5 rounded border border-[var(--color-border-subtle)] bg-white p-2.5 text-xs text-[#171D19]/70 hover:bg-[#F7F6F2] shadow-sm transition-all"
            title={db.refreshTooltip}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => setStatusFilter("all")}
          className={`cursor-pointer rounded-lg border p-3.5 transition-all shadow-sm ${
            statusFilter === "all"
              ? "border-[#0B3D2E] bg-[#0B3D2E]/5 ring-1 ring-[#0B3D2E]"
              : "border-[var(--color-border-subtle)] bg-white hover:border-[#BCA77B]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#171D19]/60">{db.kpis.totalBookings}</span>
            <Calendar className="h-3.5 w-3.5 text-[#BCA77B]" />
          </div>
          <span className="font-display text-2xl font-bold text-[#0B3D2E] mt-1 block">
            {stats.total}
          </span>
          <span className="text-[10px] text-[#171D19]/50 block mt-0.5">
            {stats.todayPickups > 0 ? `${stats.todayPickups}${db.kpis.pickupsTodaySuffix}` : db.kpis.allLoggedRequests}
          </span>
        </div>

        <div
          onClick={() => setStatusFilter("New")}
          className={`cursor-pointer rounded-lg border p-3.5 transition-all shadow-sm ${
            statusFilter === "New"
              ? "border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500"
              : "border-[var(--color-border-subtle)] bg-white hover:border-yellow-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-yellow-900">{db.kpis.newRequests}</span>
            {stats.newCount > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-[#FACC15] animate-ping" />
            )}
          </div>
          <span className="font-display text-2xl font-bold text-yellow-800 mt-1 block">
            {stats.newCount}
          </span>
          <span className="text-[10px] text-yellow-900/70 block mt-0.5">
            {db.kpis.needsReviewQuote}
          </span>
        </div>

        <div
          onClick={() => setStatusFilter("Confirmed")}
          className={`cursor-pointer rounded-lg border p-3.5 transition-all shadow-sm ${
            statusFilter === "Confirmed"
              ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
              : "border-[var(--color-border-subtle)] bg-white hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-800">{db.kpis.confirmed}</span>
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <span className="font-display text-2xl font-bold text-emerald-700 mt-1 block">
            {stats.confirmedCount}
          </span>
          <span className="text-[10px] text-emerald-800/70 block mt-0.5">
            {db.kpis.readyForDispatch}
          </span>
        </div>

        <div
          onClick={() => setStatusFilter("Quoted")}
          className={`cursor-pointer rounded-lg border p-3.5 transition-all shadow-sm ${
            statusFilter === "Quoted"
              ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
              : "border-[var(--color-border-subtle)] bg-white hover:border-purple-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-purple-800">{db.kpis.quoted}</span>
            <MessageSquare className="h-3.5 w-3.5 text-purple-600" />
          </div>
          <span className="font-display text-2xl font-bold text-purple-700 mt-1 block">
            {stats.quotedCount}
          </span>
          <span className="text-[10px] text-purple-800/70 block mt-0.5">
            {db.kpis.awaitingCustomer}
          </span>
        </div>

        <div
          onClick={() => setAssignmentFilter(assignmentFilter === "unassigned" ? "all" : "unassigned")}
          className={`cursor-pointer rounded-lg border p-3.5 transition-all shadow-sm ${
            assignmentFilter === "unassigned"
              ? "border-red-500 bg-red-50 ring-1 ring-red-500"
              : stats.unassignedConfirmedOrNew > 0
              ? "border-yellow-300 bg-yellow-50/40 hover:border-yellow-400"
              : "border-[var(--color-border-subtle)] bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#171D19]/60">{db.kpis.needsVehicle}</span>
            <ShieldAlert className="h-3.5 w-3.5 text-yellow-600" />
          </div>
          <span className={`font-display text-2xl font-bold mt-1 block ${
            stats.unassignedConfirmedOrNew > 0 ? "text-yellow-800" : "text-[#0B3D2E]"
          }`}>
            {stats.unassignedConfirmedOrNew}
          </span>
          <span className="text-[10px] text-[#171D19]/50 block mt-0.5">
            {stats.unassignedConfirmedOrNew > 0 ? db.kpis.fleetUnassigned : db.kpis.allAllocated}
          </span>
        </div>

        <div
          onClick={() => setStatusFilter("Completed")}
          className={`cursor-pointer rounded-lg border p-3.5 transition-all shadow-sm ${
            statusFilter === "Completed"
              ? "border-gray-500 bg-gray-50 ring-1 ring-gray-500"
              : "border-[var(--color-border-subtle)] bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#171D19]/60">{db.kpis.passengersServed}</span>
            <Users className="h-3.5 w-3.5 text-[#BCA77B]" />
          </div>
          <span className="font-display text-2xl font-bold text-[#0B3D2E] mt-1 block">
            {stats.totalPassengers}
          </span>
          <span className="text-[10px] text-[#171D19]/50 block mt-0.5">
            {stats.completedCount}{db.kpis.completedTripsSuffix}
          </span>
        </div>
      </div>

      {/* Filter Toolbar & View Switcher */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white p-4 shadow-sm space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#171D19]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={db.searchPlaceholder}
              className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] pl-9 pr-8 py-2 text-xs text-[#171D19] focus:outline-none focus:ring-1 focus:ring-[#0B3D2E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-[#171D19]/40 hover:text-[#171D19]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 rounded-lg border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-1 shrink-0">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "cards"
                  ? "bg-white text-[#0B3D2E] shadow-sm font-bold"
                  : "text-[#171D19]/60 hover:text-[#171D19]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 text-[#BCA77B]" />
              <span>{db.views.cards}</span>
            </button>

            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-white text-[#0B3D2E] shadow-sm font-bold"
                  : "text-[#171D19]/60 hover:text-[#171D19]"
              }`}
            >
              <List className="h-3.5 w-3.5 text-[#BCA77B]" />
              <span>{db.views.table}</span>
            </button>

            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "kanban"
                  ? "bg-white text-[#0B3D2E] shadow-sm font-bold"
                  : "text-[#171D19]/60 hover:text-[#171D19]"
              }`}
            >
              <Columns3 className="h-3.5 w-3.5 text-[#BCA77B]" />
              <span>{db.views.kanban}</span>
            </button>

            <button
              onClick={() => setViewMode("schedule")}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "schedule"
                  ? "bg-white text-[#0B3D2E] shadow-sm font-bold"
                  : "text-[#171D19]/60 hover:text-[#171D19]"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5 text-[#BCA77B]" />
              <span>{db.views.schedule}</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[var(--color-border-subtle)] text-xs">
          {/* Status Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#171D19]/50 uppercase">{db.filters.statusLabel}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-2.5 py-1 text-xs text-[#171D19] focus:outline-none"
            >
              <option value="all">{db.filters.allStatuses} ({stats.total})</option>
              <option value="New">{db.statuses.New} ({stats.newCount})</option>
              <option value="Contacted">{db.statuses.Contacted} ({stats.contactedCount})</option>
              <option value="Quoted">{db.statuses.Quoted} ({stats.quotedCount})</option>
              <option value="Confirmed">{db.statuses.Confirmed} ({stats.confirmedCount})</option>
              <option value="Completed">{db.statuses.Completed} ({stats.completedCount})</option>
              <option value="Cancelled">{db.statuses.Cancelled} ({stats.cancelledCount})</option>
            </select>
          </div>

          {/* Service Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#171D19]/50 uppercase">{db.filters.serviceLabel}</span>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-2.5 py-1 text-xs text-[#171D19] focus:outline-none"
            >
              <option value="all">{db.filters.allServices}</option>
              <option value="car-rental">{db.filters.serviceOptions.carRental}</option>
              <option value="airport-transfer">{db.filters.serviceOptions.airportTransfer}</option>
              <option value="wedding-event">{db.filters.serviceOptions.weddingEvent}</option>
              <option value="group-transport">{db.filters.serviceOptions.groupTransport}</option>
              <option value="corporate-transport">{db.filters.serviceOptions.corporateTransport}</option>
            </select>
          </div>

          {/* Fleet Allocation Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#171D19]/50 uppercase">{db.filters.vehicleLabel}</span>
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-2.5 py-1 text-xs text-[#171D19] focus:outline-none"
            >
              <option value="all">{db.filters.allAllocations}</option>
              <option value="assigned">{db.filters.assignedVehicles}</option>
              <option value="unassigned">{db.filters.needsVehicleAssigned}</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#171D19]/50 uppercase">{db.filters.timeframeLabel}</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-2.5 py-1 text-xs text-[#171D19] focus:outline-none"
            >
              <option value="all">{db.filters.allDates}</option>
              <option value="today">{db.filters.todaysPickups}</option>
              <option value="upcoming7">{db.filters.upcoming7Days}</option>
              <option value="past">{db.filters.pastPickups}</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-semibold text-[#171D19]/50 uppercase">{db.filters.sortLabel}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] px-2.5 py-1 text-xs text-[#171D19] focus:outline-none"
            >
              <option value="pickupAsc">{db.filters.pickupAsc}</option>
              <option value="pickupDesc">{db.filters.pickupDesc}</option>
              <option value="createdDesc">{db.filters.createdDesc}</option>
              <option value="passengers">{db.filters.passengersDesc}</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: BOOKED CARDS VIEW */}
      {viewMode === "cards" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#171D19]/60">
            <span>
              {db.showingCardsBefore} <strong>{filteredEnquiries.length}</strong>{" "}
              {filteredEnquiries.length === 1 ? db.showingCardSingular : db.showingCardPlural}
            </span>
            {(statusFilter !== "all" || serviceFilter !== "all" || searchQuery || assignmentFilter !== "all") && (
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setServiceFilter("all");
                  setAssignmentFilter("all");
                  setDateFilter("all");
                  setSearchQuery("");
                }}
                className="text-[#0B3D2E] hover:underline font-semibold"
              >
                {db.filters.resetFilters}
              </button>
            )}
          </div>

          {filteredEnquiries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--color-border-subtle)] bg-white p-12 text-center space-y-3">
              <Calendar className="h-10 w-10 text-[#BCA77B] mx-auto opacity-60" />
              <h3 className="font-display text-lg font-bold text-[#0B3D2E]">{db.emptyTitle}</h3>
              <p className="text-xs text-[#171D19]/60 max-w-sm mx-auto">
                {db.emptyBody}
              </p>
              <button
                onClick={() => setIsNewBookingModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded bg-[#0B3D2E] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{db.createBookingBtn}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEnquiries.map((enq) => {
                const badge = getStatusBadge(enq.status);
                const cleanPhone = enq.customerPhone.replace(/[^0-9]/g, "");
                const waText = `${db.whatsappBookingGreeting}${enq.customerName}${db.whatsappBookingMid}${enq.referenceCode}]:`;
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
                const displayAssignedVehicle = getDisplayVehicleName(enq.assignedVehicleName);

                return (
                  <div
                    key={enq.id}
                    className="group rounded-xl border border-[var(--color-border-subtle)] bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top Section */}
                    <div>
                      {/* Card Header */}
                      <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[#F7F6F2]/40 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#0B3D2E] bg-white px-2 py-0.5 rounded border border-[var(--color-border-subtle)]">
                            {enq.referenceCode}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(enq.referenceCode);
                              showToast(`${db.copiedPrefix}${enq.referenceCode}`);
                            }}
                            className="text-[#171D19]/40 hover:text-[#0B3D2E]"
                            title={db.card.copyRefTitle}
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {getProximityBadge(enq.pickupDate)}
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${badge.bg}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Service & Vehicle Banner */}
                      <div className="px-4 py-2.5 bg-white border-b border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-semibold text-[#0B3D2E]">
                          {getServiceIcon(enq.serviceType)}
                          <span className="capitalize">{getServiceName(enq.serviceType)}</span>
                        </div>

                        {enq.serviceSpecificData?.flightNumber && (
                          <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-800 border border-sky-200">
                            ✈️ {enq.serviceSpecificData.flightNumber}
                          </span>
                        )}
                        {enq.serviceSpecificData?.venues && (
                          <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-800 border border-purple-200 truncate max-w-[120px]">
                            💍 {enq.serviceSpecificData.venues}
                          </span>
                        )}
                      </div>

                      {/* Route & Schedule Info */}
                      <div className="p-4 space-y-3">
                        {/* Pickup Date & Time */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-semibold text-[#0B3D2E]">
                            <Calendar className="h-3.5 w-3.5 text-[#BCA77B]" />
                            <span className="font-mono">{enq.pickupDate}</span>
                            <span className="text-[#171D19]/40 font-normal">{db.card.atWord}</span>
                            <span className="font-mono">{enq.pickupTime}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#171D19]/70">
                            <Users className="h-3.5 w-3.5 text-[#BCA77B]" />
                            <span>
                              {enq.passengerCount}{" "}
                              {enq.passengerCount === 1 ? db.card.paxSingular : db.card.paxPlural}
                            </span>
                          </div>
                        </div>

                        {/* Route Line */}
                        <div className="rounded-lg bg-[#F7F6F2] p-2.5 text-xs space-y-1.5 border border-[var(--color-border-subtle)]">
                          <div className="flex items-start gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase font-bold text-[#171D19]/40 block">{db.card.pickup}</span>
                              <p className="font-medium text-[#171D19] truncate">{enq.pickupLocation}</p>
                            </div>
                          </div>

                          {enq.dropoffLocation && (
                            <div className="flex items-start gap-2 pt-1 border-t border-[var(--color-border-subtle)]">
                              <span className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 mt-1" />
                              <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-[#171D19]/40 block">{db.card.dropoff}</span>
                                <p className="font-medium text-[#171D19] truncate">{enq.dropoffLocation}</p>
                              </div>
                            </div>
                          )}

                          {enq.returnDate && (
                            <div className="text-[10px] text-[#0B3D2E] font-medium pt-1 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                              <span>{db.card.returnPrefix}{enq.returnDate} ({enq.returnTime || "10:00"})</span>
                            </div>
                          )}
                        </div>

                        {/* Customer Information Box */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <strong className="text-[#0B3D2E] truncate font-sans text-sm">
                              {enq.customerName}
                            </strong>
                            <div className="flex items-center gap-1 shrink-0">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 flex items-center gap-1 border border-emerald-200"
                                title={db.card.whatsappTitle}
                              >
                                <MessageSquare className="h-3 w-3 text-emerald-600" />
                                <span>{dict.common.whatsapp}</span>
                              </a>
                              <a
                                href={`tel:${enq.customerPhone}`}
                                className="rounded bg-gray-100 p-1 text-gray-700 hover:bg-gray-200"
                                title={db.card.callTitle}
                              >
                                <Phone className="h-3 w-3" />
                              </a>
                            </div>
                          </div>

                          <div className="text-[11px] text-[#171D19]/60 flex items-center justify-between">
                            <span>{enq.customerPhone}</span>
                            <span className="truncate max-w-[140px]">{enq.customerEmail}</span>
                          </div>

                          {enq.bookingForSomeoneElse && (
                            <div className="rounded bg-yellow-50 border border-yellow-300 p-1.5 text-[11px] text-yellow-950 flex items-center gap-1.5">
                              <UserCheck className="h-3.5 w-3.5 text-yellow-700 shrink-0" />
                              <span className="truncate">
                                {db.card.travellerPrefix}<strong>{enq.travellerName}</strong> ({enq.travellerPhone})
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Fleet Allocation Box */}
                        <div className="rounded-md border p-2.5 text-xs bg-white space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-[#171D19]/50">
                              {db.card.fleetVehicle}
                            </span>
                            <button
                              onClick={() => {
                                setAssigningEnquiry(enq);
                                setAssignVehicleId(enq.assignedVehicleId || "");
                                setAssignVehicleName(enq.assignedVehicleName || "");
                                setAssignDriverName(enq.driverName || "");
                                setAssignDriverPhone(enq.driverPhone || "");
                              }}
                              className="text-[10px] font-bold text-[#0B3D2E] hover:text-[#BCA77B] underline uppercase tracking-wider"
                            >
                              {enq.assignedVehicleName ? db.card.reassign : db.card.assignFleet}
                            </button>
                          </div>

                          {displayAssignedVehicle ? (
                            <div>
                              <div className="font-semibold text-[#0B3D2E] flex items-center gap-1.5">
                                <Car className="h-3.5 w-3.5 text-emerald-600" />
                                <span>{displayAssignedVehicle}</span>
                              </div>
                              {enq.driverName && (
                                <p className="text-[11px] text-[#171D19]/60 mt-0.5">
                                  {db.card.driverPrefix}<strong>{enq.driverName}</strong> {enq.driverPhone && `(${enq.driverPhone})`}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-yellow-800 text-[11px] font-semibold py-0.5">
                              <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
                              <span>{db.card.pendingVehicleAssignment}</span>
                            </div>
                          )}
                        </div>

                        {/* Quoted Price */}
                        {enq.quotedPriceRwf && (
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--color-border-subtle)]">
                            <span className="text-[10px] uppercase font-semibold text-[#171D19]/50">{db.card.quotedPrice}</span>
                            <span className="font-mono font-bold text-[#0B3D2E]">
                              {enq.quotedPriceRwf.toLocaleString()} {dict.common.rwf}
                            </span>
                          </div>
                        )}

                        {/* Customer Note Snippet */}
                        {enq.customerNotes && (
                          <p className="text-[11px] text-[#171D19]/70 italic line-clamp-2 bg-[#F7F6F2]/60 p-2 rounded border border-[var(--color-border-subtle)]">
                            &ldquo;{enq.customerNotes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 border-t border-[var(--color-border-subtle)] bg-[#F7F6F2]/30 flex items-center justify-between gap-2">
                      {/* Status Dropdown */}
                      <select
                        value={enq.status}
                        onChange={(e) => handleQuickStatusChange(enq.id, e.target.value as any)}
                        className="rounded border border-[var(--color-border-subtle)] bg-white px-2 py-1 text-[11px] font-semibold text-[#0B3D2E] focus:outline-none"
                      >
                        <option value="New">{db.statuses.New}</option>
                        <option value="Contacted">{db.statuses.Contacted}</option>
                        <option value="Quoted">{db.statuses.Quoted}</option>
                        <option value="Confirmed">{db.statuses.Confirmed}</option>
                        <option value="Completed">{db.statuses.Completed}</option>
                        <option value="Cancelled">{db.statuses.Cancelled}</option>
                      </select>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setQuickNoteEnquiry(enq);
                            setQuickNoteText("");
                          }}
                          className="rounded border border-[var(--color-border-subtle)] bg-white px-2 py-1 text-[11px] font-semibold text-[#171D19]/70 hover:text-[#0B3D2E] hover:border-[#0B3D2E]"
                          title={db.card.addNoteTooltip}
                        >
                          {db.card.addNoteBtn}
                        </button>

                        <Link
                          href={`/admin/enquiries/${enq.id}`}
                          className="inline-flex items-center gap-1 rounded bg-[#0B3D2E] px-2.5 py-1 text-[11px] font-semibold text-[#F7F6F2] hover:bg-[#06281E] transition-colors"
                        >
                          <span>{db.card.manageBtn}</span>
                          <ArrowRight className="h-3 w-3 text-[#BCA77B]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: COMPACT TABLE VIEW */}
      {viewMode === "table" && (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-[#0B3D2E]">
              {db.table.masterListPrefix} ({filteredEnquiries.length})
            </h3>
            <span className="text-xs text-[#171D19]/60">
              {db.table.showingFiltered}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--color-border-subtle)] text-[#171D19]/50 uppercase font-mono bg-[#F7F6F2]">
                <tr>
                  <th className="py-3 px-4">{db.table.colReference}</th>
                  <th className="py-3 px-4">{db.table.colCustomer}</th>
                  <th className="py-3 px-4">{db.table.colService}</th>
                  <th className="py-3 px-4">{db.table.colPickupDateTime}</th>
                  <th className="py-3 px-4">{db.table.colRoute}</th>
                  <th className="py-3 px-4">{db.table.colAssignedVehicle}</th>
                  <th className="py-3 px-4">{db.table.colStatus}</th>
                  <th className="py-3 px-4 text-right">{db.table.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {filteredEnquiries.map((enq) => {
                  const badge = getStatusBadge(enq.status);
                  const cleanPhone = enq.customerPhone.replace(/[^0-9]/g, "");
                  const waUrl = `https://wa.me/${cleanPhone}`;
                  const displayAssignedVehicle = getDisplayVehicleName(enq.assignedVehicleName);

                  return (
                    <tr key={enq.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#0B3D2E] block">
                          {enq.referenceCode}
                        </span>
                        <span className="text-[10px] text-[#171D19]/50 font-mono">
                          {new Date(enq.createdAt).toLocaleDateString(dateLocale)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <strong className="text-[#0B3D2E] block">{enq.customerName}</strong>
                        <div className="flex items-center gap-2 text-[11px] text-[#171D19]/60">
                          <span>{enq.customerPhone}</span>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline font-semibold"
                          >
                            {db.waShort}
                          </a>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-[#171D19] block">
                          {getServiceName(enq.serviceType)}
                        </span>
                        {enq.serviceSpecificData?.flightNumber && (
                          <span className="text-[10px] font-mono text-sky-700">
                            ✈️ {enq.serviceSpecificData.flightNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-[#0B3D2E]">
                          {enq.pickupDate} {enq.pickupTime}
                        </div>
                        <div className="mt-0.5">{getProximityBadge(enq.pickupDate)}</div>
                      </td>

                      <td className="py-3 px-4 max-w-[200px]">
                        <span className="truncate block font-medium text-[#171D19]">
                          {enq.pickupLocation}
                        </span>
                        {enq.dropoffLocation && (
                          <span className="truncate block text-[11px] text-[#171D19]/60">
                            &rarr; {enq.dropoffLocation}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {displayAssignedVehicle ? (
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block truncate max-w-[160px]">
                            {displayAssignedVehicle}
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setAssigningEnquiry(enq);
                              setAssignVehicleId("");
                              setAssignVehicleName("");
                              setAssignDriverName("");
                              setAssignDriverPhone("");
                            }}
                            className="rounded bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-950 border border-yellow-300 hover:bg-yellow-200"
                          >
                            {db.table.assignVehicleBtn}
                          </button>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${badge.bg}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/admin/enquiries/${enq.id}`}
                          className="text-[#0B3D2E] hover:text-[#BCA77B] font-semibold underline"
                        >
                          {db.table.detailsLink}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: PIPELINE KANBAN BOARD */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const columnItems = filteredEnquiries.filter((e) => e.status === col.status);

            return (
              <div
                key={col.status}
                className={`rounded-xl border ${col.color} p-3.5 space-y-3 min-h-[500px] flex flex-col`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#0B3D2E]">
                    <span>{col.title}</span>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-mono font-bold text-[#0B3D2E] shadow-sm border border-[var(--color-border-subtle)]">
                    {columnItems.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnItems.map((enq) => (
                    <div
                      key={enq.id}
                      className="rounded-lg border border-[var(--color-border-subtle)] bg-white p-3 shadow-sm hover:shadow-md transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[11px] text-[#0B3D2E]">
                          {enq.referenceCode}
                        </span>
                        {getProximityBadge(enq.pickupDate)}
                      </div>

                      <div>
                        <strong className="text-[#0B3D2E] block">{enq.customerName}</strong>
                        <span className="text-[11px] text-[#171D19]/60">{enq.customerPhone}</span>
                      </div>

                      <div className="text-[11px] text-[#171D19]/80 font-mono bg-[#F7F6F2] p-1.5 rounded">
                        <div>📅 {enq.pickupDate} {db.card.atWord} {enq.pickupTime}</div>
                        <div className="truncate text-[#0B3D2E] font-medium">📍 {enq.pickupLocation}</div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--color-border-subtle)]">
                        <span className="font-semibold text-[#BCA77B]">
                          {getServiceName(enq.serviceType)}
                        </span>
                        <Link
                          href={`/admin/enquiries/${enq.id}`}
                          className="text-[#0B3D2E] hover:underline font-bold"
                        >
                          {db.kanban.manageArrow}
                        </Link>
                      </div>
                    </div>
                  ))}

                  {columnItems.length === 0 && (
                    <div className="py-8 text-center text-xs text-[#171D19]/40 italic">
                      {db.kanban.emptyStage}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 4: PICKUP SCHEDULE / AGENDA */}
      {viewMode === "schedule" && (
        <div className="space-y-6">
          {scheduleGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-white shadow-sm overflow-hidden"
            >
              <div className="p-4 bg-[#0B3D2E]/5 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B3D2E]">
                    {group.title}
                  </h3>
                  <p className="text-xs text-[#171D19]/60">{group.subtitle}</p>
                </div>
                <span className="rounded-full bg-[#0B3D2E] text-[#F7F6F2] font-mono text-xs px-2.5 py-0.5 font-bold">
                  {group.items.length}{db.schedule.pickupsSuffix}
                </span>
              </div>

              <div className="divide-y divide-[var(--color-border-subtle)]">
                {group.items.map((enq) => {
                  const badge = getStatusBadge(enq.status);
                  const displayAssignedVehicle = getDisplayVehicleName(enq.assignedVehicleName);
                  return (
                    <div
                      key={enq.id}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F7F6F2]/40"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded bg-[#0B3D2E] text-[#F7F6F2] px-3 py-2 text-center shrink-0 min-w-[70px]">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#BCA77B] block">
                            {db.kigaliShort}
                          </span>
                          <span className="font-mono text-base font-bold">{enq.pickupTime}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#0B3D2E]">
                              {enq.referenceCode}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${badge.bg}`}
                            >
                              {badge.label}
                            </span>
                            <span className="text-xs font-semibold text-[#BCA77B] uppercase">
                              {getServiceName(enq.serviceType)}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-[#0B3D2E]">
                            {enq.customerName} &bull; {enq.customerPhone} ({enq.passengerCount}{" "}
                            {enq.passengerCount === 1 ? db.card.paxSingular : db.card.paxPlural})
                          </div>

                          <div className="text-xs text-[#171D19]/70 flex items-center gap-2">
                            <span>{db.schedule.pickupPrefix}<strong>{enq.pickupLocation}</strong></span>
                            {enq.dropoffLocation && <span>&rarr; {db.schedule.destinationPrefix}<strong>{enq.dropoffLocation}</strong></span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {displayAssignedVehicle ? (
                          <div className="text-right text-xs">
                            <span className="text-[10px] uppercase text-[#171D19]/50 block">{db.schedule.vehicleLabel}</span>
                            <strong className="text-emerald-800">{displayAssignedVehicle}</strong>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAssigningEnquiry(enq);
                              setAssignVehicleId("");
                              setAssignVehicleName("");
                              setAssignDriverName("");
                              setAssignDriverPhone("");
                            }}
                            className="rounded bg-yellow-100 text-yellow-950 border border-yellow-300 px-2.5 py-1 text-xs font-bold hover:bg-yellow-200"
                          >
                            {db.table.assignVehicleBtn}
                          </button>
                        )}

                        <Link
                          href={`/admin/enquiries/${enq.id}`}
                          className="rounded bg-[#0B3D2E] text-[#F7F6F2] px-3 py-1.5 text-xs font-semibold hover:bg-[#06281E]"
                        >
                          {db.schedule.viewDetails}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: ASSIGN VEHICLE & DRIVER */}
      {assigningEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06281E]/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#BCA77B]/40 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BCA77B]">
                  {db.assignModal.eyebrow}
                </span>
                <h3 className="font-display text-xl font-bold text-[#0B3D2E]">
                  {db.assignModal.title}
                </h3>
              </div>
              <button
                onClick={() => setAssigningEnquiry(null)}
                className="rounded p-1 text-[#171D19]/40 hover:text-[#171D19]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#171D19]/70">
              {db.assignModal.allocatingFor}{" "}
              <strong className="font-mono text-[#0B3D2E]">
                {assigningEnquiry.referenceCode}
              </strong>{" "}
              ({assigningEnquiry.customerName} &bull; {assigningEnquiry.pickupDate} {db.card.atWord}{" "}
              {assigningEnquiry.pickupTime}).
            </p>

            <form onSubmit={handleAssignVehicle} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#171D19] block">
                  {db.assignModal.selectVehicleLabel}
                </label>
                <select
                  value={assignVehicleName}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    setAssignVehicleName(selectedName);
                    const found = vehicles.find((v) => v.name === selectedName);
                    if (found) setAssignVehicleId(found.id);
                  }}
                  required
                  className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2.5 text-xs text-[#171D19] focus:outline-none"
                >
                  <option value="">{db.assignModal.choosePlaceholder}</option>
                  {vehicles.map((rawV) => {
                    const v = localizeVehicle(rawV, locale);
                    return (
                      <option key={rawV.id} value={rawV.name}>
                        {v.name} ({v.passengerCapacity ? `${v.passengerCapacity} ${dict.common.seatsLabel}` : dict.common.customWord})
                      </option>
                    );
                  })}
                  <option value="Other Partner Vehicle">{db.assignModal.otherPartnerVehicle}</option>
                </select>
              </div>

              {assignVehicleName === "Other Partner Vehicle" && (
                <div className="space-y-1">
                  <label className="font-semibold text-[#171D19] block">
                    {db.assignModal.customVehicleLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={db.assignModal.customVehiclePlaceholder}
                    onChange={(e) => setAssignVehicleName(e.target.value)}
                    className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2 text-xs"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#171D19] block">
                    {db.assignModal.driverNameLabel}
                  </label>
                  <input
                    type="text"
                    value={assignDriverName}
                    onChange={(e) => setAssignDriverName(e.target.value)}
                    placeholder={db.newBookingModal.driverNamePlaceholder}
                    className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2 text-xs text-[#171D19]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#171D19] block">
                    {db.assignModal.driverPhoneLabel}
                  </label>
                  <input
                    type="text"
                    value={assignDriverPhone}
                    onChange={(e) => setAssignDriverPhone(e.target.value)}
                    placeholder="+250 788 000 000"
                    className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2 text-xs text-[#171D19]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border-subtle)]">
                <button
                  type="button"
                  onClick={() => setAssigningEnquiry(null)}
                  className="rounded px-4 py-2 text-xs font-semibold text-[#171D19]/70 hover:bg-[#F7F6F2]"
                >
                  {db.assignModal.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isAssigning || !assignVehicleName}
                  className="rounded bg-[#0B3D2E] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#06281E] disabled:opacity-50"
                >
                  {isAssigning ? db.assignModal.saving : db.assignModal.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK NOTE */}
      {quickNoteEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06281E]/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-[#BCA77B]/40 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <h3 className="font-display text-lg font-bold text-[#0B3D2E]">
                {db.noteModal.titlePrefix}{quickNoteEnquiry.referenceCode}
              </h3>
              <button
                onClick={() => setQuickNoteEnquiry(null)}
                className="rounded p-1 text-[#171D19]/40 hover:text-[#171D19]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleQuickNoteSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#171D19] block">
                  {db.noteModal.label}
                </label>
                <textarea
                  rows={4}
                  value={quickNoteText}
                  onChange={(e) => setQuickNoteText(e.target.value)}
                  placeholder={db.noteModal.placeholder}
                  required
                  className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2.5 text-xs text-[#171D19] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border-subtle)]">
                <button
                  type="button"
                  onClick={() => setQuickNoteEnquiry(null)}
                  className="rounded px-3 py-1.5 text-xs text-[#171D19]/70 hover:bg-[#F7F6F2]"
                >
                  {db.noteModal.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNote || !quickNoteText.trim()}
                  className="rounded bg-[#0B3D2E] px-4 py-1.5 text-xs font-semibold text-[#F7F6F2] hover:bg-[#06281E] disabled:opacity-50"
                >
                  {isSubmittingNote ? db.noteModal.saving : db.noteModal.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: + CREATE MANUAL BOOKING (Walk-in / Phone Call) */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06281E]/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-[#BCA77B]/40 bg-white p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BCA77B]">
                  {db.newBookingModal.eyebrow}
                </span>
                <h3 className="font-display text-xl font-bold text-[#0B3D2E]">
                  {db.newBookingModal.title}
                </h3>
              </div>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="rounded p-1 text-[#171D19]/40 hover:text-[#171D19]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBooking} className="space-y-4 text-xs">
              {/* Section 1: Customer Details */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BCA77B] block">
                  {db.newBookingModal.section1}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.customerName}</label>
                    <input
                      type="text"
                      required
                      placeholder={db.newBookingModal.customerNamePlaceholder}
                      value={newBookingData.customerName}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, customerName: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.phoneWhatsapp}</label>
                    <input
                      type="text"
                      required
                      placeholder="+250 788 123 456"
                      value={newBookingData.customerPhone}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, customerPhone: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.emailAddress}</label>
                    <input
                      type="email"
                      placeholder={db.newBookingModal.emailPlaceholder}
                      value={newBookingData.customerEmail}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, customerEmail: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Journey Logistics */}
              <div className="space-y-2 pt-2 border-t border-[var(--color-border-subtle)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BCA77B] block">
                  {db.newBookingModal.section2}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.serviceType}</label>
                    <select
                      value={newBookingData.serviceType}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, serviceType: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    >
                      <option value="car-rental">{db.filters.serviceOptions.carRental}</option>
                      <option value="airport-transfer">{db.filters.serviceOptions.airportTransfer}</option>
                      <option value="wedding-event">{db.filters.serviceOptions.weddingEvent}</option>
                      <option value="group-transport">{db.filters.serviceOptions.groupTransport}</option>
                      <option value="corporate-transport">{db.filters.serviceOptions.corporateTransport}</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.pickupDate}</label>
                    <input
                      type="date"
                      required
                      value={newBookingData.pickupDate}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, pickupDate: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.pickupTime}</label>
                    <input
                      type="time"
                      required
                      value={newBookingData.pickupTime}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, pickupTime: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.pickupLocation}</label>
                    <input
                      type="text"
                      required
                      placeholder={db.newBookingModal.pickupLocationPlaceholder}
                      value={newBookingData.pickupLocation}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, pickupLocation: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.dropoffLocation}</label>
                    <input
                      type="text"
                      placeholder={db.newBookingModal.dropoffLocationPlaceholder}
                      value={newBookingData.dropoffLocation}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, dropoffLocation: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.passengerCount}</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={newBookingData.passengerCount}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, passengerCount: Number(e.target.value) })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    />
                  </div>

                  {newBookingData.serviceType === "airport-transfer" && (
                    <div>
                      <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.flightNumber}</label>
                      <input
                        type="text"
                        placeholder={db.newBookingModal.flightNumberPlaceholder}
                        value={newBookingData.flightNumber}
                        onChange={(e) =>
                          setNewBookingData({ ...newBookingData, flightNumber: e.target.value })
                        }
                        className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2 font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.quotedPriceRwf}</label>
                    <input
                      type="number"
                      placeholder={db.newBookingModal.quotedPricePlaceholder}
                      value={newBookingData.quotedPriceRwf}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, quotedPriceRwf: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Fleet & Driver Assignment */}
              <div className="space-y-2 pt-2 border-t border-[var(--color-border-subtle)]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BCA77B] block">
                  {db.newBookingModal.section3}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.assignVehicle}</label>
                    <select
                      value={newBookingData.assignedVehicleName}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, assignedVehicleName: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    >
                      <option value="">{db.newBookingModal.noVehicleYet}</option>
                      {vehicles.map((rawV) => {
                        const v = localizeVehicle(rawV, locale);
                        return (
                          <option key={rawV.id} value={rawV.name}>
                            {v.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.driverName}</label>
                    <input
                      type="text"
                      placeholder={db.newBookingModal.driverNamePlaceholder}
                      value={newBookingData.driverName}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, driverName: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.driverPhone}</label>
                    <input
                      type="text"
                      placeholder="+250 788 000 000"
                      value={newBookingData.driverPhone}
                      onChange={(e) =>
                        setNewBookingData({ ...newBookingData, driverPhone: e.target.value })
                      }
                      className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#171D19] block mb-1">{db.newBookingModal.notesLabel}</label>
                  <textarea
                    rows={2}
                    placeholder={db.newBookingModal.notesPlaceholder}
                    value={newBookingData.customerNotes}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, customerNotes: e.target.value })
                    }
                    className="w-full rounded border border-[var(--color-border-subtle)] bg-[#F7F6F2] p-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--color-border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="rounded px-4 py-2 font-semibold text-[#171D19]/70 hover:bg-[#F7F6F2]"
                >
                  {db.newBookingModal.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewBooking}
                  className="rounded bg-[#0B3D2E] px-5 py-2 font-semibold uppercase tracking-wider text-[#F7F6F2] hover:bg-[#06281E] disabled:opacity-50"
                >
                  {isSubmittingNewBooking ? db.newBookingModal.recording : db.newBookingModal.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
