
import Link from "next/link";
import { ArrowRight, Activity, CalendarCheck, Truck, Leaf } from "lucide-react";
import { getMeals } from "@/lib/meals";
import { MealCard } from "@/components/MealCard";

export default async function Home() {
  const meals = await getMeals();
  return <main>
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-[1.02fr_.98fr] md:py-24">
      <div><p className="mb-5 inline-flex rounded-full bg-mint px-4 py-2 text-xs font-extrabold tracking-[.16em] text-forest">FOOD THAT FITS YOUR LIFE</p>
        <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">Feel good about <span className="text-forest">every meal.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Fresh, balanced meals planned around your preferences and nutrition goals — delivered to your door.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/meals" className="rounded-full bg-forest px-7 py-4 font-bold text-white">Explore meals <ArrowRight className="ml-2 inline" size={18}/></Link><Link href="/health" className="rounded-full border border-forest/20 bg-white px-7 py-4 font-bold text-forest">Build my nutrition profile</Link></div>
        <div className="mt-10 flex gap-7 text-sm text-slate-500"><span>✓ Freshly prepared</span><span>✓ Clear nutrition</span><span>✓ Flexible plans</span></div>
      </div>
      <div className="relative"><div className="absolute -inset-5 rounded-[3rem] bg-mint/80 blur-2xl"/><img className="relative h-[430px] w-full rounded-[2.5rem] object-cover shadow-soft" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400" alt="Colorful healthy meal spread"/><div className="absolute -bottom-5 -left-4 rounded-2xl bg-white p-4 shadow-soft"><div className="text-xs text-slate-500">Made for your goals</div><div className="mt-1 font-extrabold">Nutrition-first meals 🌿</div></div></div>
    </section>
    <section className="bg-white py-16"><div className="mx-auto max-w-7xl px-5"><div className="mb-9 flex items-end justify-between"><div><p className="font-bold text-forest">GOOD FOOD, MADE SIMPLE</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Popular this week</h2></div><Link href="/meals" className="hidden font-bold text-forest md:block">View all meals →</Link></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{meals.slice(0,3).map(meal => <MealCard key={meal.id} meal={meal}/>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20"><div className="text-center"><p className="font-bold text-forest">HOW IT WORKS</p><h2 className="mt-2 text-3xl font-black md:text-4xl">A healthier routine, made easy.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[{icon:Activity,title:"Set your goals",desc:"Tell us what you enjoy, your food preferences and what matters to you."},{icon:Leaf,title:"Choose your meals",desc:"Explore transparent meal details and build a routine that works for you."},{icon:Truck,title:"Enjoy delivery",desc:"Fresh meals arrive on your chosen schedule. Track orders from kitchen to door."}].map((x,i)=><div key={x.title} className="rounded-3xl bg-mint p-7"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-forest"><x.icon/></div><p className="mt-6 text-xs font-extrabold text-forest">0{i+1}</p><h3 className="mt-2 text-xl font-extrabold">{x.title}</h3><p className="mt-3 leading-7 text-slate-600">{x.desc}</p></div>)}</div></section>
    <section className="mx-5 rounded-[2rem] bg-forest px-6 py-14 text-center text-white md:mx-auto md:max-w-7xl"><CalendarCheck className="mx-auto" size={34}/><h2 className="mt-4 text-3xl font-black">Make healthy eating your new normal.</h2><p className="mx-auto mt-3 max-w-xl text-white/75">Choose a flexible weekly meal plan and let Singles Meal take care of the everyday food decisions.</p><Link href="/plans" className="mt-7 inline-block rounded-full bg-white px-7 py-3.5 font-bold text-forest">Explore meal plans</Link></section>
  </main>;
}

