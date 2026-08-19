"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Palette, Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

type PreviewData = {
  colors: {
    primary: string
    primaryLight: string
    primaryDark: string
    secondary: string
    accent: string
    neutral: Record<string, string>
    semantic: Record<string, string>
    text: { primary: string; secondary: string }
    background: string
    surface: string
    border: string
  }
  typography: { fontFamily: string; headingFont: string }
  spacing: { container: string }
  radius: string
  theme: string
  brandName: string
  tagline: string
  isDark: boolean
}

const DEFAULT_TOKENS: PreviewData = {
  colors: {
    primary: "#6366f1",
    primaryLight: "#a5b4fc",
    primaryDark: "#4f46e5",
    secondary: "#8b5cf6",
    accent: "#8b5cf6",
    neutral: { 100: "#f5f5f5", 200: "#e5e5e5", 700: "#404040", 900: "#171717" },
    semantic: { success: "#22c55e", error: "#ef4444" },
    text: { primary: "#0f172a", secondary: "#475569" },
    background: "#ffffff",
    surface: "#ffffff",
    border: "#e2e8f0",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    headingFont: "Inter, system-ui, sans-serif",
  },
  spacing: { container: "1200px" },
  radius: "8px",
  theme: "Light",
  brandName: "",
  tagline: "",
  isDark: false,
}

type RawProject = {
  designData?: string | Record<string, unknown>
  [key: string]: unknown
}

function normalizeTokens(raw: RawProject): PreviewData {
  const designData =
    typeof raw?.designData === "string" ? JSON.parse(raw.designData) : raw?.designData || {}
  const t = designData.tokens || {}
  const spacingLayout = designData.spacingLayout || {}
  const brand = designData.brandFoundation || {}
  const theme = t.theme || "Light"
  const mode = theme === "Dark" ? t.modes?.dark || null : null
  const colors = t.colors || {}
  const neutral = mode
    ? { 100: mode.surfaceMuted || "#0f172a", 200: mode.border || "#1e293b", 700: mode.textSecondary || "#94a3b8", 800: mode.border || "#1e293b", 900: mode.textPrimary || "#f1f5f9" }
    : colors.neutral || {}
  const semantic = mode ? mode.semantic || {} : colors.semantic || {}
  const text = mode
    ? { primary: mode.textPrimary || "#f1f5f9", secondary: mode.textSecondary || "#94a3b8" }
    : colors.text || {}
  return {
    colors: {
      primary: (mode?.primary as string) || colors.primary || DEFAULT_TOKENS.colors.primary,
      primaryLight:
        (mode?.primary as string) || colors.primaryLight || DEFAULT_TOKENS.colors.primaryLight,
      primaryDark:
        (mode?.borderStrong as string) || colors.primaryDark || colors.primary || DEFAULT_TOKENS.colors.primary,
      secondary: colors.secondary || DEFAULT_TOKENS.colors.secondary,
      accent: colors.accent || DEFAULT_TOKENS.colors.accent,
      neutral: { ...DEFAULT_TOKENS.colors.neutral, ...neutral },
      semantic: { ...DEFAULT_TOKENS.colors.semantic, ...semantic },
      text,
      background: (mode?.background as string) || "#ffffff",
      surface: (mode?.surface as string) || "#ffffff",
      border: (mode?.border as string) || colors.borders?.light || DEFAULT_TOKENS.colors.border,
    },
    typography: {
      fontFamily: t.typography?.fontFamily || DEFAULT_TOKENS.typography.fontFamily,
      headingFont: t.typography?.headingFont || DEFAULT_TOKENS.typography.fontFamily,
    },
    spacing: {
      container: spacingLayout?.containerWidth || t.spacing?.container || DEFAULT_TOKENS.spacing.container,
    },
    radius: t.radius || DEFAULT_TOKENS.radius,
    theme,
    brandName: brand?.brandName || raw?.brandName || "",
    tagline: brand?.tagline || "",
    isDark: theme === "Dark",
  }
}

const STAT_VALUES = [14, 7, 9]

function PreviewContent() {
  const { status } = useSession()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [data, setData] = useState<PreviewData>(DEFAULT_TOKENS)
  const [loading, setLoading] = useState<boolean>(() => !!id)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (status !== "authenticated" || !id) return
    let cancelled = false
    fetch(`/api/projects/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("not found")
        const project = await res.json()
        if (!cancelled) setData(normalizeTokens(project))
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [status, id])

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status === "unauthenticated") redirect("/login")

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const primary = data.colors.primary
  const showEmpty = !id || notFound
  const brandName = data.brandName || "Your Brand"
  const tagline = data.tagline || "A design system built for clarity and scale."
  const headingFont = data.typography.headingFont
  const bodyFont = data.typography.fontFamily
  const inputRadius = data.radius

  return (
    <div className="flex-1">
      <header className="border-b" style={{ borderColor: data.colors.border, background: data.colors.background }}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={id ? `/project/${id}` : "/dashboard"}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Logo className="h-7 w-7" style={{ color: primary }} />
            <span className="font-bold text-xl" style={{ color: data.colors.text.primary }}>
              Preview
            </span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">{brandName} · {data.theme} mode</span>
        </div>
      </header>

      <main
        className="min-h-screen px-4 py-8"
        style={{ background: data.colors.background, color: data.colors.text.primary, fontFamily: bodyFont }}
      >
        {showEmpty ? (
          <div className="text-center space-y-4 py-20">
            <Palette className="h-10 w-10 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-bold">Project not found</h2>
            <p className="text-sm text-muted-foreground">
              {id ? "This project doesn't exist or you don't have access to it." : "No project selected."}
            </p>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="login" style={{ fontFamily: bodyFont }}>
            <TabsList>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="landing">Landing</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <Card
                className="max-w-md mx-auto"
                style={{ background: data.colors.surface, borderColor: data.colors.border }}
              >
                <CardHeader className="text-center space-y-3">
                  <div className="mx-auto h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: primary }}>
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle style={{ color: data.colors.text.primary }}>{brandName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: data.colors.text.primary }}>Email</label>
                    <div
                      className="h-10 rounded-lg border px-3 flex items-center text-sm"
                      style={{ borderRadius: inputRadius, borderColor: data.colors.border, background: data.colors.background, color: data.colors.text.secondary }}
                    >
                      name@example.com
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: data.colors.text.primary }}>Password</label>
                    <div
                      className="h-10 rounded-lg border px-3 flex items-center text-sm"
                      style={{ borderRadius: inputRadius, borderColor: data.colors.border, background: data.colors.background, color: data.colors.text.secondary }}
                    >
                      ********
                    </div>
                  </div>
                  <Button className="w-full" style={{ background: primary, borderRadius: inputRadius }}>
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold" style={{ color: data.colors.text.primary }}>Dashboard</h2>
                  <Button style={{ background: primary, borderRadius: inputRadius }}>New Project</Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {["Total Projects", "Active", "Completed"].map((stat, i) => (
                    <Card key={stat} style={{ background: data.colors.surface, borderColor: data.colors.border }}>
                      <CardContent className="pt-6">
                        <p className="text-sm" style={{ color: data.colors.text.secondary }}>{stat}</p>
                        <p className="text-3xl font-bold" style={{ color: primary }}>{STAT_VALUES[i]}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card style={{ background: data.colors.surface, borderColor: data.colors.border }}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 rounded-lg border"
                          style={{ borderColor: data.colors.border }}
                        >
                          <div>
                            <p className="font-medium" style={{ color: data.colors.text.primary }}>{brandName} System {i}</p>
                            <p className="text-sm" style={{ color: data.colors.text.secondary }}>Updated 2 days ago</p>
                          </div>
                          <div className="h-6 w-16 rounded" style={{ backgroundColor: data.colors.neutral[100] }} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="landing" className="mt-6">
              <div className="text-center space-y-8 py-12">
                <div
                  className="inline-flex px-4 py-1.5 rounded-full border text-sm"
                  style={{ borderColor: data.colors.border, color: data.colors.text.secondary }}
                >
                  {tagline}
                </div>
                <h1
                  className="text-5xl font-bold tracking-tight"
                  style={{ fontFamily: headingFont, color: data.colors.text.primary }}
                >
                  Welcome to {brandName}
                </h1>
                <p className="text-lg mx-auto max-w-xl" style={{ color: data.colors.text.secondary }}>
                  {tagline}
                </p>
                <Button size="lg" style={{ background: primary, borderRadius: inputRadius }}>
                  Get Started Free
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="mt-6">
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { name: "Free", price: "$0", features: ["1 project"] },
                  { name: "Pro", price: "$19", features: ["Unlimited projects"] },
                  { name: "Team", price: "$49", features: ["Team workspace"] },
                ].map(({ name, price, features }) => (
                  <Card key={name} style={{ background: data.colors.surface, borderColor: data.colors.border }}>
                    <CardContent className="pt-6 text-center space-y-4">
                      <h3 className="font-semibold text-lg" style={{ color: data.colors.text.primary }}>{name}</h3>
                      <p className="text-3xl font-bold" style={{ color: primary }}>
                        {price}
                        <span className="text-base font-normal" style={{ color: data.colors.text.secondary }}>/mo</span>
                      </p>
                      <ul className="space-y-2">
                        {features.map((f) => (
                          <li key={f} className="text-sm" style={{ color: data.colors.text.secondary }}>{f}</li>
                        ))}
                      </ul>
                      <Button className="w-full" variant="outline" style={{ borderRadius: inputRadius, borderColor: data.colors.border }}>
                        Choose {name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <PreviewContent />
    </Suspense>
  )
}
