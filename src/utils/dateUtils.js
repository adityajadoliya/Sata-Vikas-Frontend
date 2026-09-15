/**
 * Robust date/time parsing and formatting utility for SATA VIKAS forms.
 * Properly converts backend UTC timestamps into the user's local timezone.
 */

export function parseUtcDate(val) {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'string') {
    const s = val.trim();
    if (!s) return null;

    // ISO timestamp with T (e.g. "2026-09-02T17:42:00.123456" or "2026-09-02T17:42:00Z")
    if (s.includes('T')) {
      // If no timezone offset (+/-) and no 'Z', backend sent UTC datetime -> append 'Z'
      const isoStr = (!s.endsWith('Z') && !/[+-]\d{2}(:\d{2})?$/.test(s)) ? `${s}Z` : s;
      const d = new Date(isoStr);
      if (!isNaN(d.getTime())) return d;
    }

    // Space-separated SQL datetime (e.g. "2026-09-02 17:42:00")
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) {
      const isoStr = s.replace(' ', 'T') + 'Z';
      const d = new Date(isoStr);
      if (!isNaN(d.getTime())) return d;
    }

    // Try standard Date constructor
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;

    // Try DD-MM-YYYY or DD/MM/YYYY or YYYY-MM-DD
    const parts = s.split(/[-/.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const parsed = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        if (!isNaN(parsed.getTime())) return parsed;
      } else if (parts[2].length === 4 || parts[2].length === 2) {
        // DD-MM-YYYY
        const y = parts[2].length === 2 ? 2000 + Number(parts[2]) : Number(parts[2]);
        const parsed = new Date(y, Number(parts[1]) - 1, Number(parts[0]));
        if (!isNaN(parsed.getTime())) return parsed;
      }
    }
  }
  return null;
}

/**
 * Format entry date (e.g. "02 Sep 2026")
 */
export function formatLogDate(log) {
  if (!log) return '—';
  const uploadTime = log.uploadedAt || log.createdAt || log.created_at;
  if (uploadTime && typeof uploadTime === 'string' && (uploadTime.includes('T') || uploadTime.includes(':'))) {
    const d = parseUtcDate(uploadTime);
    if (d) {
      return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
    }
  }

  if (log.date || log.logDate || log.log_date) {
    const d = parseUtcDate(log.date || log.logDate || log.log_date);
    if (d) {
      return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
    }
    return String(log.date || log.logDate || log.log_date);
  }

  return '—';
}

/**
 * Format upload time (e.g. "11:18 PM")
 */
export function formatLogTime(log) {
  if (!log) return '—';
  const uploadTime = log.uploadedAt || log.createdAt || log.created_at;
  if (uploadTime && (typeof uploadTime === 'string' || typeof uploadTime === 'number' || uploadTime instanceof Date)) {
    const str = String(uploadTime);
    if (str.includes('T') || str.includes(':') || typeof uploadTime === 'number' || uploadTime instanceof Date) {
      const d = parseUtcDate(uploadTime);
      if (d) {
        return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
      }
    }
  }

  // Fallback shift times if no upload timestamp is recorded
  const shift = String(log.shift || '').trim().toUpperCase();
  if (shift === 'A' || shift === 'MORNING' || shift === 'SHIFT MORNING' || shift === 'SHIFT A') return '02:30 PM';
  if (shift === 'B' || shift === 'EVENING' || shift === 'SHIFT EVENING' || shift === 'SHIFT B') return '10:30 PM';
  if (shift === 'C' || shift === 'NIGHT' || shift === 'SHIFT NIGHT' || shift === 'SHIFT C') return '06:30 AM';
  return '09:15 AM';
}
