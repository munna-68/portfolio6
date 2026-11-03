// Glyph ramp used by every scramble on the reference (dark → dense).
export const SCRAMBLE_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

/** Same length as `text`, whitespace preserved, every other character random. */
export function randomGlyphs(text: string, chars = SCRAMBLE_CHARS) {
  let out = "";
  for (const ch of text) out += /\s/.test(ch) ? ch : chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export const blanks = (text: string) => text.replace(/[^\s]/g, " ");
