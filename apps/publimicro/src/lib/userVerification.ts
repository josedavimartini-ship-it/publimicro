/**
 * User Verification System Configuration
 * 
 * This file defines the verification levels, requirements, and methods
 * for secure user registration on PubliMicro.
 */

export type VerificationLevel = 
  | 'unverified'        // New user, no verification
  | 'email_verified'    // Email confirmed
  | 'phone_verified'    // Phone number verified via SMS
  | 'document_pending'  // Documents submitted, awaiting review
  | 'document_verified' // Documents verified (ID + selfie match)
  | 'gov_br_verified'   // Verified via gov.br integration
  | 'fully_verified';   // All verifications complete + background check

export type DocumentType = 
  | 'cpf'           // CPF number
  | 'rg'            // RG (identity card)
  | 'cnh'           // CNH (driver's license)
  | 'passport'      // Passport
  | 'proof_address' // Proof of address
  | 'selfie_doc'    // Selfie holding document
  | 'facial_scan';  // Facial recognition scan

export interface VerificationRequirement {
  level: VerificationLevel;
  label: string;
  description: string;
  required_for: string[];
  documents_needed: DocumentType[];
  auto_verify: boolean;
  manual_review: boolean;
  estimated_time: string;
}

export const VERIFICATION_LEVELS: Record<VerificationLevel, VerificationRequirement> = {
  unverified: {
    level: 'unverified',
    label: 'Não Verificado',
    description: 'Conta recém-criada, sem verificações',
    required_for: ['browsing', 'favorites'],
    documents_needed: [],
    auto_verify: false,
    manual_review: false,
    estimated_time: 'N/A'
  },
  email_verified: {
    level: 'email_verified',
    label: 'Email Verificado',
    description: 'Email confirmado através de link de verificação',
    required_for: ['post_free_listing', 'send_messages'],
    documents_needed: [],
    auto_verify: true,
    manual_review: false,
    estimated_time: 'Instantâneo'
  },
  phone_verified: {
    level: 'phone_verified',
    label: 'Telefone Verificado',
    description: 'Número de celular verificado via SMS',
    required_for: ['contact_sellers', 'receive_notifications'],
    documents_needed: [],
    auto_verify: true,
    manual_review: false,
    estimated_time: 'Até 5 minutos'
  },
  document_pending: {
    level: 'document_pending',
    label: 'Documentos em Análise',
    description: 'Documentos enviados, aguardando verificação manual',
    required_for: [],
    documents_needed: ['cpf', 'rg', 'selfie_doc'],
    auto_verify: false,
    manual_review: true,
    estimated_time: '24-48 horas'
  },
  document_verified: {
    level: 'document_verified',
    label: 'Documentos Verificados',
    description: 'Identidade confirmada através de documentos e selfie',
    required_for: ['post_paid_listings', 'schedule_visits', 'make_proposals'],
    documents_needed: ['cpf', 'rg', 'selfie_doc', 'proof_address'],
    auto_verify: false,
    manual_review: true,
    estimated_time: '1-3 dias úteis'
  },
  gov_br_verified: {
    level: 'gov_br_verified',
    label: 'Gov.br Verificado',
    description: 'Identidade confirmada via integração com Gov.br',
    required_for: ['high_value_transactions', 'property_sales'],
    documents_needed: [],
    auto_verify: true,
    manual_review: false,
    estimated_time: 'Instantâneo (via Gov.br)'
  },
  fully_verified: {
    level: 'fully_verified',
    label: 'Totalmente Verificado',
    description: 'Todas as verificações completas incluindo checagem de antecedentes',
    required_for: ['all_features', 'priority_support', 'verified_badge'],
    documents_needed: ['cpf', 'rg', 'selfie_doc', 'proof_address', 'facial_scan'],
    auto_verify: false,
    manual_review: true,
    estimated_time: '3-5 dias úteis'
  }
};

// Background check types
export type BackgroundCheckType = 
  | 'criminal_federal'    // Federal criminal records
  | 'criminal_state'      // State criminal records
  | 'civil_lawsuits'      // Civil lawsuits
  | 'cpf_status'          // CPF regular status
  | 'debit_restrictions'  // Serasa/SPC restrictions
  | 'fraud_alerts';       // Fraud databases

export interface BackgroundCheck {
  type: BackgroundCheckType;
  label: string;
  description: string;
  provider: string;
  required_level: VerificationLevel;
  blocks_registration: boolean;
}

export const BACKGROUND_CHECKS: BackgroundCheck[] = [
  {
    type: 'cpf_status',
    label: 'Situação do CPF',
    description: 'Verifica se o CPF está regular na Receita Federal',
    provider: 'Receita Federal (via Serpro)',
    required_level: 'email_verified',
    blocks_registration: true
  },
  {
    type: 'criminal_federal',
    label: 'Antecedentes Criminais Federais',
    description: 'Consulta no sistema da Polícia Federal',
    provider: 'Polícia Federal',
    required_level: 'document_verified',
    blocks_registration: false
  },
  {
    type: 'criminal_state',
    label: 'Antecedentes Criminais Estaduais',
    description: 'Consulta nos tribunais estaduais',
    provider: 'Tribunais de Justiça',
    required_level: 'document_verified',
    blocks_registration: false
  },
  {
    type: 'fraud_alerts',
    label: 'Alertas de Fraude',
    description: 'Verifica em bases de dados de fraudes conhecidas',
    provider: 'Bases Anti-fraude',
    required_level: 'email_verified',
    blocks_registration: true
  },
  {
    type: 'debit_restrictions',
    label: 'Restrições de Crédito',
    description: 'Consulta Serasa/SPC (não bloqueia, apenas informa)',
    provider: 'Serasa Experian',
    required_level: 'document_verified',
    blocks_registration: false
  }
];

// Facial recognition configuration
export interface FacialRecognitionConfig {
  enabled: boolean;
  provider: 'aws_rekognition' | 'azure_face' | 'google_vision' | 'manual';
  liveness_detection: boolean;
  minimum_confidence: number; // 0-100
  max_attempts: number;
  cooldown_minutes: number;
}

export const FACIAL_RECOGNITION_CONFIG: FacialRecognitionConfig = {
  enabled: true,
  provider: 'aws_rekognition', // Can be configured
  liveness_detection: true,     // Prevents photo spoofing
  minimum_confidence: 95,       // 95% match required
  max_attempts: 3,
  cooldown_minutes: 30
};

// Gov.br OAuth configuration
export interface GovBrConfig {
  enabled: boolean;
  client_id: string;
  redirect_uri: string;
  scopes: string[];
  trust_level_minimum: number; // 1 = bronze, 2 = prata, 3 = ouro
}

export const GOV_BR_CONFIG: GovBrConfig = {
  enabled: true,
  client_id: process.env.NEXT_PUBLIC_GOV_BR_CLIENT_ID || '',
  redirect_uri: process.env.NEXT_PUBLIC_GOV_BR_REDIRECT_URI || '',
  scopes: ['openid', 'email', 'phone', 'profile', 'govbr_confiabilidades'],
  trust_level_minimum: 2 // Prata ou superior
};

// Free listing limits
export interface FreeListingConfig {
  enabled: boolean;
  max_per_user: number;
  max_photos: number;
  max_video_duration_seconds: number;
  max_video_size_mb: number;
  listing_duration_days: number;
  renewal_allowed: boolean;
  required_verification_level: VerificationLevel;
}

export const FREE_LISTING_CONFIG: FreeListingConfig = {
  enabled: true,
  max_per_user: 1,              // Only ONE free listing per user EVER
  max_photos: 3,
  max_video_duration_seconds: 30,
  max_video_size_mb: 50,
  listing_duration_days: 30,
  renewal_allowed: false,       // Cannot renew free listing
  required_verification_level: 'email_verified'
};

// Verification status helper functions
interface UserProfile {
  gov_br_verified?: boolean;
  fully_verified?: boolean;
  document_verified?: boolean;
  documents_pending?: boolean;
  phone_verified?: boolean;
  email_verified?: boolean;
  free_listing_used?: boolean;
}

export function getVerificationLevel(profile?: UserProfile): VerificationLevel {
  if (!profile) return 'unverified';
  
  if (profile.gov_br_verified) return 'gov_br_verified';
  if (profile.fully_verified) return 'fully_verified';
  if (profile.document_verified) return 'document_verified';
  if (profile.documents_pending) return 'document_pending';
  if (profile.phone_verified) return 'phone_verified';
  if (profile.email_verified) return 'email_verified';
  
  return 'unverified';
}

export function canPerformAction(
  profile: UserProfile | undefined, 
  action: string
): { allowed: boolean; reason?: string; required_level?: VerificationLevel } {
  const currentLevel = getVerificationLevel(profile);
  
  // Define action requirements
  const actionRequirements: Record<string, VerificationLevel> = {
    'browse': 'unverified',
    'favorites': 'unverified',
    'post_free_listing': 'email_verified',
    'send_messages': 'phone_verified',
    'contact_sellers': 'phone_verified',
    'schedule_visits': 'document_verified',
    'make_proposals': 'document_verified',
    'post_paid_listings': 'document_verified',
    'high_value_transactions': 'gov_br_verified',
    'property_sales': 'fully_verified'
  };

  const levelOrder: VerificationLevel[] = [
    'unverified',
    'email_verified',
    'phone_verified',
    'document_pending',
    'document_verified',
    'gov_br_verified',
    'fully_verified'
  ];

  const requiredLevel = actionRequirements[action] || 'document_verified';
  const currentIndex = levelOrder.indexOf(currentLevel);
  const requiredIndex = levelOrder.indexOf(requiredLevel);

  if (currentIndex >= requiredIndex) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Esta ação requer verificação de nível "${VERIFICATION_LEVELS[requiredLevel].label}"`,
    required_level: requiredLevel
  };
}

export function hasUsedFreeListing(profile?: UserProfile): boolean {
  return profile?.free_listing_used === true;
}

export function canPostFreeListing(profile?: UserProfile): { 
  allowed: boolean; 
  reason?: string 
} {
  if (!profile) {
    return { allowed: false, reason: 'Você precisa fazer login' };
  }
  
  if (!profile.email_verified) {
    return { allowed: false, reason: 'Verifique seu email primeiro' };
  }
  
  if (profile.free_listing_used) {
    return { 
      allowed: false, 
      reason: 'Você já utilizou seu anúncio gratuito. Contrate um plano para publicar mais anúncios.' 
    };
  }
  
  return { allowed: true };
}
