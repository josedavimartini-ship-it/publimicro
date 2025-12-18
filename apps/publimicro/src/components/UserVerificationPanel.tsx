"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, CheckCircle, Clock, 
  Camera, FileText, Smartphone, Mail, 
  ExternalLink, Upload
} from 'lucide-react';
import { 
  VERIFICATION_LEVELS, 
  VerificationLevel,
  getVerificationLevel 
} from '@/lib/userVerification';

interface UserVerificationPanelProps {
  profile?: {
    email_verified?: boolean;
    phone_verified?: boolean;
    document_verified?: boolean;
    documents_pending?: boolean;
    selfie_verified?: boolean;
    gov_br_verified?: boolean;
    profile_completed?: boolean;
    verified?: boolean;
    can_place_bids?: boolean;
  };
  onVerificationComplete?: () => void;
}

export default function UserVerificationPanel({ 
  profile, 
  onVerificationComplete 
}: UserVerificationPanelProps) {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [_uploading, setUploading] = useState(false);
  const [_showCamera, setShowCamera] = useState(false);

  const currentLevel = getVerificationLevel(profile);
  const levelInfo = VERIFICATION_LEVELS[currentLevel];

  const verificationSteps = [
    {
      id: 'email',
      label: 'Verificar Email',
      icon: Mail,
      completed: profile?.email_verified,
      description: 'Confirme seu endereço de email'
    },
    {
      id: 'phone',
      label: 'Verificar Telefone',
      icon: Smartphone,
      completed: profile?.phone_verified,
      description: 'Confirme seu número via SMS'
    },
    {
      id: 'documents',
      label: 'Enviar Documentos',
      icon: FileText,
      completed: profile?.document_verified,
      pending: profile?.documents_pending,
      description: 'CPF, RG e comprovante de endereço'
    },
    {
      id: 'selfie',
      label: 'Selfie com Documento',
      icon: Camera,
      completed: profile?.selfie_verified,
      description: 'Foto segurando seu documento'
    },
    {
      id: 'govbr',
      label: 'Verificação Gov.br',
      icon: Shield,
      completed: profile?.gov_br_verified,
      description: 'Autenticação via conta Gov.br',
      optional: true
    }
  ];

  const handleEmailVerification = async () => {
    // Trigger email verification resend
    try {
      await fetch('/api/verification/resend-email', { method: 'POST' });
      alert('Email de verificação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  const _handlePhoneVerification = () => {
    setActiveStep('phone');
  };

  const _handleDocumentUpload = async (docType: string, file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', docType);
      
      await fetch('/api/verification/upload-document', {
        method: 'POST',
        body: formData
      });
      
      // Refresh profile after upload
      onVerificationComplete?.();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleGovBrAuth = () => {
    // Redirect to Gov.br OAuth
    const govBrUrl = `https://sso.staging.acesso.gov.br/authorize?` +
      `response_type=code&` +
      `client_id=${process.env.NEXT_PUBLIC_GOV_BR_CLIENT_ID}&` +
      `scope=openid+email+phone+profile+govbr_confiabilidades&` +
      `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_GOV_BR_REDIRECT_URI || '')}&` +
      `state=${crypto.randomUUID()}`;
    
    window.location.href = govBrUrl;
  };

  const getLevelColor = (level: VerificationLevel) => {
    switch (level) {
      case 'unverified': return 'text-red-400 bg-red-500/20';
      case 'email_verified': return 'text-yellow-400 bg-yellow-500/20';
      case 'phone_verified': return 'text-blue-400 bg-blue-500/20';
      case 'document_pending': return 'text-orange-400 bg-orange-500/20';
      case 'document_verified': return 'text-green-400 bg-green-500/20';
      case 'gov_br_verified': return 'text-purple-400 bg-purple-500/20';
      case 'fully_verified': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getLevelColor(currentLevel)}`}>
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#E6C98B]">Status de Verificação</h3>
            <p className={`text-sm font-semibold ${getLevelColor(currentLevel).split(' ')[0]}`}>
              {levelInfo.label}
            </p>
          </div>
        </div>
        
        {/* Level Badge */}
        <div className={`px-4 py-2 rounded-full text-sm font-bold ${getLevelColor(currentLevel)}`}>
          {currentLevel === 'fully_verified' ? '✓ Completo' : 'Em progresso'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-[#8B9B6E] mb-2">
          <span>Progresso da Verificação</span>
          <span>{verificationSteps.filter(s => s.completed).length}/{verificationSteps.filter(s => !s.optional).length}</span>
        </div>
        <div className="h-3 bg-[#2a2a1a] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#A8C97F]"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(verificationSteps.filter(s => s.completed).length / verificationSteps.filter(s => !s.optional).length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Verification Steps */}
      <div className="space-y-4">
        {verificationSteps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          
          return (
            <motion.div
              key={step.id}
              className={`border-2 rounded-xl transition-all ${
                step.completed 
                  ? 'border-[#A8C97F]/50 bg-[#A8C97F]/5' 
                  : step.pending
                    ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5'
                    : 'border-[#2a2a1a] bg-[#0a0a0a]'
              }`}
              layout
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setActiveStep(isActive ? null : step.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-[#A8C97F]/20 text-[#A8C97F]' 
                      : step.pending
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        : 'bg-[#2a2a1a] text-[#676767]'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : step.pending ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        step.completed ? 'text-[#A8C97F]' : 'text-[#E6C98B]'
                      }`}>
                        {step.label}
                      </span>
                      {step.optional && (
                        <span className="text-xs px-2 py-0.5 bg-[#2a2a1a] rounded text-[#676767]">
                          Opcional
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#8B9B6E]">{step.description}</p>
                  </div>
                </div>
                
                {step.completed ? (
                  <span className="text-[#A8C97F] text-sm font-semibold">✓ Concluído</span>
                ) : step.pending ? (
                  <span className="text-[#D4AF37] text-sm font-semibold">⏳ Em análise</span>
                ) : (
                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    className="text-[#676767]"
                  >
                    ▼
                  </motion.div>
                )}
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isActive && !step.completed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-[#2a2a1a]">
                      {step.id === 'email' && (
                        <button
                          onClick={() => void handleEmailVerification()}
                          className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962A] text-[#0a0a0a] font-bold rounded-xl hover:opacity-90 transition-opacity"
                        >
                          Reenviar Email de Verificação
                        </button>
                      )}

                      {step.id === 'phone' && (
                        <div className="space-y-4">
                          <input
                            type="tel"
                            placeholder="(00) 00000-0000"
                            className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#2a2a1a] rounded-xl text-[#E6C98B] placeholder-[#676767] focus:border-[#D4AF37] focus:outline-none"
                          />
                          <button
                            className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962A] text-[#0a0a0a] font-bold rounded-xl hover:opacity-90 transition-opacity"
                          >
                            Enviar Código SMS
                          </button>
                        </div>
                      )}

                      {step.id === 'documents' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['CPF/RG (frente)', 'CPF/RG (verso)', 'Comprovante de Endereço'].map((doc, i) => (
                              <label
                                key={i}
                                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#3a3a2a] rounded-xl cursor-pointer hover:border-[#D4AF37] transition-colors"
                              >
                                <Upload className="w-5 h-5 text-[#D4AF37]" />
                                <span className="text-sm text-[#8B9B6E]">{doc}</span>
                                <input type="file" accept="image/*,.pdf" className="hidden" />
                              </label>
                            ))}
                          </div>
                          <p className="text-xs text-[#676767] text-center">
                            Formatos aceitos: JPG, PNG, PDF (máx. 5MB cada)
                          </p>
                        </div>
                      )}

                      {step.id === 'selfie' && (
                        <div className="space-y-4">
                          <div className="aspect-video bg-[#0a0a0a] rounded-xl flex items-center justify-center border-2 border-dashed border-[#3a3a2a]">
                            <div className="text-center">
                              <Camera className="w-12 h-12 text-[#D4AF37] mx-auto mb-2" />
                              <p className="text-[#8B9B6E] text-sm">
                                Tire uma selfie segurando seu documento
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowCamera(true)}
                            className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962A] text-[#0a0a0a] font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                          >
                            <Camera className="w-5 h-5" />
                            Abrir Câmera
                          </button>
                        </div>
                      )}

                      {step.id === 'govbr' && (
                        <div className="space-y-4">
                          <div className="bg-[#0D47A1]/10 border border-[#0D47A1]/30 rounded-xl p-4">
                            <p className="text-sm text-[#8B9B6E] mb-4">
                              Autentique-se com sua conta Gov.br (nível Prata ou Ouro) para verificação instantânea.
                            </p>
                            <ul className="text-xs text-[#676767] space-y-1 mb-4">
                              <li>✓ Verificação instantânea</li>
                              <li>✓ Dados importados automaticamente</li>
                              <li>✓ Selo de confiança Gov.br</li>
                            </ul>
                          </div>
                          <button
                            onClick={handleGovBrAuth}
                            className="w-full py-3 bg-[#0D47A1] text-white font-bold rounded-xl hover:bg-[#1565C0] transition-colors flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="w-5 h-5" />
                            Entrar com Gov.br
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-[#2a2a1a] rounded-xl">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#A8C97F] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#E6C98B] text-sm mb-1">Seus dados estão protegidos</h4>
            <p className="text-xs text-[#8B9B6E]">
              Utilizamos criptografia de ponta a ponta e seguimos a LGPD. 
              Seus documentos são usados apenas para verificação de identidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
