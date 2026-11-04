import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import {
  PDFDocument,
  PDFFont,
  PDFHexString,
  PDFName,
  PDFOperator,
  PDFOperatorNames,
  PDFPage,
  RGB,
  endMarkedContent,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setCharacterSpacing,
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

/**
 * Helpers shared by the certificate and receipt services: both draw donor
 * details onto a base PDF (src/assets/certificates, built by
 * scripts/strip-donation-templates.py) at the positions of the design.
 * Coordinates are PDF units with the origin at the top-left of the page.
 */

export function hex(color: string): RGB {
  const n = parseInt(color.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export function asset(...parts: string[]) {
  return path.join(__dirname, '..', '..', 'assets', ...parts);
}

export function readAsset(...parts: string[]) {
  const file = asset(...parts);
  if (!existsSync(file)) {
    throw new Error(`Missing donation PDF asset ${file}`);
  }
  return readFileSync(file);
}

export type FontSet = {
  primary: PDFFont;
  primaryChars: Set<number>;
  /** Used for characters the primary font lacks (₹, non-Latin names) */
  fallback: PDFFont;
  /** Cap height as a fraction of the font size */
  capHeight: number;
};

export async function loadTemplate<K extends string>(
  base: string,
  fontFiles: Record<K, string>,
) {
  const pdf = await PDFDocument.load(readAsset('certificates', base));
  pdf.registerFontkit(fontkit);
  const keys = Object.keys(fontFiles) as K[];
  const embedded = await Promise.all(
    keys.map((key) =>
      pdf.embedFont(readAsset('fonts', fontFiles[key]), { subset: true }),
    ),
  );
  const fonts = {} as Record<K, PDFFont>;
  const charSets = {} as Record<K, Set<number>>;
  keys.forEach((key, i) => {
    fonts[key] = embedded[i];
    charSets[key] = new Set(embedded[i].getCharacterSet());
  });
  const fontSet = (key: K, fallback: K, capHeight = 0.711): FontSet => ({
    primary: fonts[key],
    primaryChars: charSets[key],
    fallback: fonts[fallback],
    capHeight,
  });
  return { pdf, page: pdf.getPages()[0], fontSet };
}

export type Run = { text: string; font: PDFFont; color?: RGB };

export type LineOptions = {
  size: number;
  /** Fraction of the font size, like CSS letter-spacing in em */
  letterSpacing?: number;
  x: number;
  /** Distance of the baseline from the top of the page */
  baseline: number;
  align?: 'left' | 'center';
  color: RGB;
};

export function splitRuns(text: string, fonts: FontSet, color?: RGB): Run[] {
  const runs: Run[] = [];
  for (const char of text) {
    const font = fonts.primaryChars.has(char.codePointAt(0)!)
      ? fonts.primary
      : fonts.fallback;
    const last = runs[runs.length - 1];
    if (last && last.font === font) last.text += char;
    else runs.push({ text: char, font, color });
  }
  return runs;
}

/** Visible width: letter spacing sits between characters, not after the last one. */
export function measure(runs: Run[], size: number, letterSpacing = 0) {
  const chars = runs.reduce((n, r) => n + [...r.text].length, 0);
  const glyphs = runs.reduce(
    (w, r) => w + r.font.widthOfTextAtSize(r.text, size),
    0,
  );
  return glyphs + size * letterSpacing * Math.max(0, chars - 1);
}

/** Font size at which the runs fit maxWidth, never larger than size. */
export function fitSize(
  runs: Run[],
  size: number,
  maxWidth: number,
  letterSpacing = 0,
) {
  const natural = measure(runs, size, letterSpacing);
  return natural > maxWidth ? (size * maxWidth) / natural : size;
}

export function drawLine(page: PDFPage, runs: Run[], opts: LineOptions) {
  const { size } = opts;
  const spacing = size * (opts.letterSpacing ?? 0);
  const width = measure(runs, size, opts.letterSpacing);
  const y = page.getHeight() - opts.baseline;
  let x = opts.align === 'center' ? opts.x - width / 2 : opts.x;

  // With letter spacing, viewers copy "I H D U A"; ActualText gives them the real string.
  const text = PDFHexString.fromText(runs.map((r) => r.text).join(''));
  page.pushOperators(
    PDFOperator.of(PDFOperatorNames.BeginMarkedContentSequence, [
      PDFName.of('Span'),
      `<< /ActualText ${text.toString()} >>`,
    ]),
    pushGraphicsState(),
    setCharacterSpacing(spacing),
  );
  for (const run of runs) {
    page.drawText(run.text, {
      x,
      y,
      size,
      font: run.font,
      color: run.color ?? opts.color,
    });
    x +=
      run.font.widthOfTextAtSize(run.text, size) +
      spacing * [...run.text].length;
  }
  page.pushOperators(popGraphicsState(), endMarkedContent());
}

/** Greedy word wrap; a single word wider than maxWidth gets a line of its own. */
export function wrapWords(
  text: string,
  fonts: FontSet,
  size: number,
  maxWidth: number,
  letterSpacing = 0,
): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (
      line &&
      measure(splitRuns(candidate, fonts), size, letterSpacing) > maxWidth
    ) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Upper-cases the first letter of every word, leaving the rest ("IHDUA", "80G") alone. */
export function titleCase(text: string) {
  return text.replace(
    /(^|[\s(/-])(\p{L})/gu,
    (_, before: string, first: string) => before + first.toUpperCase(),
  );
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  SGD: 'S$',
  AUD: 'A$',
  CAD: 'C$',
};

export function currencySymbol(currency: string) {
  return CURRENCY_SYMBOLS[currency] ?? `${currency} `;
}

/** Parts of a date in IST, which is what donors see on the website. */
export function istParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Kolkata',
  }).formatToParts(date);
  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '';
  return {
    day: part('day'),
    month: part('month'),
    year: part('year'),
    time: `${part('hour')}:${part('minute')}:${part('second')}`,
  };
}
