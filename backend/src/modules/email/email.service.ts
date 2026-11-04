import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { DonationCategory } from '../../common/enums/donation-category.enum';
import type { Donor } from '../donors/entities/donor.entity';
import { LeadContact } from '../leads-contact/entities/lead-contact.entity';
import { LeadVolunteer } from '../leads-volunteer/entities/lead-volunteer.entity';
import { PartnershipInquiry } from '../partnership-inquiries/entities/partnership-inquiry.entity';
import { DonationCertificateService } from './donation-certificate.service';
import { DonationReceiptService } from './donation-receipt.service';
import { currencySymbol } from './pdf-text';

export interface FormSubmissionDetail {
  label: string;
  value?: string | number | boolean | null;
}

export interface FormSubmissionNotificationParams {
  formType: 'Contact Us' | 'Volunteer' | 'Partnership Inquiry';
  details: FormSubmissionDetail[];
  cvLink?: string | null;
  submittedAt?: Date | string;
  submissionId?: string;
}

export type NotificationEmailResult =
  | { status: 'sent'; id?: string }
  | { status: 'skipped'; reason: string }
  | { status: 'error'; message: string };

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
    process.env.RESEND_FROM_EMAIL || 'noreply@ihdua.org';

  constructor(
    private readonly certificates: DonationCertificateService,
    private readonly receipts: DonationReceiptService,
  ) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY is not defined. Donation and notification emails will not be sent.',
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

  /**
   * Sends admin notification when someone submits the Contact Us form.
   */
  async sendContactNotification(
    contact: LeadContact,
  ): Promise<NotificationEmailResult> {
    return this.sendFormNotificationEmail({
      formType: 'Contact Us',
      submissionId: contact.id,
      submittedAt: contact.createdAt,
      details: [
        { label: 'Full Name', value: contact.name },
        { label: 'Email Address', value: contact.email || '—' },
        { label: 'Mobile Number', value: contact.mobile || '—' },
        { label: 'Subject', value: contact.subject || 'General Enquiry' },
        { label: 'Message', value: contact.message || '—' },
      ],
    });
  }

  /**
   * Sends admin notification when someone applies to Volunteer.
   */
  async sendVolunteerNotification(
    volunteer: LeadVolunteer,
  ): Promise<NotificationEmailResult> {
    return this.sendFormNotificationEmail({
      formType: 'Volunteer',
      submissionId: volunteer.id,
      submittedAt: volunteer.createdAt,
      cvLink: volunteer.resumeUrl,
      details: [
        { label: 'Full Name', value: volunteer.fullName },
        { label: 'Email Address', value: volunteer.email || '—' },
        { label: 'Phone Number', value: volunteer.phone || '—' },
        { label: 'Area of Interest', value: volunteer.areaOfInterest },
        { label: 'Skills & Experience', value: volunteer.skills || '—' },
      ],
    });
  }

  /**
   * Sends admin notification when someone initiates a Partnership.
   */
  async sendPartnershipNotification(
    partnership: PartnershipInquiry,
  ): Promise<NotificationEmailResult> {
    return this.sendFormNotificationEmail({
      formType: 'Partnership Inquiry',
      submissionId: partnership.id,
      submittedAt: partnership.createdAt,
      details: [
        { label: 'Contact Person', value: partnership.yourName },
        { label: 'Organisation Name', value: partnership.orgName },
        { label: 'Phone Number', value: partnership.phone },
        { label: 'Partnership Type', value: partnership.partnershipType },
        { label: 'Proposal / Message', value: partnership.proposal || '—' },
      ],
    });
  }

  private async sendFormNotificationEmail(
    params: FormSubmissionNotificationParams,
  ): Promise<NotificationEmailResult> {
    const recipient =
      process.env.SUBMISSION_NOTIFICATION_EMAIL || '';

    if (!this.resend) {
      this.logger.warn(
        `Skipping ${params.formType} submission notification to ${recipient} because RESEND_API_KEY is missing.`,
      );
      return { status: 'skipped', reason: 'RESEND_API_KEY is missing' };
    }

    try {
      const subject = `New ${params.formType} Submission — IHDUA`;
      const html = this.buildFormSubmissionEmailHtml(params);

      const { data, error } = await this.resend.emails.send({
        from: `IHDUA <${this.fromEmail}>`,
        to: [recipient],
        subject,
        html,
      });

      if (error) {
        this.logger.error(
          `Failed to send ${params.formType} notification to ${recipient}: ${error.name} - ${error.message}`,
        );
        return { status: 'error', message: `${error.name}: ${error.message}` };
      }

      this.logger.log(
        `Form notification for ${params.formType} sent to ${recipient} (ID: ${data?.id})`,
      );
      return { status: 'sent', id: data?.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(
        `Error sending ${params.formType} notification to ${recipient}: ${message}`,
      );
      return { status: 'error', message };
    }
  }

  private buildFormSubmissionEmailHtml(
    params: FormSubmissionNotificationParams,
  ): string {
    const formType = this.escape(params.formType);
    const dateLabel = new Date(params.submittedAt ?? Date.now()).toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      },
    );

    const recipient =
      process.env.SUBMISSION_NOTIFICATION_EMAIL || '';

    const rowsHtml = params.details
      .map((detail) => {
        const label = this.escape(detail.label);
        let rawVal = detail.value;
        if (rawVal === undefined || rawVal === null || rawVal === '') {
          rawVal = '—';
        }
        const valStr = String(rawVal);
        const isUrl = /^https?:\/\//i.test(valStr);
        const escapedVal = this.escape(valStr);
        const displayVal = isUrl
          ? `<a href="${escapedVal}" target="_blank" style="color:#6B21A8;word-break:break-all;text-decoration:underline;">${escapedVal}</a>`
          : escapedVal;

        const isLongText =
          valStr.length > 70 ||
          /skills|proposal|message|details/i.test(detail.label);

        if (isLongText) {
          return `<tr>
          <td colspan="2" style="padding:12px 0 8px 0;border-bottom:1px solid #EBE4E1;">
            <div style="font-size:12px;font-weight:700;color:#786C78;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">${label}</div>
            <div style="font-size:13px;font-weight:400;line-height:1.6;color:#1F1622;background:#FFFFFF;border:1px solid #EBE4E1;border-radius:6px;padding:12px 14px;white-space:pre-wrap;word-break:break-word;text-align:left;">${displayVal}</div>
          </td>
        </tr>`;
        }

        return `<tr>
          <td style="padding:10px 12px 10px 0;font-size:13px;color:#786C78;border-bottom:1px solid #EBE4E1;width:36%;vertical-align:top;">${label}</td>
          <td style="padding:10px 0;font-size:13px;font-weight:600;color:#1F1622;border-bottom:1px solid #EBE4E1;vertical-align:top;word-break:break-word;text-align:left;">${displayVal}</td>
        </tr>`;
      })
      .join('\n');

    let cvSectionHtml = '';
    if (params.cvLink) {
      const cvUrl = this.escape(params.cvLink);
      cvSectionHtml = `
          <!-- CV Callout -->
          <tr>
            <td style="padding:0 28px 24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:4px solid #FFD638;background:#FFFDF0;border-radius:0 8px 8px 0;border:1px solid #F6E58D;border-left-width:4px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 6px 0;font-size:13px;font-weight:700;color:#1F1622;">
                      Attached Resume / Curriculum Vitae
                    </p>
                    <p style="margin:0 0 14px 0;font-size:13px;line-height:1.5;color:#5E5360;">
                      The applicant uploaded their resume document with this application. You can view or download it directly:
                    </p>
                    <a href="${cvUrl}" target="_blank" style="display:inline-block;background:#5C1B58;color:#FFFFFF;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:600;">
                      View / Download Resume &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New ${formType} Form Submission</title>
</head>
<body style="margin:0;padding:0;background:#F6F3EE;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F3EE;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(31,22,34,0.08);">

          <!-- Brand bar -->
          <tr>
            <td style="background:#1F1622;padding:22px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:18px;font-weight:700;color:#FFFFFF;letter-spacing:0.4px;">
                    IHDUA <span style="color:#FFD638;">ACADEMY</span>
                  </td>
                  <td align="right" style="font-size:12px;color:#D8CFD8;">
                    Website Notification
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent stripe -->
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(90deg,#5C1B58 0%,#FFD638 50%,#FFA726 100%);">
              &nbsp;
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:32px 28px 12px 28px;">
              <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#5C1B58;">
                ${formType}
              </p>
              <h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.3;font-weight:700;color:#1F1622;">
                New ${formType} Received
              </h1>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#5E5360;">
                A new submission has been received from the IHDUA website. Below are the details submitted by the user:
              </p>
            </td>
          </tr>

          <!-- Submission details table -->
          <tr>
            <td style="padding:16px 28px 24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF8F5;border-radius:10px;border:1px solid #EBE4E1;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#1F1622;">
                      Submitted Form Details
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${rowsHtml}
                      <tr>
                        <td style="padding:10px 12px 10px 0;font-size:13px;color:#786C78;width:36%;">Submitted At</td>
                        <td style="padding:10px 0;font-size:13px;font-weight:600;color:#1F1622;text-align:left;">${this.escape(dateLabel)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${cvSectionHtml}

          <!-- Footer info -->
          <tr>
            <td style="padding:0 28px 28px 28px;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#786C78;">
                This notification was automatically sent to ${this.escape(recipient)} upon form submission.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1F1622;padding:20px 28px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:13px;color:#FFFFFF;">
                <a href="https://ihdua.org" style="color:#FFD638;text-decoration:none;font-weight:600;">www.ihdua.org</a>
              </p>
              <p style="margin:0;font-size:11px;line-height:1.5;color:#D8CFD8;">
                International Human Development and Upliftment Academy<br />
                Automated Notification &bull; IHDUA
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
