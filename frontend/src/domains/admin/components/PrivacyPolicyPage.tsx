"use client";

import { LegalDocumentManager } from "./legal/LegalDocumentManager";
import type { LegalDocumentApi } from "./legal/types";
import {
  createPrivacyPolicy,
  deletePrivacyPolicy,
  fetchDeletedPrivacyPolicies,
  fetchPrivacyPolicies,
  restorePrivacyPolicy,
  updatePrivacyPolicy,
} from "@/domains/admin/lib/api";

const PRIVACY_API: LegalDocumentApi = {
  fetchList: fetchPrivacyPolicies,
  fetchDeleted: fetchDeletedPrivacyPolicies,
  create: createPrivacyPolicy,
  update: updatePrivacyPolicy,
  remove: deletePrivacyPolicy,
  restore: restorePrivacyPolicy,
};

export function PrivacyPolicyPage() {
  return (
    <LegalDocumentManager
      documentType="Privacy Policy"
      documentNoun="privacy policy"
      api={PRIVACY_API}
      defaultMetaTitle="Privacy Policy | IHDUA"
      defaultMetaDescription="Read the official privacy policy explaining how IHDUA collects, protects, and handles personal data."
    />
  );
}
