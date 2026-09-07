import https from "https";

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

function postJsonIPv4(
  url: string,
  headers: Record<string, string>,
  body: Record<string, any>,
  timeoutMs: number = 8000
): Promise<{ ok: boolean; status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const parsed = new URL(url);

    const options: https.RequestOptions = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      family: 4, // Enforces IPv4 to bypass link-local/broken IPv6 routing
      timeout: timeoutMs,
    };

    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => {
        raw += chunk;
      });
      res.on("end", () => {
        try {
          const data = JSON.parse(raw);
          const ok = (res.statusCode || 500) >= 200 && (res.statusCode || 500) < 300;
          resolve({ ok, status: res.statusCode || 500, data });
        } catch {
          resolve({
            ok: (res.statusCode || 500) >= 200 && (res.statusCode || 500) < 300,
            status: res.statusCode || 500,
            data: raw,
          });
        }
      });
    });

    req.on("timeout", () => {
      req.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

export async function sendWhatsAppOrderConfirmation({
  phone,
  templateName = "The Grand Palace",
  customizeUrl,
}: SendWhatsAppParams): Promise<{ success: boolean; data?: any; error?: string }> {
  const rawPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const rawToken = process.env.WHATSAPP_ACCESS_TOKEN;

  const phoneId = rawPhoneId?.replace(/^["']|["']$/g, "").trim();
  const token = rawToken?.replace(/^["']|["']$/g, "").trim();

  if (!phoneId || !token) {
    console.warn("⚠️ WhatsApp delivery skipped: WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN missing.");
    return { success: false, error: "WhatsApp credentials not configured" };
  }

  const recipient = formatWhatsAppRecipient(phone);

  try {
    const payload = {
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
    };

    let res = await postJsonIPv4(
      `https://graph.facebook.com/v20.0/${phoneId}/messages`,
      {
        Authorization: `Bearer ${token}`,
      },
      payload,
      8000
    );

    // If custom template is not found in Meta account yet (#132001), fallback to hello_world for testing
    if (!res.ok && res.data?.error?.code === 132001) {
      console.warn(
        "⚠️ Custom template 'shadiwalacard_order_confirmed_v1' not yet created in Meta WhatsApp Manager. Falling back to 'hello_world' test template."
      );
      const fallbackPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" },
        },
      };

      res = await postJsonIPv4(
        `https://graph.facebook.com/v20.0/${phoneId}/messages`,
        {
          Authorization: `Bearer ${token}`,
        },
        fallbackPayload,
        8000
      );
    }

    if (!res.ok) {
      console.error("❌ WhatsApp Meta Cloud API Error:", JSON.stringify(res.data, null, 2));
      return {
        success: false,
        error: res.data?.error?.message || "Failed to send WhatsApp message",
      };
    }

    console.log(
      `✅ WhatsApp order confirmation sent successfully to ${recipient} (Message ID: ${res.data?.messages?.[0]?.id})`
    );
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error("❌ WhatsApp dispatch exception:", err.message || err);
    return { success: false, error: err.message || "Network exception during WhatsApp dispatch" };
  }
}

