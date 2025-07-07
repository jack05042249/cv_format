/**
 * Process date strings and format them according to specified rules
 * @param start_date - Start date string (optional)
 * @param end_date - End date string (optional)
 * @returns Formatted date string
 */
export function processDateRange(start_date?: string, end_date?: string): string {
  // If both dates are empty or undefined, return empty string
  if (!start_date && !end_date) {
    return "";
  }

  // Process start date
  const startDateInfo = processSingleDate(start_date);
  
  // Process end date
  const endDateInfo = processSingleDate(end_date);

  // If only end date exists
  if (!start_date && end_date) {
    return endDateInfo;
  }

  // If only start date exists
  if (start_date && !end_date) {
    return startDateInfo;
  }

  // If both dates exist, format as range
  if (start_date && end_date) {
    return `${startDateInfo} - ${endDateInfo}`;
  }

  return "";
}

/**
 * Process a single date string
 * @param dateStr - Date string to process
 * @returns Formatted date string
 */
function processSingleDate(dateStr?: string): string {
  if (!dateStr || dateStr.trim() === "") {
    return "";
  }

  const trimmedDate = dateStr.trim();
  
  // Try to parse different date formats
  let date: Date | null = null;
  let hasMonth = false;

  // Try dd/mm/yyyy format
  const ddMmYyyyMatch = trimmedDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddMmYyyyMatch) {
    const [, day, month, year] = ddMmYyyyMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    hasMonth = true;
  }

  // Try yyyy-mm-dd format
  const yyyyMmDdMatch = trimmedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyyMmDdMatch) {
    const [, year, month, day] = yyyyMmDdMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    hasMonth = true;
  }

  // Try mm/yyyy format
  const mmYyyyMatch = trimmedDate.match(/^(\d{1,2})\/(\d{4})$/);
  if (mmYyyyMatch) {
    const [, month, year] = mmYyyyMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, 1);
    hasMonth = true;
  }

  // Try yyyy-mm format
  const yyyyMmMatch = trimmedDate.match(/^(\d{4})-(\d{1,2})$/);
  if (yyyyMmMatch) {
    const [, year, month] = yyyyMmMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, 1);
    hasMonth = true;
  }

  // Try yyyy format only
  const yyyyMatch = trimmedDate.match(/^(\d{4})$/);
  if (yyyyMatch) {
    const [, year] = yyyyMatch;
    date = new Date(parseInt(year), 0, 1);
    hasMonth = false;
  }

  // If no valid format found, return original string
  if (!date || isNaN(date.getTime())) {
    return trimmedDate;
  }

  // Format based on available information
  if (hasMonth) {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${monthName} ${year}`;
  } else {
    return date.getFullYear().toString();
  }
}

/**
 * Process a single date string and format it according to specific rules
 * @param dateStr - Date string to process
 * @returns Formatted date string in "2023-09" or "2024" format
 */
export function processDateFormatted(dateStr?: string): string {
  if (!dateStr || dateStr.trim() === "") {
    return "";
  }

  const trimmedDate = dateStr.trim();
  
  // Try to parse different date formats
  let date: Date | null = null;
  let hasMonth = false;

  // Try dd/mm/yyyy format
  const ddMmYyyyMatch = trimmedDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddMmYyyyMatch) {
    const [, day, month, year] = ddMmYyyyMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    hasMonth = true;
  }

  // Try yyyy-mm-dd format
  const yyyyMmDdMatch = trimmedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyyMmDdMatch) {
    const [, year, month, day] = yyyyMmDdMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    hasMonth = true;
  }

  // Try mm/yyyy format
  const mmYyyyMatch = trimmedDate.match(/^(\d{1,2})\/(\d{4})$/);
  if (mmYyyyMatch) {
    const [, month, year] = mmYyyyMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, 1);
    hasMonth = true;
  }

  // Try yyyy-mm format
  const yyyyMmMatch = trimmedDate.match(/^(\d{4})-(\d{1,2})$/);
  if (yyyyMmMatch) {
    const [, year, month] = yyyyMmMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, 1);
    hasMonth = true;
  }

  // Try yyyy format only
  const yyyyMatch = trimmedDate.match(/^(\d{4})$/);
  if (yyyyMatch) {
    const [, year] = yyyyMatch;
    date = new Date(parseInt(year), 0, 1);
    hasMonth = false;
  }

  // If no valid format found, return empty string
  if (!date || isNaN(date.getTime())) {
    return "";
  }

  // Format based on available information
  if (hasMonth) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  } else {
    return date.getFullYear().toString();
  }
} 