import React from "react";
import { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { repository } from "@/lib/repository";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.privacyTitle,
    description: dict.metadata.privacyDescription,
    robots: "noindex, follow", // Owner review draft
  };
}

export default async function PrivacyPage() {
  const settings = repository.getSettings();
  const { dict } = await getServerDictionary();
  const pr = dict.privacy;

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {!settings.policiesApproved && (
        <div className="mb-8 rounded-md border border-[#BCA77B]/40 bg-[#0B3D2E]/5 p-4 text-xs text-[#0B3D2E] flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-[#BCA77B] shrink-0 mt-0.5" />
          <div>
            <strong>{pr.draftPrefix}</strong> {pr.draftBody}
          </div>
        </div>
      )}

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BCA77B]">
          {pr.eyebrow}
        </span>
        <h1 className="font-display text-4xl font-semibold text-[#0B3D2E] mt-1">
          {pr.title}
        </h1>
        <p className="text-xs text-[#171D19]/60 mt-2 font-mono">
          {pr.lastRevised}
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-sm text-[#171D19]/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{pr.s1Title}</h2>
          <p>{pr.s1Body}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{pr.s2Title}</h2>
          <p>{pr.s2Intro}</p>
          <ul className="list-disc pl-5 space-y-1">
            {pr.s2List.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <p>
            {pr.s2NoteBeforeStrong}
            <strong>{pr.s2NoteStrong}</strong>
            {pr.s2NoteAfterStrong}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{pr.s3Title}</h2>
          <p>{pr.s3Body}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{pr.s4Title}</h2>
          <p>{pr.s4Body}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-[#0B3D2E]">{pr.s5Title}</h2>
          <p>{pr.s5Body}</p>
        </section>
      </div>
    </div>
  );
}
