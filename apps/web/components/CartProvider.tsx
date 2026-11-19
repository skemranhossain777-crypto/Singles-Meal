
"use client";
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CartLine, Meal } from "@shared/index";
type CartContextType = { lines: CartLine[]; add: (meal: Meal) => void; remove: (id: string) => void; clear: () => void; total: number };
const Context = createContext<CartContextType | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const value = useMemo(() => ({
    lines,
    add: (meal: Meal) => setLines(old => {
      const found = old.find(x => x.meal.id === meal.id);
      return found ? old.map(x => x.meal.id === meal.id ? {...x, quantity: x.quantity + 1} : x) : [...old, {meal, quantity: 1}];
    }),
    remove: (id: string) => setLines(old => old.filter(x => x.meal.id !== id)),
    clear: () => setLines([]),
    total: lines.reduce((sum, x) => sum + x.meal.price_bdt * x.quantity, 0)
  }), [lines]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useCart() { const value = useContext(Context); if (!value) throw new Error("CartProvider missing"); return value; }
