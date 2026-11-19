
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { CartProvider } from "@/components/CartProvider";
export const metadata: Metadata = {
  title: "Singles Meal | Eat Better. Track Smarter.",
  description: "Personalized healthy meals and catering delivered to your door."
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body><CartProvider><Header/>{children}<footer className="mt-20 bg-ink px-5 py-12 text-white">
    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
      <div><div className="text-2xl font-extrabold">Singles Meal</div><p className="mt-2 text-sm text-white/60">Eat Better. Track Smarter. Live Healthier.</p></div>
      <div className="text-sm text-white/60">© {new Date().getFullYear()} Singles Meal. Built for better everyday eating.</div>
    </div></footer></CartProvider></body></html>;
}
