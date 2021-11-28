import { format } from 'date-fns';

export const formatDate = (date?: Date, formatStr: string = 'P') =>
  date ? format(date, formatStr) : '';

const currency = 'EUR';
const locale = 'en-US';
const currFormatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency,
});

export const formatCurrency = (value?: number) =>
  value ? currFormatter.format(value) : '';
