// Replace nulls only with verified business information. Domain remains unconfirmed.
export const site = {
  brandName: 'Fit Monk',
  siteUrl: 'https://fitmonk.co.in',
  indexable: false, // Enable only after content and canonical domain are approved.
  whatsappOrderNumber: '919871316958' as string | null, // Catalog pages 1–6.
  currency: 'INR' as const,
  country: 'India',
  countryCode: 'IN',
  defaultTitle: 'Fit Monk | Food catalog',
  defaultDescription: 'Explore the Fit Monk food catalog and prepare an order for confirmation on WhatsApp.',
  socialImage: null as string | null,
  announcement: 'Pick your favourites. Confirm your order with us on WhatsApp.' as string | null,
  business: {
    legalName: null as string | null,
    email: null as string | null,
    telephone: null as string | null,
    address: null as string | null,
    logo: '/images/brand/fit-monk-logo.png' as string | null,
  },
} as const;
