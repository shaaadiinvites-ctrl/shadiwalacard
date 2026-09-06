/**
 * WhatsApp Meta Cloud API Delivery Module
 * Automatically dispatches order confirmation and wedding customization links
 * directly to the customer's WhatsApp upon successful payment.
 */

interface SendWhatsAppParams {
  phone: string;
  templateName?: string;
  customizeUrl: string;
  customerName?: string;
}

/**
 * Normalizes any phone string to the E.164-compatible format expected by Meta
 * (Digits only, including country code, no leading +).
 * E.g., "9718545559" -> "919718545559" (defaults to India 91 if 10 digits)
 * "+91 97185 45559" -> "919718545559"
 */
export function formatWhatsAppRecipient(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export async function sendWhatsAppOrderConfirmation({
  phone,
  templateName = "The Grand Palace",
  customizeUrl,
}: SendWhatsAppParams): Promise<{ success: boolean; data?: any; error?: string }> {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !token) {
    console.warn("⚠️ WhatsApp delivery skipped: WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN missing.");
    return { success: false, error: "WhatsApp credentials not configured" };
  }

  const recipient = formatWhatsAppRecipient(phone);

  try {
    // Attempt custom approved template: shadiwalacard_order_confirmed_v1
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "template",
        template: {
          name: "shadiwalacard_order_confirmed_v1",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: templateName },
                { type: "text", text: customizeUrl },
              ],
            },
          ],
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ WhatsApp Meta Cloud API Error:", JSON.stringify(data, null, 2));
      return { success: false, error: data?.error?.message || "Failed to send WhatsApp message" };
    }

    console.log(`✅ WhatsApp order confirmation sent successfully to ${recipient} (Message ID: ${data?.messages?.[0]?.id})`);
    return { success: true, data };
  } catch (err: any) {
    console.error("❌ WhatsApp dispatch exception:", err);
    return { success: false, error: err.message };
  }
}
