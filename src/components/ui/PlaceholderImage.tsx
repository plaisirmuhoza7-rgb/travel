import React from "react";
import { getAssetSlot } from "@/lib/assets";
import { getServerLocale } from "@/lib/i18n/server";
import { localizeAssetSlot } from "@/lib/i18n/catalog";
import { PlaceholderImageClient } from "./PlaceholderImageClient";

interface PlaceholderImageProps {
  slotId: string;
  className?: string;
  aspectRatioClass?: string;
  priority?: boolean;
  showDetails?: boolean;
}

export async function PlaceholderImage({
  slotId,
  className = "",
  aspectRatioClass,
  showDetails = true,
}: PlaceholderImageProps) {
  const locale = await getServerLocale();
  const slot = localizeAssetSlot(getAssetSlot(slotId), locale);

  return (
    <PlaceholderImageClient
      slot={slot}
      className={className}
      aspectRatioClass={aspectRatioClass}
      showDetails={showDetails}
    />
  );
}
