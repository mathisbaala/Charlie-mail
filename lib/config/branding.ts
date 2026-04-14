const firstName = process.env.NEXT_PUBLIC_OWNER_FIRST_NAME?.trim();
const lastName = process.env.NEXT_PUBLIC_OWNER_LAST_NAME?.trim();
const fullName = process.env.NEXT_PUBLIC_OWNER_NAME?.trim();

const ownerNameFromParts = [firstName, lastName].filter(Boolean).join(" ").trim();

export const branding = {
  ownerName: fullName || ownerNameFromParts || "Mathis",
  ownerPhotoUrl: process.env.NEXT_PUBLIC_OWNER_PHOTO_URL ?? "/1759855646461.jpeg",
  companyName: process.env.NEXT_PUBLIC_BRAND_NAME ?? "Charlie",
  companyLogoUrl: process.env.NEXT_PUBLIC_BRAND_LOGO_URL ?? "/charlie-favicon-no-background.png",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
};
