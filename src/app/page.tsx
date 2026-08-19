"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ComponentAssembly } from "@/components/component-assembly"
import { Logo } from "@/components/logo"
import { ArrowRight, Sparkles, Palette, Eye, Download, LayoutDashboard, Zap, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">DS Generator</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative">
              <div className="hero-scrim absolute -inset-20 pointer-events-none" aria-hidden />
              <div className="relative text-left space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm animate-[fadeUp_0.7s_ease-out_both] motion-reduce:animate-none">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>AI-Powered Design System Generator</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-[fadeUp_0.7s_ease-out_both] motion-reduce:animate-none [animation-delay:120ms]">
                  Generate a Complete Design System in Minutes
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-[fadeUp_0.7s_ease-out_both] motion-reduce:animate-none [animation-delay:240ms]">
                  Stop spending days on design systems. Enter your brand info, and let AI create a production-ready design system with colors, typography, components, and documentation.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 animate-[fadeUp_0.7s_ease-out_both] motion-reduce:animate-none [animation-delay:360ms]">
                  <Link href="/signup">
                    <Button size="lg" className="text-base group relative overflow-hidden">
                      <span className="pointer-events-none absolute inset-0 -translate-x-[150%] -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_3.2s_ease-in-out_infinite] motion-reduce:animate-none" />
                      <span className="relative">Start Generating Free</span>
                      <ArrowRight className="ml-2 h-5 w-5 relative animate-[nudge_2.4s_ease-in-out_infinite] motion-reduce:animate-none" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button variant="outline" size="lg" className="text-base">
                      See How It Works
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative w-full aspect-square min-h-56 lg:min-h-0">
              <ComponentAssembly />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete design system generator that covers every aspect of your brand identity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Palette, title: "Color System", desc: "Full color palette with primary, secondary, neutral, and semantic colors. WCAG compliant." },
              { icon: Zap, title: "Typography", desc: "Complete type scale with headings, body, captions, and responsive typography tokens." },
              { icon: LayoutDashboard, title: "Components", desc: "30+ production-ready UI components with variants, states, and accessibility built-in." },
              { icon: Eye, title: "Live Preview", desc: "See your design system applied to real screens like dashboards, landing pages, and forms." },
              { icon: Download, title: "Multi-Format Export", desc: "Export as CSS variables, Tailwind config, JSON tokens, Figma styles, and more." },
              { icon: Shield, title: "Accessibility First", desc: "Built-in WCAG AA/AAA compliance with auto-generated contrast reports." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <Icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to a complete design system.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Enter Brand Info", desc: "Tell us about your brand, industry, personality, and preferences." },
              { step: "02", title: "AI Generates System", desc: "Our AI analyzes your inputs and creates a complete design system." },
              { step: "03", title: "Edit & Export", desc: "Preview, tweak colors and tokens, then export in your preferred format." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center space-y-3">
                <div className="text-5xl font-bold text-primary/20">{step}</div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free, scale as you grow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Free", price: "$0", features: ["1 design system", "Basic export", "Preview", "Community access"] },
              { name: "Pro", price: "$19", popular: true, features: ["Unlimited systems", "All export formats", "AI generation", "Priority support"] },
              { name: "Team", price: "$49", features: ["Everything in Pro", "Team workspace", "Version history", "API access"] },
            ].map(({ name, price, popular, features }) => (
              <div key={name} className={`p-8 rounded-xl border ${popular ? "border-primary shadow-lg relative" : "bg-card"}`}>
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2">{name}</h3>
                <div className="text-3xl font-bold mb-6">{price}<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                <ul className="space-y-3 mb-8">
                  {features.map((f) => (
                    <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={popular ? "default" : "outline"}>
                  {name === "Free" ? "Get Started" : "Subscribe"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 DS Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
