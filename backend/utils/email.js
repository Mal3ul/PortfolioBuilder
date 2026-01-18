import nodemailer from 'nodemailer';

// En développement, on simule l'envoi d'email
const isDevelopment = process.env.NODE_ENV !== 'production';

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
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: '"Portfolio Builder" <noreply@portfoliobuilder.com>',
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
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
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    if (isDevelopment) {
      console.log('📧 [DEV] Email simulé - Token de réinitialisation:', resetToken);
      console.log('🔗 [DEV] URL de réinitialisation:', resetUrl);
      console.log('📨 [DEV] Email destination:', email);
    } else {
      console.log('📧 Email envoyé:', info.messageId);
    }
    
    return { success: true, messageId: info.messageId, resetUrl: isDevelopment ? resetUrl : undefined };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
};
