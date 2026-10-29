"use client";

import { LegalDocumentManager } from "./legal/LegalDocumentManager";
import type { LegalDocumentApi } from "./legal/types";
import {
  createTermsAndConditions,
  deleteTermsAndConditions,
  fetchDeletedTermsAndConditions,
  fetchTermsAndConditions,
  restoreTermsAndConditions,
  updateTermsAndConditions,
} from "@/domains/admin/lib/api";

const TERMS_API: LegalDocumentApi = {
  fetchList: fetchTermsAndConditions,
  fetchDeleted: fetchDeletedTermsAndConditions,
  create: createTermsAndConditions,
  update: updateTermsAndConditions,
  remove: deleteTermsAndConditions,
  restore: restoreTermsAndConditions,
};

export function TermsAndConditionsPage() {
  return (
    <LegalDocumentManager
      documentType="Terms & Conditions"
      documentNoun="terms"
      api={TERMS_API}
      defaultMetaTitle="Terms and Conditions | IHDUA"
      defaultMetaDescription="Read the official terms and conditions governing IHDUA's programs, donations, and platform services."
    />
  );
}
