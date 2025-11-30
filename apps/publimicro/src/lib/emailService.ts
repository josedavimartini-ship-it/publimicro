/**
 * Email service for PubliMicro
 * Uses Resend API for transactional emails
 * 
 * Setup: Set RESEND_API_KEY in .env.local
 * Get key from: https://resend.com/api-keys
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DEFAULT_FROM = process.env.EMAIL_FROM || 'PubliMicro <noreply@publimicro.com.br>';

/**
 * Send email via Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured - email not sent');
    return {
      success: false,
      error: 'Email service not configured'
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: options.from || DEFAULT_FROM,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email send failed:', error);
      return {
        success: false,
        error: `Failed to send email: ${response.status}`
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Email template for visit request confirmation
 */
export function getVisitRequestEmail(data: {
  userName: string;
  propertyTitle: string;
  propertyUrl: string;
  visitDate: string;
  visitTime: string;
  ownerEmail: string;
}): EmailOptions {
  return {
    to: data.ownerEmail,
    subject: `Nova Solicitação de Visita - ${data.propertyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #2C3E50; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6B7F5C 0%, #2C5F6F 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #B8904D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nova Solicitação de Visita</h1>
            </div>
            <div class="content">
              <p>Olá,</p>
              <p><strong>${data.userName}</strong> solicitou uma visita ao seu imóvel:</p>
              <h2>${data.propertyTitle}</h2>
              <p><strong>Data:</strong> ${data.visitDate}<br>
              <strong>Horário:</strong> ${data.visitTime}</p>
              <a href="${data.propertyUrl}" class="button">Ver Solicitação no Painel</a>
              <p>Acesse o painel de administração para aceitar ou recusar esta solicitação.</p>
            </div>
            <div class="footer">
              PubliMicro - Classificados do Brasil<br>
              Este é um e-mail automático, não responda.
            </div>
          </div>
        </body>
      </html>
    `
  };
}

/**
 * Email template for proposal/bid notification
 */
export function getProposalEmail(data: {
  userName: string;
  propertyTitle: string;
  propertyUrl: string;
  proposalAmount: string;
  ownerEmail: string;
}): EmailOptions {
  return {
    to: data.ownerEmail,
    subject: `Nova Proposta Recebida - ${data.propertyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #2C3E50; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6B7F5C 0%, #2C5F6F 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight { background: #B8904D; color: white; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background: #B8904D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nova Proposta Recebida!</h1>
            </div>
            <div class="content">
              <p>Olá,</p>
              <p><strong>${data.userName}</strong> fez uma proposta para seu imóvel:</p>
              <h2>${data.propertyTitle}</h2>
              <div class="highlight">
                <h2 style="margin: 0;">R$ ${data.proposalAmount}</h2>
              </div>
              <a href="${data.propertyUrl}" class="button">Ver Proposta no Painel</a>
              <p>Acesse o painel de administração para responder esta proposta.</p>
            </div>
            <div class="footer">
              PubliMicro - Classificados do Brasil<br>
              Este é um e-mail automático, não responda.
            </div>
          </div>
        </body>
      </html>
    `
  };
}

/**
 * Email template for welcome/verification
 */
export function getWelcomeEmail(data: {
  userName: string;
  userEmail: string;
  verificationUrl?: string;
}): EmailOptions {
  return {
    to: data.userEmail,
    subject: 'Bem-vindo ao PubliMicro!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #2C3E50; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6B7F5C 0%, #2C5F6F 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #B8904D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bem-vindo ao PubliMicro!</h1>
            </div>
            <div class="content">
              <p>Olá ${data.userName},</p>
              <p>Seja muito bem-vindo(a) ao PubliMicro, o maior portal de classificados do Brasil!</p>
              ${data.verificationUrl ? `
                <p>Para começar a usar sua conta, por favor confirme seu e-mail:</p>
                <a href="${data.verificationUrl}" class="button">Confirmar E-mail</a>
              ` : ''}
              <p>Com o PubliMicro você pode:</p>
              <ul>
                <li>Anunciar imóveis, veículos, máquinas e muito mais</li>
                <li>Encontrar as melhores oportunidades em todo o Brasil</li>
                <li>Gerenciar seus anúncios de forma simples</li>
                <li>Receber propostas e agendar visitas</li>
              </ul>
              <p>Estamos felizes em tê-lo(a) conosco!</p>
            </div>
            <div class="footer">
              PubliMicro - Classificados do Brasil<br>
              Este é um e-mail automático, não responda.
            </div>
          </div>
        </body>
      </html>
    `
  };
}
