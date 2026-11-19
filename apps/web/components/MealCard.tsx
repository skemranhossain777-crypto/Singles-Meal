
"use client";
import type { Meal } from "@shared/index";
import { formatBDT } from "@shared/index";
import { useCart } from "@/components/CartProvider";
export function MealCard({ meal }: { meal: Meal }) {
  const { add } = useCart();
  return <article className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft">
    <div className="relative h-52 overflow-hidden bg-mint">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={meal.image_url} alt={meal.name} className="h-full w-full object-cover transition duration-500 hover:scale-105"/>
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-forest">{meal.category}</span>
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3"><h3 className="font-bold leading-snug">{meal.name}</h3><strong className="whitespace-nowrap text-forest">{formatBDT(meal.price_bdt)}</strong></div>
      <p className="mt-2 min-h-10 text-sm text-slate-500">{meal.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-mint px-2.5 py-1">{meal.calories} kcal</span>
        <span className="rounded-full bg-mint px-2.5 py-1">{meal.protein_g}g protein</span>
        <span className="rounded-full bg-mint px-2.5 py-1">{meal.carbs_g}g carbs</span>
      </div>
      {meal.allergens.length > 0 && <p className="mt-2 text-xs text-amber-700">Contains: {meal.allergens.join(", ")}</p>}
      <button onClick={() => add(meal)} className="mt-5 w-full rounded-full bg-ink px-4 py-3 text-sm font-bold text-white hover:bg-forest">Add to basket</button>
    </div>
  </article>;
}
