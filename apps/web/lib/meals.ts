
import type { Meal } from "@shared/index";
import { supabase } from "./supabase";

export const meals: Meal[] = [
  { id: "m1", name: "Grilled Chicken Power Bowl", name_bn: "গ্রিলড চিকেন পাওয়ার বোল",
    description: "Grilled chicken, brown rice, seasonal greens and lemon dressing.",
    category: "Lunch", price_bdt: 390, calories: 480, protein_g: 38, carbs_g: 46, fat_g: 14,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900",
    tags: ["High protein", "Balanced"], allergens: [], available: true },
  { id: "m2", name: "Garden Egg & Avocado Toast", name_bn: "ডিম ও অ্যাভোকাডো টোস্ট",
    description: "Two eggs, wholegrain toast, avocado and fresh herbs.",
    category: "Breakfast", price_bdt: 260, calories: 350, protein_g: 19, carbs_g: 31, fat_g: 16,
    image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900",
    tags: ["Vegetarian option", "Breakfast"], allergens: ["Egg", "Gluten"], available: true },
  { id: "m3", name: "Salmon & Greens Plate", name_bn: "স্যালমন ও গ্রিনস প্লেট",
    description: "Oven-baked salmon with greens, sweet potato and yogurt herb sauce.",
    category: "Dinner", price_bdt: 620, calories: 520, protein_g: 36, carbs_g: 39, fat_g: 22,
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900",
    tags: ["Omega-3", "Balanced"], allergens: ["Fish", "Milk"], available: true },
  { id: "m4", name: "Mango Chia Yogurt Cup", name_bn: "আম ও চিয়া ইয়োগার্ট কাপ",
    description: "Creamy yogurt, chia seeds, fresh mango and toasted nuts.",
    category: "Snack", price_bdt: 180, calories: 210, protein_g: 11, carbs_g: 28, fat_g: 7,
    image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900",
    tags: ["Snack", "Fresh"], allergens: ["Milk", "Tree nuts"], available: true },
  { id: "m5", name: "Lentil & Roasted Veg Bowl", name_bn: "ডাল ও রোস্টেড ভেজ বোল",
    description: "Spiced lentils, roasted seasonal vegetables and fragrant rice.",
    category: "Lunch", price_bdt: 290, calories: 430, protein_g: 20, carbs_g: 64, fat_g: 10,
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900",
    tags: ["Plant-based", "Fiber"], allergens: [], available: true },
  { id: "m6", name: "Banana Oat Pancakes", name_bn: "কলা ওট প্যানকেক",
    description: "Oat pancakes with banana, yogurt and a little date syrup.",
    category: "Breakfast", price_bdt: 240, calories: 330, protein_g: 13, carbs_g: 52, fat_g: 8,
    image_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=900",
    tags: ["Breakfast", "Energy"], allergens: ["Milk", "Gluten"], available: true }
];

export async function getMeals(): Promise<Meal[]> {
  if (!supabase) return meals;
  try {
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("is_available", true);

    if (error || !data || data.length === 0) return meals;

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      name_bn: item.name_bn ?? undefined,
      description: item.description ?? "",
      category: item.category,
      price_bdt: Number(item.price_bdt),
      calories: Number(item.calories),
      protein_g: Number(item.protein_g),
      carbs_g: Number(item.carbs_g),
      fat_g: Number(item.fat_g),
      image_url: item.image_url ?? "",
      tags: item.tags ?? [],
      allergens: item.allergens ?? [],
      available: Boolean(item.is_available),
    }));
  } catch {
    return meals;
  }
}

