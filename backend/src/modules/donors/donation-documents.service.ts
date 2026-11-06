import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CdnService } from '../../common/storage/cdn.service';
import { DonationCertificateService } from '../email/donation-certificate.service';
import { DonationReceiptService } from '../email/donation-receipt.service';
import type { DonationPdfs } from '../email/email.service';
import { Donor } from './entities/donor.entity';

/**
 * Builds the donation certificate and 80G receipt, and stores each in R2 once,
 * saving the URL on the donor. Storage failures never block the thank-you email.
 */
@Injectable()
export class DonationDocumentsService {
  private readonly logger = new Logger(DonationDocumentsService.name);

  constructor(
    @InjectRepository(Donor)
    private readonly repo: Repository<Donor>,
    private readonly certificates: DonationCertificateService,
    private readonly receipts: DonationReceiptService,
    private readonly cdn: CdnService,
  ) {}

  async prepare(donor: Donor): Promise<DonationPdfs> {
    let pdfs: DonationPdfs;
    try {
      const [certificate, receipt] = await Promise.all([
        this.certificates.buildPdf(donor),
        donor.pan ? this.receipts.buildPdf(donor) : Promise.resolve(null),
      ]);
      pdfs = { certificate, receipt };
    } catch (err) {
      this.logger.error(
        `Could not build donation PDFs for donor ${donor.id}: ${(err as Error).message}`,
      );
      return { certificate: null, receipt: null };
    }

    const updates: Partial<Pick<Donor, 'certificateUrl' | 'receiptUrl'>> = {};
    if (!donor.certificateUrl && pdfs.certificate) {
      updates.certificateUrl = await this.store(
        donor,
        pdfs.certificate,
        'certificate',
      );
    }
    if (!donor.receiptUrl && pdfs.receipt) {
      updates.receiptUrl = await this.store(donor, pdfs.receipt, 'receipt');
    }

    const saved = Object.fromEntries(
      Object.entries(updates).filter(([, url]) => url),
    );
    if (Object.keys(saved).length) {
      await this.repo.update(donor.id, saved);
      Object.assign(donor, saved);
    }
    return pdfs;
  }

  private async store(
    donor: Donor,
    pdf: Buffer,
    kind: 'certificate' | 'receipt',
  ): Promise<string | null> {
    try {
      return await this.cdn.upload(
        {
          originalname: `IHDUA-Donation-${kind}-${donor.receiptNumber || donor.id}.pdf`,
          mimetype: 'application/pdf',
          buffer: pdf,
          size: pdf.length,
        },
        `donations/${kind}s`,
        'document',
      );
    } catch (err) {
      this.logger.warn(
        `Could not store donation ${kind} for donor ${donor.id}: ${(err as Error).message}`,
      );
      return null;
    }
  }
}
