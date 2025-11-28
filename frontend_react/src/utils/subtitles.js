/** Subtitle parsing (SRT/VTT) to bandes items */
// CREDIT: Simplified parsing logic, not covering edge-cases of malformed files.

function parseTimeToMs(t) {
  // "00:00:02,400" or "00:00:02.400"
  const norm = t.trim().replace(',', '.');
  const [h, m, s] = norm.split(':');
  const [sec, ms = '0'] = s.split('.');
  return (
    Number(h) * 3600000 +
    Number(m) * 60000 +
    Number(sec) * 1000 +
    Number(ms.padEnd(3, '0').slice(0, 3))
  );
}

// PUBLIC_INTERFACE
export function parseSrt(text, defaultCharacterId = 'default') {
  /** Parse SRT string into bandes items [{id, characterId, text, start, end}] in ms. */
  const blocks = text.replace(/\r/g, '').split('\n\n').map(b => b.trim()).filter(Boolean);
  const items = [];
  for (const block of blocks) {
    const lines = block.split('\n');
    // possible first line is index
    let timeLineIdx = 0;
    if (/^\d+$/.test(lines[0])) timeLineIdx = 1;
    const timing = lines[timeLineIdx];
    const textLines = lines.slice(timeLineIdx + 1);
    const [startRaw, endRaw] = timing.split('-->').map(s => s.trim());
    const start = parseTimeToMs(startRaw);
    const end = parseTimeToMs(endRaw);
    const id = cryptoRandomId();
    items.push({ id, characterId: defaultCharacterId, text: textLines.join('\n'), start, end });
  }
  return items;
}

// PUBLIC_INTERFACE
export function parseVtt(text, defaultCharacterId = 'default') {
  /** Parse WebVTT into bandes items. Header "WEBVTT" is optional for this simple parser. */
  const cleaned = text.replace(/^WEBVTT[^\n]*\n/, '');
  return parseSrt(cleaned, defaultCharacterId);
}

// PUBLIC_INTERFACE
export function cryptoRandomId() {
  /** Generate a random id using Web Crypto if available, else fallback. */
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
