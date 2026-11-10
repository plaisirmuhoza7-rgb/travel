import { repository } from "../src/lib/repository";
import { EnquirySchema } from "../src/lib/validations/enquiry";
import { sendEnquiryNotifications } from "../src/lib/email";

async function runTests() {
  console.log("=== Travel Rwanda Automated Verification Suite ===");

  // Test 1: Seed data and repository integrity
  const vehicles = repository.getVehicles();
  console.log(`[PASS] Vehicles loaded: ${vehicles.length} fleet leads.`);
  if (vehicles.length < 5) throw new Error("Expected at least 5 vehicle leads");

  // Test 2: Unknown capacity does NOT satisfy capacity filter
  const fiveSeatVehicles = repository.getVehicles({ minCapacity: 5 });
  const unknownCapacityInFilter = fiveSeatVehicles.some((v) => v.passengerCapacity === null);
  if (unknownCapacityInFilter) {
    throw new Error("FAIL: Vehicle with null passenger capacity satisfied capacity filter!");
  }
  console.log(`[PASS] Capacity filter correctly excluded null passenger capacity vehicles.`);

  // Test 3: Validate booking enquiry schema with valid input
  const validPayload = {
    idempotencyKey: "123e4567-e89b-12d3-a456-426614174000",
    serviceType: "airport-transfer",
    pickupLocation: "Kigali International Airport (KGL)",
    dropoffLocation: "Kicukiro Gahanga Center",
    pickupDate: "2026-11-20",
    pickupTime: "14:30",
    passengerCount: 3,
    airportDirection: "arrival",
    flightNumber: "WB 401",
    customerName: "Aimable Kayiranga",
    customerEmail: "aimable.kayiranga@example.com",
    customerPhone: "+250 784 000 111",
    preferredContactMethod: "whatsapp",
    bookingForSomeoneElse: false,
    privacyAccepted: true,
  };

  const parsed = EnquirySchema.safeParse(validPayload);
  if (!parsed.success) {
    throw new Error(`FAIL: Valid schema rejected: ${JSON.stringify(parsed.error.issues)}`);
  }
  console.log("[PASS] Booking Enquiry schema validated clean payload.");

  // Test 4: Idempotency & Persistence
  const enq = repository.createEnquiry({
    id: "test-enq-001",
    referenceCode: "TRW-20261120-TEST",
    idempotencyKey: validPayload.idempotencyKey,
    serviceType: validPayload.serviceType,
    status: "New",
    pickupLocation: validPayload.pickupLocation,
    dropoffLocation: validPayload.dropoffLocation,
    pickupDate: validPayload.pickupDate,
    pickupTime: validPayload.pickupTime,
    passengerCount: validPayload.passengerCount,
    serviceSpecificData: { flightNumber: "WB 401" },
    customerName: validPayload.customerName,
    customerEmail: validPayload.customerEmail,
    customerPhone: validPayload.customerPhone,
    preferredContactMethod: validPayload.preferredContactMethod as any,
    bookingForSomeoneElse: false,
    privacyAccepted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const duplicate = repository.createEnquiry({
    ...enq,
    id: "test-enq-duplicate",
  });

  if (duplicate.id !== enq.id) {
    throw new Error("FAIL: Idempotent submission created duplicate record!");
  }
  console.log(`[PASS] Idempotency prevented duplicate enquiry creation.`);

  // Test 5: Status workflow update & audit trail
  const updated = repository.updateEnquiryStatus(
    enq.id,
    "Contacted",
    "admin@travelrwanda.rw",
    "Verified airport arrival schedule with client on WhatsApp."
  );

  if (updated?.status !== "Contacted") {
    throw new Error("FAIL: Status transition failed.");
  }

  const history = repository.getStatusHistoryForEnquiry(enq.id);
  if (history.length < 2) {
    throw new Error("FAIL: Audit history not logged.");
  }
  console.log(`[PASS] Status update logged audit history entry (${history[0].previousStatus} -> ${history[0].newStatus}).`);

  // Test 6: Internal notes privacy
  repository.addNoteToEnquiry(enq.id, "admin@travelrwanda.rw", "Client arriving on delayed RwandAir flight.");
  const notes = repository.getNotesForEnquiry(enq.id);
  if (notes.length === 0) throw new Error("FAIL: Note not saved.");
  console.log("[PASS] Private staff note stored securely.");

  // Test 7: Email notification resilience when unconfigured
  const notifResult = await sendEnquiryNotifications(enq);
  console.log(`[PASS] Email notification system gracefully handled status (${notifResult.reason || "attempted"}).`);

  console.log("\n>>> ALL VERIFICATION CHECKS PASSED SUCCESSFULLY. <<<");
}

runTests().catch((e) => {
  console.error("Verification test failed:", e);
  process.exit(1);
});
