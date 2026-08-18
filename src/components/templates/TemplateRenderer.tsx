import { WeddingRecord } from "@/types/wedding";
import WeddingInvitePage from "@/components/WeddingInvitePage"; // "royal-heritage"
import ModernMinimalTemplate from "@/components/templates/ModernMinimalTemplate";
import FloralRomanceTemplate from "@/components/templates/FloralRomanceTemplate";
import GrandPalaceTemplate from "@/components/templates/project3/GrandPalaceTemplate";

export default function TemplateRenderer({ wedding }: { wedding: WeddingRecord }) {
  switch (wedding.template_id) {
    case "modern-minimal":
      return <ModernMinimalTemplate wedding={wedding} />;
    case "floral-romance":
      return <FloralRomanceTemplate wedding={wedding} />;
    case "grand-palace":
      return <GrandPalaceTemplate wedding={wedding} />;
    case "royal-heritage":
    default:
      return <WeddingInvitePage wedding={wedding} />;
  }
}
