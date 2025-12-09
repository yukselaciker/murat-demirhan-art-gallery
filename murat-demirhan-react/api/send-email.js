import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Send email via Resend
        const data = await resend.emails.send({
            from: 'Portfolyo İletişim <onboarding@resend.dev>', // Resend verified domain
            to: [process.env.CONTACT_EMAIL || 'info@muratdemirhan.com'],
            subject: subject || 'Yeni İletişim Formu Mesajı',
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #8B4557 0%, #6B3444 100%);
                color: white;
                padding: 30px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-family: 'Playfair Display', Georgia, serif;
                font-size: 28px;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .field {
                margin-bottom: 20px;
                background: white;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #8B4557;
              }
              .label {
                font-weight: 600;
                color: #8B4557;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 5px;
              }
              .value {
                color: #333;
                font-size: 16px;
              }
              .message-box {
                background: white;
                padding: 20px;
                border-radius: 6px;
                border-left: 4px solid #8B4557;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #999;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📧 Yeni İletişim Formu Mesajı</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Gönderen</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">E-posta</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${subject ? `
              <div class="field">
                <div class="label">Konu</div>
                <div class="value">${subject}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">Mesaj</div>
                <div class="message-box">${message}</div>
              </div>
              
              <div class="footer">
                <p>Bu mesaj muratdemirhan.com iletişim formundan gönderildi</p>
                <p>${new Date().toLocaleString('tr-TR')}</p>
              </div>
            </div>
          </body>
        </html>
      `,
            // Plain text fallback
            text: `
Yeni İletişim Formu Mesajı

Gönderen: ${name}
E-posta: ${email}
${subject ? `Konu: ${subject}` : ''}

Mesaj:
${message}

---
${new Date().toLocaleString('tr-TR')}
      `
        });

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            id: data.id
        });

    } catch (error) {
        console.error('Email error:', error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
}
