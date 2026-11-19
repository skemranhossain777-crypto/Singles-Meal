
"use client";
import { useState } from "react";
export default function HealthPage(){
 const [goal,setGoal]=useState("balanced"); const [activity,setActivity]=useState("moderate"); const [diet,setDiet]=useState("no-preference"); const [allergy,setAllergy]=useState("");
 return <main className="mx-auto max-w-3xl px-5 py-12"><p className="font-bold text-forest">YOUR WELLNESS PROFILE</p><h1 className="mt-2 text-4xl font-black">Meals that fit you.</h1><p className="mt-3 text-slate-600">Share only what you are comfortable sharing. This starter profile is for meal preferences, not medical diagnosis.</p><form className="mt-8 space-y-6 rounded-3xl bg-white p-7 shadow-soft" onSubmit={e=>{e.preventDefault();alert("Profile preview saved in this session. Connect Supabase to persist securely.");}}>
 <label className="block"><span className="mb-2 block font-bold">What is your food goal?</span><select value={goal} onChange={e=>setGoal(e.target.value)} className="w-full rounded-xl border p-3"><option value="balanced">Balanced everyday eating</option><option value="protein">More protein in my meals</option><option value="energy">Steady energy and routine</option><option value="weight">Weight management support</option></select></label>
 <label className="block"><span className="mb-2 block font-bold">Activity level</span><select value={activity} onChange={e=>setActivity(e.target.value)} className="w-full rounded-xl border p-3"><option value="low">Mostly sitting</option><option value="moderate">Some activity</option><option value="high">Very active</option></select></label>
 <label className="block"><span className="mb-2 block font-bold">Diet preference</span><select value={diet} onChange={e=>setDiet(e.target.value)} className="w-full rounded-xl border p-3"><option value="no-preference">No preference</option><option value="vegetarian">Vegetarian</option><option value="plant-based">Plant-based</option><option value="pescatarian">Pescatarian</option></select></label>
 <label className="block"><span className="mb-2 block font-bold">Food allergies (important)</span><textarea value={allergy} onChange={e=>setAllergy(e.target.value)} placeholder="List known allergies, or write none" className="min-h-24 w-full rounded-xl border p-3"/></label>
 <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Allergy information must be confirmed with the customer and checked against ingredient and cross-contact procedures by the kitchen. Do not rely on automated recommendations alone.</div>
 <button className="rounded-full bg-forest px-7 py-3 font-bold text-white">Save profile preview</button>
 </form></main>;
}
