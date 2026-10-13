/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BusinessDetails {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  hours: string;
  hoursShort: string;
  googleMapsUrl: string;
}

export const BUSINESS: BusinessDetails = {
  name: 'DECORIUM Hardware Zone',
  tagline: 'Premium Architectural Hardware',
  address: '16 Beadon Rd, Garhi Shahu, Lahore, 54000, Pakistan',
  phone: '+92 321 8860070',
  phoneRaw: '+923218860070',
  whatsapp: '923218860070',
  hours: 'Monday to Saturday, 11:00 AM to 8:00 PM. Sunday closed.',
  hoursShort: 'Mon-Sat 11 AM - 8 PM',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=16+Beadon+Rd%2C+Garhi+Shahu%2C+Lahore%2C+54000%2C+Pakistan',
};

/**
 * Helper to build prefilled WhatsApp URLs reading from VITE_WHATSAPP_NUMBER with strict fallback
 */
export function getWhatsAppNumber(): string {
  const envNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (envNumber && typeof envNumber === 'string') {
    const cleaned = envNumber.replace(/\D/g, '');
    if (cleaned.length >= 8) return cleaned;
  }
  return BUSINESS.whatsapp;
}

export function buildWhatsAppUrl(message: string): string {
  const number = getWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppUrl(productName: string, finish?: string, size?: string): string {
  const parts = [`Hello DECORIUM Hardware Zone, I would like to enquire about:`, `• Product: ${productName}`];
  if (finish) parts.push(`• Finish: ${finish}`);
  if (size) parts.push(`• Size/Profile: ${size}`);
  parts.push(``, `Please share pricing and availability.`);

  return buildWhatsAppUrl(parts.join('\n'));
}
