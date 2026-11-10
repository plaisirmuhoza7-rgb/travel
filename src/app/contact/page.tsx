import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ArrowRight,
  Navigation,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.contactTitle,
    description: dict.metadata.contactDescription,
  };
}

export default async function ContactPage() {
  const { dict } = await getServerDictionary();
  const c = dict.contact;
  const whatsappUrl = `https://wa.me/250784129579?text=${encodeURIComponent(c.whatsappGreeting)}`;

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-80px)] py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FACC15]/60 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0F284E] mb-4 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            <span>{c.hubBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F284E] leading-[1.15]">
            {c.title}<span className="text-[#FACC15]">.</span>
          </h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-[#FACC15]" />
          <p className="text-base sm:text-lg text-slate-500 mt-4 leading-relaxed">
            {c.subtitle}
          </p>
        </div>

        {/* Main Grid: Left Direct Channels & Gahanga Hub | Right Spacious Webform */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct Info & Location */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Contact Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 space-y-6 shadow-[0_4px_30px_rgba(15,40,78,0.04)]">
              {/* Decorative Dual-Tone Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="w-2/3 bg-[#0F284E]" />
                <div className="w-1/3 bg-[#FACC15]" />
              </div>

              {/* Phone Lines */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8FAFC] border border-slate-200 text-[#0F284E] shrink-0 mt-0.5">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {c.phoneLinesLabel}
                  </span>
                  <div className="space-y-1">
                    <a
                      href="tel:+250784129579"
                      className="text-base font-extrabold text-[#0F284E] hover:text-[#1A3E72] block transition-colors"
                    >
                      +250 784 129 579
                    </a>
                    <a
                      href="tel:+250781782882"
                      className="text-sm font-semibold text-slate-500 hover:text-[#0F284E] block transition-colors"
                    >
                      +250 781 782 882
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4 pt-5 border-t border-slate-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#059669] shrink-0 mt-0.5">
                  <MessageSquare className="h-5 w-5 text-[#10B981]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {c.whatsappChatLabel}
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-extrabold text-[#0F284E] hover:text-[#059669] inline-flex items-center gap-2 transition-colors"
                  >
                    <span>+250 784 129 579</span>
                    <ArrowRight className="h-4 w-4 text-[#10B981]" />
                  </a>
                </div>
              </div>

              {/* Location (Highlighted with Navy & Yellow Accent) */}
              <div className="flex items-start gap-4 pt-5 border-t border-slate-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F284E] text-[#FACC15] shadow-xs shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {c.operationsHubLabel}
                  </span>
                  <p className="text-base font-extrabold text-[#0F284E]">
                    {c.operationsHubAddress}
                  </p>
                  <p className="text-xs text-slate-500">
                    {c.operationsHubSub}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 pt-5 border-t border-slate-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8FAFC] border border-slate-200 text-[#0F284E] shrink-0 mt-0.5">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {c.workingScheduleLabel}
                  </span>
                  <p className="text-sm font-semibold text-[#0F284E]">
                    {c.workingScheduleMain}
                  </p>
                  <p className="text-xs text-slate-500">
                    {c.workingScheduleHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Clean Map Preview */}
            <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-[0_4px_30px_rgba(15,40,78,0.04)]">
              <div className="h-64 sm:h-72 w-full bg-[#F1F5F9] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] relative">
                <iframe
                  title={c.mapTitle}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=30.0800%2C-2.0420%2C30.1250%2C-2.0080&layer=mapnik&marker=-2.0278%2C30.1045"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  className="w-full h-full relative z-10"
                />
                <div className="pointer-events-none absolute top-3 left-3 z-20 inline-flex items-center gap-2 rounded-full bg-[#0F284E]/95 border border-[#FACC15]/40 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" />
                  <span>{c.mapBadge}</span>
                </div>
              </div>
              <div className="p-4 bg-white flex items-center justify-between text-xs border-t border-slate-100">
                <span className="font-semibold text-[#0F284E]">{c.mapYardLabel}</span>
                <a
                  href="https://maps.google.com/?q=Gahanga+Center,+Kicukiro,+Kigali,+Rwanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF9C3] border border-[#FACC15]/70 px-3 py-1 font-bold text-[#0F284E] hover:bg-[#FACC15] transition-colors"
                >
                  <Navigation className="h-3 w-3 text-[#0F284E]" />
                  <span>{c.openDirections}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Spacious & Minimalist Webform */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* Minimal Sub-Links Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {c.footerIdentity}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/plan-your-journey" className="font-semibold text-[#0F284E] hover:text-[#225193] transition-colors">
              {c.footerPlanLink}
            </Link>
            <Link href="/about" className="hover:text-[#0F284E] transition-colors">
              {c.footerAboutLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
