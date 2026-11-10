"use client";

import React, { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CarFront,
  Check,
  Clock,
  Eye,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import type { Vehicle } from "@/lib/seed-data";
import { getAssetSlot } from "@/lib/assets";
import { localizeAssetSlot, localizeVehicle } from "@/lib/i18n/catalog";

interface QuickPlannerFormProps {
  vehicles?: Vehicle[];
}

type ActivePanel = "none" | "matches" | "request";

const emptySubscribe = () => () => {};

function getKigaliDateIso(offsetDays = 0): string {
  const target = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kigali",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(target);
}

const getTodaySnapshot = () => getKigaliDateIso(0);
const getTomorrowSnapshot = () => getKigaliDateIso(1);
const getServerSnapshot = () => "";

function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const PASSENGER_OPTIONS = [1, 2, 4, 5, 7, 14, 28];

export function QuickPlannerForm({ vehicles = [] }: QuickPlannerFormProps) {
  const { locale, dict } = useI18n();
  const t = dict.home.quickPlanner;

  const [serviceType, setServiceType] = useState("car-rental");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [passengerCount, setPassengerCount] = useState(2);

  const [activePanel, setActivePanel] = useState<ActivePanel>("none");
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [selectedVehicleSlug, setSelectedVehicleSlug] = useState("");
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Inline Instant Request fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState<
    "whatsapp" | "phone" | "email"
  >("whatsapp");
  const [customerNotes, setCustomerNotes] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(
    null
  );

  const idempotencyKeyRef = useRef<string>("");
  const pickupInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const panelAnchorRef = useRef<HTMLDivElement | null>(null);

  const minDate = useSyncExternalStore(
    emptySubscribe,
    getTodaySnapshot,
    getServerSnapshot
  );
  const tomorrowDate = useSyncExternalStore(
    emptySubscribe,
    getTomorrowSnapshot,
    getServerSnapshot
  );

  const localizedVehicles = useMemo(
    () => vehicles.map((v) => localizeVehicle(v, locale)),
    [vehicles, locale]
  );

  const { matchedVehicles, usedCapacityFallback } = useMemo(() => {
    const byService = localizedVehicles.filter((v) =>
      v.confirmedServices.includes(serviceType)
    );
    const servicePool = byService.length > 0 ? byService : localizedVehicles;

    const capacityFit = servicePool.filter(
      (v) =>
        typeof v.passengerCapacity === "number" &&
        v.passengerCapacity >= passengerCount
    );

    const scoreVehicle = (v: Vehicle) => {
      const cap = v.passengerCapacity ?? 99;
      // Avoid ranking 28-seater buses first for solo/family trips unless group size calls for it
      const oversizePenalty =
        passengerCount <= 7 && cap > 10 ? 100 + cap : cap - passengerCount;
      const featuredBonus = v.isFeatured ? -2 : 0;
      return oversizePenalty + featuredBonus;
    };

    if (capacityFit.length > 0) {
      const sorted = [...capacityFit].sort(
        (a, b) => scoreVehicle(a) - scoreVehicle(b)
      );
      return { matchedVehicles: sorted, usedCapacityFallback: false };
    }

    const largestPool = [...localizedVehicles].sort(
      (a, b) => (b.passengerCapacity ?? 0) - (a.passengerCapacity ?? 0)
    );
    return {
      matchedVehicles: largestPool.slice(0, 3),
      usedCapacityFallback: largestPool.length > 0,
    };
  }, [localizedVehicles, serviceType, passengerCount]);

  const visibleMatches = showAllMatches
    ? matchedVehicles
    : matchedVehicles.slice(0, 3);

  const serviceDisplayName = useMemo(() => {
    switch (serviceType) {
      case "airport-transfer":
        return t.services.airportTransfer;
      case "wedding-event":
        return t.services.weddingEvent;
      case "group-transport":
        return t.services.groupTransport;
      case "corporate-transport":
        return t.services.corporateTransport;
      default:
        return t.services.carRental;
    }
  }, [serviceType, t.services]);

  const buildBookingHref = (vehicleSlug?: string) => {
    const params = new URLSearchParams();
    if (serviceType) params.set("service", serviceType);
    if (vehicleSlug) params.set("vehicle", vehicleSlug);
    if (pickupLocation.trim()) params.set("pickup", pickupLocation.trim());
    if (dropoffLocation.trim()) params.set("dropoff", dropoffLocation.trim());
    if (pickupDate) params.set("date", pickupDate);
    if (pickupTime) params.set("time", pickupTime);
    if (passengerCount > 0) params.set("passengers", String(passengerCount));
    return `/plan-your-journey?${params.toString()}`;
  };

  const scrollToPanel = () => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      panelAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  };

  const clearFieldError = (key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    if (submitError) setSubmitError(null);
  };

  const handleFindRideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedReference(null);
    setSubmitError(null);
    setShowAllMatches(false);
    setActivePanel("matches");
    scrollToPanel();
  };

  const openInstantRequest = (vehicleSlug = "") => {
    setSelectedVehicleSlug(vehicleSlug);
    setSubmittedReference(null);
    setSubmitError(null);
    setActivePanel("request");
    scrollToPanel();
  };

  const handleInstantRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (pickupLocation.trim().length < 2) {
      errors.pickupLocation = t.validation.pickupRequired;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) {
      errors.pickupDate = t.validation.dateRequired;
    }
    if (customerName.trim().length < 2) {
      errors.customerName = t.validation.nameRequired;
    }
    if (customerPhone.trim().length < 7) {
      errors.customerPhone = t.validation.phoneRequired;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      errors.customerEmail = t.validation.emailRequired;
    }
    if (!privacyAccepted) {
      errors.privacyAccepted = t.validation.privacyRequired;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.pickupLocation) {
        pickupInputRef.current?.focus();
      } else if (errors.pickupDate) {
        dateInputRef.current?.focus();
      }
      return;
    }

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = generateUuidV4();
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    const payload = {
      locale,
      idempotencyKey: idempotencyKeyRef.current,
      serviceType,
      preferredVehicleSlug: selectedVehicleSlug || null,
      pickupLocation: pickupLocation.trim(),
      dropoffLocation: dropoffLocation.trim(),
      pickupDate,
      pickupTime: /^\d{2}:\d{2}$/.test(pickupTime) ? pickupTime : "09:00",
      passengerCount,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      preferredContactMethod,
      bookingForSomeoneElse: false,
      customerNotes: customerNotes.trim() || null,
      privacyAccepted: true as const,
      website_url: websiteUrl,
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.referenceCode) {
        throw new Error(data.error || t.validation.submitFailed);
      }
      setSubmittedReference(data.referenceCode);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : t.validation.submitFailed
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedVehicleObj = localizedVehicles.find(
    (v) => v.slug === selectedVehicleSlug
  );

  const whatsappSummaryText = encodeURIComponent(
    [
      submittedReference ? `[Ref: ${submittedReference}]` : "",
      `Service: ${serviceDisplayName}`,
      selectedVehicleObj ? `Vehicle: ${selectedVehicleObj.name}` : "",
      `Pickup: ${pickupLocation.trim() || "Kigali"}`,
      dropoffLocation.trim() ? `Destination: ${dropoffLocation.trim()}` : "",
      pickupDate ? `Date: ${pickupDate} (${pickupTime})` : "",
      `Passengers: ${passengerCount}`,
      customerName.trim() ? `Name: ${customerName.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" | ")
  );

  const handleQuickPickup = (location: string) => {
    setPickupLocation(location);
    clearFieldError("pickupLocation");
    if (
      location.toLowerCase().includes("kgl") ||
      location.toLowerCase().includes("airport") ||
      location.toLowerCase().includes("aéroport")
    ) {
      setServiceType("airport-transfer");
    }
  };

  const inputBase =
    "w-full h-12 rounded-xl border bg-[#F8FAFC] px-3.5 py-2.5 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors";

  return (
    <div className="w-full rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-900/5">
      {/* Header Row with Interactive Quick Mode Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#059669]">
            {t.eyebrow}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F284E] mt-1">
            {t.title}
          </h3>
          <p className="text-sm text-[#475569] mt-1.5 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => {
              setSubmittedReference(null);
              setActivePanel("matches");
              scrollToPanel();
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold transition-all cursor-pointer ${
              activePanel === "matches"
                ? "bg-[#0F284E] text-white shadow-sm"
                : "bg-slate-100 text-[#0F284E] hover:bg-slate-200"
            }`}
          >
            <CarFront className="h-3.5 w-3.5 text-[#10B981]" />
            <span>
              {t.browseRides} ({matchedVehicles.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => openInstantRequest(selectedVehicleSlug)}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-extrabold transition-all cursor-pointer ${
              activePanel === "request"
                ? "bg-[#063726] text-[#FACC15] shadow-sm"
                : "bg-[#D1FAE5] text-[#059669] hover:bg-[#A7F3D0]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                activePanel === "request" ? "bg-[#FACC15]" : "bg-[#10B981]"
              }`}
            />
            <span>{t.instantRequest}</span>
          </button>
        </div>
      </div>

      {/* Main Trip Parameters Form */}
      <form onSubmit={handleFindRideSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
          {/* Service Type */}
          <div className="lg:col-span-3 space-y-1.5">
            <label
              htmlFor="qp-service"
              className="text-xs font-bold uppercase tracking-wider text-[#475569] block whitespace-nowrap truncate"
            >
              {t.serviceTypeLabel}
            </label>
            <select
              id="qp-service"
              value={serviceType}
              onChange={(e) => {
                setServiceType(e.target.value);
                setShowAllMatches(false);
              }}
              className={`${inputBase} border-[#CBD5E1] focus:border-[#225193]`}
            >
              <option value="car-rental">{t.services.carRental}</option>
              <option value="airport-transfer">
                {t.services.airportTransfer}
              </option>
              <option value="wedding-event">{t.services.weddingEvent}</option>
              <option value="group-transport">
                {t.services.groupTransport}
              </option>
              <option value="corporate-transport">
                {t.services.corporateTransport}
              </option>
            </select>
          </div>

          {/* Pickup Location */}
          <div className="lg:col-span-3 space-y-1.5">
            <label
              htmlFor="qp-pickup"
              className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5 whitespace-nowrap truncate"
            >
              <MapPin className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
              <span className="truncate">{t.pickupLocationLabel}</span>
            </label>
            <input
              ref={pickupInputRef}
              id="qp-pickup"
              list="qp-kigali-pickups"
              type="text"
              placeholder={t.pickupLocationPlaceholder}
              value={pickupLocation}
              onChange={(e) => {
                setPickupLocation(e.target.value);
                clearFieldError("pickupLocation");
              }}
              className={`${inputBase} ${
                fieldErrors.pickupLocation
                  ? "border-red-500 bg-red-50/40 focus:border-red-600"
                  : "border-[#CBD5E1] focus:border-[#225193]"
              }`}
            />
            <datalist id="qp-kigali-pickups">
              {t.quickPickups.map((loc) => (
                <option key={loc} value={loc} />
              ))}
              <option value="Kigali Serena Hotel" />
              <option value="Kigali Marriott Hotel" />
              <option value="Musanze / Volcanoes" />
              <option value="Lake Kivu / Rubavu" />
            </datalist>
            {fieldErrors.pickupLocation && (
              <p className="text-[11px] font-semibold text-red-600">
                {fieldErrors.pickupLocation}
              </p>
            )}
          </div>

          {/* Destination / Dropoff (Optional) */}
          <div className="lg:col-span-2 space-y-1.5">
            <label
              htmlFor="qp-dropoff"
              className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5 whitespace-nowrap truncate"
            >
              <MapPin className="h-3.5 w-3.5 text-[#0F284E] shrink-0" />
              <span className="truncate">{t.dropoffLocationLabel}</span>
            </label>
            <input
              id="qp-dropoff"
              type="text"
              placeholder={t.dropoffLocationPlaceholder}
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className={`${inputBase} border-[#CBD5E1] focus:border-[#225193]`}
            />
          </div>

          {/* Pickup Date */}
          <div className="lg:col-span-2 space-y-1.5">
            <label
              htmlFor="qp-date"
              className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5 whitespace-nowrap truncate"
            >
              <Calendar className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
              <span className="truncate">{t.pickupDateLabel}</span>
            </label>
            <input
              ref={dateInputRef}
              id="qp-date"
              type="date"
              min={minDate || undefined}
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value);
                clearFieldError("pickupDate");
              }}
              className={`${inputBase} ${
                fieldErrors.pickupDate
                  ? "border-red-500 bg-red-50/40 focus:border-red-600"
                  : "border-[#CBD5E1] focus:border-[#225193]"
              }`}
            />
            {fieldErrors.pickupDate && (
              <p className="text-[11px] font-semibold text-red-600">
                {fieldErrors.pickupDate}
              </p>
            )}
          </div>

          {/* Passengers */}
          <div className="lg:col-span-2 space-y-1.5">
            <label
              htmlFor="qp-passengers"
              className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5 whitespace-nowrap truncate"
            >
              <Users className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
              <span className="truncate">{t.passengersLabel}</span>
            </label>
            <select
              id="qp-passengers"
              value={passengerCount}
              onChange={(e) => {
                setPassengerCount(parseInt(e.target.value, 10) || 1);
                setShowAllMatches(false);
              }}
              className={`${inputBase} border-[#CBD5E1] focus:border-[#225193]`}
            >
              {PASSENGER_OPTIONS.map((count) => (
                <option key={count} value={count}>
                  {count}{" "}
                  {count === 1
                    ? t.passengerUnitSingular
                    : t.passengerUnitPlural}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick-Pick Helper Chips + Primary CTA Row */}
        <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
              {t.quickPickLabel}
            </span>
            {t.quickPickups.map((loc) => {
              const isSelected = pickupLocation.trim() === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleQuickPickup(loc)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
                    isSelected
                      ? "border-[#0F284E] bg-[#0F284E] text-white"
                      : "border-slate-200 bg-slate-50 text-[#0F284E] hover:border-[#225193] hover:bg-white"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
            {minDate && (
              <button
                type="button"
                onClick={() => {
                  setPickupDate(minDate);
                  clearFieldError("pickupDate");
                }}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
                  pickupDate === minDate
                    ? "border-[#063726] bg-[#063726] text-[#FACC15]"
                    : "border-emerald-200 bg-emerald-50 text-[#063726] hover:bg-emerald-100"
                }`}
              >
                {t.todayChip}
              </button>
            )}
            {tomorrowDate && (
              <button
                type="button"
                onClick={() => {
                  setPickupDate(tomorrowDate);
                  clearFieldError("pickupDate");
                }}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
                  pickupDate === tomorrowDate
                    ? "border-[#063726] bg-[#063726] text-[#FACC15]"
                    : "border-emerald-200 bg-emerald-50 text-[#063726] hover:bg-emerald-100"
                }`}
              >
                {t.tomorrowChip}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="submit"
              style={{ backgroundColor: "#0F284E", color: "#FFFFFF" }}
              className="h-12 inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0F284E] hover:bg-[#1A3E72] px-6 text-xs font-extrabold uppercase tracking-wider text-white shadow-md active:scale-[0.98] transition-all group cursor-pointer"
            >
              <span>{t.submitLabel}</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FACC15] text-[#091A34] transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-3 w-3 stroke-[3]" />
              </span>
            </button>

            <Link
              href={buildBookingHref()}
              className="h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white hover:border-[#0F284E] hover:bg-slate-50 px-5 text-xs font-extrabold uppercase tracking-wider text-[#0F284E] transition-colors"
            >
              <span>{t.fullBookingCta}</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#063726]" />
            </Link>
          </div>
        </div>
      </form>

      {/* Expandable Live Results & Instant Booking Panel */}
      <div ref={panelAnchorRef}>
        {activePanel === "matches" && (
          <div className="mt-7 pt-6 border-t border-slate-200 space-y-5">
            {/* Results Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#F8FAFC] border border-slate-200 p-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#063726] px-2.5 py-0.5 text-[11px] font-extrabold text-[#FACC15]">
                    <Sparkles className="h-3 w-3" />
                    {matchedVehicles.length}
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#0F284E]">
                    {t.matchedHeader}
                  </h4>
                </div>
                <p className="text-xs text-[#475569]">
                  <strong className="text-[#0F284E]">{serviceDisplayName}</strong>
                  {" · "}
                  <span>
                    {passengerCount}{" "}
                    {passengerCount === 1
                      ? t.passengerUnitSingular
                      : t.passengerUnitPlural}
                  </span>
                  {pickupLocation.trim() && (
                    <>
                      {" · "}
                      <span>
                        {pickupLocation.trim()}
                        {dropoffLocation.trim()
                          ? ` -> ${dropoffLocation.trim()}`
                          : ""}
                      </span>
                    </>
                  )}
                  {pickupDate && ` · ${pickupDate}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openInstantRequest("")}
                  style={{ backgroundColor: "#FACC15", color: "#091A34" }}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider shadow-xs hover:bg-[#EAB308] transition-colors cursor-pointer"
                >
                  <span>{t.instantRequest}</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel("none")}
                  aria-label={t.hideResults}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:text-[#0F284E] hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>{t.hideResults}</span>
                </button>
              </div>
            </div>

            {(!pickupLocation.trim() || !pickupDate) && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#FACC15] bg-[#FEF9C3]/80 px-4 py-3 text-xs font-semibold text-[#091A34]">
                <AlertCircle className="h-4 w-4 text-[#0F284E] shrink-0 mt-0.5" />
                <span>{t.missingDetailsNotice}</span>
              </div>
            )}

            {usedCapacityFallback && (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs font-semibold text-[#063726]">
                <Users className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                <span>
                  {t.noExactCapacityFallback} {t.multiVehicleNote}
                </span>
              </div>
            )}

            {/* Matched Vehicle Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {visibleMatches.map((vehicle, idx) => {
                const rawSlot = getAssetSlot(vehicle.primaryAssetSlot);
                const slot = localizeAssetSlot(rawSlot, locale);
                const imgFailed = brokenImages[slot.publicPath];

                return (
                  <div
                    key={vehicle.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-[#0F284E]/45 hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-[#F1F5F9] ring-1 ring-inset ring-black/5">
                        {!imgFailed ? (
                          <Image
                            src={slot.publicPath}
                            alt={slot.alt || vehicle.name}
                            fill
                            loading="eager"
                            sizes="(max-width: 768px) 100vw, 360px"
                            className="object-cover object-center"
                            onError={() =>
                              setBrokenImages((prev) => ({
                                ...prev,
                                [slot.publicPath]: true,
                              }))
                            }
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
                            {vehicle.name}
                          </div>
                        )}
                        {idx === 0 && (
                          <span className="absolute top-2.5 left-2.5 rounded-full bg-[#063726]/95 border border-[#FACC15]/50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FACC15] shadow-sm">
                            {t.bestMatchBadge}
                          </span>
                        )}
                        {vehicle.passengerCapacity !== null && (
                          <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[#061226]/85 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white">
                            {vehicle.passengerCapacity} {t.seatsLabel}
                          </span>
                        )}
                      </div>

                      <h5 className="mt-3 text-base font-extrabold tracking-tight text-[#0F284E]">
                        {vehicle.name}
                      </h5>
                      <p className="mt-1 text-xs text-[#64748B] line-clamp-2">
                        {[vehicle.transmission, vehicle.fuelType]
                          .filter(Boolean)
                          .join(" · ") || vehicle.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openInstantRequest(vehicle.slug)}
                        style={{
                          backgroundColor: "#FACC15",
                          color: "#091A34",
                        }}
                        className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2.5 text-[11px] font-black uppercase tracking-wider whitespace-nowrap hover:bg-[#EAB308] transition-colors cursor-pointer"
                      >
                        <span className="truncate">{t.requestThisVehicle}</span>
                        <ArrowRight className="h-3 w-3 stroke-[3] shrink-0" />
                      </button>

                      <Link
                        href={buildBookingHref(vehicle.slug)}
                        style={{
                          backgroundColor: "#0F284E",
                          color: "#FFFFFF",
                        }}
                        data-testid={`qp-book-vehicle-${vehicle.slug}`}
                        className="inline-flex items-center justify-center rounded-xl px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 hover:bg-[#1A3E72] transition-colors"
                      >
                        {t.fullBookingCta}
                      </Link>

                      <Link
                        href={`/fleet/${vehicle.slug}`}
                        title={t.viewSpecs}
                        aria-label={`${t.viewSpecs} ${vehicle.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#0F284E] shrink-0 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Controls under Matches */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div>
                {matchedVehicles.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllMatches((prev) => !prev)}
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] hover:text-[#063726] underline underline-offset-4 cursor-pointer"
                  >
                    {showAllMatches
                      ? t.showFewerMatches
                      : `${t.showAllMatches} (${matchedVehicles.length})`}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/250784129579?text=${whatsappSummaryText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#10B981]/40 bg-[#ECFDF5] px-4 py-2 text-xs font-extrabold text-[#063726] hover:bg-[#D1FAE5] transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#10B981]" />
                  <span>{t.whatsappAlternativeCta}</span>
                </a>
                <Link
                  href={buildBookingHref()}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F284E] hover:text-[#063726]"
                >
                  <span>{t.openFullCheckout}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#FACC15]" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Inline Instant Request Submission Form & Live Success Confirmation */}
        {activePanel === "request" && (
          <div className="mt-7 pt-6 border-t border-slate-200">
            {submittedReference ? (
              <div className="rounded-2xl border border-[#10B981]/35 bg-[#ECFDF5]/60 p-6 sm:p-8 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#063726] text-[#FACC15] shadow-sm">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-emerald-200 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#063726]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  {t.successBadge}
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold text-[#0F284E]">
                  {t.successTitle}
                </h4>
                <p className="text-sm text-[#475569] max-w-xl mx-auto">
                  {t.successBody}
                </p>

                <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t.referenceLabel}:
                  </span>
                  <span className="font-mono text-base font-black text-[#0F284E] bg-[#FEF9C3] border border-[#FACC15] px-3 py-1 rounded-lg">
                    {submittedReference}
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/250784129579?text=${whatsappSummaryText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#063726] hover:bg-[#042419] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#FACC15] shadow-sm transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-[#10B981]" />
                    <span>{t.whatsappAlternativeCta}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      idempotencyKeyRef.current = "";
                      setSubmittedReference(null);
                      setCustomerNotes("");
                      setActivePanel("matches");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0F284E] transition-colors cursor-pointer"
                  >
                    <span>{t.planAnotherTrip}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleInstantRequestSubmit}
                noValidate
                className="rounded-2xl border border-[#0F284E]/15 bg-[#F8FAFC] p-5 sm:p-6 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-extrabold text-[#0F284E]">
                      {t.requestPanelTitle}
                    </h4>
                    <p className="text-xs text-[#475569] mt-0.5">
                      {t.requestPanelSubtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePanel("matches")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F284E] hover:text-[#063726] shrink-0 self-start cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{t.backToMatches}</span>
                  </button>
                </div>

                {/* Vehicle Preference & Pickup Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label
                      htmlFor="qp-req-vehicle"
                      className="text-xs font-bold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                    >
                      <CarFront className="h-3.5 w-3.5 text-[#063726]" />
                      {t.vehicleSelectionLabel}
                    </label>
                    <select
                      id="qp-req-vehicle"
                      value={selectedVehicleSlug}
                      onChange={(e) => setSelectedVehicleSlug(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#CBD5E1] bg-white px-3.5 text-sm font-medium text-[#0F172A] focus:border-[#0F284E] focus:outline-none"
                    >
                      <option value="">{t.bestAvailableVehicleOption}</option>
                      {localizedVehicles.map((v) => (
                        <option key={v.id} value={v.slug}>
                          {v.name}
                          {v.passengerCapacity
                            ? ` (${v.passengerCapacity} ${t.seatsLabel})`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="qp-req-time"
                      className="text-xs font-bold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                    >
                      <Clock className="h-3.5 w-3.5 text-[#063726]" />
                      {t.pickupTimeLabel}
                    </label>
                    <input
                      id="qp-req-time"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#CBD5E1] bg-white px-3.5 text-sm font-medium text-[#0F172A] focus:border-[#0F284E] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="qp-req-name"
                      className="text-xs font-bold uppercase tracking-wider text-[#0F284E]"
                    >
                      {t.fullNameLabel}
                    </label>
                    <input
                      id="qp-req-name"
                      type="text"
                      required
                      placeholder={t.fullNamePlaceholder}
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        clearFieldError("customerName");
                      }}
                      className={`w-full h-11 rounded-xl border bg-white px-3.5 text-sm font-medium text-[#0F172A] focus:outline-none ${
                        fieldErrors.customerName
                          ? "border-red-500 focus:border-red-600"
                          : "border-[#CBD5E1] focus:border-[#0F284E]"
                      }`}
                    />
                    {fieldErrors.customerName && (
                      <p className="text-[11px] font-semibold text-red-600">
                        {fieldErrors.customerName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="qp-req-phone"
                      className="text-xs font-bold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5 text-[#063726]" />
                      {t.phoneLabel}
                    </label>
                    <input
                      id="qp-req-phone"
                      type="tel"
                      required
                      placeholder={t.phonePlaceholder}
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        clearFieldError("customerPhone");
                      }}
                      className={`w-full h-11 rounded-xl border bg-white px-3.5 text-sm font-medium text-[#0F172A] focus:outline-none ${
                        fieldErrors.customerPhone
                          ? "border-red-500 focus:border-red-600"
                          : "border-[#CBD5E1] focus:border-[#0F284E]"
                      }`}
                    />
                    {fieldErrors.customerPhone && (
                      <p className="text-[11px] font-semibold text-red-600">
                        {fieldErrors.customerPhone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="qp-req-email"
                      className="text-xs font-bold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                    >
                      <Mail className="h-3.5 w-3.5 text-[#063726]" />
                      {t.emailLabel}
                    </label>
                    <input
                      id="qp-req-email"
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        clearFieldError("customerEmail");
                      }}
                      className={`w-full h-11 rounded-xl border bg-white px-3.5 text-sm font-medium text-[#0F172A] focus:outline-none ${
                        fieldErrors.customerEmail
                          ? "border-red-500 focus:border-red-600"
                          : "border-[#CBD5E1] focus:border-[#0F284E]"
                      }`}
                    />
                    {fieldErrors.customerEmail && (
                      <p className="text-[11px] font-semibold text-red-600">
                        {fieldErrors.customerEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="qp-req-contact"
                      className="text-xs font-bold uppercase tracking-wider text-[#0F284E]"
                    >
                      {t.contactMethodLabel}
                    </label>
                    <select
                      id="qp-req-contact"
                      value={preferredContactMethod}
                      onChange={(e) =>
                        setPreferredContactMethod(
                          e.target.value as "whatsapp" | "phone" | "email"
                        )
                      }
                      className="w-full h-11 rounded-xl border border-[#CBD5E1] bg-white px-3.5 text-sm font-medium text-[#0F172A] focus:border-[#0F284E] focus:outline-none"
                    >
                      <option value="whatsapp">
                        {t.contactOptions.whatsapp}
                      </option>
                      <option value="phone">{t.contactOptions.phone}</option>
                      <option value="email">{t.contactOptions.email}</option>
                    </select>
                  </div>
                </div>

                {/* Notes + Privacy */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-7 space-y-1.5">
                    <label
                      htmlFor="qp-req-notes"
                      className="text-xs font-bold uppercase tracking-wider text-[#0F284E]"
                    >
                      {t.notesLabel}
                    </label>
                    <input
                      id="qp-req-notes"
                      type="text"
                      placeholder={t.notesPlaceholder}
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#CBD5E1] bg-white px-3.5 text-sm font-medium text-[#0F172A] focus:border-[#0F284E] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-5 pt-2 md:pt-5">
                    <label
                      className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 cursor-pointer transition-colors ${
                        fieldErrors.privacyAccepted
                          ? "border-red-400 bg-red-50/50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <input
                        id="qp-req-privacy"
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => {
                          setPrivacyAccepted(e.target.checked);
                          clearFieldError("privacyAccepted");
                        }}
                        className="h-4 w-4 rounded border-[#CBD5E1] text-[#0F284E] shrink-0"
                      />
                      <span className="text-xs font-medium text-[#0F284E]">
                        {t.privacyConsentPrefix}
                        <Link
                          href="/privacy"
                          className="font-bold underline text-[#063726]"
                        >
                          {t.privacyLinkLabel}
                        </Link>
                      </span>
                    </label>
                    {fieldErrors.privacyAccepted && (
                      <p className="text-[11px] font-semibold text-red-600 mt-1">
                        {fieldErrors.privacyAccepted}
                      </p>
                    )}
                  </div>
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  name="website_url"
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="hidden"
                />

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-start gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        backgroundColor: "#FACC15",
                        color: "#091A34",
                      }}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-wider shadow-sm hover:bg-[#EAB308] disabled:opacity-60 transition-all cursor-pointer"
                    >
                      <span>
                        {isSubmitting
                          ? t.sendingRequestCta
                          : t.sendInstantRequestCta}
                      </span>
                      {!isSubmitting && (
                        <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                      )}
                    </button>

                    <a
                      href={`https://wa.me/250784129579?text=${whatsappSummaryText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#10B981]/40 bg-white px-5 text-xs font-extrabold uppercase tracking-wider text-[#063726] hover:bg-emerald-50 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-[#10B981]" />
                      <span>{t.whatsappAlternativeCta}</span>
                    </a>
                  </div>

                  <Link
                    href={buildBookingHref(selectedVehicleSlug)}
                    className="text-xs font-bold text-[#0F284E] hover:underline underline-offset-4"
                  >
                    {t.openFullCheckout}
                  </Link>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
