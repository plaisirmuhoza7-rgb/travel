"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import { useI18n } from "@/components/i18n/LocaleProvider";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredContact: "whatsapp" | "phone" | "email";
  message: string;
  website_hp: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  service: "Airport Transfer (Kigali KGL)",
  preferredContact: "whatsapp",
  message: "",
  website_hp: "",
};

export function ContactForm() {
  const { locale, dict } = useI18n();
  const f = dict.contact.form;

  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    referenceCode: string;
    submittedName: string;
    preferredMethod: FormState["preferredContact"];
    message: string;
  } | null>(null);

  const validateClient = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (formData.fullName.trim().length < 2) {
      errors.fullName = f.errors.fullName;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = f.errors.email;
    }
    if (formData.phone.trim().length < 6) {
      errors.phone = f.errors.phone;
    }
    if (formData.message.trim().length < 5) {
      errors.message = f.errors.message;
    }
    return errors;
  };

  const handleFieldChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (errorMsg) {
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const errors = validateClient();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg(f.errors.summary);
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const el = document.getElementById(firstErrorField);
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          locale,
          idempotencyKey:
            typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
              ? crypto.randomUUID()
              : undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || f.errors.unableToSend);
      }

      setSuccessData({
        referenceCode: json.referenceCode,
        submittedName: formData.fullName.trim(),
        preferredMethod: formData.preferredContact,
        message: formData.message.trim(),
      });
      setFormData(INITIAL_FORM);
      setFieldErrors({});
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : f.errors.genericError;
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setErrorMsg(null);
    setFieldErrors({});
    setFormData(INITIAL_FORM);
  };

  const getWhatsAppFollowupLink = () => {
    if (!successData) return "https://wa.me/250784129579";
    const text = encodeURIComponent(
      `${f.whatsappFollowup.greeting}\n\n${f.whatsappFollowup.introPrefix}${successData.referenceCode}${f.whatsappFollowup.forWord}${successData.submittedName}.\n\n${f.whatsappFollowup.previewLabel}"${successData.message.slice(0, 110)}..."\n\n${f.whatsappFollowup.closing}`
    );
    return `https://wa.me/250784129579?text=${text}`;
  };

  if (successData) {
    return (
      <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 lg:p-14 shadow-[0_4px_30px_rgba(15,40,78,0.04)] text-center transition-all">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#10B981] ring-8 ring-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
        </div>

        <div className="mt-6 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#059669]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            {f.successBadge}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F284E] tracking-tight">
            {f.successTitlePrefix}{successData.submittedName.split(" ")[0]}!
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {f.successBodyBefore}<strong>{f.successBodyOffice}</strong>{f.successBodyMiddle}
            <span className="font-bold text-[#0F284E]">{f.replyMethods[successData.preferredMethod]}</span>
            {f.successBodyEnd}
          </p>
        </div>

        {/* Reference Code Box */}
        <div className="mt-8 rounded-2xl bg-[#F8FAFC] border border-[#FACC15]/70 p-5 max-w-sm mx-auto">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            {f.referenceCodeLabel}
          </p>
          <p className="font-mono text-lg font-extrabold text-[#0F284E] tracking-tight mt-0.5">
            {successData.referenceCode}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={getWhatsAppFollowupLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#0F284E] hover:bg-[#1A3E72] px-7 py-4 text-sm font-bold text-white shadow-sm hover:shadow active:scale-[0.99] transition-all"
          >
            <MessageSquare className="h-4 w-4 text-[#10B981]" />
            <span>{f.speedUpWhatsapp}</span>
            <ArrowRight className="h-4 w-4 text-slate-300" />
          </a>

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-700 transition-all"
          >
            <RotateCcw className="h-4 w-4 text-slate-400" />
            <span>{f.sendAnother}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 lg:p-12 shadow-[0_4px_30px_rgba(15,40,78,0.04)]">
      {/* Decorative Dual-Tone Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="w-2/3 bg-[#0F284E]" />
        <div className="w-1/3 bg-[#FACC15]" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FACC15]/50 bg-[#FEF9C3]/40 px-3 py-1 text-xs font-semibold text-[#0F284E] mb-3">
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{f.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F284E] tracking-tight">
          {f.title}
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          {f.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Anti-spam honeypot */}
        <input
          type="text"
          name="website_hp"
          value={formData.website_hp}
          onChange={(e) => handleFieldChange("website_hp", e.target.value)}
          className="sr-only"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-semibold text-[#0F284E]">
            {f.fullNameLabel}
          </label>
          <input
            id="fullName"
            type="text"
            required
            aria-invalid={Boolean(fieldErrors.fullName)}
            value={formData.fullName}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            placeholder={f.fullNamePlaceholder}
            className={`w-full h-13 px-4.5 rounded-2xl border bg-slate-50/40 hover:bg-white text-slate-900 text-sm sm:text-base placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ${
              fieldErrors.fullName
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                : "border-slate-200 focus:border-[#0F284E] focus:ring-[#0F284E]/10"
            }`}
          />
          {fieldErrors.fullName && (
            <p className="text-xs font-medium text-rose-600">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-[#0F284E]">
              {f.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              required
              aria-invalid={Boolean(fieldErrors.email)}
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder={f.emailPlaceholder}
              className={`w-full h-13 px-4.5 rounded-2xl border bg-slate-50/40 hover:bg-white text-slate-900 text-sm sm:text-base placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ${
                fieldErrors.email
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 focus:border-[#0F284E] focus:ring-[#0F284E]/10"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-xs font-medium text-rose-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-[#0F284E]">
              {f.phoneLabel}
            </label>
            <input
              id="phone"
              type="tel"
              required
              aria-invalid={Boolean(fieldErrors.phone)}
              value={formData.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              placeholder={f.phonePlaceholder}
              className={`w-full h-13 px-4.5 rounded-2xl border bg-slate-50/40 hover:bg-white text-slate-900 text-sm sm:text-base placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ${
                fieldErrors.phone
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                  : "border-slate-200 focus:border-[#0F284E] focus:ring-[#0F284E]/10"
              }`}
            />
            {fieldErrors.phone && (
              <p className="text-xs font-medium text-rose-600">{fieldErrors.phone}</p>
            )}
          </div>
        </div>

        {/* Service of Interest */}
        <div className="space-y-2">
          <label htmlFor="service" className="block text-sm font-semibold text-[#0F284E]">
            {f.serviceLabel}
          </label>
          <div className="relative">
            <select
              id="service"
              value={formData.service}
              onChange={(e) => handleFieldChange("service", e.target.value)}
              className="w-full h-13 px-4.5 pr-10 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white text-slate-900 text-sm sm:text-base focus:bg-white focus:border-[#0F284E] focus:ring-4 focus:ring-[#0F284E]/10 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
            >
              {f.serviceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Preferred Channel */}
        <div className="space-y-2.5">
          <label className="block text-sm font-semibold text-[#0F284E]">
            {f.replyMethodLabel}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "whatsapp" as const, label: f.replyMethods.whatsapp, iconDot: true },
              { id: "phone" as const, label: f.replyMethods.phone },
              { id: "email" as const, label: f.replyMethods.email },
            ].map((method) => {
              const active = formData.preferredContact === method.id;
              return (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => handleFieldChange("preferredContact", method.id)}
                  className={`h-12 px-2 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-center leading-tight ${
                    active
                      ? "border-[#0F284E] bg-[#0F284E] text-white shadow-xs"
                      : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {method.iconDot && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                        active ? "bg-[#10B981]" : "bg-emerald-500"
                      }`}
                    />
                  )}
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-semibold text-[#0F284E]">
            {f.messageLabel}
          </label>
          <textarea
            id="message"
            required
            rows={4}
            aria-invalid={Boolean(fieldErrors.message)}
            value={formData.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            placeholder={f.messagePlaceholder}
            className={`w-full p-4.5 rounded-2xl border bg-slate-50/40 hover:bg-white text-slate-900 text-sm sm:text-base placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 resize-none min-h-[130px] ${
              fieldErrors.message
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                : "border-slate-200 focus:border-[#0F284E] focus:ring-[#0F284E]/10"
            }`}
          />
          {fieldErrors.message && (
            <p className="text-xs font-medium text-rose-600">{fieldErrors.message}</p>
          )}
        </div>

        {/* Error banner directly above submit so it's always visible */}
        {errorMsg && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs sm:text-sm text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-14 rounded-2xl bg-[#0F284E] hover:bg-[#1A3E72] active:scale-[0.99] text-white text-sm sm:text-base font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-[#FACC15]" />
                <span>{f.submittingButton}</span>
              </>
            ) : (
              <>
                <span>{f.submitButton}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FACC15] text-[#091A34] transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </span>
              </>
            )}
          </button>
        </div>

        {/* Trust Footnote */}
        <div className="pt-1 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0" />
          <span>{f.privacyNote}</span>
        </div>
      </form>
    </div>
  );
}
