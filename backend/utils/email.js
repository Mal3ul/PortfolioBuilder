import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env'), quiet: true });

// En développement, on simule l'envoi d'email
const isDevelopment = (process.env.NODE_ENV || '').trim().toLowerCase() !== 'production';

// Configuration du transporteur email
let transporter;

if (isDevelopment) {
  // Mode développement : pas d'envoi réel d'email
  transporter = nodemailer.createTransport({
    jsonTransport: true
  });
} else {
  // Production : utilisez un vrai service SMTP (Gmail, SendGrid, etc.)
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    logger: true,
    debug: true,
    tls: {
      rejectUnauthorized: false
    }
  });
}

export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  
  const subject = 'Réinitialisation de votre mot de passe';
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0077ff;">Réinitialisation de mot de passe</h2>
        <p>Bonjour ${userName},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
        <p style="margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #0077ff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          Ce lien est valable pendant 1 heure.<br>
          Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          Portfolio Builder - Plateforme de création de portfolios professionnels
        </p>
      </div>
    `;

  try {
    // Préférence: utiliser API Brevo via HTTPS si disponible (évite blocages SMTP)
    if (process.env.BREVO_API_KEY) {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || 'noreply@portfoliobuilder.com';
      const senderName = 'Portfolio Builder';
      const fetchFn = globalThis.fetch ? globalThis.fetch : (await import('node-fetch')).default;
      const res = await fetchFn('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { email: senderEmail, name: senderName },
          to: [{ email, name: userName || email }],
          subject,
          htmlContent: html,
          replyTo: { email: senderEmail, name: senderName }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[ERROR] Brevo API error:', res.status, errText);
        return { success: false, error: `brevo_api_${res.status}` };
      }

      const data = await res.json();
      console.log('[BREVO] Email envoyé:', data.messageId || data);
      return { success: true, messageId: data.messageId || 'brevo' };
    }

    // Fallback: SMTP via Nodemailer
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER || '"Portfolio Builder" <noreply@portfoliobuilder.com>',
      to: email,
      subject,
      html
    });
    
    if (isDevelopment) {
      console.log('[DEV] Email simulé - Token de réinitialisation:', resetToken);
      console.log('🔗 [DEV] URL de réinitialisation:', resetUrl);
      console.log('📨 [DEV] Email destination:', email);
    } else {
      console.log('[EMAIL] Email envoyé:', info.messageId);
    }
    
    return { success: true, messageId: info.messageId, resetUrl: isDevelopment ? resetUrl : undefined };
  } catch (error) {
    console.error('[ERROR] Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
};
