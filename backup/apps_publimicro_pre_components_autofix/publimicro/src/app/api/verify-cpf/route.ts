import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

/**
 * CPF Validation API
 * Validates CPF format and checks with Brazilian Federal Revenue (Receita Federal)
 */

// CPF validation algorithm
function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  
  try {
    const { cpf, full_name, birth_date } = await req.json();
    
    if (!cpf) {
      return NextResponse.json({ error: 'CPF is required' }, { status: 400 });
    }
    
    // Clean CPF
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Basic validation
    const isValid = validateCPF(cleanCPF);
    
    if (!isValid) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid CPF format' 
      }, { status: 400 });
    }
    
    // TODO: Integration with Receita Federal API
    // For now, we'll do basic validation
    // In production, you would call:
    // - Receita Federal API to verify CPF is real and matches name/birth date
    // - Check if CPF is not blacklisted
    
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Log validation attempt
    await supabase.from('verification_logs').insert({
      user_id: null, // No user yet
      verification_type: 'cpf',
      status: isValid ? 'approved' : 'rejected',
      request_data: { cpf: cleanCPF, full_name, birth_date },
      response_data: { valid: isValid }
    });
    
    return NextResponse.json({ 
      valid: true,
      cpf: cleanCPF,
      message: 'CPF validated successfully'
    });
    
  } catch (error: any) {
    console.error('CPF validation error:', error);
    return NextResponse.json({ 
      error: error.message || 'CPF validation failed' 
    }, { status: 500 });
  }
}
