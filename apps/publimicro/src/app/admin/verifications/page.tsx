"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface PendingVerification {
  id: string;
  full_name: string;
  email: string;
  cpf: string;
  birth_date?: string;
  created_at: string;
  verification_status: string;
  rejection_reason?: string;
  police_alert?: boolean;
}

export default function AdminVerificationsPage() {
  const { t } = useI18n();
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/pending-verifications")
      .then((res) => res.json())
      .then((data) => {
        setVerifications(data.verifications || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Admin action handlers
  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pending-verifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error(await res.text());
      // Refresh list
      const data = await res.json();
      setVerifications(data.verifications || []);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#D4AF37]">
        {t("admin.verifications_title") || "Pending Verifications"}
      </h1>
      {loading && <div>{t("admin.loading") || "Loading..."}</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="w-full border border-[#242424] rounded-xl overflow-hidden">
        <thead className="bg-[#181818] text-[#D4AF37]">
          <tr>
            <th className="p-3">{t("admin.name") || "Name"}</th>
            <th className="p-3">{t("admin.email") || "Email"}</th>
            <th className="p-3">{t("admin.cpf") || "CPF"}</th>
            <th className="p-3">{t("admin.birth_date") || "Birth Date"}</th>
            <th className="p-3">{t("admin.status") || "Status"}</th>
            <th className="p-3">{t("admin.actions") || "Actions"}</th>
            <th className="p-3">Alert</th>
          </tr>
        </thead>
        <tbody>
          {verifications.map((v) => (
            <tr key={v.id} className="border-b border-[#242424]">
              <td className="p-3">{v.full_name}</td>
              <td className="p-3">{v.email}</td>
              <td className="p-3">{v.cpf}</td>
              <td className="p-3">{v.birth_date || "-"}</td>
              <td className="p-3">{t(`admin.status_${v.verification_status}`) || v.verification_status}</td>
              <td className="p-3">
                {v.verification_status === 'needs_review' && (
                  <>
                    <button
                      className="px-3 py-1 bg-[#8B9B6E] text-white rounded mr-2 hover:bg-[#6b7b4e]"
                      onClick={() => handleAction(v.id, 'approve')}
                    >
                      {t("admin.approve") || "Approve"}
                    </button>
                    <button
                      className="px-3 py-1 bg-[#CD5C5C] text-white rounded hover:bg-[#a94442]"
                      onClick={() => handleAction(v.id, 'reject')}
                    >
                      {t("admin.reject") || "Reject"}
                    </button>
                  </>
                )}
              </td>
              <td className="p-3">
                {v.police_alert ? (
                  <span className="text-red-500 font-bold">🚨</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {verifications.length === 0 && !loading && (
        <div className="mt-8 text-[#A8896B]">{t("admin.no_pending") || "No pending verifications."}</div>
      )}
    </div>
  );
}
