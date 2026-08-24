import nodemailer from "nodemailer";

// Sends the "your invite is live" email from shaaadi.invites@gmail.com via
// Gmail SMTP. Requires GMAIL_USER + GMAIL_APP_PASSWORD env vars (see
// SECURITY-AUDIT.md / setup notes for how to generate a Gmail App Password —
// a regular Gmail password will NOT work here, Google blocks it).
//
// Failure to send must never block a paid submission from completing —
// callers should fire-and-log this, not let it throw past them.
function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function sendInviteReadyEmail(opts: {
  to: string;
  coupleNames: string;
  siteUrl: string;
  editUrl: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return { sent: false, reason: "GMAIL_USER / GMAIL_APP_PASSWORD not configured" };
  }

  const { to, coupleNames, siteUrl, editUrl } = opts;

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
    <h2 style="color: #e11d48;">Your wedding invite is live! 🎉</h2>
    <p>Hi ${coupleNames},</p>
    <p>Thank you for your payment — your wedding invitation website has been created and is live now.</p>

    <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
      <tr>
        <td style="padding: 14px; background: #fdf2f8; border-radius: 8px;">
          <strong>Your website link (share this with guests):</strong><br/>
          <a href="${siteUrl}" style="color: #e11d48;">${siteUrl}</a>
        </td>
      </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
      <tr>
        <td style="padding: 14px; background: #fff7ed; border-radius: 8px; border: 1px solid #fed7aa;">
          <strong>Your private edit link (do NOT share this — keep it only for yourselves):</strong><br/>
          <a href="${editUrl}" style="color: #c2410c;">${editUrl}</a>
        </td>
      </tr>
    </table>

    <p><strong>What is the edit link for?</strong><br/>
    It's a private, one-of-a-kind link that lets you go back and update anything on your
    wedding website — change details, swap photos, fix a typo — any time, without paying again.
    Anyone who has this link can edit your website, so please don't post it publicly or share
    it with guests. Only your public website link (above) is meant for guests.</p>

    <p>Save this email somewhere safe — it's the only way to get back to your edit link if you
    lose it.</p>

    <p style="margin-top: 32px; color: #888; font-size: 0.85em;">
      Sent by ShadiwalaCard · shaaadi.invites@gmail.com
    </p>
  </div>`;

  try {
    await transporter.sendMail({
      from: `"ShadiwalaCard" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your wedding invite is live ✨ ${coupleNames}`,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error("sendInviteReadyEmail: failed to send —", err);
    return { sent: false, reason: err instanceof Error ? err.message : "unknown error" };
  }
}
