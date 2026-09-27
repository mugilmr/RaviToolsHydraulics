import { PhoneIcon, WhatsAppIcon } from "./icons";
import { siteConfig } from "@/lib/siteConfig";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function StickyContactBar() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 pb-[env(safe-area-inset-bottom,0px)]">
      <a
        href={buildWhatsAppLink(`Hi, I have a question about a product at ${siteConfig.shortName}.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
        style={{ height: "3.25rem", width: "3.25rem" }}
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>
      <a
        href={`tel:${siteConfig.phone}`}
        aria-label="Call the shop"
        className="flex items-center justify-center rounded-full bg-safety-500 text-white shadow-lg transition-transform hover:scale-105"
        style={{ height: "3.25rem", width: "3.25rem" }}
      >
        <PhoneIcon className="h-6 w-6" />
      </a>
    </div>
  );
}
