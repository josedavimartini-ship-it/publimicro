'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Step components
import PersonalInfoStep from './steps/PersonalInfoStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import ProcessingStep from './steps/ProcessingStep';
import ResultStep from './steps/ResultStep';

type VerificationStep = 'personal_info' | 'documents' | 'processing' | 'result';

interface VerificationData {
  full_name: string;
  cpf: string;
  date_of_birth: string;
  phone_number: string;
  document_type: 'cpf' | 'rg' | 'cnh' | 'passport';
  document_number: string;
  document_front?: File;
  document_back?: File;
  selfie?: File;
}

export default function VerificationWizard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [currentStep, setCurrentStep] = useState<VerificationStep>('personal_info');
  const [verificationData, setVerificationData] = useState<Partial<VerificationData>>({});
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check existing verification status on mount
  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch('/api/verification/status');
      const data = await response.json();

      if (data.verified) {
        // Already verified, show result
        setCurrentStep('result');
        setVerificationStatus('approved');
      } else if (data.verification) {
        // Has existing verification, resume from appropriate step
        const status = data.verification.status;
        setVerificationStatus(status);

        if (status === 'pending') {
          setCurrentStep('documents');
        } else if (status === 'checking' || status === 'manual_review') {
          setCurrentStep('processing');
        } else if (status === 'approved' || status === 'rejected') {
          setCurrentStep('result');
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoSubmit = async (data: Partial<VerificationData>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/verification/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.full_name,
          cpf: data.cpf,
          date_of_birth: data.date_of_birth,
          phone_number: data.phone_number,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao iniciar verificação');
      }

      setVerificationData({ ...verificationData, ...data });
      setCurrentStep('documents');
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar informações pessoais');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (data: Partial<VerificationData>) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      if (data.document_front) formData.append('document_front', data.document_front);
      if (data.document_back) formData.append('document_back', data.document_back);
      if (data.selfie) formData.append('selfie', data.selfie);
      if (data.document_type) formData.append('document_type', data.document_type);
      if (data.document_number) formData.append('document_number', data.document_number);

      const response = await fetch('/api/verification/upload-documents', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar documentos');
      }

      setVerificationData({ ...verificationData, ...data });
      
      // Start automated checks
      await runAutomatedChecks();
      
      setCurrentStep('processing');
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer upload dos documentos');
      setLoading(false);
    }
  };

  const runAutomatedChecks = async () => {
    try {
      // Run CPF validation
      await fetch('/api/verification/check-cpf', { method: 'POST' });
      
      // Run criminal background check
      await fetch('/api/verification/check-criminal', { method: 'POST' });
      
      // Poll for status updates
      pollVerificationStatus();
    } catch (error) {
      console.error('Error running automated checks:', error);
    }
  };

  const pollVerificationStatus = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/verification/status');
        const data = await response.json();

        if (data.verification) {
          const status = data.verification.status;
          setVerificationStatus(status);

          // Stop polling when verification is complete
          if (status === 'approved' || status === 'rejected' || status === 'manual_review') {
            clearInterval(interval);
            setLoading(false);
            setCurrentStep('result');
          }
        }
      } catch (error) {
        console.error('Error polling verification status:', error);
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
    }, 120000);
  };

  const handleRetry = () => {
    setCurrentStep('personal_info');
    setVerificationData({});
    setVerificationStatus(null);
  };

  if (loading && currentStep === 'personal_info') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <StepIndicator
              number={1}
              label="Informações"
              active={currentStep === 'personal_info'}
              completed={['documents', 'processing', 'result'].includes(currentStep)}
            />
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div
                className={`h-full transition-all duration-500 ${
                  ['documents', 'processing', 'result'].includes(currentStep)
                    ? 'bg-blue-600 w-full'
                    : 'bg-gray-200 w-0'
                }`}
              />
            </div>
            <StepIndicator
              number={2}
              label="Documentos"
              active={currentStep === 'documents'}
              completed={['processing', 'result'].includes(currentStep)}
            />
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div
                className={`h-full transition-all duration-500 ${
                  ['processing', 'result'].includes(currentStep)
                    ? 'bg-blue-600 w-full'
                    : 'bg-gray-200 w-0'
                }`}
              />
            </div>
            <StepIndicator
              number={3}
              label="Verificação"
              active={currentStep === 'processing'}
              completed={currentStep === 'result'}
            />
            <div className="flex-1 h-1 bg-gray-200 mx-2">
              <div
                className={`h-full transition-all duration-500 ${
                  currentStep === 'result' ? 'bg-blue-600 w-full' : 'bg-gray-200 w-0'
                }`}
              />
            </div>
            <StepIndicator
              number={4}
              label="Resultado"
              active={currentStep === 'result'}
              completed={false}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          {currentStep === 'personal_info' && (
            <PersonalInfoStep
              initialData={verificationData}
              onSubmit={handlePersonalInfoSubmit}
              loading={loading}
            />
          )}

          {currentStep === 'documents' && (
            <DocumentUploadStep
              initialData={verificationData}
              onSubmit={handleDocumentUpload}
              onBack={() => setCurrentStep('personal_info')}
              loading={loading}
            />
          )}

          {currentStep === 'processing' && (
            <ProcessingStep status={verificationStatus || 'checking'} />
          )}

          {currentStep === 'result' && (
            <ResultStep
              status={verificationStatus || 'pending'}
              onRetry={handleRetry}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Step Indicator Component
function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
          completed
            ? 'bg-green-600 text-white'
            : active
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {completed ? '✓' : number}
      </div>
      <span
        className={`mt-2 text-xs font-medium ${
          active ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
