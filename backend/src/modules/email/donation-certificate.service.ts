import { Injectable } from '@nestjs/common';
import { DonationCategory } from '../../common/enums/donation-category.enum';
import type { Donor } from '../donors/entities/donor.entity';
import {
  currencySymbol,
  drawLine,
  fitSize,
  hex,
  istParts,
  loadTemplate,
  splitRuns,
  titleCase,
  wrapWords,
} from './pdf-text';

const FONT_FILES = {
  name: 'BebasNeue-Regular.ttf',
  // Arial is not redistributable; Liberation Sans has identical metrics.
  sans: 'LiberationSans-Regular.ttf',
  sansBold: 'LiberationSans-Bold.ttf',
  // Also covers ₹, which Liberation Sans lacks
  value: 'Roboto-Bold.ttf',
};

/** Layout of certificate-base.pdf (6509.58 × 4600), content centred at x = 3140. */
const CENTER_X = 3140;

const NAME = {
  size: 279.6,
  capHeight: 0.7,
  baseline: 2076,
  maxWidth: 3600,
  color: '#0D2838',
};

const SENTENCE = {
  size: 76,
  letterSpacing: 0.02,
  firstBaseline: 2302,
  lineHeight: 114,
  maxWidth: 2800,
  color: '#2A1E36',
};

const VALUE = {
  size: 88.9,
  capHeight: 0.711,
  letterSpacing: 0.09,
  baseline: 3216,
  padding: 40,
  color: '#1B031D',
};

// Value centres under the column labels and the distance to the nearest divider
const COLUMNS = [
  { label: 'DONATION AMOUNT', center: 1244, halfWidth: 441 },
  { label: 'DONATION DATE', center: 2099, halfWidth: 412 },
  { label: 'DONATION FOR', center: 2958, halfWidth: 447 },
  { label: 'TRANSACTION REFERENCE NO.', center: 4048, halfWidth: 634 },
  { label: 'PAN / AADHAAR NO', center: 5207, halfWidth: 515 },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Injectable()
export class DonationCertificateService {
  async buildPdf(donor: Donor): Promise<Buffer> {
    const { pdf, page, fontSet } = await loadTemplate(
      'certificate-base.pdf',
      FONT_FILES,
    );

    const nameFonts = fontSet('name', 'sansBold', NAME.capHeight);
    const nameRuns = splitRuns(donor.fullName?.trim() || 'Donor', nameFonts);
    const nameSize = fitSize(nameRuns, NAME.size, NAME.maxWidth);
    drawLine(page, nameRuns, {
      size: nameSize,
      x: CENTER_X,
      // A shrunk name stays vertically centred where the design's name sits
      baseline: NAME.baseline - (NAME.capHeight * (NAME.size - nameSize)) / 2,
      align: 'center',
      color: hex(NAME.color),
    });

    const category = titleCase(
      donor.donationCategory || DonationCategory.GENERAL_DONATION,
    );
    const sentence = `Has Generously Contributed Towards The ${category} Of IHDUA In Support Of Its Mission To Build Stronger, Self-Reliant Rural Communities.`;
    const sentenceFonts = fontSet('sans', 'value');
    wrapWords(
      sentence,
      sentenceFonts,
      SENTENCE.size,
      SENTENCE.maxWidth,
      SENTENCE.letterSpacing,
    ).forEach((line, i) => {
      drawLine(page, splitRuns(line, sentenceFonts), {
        size: SENTENCE.size,
        letterSpacing: SENTENCE.letterSpacing,
        x: CENTER_X,
        baseline: SENTENCE.firstBaseline + i * SENTENCE.lineHeight,
        align: 'center',
        color: hex(SENTENCE.color),
      });
    });

    const valueFonts = fontSet('value', 'sansBold', VALUE.capHeight);
    const values = [
      this.formatAmount(donor.amount, donor.currency),
      this.formatDate(donor.createdAt ?? new Date()),
      category,
      String(donor.receiptNumber || donor.razorpayPaymentId || '—'),
      donor.pan?.trim().toUpperCase() || '—',
    ].map((value) => splitRuns(value, valueFonts));
    // One size for the whole row, so a long value shrinks every column equally
    const rowSize = Math.min(
      ...values.map((runs, i) =>
        fitSize(
          runs,
          VALUE.size,
          COLUMNS[i].halfWidth * 2 - VALUE.padding * 2,
          VALUE.letterSpacing,
        ),
      ),
    );
    values.forEach((runs, i) => {
      drawLine(page, runs, {
        size: rowSize,
        letterSpacing: VALUE.letterSpacing,
        x: COLUMNS[i].center,
        baseline: VALUE.baseline - (VALUE.capHeight * (VALUE.size - rowSize)) / 2,
        align: 'center',
        color: hex(VALUE.color),
      });
    });

    return Buffer.from(await pdf.save());
  }

  /** "₹ 10,000" as in the design; paise only when there are any. */
  private formatAmount(amount: string | number, currency: string) {
    const n = Number(amount);
    const decimals = Number.isInteger(n) ? 0 : 2;
    const formatted = Number.isFinite(n)
      ? n.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : String(amount);
    const symbol = currencySymbol(currency);
    return `${symbol}${currency === 'INR' ? ' ' : ''}${formatted}`;
  }

  /** "15 Aug 2025" in IST; built from parts because ICU versions disagree on "Sep"/"Sept". */
  private formatDate(date: Date) {
    const { day, month, year } = istParts(date);
    return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
  }
}
