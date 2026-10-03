import { site } from '../../data/site';
import type { CartQuote } from '../cart';
import { formatMoney } from '../utils/format';
export interface Customer { name: string; phone: string; address: string; city: string; state: string; pinCode: string; apartment?: string; note?: string }
export function buildOrderMessage(customer: Customer, quote: CartQuote): string {
  if (!quote.lines.length || quote.issues.length) throw new Error('Resolve unavailable items, prices and contents before ordering.');
  if (![customer.name, customer.address, customer.city, customer.state].every(s => s.trim())) throw new Error('Complete delivery details are required.');
  if (!validIndianPhone(customer.phone) || !/^[1-9]\d{5}$/.test(customer.pinCode.trim())) throw new Error('Check mobile number and six-digit PIN code.');

  const deliveryLines = [
    customer.address.trim(),
    ...(customer.apartment?.trim() ? [customer.apartment.trim()] : []),
    `${customer.city.trim()}, ${customer.state.trim()}`,
    customer.pinCode.trim()
  ];

  const orderLines = quote.lines.map(l => {
    const pack = l.pack ? ` – ${l.pack}` : '';
    return `${l.quantity} × ${l.name}${pack}   ${formatMoney(l.lineTotal)}`;
  });

  const lines = [
    `🛍️ FIT MONK ORDER`,
    '',
    'Customer',
    customer.name.trim(),
    customer.phone.trim(),
    '',
    'Delivery',
    ...deliveryLines,
    '',
    'Order',
    ...orderLines,
    '',
    quote.shipping === null ? 'Shipping                    To be confirmed' : `Shipping                    ${formatMoney(quote.shipping)}`,
    quote.grandTotal === null ? 'TOTAL                       To be confirmed' : `TOTAL                      ${formatMoney(quote.grandTotal)}`
  ];

  if (customer.note?.trim()) {
    lines.push('', `Customer Note: ${customer.note.trim()}`);
  }

  return lines.join('\n');
}
export function validIndianPhone(phone: string) {
  if (!/^[+\d\s()-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, '');
  return /^(?:91|0)?[6-9]\d{9}$/.test(digits);
}
export function buildWhatsAppUrl(customer: Customer, quote: CartQuote, number = site.whatsappOrderNumber): string {
  if (!number || !/^[1-9]\d{7,14}$/.test(number)) throw new Error('Configure a verified WhatsApp order number.');
  return `https://wa.me/${number}?text=${encodeURIComponent(buildOrderMessage(customer, quote))}`;
}
