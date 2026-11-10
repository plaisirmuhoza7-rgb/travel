"use client";

import React, { useState, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Vehicle, ServiceItem } from "@/lib/seed-data";
import { getAssetSlot } from "@/lib/assets";
import { getServiceVisual } from "@/lib/service-visuals";
import {
  Check,
  ArrowRight,
  Calendar,
  MapPin,
  Plane,
  Users,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CarFront,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { CLIENT_BUILD_VERSION } from "@/lib/client-version";
import { useI18n } from "@/components/i18n/LocaleProvider";
import {
  localizeAssetSlot,
  localizeService,
  localizeServiceVisual,
  localizeVehicle,
} from "@/lib/i18n/catalog";

interface Props {
  vehicles: Vehicle[];
  services: ServiceItem[];
}

interface CheckoutFormData {
  serviceType: string;
  preferredVehicleSlug: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  passengerCount: number;
  airportDirection: "arrival" | "departure";
  flightNumber: string;
  flightDateTime: string;
  eventDate: string;
  venues: string;
  approximateGuests: number;
  requestedVehicleCategories: string[];
  decorationRequested: boolean;
  routeItinerarySummary: string;
  luggageTransportNotes: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredContactMethod: "whatsapp" | "phone" | "email";
  bookingForSomeoneElse: boolean;
  travellerName: string;
  travellerPhone: string;
  customerNotes: string;
  privacyAccepted: boolean;
  website_url: string;
}

const emptySubscribe = () => () => {};
const getTodaySnapshot = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kigali",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const getServerTodaySnapshot = () => "";

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

function resolveInitialSelection(
  searchParams: URLSearchParams,
  vehicles: Vehicle[],
  services: ServiceItem[]
) {
  const sParam = searchParams.get("service");
  const vParam = searchParams.get("vehicle");
  const pParam = searchParams.get("pickup");
  const dropoffParam = searchParams.get("dropoff");
  const dParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const passengersParam = searchParams.get("passengers");
  const audienceParam = searchParams.get("audience");

  const matchedVehicle = vParam
    ? vehicles.find((v) => v.slug === vParam)
    : undefined;

  const hasExplicitValidService = Boolean(
    sParam && services.some((s) => s.slug === sParam)
  );

  const vehicleDefaultService =
    matchedVehicle?.confirmedServices?.find((slug) =>
      services.some((s) => s.slug === slug)
    ) || null;

  const audienceDefaultService =
    audienceParam === "diaspora" &&
    services.some((s) => s.slug === "airport-transfer")
      ? "airport-transfer"
      : null;

  const fallbackService =
    services.find((s) => s.slug === "car-rental")?.slug ||
    services[0]?.slug ||
    "car-rental";

  const resolvedService = hasExplicitValidService
    ? (sParam as string)
    : vehicleDefaultService || audienceDefaultService || fallbackService;

  const parsedPassengers = passengersParam ? parseInt(passengersParam, 10) : NaN;
  const resolvedPassengers =
    Number.isInteger(parsedPassengers) && parsedPassengers >= 1
      ? Math.min(100, parsedPassengers)
      : 1;

  const resolvedTime =
    timeParam && /^\d{2}:\d{2}$/.test(timeParam) ? timeParam : "10:00";

  return {
    serviceType: resolvedService,
    preferredVehicleSlug: matchedVehicle?.slug || "",
    pickupLocation: pParam || "",
    dropoffLocation: dropoffParam || "",
    pickupDate: dParam || "",
    pickupTime: resolvedTime,
    passengerCount: resolvedPassengers,
  };
}

export function BookingWizard({ vehicles, services }: Props) {
  const searchParams = useSearchParams();
  const { locale, dict } = useI18n();
  const w = dict.booking.wizard;
  const _keepIconFactory = ArrowUpRight;
  const idempotencyKeyRef = useRef<string>("");

  const localizedServices = services.map((s) => localizeService(s, locale));
  const localizedVehicles = vehicles.map((v) => localizeVehicle(v, locale));

  const minToday = useSyncExternalStore(
    emptySubscribe,
    getTodaySnapshot,
    getServerTodaySnapshot
  );

  const searchKey = searchParams.toString();
  const [lastSearchKey, setLastSearchKey] = useState(searchKey);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submittedReference, setSubmittedReference] = useState<string | null>(
    null
  );
  const [brokenVehicleImgPath, setBrokenVehicleImgPath] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState<CheckoutFormData>(() => {
    const resolved = resolveInitialSelection(searchParams, vehicles, services);
    return {
      serviceType: resolved.serviceType,
      preferredVehicleSlug: resolved.preferredVehicleSlug,

      // Journey
      pickupLocation: resolved.pickupLocation,
      dropoffLocation: resolved.dropoffLocation,
      pickupDate: resolved.pickupDate,
      pickupTime: resolved.pickupTime,
      returnDate: "",
      returnTime: resolved.pickupTime,
      passengerCount: resolved.passengerCount,

      // Conditional: Airport
      airportDirection: "arrival",
      flightNumber: "",
      flightDateTime: "",

      // Conditional: Wedding / Event
      eventDate: "",
      venues: "",
      approximateGuests: 50,
      requestedVehicleCategories: [],
      decorationRequested: false,

      // Conditional: Group / Corporate
      routeItinerarySummary: "",
      luggageTransportNotes: "",

      // Contact
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      preferredContactMethod: "whatsapp",

      // Arranging for someone else
      bookingForSomeoneElse: false,
      travellerName: "",
      travellerPhone: "",

      // Notes & Privacy
      customerNotes: "",
      privacyAccepted: false,
      website_url: "", // Honeypot
    };
  });

  // Sync URL query parameters when user navigates across Book links while mounted
  if (searchKey !== lastSearchKey) {
    setLastSearchKey(searchKey);
    const resolved = resolveInitialSelection(searchParams, vehicles, services);
    const hasVehicleParam = Boolean(searchParams.get("vehicle"));
    const hasServiceParam = Boolean(searchParams.get("service"));
    const hasAudienceParam = Boolean(searchParams.get("audience"));
    const hasPickupParam = Boolean(searchParams.get("pickup"));
    const hasDropoffParam = Boolean(searchParams.get("dropoff"));
    const hasDateParam = Boolean(searchParams.get("date"));
    const hasTimeParam = Boolean(searchParams.get("time"));
    const hasPassengersParam = Boolean(searchParams.get("passengers"));

    setSubmittedReference(null);
    setSubmissionError(null);
    setFieldErrors({});
    setFormData((prev) => ({
      ...prev,
      serviceType:
        hasServiceParam || hasVehicleParam || hasAudienceParam || !searchKey
          ? resolved.serviceType
          : prev.serviceType,
      preferredVehicleSlug: hasVehicleParam
        ? resolved.preferredVehicleSlug
        : "",
      pickupLocation: hasPickupParam
        ? resolved.pickupLocation
        : prev.pickupLocation,
      dropoffLocation: hasDropoffParam
        ? resolved.dropoffLocation
        : prev.dropoffLocation,
      pickupDate: hasDateParam ? resolved.pickupDate : prev.pickupDate,
      pickupTime: hasTimeParam ? resolved.pickupTime : prev.pickupTime,
      passengerCount: hasPassengersParam
        ? resolved.passengerCount
        : prev.passengerCount,
    }));
  }

  const updateField = <K extends keyof CheckoutFormData>(
    field: K,
    value: CheckoutFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submissionError) {
      setSubmissionError(null);
    }
  };

  // Selected service & vehicle visuals
  const selectedServiceIndex = Math.max(
    0,
    localizedServices.findIndex((s) => s.slug === formData.serviceType)
  );
  const selectedService =
    localizedServices.find((s) => s.slug === formData.serviceType) ||
    localizedServices[0];
  const selectedVisual = localizeServiceVisual(
    getServiceVisual(formData.serviceType, selectedServiceIndex),
    formData.serviceType,
    locale
  );
  const selectedVehicle = localizedVehicles.find(
    (v) => v.slug === formData.preferredVehicleSlug
  );
  const rawVehicleSlot = selectedVehicle
    ? getAssetSlot(selectedVehicle.primaryAssetSlot)
    : null;
  const vehicleSlot = rawVehicleSlot
    ? localizeAssetSlot(rawVehicleSlot, locale)
    : null;
  const showVehiclePhoto = Boolean(
    selectedVehicle &&
      vehicleSlot?.publicPath &&
      brokenVehicleImgPath !== vehicleSlot.publicPath
  );

  // Explicit client-side validation matching EnquirySchema
  const validateCheckout = (): {
    errors: Record<string, string>;
    firstInvalidId: string | null;
    summaryMessage: string | null;
  } => {
    const errors: Record<string, string> = {};
    let firstInvalidId: string | null = null;
    const setErr = (field: string, msg: string) => {
      errors[field] = msg;
      if (!firstInvalidId) firstInvalidId = field;
    };

    if (formData.pickupLocation.trim().length < 2) {
      setErr("pickupLocation", w.validation.pickupLocation);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.pickupDate)) {
      setErr("pickupDate", w.validation.pickupDate);
    }
    if (!/^\d{2}:\d{2}$/.test(formData.pickupTime)) {
      setErr("pickupTime", w.validation.pickupTime);
    }
    if (
      formData.returnDate &&
      formData.pickupDate &&
      formData.returnDate < formData.pickupDate
    ) {
      setErr("returnDate", w.validation.returnDateBeforePickup);
    }
    if (
      !Number.isInteger(formData.passengerCount) ||
      formData.passengerCount < 1 ||
      formData.passengerCount > 100
    ) {
      setErr("passengerCount", w.validation.passengerCount);
    }
    if (formData.customerName.trim().length < 2) {
      setErr("customerName", w.validation.customerName);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail.trim())) {
      setErr("customerEmail", w.validation.customerEmail);
    }
    if (formData.customerPhone.trim().length < 7) {
      setErr("customerPhone", w.validation.customerPhone);
    }
    if (!formData.privacyAccepted) {
      setErr("privacyAccepted", w.validation.privacyAccepted);
    }

    const firstKey = Object.keys(errors)[0];
    return {
      errors,
      firstInvalidId,
      summaryMessage: firstKey ? errors[firstKey] : null,
    };
  };

  // Handle Direct Checkout Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { errors, firstInvalidId, summaryMessage } = validateCheckout();
    if (summaryMessage) {
      setFieldErrors(errors);
      setSubmissionError(summaryMessage);
      if (firstInvalidId && typeof document !== "undefined") {
        const el = document.getElementById(firstInvalidId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus({ preventScroll: true });
        }
      }
      return;
    }

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = generateUuidV4();
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setFieldErrors({});

    const payload = {
      locale,
      idempotencyKey: idempotencyKeyRef.current,
      serviceType: formData.serviceType,
      preferredVehicleSlug: formData.preferredVehicleSlug || null,
      pickupLocation: formData.pickupLocation.trim(),
      dropoffLocation: formData.dropoffLocation.trim(),
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      returnDate: formData.returnDate ? formData.returnDate : null,
      returnTime:
        formData.returnDate && formData.returnTime ? formData.returnTime : null,
      passengerCount: Math.min(100, Math.max(1, formData.passengerCount || 1)),
      airportDirection:
        formData.serviceType === "airport-transfer"
          ? formData.airportDirection
          : null,
      flightNumber:
        formData.serviceType === "airport-transfer"
          ? formData.flightNumber.trim() || null
          : null,
      flightDateTime: null,
      eventDate: null,
      venues:
        formData.serviceType === "wedding-event"
          ? formData.venues.trim() || null
          : null,
      approximateGuests:
        formData.serviceType === "wedding-event"
          ? formData.approximateGuests
          : null,
      requestedVehicleCategories: formData.requestedVehicleCategories,
      decorationRequested: formData.decorationRequested,
      routeItinerarySummary:
        formData.serviceType === "group-transport" ||
        formData.serviceType === "corporate-transport"
          ? formData.routeItinerarySummary.trim() || null
          : null,
      luggageTransportNotes: null,
      customerName: formData.customerName.trim(),
      customerEmail: formData.customerEmail.trim(),
      customerPhone: formData.customerPhone.trim(),
      preferredContactMethod: formData.preferredContactMethod,
      bookingForSomeoneElse: formData.bookingForSomeoneElse,
      travellerName: formData.bookingForSomeoneElse
        ? formData.travellerName.trim() || null
        : null,
      travellerPhone: formData.bookingForSomeoneElse
        ? formData.travellerPhone.trim() || null
        : null,
      customerNotes: formData.customerNotes.trim() || null,
      privacyAccepted: true as const,
      website_url: formData.website_url,
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || w.validation.submitFailed);
      }

      setSubmittedReference(data.referenceCode);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : w.validation.serverError;
      setSubmissionError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // SUBMISSION SUCCESS VIEW (PENDING CONFIRMATION)
  // ----------------------------------------------------
  if (submittedReference) {
    const vehiclePhrase = selectedVehicle
      ? ` (${selectedVehicle.name})`
      : "";
    const contactMethodLabel =
      formData.preferredContactMethod === "whatsapp"
        ? dict.common.whatsapp
        : formData.preferredContactMethod === "phone"
          ? w.contactOptions.phone
          : w.contactOptions.email;
    const waText = encodeURIComponent(
      `${w.success.whatsappIntro}${submittedReference}] — ${
        selectedService?.name || formData.serviceType
      }${vehiclePhrase}${w.success.whatsappOn}${formData.pickupDate}${w.success.whatsappFrom}${
        formData.pickupLocation
      }${w.success.whatsappClosing}`
    );

    return (
      <div
        data-v={CLIENT_BUILD_VERSION}
        data-icon={Boolean(_keepIconFactory)}
        className="rounded-3xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xl max-w-2xl mx-auto"
      >
        <div className="h-1.5 w-full flex">
          <div className="w-[40%] bg-[#0F284E]" />
          <div className="w-[35%] bg-[#063726]" />
          <div className="w-[25%] bg-[#FACC15]" />
        </div>

        <div className="p-8 md:p-12 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#063726] text-[#FACC15] shadow-md">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#063726]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              {w.success.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F284E] mt-3">
              {w.success.title}
            </h2>
          </div>

          {/* Booked Vehicle / Service Summary Banner */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#0F284E]/15 bg-gradient-to-r from-[#091A34] via-[#0F284E] to-[#063726] p-3.5 text-left text-white shadow-sm">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-[#FACC15]/45 bg-[#F1F5F9]">
              {showVehiclePhoto && vehicleSlot ? (
                <Image
                  src={vehicleSlot.publicPath}
                  alt={vehicleSlot.alt || selectedVehicle?.name || w.summaryLabels.vehicle}
                  fill
                  sizes="96px"
                  className="object-cover object-center"
                />
              ) : (
                <Image
                  src={selectedVisual.image}
                  alt={selectedVisual.alt}
                  fill
                  placeholder="blur"
                  sizes="96px"
                  className="object-cover object-center"
                />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FACC15] block">
                {selectedVehicle ? w.requestedVehicle : w.selectedService}
              </span>
              <p className="text-sm font-extrabold text-white truncate">
                {selectedVehicle?.name ||
                  selectedService?.name ||
                  formData.serviceType}
              </p>
              <p className="text-xs text-slate-300 truncate mt-0.5">
                {selectedService?.name} · {formData.pickupDate} {w.atTimeWord}{" "}
                {formData.pickupTime}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-5 text-left space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5 gap-3">
              <span className="text-xs uppercase text-[#475569] font-bold">
                {w.success.referenceLabel}
              </span>
              <span className="font-mono text-base font-extrabold text-[#0F284E] bg-[#FEF9C3] px-3 py-1 rounded-lg border border-[#FACC15]">
                {submittedReference}
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed pt-1">
              <strong className="text-[#063726]">
                {w.success.statusPrefix}
              </strong>{" "}
              {w.success.dispatchBodyStart}
              <strong className="text-[#0F284E]">
                {formData.pickupLocation}
              </strong>
              {formData.dropoffLocation
                ? `${w.success.dispatchBodyTo}${formData.dropoffLocation}`
                : ""}
              {w.success.dispatchBodyFor}
              {formData.pickupDate}
              {w.success.dispatchBodyVia}
              <strong className="text-[#0F284E]">
                {contactMethodLabel}
              </strong>
              .
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/250784129579?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#063726] hover:bg-[#042419] py-4 text-xs font-extrabold uppercase tracking-wider text-[#FACC15] border border-[#10B981]/35 transition-all shadow-md active:scale-[0.98]"
            >
              <MessageSquare className="h-4 w-4 text-[#10B981]" />
              <span>{w.success.whatsappCta}</span>
            </a>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  idempotencyKeyRef.current = "";
                  setSubmittedReference(null);
                  setSubmissionError(null);
                }}
                className="font-bold text-[#0F284E] hover:text-[#063726] underline underline-offset-4 cursor-pointer"
              >
                {w.success.submitAnother}
              </button>
              <span className="text-slate-300">·</span>
              <Link
                href="/fleet"
                className="font-bold text-[#063726] hover:underline underline-offset-4"
              >
                {w.success.browseFleet}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // OFFICIAL SINGLE-PAGE CHECKOUT VIEW
  // ----------------------------------------------------
  const inputBaseClass =
    "w-full rounded-xl border bg-[#F8FAFC] px-3.5 py-2.5 text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-v={CLIENT_BUILD_VERSION}
      data-icon={Boolean(_keepIconFactory)}
      className="w-full"
    >
      {/* Mobile Selected Vehicle / Service Quick Banner */}
      <div className="lg:hidden mb-6 rounded-2xl border border-[#0F284E]/15 bg-gradient-to-r from-[#091A34] via-[#0F284E] to-[#063726] p-3.5 text-white shadow-md flex items-center gap-3.5">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F1F5F9] border border-[#FACC15]/45">
          {showVehiclePhoto && vehicleSlot ? (
            <Image
              src={vehicleSlot.publicPath}
              alt={vehicleSlot.alt || selectedVehicle?.name || w.selectedVehicle}
              fill
              sizes="96px"
              className="object-cover object-center"
              onError={() => setBrokenVehicleImgPath(vehicleSlot.publicPath)}
            />
          ) : (
            <Image
              src={selectedVisual.image}
              alt={selectedVisual.alt}
              fill
              placeholder="blur"
              sizes="96px"
              className="object-cover object-center"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FACC15] block">
            {selectedVehicle ? w.selectedVehicle : w.selectedService}
          </span>
          <p className="text-sm font-extrabold text-white truncate">
            {selectedVehicle?.name || selectedService?.name}
          </p>
          <p className="text-[11px] text-slate-300 truncate mt-0.5">
            {selectedVehicle
              ? `${selectedService?.name}${
                  selectedVehicle.passengerCapacity
                    ? ` · ${selectedVehicle.passengerCapacity} ${dict.common.seatsLabel}`
                    : ""
                }`
              : selectedVisual.fleetTag}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
        {/* LEFT COLUMN: CHECKOUT FORM DETAILS */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 01: SERVICE & VEHICLE */}
          <section className="rounded-3xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#F1F5F9] bg-[#F8FAFC]/80 px-6 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F284E] text-xs font-black text-[#FACC15]">
                  01
                </span>
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#0F284E]">
                  {w.section01Title}
                </h2>
              </div>
              <Link
                href="/fleet"
                className="text-xs font-bold text-[#063726] hover:underline underline-offset-4 shrink-0"
              >
                {w.viewAllVehicles}
              </Link>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="serviceType"
                  className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#063726]" />
                  {w.transportServiceLabel}
                </label>
                <select
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => updateField("serviceType", e.target.value)}
                  className={`${inputBaseClass} border-[#CBD5E1] focus:border-[#0F284E]`}
                >
                  {localizedServices.map((srv) => (
                    <option key={srv.id} value={srv.slug}>
                      {srv.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="preferredVehicleSlug"
                  className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                >
                  <CarFront className="h-3.5 w-3.5 text-[#063726]" />
                  {w.preferredVehicleLabel}
                </label>
                <select
                  id="preferredVehicleSlug"
                  value={formData.preferredVehicleSlug}
                  onChange={(e) =>
                    updateField("preferredVehicleSlug", e.target.value)
                  }
                  className={`${inputBaseClass} border-[#CBD5E1] focus:border-[#0F284E]`}
                >
                  <option value="">
                    {w.noPreferenceOption}
                  </option>
                  {localizedVehicles.map((v) => (
                    <option key={v.id} value={v.slug}>
                      {v.name}
                      {v.passengerCapacity
                        ? ` (${v.passengerCapacity} ${dict.common.seatsLabel})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 02: JOURNEY SCHEDULE, ROUTE & PASSENGERS */}
          <section className="rounded-3xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#F1F5F9] bg-[#F8FAFC]/80 px-6 py-4 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#063726] text-xs font-black text-[#FACC15]">
                02
              </span>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#0F284E]">
                {w.section02Title}
              </h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="pickupLocation"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#063726]" />
                    {w.pickupLocationLabel}
                  </label>
                  <input
                    id="pickupLocation"
                    type="text"
                    required
                    placeholder={w.pickupLocationPlaceholder}
                    value={formData.pickupLocation}
                    onChange={(e) =>
                      updateField("pickupLocation", e.target.value)
                    }
                    className={`${inputBaseClass} ${
                      fieldErrors.pickupLocation
                        ? "border-red-500 bg-red-50/40 focus:border-red-600"
                        : "border-[#CBD5E1] focus:border-[#0F284E]"
                    }`}
                  />
                  {fieldErrors.pickupLocation && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {fieldErrors.pickupLocation}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="dropoffLocation"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#059669]" />
                    {w.dropoffLabel}
                  </label>
                  <input
                    id="dropoffLocation"
                    type="text"
                    placeholder={w.dropoffPlaceholder}
                    value={formData.dropoffLocation}
                    onChange={(e) =>
                      updateField("dropoffLocation", e.target.value)
                    }
                    className={`${inputBaseClass} border-[#CBD5E1] focus:border-[#0F284E]`}
                  />
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="pickupDate"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#063726]" />
                    {w.pickupDateLabel}
                  </label>
                  <input
                    id="pickupDate"
                    type="date"
                    required
                    min={minToday || undefined}
                    value={formData.pickupDate}
                    onChange={(e) => updateField("pickupDate", e.target.value)}
                    className={`${inputBaseClass} ${
                      fieldErrors.pickupDate
                        ? "border-red-500 bg-red-50/40 focus:border-red-600"
                        : "border-[#CBD5E1] focus:border-[#0F284E]"
                    }`}
                  />
                  {fieldErrors.pickupDate && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {fieldErrors.pickupDate}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="pickupTime"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                  >
                    <Clock className="h-3.5 w-3.5 text-[#063726]" />
                    {w.pickupTimeLabel}
                  </label>
                  <input
                    id="pickupTime"
                    type="time"
                    required
                    value={formData.pickupTime}
                    onChange={(e) => updateField("pickupTime", e.target.value)}
                    className={`${inputBaseClass} ${
                      fieldErrors.pickupTime
                        ? "border-red-500 bg-red-50/40 focus:border-red-600"
                        : "border-[#CBD5E1] focus:border-[#0F284E]"
                    }`}
                  />
                  {fieldErrors.pickupTime && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {fieldErrors.pickupTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Return Date & Return Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-[#063726]/20 bg-[#ECFDF5]/40 p-4 sm:p-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="returnDate"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#063726] flex items-center gap-1.5"
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#0F284E]" />
                    {w.returnDateLabel}
                  </label>
                  <input
                    id="returnDate"
                    type="date"
                    min={formData.pickupDate || minToday || undefined}
                    value={formData.returnDate}
                    onChange={(e) => updateField("returnDate", e.target.value)}
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:outline-none ${
                      fieldErrors.returnDate
                        ? "border-red-500 focus:border-red-600"
                        : "border-[#CBD5E1] focus:border-[#063726]"
                    }`}
                  />
                  {fieldErrors.returnDate && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {fieldErrors.returnDate}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="returnTime"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#063726] flex items-center gap-1.5"
                  >
                    <Clock className="h-3.5 w-3.5 text-[#0F284E]" />
                    {w.returnTimeLabel}
                  </label>
                  <input
                    id="returnTime"
                    type="time"
                    value={formData.returnTime}
                    onChange={(e) => updateField("returnTime", e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:border-[#063726] focus:outline-none"
                  />
                </div>
              </div>

              {/* Contextual Service Fields */}
              {formData.serviceType === "airport-transfer" && (
                <div className="rounded-2xl border border-[#063726]/25 bg-[#ECFDF5]/60 p-5 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#063726] flex items-center gap-2">
                    <Plane className="h-4 w-4 text-[#0F284E]" />
                    {w.airportTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="airportDirection"
                        className="text-xs font-bold text-[#0F284E]"
                      >
                        {w.directionLabel}
                      </label>
                      <select
                        id="airportDirection"
                        value={formData.airportDirection}
                        onChange={(e) =>
                          updateField(
                            "airportDirection",
                            e.target.value as "arrival" | "departure"
                          )
                        }
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:border-[#063726] focus:outline-none"
                      >
                        <option value="arrival">{w.directionArrival}</option>
                        <option value="departure">{w.directionDeparture}</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="flightNumber"
                        className="text-xs font-bold text-[#0F284E]"
                      >
                        {w.flightNumberLabel}
                      </label>
                      <input
                        id="flightNumber"
                        type="text"
                        placeholder={w.flightNumberPlaceholder}
                        value={formData.flightNumber}
                        onChange={(e) =>
                          updateField("flightNumber", e.target.value)
                        }
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:border-[#063726] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.serviceType === "wedding-event" && (
                <div className="rounded-2xl border border-[#0F284E]/20 bg-[#FEF9C3]/35 p-5 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#063726]" />
                    {w.weddingTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="venues"
                        className="text-xs font-bold text-[#0F284E]"
                      >
                        {w.venuesLabel}
                      </label>
                      <input
                        id="venues"
                        type="text"
                        placeholder={w.venuesPlaceholder}
                        value={formData.venues}
                        onChange={(e) => updateField("venues", e.target.value)}
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:border-[#0F284E] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="approximateGuests"
                        className="text-xs font-bold text-[#0F284E]"
                      >
                        {w.guestsLabel}
                      </label>
                      <input
                        id="approximateGuests"
                        type="number"
                        min={1}
                        value={formData.approximateGuests}
                        onChange={(e) =>
                          updateField(
                            "approximateGuests",
                            parseInt(e.target.value, 10) || 1
                          )
                        }
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:border-[#0F284E] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(formData.serviceType === "group-transport" ||
                formData.serviceType === "corporate-transport") && (
                <div className="rounded-2xl border border-[#0F284E]/20 bg-[#F8FAFC] p-5 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#063726]" />
                    {w.groupTitle}
                  </h3>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="routeItinerarySummary"
                      className="text-xs font-bold text-[#475569]"
                    >
                      {w.itineraryLabel}
                    </label>
                    <input
                      id="routeItinerarySummary"
                      type="text"
                      placeholder={w.itineraryPlaceholder}
                      value={formData.routeItinerarySummary}
                      onChange={(e) =>
                        updateField("routeItinerarySummary", e.target.value)
                      }
                      className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:border-[#0F284E] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Passengers */}
              <div className="space-y-1.5">
                <label
                  htmlFor="passengerCount"
                  className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                >
                  <Users className="h-3.5 w-3.5 text-[#063726]" />
                  {w.passengerCountLabel}
                </label>
                <input
                  id="passengerCount"
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={formData.passengerCount}
                  onChange={(e) =>
                    updateField(
                      "passengerCount",
                      parseInt(e.target.value, 10) || 1
                    )
                  }
                  className={`w-full sm:w-48 rounded-xl border bg-[#F8FAFC] px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:outline-none ${
                    fieldErrors.passengerCount
                      ? "border-red-500 focus:border-red-600"
                      : "border-[#CBD5E1] focus:border-[#0F284E]"
                  }`}
                />
                {fieldErrors.passengerCount && (
                  <p className="text-[11px] font-semibold text-red-600">
                    {fieldErrors.passengerCount}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 03: CONTACT & TRAVELLER DETAILS */}
          <section className="rounded-3xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#F1F5F9] bg-[#F8FAFC]/80 px-6 py-4 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FACC15] text-xs font-black text-[#091A34]">
                03
              </span>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#0F284E]">
                {w.section03Title}
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="customerName"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E]"
                  >
                    {w.customerNameLabel}
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    required
                    placeholder={w.customerNamePlaceholder}
                    value={formData.customerName}
                    onChange={(e) =>
                      updateField("customerName", e.target.value)
                    }
                    className={`${inputBaseClass} ${
                      fieldErrors.customerName
                        ? "border-red-500 bg-red-50/40 focus:border-red-600"
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
                    htmlFor="customerEmail"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5 text-[#063726]" />
                    {w.customerEmailLabel}
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    required
                    placeholder={w.customerEmailPlaceholder}
                    value={formData.customerEmail}
                    onChange={(e) =>
                      updateField("customerEmail", e.target.value)
                    }
                    className={`${inputBaseClass} ${
                      fieldErrors.customerEmail
                        ? "border-red-500 bg-red-50/40 focus:border-red-600"
                        : "border-[#CBD5E1] focus:border-[#0F284E]"
                    }`}
                  />
                  {fieldErrors.customerEmail && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {fieldErrors.customerEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="customerPhone"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E] flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#063726]" />
                    {w.customerPhoneLabel}
                  </label>
                  <input
                    id="customerPhone"
                    type="tel"
                    required
                    placeholder={w.customerPhonePlaceholder}
                    value={formData.customerPhone}
                    onChange={(e) =>
                      updateField("customerPhone", e.target.value)
                    }
                    className={`${inputBaseClass} ${
                      fieldErrors.customerPhone
                        ? "border-red-500 bg-red-50/40 focus:border-red-600"
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
                    htmlFor="preferredContactMethod"
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E]"
                  >
                    {w.preferredContactLabel}
                  </label>
                  <select
                    id="preferredContactMethod"
                    value={formData.preferredContactMethod}
                    onChange={(e) =>
                      updateField(
                        "preferredContactMethod",
                        e.target.value as "whatsapp" | "phone" | "email"
                      )
                    }
                    className={`${inputBaseClass} border-[#CBD5E1] focus:border-[#0F284E]`}
                  >
                    <option value="whatsapp">{w.contactOptions.whatsappRecommended}</option>
                    <option value="phone">{w.contactOptions.phone}</option>
                    <option value="email">{w.contactOptions.email}</option>
                  </select>
                </div>
              </div>

              {/* Arranging for someone else toggle */}
              <div className="rounded-2xl border border-[#063726]/20 p-4 bg-[#ECFDF5]/45">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    id="bookingForSomeoneElse"
                    type="checkbox"
                    checked={formData.bookingForSomeoneElse}
                    onChange={(e) =>
                      updateField("bookingForSomeoneElse", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#CBD5E1] text-[#063726] focus:ring-[#0F284E]"
                  />
                  <span className="text-xs font-extrabold text-[#0F284E]">
                    {w.bookingForSomeoneElseLabel}
                  </span>
                </label>

                {formData.bookingForSomeoneElse && (
                  <div className="mt-4 pt-3 border-t border-[#A7F3D0] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="travellerName"
                        className="text-[11px] font-bold text-[#063726]"
                      >
                        {w.travellerNameLabel}
                      </label>
                      <input
                        id="travellerName"
                        type="text"
                        placeholder={w.travellerNamePlaceholder}
                        value={formData.travellerName}
                        onChange={(e) =>
                          updateField("travellerName", e.target.value)
                        }
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#063726] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="travellerPhone"
                        className="text-[11px] font-bold text-[#063726]"
                      >
                        {w.travellerPhoneLabel}
                      </label>
                      <input
                        id="travellerPhone"
                        type="tel"
                        placeholder={w.travellerPhonePlaceholder}
                        value={formData.travellerPhone}
                        onChange={(e) =>
                          updateField("travellerPhone", e.target.value)
                        }
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#0F172A] focus:border-[#063726] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="space-y-1.5">
                <label
                  htmlFor="customerNotes"
                  className="text-xs font-extrabold uppercase tracking-wider text-[#0F284E]"
                >
                  {w.customerNotesLabel}
                </label>
                <textarea
                  id="customerNotes"
                  rows={3}
                  placeholder={w.customerNotesPlaceholder}
                  value={formData.customerNotes}
                  onChange={(e) =>
                    updateField("customerNotes", e.target.value)
                  }
                  className={`${inputBaseClass} border-[#CBD5E1] focus:border-[#0F284E]`}
                />
              </div>

              {/* Honeypot hidden input */}
              <input
                type="text"
                name="website_url"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                value={formData.website_url}
                onChange={(e) => updateField("website_url", e.target.value)}
                className="hidden"
              />
            </div>
          </section>
        </div>

        {/* RIGHT STICKY COLUMN: OFFICIAL CHECKOUT ORDER SUMMARY */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
          <div className="rounded-3xl border border-[#E2E8F0] bg-white shadow-xl overflow-hidden">
            {/* Signature Tri-Color Bar */}
            <div className="h-1.5 w-full flex">
              <div className="w-[40%] bg-[#0F284E]" />
              <div className="w-[35%] bg-[#063726]" />
              <div className="w-[25%] bg-[#FACC15]" />
            </div>

            <div className="p-6 space-y-5">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#063726]">
                  {w.summaryEyebrow}
                </span>
                <h3 className="text-xl font-extrabold tracking-tight text-[#0F284E] mt-0.5">
                  {selectedVehicle
                    ? selectedVehicle.name
                    : selectedService?.name || w.summaryFallbackTitle}
                </h3>
              </div>

              {/* Preview Image */}
              <div
                className={`relative w-full overflow-hidden rounded-2xl border border-[#E2E8F0] ${
                  showVehiclePhoto
                    ? "aspect-[3/2] bg-[#F1F5F9]"
                    : "aspect-[16/10] bg-[#091A34]"
                }`}
              >
                {showVehiclePhoto && vehicleSlot ? (
                  <Image
                    src={vehicleSlot.publicPath}
                    alt={vehicleSlot.alt || selectedVehicle?.name || w.summaryLabels.vehicle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-cover object-center"
                    onError={() =>
                      setBrokenVehicleImgPath(vehicleSlot.publicPath)
                    }
                  />
                ) : (
                  <Image
                    src={selectedVisual.image}
                    alt={selectedVisual.alt}
                    fill
                    placeholder="blur"
                    sizes="(max-width: 1024px) 100vw, 440px"
                    className="object-cover object-center"
                  />
                )}
              </div>

              {/* Spec Badges if Vehicle Selected */}
              {selectedVehicle && (
                <div className="flex flex-wrap gap-2">
                  {selectedVehicle.passengerCapacity !== null && (
                    <span className="rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 text-[11px] font-bold text-[#063726]">
                      {selectedVehicle.passengerCapacity} {dict.common.seatsLabel}
                    </span>
                  )}
                  {selectedVehicle.transmission && (
                    <span className="rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-bold text-[#0F284E]">
                      {selectedVehicle.transmission}
                    </span>
                  )}
                  {selectedVehicle.fuelType && (
                    <span className="rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-bold text-[#475569]">
                      {selectedVehicle.fuelType}
                    </span>
                  )}
                </div>
              )}

              {/* Live Summary Lines */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-2.5 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#64748B] font-semibold">{w.summaryLabels.service}</span>
                  <span className="font-extrabold text-[#0F284E] text-right">
                    {selectedService?.name || formData.serviceType}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#64748B] font-semibold">{w.summaryLabels.vehicle}</span>
                  <span className="font-bold text-[#0F284E] text-right">
                    {selectedVehicle?.name || w.bestMatchedVehicle}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#64748B] font-semibold">{w.summaryLabels.route}</span>
                  <span className="font-bold text-[#0F284E] text-right">
                    {formData.pickupLocation.trim()
                      ? formData.dropoffLocation.trim()
                        ? `${formData.pickupLocation.trim()} → ${formData.dropoffLocation.trim()}`
                        : formData.pickupLocation.trim()
                      : w.enterPickupPrompt}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#64748B] font-semibold">{w.summaryLabels.pickup}</span>
                  <span className="font-bold text-[#0F284E] text-right">
                    {formData.pickupDate
                      ? `${formData.pickupDate} · ${formData.pickupTime} CAT`
                      : w.selectDatePrompt}
                  </span>
                </div>

                {formData.returnDate && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[#64748B] font-semibold">{w.summaryLabels.return}</span>
                    <span className="font-bold text-[#063726] text-right">
                      {formData.returnDate}
                      {formData.returnTime ? ` · ${formData.returnTime} CAT` : ""}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#64748B] font-semibold">
                    {w.summaryLabels.passengers}
                  </span>
                  <span className="font-bold text-[#0F284E] text-right">
                    {formData.passengerCount}{" "}
                    {formData.passengerCount === 1
                      ? w.passengerSingular
                      : w.passengerPlural}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <span className="text-[#063726] font-extrabold uppercase tracking-wider text-[11px]">
                    {w.summaryLabels.upfrontDue}
                  </span>
                  <span className="rounded-lg bg-[#FEF9C3] border border-[#FACC15] px-2.5 py-1 font-extrabold text-[#0F284E]">
                    {w.upfrontBadge}
                  </span>
                </div>
              </div>

              {/* Error Feedback */}
              {submissionError && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-700 flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Privacy Consent Checkbox */}
              <div
                className={`rounded-2xl border p-3.5 transition-colors ${
                  fieldErrors.privacyAccepted
                    ? "border-red-400 bg-red-50/50"
                    : "border-[#0F284E]/15 bg-[#FEF9C3]/35"
                }`}
              >
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="privacyAccepted"
                    type="checkbox"
                    required
                    checked={formData.privacyAccepted}
                    onChange={(e) =>
                      updateField("privacyAccepted", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#CBD5E1] text-[#0F284E] mt-0.5 shrink-0"
                  />
                  <span className="text-[11px] sm:text-xs text-[#0F284E] font-medium leading-relaxed">
                    {w.privacyConsent}
                  </span>
                </label>
              </div>

              {/* Primary Checkout Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#091A34] shadow-md active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{w.submittingCta}</span>
                ) : (
                  <>
                    <span>{w.submitCta}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#063726] text-[#FACC15]">
                      <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#475569]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                <span>{w.fastDispatchNote}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
