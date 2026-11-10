import nodemailer from "nodemailer";
import { EnquiryRecord } from "./seed-data";
import { repository } from "./repository";
import {
  DEFAULT_LOCALE,
  Locale,
  getDictionary,
  getServiceLabelBySlug,
} from "./i18n";

export async function sendEnquiryNotifications(
  enquiry: EnquiryRecord,
  locale: Locale = DEFAULT_LOCALE
) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;
  const staffEmail = process.env.STAFF_NOTIFICATION_EMAIL || "info@travelrwanda.rw";

  const dict = getDictionary(locale);
  const e = dict.emails;
  const serviceLabel = getServiceLabelBySlug(enquiry.serviceType, dict);
  const preferredChannelLabel =
    dict.contact.form.replyMethods[enquiry.preferredContactMethod] ||
    enquiry.preferredContactMethod.toUpperCase();

  // Check if SMTP is configured
  if (!user || !pass) {
    console.warn(
      `[Email Service] SMTP credentials not configured. Skipping email dispatch for enquiry ${enquiry.referenceCode}.`
    );
    repository.addNotificationLog({
      enquiryId: enquiry.id,
      recipientType: "staff",
      recipientEmail: staffEmail,
      status: "unconfigured",
      errorMessage: "SMTP_USER or SMTP_APP_PASSWORD is not set in environment variables.",
      attemptCount: 1,
      lastAttemptAt: new Date().toISOString(),
    });
    return { success: false, reason: "unconfigured" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
  });

  // 1. Staff Notification Email
  try {
    const staffSubject = `${e.staffSubjectPrefix}${enquiry.referenceCode} - ${serviceLabel}`;
    const staffHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171D19; line-height: 1.5;">
        <div style="background-color: #0B3D2E; padding: 20px; color: #F7F6F2;">
          <h2 style="margin: 0; font-size: 20px;">${e.staffNewEnquiryHeader}</h2>
          <p style="margin: 5px 0 0; color: #BCA77B; font-size: 14px;">${e.staffReferenceLabel} <strong>${enquiry.referenceCode}</strong></p>
        </div>
        <div style="padding: 20px; background-color: #F7F6F2; border: 1px solid #E8DECC;">
          <h3 style="margin-top: 0; color: #0B3D2E;">${e.customerDetailsHeading}</h3>
          <p><strong>${e.nameLabel}</strong> ${enquiry.customerName}</p>
          <p><strong>${e.emailLabel}</strong> ${enquiry.customerEmail}</p>
          <p><strong>${e.phoneWhatsappLabel}</strong> ${enquiry.customerPhone}</p>
          <p><strong>${e.preferredContactLabel}</strong> ${preferredChannelLabel}</p>
          ${
            enquiry.bookingForSomeoneElse
              ? `<div style="background: #FFF; padding: 10px; border-left: 3px solid #BCA77B; margin: 10px 0;">
                  <strong>${e.bookingForOtherTitle}</strong><br/>
                  ${e.travellerLabel} ${enquiry.travellerName || dict.common.notApplicable}<br/>
                  ${e.contactLabel} ${enquiry.travellerPhone || dict.common.notApplicable}
                </div>`
              : ""
          }
          <h3 style="color: #0B3D2E;">${e.journeySummaryHeading}</h3>
          <p><strong>${e.serviceLabel}</strong> ${serviceLabel}</p>
          <p><strong>${e.pickupLocationLabel}</strong> ${enquiry.pickupLocation}</p>
          <p><strong>${e.pickupDateTimeLabel}</strong> ${enquiry.pickupDate} ${e.atWord} ${enquiry.pickupTime}${e.kigaliLocalTimeSuffix}</p>
          ${enquiry.returnDate ? `<p><strong>${e.returnDateTimeLabel}</strong> ${enquiry.returnDate} ${e.atWord} ${enquiry.returnTime || dict.common.notApplicable}</p>` : ""}
          <p><strong>${e.passengerCountLabel}</strong> ${enquiry.passengerCount}</p>
          ${
            enquiry.customerNotes
              ? `<p><strong>${e.customerNotesLabel}</strong><br/><span style="white-space: pre-wrap;">${enquiry.customerNotes}</span></p>`
              : ""
          }
        </div>
        <p style="font-size: 12px; color: #777; margin-top: 15px;">
          ${e.staffFooterNote}
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${dict.common.brandName}" <${user}>`,
      to: staffEmail,
      subject: staffSubject,
      html: staffHtml,
    });

    repository.addNotificationLog({
      enquiryId: enquiry.id,
      recipientType: "staff",
      recipientEmail: staffEmail,
      status: "sent",
      attemptCount: 1,
      lastAttemptAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Email Service] Failed to send staff notification:", err);
    repository.addNotificationLog({
      enquiryId: enquiry.id,
      recipientType: "staff",
      recipientEmail: staffEmail,
      status: "failed",
      errorMessage: err.message || "Failed to send email via SMTP",
      attemptCount: 1,
      lastAttemptAt: new Date().toISOString(),
    });
  }

  // 2. Customer Acknowledgment Email
  try {
    const custSubject = `${e.custSubjectPrefix}${enquiry.referenceCode}]`;
    const custHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171D19; line-height: 1.6;">
        <div style="background-color: #0B3D2E; padding: 24px; color: #F7F6F2; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 600;">${dict.common.brandName}</h1>
          <p style="margin: 4px 0 0; color: #BCA77B; font-size: 13px; letter-spacing: 1px;">${e.custSubheader}</p>
        </div>
        <div style="padding: 24px; background-color: #F7F6F2; border: 1px solid #E8DECC;">
          <h2 style="margin-top: 0; color: #0B3D2E; font-size: 18px;">${e.custHeadline}</h2>
          <p>${e.custDear}${enquiry.customerName},</p>
          <p>${e.custReceivedPrefix}<strong>${enquiry.referenceCode}</strong>.</p>
          <p style="background: #EFECE6; padding: 12px; border-left: 3px solid #0B3D2E;">
            <strong>${e.custImportantPrefix}</strong>${e.custImportantBody1}<strong>${preferredChannelLabel}</strong>${e.custImportantBody2}
          </p>
          <h3 style="color: #0B3D2E; font-size: 15px; margin-top: 20px;">${e.custSummaryHeading}</h3>
          <ul style="padding-left: 20px; font-size: 14px;">
            <li><strong>${e.serviceLabel}</strong> ${serviceLabel}</li>
            <li><strong>${e.custPickupLabel}</strong> ${enquiry.pickupLocation}${e.custOnWord}${enquiry.pickupDate} (${enquiry.pickupTime}${e.kigaliLocalTimeSuffix})</li>
            <li><strong>${e.custPassengersLabel}</strong> ${enquiry.passengerCount}</li>
          </ul>
          <p style="font-size: 14px;">${e.custQuestions}</p>
          <p style="font-size: 14px; margin-bottom: 0;">
            ${e.custPhoneLabel} <strong>+250 784 129 579</strong> / <strong>+250 781 782 882</strong><br/>
            ${e.custLocationLabel}
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${dict.common.brandName}" <${user}>`,
      to: enquiry.customerEmail,
      subject: custSubject,
      html: custHtml,
    });

    repository.addNotificationLog({
      enquiryId: enquiry.id,
      recipientType: "customer",
      recipientEmail: enquiry.customerEmail,
      status: "sent",
      attemptCount: 1,
      lastAttemptAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Email Service] Failed to send customer acknowledgment:", err);
    repository.addNotificationLog({
      enquiryId: enquiry.id,
      recipientType: "customer",
      recipientEmail: enquiry.customerEmail,
      status: "failed",
      errorMessage: err.message || "Failed to send acknowledgment email",
      attemptCount: 1,
      lastAttemptAt: new Date().toISOString(),
    });
  }

  return { success: true };
}
