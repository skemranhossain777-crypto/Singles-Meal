
"use client";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatBDT } from "@shared/index";
import { supabase } from "@/lib/supabase";
export default function CheckoutPage(){
 const {lines,total,clear}=useCart(); const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [address,setAddress]=useState(""); const [slot,setSlot]=useState("Lunch (11am–2pm)"); const [busy,setBusy]=useState(false); const [message,setMessage]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault(); if(!lines.length)return; setBusy(true);setMessage("");
  try { if(!supabase) {setMessage("Demo mode: add Supabase credentials to save real orders. Your basket is still available.");return;}
   const {data:{user}}=await supabase.auth.getUser(); if(!user) {setMessage("Please sign in before placing an order.");return;}
   const {data:orderId,error}=await supabase.rpc("create_customer_order",{
    p_customer_name:name, p_customer_phone:phone, p_delivery_address:address,
    p_delivery_slot:slot, p_items:lines.map(x=>({meal_id:x.meal.id,quantity:x.quantity}))
   });
   if(error) throw error;
   setMessage(`Order ${orderId} created and awaiting verified payment.`);clear();
  } catch(err){setMessage(err instanceof Error?err.message:"Could not create order.");} finally{setBusy(false);}
 }
 return <main className="mx-auto max-w-3xl px-5 py-12"><h1 className="text-4xl font-black">Checkout</h1><p className="mt-3 text-slate-600">Confirm your delivery details. Payment is not collected in this starter until a provider is connected.</p><form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl bg-white p-7 shadow-soft"><label className="block font-bold">Full name<input required value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label><label className="block font-bold">Mobile number<input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="mt-2 w-full rounded-xl border p-3"/></label><label className="block font-bold">Delivery address<textarea required value={address} onChange={e=>setAddress(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label><label className="block font-bold">Delivery slot<select value={slot} onChange={e=>setSlot(e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option>Breakfast (7am–10am)</option><option>Lunch (11am–2pm)</option><option>Dinner (6pm–9pm)</option></select></label><div className="rounded-2xl bg-mint p-4"><div className="flex justify-between">Subtotal <b>{formatBDT(total)}</b></div><p className="mt-2 text-xs text-slate-600">Delivery fee and payment method will be confirmed by the business.</p></div><button disabled={!lines.length||busy} className="w-full rounded-full bg-forest p-4 font-bold text-white disabled:opacity-50">{busy?"Submitting…":"Create order"}</button>{message&&<p role="status" className="rounded-xl bg-mint p-3 text-sm">{message}</p>}</form></main>;
}
