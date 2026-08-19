"use client"

import { Check, AlertTriangle, Info, XCircle, CheckCircle2, Palette } from "lucide-react"

/**
 * token-gallery.tsx — renders representative UI controls LIVE from the
 * generated design tokens (colors, semantic hues, radius, shadows, fonts).
 * Used at the top of the Component Library section so the design is visible,
 * not just described in text.
 */
type TokenShape = {
  colors?: {
    primary?: string
    neutral?: Record<string, string>
    semantic?: Record<string, string>
    gradients?: Record<string, string>
    [key: string]: unknown
  }
  radius?: string
  typography?: { fontFamily?: string; headingFont?: string; monoFont?: string }
  shadows?: Record<string, string>
  [key: string]: unknown
}

export function TokenGallery({ tokens }: { tokens: TokenShape }) {
  const colors = tokens?.colors || {}
  const primary = colors.primary || "#4F46E5"
  const radius = tokens?.radius || "8px"
  const fontFamily = tokens?.typography?.fontFamily || "Inter, sans-serif"
  const headingFont = tokens?.typography?.headingFont || fontFamily
  const neutral = colors.neutral || {}
  const semantic = colors.semantic || {}
  const shadows = tokens?.shadows || {}
  const gradients = colors.gradients || {}

  const inputCls = "w-full h-10 rounded-lg border px-3 text-sm outline-none focus:ring-2 transition-shadow"
  const btnBase = "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"

  return (
    <div className="space-y-5" style={{ fontFamily }}>
      <div className="flex flex-wrap items-center gap-3">
        <button className={btnBase + " text-white"} style={{ background: primary, borderRadius: radius }}>
          Primary Action
        </button>
        <button className={btnBase + " border-2"} style={{ borderColor: primary, color: primary, borderRadius: radius }}>
          Secondary
        </button>
        <button className={btnBase + " border"} style={{ borderRadius: radius }}>
          Ghost
        </button>
        <button className={btnBase + " text-white"} style={{ background: semantic.error || "#dc2626", borderRadius: radius }}>
          Destructive
        </button>
        <button className={btnBase + " text-white"} style={{ backgroundImage: gradients.primary, borderRadius: radius }}>
          Gradient
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Email address</label>
          <input
            className={inputCls + " border-input bg-background text-foreground placeholder:text-muted-foreground"}
            style={{ borderRadius: radius }}
            placeholder="name@example.com"
          />
          <p className="text-[11px] text-muted-foreground">Helper text for extra context.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">With error</label>
          <input
            className={inputCls + " border-destructive bg-background text-foreground"}
            style={{ borderRadius: radius, borderColor: semantic.error || "#dc2626" }}
            placeholder="Invalid value"
          />
          <p className="text-[11px] text-destructive" style={{ color: semantic.error || "#dc2626" }}>This field is required.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Select</label>
          <div
            className="flex h-10 items-center justify-between rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground"
            style={{ borderRadius: radius }}
          >
            Choose an option
            <span className="text-xs">▾</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: primary, borderRadius: "999px" }}>
          <Palette className="h-3 w-3" /> Primary
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ background: semantic.successBg, color: semantic.successDark, borderRadius: "999px" }}>
          <CheckCircle2 className="h-3 w-3" /> Success
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ background: semantic.warningBg, color: semantic.warningDark, borderRadius: "999px" }}>
          <AlertTriangle className="h-3 w-3" /> Warning
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ background: semantic.errorBg, color: semantic.errorDark, borderRadius: "999px" }}>
          <XCircle className="h-3 w-3" /> Error
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ background: semantic.infoBg, color: semantic.infoDark, borderRadius: "999px" }}>
          <Info className="h-3 w-3" /> Info
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          className="p-4"
          style={{ borderRadius: radius, border: `1px solid ${neutral[200] || "#e2e8f0"}`, background: "#ffffff", boxShadow: shadows?.md }}
        >
          <div className="mb-3 h-16 rounded-lg" style={{ backgroundImage: gradients.primary || primary }} />
          <p className="text-sm font-semibold" style={{ fontFamily: headingFont }}>Stat Card</p>
          <p className="text-2xl font-bold mt-1" style={{ color: primary }}>14,249</p>
          <p className="text-xs text-muted-foreground">+12.4% this month</p>
        </div>

        <div
          className="p-4 flex flex-col justify-center"
          style={{ borderRadius: radius, border: `1px solid ${neutral[200] || "#e2e8f0"}`, background: "#ffffff", boxShadow: shadows?.md }}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full" style={{ background: `${primary}1a`, color: primary, borderRadius: "999px" }}>
              <span className="relative inline-flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: primary }} />
                <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: primary }} />
              </span>
              <span className="px-2 py-0.5 text-xs font-medium">Live</span>
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold">Service Status</p>
          <p className="text-xs text-muted-foreground mt-0.5">All systems operational.</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: neutral[100] || "#f1f5f9" }}>
            <div className="h-full w-3/4 rounded-full" style={{ background: primary }} />
          </div>
        </div>

        <div
          className="p-4 flex flex-col justify-between"
          style={{ borderRadius: radius, border: `1px solid ${neutral[200] || "#e2e8f0"}`, background: "#ffffff", boxShadow: shadows?.lg }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alert</p>
            <p className="text-sm mt-1 text-foreground">Your trial ends in 7 days.</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 text-xs font-medium text-white" style={{ background: primary, borderRadius: radius }}>Update plan</button>
            <button className="px-3 py-1.5 text-xs font-medium border" style={{ borderRadius: radius }}>Dismiss</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="h-5 w-5 rounded inline-flex items-center justify-center text-white" style={{ background: primary, borderRadius: Math.max(2, parseInt(radius)) * 0.4 || 4 }}>
            <Check className="h-3 w-3" />
          </span>
          Checkbox
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="h-5 w-5 rounded-full border-2 inline-flex items-center justify-center" style={{ borderColor: primary }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: primary }} />
          </span>
          Radio
        </label>
        <span className="inline-flex items-center gap-2 text-sm">
          Toggle
          <span className="relative inline-flex h-6 w-11 rounded-full items-center transition-colors" style={{ background: primary }}>
            <span className="ml-1 h-4 w-4 rounded-full bg-white shadow" />
          </span>
        </span>
        <span
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
          style={{ background: `${primary}14`, color: primary, borderRadius: radius, fontFamily: "inherit" }}
        >
          <Check className="h-3.5 w-3.5" /> Toast · Saved successfully
        </span>
      </div>
    </div>
  )
}
