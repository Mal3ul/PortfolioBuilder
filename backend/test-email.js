import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const {
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE = false
} = process.env;

console.log('🧪 Test de connexion SMTP...');
console.log(`Host: ${SMTP_HOST}`);
console.log(`Port: ${SMTP_PORT}`);
console.log(`User: ${SMTP_USER}`);
console.log(`Secure: ${SMTP_SECURE}`);
console.log('---');

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error('❌ Erreur : SMTP_HOST, SMTP_USER ou SMTP_PASS manquant dans .env');
  process.exit(1);
}

// Créer un transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: SMTP_SECURE === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

// Tester la connexion
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur de connexion SMTP:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Connexion SMTP réussie!');
    sendTestEmail();
  }
});

// Envoyer un email de test
const sendTestEmail = async () => {
  const mailOptions = {
    from: `"Portfolio Builder Test" <${SMTP_USER}>`,
    to: SMTP_USER, // Envoyer à vous-même pour test
    subject: 'Test d\'envoi d\'email - Portfolio Builder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0077ff;">✅ Email de Test</h2>
        <p>Si vous voyez cet email, votre configuration SMTP est fonctionnelle!</p>
        <p><strong>Date d'envoi:</strong> ${new Date().toLocaleString()}</p>
        <p style="color: #666; margin-top: 30px;">
          Vous pouvez maintenant utiliser Portfolio Builder pour envoyer des emails de réinitialisation de mot de passe.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de test envoyé avec succès!');
    console.log('Message ID:', info.messageId);
    console.log('📧 Vérifiez votre boîte mail:', SMTP_USER);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error.message);
    process.exit(1);
  }
};
