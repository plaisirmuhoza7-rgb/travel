import { Metadata } from "next";
import FleetPage from "@/app/fleet/page";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.metadata.vehiclesTitle,
    description: dict.metadata.vehiclesDescription,
  };
}

export default FleetPage;
