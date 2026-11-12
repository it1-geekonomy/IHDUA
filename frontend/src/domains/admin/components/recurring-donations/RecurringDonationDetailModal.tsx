"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Ban,
  Loader2,
  Pause,
  Play,
  Repeat,
  RotateCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchSubscriptionById,
  runSubscriptionAction,
  type AdminSubscriptionDetail,
  type SubscriptionAction,
} from "@/domains/admin/lib/api";
import {
  DONATION_STATUS_CONFIG,
  formatDonationAmount,
  formatDonationDate,
} from "@/domains/admin/components/donations/types";
import {
  canCancel,
  canPause,
  canResume,
  FREQUENCY_LABELS,
  SUBSCRIPTION_STATUS_CONFIG,
} from "./config";

interface RecurringDonationDetailModalProps {
  id: string;
  token: string;
  onClose: () => void;
  onChanged: () => void;
}

const CONFIRM_TEXT: Partial<Record<SubscriptionAction, string>> = {
  cancel:
    "Cancel this recurring donation? Razorpay will stop all future charges immediately. This cannot be undone.",
  pause: "Pause this recurring donation? No charges will be taken until it is resumed.",
};

export function RecurringDonationDetailModal({
  id,
  token,
  onClose,
  onChanged,
}: RecurringDonationDetailModalProps) {
  const [detail, setDetail] = useState<AdminSubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<SubscriptionAction | null>(null);

  const load = useCallback(async () => {
    try {
      setDetail(await fetchSubscriptionById(token, id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recurring donation.");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    let cancelled = false;
    fetchSubscriptionById(token, id)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load recurring donation.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, id]);

  const run = async (action: SubscriptionAction) => {
    const confirmText = CONFIRM_TEXT[action];
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(action);
    setError(null);
    try {
      await runSubscriptionAction(token, id, action);
      await load();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not ${action} this donation.`);
    } finally {
      setBusy(null);
    }
  };

  const statusCfg = detail ? SUBSCRIPTION_STATUS_CONFIG[detail.status] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-figtree overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <Repeat className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-lora text-lg font-bold text-[#0F1C1D]">
                Recurring Donation
              </h2>
              {detail && statusCfg && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[11px] text-[#5F6C6D]">
                    {detail.razorpaySubscriptionId}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 text-[10px] font-semibold",
                      statusCfg.badgeCls,
                    )}
                  >
                    <span className={cn("h-1 w-1 rounded-full", statusCfg.dotCls)} />
                    {statusCfg.label}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 font-medium">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {loading && !detail ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#5F6C6D]">
            <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
            <p className="mt-2 text-xs">Loading recurring donation…</p>
          </div>
        ) : detail ? (
          <>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <Field label="Donor" value={detail.fullName} />
              <Field label="Email" value={detail.email} />
              <Field label="Phone" value={detail.phone} />
              <Field label="City" value={detail.city} />
              <Field label="PAN" value={detail.pan} mono />
              <Field label="Category" value={detail.donationCategory} />
              <Field
                label="Amount"
                value={`${formatDonationAmount(detail.amount, detail.currency)} · ${FREQUENCY_LABELS[detail.frequency]}`}
              />
              <Field
                label="Charges"
                value={`${detail.paidCount} paid of ${detail.totalCount}`}
              />
              <Field
                label="Next charge"
                value={detail.nextChargeAt ? formatDonationDate(detail.nextChargeAt) : null}
              />
              <Field label="Started" value={formatDonationDate(detail.createdAt)} />
              {detail.endedAt && (
                <Field label="Ended" value={formatDonationDate(detail.endedAt)} />
              )}
              <Field label="Address" value={detail.address} />
              {detail.message && (
                <div className="sm:col-span-2">
                  <Field label="Message" value={detail.message} />
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-[#E5E0D8] pt-4">
              <ActionButton
                icon={RotateCw}
                label="Sync from Razorpay"
                busy={busy === "sync"}
                disabled={!!busy}
                onClick={() => void run("sync")}
              />
              {canPause(detail.status) && (
                <ActionButton
                  icon={Pause}
                  label="Pause"
                  busy={busy === "pause"}
                  disabled={!!busy}
                  onClick={() => void run("pause")}
                />
              )}
              {canResume(detail.status) && (
                <ActionButton
                  icon={Play}
                  label="Resume"
                  busy={busy === "resume"}
                  disabled={!!busy}
                  onClick={() => void run("resume")}
                />
              )}
              {canCancel(detail.status) && (
                <ActionButton
                  icon={Ban}
                  label="Cancel"
                  danger
                  busy={busy === "cancel"}
                  disabled={!!busy}
                  onClick={() => void run("cancel")}
                />
              )}
            </div>

            <div className="mt-5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#5F6C6D]">
                Charges ({detail.charges.length})
              </h3>
              {detail.charges.length === 0 ? (
                <p className="mt-2 rounded-lg border border-dashed border-[#D9D3C9] p-4 text-center text-xs text-[#8A847A]">
                  No charges yet. The first charge is recorded once Razorpay collects it.
                </p>
              ) : (
                <div className="mt-2 overflow-hidden rounded-lg border border-[#E5E0D8]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F4] text-[10.5px] font-bold uppercase tracking-wider text-[#5F6C6D]">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Amount</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Receipt</th>
                        <th className="py-2 px-3">Payment ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]">
                      {detail.charges.map((charge) => {
                        const cfg =
                          DONATION_STATUS_CONFIG[charge.status] ||
                          DONATION_STATUS_CONFIG.pending;
                        return (
                          <tr key={charge.id}>
                            <td className="py-2 px-3 text-[#5F6C6D] whitespace-nowrap">
                              {formatDonationDate(charge.createdAt)}
                            </td>
                            <td className="py-2 px-3 font-mono font-semibold text-[#0F1C1D]">
                              {formatDonationAmount(charge.amount, charge.currency)}
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full border px-2 text-[10px] font-semibold",
                                  cfg.badgeCls,
                                )}
                              >
                                {cfg.label}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-mono text-[11px] text-[#5F6C6D]">
                              {charge.receiptNumber || "—"}
                            </td>
                            <td className="py-2 px-3 font-mono text-[11px] text-[#8A847A]">
                              {charge.razorpayPaymentId || "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#8A847A]">{label}</p>
      <p className={cn("mt-0.5 text-[#0F1C1D] break-words", mono && "font-mono")}>
        {value || "—"}
      </p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  busy,
  disabled,
  danger = false,
}: {
  icon: typeof Pause;
  label: string;
  onClick: () => void;
  busy: boolean;
  disabled: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium shadow-2xs transition-colors disabled:opacity-50 cursor-pointer",
        danger
          ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
          : "border-[#D9D3C9] bg-white text-[#0F1C1D] hover:bg-[#FAF8F4]",
      )}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
      <span>{label}</span>
    </button>
  );
}
