import WeddingForm from "@/components/WeddingForm";
import ClientTracker from "@/components/ClientTracker";

export const metadata = {
  title: "Wedding Invitation Form",
  description: "Fill in your wedding details to create your personalised invitation site",
};

interface Props {
  searchParams: Promise<{ po?: string; template?: string }>;
}

export default async function FormPage({ searchParams }: Props) {
  const { po, template } = await searchParams;
  return (
    <>
      <ClientTracker eventName="form_viewed" properties={{ payment_order_id: po, template_id: template }} />
      <WeddingForm paymentOrderId={po} templateId={template} />
    </>
  );
}
