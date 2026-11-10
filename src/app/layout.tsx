import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLdSchema } from "@/components/seo/JsonLdSchema";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getServerDictionary } from "@/lib/i18n/server";

// Premium modern geometric sans matching the Huriza aesthetic
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["Inter", "system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();

  return {
    title: dict.metadata.siteTitle,
    description: dict.metadata.siteDescription,
    keywords: dict.metadata.keywords,
    authors: [{ name: dict.common.brandName }],
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: dict.common.brandName,
    },
    openGraph: {
      locale: dict.metadata.ogLocale,
    },
    formatDetection: {
      telephone: true,
      date: true,
      email: true,
      address: true,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F284E",
  colorScheme: "light",
  interactiveWidget: "resizes-visual",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = await getServerDictionary();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${plusJakarta.variable}`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased"
      >
        <LocaleProvider initialLocale={locale}>
          <JsonLdSchema locale={locale} />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
