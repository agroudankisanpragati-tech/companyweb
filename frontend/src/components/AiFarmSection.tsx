'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, SunMedium, Tractor } from 'lucide-react';

const assistantPrompts = ['Check crop disease', 'Weather alert for tomorrow', 'Which scheme fits me?'];

const todayTasks = [
  {
    title: 'Inspect paddy field',
    time: '06:30 AM',
    status: 'Priority',
    color: 'from-amber-400 to-orange-500',
  },
  {
    title: 'Review mandi price',
    time: '11:00 AM',
    status: 'Active',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    title: 'Upload crop photo',
    time: '04:15 PM',
    status: 'Pending',
    color: 'from-sky-400 to-blue-500',
  },
];

export default function AiFarmSection() {
  return (
    <section className="relative -mt-2 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(236,253,245,0.92)_40%,_rgba(239,246,255,0.95)_100%)] py-6 sm:py-8 lg:py-10">
      <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="section-container relative z-10">
        

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-5 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-slate-100/60 blur-3xl" />
            <div className="relative z-10 flex h-full flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  <Tractor className="h-4 w-4" />
                </div>
                <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] backdrop-blur" aria-hidden="true" />
              </div>

              <div className="space-y-3 flex items-center justify-center">
                <img
                  src="/FARMER%20DESK%20IMH/AI%20ASSIS%20IMG.png"
                  alt="AI Assistant"
                  className="h-[80%] w-[50%] object-contain"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {/* prompts intentionally left blank */}
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/auth/role-select"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-transform duration-300 hover:-translate-y-0.5"
                  aria-label="Start Assistant"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.1)] sm:p-6">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-sky-200/50 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.32em] text-emerald-600">Plan for today</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Today's Tasks</h3>
                </div>
                <div className="rounded-2xl bg-slate-950 px-4 py-3 text-right text-white shadow-lg">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/70">Completion</p>
                  <p className="mt-1 text-2xl font-black">72%</p>
                </div>
              </div>

              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div
                    key={task.title}
                    className="group flex items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50/90 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${task.color} text-white shadow-lg`}>
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{task.title}</h4>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                          {task.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{task.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-900">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">Fast note</p>
                  <p className="mt-2 text-sm leading-6 font-medium">
                    Morning check done. Reminders will keep the field routine on track.
                  </p>
                </div>
                <div className="rounded-3xl bg-sky-50 p-4 text-sky-900">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-600">Next step</p>
                  <p className="mt-2 text-sm leading-6 font-medium">
                    Tap the assistant if a task needs crop advice before you continue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}