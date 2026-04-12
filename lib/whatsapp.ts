import { BUSINESS_DETAILS } from "@/lib/constants";

type ProductInquiryInput = {
  customerName?: string;
  customerPhone?: string;
  productName: string;
  category?: string;
  size?: string;
  price?: number | string;
  mrp?: number | string;
  description?: string;
};

type GeneralInquiryInput = {
  name?: string;
  phone?: string;
  purpose: string;
  details?: string;
};

type WholesaleInquiryInput = {
  businessName?: string;
  ownerName?: string;
  phone?: string;
  location?: string;
  interest?: string;
};

type AdminFollowupInput = {
  customerName?: string;
  customerPhone?: string;
  productName: string;
  category?: string;
  status?: string;
};

function sanitizeWhatsAppNumber(phone?: string) {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned) return "";

  if (cleaned.startsWith("91") && cleaned.length >= 12) return cleaned;
  if (cleaned.length === 10) return `91${cleaned}`;

  return cleaned;
}

export function buildWhatsAppUrl(message: string, phone?: string) {
  const targetNumber =
    sanitizeWhatsAppNumber(phone) || BUSINESS_DETAILS.whatsapp;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string, phone?: string) {
  window.open(buildWhatsAppUrl(message, phone), "_blank", "noopener,noreferrer");
}

export function buildProductInquiryMessage(input: ProductInquiryInput) {
  return [
    `Hello ${BUSINESS_DETAILS.businessName} Team,`,
    ``,
    `I want details for this product:`,
    `• Product Name: ${input.productName}`,
    input.category ? `• Category: ${input.category}` : "",
    input.size ? `• Size: ${input.size}` : "",
    input.price ? `• Offer Price: ₹ ${input.price}` : "",
    input.mrp ? `• MRP: ₹ ${input.mrp}` : "",
    input.description ? `• Product Notes: ${input.description}` : "",
    ``,
    `My details:`,
    `• Name: ${input.customerName || "Customer"}`,
    input.customerPhone ? `• Phone: ${input.customerPhone}` : "",
    ``,
    `Please share:`,
    `• current availability`,
    `• best final price`,
    `• usage guidance`,
    `• delivery / order process`,
    ``,
    `Thank you.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildGeneralInquiryMessage(input: GeneralInquiryInput) {
  return [
    `Hello ${BUSINESS_DETAILS.businessName} Team,`,
    ``,
    `I want to connect regarding: ${input.purpose}`,
    input.details ? `Details: ${input.details}` : "",
    ``,
    `My details:`,
    `• Name: ${input.name || "Customer"}`,
    input.phone ? `• Phone: ${input.phone}` : "",
    ``,
    `Please guide me further.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildWholesaleInquiryMessage(input: WholesaleInquiryInput) {
  return [
    `Hello ${BUSINESS_DETAILS.businessName} Team,`,
    ``,
    `I am interested in wholesale / partnership discussion.`,
    ``,
    `Business Details:`,
    `• Business Name: ${input.businessName || "-"}`,
    `• Owner Name: ${input.ownerName || "-"}`,
    input.phone ? `• Phone: ${input.phone}` : "",
    input.location ? `• Location: ${input.location}` : "",
    input.interest ? `• Requirement: ${input.interest}` : "",
    ``,
    `Please share dealership / wholesale pricing / supply details.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildAdminFollowupMessage(input: AdminFollowupInput) {
  return [
    `Hello ${input.customerName || "Customer"},`,
    ``,
    `This is ${BUSINESS_DETAILS.businessName}.`,
    ``,
    `We are following up on your inquiry regarding:`,
    `• Product: ${input.productName}`,
    input.category ? `• Category: ${input.category}` : "",
    input.status ? `• Current Status: ${input.status}` : "",
    ``,
    `Our team is available to help you with:`,
    `• product availability`,
    `• pricing details`,
    `• usage guidance`,
    `• order / delivery assistance`,
    ``,
    `Please let us know how we can assist you further.`,
    ``,
    `Thank you,`,
    `${BUSINESS_DETAILS.businessName}`,
  ]
    .filter(Boolean)
    .join("\n");
}