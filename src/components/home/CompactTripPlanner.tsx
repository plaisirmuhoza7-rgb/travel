import React from "react";
import { QuickPlannerForm } from "./QuickPlannerForm";
import type { Vehicle } from "@/lib/seed-data";

export function CompactTripPlanner({ vehicles = [] }: { vehicles?: Vehicle[] }) {
  return <QuickPlannerForm vehicles={vehicles} />;
}
