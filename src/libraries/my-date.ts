import moment from 'moment';

export function formatDateDisplay(date: any, format = 'DD-MM-YYYY'): string {
  if (!date) return '';
  return moment(date).format(format) ?? '';
}

export function formatDateDisplayTH(date: any, formatDM = 'DD/MM', formatY = '/YYYY'): string {
  if (!date) return '';
  const parsed = moment(date);
  const year = parsed.year() + 543;
  const dateStr = parsed.format(formatDM);
  const yearStr = moment(year, 'YYYY').format(formatY);
  return `${dateStr !== 'Invalid date' ? dateStr : ''}${yearStr !== 'Invalid date' ? yearStr : ''}`;
}

export function formatTimeDisplay(date: any): string {
  if (!date) return '';
  return moment(date).format('HH:mm:ss') ?? '';
}

export function formatDateSave(date: any, format = 'YYYY-MM-DD'): string {
  if (!date) return '';
  return moment(date).format(format);
}

export function formatDateTHToDate(date: any, formatTH = 'DD/MM/YYYY'): Date | undefined {
  if (!date) return undefined;
  return moment(date, formatTH).subtract(543, 'y').toDate();
}

export function formatDateTHToFormatEN(date: any, fromFormat: string, toFormat: string): string {
  if (!date || !fromFormat || !toFormat) return '';
  return moment(date, fromFormat).subtract(543, 'y').format(toFormat);
}

export function parseStringToDate(dateStr: string): Date {
  return moment(dateStr).toDate();
}

export function getAge(date: any): string {
  const age = moment().diff(moment(date, 'YYYY-MM-DD'), 'year');
  return isNaN(age) ? '' : age.toString();
}

export function formatWithTimezone(date = new Date(), offsetHours = 7): string {
  const localTime = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
  const iso = localTime.toISOString().slice(0, 19);
  const offset =
    offsetHours >= 0
      ? `+${String(offsetHours).padStart(2, '0')}:00`
      : `${String(offsetHours).padStart(3, '0')}:00`;
  return `${iso}${offset}`;
}

export function formatDateTimeDisplayTHStrict(
  date: any,
  inputFormat = 'DD/MM/YYYY HH:mm',
  outputFormat = 'DD/MM/YYYY',
): string {
  if (!date) return '';
  const m = moment(date, inputFormat, true);
  if (!m.isValid()) return '';
  return m.add(543, 'year').format(outputFormat);
}
