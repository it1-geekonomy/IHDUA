import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { DonationCategory } from '../../common/enums/donation-category.enum';
import type { Donor } from '../donors/entities/donor.entity';
import { DonationCertificateService } from './donation-certificate.service';
import { DonationReceiptService } from './donation-receipt.service';
import { currencySymbol } from './pdf-text';

export type QuotaScope = 'daily' | 'monthly' | 'rate';

export type ReceiptEmailResult =
  | { status: 'sent'; id?: string }
  | { status: 'skipped'; reason: string }
  | { status: 'quota'; scope: QuotaScope }
  | { status: 'error'; message: string };

const QUOTA_ERRORS: Partial<Record<string, QuotaScope>> = {
  daily_quota_exceeded: 'daily',
  monthly_quota_exceeded: 'monthly',
  rate_limit_exceeded: 'rate',
};

const BRAND = {
  dark: '#2A1E36',
  purple: '#9739A8',
  gold: '#F5B623',
  muted: '#6B6475',
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private readonly fromEmail =
    process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  constructor(
    private readonly certificates: DonationCertificateService,
    private readonly receipts: DonationReceiptService,
  ) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY is not defined. Donation emails will not be sent.',
      );
      return;
    }
    this.resend = new Resend(apiKey);
  }

  isEnabled(): boolean {
    return this.resend !== null;
  }

  /** Thank-you email with the donation certificate, plus the 80G receipt when the donor gave a PAN. */
  async sendDonationReceipt(donor: Donor): Promise<ReceiptEmailResult> {
    if (!this.resend) {
      return { status: 'skipped', reason: 'RESEND_API_KEY is missing' };
    }

    if (!donor.email) {
      this.logger.warn(
        `Skipping donation receipt for donor ${donor.id}: no email address.`,
      );
      return { status: 'skipped', reason: 'Donor provided no email' };
    }

    const receipt = donor.receiptNumber || '—';
    const attachments: { filename: string; content: string }[] = [];
    try {
      const [certPdf, receiptPdf] = await Promise.all([
        this.certificates.buildPdf(donor),
        donor.pan ? this.receipts.buildPdf(donor) : Promise.resolve(null),
      ]);
      attachments.push({
        filename: `IHDUA-Donation-Certificate-${receipt}.pdf`,
        content: certPdf.toString('base64'),
      });
      if (receiptPdf) {
        attachments.push({
          filename: `IHDUA-Donation-Receipt-${receipt}.pdf`,
          content: receiptPdf.toString('base64'),
        });
      }
    } catch (err) {
      this.logger.error(
        `Could not build donation PDFs for donor ${donor.id}: ${
          err instanceof Error ? err.message : 'unknown error'
        }`,
      );
    }

    const dateLabel = new Date(
      donor.createdAt ?? Date.now(),
    ).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });

    try {
      const { data, error } = await this.resend.emails.send({
        from: `IHDUA <${this.fromEmail}>`,
        to: [donor.email],
        subject: 'Thank you for your donation — IHDUA',
        html: this.buildDonationEmailHtml({
          fullName: donor.fullName,
          amountLabel: this.formatAmount(donor.amount, donor.currency),
          receipt,
          dateLabel,
          category:
            donor.donationCategory || DonationCategory.GENERAL_DONATION,
          hasCertificate: attachments.length > 0,
          hasReceipt: attachments.length > 1,
        }),
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      if (error) {
        const quota = QUOTA_ERRORS[error.name];
        if (quota) {
          this.logger.warn(
            `Resend ${quota} limit reached; receipt for donor ${donor.id} stays queued (${error.message})`,
          );
          return { status: 'quota', scope: quota };
        }
        this.logger.error(
          `Failed to send receipt for donor ${donor.id}: ${error.message}`,
        );
        return { status: 'error', message: `${error.name}: ${error.message}` };
      }

      this.logger.log(
        `Donation email sent for donor ${donor.id} with ${attachments.length} attachment(s) (ID: ${data?.id})`,
      );
      return { status: 'sent', id: data?.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(
        `Error sending receipt for donor ${donor.id}: ${message}`,
      );
      return { status: 'error', message };
    }
  }

  private buildDonationEmailHtml(params: {
    fullName: string;
    amountLabel: string;
    receipt: string;
    dateLabel: string;
    category: string;
    hasCertificate: boolean;
    hasReceipt: boolean;
  }) {
    const name = this.escape(params.fullName);
    const category = this.escape(params.category);
    const amount = this.escape(params.amountLabel);
    const receipt = this.escape(params.receipt);
    const date = this.escape(params.dateLabel);

    let attachmentNote =
      'Your donation has been recorded. If you need a certificate or receipt copy, reply to this email and we will gladly help.';
    if (params.hasReceipt) {
      attachmentNote =
        'Your <strong>Certificate of Donation</strong> and <strong>80G Donation Receipt</strong> are attached as PDFs. Please keep them for your records.';
    } else if (params.hasCertificate) {
      attachmentNote =
        'Your <strong>Certificate of Donation</strong> is attached as a PDF. Please keep it for your records. An 80G tax exemption receipt is issued when a PAN is provided with the donation.';
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Thank you for your donation</title>
</head>
<body style="margin:0;padding:0;background:#F5F3F7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F3F7;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(42,30,54,0.08);">

          <!-- Brand bar -->
          <tr>
            <td style="background:${BRAND.dark};padding:22px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:1px;">
                    IHDUA
                  </td>
                  <td align="right" style="font-size:12px;color:#C9BFD3;">
                    Building self-reliant rural communities
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent stripe -->
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(90deg,${BRAND.purple} 0%,${BRAND.gold} 100%);">
              &nbsp;
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 28px 8px 28px;">
              <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${BRAND.purple};">
                Donation confirmed
              </p>
              <h1 style="margin:0 0 16px 0;font-size:26px;line-height:1.25;font-weight:700;color:${BRAND.dark};">
                Thank you, ${name}
              </h1>
              <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${BRAND.muted};">
                We have successfully received your generous contribution.
                Your support helps IHDUA build stronger, self-reliant rural communities.
              </p>
            </td>
          </tr>

          <!-- Amount highlight -->
          <tr>
            <td style="padding:0 28px 20px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FBF6E9;border:1px solid #F1DFAE;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;text-align:center;">
                    <p style="margin:0 0 4px 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8A6D1E;">
                      Amount donated
                    </p>
                    <p style="margin:0;font-size:28px;font-weight:700;color:${BRAND.dark};">
                      ${amount}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:0 28px 24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F6FA;border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:${BRAND.dark};">
                      Receipt details
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:8px 0;font-size:13px;color:#8E8699;border-bottom:1px solid #ECE8F0;">Receipt number</td>
                        <td align="right" style="padding:8px 0;font-size:13px;font-weight:600;color:${BRAND.dark};border-bottom:1px solid #ECE8F0;">${receipt}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-size:13px;color:#8E8699;border-bottom:1px solid #ECE8F0;">Date</td>
                        <td align="right" style="padding:8px 0;font-size:13px;font-weight:600;color:${BRAND.dark};border-bottom:1px solid #ECE8F0;">${date}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-size:13px;color:#8E8699;">Donation for</td>
                        <td align="right" style="padding:8px 0;font-size:13px;font-weight:600;color:${BRAND.dark};">${category}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Attachment note -->
          <tr>
            <td style="padding:0 28px 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:4px solid ${BRAND.purple};background:#F7F0F9;border-radius:0 8px 8px 0;">
                <tr>
                  <td style="padding:14px 16px;font-size:14px;line-height:1.55;color:${BRAND.dark};">
                    ${attachmentNote}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:0 28px 32px 28px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.muted};">
                With gratitude,<br />
                <strong style="color:${BRAND.dark};">The IHDUA Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${BRAND.dark};padding:20px 28px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:13px;color:#FFFFFF;">
                <a href="https://www.ihdua.org" style="color:${BRAND.gold};text-decoration:none;font-weight:600;">www.ihdua.org</a>
              </p>
              <p style="margin:0;font-size:11px;line-height:1.5;color:#A99FB4;">
                #18 &amp; 19, Hebbal Industrial Area, Outer Ring Road, Metagalli, Mysuru-570017<br />
                This is an automated receipt for your donation.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private formatAmount(amount: string | number, currency: string) {
    const n = Number(amount);
    const formatted = Number.isFinite(n)
      ? n.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US')
      : String(amount);
    return `${currencySymbol(currency)}${formatted}`;
  }

  private escape(value: string) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
