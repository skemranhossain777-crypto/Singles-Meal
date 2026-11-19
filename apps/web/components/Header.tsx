
"use client";
import Link from "next/link";
import { useState } from "react";
import { copy } from "@/lib/i18n";
export function Header() {
  const [locale, setLocale] = useState<"en"|"bn">("en");
  const t = copy[locale];
  return <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F7FAF6]/90 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-xl text-white">S</span>
        <span className="text-xl font-extrabold tracking-tight">Singles <span className="text-forest">Meal</span></span>
      </Link>
      <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
        <Link href="/meals">{t.navMeals}</Link><Link href="/plans">{t.navPlans}</Link>
        <Link href="/health">{t.navHealth}</Link><Link href="/admin">Admin</Link>
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={() => setLocale(locale === "en" ? "bn" : "en")} className="rounded-full border px-3 py-2 text-xs font-bold">{locale === "en" ? "বাংলা" : "English"}</button>
        <Link href="/signin" className="rounded-full bg-forest px-4 py-2.5 text-sm font-bold text-white">{t.signIn}</Link>
      </div>
    </div>
  </header>;
}
