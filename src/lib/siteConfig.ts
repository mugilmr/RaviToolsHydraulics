// Shop details shown across the site. Plain constants (not env vars) since
// they're editable content, not deployment secrets — change them here and
// redeploy, or later move them into the admin panel if Ravi wants to edit
// them himself without a developer.
export const siteConfig = {
  name: "Ravi Tools and Hydraulics",
  shortName: "Ravi Tools",
  tagline: "Borewell hardware & hydraulics, trusted for 25 years",
  phone: "9487851687",
  phoneDisplay: "+91 94878 51687",
  whatsapp: "919487851687", // country code + number, no + or spaces
  email: "ravitools76@gmail.com",
  address: "Ravi Tools and Hydraulics, Tiruchengode, Namakkal District, Tamil Nadu, India",
  mapQuery: "Tiruchengode, Tamil Nadu, India",
  hours: "Open 24/7",
  yearsInBusiness: 25,
  productCount: "5000+",
  deliveryNote: "Delivered all over India from Tamil Nadu — no delivery charges",
} as const;
