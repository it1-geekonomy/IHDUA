import { Injectable } from '@nestjs/common';
import type { PDFPage } from 'pdf-lib';
import type { Donor } from '../donors/entities/donor.entity';
import {
  FontSet,
  Run,
  currencySymbol,
  drawLine,
  fitSize,
  hex,
  istParts,
  loadTemplate,
  measure,
  readAsset,
  splitRuns,
  titleCase,
  wrapWords,
} from './pdf-text';

const FONT_FILES = {
  regular: 'Roboto-Regular.ttf',
  bold: 'Roboto-Bold.ttf',
  fallback: 'LiberationSans-Regular.ttf',
};

/** Layout of receipt-base.pdf (1241 × 1756), content centred at x = 620.5. */
const CENTER_X = 620.5;
const LETTER_SPACING = 0.03;
const GREY = '#474747';
const BLUE = '#0D3E99';

const INTRO = {
  size: 22,
  baselines: [379, 424],
  maxWidth: 1000,
};

const TABLE = {
  x: 737,
  size: 24,
  minSize: 18,
  capHeight: 0.711,
  maxWidth: 375,
  /** Receipt Number, Total Donation, City, Receipt Date, PAN, Mode Of Payment, Amount In Words */
  baselines: [557, 630, 703, 776, 849, 922, 995],
  color: '#0E0E0E',
};

const NOTE = {
  x: 152,
  size: 20,
  baselines: [1161, 1191, 1221],
  maxWidth: 975,
  color: '#4D4336',
};

/**
 * The 80G declaration, broken into lines as in the design. Registration
 * number and date are from IHDUA's Form 10AC approval order.
 */
const NOTE_LINES = [
  'Donation Are Eligible For 50% Deduction From Taxable Income Under Section 80G(5)(Vi) Of The Income',
  'Tax Act 1961 Unique Registration Number AAATI3426LF20214 Dated 23/03/2022, Subject To',
  'Realization Of Donation.',
];

const SIGNATURE = {
  x: 105,
  y: 232,
  width: 175,
  height: 66,
};

function numberToWords(num: number, currency: string): string {
  const currencyName = currency.toUpperCase() === 'INR' ? 'rupees' : currency;

  if (num === 0) return `zero ${currencyName} only`;

  const a = [
    '', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ',
    'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen ',
  ];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const twoDigits = (s: string) =>
    a[Number(s)] || `${b[Number(s[0])]} ${a[Number(s[1])]}`;

  const numStr = Math.floor(num).toString();
  if (numStr.length > 9) return `${num} ${currencyName} only`;

  // Indian grouping: crore, lakh, thousand, hundred, units
  const n = numStr.padStart(9, '0').match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return `${num} ${currencyName} only`;

  let str = '';
  str += n[1] !== '00' ? `${twoDigits(n[1])}crore ` : '';
  str += n[2] !== '00' ? `${twoDigits(n[2])}lakh ` : '';
  str += n[3] !== '00' ? `${twoDigits(n[3])}thousand ` : '';
  str += n[4] !== '0' ? `${a[Number(n[4])]}hundred ` : '';
  str += n[5] !== '00' ? `${str ? 'and ' : ''}${twoDigits(n[5])}` : '';

  return `${str.replace(/\s+/g, ' ').trim()} ${currencyName} only`;
}

@Injectable()
export class DonationReceiptService {
  async buildPdf(donor: Donor): Promise<Buffer> {
    const { pdf, page, fontSet } = await loadTemplate(
      'receipt-base.pdf',
      FONT_FILES,
    );
    const regular = fontSet('regular', 'fallback', TABLE.capHeight);
    const bold = fontSet('bold', 'fallback', TABLE.capHeight);

    const amount = Number(donor.amount || 0);
    const amountLabel = `${currencySymbol(donor.currency || 'INR')}${amount.toFixed(2)}`;
    const { day, month, year, time } = istParts(donor.createdAt ?? new Date());
    const date = `${year}-${month}-${day}`;
    const name = donor.fullName?.trim() || 'Donor';

    const intro: Run[][] = [
      [
        ...splitRuns('We Confirm The Receipt Of Donation From ', regular, hex(GREY)),
        ...splitRuns(`Mr/Mrs ${name}.`, bold, hex(BLUE)),
      ],
      [
        ...splitRuns(`ONLINE ${amountLabel}/- `, bold, hex(BLUE)),
        ...splitRuns(`Dated ${date}   ${time}`, regular, hex(GREY)),
      ],
    ];
    intro.forEach((runs, i) => {
      drawLine(page, runs, {
        size: fitSize(runs, INTRO.size, INTRO.maxWidth, LETTER_SPACING),
        letterSpacing: LETTER_SPACING,
        x: CENTER_X,
        baseline: INTRO.baselines[i],
        align: 'center',
        color: hex(GREY),
      });
    });

    const values = [
      String(donor.receiptNumber || donor.razorpayPaymentId || '—'),
      amountLabel,
      donor.city?.trim() || '—',
      `${date} ${time}`,
      donor.pan?.trim().toUpperCase() || '—',
      'ONLINE',
      titleCase(numberToWords(amount, donor.currency || 'INR')),
    ];
    values.forEach((value, i) =>
      this.drawCell(page, value, regular, TABLE.baselines[i]),
    );

    NOTE_LINES.forEach((line, i) => {
      const runs = splitRuns(line, regular);
      drawLine(page, runs, {
        size: fitSize(runs, NOTE.size, NOTE.maxWidth, LETTER_SPACING),
        letterSpacing: LETTER_SPACING,
        x: NOTE.x,
        baseline: NOTE.baselines[i],
        color: hex(NOTE.color),
      });
    });

    const stampBytes = readAsset('certificates', 'signature-stamp.png');
    const stamp = await pdf.embedPng(stampBytes);
    page.drawImage(stamp, {
      x: SIGNATURE.x,
      y: SIGNATURE.y,
      width: SIGNATURE.width,
      height: SIGNATURE.height,
    });

    return Buffer.from(await pdf.save());
  }

  /** One line when it fits at a readable size, otherwise two lines centred in the row. */
  private drawCell(
    page: PDFPage,
    text: string,
    fonts: FontSet,
    baseline: number,
  ) {
    const color = hex(TABLE.color);
    const runs = splitRuns(text, fonts);
    const size = fitSize(runs, TABLE.size, TABLE.maxWidth, LETTER_SPACING);
    if (size >= TABLE.minSize) {
      drawLine(page, runs, {
        size,
        letterSpacing: LETTER_SPACING,
        x: TABLE.x,
        baseline: baseline - (TABLE.capHeight * (TABLE.size - size)) / 2,
        color,
      });
      return;
    }

    // Widen the wrap width until the text splits into at most two balanced lines
    let wrapWidth = measure(runs, TABLE.size, LETTER_SPACING) / 2;
    let wrapped = wrapWords(text, fonts, TABLE.size, wrapWidth, LETTER_SPACING);
    while (wrapped.length > 2) {
      wrapWidth *= 1.05;
      wrapped = wrapWords(text, fonts, TABLE.size, wrapWidth, LETTER_SPACING);
    }
    const lines = wrapped.map((line) => splitRuns(line, fonts));
    const lineSize = Math.min(
      22,
      ...lines.map((l) => fitSize(l, TABLE.size, TABLE.maxWidth, LETTER_SPACING)),
    );
    const lineHeight = lineSize * 1.2;
    const middle = baseline - (TABLE.capHeight * TABLE.size) / 2;
    const first =
      middle - ((lines.length - 1) * lineHeight) / 2 + (TABLE.capHeight * lineSize) / 2;
    lines.forEach((line, i) => {
      drawLine(page, line, {
        size: lineSize,
        letterSpacing: LETTER_SPACING,
        x: TABLE.x,
        baseline: first + i * lineHeight,
        color,
      });
    });
  }
}
