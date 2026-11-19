
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
export default function SignInPage(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [msg,setMsg]=useState("");
 async function signIn(e:React.FormEvent){e.preventDefault();if(!supabase){setMsg("Demo mode: configure Supabase to enable authentication.");return;}const {error}=await supabase.auth.signInWithPassword({email,password});setMsg(error?.message??"Signed in. Refresh to load your account.");}
 async function signUp(){if(!supabase){setMsg("Demo mode: configure Supabase to enable authentication.");return;}const {error}=await supabase.auth.signUp({email,password});setMsg(error?.message??"Check your email to confirm your account.");}
 return <main className="mx-auto max-w-md px-5 py-16"><div className="rounded-3xl bg-white p-8 shadow-soft"><h1 className="text-3xl font-black">Welcome to Singles Meal</h1><p className="mt-2 text-slate-500">Sign in or create your account.</p><form onSubmit={signIn} className="mt-7 space-y-4"><input type="email" required placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border p-3"/><input type="password" required minLength={8} placeholder="Password (8+ characters)" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border p-3"/><button className="w-full rounded-full bg-forest p-3 font-bold text-white">Sign in</button></form><button onClick={signUp} className="mt-3 w-full rounded-full border p-3 font-bold text-forest">Create account</button>{msg&&<p className="mt-4 text-sm">{msg}</p>}</div></main>;
}
