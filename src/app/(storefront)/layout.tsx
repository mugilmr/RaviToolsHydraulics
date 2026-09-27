import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { StickyContactBar } from "@/components/StickyContactBar";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyContactBar />
    </CartProvider>
  );
}
