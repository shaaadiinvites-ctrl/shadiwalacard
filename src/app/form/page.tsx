import WeddingForm from "@/components/WeddingForm";
import ClientTracker from "@/components/ClientTracker";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Wedding Invitation Form",
  description: "Fill in your wedding details to create your personalised invitation site",
};

interface Props {
  searchParams: Promise<{ po?: string; template?: string; e?: string; p?: string }>;
}

export default async function FormPage({ searchParams }: Props) {
  const { po, template, e, p } = await searchParams;

  if (po) {
    const supabase = createServerSupabaseClient();
    
    // First, check if this payment order is already linked to a wedding
    const { data: poRow } = await supabase
      .from("payment_orders")
      .select("wedding_id")
      .eq("id", po)
      .maybeSingle();

    if (poRow?.wedding_id) {
      // Fetch the edit_token for that wedding
      const { data: wedding } = await supabase
        .from("weddings")
        .select("edit_token")
        .eq("id", poRow.wedding_id)
        .maybeSingle();

      if (wedding?.edit_token) {
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
      <WeddingForm paymentOrderId={po} templateId={template} initialData={initialData} />
    </>
  );
}
