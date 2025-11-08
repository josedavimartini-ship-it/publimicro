'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Verification {
  id: string;
  user_id: string;
  cpf: string;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  document_type: string;
  document_number: string;
  document_front_url: string;
  document_back_url: string | null;
  selfie_url: string;
  status: 'pending' | 'approved' | 'rejected' | 'manual_review';
  cpf_check_status: string | null;
  criminal_check_status: string | null;
  rejection_reason: string | null;
  admin_notes: string | null;
  created_at: string;
  user_profiles: {
    full_name: string;
    email: string;
    phone_number: string;
  };
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('manual_review');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (loading === false) {
      fetchVerifications();
    }
  }, [statusFilter, searchQuery, loading]);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/entrar?redirect=/admin/verificacoes');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Admin access check error:', error);
      router.push('/');
    }
  };

  const fetchVerifications = async () => {
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        search: searchQuery,
      });

      const response = await fetch(`/api/admin/verifications?${params}`);
      const data = await response.json();

      if (response.ok) {
        setVerifications(data.verifications || []);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedVerification) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/verifications/${selectedVerification.id}/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: actionNotes }),
        }
      );

      if (response.ok) {
        setShowModal(false);
        setSelectedVerification(null);
        setActionNotes('');
        fetchVerifications();
      } else {
        alert('Erro ao aprovar verificação');
      }
    } catch (error) {
      console.error('Error approving verification:', error);
      alert('Erro ao aprovar verificação');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedVerification || !rejectionReason) {
      alert('Motivo da rejeição é obrigatório');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/verifications/${selectedVerification.id}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            reason: rejectionReason,
            notes: actionNotes 
          }),
        }
      );

      if (response.ok) {
        setShowModal(false);
        setSelectedVerification(null);
        setActionNotes('');
        setRejectionReason('');
        fetchVerifications();
      } else {
        alert('Erro ao rejeitar verificação');
      }
    } catch (error) {
      console.error('Error rejecting verification:', error);
      alert('Erro ao rejeitar verificação');
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (verification: Verification, action: 'approve' | 'reject') => {
    setSelectedVerification(verification);
    setModalAction(action);
    setShowModal(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      manual_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    const labels = {
      pending: 'Pendente',
      manual_review: 'Revisão Manual',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fila de Verificações
          </h1>
          <p className="text-gray-600">
            Gerencie solicitações de verificação de identidade
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="manual_review">Revisão Manual</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovados</option>
                <option value="rejected">Rejeitados</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por Nome ou CPF
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite nome ou CPF..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aguardando Revisão</p>
                <p className="text-2xl font-bold text-blue-600">
                  {verifications.filter(v => v.status === 'manual_review').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprovados Hoje</p>
                <p className="text-2xl font-bold text-green-600">
                  {verifications.filter(v => 
                    v.status === 'approved' && 
                    new Date(v.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejeitados Hoje</p>
                <p className="text-2xl font-bold text-red-600">
                  {verifications.filter(v => 
                    v.status === 'rejected' && 
                    new Date(v.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {verifications.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Verifications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {verifications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Nenhuma verificação encontrada
                    </td>
                  </tr>
                ) : (
                  verifications.map((verification) => (
                    <tr key={verification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {verification.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {verification.user_profiles?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {verification.cpf}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {verification.document_type.toUpperCase()} - {verification.document_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(verification.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(verification.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedVerification(verification)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Ver Documentos
                        </button>
                        {verification.status === 'manual_review' && (
                          <>
                            <button
                              onClick={() => openActionModal(verification, 'approve')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => openActionModal(verification, 'reject')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Rejeitar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedVerification && !showModal && (
        <DocumentViewerModal
          verification={selectedVerification}
          onClose={() => setSelectedVerification(null)}
          onApprove={() => openActionModal(selectedVerification, 'approve')}
          onReject={() => openActionModal(selectedVerification, 'reject')}
        />
      )}

      {/* Action Modal */}
      {showModal && selectedVerification && (
        <ActionModal
          action={modalAction!}
          verification={selectedVerification}
          notes={actionNotes}
          setNotes={setActionNotes}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          loading={actionLoading}
          onConfirm={modalAction === 'approve' ? handleApprove : handleReject}
          onCancel={() => {
            setShowModal(false);
            setActionNotes('');
            setRejectionReason('');
          }}
        />
      )}
    </div>
  );
}

// Document Viewer Modal Component
function DocumentViewerModal({
  verification,
  onClose,
  onApprove,
  onReject,
}: {
  verification: Verification;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Documentos de {verification.full_name}
              </h2>
              <p className="text-gray-600 mt-1">
                CPF: {verification.cpf} | {verification.document_type.toUpperCase()}: {verification.document_number}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Informações Pessoais</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nome Completo:</span>
                <span className="ml-2 font-medium">{verification.full_name}</span>
              </div>
              <div>
                <span className="text-gray-600">Data de Nascimento:</span>
                <span className="ml-2 font-medium">{verification.date_of_birth}</span>
              </div>
              <div>
                <span className="text-gray-600">Telefone:</span>
                <span className="ml-2 font-medium">{verification.phone_number}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{verification.user_profiles?.email}</span>
              </div>
            </div>
          </div>

          {/* Check Results */}
          {(verification.cpf_check_status || verification.criminal_check_status) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">Resultados das Verificações Automáticas</h3>
              <div className="space-y-2 text-sm">
                {verification.cpf_check_status && (
                  <div>
                    <span className="text-blue-700">Checagem CPF:</span>
                    <span className="ml-2 font-medium">{verification.cpf_check_status}</span>
                  </div>
                )}
                {verification.criminal_check_status && (
                  <div>
                    <span className="text-blue-700">Antecedentes Criminais:</span>
                    <span className="ml-2 font-medium">{verification.criminal_check_status}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Documento (Frente)</h3>
              <img
                src={verification.document_front_url}
                alt="Documento Frente"
                className="w-full rounded-lg border border-gray-300"
              />
            </div>

            {verification.document_back_url && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Documento (Verso)</h3>
                <img
                  src={verification.document_back_url}
                  alt="Documento Verso"
                  className="w-full rounded-lg border border-gray-300"
                />
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Selfie com Documento</h3>
              <img
                src={verification.selfie_url}
                alt="Selfie"
                className="w-full rounded-lg border border-gray-300"
              />
            </div>
          </div>

          {/* Admin Notes (if any) */}
          {verification.admin_notes && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Notas do Administrador</h3>
              <p className="text-sm text-gray-700">{verification.admin_notes}</p>
            </div>
          )}

          {/* Actions */}
          {verification.status === 'manual_review' && (
            <div className="flex gap-4">
              <button
                onClick={onApprove}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                ✓ Aprovar Verificação
              </button>
              <button
                onClick={onReject}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                ✗ Rejeitar Verificação
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Action Confirmation Modal
function ActionModal({
  action,
  verification,
  notes,
  setNotes,
  rejectionReason,
  setRejectionReason,
  loading,
  onConfirm,
  onCancel,
}: {
  action: 'approve' | 'reject';
  verification: Verification;
  notes: string;
  setNotes: (notes: string) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const isApprove = action === 'approve';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {isApprove ? 'Aprovar Verificação' : 'Rejeitar Verificação'}
        </h3>

        <p className="text-gray-600 mb-4">
          Confirma a {isApprove ? 'aprovação' : 'rejeição'} da verificação de{' '}
          <span className="font-medium">{verification.full_name}</span>?
        </p>

        {!isApprove && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo da Rejeição *
            </label>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um motivo</option>
              <option value="Documento ilegível ou de má qualidade">Documento ilegível ou de má qualidade</option>
              <option value="Selfie não mostra rosto claramente">Selfie não mostra rosto claramente</option>
              <option value="Documento fora da validade">Documento fora da validade</option>
              <option value="Dados não conferem">Dados não conferem</option>
              <option value="Documento adulterado ou suspeito">Documento adulterado ou suspeito</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas Internas (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Adicione observações para referência futura..."
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || (!isApprove && !rejectionReason)}
            className={`flex-1 ${
              isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            } text-white py-2 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {loading ? 'Processando...' : isApprove ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
          </button>
        </div>
      </div>
    </div>
  );
}
