"use client"

import { useEffect, useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft, ArrowRight, Loader2, Palette, Sparkles, Target, Layers,
  SlidersHorizontal, Monitor, Check, CheckCircle2, Upload, Globe, Building2,
  Tag, Users, Flag, Heart, LayoutGrid, BadgeCheck,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { hueOf, hslToHex, satOf } from "@/lib/color"

const INDUSTRIES = [
  "Technology", "Software / SaaS", "Healthcare", "Finance", "Education",
  "Retail / E-commerce", "Creative", "Corporate", "Real Estate", "Travel", "Other",
]

const PERSONALITIES = [
  "Modern", "Minimal", "Premium", "Luxury", "Friendly", "Corporate",
  "Professional", "Bold", "Creative", "Playful", "Elegant", "Innovative",
  "Trustworthy", "Approachable",
]

const VOICES = ["Professional", "Friendly", "Innovative", "Playful", "Luxury", "Minimal", "Corporate", "Bold"]

const COLOR_PRESETS = [
  { name: "Indigo", primary: "#4F46E5", secondary: "#3B82F6", accent: "#7C3AED" },
  { name: "Ocean", primary: "#0EA5E9", secondary: "#06B6D4", accent: "#3B82F6" },
  { name: "Emerald", primary: "#059669", secondary: "#10B981", accent: "#0D9488" },
  { name: "Sunset", primary: "#EA580C", secondary: "#F59E0B", accent: "#E11D48" },
  { name: "Rose", primary: "#E11D48", secondary: "#F43F5E", accent: "#7C3AED" },
  { name: "Midnight", primary: "#1E293B", secondary: "#334155", accent: "#4F46E5" },
]

const THEMES = ["Light", "Dark", "Both"]
const VISUAL_STYLES = ["Minimal", "Modern", "Material", "Glassmorphism", "Flat", "Corporate", "Luxury"]
const FONT_PAIRINGS = [
  { value: "Inter + Playfair Display", desc: "Sans body + serif editorial headings" },
  { value: "Inter Only", desc: "Clean, uniform interface engine" },
  { value: "Space Grotesk + Inter", desc: "Modern geometric headings + sans body" },
  { value: "System UI", desc: "Native system fonts, zero loading cost" },
]
const DENSITIES = ["Compact", "Comfortable", "Spacious"]
const RADII = ["Sharp", "Small", "Medium", "Large", "Rounded"]
const ICON_STYLES = ["Outline", "Filled", "Duotone"]
const PLATFORMS = [
  "Responsive Web", "Mobile App", "Desktop App", "Dashboard / Admin",
  "Marketing Site", "E-commerce", "Enterprise Console",
]
const COMPONENT_SCOPE = [
  { value: "Form Elements", desc: "Inputs, selects, checkboxes, toggles" },
  { value: "Buttons", desc: "Variants, states, sizes, anatomy" },
  { value: "Containers & Feedback", desc: "Cards, modals, toasts, alerts" },
  { value: "Navigation", desc: "Top bar, sidebar, menus, steppers" },
  { value: "Data Display", desc: "Tables, charts, data viz" },
]
const ACCESSIBILITY = ["WCAG AA", "WCAG AAA"]

const STEPS = [
  { num: "01", label: "Brand Identity", icon: Sparkles },
  { num: "02", label: "Audience & Goals", icon: Target },
  { num: "03", label: "Personality", icon: Palette },
  { num: "04", label: "Brand Assets", icon: Layers },
  { num: "05", label: "Design Preferences", icon: SlidersHorizontal },
  { num: "06", label: "Platforms & Scope", icon: Monitor },
]

type BrandInfo = {
  brandName: string
  companyName: string
  tagline: string
  industry: string
  companyDescription: string
  websiteUrl: string
  targetAudience: string
  businessGoals: string
  brandValues: string
  keywords: string
  brandPersonality: string[]
  brandVoice: string
}

type BrandAssets = {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logo: File | null
}

type Preferences = {
  theme: string
  visualStyle: string
  fontPairing: string
  spacingDensity: string
  borderRadius: string
  iconStyle: string
  accessibility: string
  platforms: string[]
  componentsScope: string[]
  includeDataViz: boolean
}

function suggestPalette(primary: string): { secondary: string; accent: string } {
  const h = hueOf(primary)
  const s = satOf(primary)
  return {
    secondary: hslToHex(h + 30, Math.min(100, Math.max(35, s * 0.85)), 46),
    accent: hslToHex(h + 180, Math.min(100, Math.max(40, s * 1.05)), 52),
  }
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all",
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card text-muted-foreground border-input hover:border-primary/50 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function ChipGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o} selected={value === o} onClick={() => onChange(o)}>
          {o}
        </Chip>
      ))}
    </div>
  )
}

function MultiChipGroup({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  function toggle(o: string) {
    onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o} selected={value.includes(o)} onClick={() => toggle(o)}>
          {value.includes(o) && <CheckCircle2 className="h-3 w-3" />}
          {o}
        </Chip>
      ))}
    </div>
  )
}

function ScopeChip({ selected, title, desc, onClick }: { selected: boolean; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left p-4 rounded-xl border transition-all",
        selected ? "bg-primary/5 border-primary/60 shadow-sm" : "bg-card border-input hover:border-primary/40"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{title}</p>
        {selected && <Check className="h-4 w-4 text-primary" />}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </button>
  )
}

function StepRail({ current, onSelect, canNavigate }: { current: number; onSelect: (s: number) => void; canNavigate: (s: number) => boolean }) {
  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-1">
        {STEPS.map((step, i) => {
          const num = i + 1
          const active = current === num
          const complete = num < current
          const Icon = step.icon
          return (
            <button
              key={step.num}
              type="button"
              onClick={() => canNavigate(num) && onSelect(num)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                active ? "bg-primary/10" : "hover:bg-muted",
                !canNavigate(num) && "cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  active ? "bg-primary text-primary-foreground" : complete ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {complete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className={cn("text-[10px] font-semibold tracking-widest", active ? "text-primary" : "text-muted-foreground")}>
                  {step.num} — {step.label.toUpperCase()}
                </p>
                <p className={cn("text-sm font-medium truncate", active ? "text-foreground" : "text-muted-foreground")}>
                  {STEP_TITLES[num]}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const STEP_TITLES: Record<number, string> = {
  1: "Tell us who you are",
  2: "Who are you building for",
  3: "How should it feel",
  4: "Your colors & logo",
  5: "Visual system preferences",
  6: "Where it will live",
}

function CreateForm() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [loadingProject, setLoadingProject] = useState(!!editId)

  const [brandInfo, setBrandInfo] = useState<BrandInfo>({
    brandName: "",
    companyName: "",
    tagline: "",
    industry: "",
    companyDescription: "",
    websiteUrl: "",
    targetAudience: "",
    businessGoals: "",
    brandValues: "",
    keywords: "",
    brandPersonality: [],
    brandVoice: "Professional",
  })

  const [brandAssets, setBrandAssets] = useState<BrandAssets>({
    primaryColor: "#4F46E5",
    secondaryColor: "#3B82F6",
    accentColor: "#7C3AED",
    logo: null,
  })

  const [preferences, setPreferences] = useState<Preferences>({
    theme: "Light",
    visualStyle: "Modern",
    fontPairing: "Inter + Playfair Display",
    spacingDensity: "Comfortable",
    borderRadius: "Medium",
    iconStyle: "Outline",
    accessibility: "WCAG AA",
    platforms: ["Responsive Web"],
    componentsScope: ["Form Elements", "Buttons", "Containers & Feedback", "Navigation", "Data Display"],
    includeDataViz: true,
  })

  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (editId) {
      fetch(`/api/projects/${editId}`)
        .then((res) => res.json())
        .then((project) => {
          if (project.designData) {
            const data = typeof project.designData === "string" ? JSON.parse(project.designData) : project.designData
            setBrandInfo((prev) => ({
              ...prev,
              brandName: data.brandFoundation?.brandName || project.brandName || "",
              companyName: data.brandFoundation?.companyName || "",
              tagline: data.brandFoundation?.tagline || "",
              industry: data.brandFoundation?.industry || "",
              companyDescription: data.brandFoundation?.description || "",
              websiteUrl: data.brandFoundation?.websiteUrl || "",
              targetAudience: data.brandFoundation?.targetAudience || "",
              businessGoals: data.brandFoundation?.businessGoals || "",
              brandValues: data.brandFoundation?.values?.join(", ") || "",
              keywords: data.brandFoundation?.keywords?.join(", ") || "",
              brandPersonality: data.brandFoundation?.personality || [],
              brandVoice: data.brandFoundation?.voiceName || "Professional",
            }))
            if (data.tokens?.colors) {
              setBrandAssets((prev) => ({
                ...prev,
                primaryColor: data.tokens.colors.primary || "#4F46E5",
                secondaryColor: data.tokens.colors.secondary || "#3B82F6",
                accentColor: data.tokens.colors.accent || "#7C3AED",
              }))
            }
            if (data.tokens?.typography) {
              setPreferences((prev) => ({
                ...prev,
                theme: data.tokens?.theme || "Light",
                visualStyle: project.visualStyle || "Modern",
                fontPairing: detectFontPairing(data.tokens.typography),
                spacingDensity: data.spacingLayout?.density || "Comfortable",
                borderRadius: data.tokens?.radius === "0px" ? "Sharp" :
                              data.tokens?.radius === "4px" ? "Small" :
                              data.tokens?.radius === "8px" ? "Medium" :
                              data.tokens?.radius === "12px" ? "Large" : "Rounded",
                iconStyle: data.tokens?.iconography?.style || "Outline",
                accessibility: data.accessibility?.level || "WCAG AA",
              }))
            }
          }
        })
        .catch(() => toast.error("Failed to load project data"))
        .finally(() => setLoadingProject(false))
    }
  }, [editId])

  function detectFontPairing(t: { fontFamily?: string; headingFont?: string }) {
    const ff = t.fontFamily || ""
    const hf = t.headingFont || ""
    if (hf.includes("Playfair")) return "Inter + Playfair Display"
    if (ff.includes("Space Grotesk")) return "Space Grotesk + Inter"
    if (ff.includes("Inter") && !hf.includes("Playfair")) return "Inter Only"
    return "System UI"
  }

  function validateStep(s: number): boolean {
    const e: Record<string, boolean> = {}
    if (s === 1) {
      if (!brandInfo.brandName.trim()) e.brandName = true
      if (!brandInfo.industry) e.industry = true
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function goNext() {
    if (!validateStep(step)) {
      toast.error("Please fill the required fields marked with *")
      return
    }
    setStep((s) => Math.min(s + 1, 6))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      const body = { brandInfo, brandAssets, preferences }
      const url = editId ? `/api/generate?edit=${editId}` : "/api/generate"
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Generation failed")
      const project = await res.json()
      toast.success("Design system generated!")
      router.push(`/project/${project.id}`)
    } catch {
      toast.error("Failed to generate design system")
    } finally {
      setGenerating(false)
    }
  }

  if (status === "loading" || loadingProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "unauthenticated") redirect("/login")

  const activeStep = STEPS[step - 1]
  const progress = Math.round((step / STEPS.length) * 100)

  return (
    <div className="flex-1">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Palette className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Design System Generator</span>
          </div>
          <div className="flex items-center gap-3">
            {editId && <Badge variant="secondary">Editing</Badge>}
            <span className="text-xs text-muted-foreground hidden sm:inline">Step {step} of 6</span>
            <ThemeToggle />
          </div>
        </div>
        <div className="h-0.5 bg-muted">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-10 py-10 w-full">
        <div className="flex gap-8 lg:gap-12">
          <StepRail current={step} onSelect={(s) => { setErrors({}); setStep(s) }} canNavigate={() => true} />

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1.5">
                {activeStep.num} — {activeStep.label}
              </p>
              <h1 className="text-2xl font-bold">{STEP_TITLES[step]}</h1>
              <Separator className="mt-4" />
            </div>

            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-6 md:p-8 space-y-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                      <Field label="Brand Name *">
                        <div className="relative">
                          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={brandInfo.brandName}
                            onChange={(e) => setBrandInfo({ ...brandInfo, brandName: e.target.value })}
                            placeholder="Acme"
                            className={cn("pl-9", errors.brandName && "border-destructive")}
                          />
                        </div>
                      </Field>
                      <Field label="Company Name">
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={brandInfo.companyName}
                            onChange={(e) => setBrandInfo({ ...brandInfo, companyName: e.target.value })}
                            placeholder="Acme Inc."
                            className="pl-9"
                          />
                        </div>
                      </Field>
                      <Field label="Tagline">
                        <Input
                          value={brandInfo.tagline}
                          onChange={(e) => setBrandInfo({ ...brandInfo, tagline: e.target.value })}
                          placeholder="A short, memorable phrase"
                        />
                      </Field>
                    </div>

                    <Field label="Industry *">
                      <ChipGroup
                        options={INDUSTRIES}
                        value={brandInfo.industry}
                        onChange={(v) => setBrandInfo({ ...brandInfo, industry: v })}
                      />
                      {errors.industry && <p className="text-xs text-destructive mt-1">Please select an industry</p>}
                    </Field>

                    <div className="grid md:grid-cols-2 gap-5">
                      <Field label="Company Description" hint="2-3 sentences">
                        <Textarea
                          value={brandInfo.companyDescription}
                          onChange={(e) => setBrandInfo({ ...brandInfo, companyDescription: e.target.value })}
                          placeholder="Describe your company, what you do, and what makes you different..."
                          rows={3}
                        />
                      </Field>
                      <Field label="Website URL">
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={brandInfo.websiteUrl}
                            onChange={(e) => setBrandInfo({ ...brandInfo, websiteUrl: e.target.value })}
                            placeholder="https://acme.com"
                            className="pl-9"
                          />
                        </div>
                      </Field>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                      <Field label="Target Audience">
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={brandInfo.targetAudience}
                            onChange={(e) => setBrandInfo({ ...brandInfo, targetAudience: e.target.value })}
                            placeholder="Developers, Designers, Enterprise buyers..."
                            className="pl-9"
                          />
                        </div>
                      </Field>

                      <Field label="Brand Values" hint="comma separated">
                        <div className="relative">
                          <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={brandInfo.brandValues}
                            onChange={(e) => setBrandInfo({ ...brandInfo, brandValues: e.target.value })}
                            placeholder="Trust, Innovation, Quality..."
                            className="pl-9"
                          />
                        </div>
                      </Field>

                      <Field label="Keywords" hint="comma separated">
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={brandInfo.keywords}
                            onChange={(e) => setBrandInfo({ ...brandInfo, keywords: e.target.value })}
                            placeholder="fast, secure, scalable..."
                            className="pl-9"
                          />
                        </div>
                      </Field>
                    </div>

                    <Field label="Business Goals" hint="What should the product achieve?">
                      <div className="relative">
                        <Flag className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          value={brandInfo.businessGoals}
                          onChange={(e) => setBrandInfo({ ...brandInfo, businessGoals: e.target.value })}
                          placeholder="e.g. Reduce onboarding time, increase conversion, unify the platform..."
                          rows={3}
                          className="pl-9"
                        />
                      </div>
                    </Field>

                    <Field label="Brand Voice" hint="How should your brand sound?">
                      <ChipGroup
                        options={VOICES}
                        value={brandInfo.brandVoice}
                        onChange={(v) => setBrandInfo({ ...brandInfo, brandVoice: v })}
                      />
                    </Field>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <Field label="Brand Personality" hint="select all that apply">
                      <MultiChipGroup
                        options={PERSONALITIES}
                        value={brandInfo.brandPersonality}
                        onChange={(v) => setBrandInfo({ ...brandInfo, brandPersonality: v })}
                      />
                    </Field>

                    <div>
                      <p className="text-sm font-medium mb-3">Color Mood</p>
                      <p className="text-xs text-muted-foreground mb-3">Pick a starting palette — you can fine-tune colors in the next step.</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {COLOR_PRESETS.map((preset) => {
                          const active = brandAssets.primaryColor === preset.primary && brandAssets.secondaryColor === preset.secondary && brandAssets.accentColor === preset.accent
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() =>
                                setBrandAssets({ ...brandAssets, primaryColor: preset.primary, secondaryColor: preset.secondary, accentColor: preset.accent })
                              }
                              className={cn(
                                "p-3 rounded-xl border text-left transition-all",
                                active ? "border-primary/60 ring-2 ring-primary/20" : "border-input hover:border-primary/40"
                              )}
                            >
                              <div className="flex gap-1.5 mb-2">
                                <div className="h-6 w-6 rounded-md" style={{ backgroundColor: preset.primary }} />
                                <div className="h-6 w-6 rounded-md" style={{ backgroundColor: preset.secondary }} />
                                <div className="h-6 w-6 rounded-md" style={{ backgroundColor: preset.accent }} />
                              </div>
                              <p className="text-sm font-medium">{preset.name}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Brand Colors</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const suggested = suggestPalette(brandAssets.primaryColor)
                          setBrandAssets((prev) => ({ ...prev, ...suggested }))
                          toast.success("Palette suggested from your primary color")
                        }}
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Suggest matching palette
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                      {(["primaryColor", "secondaryColor", "accentColor"] as const).map((key) => (
                        <Field
                          key={key}
                          label={key === "primaryColor" ? "Primary Color" : key === "secondaryColor" ? "Secondary Color" : "Accent Color"}
                          hint={key === "primaryColor" ? "main actions" : key === "secondaryColor" ? "highlights" : "special states"}
                        >
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={brandAssets[key]}
                              onChange={(e) => setBrandAssets({ ...brandAssets, [key]: e.target.value })}
                              className="h-10 w-10 rounded-lg border cursor-pointer"
                            />
                            <Input
                              value={brandAssets[key]}
                              onChange={(e) => setBrandAssets({ ...brandAssets, [key]: e.target.value })}
                              className="flex-1 font-mono text-sm"
                            />
                          </div>
                        </Field>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl border border-dashed bg-muted/30">
                      <p className="text-sm font-medium mb-1">Logo Upload</p>
                      <p className="text-xs text-muted-foreground mb-3">SVG or PNG recommended. Stored locally for this project.</p>
                      <label className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium cursor-pointer hover:bg-muted transition-colors">
                        <Upload className="h-4 w-4" />
                        {brandAssets.logo ? brandAssets.logo.name : "Choose a file"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setBrandAssets({ ...brandAssets, logo: e.target.files?.[0] || null })}
                        />
                      </label>
                      {brandAssets.logo && (
                        <Badge variant="secondary" className="ml-3">
                          {brandAssets.logo.size > 1048576 ? "Large file — consider a smaller image" : "Ready"}
                        </Badge>
                      )}
                    </div>

                    <div className="rounded-xl border bg-card">
                      <div className="p-4 border-b">
                        <p className="text-sm font-semibold">Live Preview</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Your palette applied to a sample button</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <button className="px-5 py-2.5 text-sm font-medium text-white rounded-lg" style={{ backgroundColor: brandAssets.primaryColor }}>
                          Primary Action
                        </button>
                        <button className="px-5 py-2.5 text-sm font-medium rounded-lg border ml-2" style={{ borderColor: brandAssets.primaryColor, color: brandAssets.primaryColor }}>
                          Secondary
                        </button>
                        <div className="flex gap-2 pt-2">
                          <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: brandAssets.primaryColor }} />
                          <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: brandAssets.secondaryColor }} />
                          <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: brandAssets.accentColor }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <Field label="Theme">
                      <ChipGroup options={THEMES} value={preferences.theme} onChange={(v) => setPreferences({ ...preferences, theme: v })} />
                    </Field>

                    <Field label="Visual Style">
                      <ChipGroup options={VISUAL_STYLES} value={preferences.visualStyle} onChange={(v) => setPreferences({ ...preferences, visualStyle: v })} />
                    </Field>

                    <Field label="Font Pairing">
                      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {FONT_PAIRINGS.map((f) => {
                          const active = preferences.fontPairing === f.value
                          return (
                            <button
                              key={f.value}
                              type="button"
                              onClick={() => setPreferences({ ...preferences, fontPairing: f.value })}
                              className={cn(
                                "text-left p-4 rounded-xl border transition-all",
                                active ? "bg-primary/5 border-primary/60" : "bg-card border-input hover:border-primary/40"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{f.value}</p>
                                {active && <Check className="h-4 w-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                            </button>
                          )
                        })}
                      </div>
                    </Field>

                    <div className="grid md:grid-cols-2 gap-5">
                      <Field label="Spacing Density">
                        <ChipGroup options={DENSITIES} value={preferences.spacingDensity} onChange={(v) => setPreferences({ ...preferences, spacingDensity: v })} />
                      </Field>
                      <Field label="Border Radius">
                        <ChipGroup options={RADII} value={preferences.borderRadius} onChange={(v) => setPreferences({ ...preferences, borderRadius: v })} />
                      </Field>
                    </div>

                    <Field label="Icon Style">
                      <ChipGroup options={ICON_STYLES} value={preferences.iconStyle} onChange={(v) => setPreferences({ ...preferences, iconStyle: v })} />
                    </Field>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6">
                    <Field label="Platforms" hint="where will this design system live?">
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {PLATFORMS.map((p) => {
                          const active = preferences.platforms.includes(p)
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() =>
                                setPreferences({
                                  ...preferences,
                                  platforms: active ? preferences.platforms.filter((x) => x !== p) : [...preferences.platforms, p],
                                })
                              }
                              className={cn(
                                "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                                active ? "bg-primary/5 border-primary/60" : "bg-card border-input hover:border-primary/40"
                              )}
                            >
                              <span className="text-sm font-medium">{p}</span>
                              {active && <Check className="h-4 w-4 text-primary" />}
                            </button>
                          )
                        })}
                      </div>
                    </Field>

                    <Field label="Components & Sections" hint="what to include in your system">
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {COMPONENT_SCOPE.map((c) => (
                          <ScopeChip
                            key={c.value}
                            title={c.value}
                            desc={c.desc}
                            selected={preferences.componentsScope.includes(c.value)}
                            onClick={() =>
                              setPreferences({
                                ...preferences,
                                componentsScope: preferences.componentsScope.includes(c.value)
                                  ? preferences.componentsScope.filter((x) => x !== c.value)
                                  : [...preferences.componentsScope, c.value],
                              })
                            }
                          />
                        ))}
                      </div>
                    </Field>

                    <div className="grid md:grid-cols-2 gap-5">
                      <Field label="Accessibility Level">
                        <ChipGroup options={ACCESSIBILITY} value={preferences.accessibility} onChange={(v) => setPreferences({ ...preferences, accessibility: v })} />
                      </Field>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
                      <div className="flex items-start gap-3">
                        <BarChartIcon />
                        <div>
                          <p className="text-sm font-medium">Include Data Visualization</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Charts, categorical palette, and graph specs in your system</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.includeDataViz}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, includeDataViz: checked as boolean })}
                      />
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-5 space-y-2">
                      <p className="text-xs font-semibold tracking-widest text-primary uppercase">Summary</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="secondary">{brandInfo.brandName || "Unnamed Brand"}</Badge>
                        {brandInfo.industry && <Badge variant="secondary">{brandInfo.industry}</Badge>}
                        <Badge variant="secondary">{preferences.visualStyle}</Badge>
                        <Badge variant="secondary">{preferences.theme} mode</Badge>
                        <Badge variant="secondary">{preferences.fontPairing}</Badge>
                        {preferences.platforms.map((p) => (
                          <Badge key={p} variant="outline">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <div className="flex items-center justify-between p-6 md:p-8 border-t bg-muted/20 rounded-b-xl">
                <Button variant="outline" onClick={goBack} disabled={step === 1}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {step < 6 ? (
                  <Button onClick={goNext}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleGenerate} disabled={generating} className="min-w-48">
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="mr-2 h-4 w-4" />
                        Generate Design System
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function BarChartIcon() {
  return (
    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <LayoutGrid className="h-4 w-4 text-primary" />
    </div>
  )
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <CreateForm />
    </Suspense>
  )
}
