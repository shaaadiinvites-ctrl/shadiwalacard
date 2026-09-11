import https from "https";
import dns from "dns";

/**
 * Custom DNS resolver that bypasses blackholed or unresponsive edge IPs
 * by falling back to Google (8.8.8.8) and Cloudflare (1.1.1.1) public DNS.
 */
function customDnsLookup(
  hostname: string,
  options: any,
  callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void
) {
  dns.lookup(hostname, { family: 4 }, (err, address, family) => {
    // If the OS returned an unresponsive IP or failed, resolve directly via reliable public DNS
    if (!err && address && address !== "163.70.145.20") {
      return callback(null, address, family || 4);
    }
    const resolver = new dns.Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1"]);
    resolver.resolve4(hostname, (resErr, addresses) => {
      if (!resErr && addresses && addresses.length > 0) {
        return callback(null, addresses[0], 4);
      }
      callback(err || resErr, address || "57.144.48.141", family || 4);
    });
  });
}

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
      family: 4, // Enforces IPv4
      lookup: customDnsLookup,
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
    // Primary: Luxury celebratory message (APPROVED by Meta)
    // Fallback: Pure utility order ready message (APPROVED by Meta)
    const templateCandidates = [
      { name: "shadiwalacard_order_confirmed_v1", lang: "en" },
      { name: "shadiwalacard_order_ready_v1", lang: "en_US" },
    ];

    let res: any = null;
    let templateSent = false;

    for (const cand of templateCandidates) {
      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "template",
        template: {
          name: cand.name,
          language: { code: cand.lang },
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

      res = await postJsonIPv4(
        `https://graph.facebook.com/v20.0/${phoneId}/messages`,
        {
          Authorization: `Bearer ${token}`,
        },
        payload,
        8000
      );

      if (res.ok) {
        templateSent = true;
        break;
      }

      // If template not found or pending approval (code 132001), try next candidate
      if (res.data?.error?.code === 132001) {
        continue;
      } else {
        // Break early on other non-template errors (e.g. invalid phone number)
        break;
      }
    }

    // If neither custom template is approved yet, only test sandboxes can use hello_world
    const isTestSandboxNumber = phoneId === "1078713025316047";
    if (!templateSent && res && res.data?.error?.code === 132001) {
      if (isTestSandboxNumber) {
        console.warn("⚠️ Custom templates pending Meta approval. Using 'hello_world' on test sandbox number.");
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
      } else {
        console.warn(
          "⏳ WhatsApp templates ('shadiwalacard_order_ready_v1' & 'shadiwalacard_order_confirmed_v1') are currently under Meta review (PENDING). Meta restricts sending unapproved templates from real registered numbers."
        );
      }
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

