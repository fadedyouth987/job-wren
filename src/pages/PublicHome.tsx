import React, { useState } from 'react';
import { ArrowRight, Bot, CalendarCheck, Check, ChevronDown, Menu, MessageSquareText, PhoneMissed, ShieldCheck, Sparkles, TrendingUp, X } from 'lucide-react';
import { AppLink } from '../app/router';

const featureCards = [
  { icon: PhoneMissed, title: 'Recover missed calls', body: 'Automatically text missed callers, qualify the job and offer an available booking while you are still on the tools.' },
  { icon: MessageSquareText, title: 'One customer conversation', body: 'Web chat, SMS, email and phone history attach to the same customer and lead record.' },
  { icon: CalendarCheck, title: 'Turn demand into booked work', body: 'Check service area and availability, create the Jobryn booking, then sync external calendars.' },
  { icon: Bot, title: 'Controlled AI Operator', body: 'AI can use approved business tools without getting unrestricted database, payment or infrastructure access.' },
  { icon: TrendingUp, title: 'Measure the money', body: 'Connect source → lead → booking → job → payment so the owner can see exactly what Jobryn helped generate.' },
  { icon: ShieldCheck, title: 'Built for private business data', body: 'Workspace isolation, RLS, server-side authorization, signed webhooks, audit logs and least-privilege integrations.' },
];

export default function PublicHome() {
  return <div className="jobryn-spatial-site min-h-screen bg-[#07111f] text-slate-100">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <AppLink href="/" className="flex items-center gap-2 font-black tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-indigo-400 to-fuchsia-500 text-[#07111f] shadow-lg shadow-indigo-500/20">J</span><span className="text-lg tracking-[.12em]">JOBRYN</span></AppLink>
        <nav className="hidden items-center gap-1 md:flex">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">Product <ChevronDown className="h-4 w-4 transition group-open:rotate-180"/></summary>
            <div className="absolute left-0 top-12 w-72 rounded-2xl border border-white/10 bg-[#0d1a2d] p-2 shadow-2xl shadow-black/40">
              <a href="#product" className="block rounded-xl p-3 hover:bg-white/5"><p className="text-sm font-bold text-white">Revenue OS</p><p className="mt-1 text-xs text-slate-400">CRM, bookings, jobs and payments.</p></a>
              <a href="#operator" className="block rounded-xl p-3 hover:bg-white/5"><p className="text-sm font-bold text-white">AI Operator</p><p className="mt-1 text-xs text-slate-400">Controlled automation with approval gates.</p></a>
              <a href="#security" className="block rounded-xl p-3 hover:bg-white/5"><p className="text-sm font-bold text-white">Security</p><p className="mt-1 text-xs text-slate-400">Workspace isolation and least privilege.</p></a>
            </div>
          </details>
          <a href="#product" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white">How it works</a>
          <AppLink href="/pricing" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white">Pricing</AppLink>
        </nav>
        <div className="flex items-center gap-2">
          <AppLink href="/login" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 sm:block">Log in</AppLink>
          <AppLink href="/signup" className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-violet-400">Start free</AppLink>
          <details className="group relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200"><Menu className="h-5 w-5 group-open:hidden"/><X className="hidden h-5 w-5 group-open:block"/></summary>
            <div className="absolute right-0 top-12 w-64 rounded-2xl border border-white/10 bg-[#0d1a2d] p-2 shadow-2xl shadow-black/40">
              <a href="#product" className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5">Product</a>
              <a href="#operator" className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5">AI Operator</a>
              <a href="#security" className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5">Security</a>
              <AppLink href="/pricing" className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5">Pricing</AppLink>
              <AppLink href="/login" className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5">Log in</AppLink>
            </div>
          </details>
        </div>
      </div>
    </header>

    <main>
      <section className="relative overflow-hidden border-b border-white/10 bg-[#07111f]">
        <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.16),transparent_38%),radial-gradient(circle_at_70%_10%,rgba(99,102,241,.22),transparent_42%),radial-gradient(circle_at_top_right,rgba(217,70,239,.12),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-200"><Sparkles className="h-3.5 w-3.5"/> AI Revenue Operating System</div>
            <h1 className="max-w-4xl text-5xl font-black leading-[.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">Turn enquiries into <span className="text-cyan-300">booked, paid work.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Jobryn helps service businesses respond to demand, qualify customers, book work, follow up quotes, collect revenue and bring customers back — from one operating system.</p>
            <div className="mt-8 flex flex-wrap gap-3"><AppLink href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 hover:from-indigo-400 hover:to-violet-400">Start building revenue <ArrowRight className="h-4 w-4"/></AppLink><AppLink href="/pricing" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">View pricing</AppLink></div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-1.5">
              <div className="flex flex-wrap gap-1 text-xs font-bold">
                {['Revenue OS','AI Operator','Customer Hub'].map((tab,i)=><a key={tab} href={i===1?'#operator':'#product'} className={`rounded-xl px-3 py-2 transition ${i===0?'bg-white/10 text-white':'text-slate-400 hover:bg-white/5 hover:text-white'}`}>{tab}</a>)}
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-400">{['Australian service businesses','14-day trial ready','Stripe-secured billing','Cancel in portal'].map(item=><span key={item} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600"/>{item}</span>)}</div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="rounded-[22px] border border-white/10 bg-[#0d1a2d] p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-400">Today</p><h3 className="mt-1 text-xl font-bold text-white">Revenue recovery</h3></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Operator active</span></div>
              <div className="grid grid-cols-2 gap-3 py-5"><div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4"><p className="text-xs text-slate-500">Missed calls recovered</p><p className="mt-1 text-3xl font-black">27</p></div><div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-4"><p className="text-xs text-indigo-600">Attributed revenue</p><p className="mt-1 text-3xl font-black text-cyan-200">$24.8k</p></div></div>
              <div className="space-y-3">{[
                ['5:12 pm','Missed call','Auto-SMS sent'],
                ['5:14 pm','Blocked drain','Lead qualified'],
                ['5:16 pm','Wednesday 10:00','Booking accepted'],
                ['5:16 pm','$440 expected','Revenue attributed'],
              ].map(([time,title,status])=><div key={time+title} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"><span className="w-16 text-xs font-medium text-slate-400">{time}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{title}</p><p className="text-xs text-slate-500">{status}</p></div><span className="h-2 w-2 rounded-full bg-emerald-500"/></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.18em] text-cyan-300">One revenue loop</p><h2 className="mt-3 text-4xl font-black tracking-tight">Acquire → Convert → Retain → Measure.</h2><p className="mt-4 text-slate-400">The CRM, inbox, booking engine, work management, payments, automations and follow-ups share one customer and revenue record.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{featureCards.map(({icon:Icon,title,body})=><div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.05]"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-indigo-500 text-[#07111f]"><Icon className="h-5 w-5"/></div><h3 className="font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></div>)}</div></section>

      <section id="operator" className="border-y border-white/10 bg-[#081525]"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-cyan-300">AI Operator</p><h2 className="mt-3 text-4xl font-black tracking-tight text-white">Automation that stays in your hands.</h2><p className="mt-5 max-w-xl leading-7 text-slate-400">Jobryn can surface the next best action, but sensitive actions stay behind business rules and approval gates.</p></div><div className="grid gap-3 sm:grid-cols-3">{[['01','Detect','Find missed calls, stale quotes and open demand.'],['02','Decide','Rank the highest-value action using your business context.'],['03','Act','Run approved tools without unrestricted data access.']].map(([n,t,b])=><div key={n} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><span className="text-xs font-black text-cyan-300">{n}</span><h3 className="mt-8 font-bold text-white">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{b}</p></div>)}</div></div></section>
      <section id="security" className="border-y border-white/10 bg-[#050b14] text-white"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-indigo-300">Security by architecture</p><h2 className="mt-3 text-4xl font-black">Private business data should stay private.</h2><p className="mt-5 max-w-xl leading-7 text-slate-300">Every operational record belongs to a workspace. Jobryn verifies identity, workspace membership and role server-side and backs that with PostgreSQL Row Level Security.</p></div><div className="grid gap-3 sm:grid-cols-2">{['PKCE authentication','Google / GitHub / Microsoft','TOTP MFA','Row Level Security','Signed Stripe webhooks','Strict API validation','Rate limiting','Append-only audit history'].map(item=><div key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"><Check className="mr-2 inline h-4 w-4 text-emerald-400"/>{item}</div>)}</div></div></section>
    </main>

    <footer className="bg-[#07111f] border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2026 Jobryn. AI Revenue Operating System.</span><div className="flex gap-5"><AppLink href="/pricing">Pricing</AppLink><AppLink href="/login">Login</AppLink></div></div></footer>
  </div>;
}
