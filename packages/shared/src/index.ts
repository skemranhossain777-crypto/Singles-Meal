
export type Locale = "en" | "bn";
export type UserRole = "customer" | "admin" | "kitchen" | "rider";
export type OrderStatus =
  | "pending_payment" | "confirmed" | "preparing"
  | "ready_for_pickup" | "out_for_delivery" | "delivered"
  | "cancelled" | "refunded";

export type Meal = {
  id: string;
  name: string;
  name_bn?: string;
  description: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Dessert";
  price_bdt: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  image_url: string;
  tags: string[];
  allergens: string[];
  available: boolean;
};

export type CartLine = { meal: Meal; quantity: number };

export function nutritionTotals(lines: CartLine[]) {
  return lines.reduce((total, line) => ({
    calories: total.calories + line.meal.calories * line.quantity,
    protein_g: total.protein_g + line.meal.protein_g * line.quantity,
    carbs_g: total.carbs_g + line.meal.carbs_g * line.quantity,
    fat_g: total.fat_g + line.meal.fat_g * line.quantity,
  }), { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
}

export function formatBDT(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency", currency: "BDT", maximumFractionDigits: 0
  }).format(amount);
}
