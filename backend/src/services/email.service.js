const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

function getEmailCredentials() {
  return {
    googleClientId: (process.env.GOOGLE_CLIENT_ID || '').trim(),
    googleClientSecret: (process.env.GOOGLE_CLIENT_SECRET || '').trim(),
    googleRefreshToken: (process.env.GOOGLE_REFRESH_TOKEN || '').trim(),
    googleUser: (process.env.GOOGLE_USER || process.env.EMAIL_USER || '').trim(),
    smtpHost: (process.env.SMTP_HOST || 'smtp.gmail.com').trim(),
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpUser: (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim(),
    smtpPass: (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').trim()
  };
}

async function createTransporter() {
  const creds = getEmailCredentials();

  // Mode 1: Google OAuth2 Transporter
  if (creds.googleClientId && creds.googleClientSecret && creds.googleRefreshToken && creds.googleUser) {
    try {
      const oauth2Client = new OAuth2(
        creds.googleClientId,
        creds.googleClientSecret,
        'https://developers.google.com/oauthplayground'
      );

      oauth2Client.setCredentials({
        refresh_token: creds.googleRefreshToken
      });

      const accessTokenResponse = await oauth2Client.getAccessToken();
      const accessToken = accessTokenResponse?.token || accessTokenResponse;

      if (!accessToken) {
        throw new Error('Could not generate OAuth2 access token');
      }

      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: creds.googleUser,
          clientId: creds.googleClientId,
          clientSecret: creds.googleClientSecret,
          refreshToken: creds.googleRefreshToken,
          accessToken: typeof accessToken === 'string' ? accessToken : accessToken?.token
        }
      });
    } catch (oauthErr) {
      console.warn('[EMAIL SERVICE] Google OAuth2 setup failed:', oauthErr.message);
      // Fall through to try standard SMTP if configured
    }
  }

  // Mode 2: Standard SMTP / Gmail App Password
  if (creds.smtpUser && creds.smtpPass) {
    return nodemailer.createTransport({
      host: creds.smtpHost,
      port: creds.smtpPort,
      secure: creds.smtpPort === 465,
      auth: {
        user: creds.smtpUser,
        pass: creds.smtpPass
      }
    });
  }

  return null;
}

async function sendEmail({ to, subject, html }) {
  const creds = getEmailCredentials();
  const fromUser = creds.googleUser || creds.smtpUser || 'noreply@bseva.bihar.gov.in';

  try {
    const transporter = await createTransporter();

    if (!transporter) {
      // In development / test or when no email service is configured:
      console.warn(`\n[EMAIL SERVICE - DEV MODE] Email transport not configured. Displaying email content:\nTo: ${to}\nSubject: ${subject}\n`);
      return { messageId: 'dev-mock-id-' + Date.now(), accepted: [to] };
    }

    const mailOptions = {
      from: `"Bihar Sahayak (BSeva)" <${fromUser}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] OTP email sent successfully to ${to} (MessageId: ${info.messageId})`);
    return info;
  } catch (err) {
    console.error(`[EMAIL SERVICE ERROR] Failed to send email to ${to}:`, err.message);
    throw new Error(`Email delivery failed: ${err.message}`);
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpEmailHtml(otp) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: linear-gradient(135deg, #ea580c, #c2410c); color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 8px;">ब</div>
        <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 800;">बिहार सहायक (BSeva)</h2>
        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Bihar Government Scheme & Career Intelligence</p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 16px;">
        <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 8px 0;">नागरिक खाता सत्यापन / Email Verification</h3>
        <p style="color: #475569; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0;">
          बिहार सहायक पर अपना खाता पंजीकृत करने के लिए नीचे दिए गए 6-अंकों के ओटीपी (OTP) का उपयोग करें:
        </p>

        <div style="background: #f8fafc; border: 2px dashed #ea580c; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
          <span style="font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #ea580c; font-family: monospace;">${otp}</span>
        </div>

        <p style="color: #64748b; font-size: 12px; margin: 0 0 12px 0;">
          ⏱️ यह ओटीपी केवल <strong>5 मिनट</strong> के लिए वैध है। इसे किसी के साथ साझा न करें।
        </p>
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          यदि आपने यह अनुरोध नहीं किया है, तो कृपया इस ईमेल को अनदेखा करें।
        </p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; margin-top: 20px; padding-top: 12px; text-align: center; color: #94a3b8; font-size: 10px;">
        © 2026 Bihar Sahayak (BSeva) • Government of Bihar Intelligence Layer
      </div>
    </div>
  `;
}

module.exports = { sendEmail, generateOTP, getOtpEmailHtml };
