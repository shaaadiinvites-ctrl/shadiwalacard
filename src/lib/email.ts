import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // User needs to set this in .env
  },
});

export async function sendSetupLinkEmail(to: string, setupUrl: string) {
  // If no password is provided in .env, don't try to send (it will crash)
  if (!process.env.EMAIL_PASS) {
    console.warn("EMAIL_PASS not found in .env, skipping email send.");
    return false;
  }

  const mailOptions = {
    from: `"ShadiwalaCard" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your ShadiwalaCard Website Setup Link \uD83D\uDC9D",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', Arial, sans-serif;
            background-color: #F2F4F8;
            margin: 0;
            padding: 0;
            color: #1A202C;
            -webkit-text-size-adjust: 100%;
          }
          .wrapper {
            background-color: #F2F4F8;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(46, 16, 101, 0.05);
          }
          @media only screen and (max-width: 600px) {
            .wrapper { padding: 15px 10px; }
            .container { border-radius: 16px; }
            .header { padding: 30px 15px !important; }
            .content { padding: 30px 20px !important; }
            .header h1 { font-size: 28px !important; }
            .content h2 { font-size: 22px !important; }
            .content p { font-size: 14px !important; }
          }
          .header {
            background-color: #2e1065;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-family: 'Playfair Display', serif;
            font-size: 36px;
            margin: 0;
            font-weight: 700;
            letter-spacing: 1px;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .content h2 {
            font-family: 'Playfair Display', serif;
            color: #9d174d;
            font-size: 26px;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .content p {
            font-size: 15px;
            line-height: 1.6;
            color: #4A5568;
            margin-bottom: 24px;
          }
          .btn {
            display: inline-block;
            background-color: #2e1065;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.3s;
          }
          .btn:hover {
            background-color: #9d174d;
          }
          .footer {
            background-color: #faf5ff;
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #718096;
            border-top: 1px solid #e9d5ff;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>ShadiwalaCard</h1>
            </div>
            <div class="content">
              <h2>Payment Successful! \uD83C\uDF89</h2>
              <p>Thank you for choosing ShadiwalaCard. We are so excited to help you create your beautiful digital wedding invitation!</p>
              <p>You can start customizing your website right away, or come back to it later at any time using your secure link below.</p>
              
              <div style="margin: 32px 0;">
                <a href="${setupUrl}" class="btn">Get Started Now</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 13px; color: #A0AEC0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${setupUrl}" style="color: #9d174d; word-break: break-all;">${setupUrl}</a>
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} ShadiwalaCard. All rights reserved.<br>
              If you need any help, simply reply to this email.
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Setup email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending setup email: ", error);
    return false;
  }
}
