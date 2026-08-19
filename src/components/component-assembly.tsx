"use client"

import { useEffect, useState, type CSSProperties, type ReactNode } from "react"

/**
 * component-assembly.tsx — hero animation for the DS Generator landing page.
 *
 * A mock design-tool window that assembles itself. Every ~10s the canvas
 * swaps to a different component scene (inputs, stats, typography, alerts,
 * navigation, table), remounting with a key change so the shared CSS entrance
 * keyframes replay a fresh build each cycle. Reduced-motion users get the
 * first scene rendered statically.
 */

const d = (v: string): CSSProperties => ({ "--d": v } as CSSProperties)

function Bar({ w, delay = "0.5s", tone = "bg-foreground/15", h = "h-2" }: { w: string; delay?: string; tone?: string; h?: string }) {
  return <span className={`builder-draw block rounded-full ${h} ${tone} ${w}`} style={d(delay)} />
}

function Dot({ c, delay = "0.5s", className = "h-6 w-6 rounded-md" }: { c: string; delay?: string; className?: string }) {
  return <span className={`builder-dot block shrink-0 border ${className}`} style={{ ...d(delay), background: c }} />
}

function PopBtn({ label, tone, delay, w = "w-20" }: { label: string; tone: string; delay: string; w?: string }) {
  return (
    <span className={`builder-pop inline-flex h-8 items-center justify-center rounded-lg text-[11px] font-medium ${tone} ${w}`} style={d(delay)}>
      {label}
    </span>
  )
}

function Badge({ label, tone = "bg-muted text-muted-foreground", dotColor, delay = "1.2s" }: { label: string; tone?: string; dotColor?: string; delay?: string }) {
  return (
    <span className={`builder-pop inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${tone}`} style={d(delay)}>
      {dotColor && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />}
      {label}
    </span>
  )
}

type Scene = { id: string; label: string; count: number; body: ReactNode }

const RAMP = ["#4F46E5", "#0EA5E9", "#22C55E", "#F59E0B", "#EF4444", "#EC4899"]
const AVATARS = ["#4F46E5", "#22C55E", "#F59E0B", "#14B8A6"]

const SCENES: Scene[] = [
  {
    id: "inputs",
    label: "Buttons & Inputs",
    count: 12,
    body: (
      <div className="space-y-4">
        <div className="builder space-y-1.5" style={d("0.5s")}>
          <Bar w="w-14" h="h-1.5" tone="bg-muted-foreground/40" delay="0.5s" />
          <div className="builder-draw h-9 rounded-lg border border-input bg-background" style={d("0.65s")} />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <PopBtn label="Primary" tone="bg-primary text-primary-foreground" w="w-24" delay="0.85s" />
          <PopBtn label="Secondary" tone="border-2 border-primary/60 text-primary" w="w-24" delay="0.95s" />
          <PopBtn label="Ghost" tone="border text-muted-foreground" w="w-20" delay="1.05s" />
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="builder inline-flex items-center gap-1.5 text-[10px] text-muted-foreground" style={d("1.25s")}>
            <span className="relative inline-flex h-5 w-9 rounded-full bg-primary">
              <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
            </span>
            Toggle
          </span>
          <span className="builder inline-flex items-center gap-1.5 text-[10px] text-muted-foreground" style={d("1.4s")}>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary">
              <span className="h-2 w-2 -rotate-45 border-b-2 border-l-2 border-white" />
            </span>
            Checkbox
          </span>
          <span className="builder inline-flex items-center gap-1.5 text-[10px] text-muted-foreground" style={d("1.55s")}>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            Radio
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "stats",
    label: "Cards & Stats",
    count: 8,
    body: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="builder rounded-xl border p-3" style={d("0.5s")}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <Bar w="w-12" h="h-1.5" tone="bg-muted-foreground/30" delay="0.6s" />
              <Badge label="+12%" tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" delay="0.8s" />
            </div>
            <div className="builder-draw h-6 w-16 rounded bg-foreground/25" style={d("0.9s")} />
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted-foreground/15">
              <div className="builder-draw h-full w-3/4 rounded-full bg-primary" style={d("1.1s")} />
            </div>
          </div>
          <div className="builder rounded-xl border p-3" style={d("0.7s")}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <Bar w="w-12" h="h-1.5" tone="bg-muted-foreground/30" delay="0.8s" />
              <Badge label="-3%" tone="bg-red-500/10 text-red-600 dark:text-red-400" delay="1s" />
            </div>
            <div className="builder-draw h-6 w-20 rounded bg-foreground/25" style={d("1.1s")} />
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted-foreground/15">
              <div className="builder-draw h-full w-1/2 rounded-full bg-amber-500" style={d("1.3s")} />
            </div>
          </div>
        </div>
        <div className="builder rounded-xl border p-3" style={d("1.1s")}>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <Bar w="w-20" h="h-1.5" tone="bg-muted-foreground/30" delay="1.2s" />
            <Badge label="Trending" tone="bg-primary/10 text-primary" delay="1.5s" />
          </div>
          <div className="flex items-end gap-1 pt-2">
            {[40, 65, 50, 80, 60, 90].map((hgt, i) => (
              <div key={i} className="builder-draw w-full rounded-t bg-primary/50" style={{ ...d(`${1.4 + i * 0.1}s`), height: `${hgt * 0.55}px` }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "type",
    label: "Typography & Color",
    count: 9,
    body: (
      <div className="space-y-4">
        <div className="space-y-2">
          <Bar w="w-full" h="h-4" tone="bg-foreground/25" delay="0.5s" />
          <Bar w="w-2/3" h="h-4" tone="bg-foreground/20" delay="0.62s" />
        </div>
        <div className="space-y-1.5">
          <Bar w="w-1/3" h="h-2" tone="bg-foreground/15" delay="0.85s" />
          <Bar w="w-full" h="h-2" tone="bg-foreground/10" delay="0.95s" />
          <Bar w="w-5/6" h="h-2" tone="bg-foreground/10" delay="1.05s" />
        </div>
        <div className="flex gap-1.5">
          {RAMP.map((c, i) => (
            <span key={c} className="builder-dot h-8 flex-1 rounded-md border" style={{ ...d(`${1.3 + i * 0.12}s`), background: c }} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Dot c={RAMP[0]} delay="2s" className="h-7 w-7 rounded-md" />
          <div className="space-y-1.5">
            <Bar w="w-28" h="h-1.5" tone="bg-foreground/20" delay="2.1s" />
            <Bar w="w-40" h="h-1.5" tone="bg-muted-foreground/25" delay="2.2s" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "alerts",
    label: "Alerts & Badges",
    count: 6,
    body: (
      <div className="space-y-3">
        <div className="space-y-2">
          {[
            { b: "border-emerald-500/30", bg: "bg-emerald-500/10", dot: "bg-emerald-500", bar: "bg-emerald-500/40", w: "w-2/3" },
            { b: "border-amber-500/30", bg: "bg-amber-500/10", dot: "bg-amber-500", bar: "bg-amber-500/40", w: "w-1/2" },
            { b: "border-red-500/30", bg: "bg-red-500/10", dot: "bg-red-500", bar: "bg-red-500/40", w: "w-3/5" },
          ].map((a, i) => (
            <div key={i} className={`builder flex items-center gap-2.5 rounded-lg border px-3 py-2 ${a.b} ${a.bg}`} style={d(`${0.5 + i * 0.22}s`)}>
              <span className={`h-2 w-2 shrink-0 rounded-full ${a.dot}`} />
              <Bar w={a.w} h="h-1.5" tone={a.bar} delay={`${0.65 + i * 0.22}s`} />
              <span className="ml-auto shrink-0">
                <Badge label="Action" tone="bg-white/60 text-foreground" delay={`${0.8 + i * 0.22}s`} />
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge label="Primary" tone="bg-primary/10 text-primary" dotColor="#4F46E5" delay="1.3s" />
          <Badge label="Success" tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" dotColor="#22c55e" delay="1.4s" />
          <Badge label="Warning" tone="bg-amber-500/10 text-amber-600 dark:text-amber-400" dotColor="#f59e0b" delay="1.5s" />
          <Badge label="Error" tone="bg-red-500/10 text-red-600 dark:text-red-400" dotColor="#ef4444" delay="1.6s" />
          <Badge label="Info" tone="bg-sky-500/10 text-sky-600 dark:text-sky-400" dotColor="#0ea5e9" delay="1.7s" />
        </div>
      </div>
    ),
  },
  {
    id: "nav",
    label: "Navigation & Layout",
    count: 10,
    body: (
      <div className="flex h-full flex-col gap-3">
        <div className="builder flex items-center gap-3 rounded-lg border px-3 py-2" style={d("0.5s")}>
          <span className="h-4 w-4 shrink-0 rounded-md bg-primary" />
          <Bar w="w-10" h="h-1.5" delay="0.6s" />
          <Bar w="w-8" h="h-1.5" delay="0.68s" />
          <Bar w="w-9" h="h-1.5" delay="0.76s" />
          <span className="ml-auto h-5 w-10 shrink-0 rounded-md bg-primary/80" />
        </div>
        <div className="flex min-h-0 flex-1 gap-3">
          <div className="builder w-1/4 space-y-2 rounded-lg border p-2.5" style={d("0.75s")}>
            <Bar w="w-full" h="h-1.5" delay="0.85s" />
            <Bar w="w-3/4" h="h-1.5" tone="bg-foreground/10" delay="0.95s" />
            <Bar w="w-5/6" h="h-1.5" tone="bg-foreground/10" delay="1.05s" />
            <Bar w="w-2/3" h="h-1.5" tone="bg-foreground/10" delay="1.15s" />
            <Bar w="w-4/5" h="h-1.5" tone="bg-foreground/10" delay="1.25s" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="builder flex-1 rounded-lg border p-2.5" style={d("0.9s")}>
              <Bar w="w-1/2" h="h-2" delay="1s" />
              <Bar w="w-3/4" h="h-1.5" tone="bg-foreground/10" delay="1.15s" />
            </div>
            <div className="builder flex-1 rounded-lg border p-2.5" style={d("1.1s")}>
              <Bar w="w-2/3" h="h-2" delay="1.2s" />
              <Bar w="w-1/2" h="h-1.5" tone="bg-foreground/10" delay="1.35s" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "table",
    label: "Data Table",
    count: 6,
    body: (
      <div className="overflow-hidden rounded-lg border">
        <div className="builder flex items-center gap-2 border-b bg-muted/40 px-3 py-2" style={d("0.5s")}>
          <Bar w="w-1/4" h="h-1.5" delay="0.6s" />
          <Bar w="w-1/3" h="h-1.5" delay="0.68s" />
          <Bar w="w-1/4" h="h-1.5" delay="0.76s" />
        </div>
        {AVATARS.map((c, i) => (
          <div key={c} className="builder flex items-center gap-2 border-b px-3 py-2 last:border-b-0" style={d(`${0.7 + i * 0.15}s`)}>
            <Dot c={c} delay={`${0.75 + i * 0.15}s`} className="h-5 w-5 rounded-full" />
            <Bar w="w-1/4" h="h-2" delay={`${0.8 + i * 0.15}s`} />
            <Bar w="w-1/3" h="h-2" tone="bg-muted-foreground/20" delay={`${0.9 + i * 0.15}s`} />
            <span className="ml-auto">
              <Badge label="Active" tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" delay={`${1 + i * 0.15}s`} />
            </span>
          </div>
        ))}
      </div>
    ),
  },
]

export function ComponentAssembly() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SCENES.length), 10000)
    return () => window.clearInterval(id)
  }, [])

  const scene = SCENES[index]

  return (
    <div className="relative w-full aspect-square" aria-hidden>
      <div className="absolute inset-[4%] flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xl">
        <div className="builder-scan" />

        <div className="builder-chrome relative z-10 flex h-9 shrink-0 items-center gap-1.5 border-b px-3" style={d("0s")}>
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 truncate text-[10px] font-medium text-muted-foreground">
            DS Generator — Component Library
          </span>
        </div>

        <div className="builder relative z-10 flex h-12 shrink-0 items-center gap-3 border-b px-4" style={d("0.25s")}>
          <span className="h-5 w-5 shrink-0 rounded-md bg-primary" />
          <div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
            <span className="h-2 w-10 rounded-full bg-muted-foreground/30" />
            <span className="h-2 w-8 rounded-full bg-muted-foreground/25" />
            <span className="h-2 w-9 rounded-full bg-muted-foreground/25" />
            <span className="h-2 w-11 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="hidden h-5 w-12 rounded-md border border-primary/40 sm:block" />
            <span className="h-5 w-14 rounded-md bg-primary" />
          </div>
        </div>

        <div key={scene.id} className="relative z-10 flex min-h-0 flex-1 flex-col justify-center gap-4 overflow-hidden px-5 py-4">
          {scene.body}
        </div>

        <div className="builder-status relative z-10 flex h-9 shrink-0 items-center gap-3 border-t px-4 text-[10px] text-muted-foreground" style={d("2.1s")}>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {scene.label}
          </span>
          <span className="hidden sm:inline">{scene.count} components</span>
          <span className="ml-auto hidden md:inline">Export: Figma · Tailwind · JSON</span>
        </div>
      </div>
    </div>
  )
}