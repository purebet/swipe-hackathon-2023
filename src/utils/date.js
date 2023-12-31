import { format } from 'date-fns';

export const FORMAT_DATE_TIME = 'yyyy-MM-dd HH:mm:ss';
export const FORMAT_DATE_ONLY = 'yyyy-MM-dd';
export const FORMAT_TIME_ONLY = 'HH:mm:ss';

/**
 * Main Data and Time conversion utility to keep formats the same across entire Application
 * @param {string|object} dateOrString - date to show as UTC string or Date object instance
 * @param {string} [dateFormat] - time conversion template in 'date-fns' format, `FORMAT_DATE_TIME` by default
 * @param {string} [fallbackValue] - optional fallback value if data conversion is not possible
 */
export function dateToString(dateOrString, dateFormat = FORMAT_DATE_TIME, fallbackValue = '') {
  const date = typeof dateOrString === 'object' ? dateOrString : new Date(dateOrString);
  let result;
  try {
    result = format(date, dateFormat);
  } catch (error) {
    result = fallbackValue;
  }
  return result;
}

export function startOfDayLocal(datetime = new Date()){
  const start = new Date(datetime);
  start.setHours(0, 0, 0, 0);
  return start
}

export function addDays(datetime, numOfDays){
  const d = new Date(datetime.getTime());
  d.setDate(datetime.getDate() + numOfDays);
  return d
}
