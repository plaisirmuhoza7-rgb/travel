import { z } from "zod";
import { DEFAULT_LOCALE, Locale, getDictionary } from "@/lib/i18n";

export function createContactFormSchema(locale: Locale = DEFAULT_LOCALE) {
  const m = getDictionary(locale).api.contactValidation;

  return z.object({
    idempotencyKey: z.string({ error: m.invalidText }).optional(),
    fullName: z
      .string({ error: m.fullName })
      .trim()
      .min(2, m.fullName),
    email: z
      .string({ error: m.email })
      .trim()
      .email(m.email),
    phone: z
      .string({ error: m.phone })
      .trim()
      .min(6, m.phone),
    service: z
      .string({ error: m.service })
      .trim()
      .min(1, m.service),
    preferredContact: z.enum(["whatsapp", "phone", "email"], {
      error: m.preferredContact,
    }),
    message: z
      .string({ error: m.message })
      .trim()
      .min(5, m.message),
    // Honeypot field for bot protection
    website_hp: z.string({ error: m.invalidText }).optional(),
  });
}

export const ContactFormSchema = createContactFormSchema(DEFAULT_LOCALE);

export type ContactFormData = z.infer<typeof ContactFormSchema>;
