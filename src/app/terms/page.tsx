import React from "react";
import { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { repository } from "@/lib/repository";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.termsTitle,
    description: dict.metadata.termsDescription,
    robots: "noindex, follow", // Owner review draft
  };
}

export default async function TermsPage() {
  const settings = repository.getSettings();
  const { dict } = await getServerDictionary();
  const t = dict.terms;

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {!settings.policiesApproved && (
        <div className="mb-8 rounded-md border border-[#BCA77B]/40 bg-[#0B3D2E]/5 p-4 text-xs text-[#0B3D2E] flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-[#BCA77B] shrink-0 mt-0.5" />
          <div>
            <strong>{t.draftPrefix}</strong> {t.draftBody}
          </div>
        </div>
      )}

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BCA77B]">
          {t.eyebrow}
        </span>
        <h1 className="font-display text-4xl font-semibold text-[#0B3D2E] mt-1">
          {t.title}
        </h1>
        <p className="text-xs text-[#171D19]/60 mt-2 font-mono">
          {t.lastRevised}
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-sm text-[#171D19]/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{t.s1Title}</h2>
          <p>
            {t.s1BeforeStrong}
            <strong>{t.s1Strong}</strong>
            {t.s1AfterStrong}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{t.s2Title}</h2>
          <p>{t.s2Body}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{t.s3Title}</h2>
          <p>{t.s3Body}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{t.s4Title}</h2>
          <p>{t.s4Body}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{t.s5Title}</h2>
          <p>{t.s5Body}</p>
        </section>
      </div>
    </div>
  );
}
