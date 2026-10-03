import { site } from '../../data/site';
export const formatMoney = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: site.currency }).format(paise / 100);
export const displayText = (text: string) => text.trim().replace(/\s+/g, ' ');
