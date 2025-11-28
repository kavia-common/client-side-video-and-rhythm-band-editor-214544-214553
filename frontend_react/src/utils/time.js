/** Time & frame utilities */

// PUBLIC_INTERFACE
export function timeToMs(time) {
  /** Convert time string "HH:MM:SS.mmm" or "MM:SS.mmm" to milliseconds. */
  if (typeof time === 'number') return Math.max(0, time);
  const parts = time.split(':').map(Number);
  let h = 0, m = 0, s = 0;
  if (parts.length === 3) [h, m, s] = parts;
  if (parts.length === 2) [m, s] = parts;
  const sec = Math.floor(s);
  const ms = Math.round((s - sec) * 1000);
  return ((h * 3600 + m * 60 + sec) * 1000) + ms;
}

// PUBLIC_INTERFACE
export function msToTime(ms, withMs = true) {
  /** Format milliseconds into "HH:MM:SS.mmm". */
  const total = Math.max(0, Math.floor(ms));
  const h = Math.floor(total / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  const hh = String(h).padStart(2, '0');
  if (!withMs) return `${hh}:${mm}:${ss}`;
  const msPart = String(total % 1000).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${msPart}`;
}

// PUBLIC_INTERFACE
export function framesToMs(frames, fps = 60) {
  /** Convert frame count to milliseconds. */
  return Math.round((frames / fps) * 1000);
}

// PUBLIC_INTERFACE
export function msToFrames(ms, fps = 60) {
  /** Convert ms to whole frames. */
  return Math.round((ms / 1000) * fps);
}
