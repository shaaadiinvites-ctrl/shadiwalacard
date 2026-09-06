import Link from "next/link";
import { redirect } from "next/navigation";
import WeddingForm from "@/components/WeddingForm";
import ClientTracker from "@/components/ClientTracker";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { isWeddingOwnerMatch, verifySetupLink } from "@/lib/linkSecurity";

export const metadata = {
  title: "Wedding Invitation Form | ShadiwalaCard",
  description: "Fill in your wedding details to create your personalised invitation site",
};

interface Props {
  searchParams: Promise<{
    po?: string;
    template?: string;
    e?: string;
    p?: string;
    sig?: string;
  }>;
}

export default async function FormPage({ searchParams }: Props) {
  const { po, template, e, p, sig } = await searchParams;

  // ── 1. Cryptographic Signature Tamper Check ───────────────────────────────
  // If a signature parameter is present, verify that none of the link parameters
  // (po, template, email, phone) were tampered with in the address bar.
  if (sig && po) {
    let isSigValid = verifySetupLink({
      po,
      template,
      email: e,
      phone: p,
      sig,
    });

    // Handle phone-first links where signature was created with email=""
    if (!isSigValid && e) {
      isSigValid = verifySetupLink({
        po,
        template,
        email: "",
        phone: p,
        sig,
      });
    }

    if (!isSigValid) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050505',
          padding: '24px 16px',
          fontFamily: "var(--font-body), sans-serif",
          color: '#FFFFFF'
        }}>
          <div style={{
            width: '100%',
            maxWidth: 460,
            background: 'linear-gradient(135deg, rgba(24, 18, 20, 0.95) 0%, rgba(12, 8, 10, 0.95) 100%)',
            border: '1px solid rgba(225, 29, 72, 0.3)',
            borderRadius: 24,
            padding: '40px 28px',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0,0,0,0.85), 0 0 40px rgba(225, 29, 72, 0.12)'
          }}>
            {/* Icon Emblem */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(225, 29, 72, 0.12)',
                border: '1px solid rgba(225, 29, 72, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(225, 29, 72, 0.15)'
              }}>
                <svg style={{ width: 28, height: 28, color: '#e11d48' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Status Pill */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 999, background: 'rgba(225, 29, 72, 0.12)', border: '1px solid rgba(225, 29, 72, 0.3)', color: '#fb7185', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e11d48', boxShadow: '0 0 8px #e11d48' }} />
                LINK INTEGRITY ERROR
              </div>
            </div>

            <h1 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 1.85rem)', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.15, color: '#FFFFFF' }}>
              Security Verification Failed
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: '0 0 28px' }}>
              The email, phone number, or order parameters in this link have been altered or corrupted. For your protection, access has been restricted.
            </p>

            <Link
              href="/"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', height: 48, borderRadius: 14,
                background: '#FFFFFF', color: '#050505',
                fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
                transition: 'all 0.25s ease'
              }}
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      );
    }
  }

  // ── 2. Order & Wedding Ownership Verification ─────────────────────────────
  if (po) {
    const supabase = createServerSupabaseClient();

    const { data: poRow } = await supabase
      .from("payment_orders")
      .select("id, status, wedding_id")
      .eq("id", po)
      .maybeSingle();

    if (poRow?.wedding_id) {
      // Fetch the wedding record including owner contact information
      const { data: wedding } = await supabase
        .from("weddings")
        .select("id, edit_token, primary_email, contact_number")
        .eq("id", poRow.wedding_id)
        .maybeSingle();

      // STRICT OWNERSHIP CHECK:
      // If the wedding was already created, verify that the visitor's email and phone
      // strictly match the wedding owner. If mismatched or missing, NEVER reveal the edit token!
      const isOwner = isWeddingOwnerMatch(wedding, e, p);

      if (!isOwner) {
        return (
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            padding: '24px 16px',
            fontFamily: "var(--font-body), sans-serif",
            color: '#FFFFFF'
          }}>
            <div style={{
              width: '100%',
              maxWidth: 480,
              background: 'linear-gradient(135deg, rgba(22, 18, 20, 0.95) 0%, rgba(10, 8, 10, 0.95) 100%)',
              border: '1px solid rgba(225, 29, 72, 0.3)',
              borderRadius: 24,
              padding: '40px 28px',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(0,0,0,0.85), 0 0 40px rgba(225, 29, 72, 0.12)'
            }}>
              {/* Icon Emblem */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(225, 29, 72, 0.12)',
                  border: '1px solid rgba(225, 29, 72, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(225, 29, 72, 0.15)'
                }}>
                  <svg style={{ width: 28, height: 28, color: '#e11d48' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* Status Pill */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 999, background: 'rgba(225, 29, 72, 0.12)', border: '1px solid rgba(225, 29, 72, 0.3)', color: '#fb7185', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e11d48', boxShadow: '0 0 8px #e11d48' }} />
                  ACCESS RESTRICTED
                </div>
              </div>

              <h1 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 1.85rem)', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.15, color: '#FFFFFF' }}>
                Access Denied • Security Check
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: '0 0 28px' }}>
                The email or mobile number in this link does not match the registered owner of this invitation. Direct access to edit this invitation has been blocked.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: 48, borderRadius: 14,
                    background: '#FFFFFF', color: '#050505',
                    fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
                    transition: 'all 0.25s ease'
                  }}
                >
                  Return to Homepage
                </Link>
                <Link
                  href="/contact-us"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: 44, borderRadius: 14,
                    background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.813rem', fontWeight: 600, textDecoration: 'none',
                    transition: 'all 0.25s ease'
                  }}
                >
                  Need Help? Contact Support
                </Link>
              </div>
            </div>
          </div>
        );
      }

      // If the visitor's email/phone matched the wedding owner, safely redirect to the edit token
      if (wedding?.edit_token) {
        if (e && !wedding.primary_email) {
          try {
            await supabase
              .from("weddings")
              .update({ primary_email: e.trim().toLowerCase(), updated_at: new Date().toISOString() })
              .eq("id", wedding.id);
          } catch (err) {
            console.error("Could not backfill primary_email:", err);
          }
        }
        redirect(`/edit/${wedding.edit_token}`);
      }
    }
  }

  const initialData = {
    primaryEmail: e || "",
    contactNumber: p || "",
  };

  return (
    <>
      <ClientTracker eventName="form_viewed" properties={{ payment_order_id: po, template_id: template }} />
      <WeddingForm paymentOrderId={po} templateId={template} initialData={initialData} sig={sig} />
    </>
  );
}
