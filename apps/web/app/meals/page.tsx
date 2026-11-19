
import { getMeals } from "@/lib/meals";
import { MealCard } from "@/components/MealCard";

export default async function MealsPage() {
  const meals = await getMeals();
  const categories = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <p className="font-bold text-forest">THE MENU</p>
      <h1 className="mt-2 text-4xl font-black">Meals made for real life.</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Explore freshly prepared meals with clear ingredient and nutrition information. Always check allergen details before ordering.
      </p>
      {categories.map((category) => (
        <section key={category} className="mt-12">
          <h2 className="mb-5 text-2xl font-extrabold">{category}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {meals
              .filter((m) => m.category === category)
              .map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}

