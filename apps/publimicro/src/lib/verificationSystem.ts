/**
 * User Verification System Configuration
 * 
 * FREE VERIFICATION OPTIONS:
 * 
 * 1. EMAIL VERIFICATION (Built-in with Supabase)
 *    - Automatic via Supabase Auth
 *    - User receives email with confirmation link
 *    - Cost: FREE
 * 
 * 2. PHONE VERIFICATION (Manual or Supabase)
 *    - Supabase has phone auth but may have SMS costs
 *    - Alternative: Manual verification via WhatsApp
 *    - Cost: FREE (manual) or ~$0.01/SMS
 * 
 * 3. DOCUMENT VERIFICATION (Manual Review)
 *    - User uploads ID document (RG, CNH, Passaporte)
 *    - Admin manually reviews and approves
 *    - Cost: FREE (your time)
 * 
 * 4. CPF VALIDATION (Free APIs)
 *    - ReceitaWS: https://www.receitaws.com.br/v1/cpf/{cpf}
 *    - Validates if CPF is real and gets basic info
 *    - Cost: FREE (limited requests)
 * 
 * 5. GOV.BR INTEGRATION (Future)
 *    - OAuth with government ID (Conta Gov.br)
 *    - Requires registration at https://acesso.gov.br/
 *    - Cost: FREE but requires bureaucratic process
 * 
 * PAID OPTIONS (for future when you have revenue):
 * - Background check APIs (BigData Corp, Neoway)
 * - Facial recognition (AWS Rekognition, Azure Face)
 * - Criminal record checks (requires partnership)
 */

export interface VerificationLevel {
  id: string;
  name: string;
  description: string;
  trustScore: number; // 1-100
  requiredFor: string[];
  methods: string[];
}

export const VERIFICATION_LEVELS: VerificationLevel[] = [
  {
    id: 'none',
    name: 'Não verificado',
    description: 'Conta criada, sem verificações',
    trustScore: 10,
    requiredFor: [],
    methods: []
  },
  {
    id: 'email',
    name: 'Email verificado',
    description: 'Email confirmado via link',
    trustScore: 25,
    requiredFor: ['browse', 'favorites'],
    methods: ['email_link']
  },
  {
    id: 'basic',
    name: 'Verificação básica',
    description: 'Email + Telefone verificados',
    trustScore: 50,
    requiredFor: ['message_sellers', 'schedule_visits'],
    methods: ['email_link', 'phone_sms', 'phone_whatsapp']
  },
  {
    id: 'standard',
    name: 'Verificação padrão',
    description: 'Email + Telefone + Documento',
    trustScore: 75,
    requiredFor: ['post_listings', 'make_proposals'],
    methods: ['email_link', 'phone_sms', 'document_upload', 'cpf_validation']
  },
  {
    id: 'full',
    name: 'Verificação completa',
    description: 'Todas as verificações + Gov.br',
    trustScore: 100,
    requiredFor: ['featured_listings', 'high_value_transactions'],
    methods: ['email_link', 'phone_sms', 'document_upload', 'cpf_validation', 'gov_br_sso', 'selfie_with_document']
  }
];

export interface VerificationMethod {
  id: string;
  name: string;
  description: string;
  cost: 'free' | 'low' | 'medium' | 'high';
  automated: boolean;
  trustIncrease: number;
  setup: string;
}

export const VERIFICATION_METHODS: VerificationMethod[] = [
  {
    id: 'email_link',
    name: 'Verificação de Email',
    description: 'Link de confirmação enviado por email',
    cost: 'free',
    automated: true,
    trustIncrease: 15,
    setup: 'Já configurado com Supabase Auth'
  },
  {
    id: 'phone_sms',
    name: 'SMS de Verificação',
    description: 'Código enviado via SMS',
    cost: 'low',
    automated: true,
    trustIncrease: 20,
    setup: 'Configurar Twilio ou usar Supabase Phone Auth'
  },
  {
    id: 'phone_whatsapp',
    name: 'Verificação via WhatsApp',
    description: 'Confirmação manual via WhatsApp Business',
    cost: 'free',
    automated: false,
    trustIncrease: 20,
    setup: 'Admin verifica manualmente via WhatsApp'
  },
  {
    id: 'document_upload',
    name: 'Upload de Documento',
    description: 'Upload de RG, CNH ou Passaporte',
    cost: 'free',
    automated: false,
    trustIncrease: 25,
    setup: 'Admin revisa documentos manualmente'
  },
  {
    id: 'cpf_validation',
    name: 'Validação de CPF',
    description: 'Verifica se CPF é válido na Receita Federal',
    cost: 'free',
    automated: true,
    trustIncrease: 15,
    setup: 'Usar ReceitaWS API gratuita (limite de requisições)'
  },
  {
    id: 'selfie_with_document',
    name: 'Selfie com Documento',
    description: 'Foto segurando documento ao lado do rosto',
    cost: 'free',
    automated: false,
    trustIncrease: 20,
    setup: 'Admin compara foto com documento manualmente'
  },
  {
    id: 'gov_br_sso',
    name: 'Login Gov.br',
    description: 'Autenticação com conta do governo',
    cost: 'free',
    automated: true,
    trustIncrease: 35,
    setup: 'Requer cadastro em https://manual-integracao-login-unico.servicos.gov.br/'
  }
];

/**
 * CPF Validation using free ReceitaWS API
 * Limite: ~3 requisições por minuto (sem cadastro)
 */
export async function validateCPF(cpf: string): Promise<{
  valid: boolean;
  name?: string;
  situation?: string;
  error?: string;
}> {
  // Remove non-digits
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Basic validation
  if (cleanCPF.length !== 11) {
    return { valid: false, error: 'CPF deve ter 11 dígitos' };
  }
  
  // Check for known invalid patterns
  if (/^(\d)\1+$/.test(cleanCPF)) {
    return { valid: false, error: 'CPF inválido' };
  }
  
  // Validate check digits
  const calcDigit = (cpf: string, factor: number): number => {
    let sum = 0;
    for (let i = 0; i < factor - 1; i++) {
      sum += parseInt(cpf[i]) * (factor - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  
  const digit1 = calcDigit(cleanCPF, 10);
  const digit2 = calcDigit(cleanCPF, 11);
  
  if (parseInt(cleanCPF[9]) !== digit1 || parseInt(cleanCPF[10]) !== digit2) {
    return { valid: false, error: 'CPF inválido (dígitos verificadores)' };
  }
  
  // Try ReceitaWS API (may be rate limited)
  try {
    const response = await fetch(`https://www.receitaws.com.br/v1/cpf/${cleanCPF}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'ERROR') {
        return { valid: false, error: data.message };
      }
      return {
        valid: true,
        name: data.nome,
        situation: data.situacao
      };
    }
  } catch (error) {
    // API unavailable, but CPF format is valid
    console.warn('ReceitaWS unavailable, using local validation only', error);
  }
  
  return { valid: true }; // Format is valid even if API is down
}

/**
 * Calculate user's verification score based on completed verifications
 */
export function calculateVerificationScore(profile: {
  email_verified?: boolean;
  phone_verified?: boolean;
  cpf_verified?: boolean;
  document_verified?: boolean;
  selfie_verified?: boolean;
  gov_br_verified?: boolean;
}): number {
  let score = 10; // Base score for having an account
  
  if (profile.email_verified) score += 15;
  if (profile.phone_verified) score += 20;
  if (profile.cpf_verified) score += 15;
  if (profile.document_verified) score += 25;
  if (profile.selfie_verified) score += 10;
  if (profile.gov_br_verified) score += 35;
  
  return Math.min(score, 100); // Cap at 100
}

/**
 * Get verification level based on score
 */
export function getVerificationLevel(score: number): VerificationLevel {
  if (score >= 90) return VERIFICATION_LEVELS[4]; // full
  if (score >= 65) return VERIFICATION_LEVELS[3]; // standard
  if (score >= 40) return VERIFICATION_LEVELS[2]; // basic
  if (score >= 20) return VERIFICATION_LEVELS[1]; // email
  return VERIFICATION_LEVELS[0]; // none
}

/**
 * Check if user can perform action based on verification level
 */
export function canPerformAction(
  action: string, 
  verificationScore: number
): { allowed: boolean; requiredLevel?: VerificationLevel } {
  const userLevel = getVerificationLevel(verificationScore);
  
  for (const level of VERIFICATION_LEVELS) {
    if (level.requiredFor.includes(action)) {
      if (userLevel.trustScore >= level.trustScore) {
        return { allowed: true };
      }
      return { allowed: false, requiredLevel: level };
    }
  }
  
  return { allowed: true }; // Action not restricted
}

/**
 * Required setup steps for you (the admin):
 * 
 * 1. EMAIL VERIFICATION
 *    - Already works with Supabase Auth
 *    - Configure email templates in Supabase Dashboard > Auth > Email Templates
 * 
 * 2. PHONE VERIFICATION (Free option - WhatsApp Manual)
 *    - When user submits phone, you receive notification
 *    - Send WhatsApp message asking them to confirm
 *    - Manually mark as verified in admin panel
 * 
 * 3. DOCUMENT VERIFICATION
 *    - User uploads document to Supabase Storage (private bucket)
 *    - You review in admin panel and approve/reject
 *    - Compare name on document with profile name
 * 
 * 4. CPF VALIDATION
 *    - Automatic via ReceitaWS API
 *    - Limited free requests, may need to implement caching
 * 
 * 5. GOV.BR (Future - requires bureaucratic registration)
 *    - Register at: https://manual-integracao-login-unico.servicos.gov.br/
 *    - Takes weeks/months to get approved
 *    - Once approved, provides OAuth integration
 */

export const ADMIN_CHECKLIST = {
  email: 'Já configurado - verificar templates no Supabase',
  phone: 'Configurar WhatsApp Business para verificação manual',
  documents: 'Criar bucket privado no Supabase Storage para documentos',
  cpf: 'API ReceitaWS já integrada - limite de ~3 req/min gratuito',
  govbr: 'Cadastrar em https://manual-integracao-login-unico.servicos.gov.br/'
};
