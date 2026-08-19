/**
 * generator-legacy.ts — the ORIGINAL deterministic design-system engine.
 * Preserved in full so the app can always switch back to it (undo switch).
 * Pure functions only; no Next.js/prisma imports. Do not modify behavior.
 */

export function generateDesignSystem(brandInfo: any, brandAssets: any, preferences: any) {
  const p = brandAssets.primaryColor || "#4F46E5"
  const s = brandAssets.secondaryColor || "#3B82F6"
  const a = brandAssets.accentColor || "#7C3AED"
  const industry = (brandInfo.industry || "").toLowerCase()
  const personality = brandInfo.brandPersonality || []
  const visualStyle = preferences.visualStyle || "Modern"
  const platform = preferences.platform || "Responsive Web"
  const platforms = preferences.platforms?.length ? preferences.platforms : [platform]
  const density = preferences.spacingDensity || "Comfortable"
  const radiusPref = preferences.borderRadius || "Medium"
  const fontPairing = preferences.fontPairing || "Inter + Playfair Display"
  const iconStyle = preferences.iconStyle || "Outline"
  const accessibility = preferences.accessibility || "WCAG AA"
  const scope = preferences.componentsScope?.length
    ? preferences.componentsScope
    : ["Form Elements", "Buttons", "Containers & Feedback", "Navigation", "Data Display"]

  const systemName = brandInfo.brandName ? `${brandInfo.brandName} Design System` : "Design System"
  const version = "v2.0.0"
  const description = `A unified, scalable visual language powering the entire ${brandInfo.brandName || "brand"} ecosystem. Engineered for clarity, built for accessibility, and structured to accelerate product engineering from concept to ship.`
  const lastUpdated = "Generated " + new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const architecture = generateSystemArchitecture()
  const colorTokens = generateColorTokens(p, s, a)
  const colorSystem = generateColorSystem(p, s, a)
  const typographyTokens = generateTypographyTokens(personality, visualStyle, fontPairing)

  return {
    systemName,
    version,
    description,
    lastUpdated,
    brandFoundation: generateBrandFoundation(brandInfo, industry, personality),
    designPrinciples: generateDesignPrinciples(industry, personality),
    systemArchitecture: architecture,
    overview: generateOverview(systemName, description, lastUpdated, architecture),
    tokens: {
      colors: colorTokens,
      typography: typographyTokens,
      spacing: generateSpacing(density),
      radius: getRadius(radiusPref),
      radiusScale: generateRadiusScale(radiusPref),
      shadows: generateShadows(visualStyle),
      borders: { style: "solid", width: { thin: "1px", medium: "2px", thick: "4px" } },
      opacity: { low: "0.4", medium: "0.6", high: "0.8", disabled: "0.4" },
      motion: generateMotion(visualStyle),
      elevation: generateElevation(visualStyle),
      iconography: generateIconography(iconStyle),
      grid: generateGrid(),
      sizing: generateSizingTokens(),
    },
    colorSystem,
    colorSystemDoc: generateColorSystemDoc(p, s, a, colorTokens),
    typography: generateTypography(personality, visualStyle, fontPairing),
    typographyDoc: generateTypographyDoc(typographyTokens),
    spacingLayout: generateSpacingLayout(density, radiusPref),
    components: generateComponents(visualStyle, industry, scope),
    patterns: generatePatterns(industry),
    motion: { ...generateMotion(visualStyle), guidelines: generateMotionGuidelines(visualStyle) },
    dataViz: generateDataViz(p, s, a),
    accessibility: generateAccessibility(accessibility),
    documentation: generateDocumentation(brandInfo, industry, fontPairing, platforms),
  }
}

/* ============================ FOUNDATION ============================ */

function generateBrandFoundation(brandInfo: any, industry: string, personality: string[]) {
  const voiceOptions: Record<string, string> = {
    Professional: "Polished, authoritative, and concise. Command respect with every message.",
    Friendly: "Warm, approachable, and encouraging. Make users feel at ease.",
    Innovative: "Confident, forward-thinking, and precise. Speak with authority about complex topics.",
    Playful: "Energetic, witty, and expressive. Make interactions enjoyable and memorable.",
    Luxury: "Refined, understated, and aspirational. Let quality speak through restraint.",
    Minimal: "Clear, calm, and purposeful. Every word earns its place.",
    Corporate: "Trustworthy, structured, and formal. Build trust through consistency.",
    Bold: "Direct, confident, and unapologetic. Make strong statements with conviction.",
  }
  const voice =
    voiceOptions[brandInfo.brandVoice] ||
    Object.entries({
      healthcare: "Trustworthy, empathetic, and clear. Every interaction should inspire confidence and comfort.",
      technology: "Confident, innovative, and precise. Speak with authority about complex topics.",
      finance: "Professional, secure, and transparent. Build trust through clarity and reliability.",
      education: "Encouraging, knowledgeable, and accessible. Make learning feel achievable.",
      retail: "Energetic, approachable, and inspiring. Create desire through clear communication.",
      creative: "Expressive, bold, and authentic. Let personality shine through every word.",
      corporate: "Polished, authoritative, and concise. Command respect with every message.",
    }).find(([key]) => industry.includes(key))?.[1] ||
    "Professional, approachable, and authentic."

  const keywordMap: Record<string, string[]> = {
    healthcare: ["trust", "care", "wellness", "safety", "compassion", "reliability"],
    technology: ["innovation", "speed", "precision", "scalability", "cutting-edge", "efficiency"],
    finance: ["security", "trust", "growth", "stability", "transparency", "accuracy"],
    education: ["knowledge", "growth", "discovery", "accessibility", "empowerment", "progress"],
    creative: ["imagination", "expression", "originality", "beauty", "inspiration", "craft"],
    retail: ["quality", "style", "value", "convenience", "trends", "satisfaction"],
  }

  const suggestedKeywords = Object.entries(keywordMap).find(([key]) => industry.includes(key))
  const keywords = brandInfo.keywords?.split(",").map((k: string) => k.trim()).filter(Boolean) ||
    (suggestedKeywords ? suggestedKeywords[1] : ["quality", "innovation", "trust", "excellence"])

  const values = brandInfo.brandValues?.split(",").map((v: string) => v.trim()).filter(Boolean) || keywords.slice(0, 4)

  return {
    brandName: brandInfo.brandName || "Your Brand",
    companyName: brandInfo.companyName || "",
    tagline: brandInfo.tagline || "",
    description: brandInfo.companyDescription || "",
    websiteUrl: brandInfo.websiteUrl || "",
    targetAudience: brandInfo.targetAudience || "",
    businessGoals: brandInfo.businessGoals || "",
    industry: industry || "General",
    personality: personality.length > 0 ? personality : ["Professional", "Modern"],
    voice,
    voiceName: brandInfo.brandVoice || "Professional",
    voiceGuidelines: [
      "Use active voice and present tense",
      "Keep sentences concise and scannable",
      "Avoid jargon unless industry-appropriate",
      "Maintain consistent tone across all touchpoints",
      "Prefer short sentences for high-traffic interfaces",
    ],
    values,
    keywords,
    logoVariations: ["Primary Logo", "Horizontal Variant", "Stacked Variant", "Icon Only", "Monochrome"],
    logoSafeArea: "Minimum 16px padding on all sides",
    minimumLogoSize: "32px for icon, 120px for full logo",
    incorrectUsage: [
      "Do not stretch or distort the logo",
      "Do not change logo colors",
      "Do not add effects or shadows to the logo",
      "Do not place logo on low-contrast backgrounds",
      "Do not rotate the logo",
    ],
  }
}

function generateDesignPrinciples(industry: string, personality: string[]) {
  const principles: string[] = []

  if (industry.includes("healthcare") || personality.includes("Trustworthy")) {
    principles.push("Trust Through Clarity â€” Every interface element must communicate clearly and honestly.")
    principles.push("Accessibility First â€” Design for everyone, regardless of ability.")
  }
  if (industry.includes("technology") || personality.includes("Innovative")) {
    principles.push("Innovation with Purpose â€” Use modern techniques to solve real problems, not for novelty.")
    principles.push("Performance is a Feature â€” Speed and responsiveness are core to the user experience.")
  }
  if (industry.includes("finance") || personality.includes("Corporate") || personality.includes("Professional")) {
    principles.push("Precision in Every Pixel â€” Attention to detail builds credibility.")
    principles.push("Consistency Creates Trust â€” Uniform patterns and behaviors across the entire system.")
  }
  if (personality.includes("Minimal") || personality.includes("Modern")) {
    principles.push("Less is More â€” Remove unnecessary elements. Every component should earn its place.")
    principles.push("Content First â€” Design around content, not the other way around.")
  }
  if (personality.includes("Friendly") || personality.includes("Playful")) {
    principles.push("Delight Without Distraction â€” Micro-interactions and animations should enhance, not hinder.")
    principles.push("Human-Centered â€” Design with empathy and warmth.")
  }
  if (personality.includes("Luxury") || personality.includes("Premium") || personality.includes("Elegant")) {
    principles.push("Quality Over Quantity â€” Fewer, better-designed elements create a premium feel.")
    principles.push("Refined Minimalism â€” Every element must serve a purpose with elegance.")
  }
  if (personality.includes("Bold") || personality.includes("Creative")) {
    principles.push("Bold by Design â€” Make confident choices that stand out.")
    principles.push("Embrace White Space â€” Let design breathe with intentional spacing.")
  }

  principles.push("Reduce Cognitive Load â€” Present information in digestible, scannable chunks.")
  principles.push("Design for Real Users â€” Base decisions on user needs, not assumptions.")

  return [...new Set(principles)]
}

function generateSystemArchitecture() {
  return {
    description: "How design ingredients combine to build comprehensive experiences.",
    layers: [
      { name: "Design Tokens", contents: "Variables: Color, Typography, Spacing", role: "Atomic values consumed across the entire system" },
      { name: "Foundation", contents: "Gradients, Icons, Base Grid rules", role: "Reusable primitives and structural rules" },
      { name: "Components", contents: "Buttons, Inputs, Badges, Toggles", role: "Composed UI building blocks" },
      { name: "Patterns", contents: "Forms, Headers, Tables, Lists", role: "Standard layouts assembled from components" },
      { name: "Templates", contents: "Standard Screen Scaffolding", role: "Full page structures ready for implementation" },
    ],
    whenToUse: "The system is mandatory for all core application modules, official customer-facing consoles, and admin tooling. It ensures standard branding, streamlines QA passes, and keeps technical debt minimized. Use template structures directly where possible.",
    exceptions: "One-off marketing microsites or highly specialized heavy data visualizations may request a partial fork. Core interaction components (inputs, authentication, shell navigation) must still respect standard base tokens to maintain layout integrity.",
  }
}

const OVERVIEW_ARCH_BACKGROUNDS = ["#F8FAFC", "#E0E7FF", "#C7D2FE", "#818CF8", "#4F46E5"]
const OVERVIEW_ARCH_COLORS = ["#0F172A", "#4F46E5", "#3730A3", "#FFFFFF", "#FFFFFF"]

function generateOverview(systemName: string, description: string, lastUpdated: string, architecture: { layers: { name: string; contents: string }[]; whenToUse: string; exceptions: string }) {
  const brandName = systemName.replace(/ Design System$/, "") || "Apex"
  return {
    title: "Overview & Design Principles",
    hero: {
      tag: "ENTERPRISE SYSTEM",
      headline: `${brandName} Design System`,
      description,
    },
    principles: [
      { title: "Consistency", icon: "Repeat2", description: "Predictable journeys make systems intuitive. Components must behave uniformly across all application contexts." },
      { title: "Accessibility", icon: "Accessibility", description: "Inclusive design from root variables. AA/AAA compliance as our floor, ensuring usable interfaces for everyone." },
      { title: "Scalability", icon: "Maximize", description: "Build once, deploy everywhere. Tokenized structure accommodates dynamic growth and multi-platform expansion." },
      { title: "Clarity", icon: "Info", description: "Maximize signal, minimize noise. Clean hierarchy, balanced spacing, and purposeful color routing over aesthetics." },
      { title: "Efficiency", icon: "Zap", description: "Optimized developer-to-designer handoff. Standardized slots, variables, and components speed implementation." },
      { title: "Delight", icon: "Star", description: "Subtle animations, rounded details, and premium typographic pairing that turns utility into joy." },
    ],
    architectureSteps: architecture.layers.map((layer: { name: string; contents: string }, i: number) => ({
      step: i + 1,
      name: layer.name,
      contents: layer.contents,
      background: OVERVIEW_ARCH_BACKGROUNDS[i] || "#F8FAFC",
      color: OVERVIEW_ARCH_COLORS[i] || "#0F172A",
    })),
    whenToUse: architecture.whenToUse,
    exceptions: architecture.exceptions,
    footerLeft: `${systemName} â€” Exhaustive Reference Documentation`,
    footerRight: "Last Updated: " + lastUpdated.replace(/^Generated\s+/, ""),
  }
}

/* ============================ COLOR ============================ */

function generateColorTokens(p: string, s: string, a: string) {
  return {
    primary: p,
    primaryLight: lighten(p, 25),
    primaryLighter: lighten(p, 40),
    primaryDark: darken(p, 20),
    primaryDarker: darken(p, 35),
    secondary: s,
    secondaryLight: lighten(s, 25),
    secondaryLighter: lighten(s, 40),
    secondaryDark: darken(s, 20),
    secondaryDarker: darken(s, 35),
    accent: a,
    accentLight: lighten(a, 25),
    accentDark: darken(a, 20),
    neutral: generateBrandNeutral(p),
    semantic: {
      success: s,
      successBg: lighten(s, 38),
      successBorder: lighten(s, 22),
      warning: a,
      warningBg: lighten(a, 42),
      warningBorder: lighten(a, 25),
      error: darken(a, 25),
      errorBg: lighten(a, 46),
      errorBorder: lighten(a, 28),
      info: p,
      infoBg: lighten(p, 40),
      infoBorder: lighten(p, 22),
    },
    backgrounds: { primary: "#ffffff", secondary: "#F8FAFC", tertiary: "#F1F5F9", elevated: "#ffffff" },
    surfaces: { card: "#ffffff", sheet: "#ffffff", dialog: "#ffffff", tooltip: darken(p, 60) },
    borders: { light: "#E2E8F0", medium: "#CBD5E1", heavy: "#94A3B8" },
    text: { primary: "#0F172A", secondary: "#475569", tertiary: "#94A3B8", inverse: "#ffffff", link: p },
    interactive: {
      default: p,
      hover: darken(p, 10),
      active: darken(p, 20),
      disabled: "#CBD5E1",
      focus: `0 0 0 3px ${lighten(p, 50)}`,
    },
    chartPalette: [p, s, a, darken(p, 25), lighten(s, 30), darken(a, 25), lighten(p, 45), darken(s, 35)],
  }
}

function generateColorSystem(p: string, s: string, a: string) {
  const cs = generateColorTokens(p, s, a)
  return {
    description: "A complete, accessible color system designed for consistency and clarity.",
    usage: "Use semantic colors for their intended purposes. Use the neutral slate scale for backgrounds, borders, and text hierarchy.",
    do: [
      "Use primary color for main actions and key interactive elements",
      "Use semantic colors consistently (success for positive, error for destructive)",
      "Maintain sufficient contrast ratios (4.5:1 minimum for text)",
      "Use the chart palette exclusively for data visualizations",
    ],
    dont: [
      "Don't use primary color for error states",
      "Don't mix multiple accent colors without clear hierarchy",
      "Don't rely on color alone to convey information",
      "Don't route primary brand color to denote critical warnings or missing inputs",
    ],
    colorBlindSafe: true,
    contrastReport: {
      "Primary on White": "7.1:1 (AAA)",
      "Primary on Black": "8.2:1 (AAA)",
      "Text on Background": "12.5:1 (AAA)",
      "Secondary Text on Background": "7.8:1 (AAA)",
      "White on Primary": "4.8:1 (AA)",
      "Body on Surface": "10.2:1 (AAA)",
    },
    lightSurfaceReport: [
      { sample: "Info Text", ratio: "AA Pass (4.8:1)" },
      { sample: "Regular Body", ratio: "AAA Pass (7.1:1)" },
      { sample: "Light Alert", ratio: "Fail (2.1:1)" },
    ],
    darkSurfaceReport: [
      { sample: "White Heading", ratio: "AAA Pass (10.2:1)" },
      { sample: "Slate Text", ratio: "AA Pass (6.4:1)" },
      { sample: "Muted Gray", ratio: "Fail (3.3:1)" },
    ],
    shades: generateShades(cs),
  }
}

function generateShades(cs: any) {
  return [
    { name: "Primary 100", hex: cs.primaryLighter, usage: "Light backgrounds, hover states" },
    { name: "Primary 200", hex: cs.primaryLight, usage: "Selected states, badges" },
    { name: "Primary 500", hex: cs.primary, usage: "Main actions, links, active indicators" },
    { name: "Primary 700", hex: cs.primaryDark, usage: "Hover states for primary elements" },
    { name: "Primary 900", hex: cs.primaryDarker, usage: "Active/pressed states" },
    { name: "Neutral 100", hex: cs.neutral[100], usage: "Page backgrounds" },
    { name: "Neutral 200", hex: cs.neutral[200], usage: "Card borders, dividers" },
    { name: "Neutral 700", hex: cs.neutral[700], usage: "Secondary text" },
    { name: "Neutral 900", hex: cs.neutral[900], usage: "Primary text" },
  ]
}

function hexToRgbHsl(hex: string) {
  const [r, g, b] = hexToRgbArray(hex)
  const { h, s, l } = rgbToHslNumbers(r, g, b)
  return {
    rgb: `${r} ${g} ${b}`,
    hsl: `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`,
  }
}

function generateColorSystemDoc(
  p: string,
  s: string,
  a: string,
  colorTokens: { primary: string; secondary: string; accent: string; neutral: Record<string, string>; semantic: Record<string, string> }
) {
  const primary = colorTokens.primary || p
  const secondary = colorTokens.secondary || s
  const accent = colorTokens.accent || a
  const neutral = generateBrandNeutral(primary)
  const order = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]

  const semantic = {
    success: secondary,
    successBg: lighten(secondary, 38),
    successBorder: lighten(secondary, 22),
    successDark: darken(secondary, 32),
    warning: accent,
    warningBg: lighten(accent, 42),
    warningBorder: lighten(accent, 25),
    warningDark: darken(accent, 30),
    error: darken(accent, 25),
    errorBg: lighten(accent, 46),
    errorBorder: lighten(accent, 28),
    errorDark: darken(accent, 40),
    info: primary,
    infoBg: lighten(primary, 40),
    infoBorder: lighten(primary, 22),
    infoDark: darken(primary, 30),
  }

  return {
    title: "Color System",
    primaryBrand: [
      { name: "Indigo Primary", hex: primary, ...hexToRgbHsl(primary), description: "Interactive primary action buttons, active navigation" },
      { name: "Blue Brand", hex: secondary, ...hexToRgbHsl(secondary), description: "Informational states, highlights, interactive accents" },
      { name: "Violet Accent", hex: accent, ...hexToRgbHsl(accent), description: "Promo paths, secondary premium features, specialized states" },
    ],
    secondaryHighlights: [
      { name: "Primary Highlight", hex: primary },
      { name: "Secondary Highlight", hex: secondary },
      { name: "Accent Highlight", hex: accent },
      { name: "Deep Primary", hex: darken(primary, 22) },
    ],
    neutral: order.map((key) => ({ weight: key, hex: neutral[key] })).filter((n) => n.hex),
    semanticColors: [
      { name: "Success State", label: "Positive actions / successful operations", tint: semantic.successBg, base: semantic.success, dark: semantic.successDark },
      { name: "Warning State", label: "Requires user caution", tint: semantic.warningBg, base: semantic.warning, dark: semantic.warningDark },
      { name: "Error State", label: "Destructive choices / errors", tint: semantic.errorBg, base: semantic.error, dark: semantic.errorDark },
      { name: "Info State", label: "Neutral advice & hints", tint: semantic.infoBg, base: semantic.info, dark: semantic.infoDark },
    ],
    accessibility: {
      light: [
        { sample: "Info Text", ratio: contrastLabel(contrastRatio(semantic.infoDark, "#FFFFFF")) },
        { sample: "Regular Body", ratio: contrastLabel(contrastRatio(neutral[900], "#FFFFFF")) },
        { sample: "Light Alert", ratio: contrastLabel(contrastRatio(semantic.successBg, "#FFFFFF")) },
      ],
      dark: [
        { sample: "White Heading", ratio: contrastLabel(contrastRatio("#FFFFFF", neutral[800])) },
        { sample: "Slate Text", ratio: contrastLabel(contrastRatio(neutral[400], neutral[800])) },
        { sample: "Muted Gray", ratio: contrastLabel(contrastRatio(neutral[600], neutral[800])) },
      ],
    },
    guidelines: {
      do: `Ensure warning highlights utilize designated ${semantic.warning} variables stacked with ${semantic.warningDark} text colors to maintain WCAG compliant readability patterns.`,
      dont: `Do not route primary branding (${primary}) to denote critical warnings or missing inputs, which confuses global state categorization guidelines.`,
    },
  }
}

/* ============================ TYPOGRAPHY ============================ */

function pickFonts(fontPairing: string) {  const pairing = (fontPairing || "").toLowerCase()
  if (pairing.includes("playfair")) {
    return {
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      headingFont: "'Playfair Display', Georgia, 'Times New Roman', serif",
      monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    }
  }
  if (pairing.includes("space grotesk")) {
    return {
      fontFamily: "'Space Grotesk', Inter, -apple-system, sans-serif",
      headingFont: "'Space Grotesk', Inter, -apple-system, sans-serif",
      monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    }
  }
  if (pairing.includes("serif")) {
    return {
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      headingFont: "'Playfair Display', Georgia, serif",
      monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    }
  }
  return {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headingFont: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    monoFont: "'JetBrains Mono', 'Fira Code', monospace",
  }
}

function generateTypographyTokens(personality: string[], visualStyle: string, fontPairing: string) {
  const { fontFamily, headingFont, monoFont } = pickFonts(fontPairing)
  return {
    fontFamily,
    headingFont,
    monoFont,
    scale: {
      display: { size: "4rem", lineHeight: "1.1", weight: "800", letterSpacing: "-0.02em" },
      h1: { size: "3rem", lineHeight: "1.17", weight: "700", letterSpacing: "-0.02em" },
      h2: { size: "2.25rem", lineHeight: "1.22", weight: "600", letterSpacing: "-0.01em" },
      h3: { size: "1.875rem", lineHeight: "1.27", weight: "600", letterSpacing: "-0.005em" },
      h4: { size: "1.5rem", lineHeight: "1.33", weight: "600", letterSpacing: "0" },
      h5: { size: "1.25rem", lineHeight: "1.4", weight: "600", letterSpacing: "0" },
      bodyLarge: { size: "1.125rem", lineHeight: "1.44", weight: "400", letterSpacing: "0" },
      body: { size: "1rem", lineHeight: "1.5", weight: "400", letterSpacing: "0" },
      bodySmall: { size: "0.875rem", lineHeight: "1.43", weight: "400", letterSpacing: "0" },
      caption: { size: "0.75rem", lineHeight: "1.33", weight: "500", letterSpacing: "0.01em" },
      overline: { size: "0.75rem", lineHeight: "1.17", weight: "600", letterSpacing: "0.08em", textTransform: "uppercase" },
    },
    weights: { thin: 100, light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    tracking: { compact: "-0.02em", default: "0", wide: "0.08em" },
  }
}

function generateTypography(personality: string[], visualStyle: string, fontPairing: string) {
  const t = generateTypographyTokens(personality, visualStyle, fontPairing)
  return {
    ...t,
    description: "A carefully crafted type scale optimized for reading pacing and application interface density.",
    usage: "Use the defined scale for all text elements. Maintain hierarchy for clear communication.",
    fontFamilies: [
      { name: "Inter (Sans-Serif)", role: "Primary / Interface Engine", sample: "AbCdEfGhIjKlMnOpQrStUvWxYz 1234567890" },
      { name: "Playfair Display (Serif)", role: "Secondary / Editorial & display", sample: "AbCdEfGhIjKlMnOpQrStUvWxYz 1234567890" },
      { name: "JetBrains Mono (Monospace)", role: "System / Code & analytical metrics", sample: "const token_id = '#4F46E5';" },
    ],
    do: [
      "Use display for hero sections and marketing pages only",
      "Maintain consistent heading hierarchy (h1 â†’ h2 â†’ h3, never skip levels)",
      "Use bodyLarge for featured content and lead paragraphs",
      "Use overline for section labels and metadata",
    ],
    dont: [
      "Don't use display for body content or UI text",
      "Don't mix font families within the same component hierarchy",
      "Don't use letter-spacing on lowercase text",
      "Don't scale font sizes arbitrarily â€” use the defined scale",
    ],
    responsive: {
      mobile: { h1: "2rem", h2: "1.5rem", body: "0.9375rem" },
      tablet: { h1: "2.5rem", h2: "1.75rem", body: "1rem" },
      desktop: { h1: "3rem", h2: "2.25rem", body: "1rem" },
    },
    webSafeFallbacks: ["system-ui", "-apple-system", "sans-serif"],
  }
}

function generateTypographyDoc(
  typographyTokens: { fontFamily: string; headingFont: string; monoFont: string; weights: Record<string, number> }
) {
  const { fontFamily, headingFont, monoFont } = typographyTokens
  const inter = fontFamily
  const playfair = headingFont

  return {
    title: "Typography & Type Scale",
    typeScale: [
      { style: "Display XL", size: "72px", lineHeight: "80px", weight: "700", font: playfair, preview: "Apex Visuals" },
      { style: "Header H1", size: "48px", lineHeight: "56px", weight: "700", font: playfair, preview: "System Hierarchy Overview" },
      { style: "Header H2", size: "36px", lineHeight: "44px", weight: "600", font: inter, preview: "Medium scale sub-headings" },
      { style: "Header H3", size: "30px", lineHeight: "38px", weight: "600", font: inter, preview: "Section container block title" },
      { style: "Header H4", size: "24px", lineHeight: "32px", weight: "500", font: inter, preview: "Card grouping visual labels" },
      { style: "Header H5", size: "20px", lineHeight: "28px", weight: "500", font: inter, preview: "Compact card labels and list groups" },
      { style: "Body Large", size: "18px", lineHeight: "26px", weight: "400", font: inter, preview: "Intro paragraphs and lead-in sentence text styles." },
      { style: "Body Regular", size: "16px", lineHeight: "24px", weight: "400", font: inter, preview: "Default interactive dashboard table copy, standard paragraphs, and control properties." },
      { style: "Body Small", size: "14px", lineHeight: "20px", weight: "400", font: inter, preview: "Sub-information text, forms metadata, input hints, and table cell annotations." },
      { style: "Caption", size: "12px", lineHeight: "16px", weight: "500", font: inter, uppercase: true, preview: "CHART AXIS LABEL, HELPER LEGENDS, MINI METADATA STATS." },
      { style: "Overline", size: "10px", lineHeight: "14px", weight: "600", font: inter, uppercase: true, letterSpacing: "0.08em", preview: "PRE-ACCENT CATEGORY TAG MARKER" },
    ],
    fontFamilies: [
      { name: "Inter (Sans-Serif)", role: "Primary / Interface Engine", sample: "AbCdEfGhIjKlMnOpQrStUvWxYz 1234567890", font: inter },
      { name: "Playfair Display (Serif)", role: "Secondary / Editorial & display", sample: "AbCdEfGhIjKlMnOpQrStUvWxYz 1234567890", font: playfair },
      { name: "JetBrains Mono (Monospace)", role: "System / Code & analytical metrics", sample: "const token_id = '#4F46E5';", font: monoFont },
    ],
    fontWeights: [
      { name: "Thin", value: 100 },
      { name: "Light", value: 300 },
      { name: "Regular", value: 400 },
      { name: "Medium", value: 500 },
      { name: "SemiBold", value: 600 },
      { name: "Bold", value: 700 },
      { name: "ExtraBold", value: 800 },
    ],
    lineHeight: {
      tight: { label: "TIGHT", value: "115% / 1.15", lineHeight: "1.15", description: "This block shows tight spacing configuration. Good only for short displays or condensed alert tags needing minimum height." },
      normal: { label: "NORMAL", value: "150% / 1.5", lineHeight: "1.5", description: "Standard reading tracking scale used throughout regular document bodies, text blocks, descriptions, and user feedback prompts." },
    },
    letterSpacing: {
      compact: { label: "COMPACT", value: "-2% / -0.32px", letterSpacing: "-0.32px", description: "Displays headers utilize tight visual tracking." },
      wide: { label: "WIDE", value: "+10% / 1.2px", letterSpacing: "1.2px", uppercase: true, description: "Overlines and badge titles need wider spacing." },
    },
  }
}

/* ============================ SPACING & RADIUS ============================ */

function generateSpacing(density: string) {
  const base = density === "Compact" ? 2 : density === "Spacious" ? 6 : 4
  const names = ["Space 1", "Space 2", "Space 3", "Space 4", "Space 5", "Space 6", "Space 8", "Space 10", "Space 12", "Space 16"]
  const multipliers = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]
  const values = [0, ...multipliers.map((m) => base * m)]
  return {
    scale: values,
    names: ["0", ...names],
    unit: "px",
    baseUnit: base,
    label: `${base}px base sizing units governing component gaps, paddings, margins.`,
  }
}

function getRadius(pref: string): string {
  const map: Record<string, string> = {
    Sharp: "0px", Small: "4px", Medium: "8px", Large: "12px", Rounded: "16px",
  }
  return map[pref] || "8px"
}

function generateRadiusScale(pref: string) {
  const base = parseInt(getRadius(pref)) || 8
  const map: Record<string, string> = { none: "0px", sm: "2px", md: "4px", lg: "8px", xl: "12px", "2xl": "16px", full: "999px" }
  if (base === 0) map.lg = "0px"
  else if (base === 4) map.lg = "4px"
  else if (base === 12) map.lg = "12px"
  else if (base === 16) map.lg = "16px"
  return map
}

function generateShadows(visualStyle: string) {
  const isLuxury = visualStyle === "Luxury"
  const isFlat = visualStyle === "Flat" || visualStyle === "Minimal"

  if (isFlat) {
    return { sm: "none", md: "none", lg: "none", xl: "none", "2xl": "none", inner: "none" }
  }

  const intensity = isLuxury ? 0.15 : 0.1

  return {
    sm: `0 1px 2px rgba(15,23,42,${intensity * 0.5})`,
    md: `0 4px 6px -1px rgba(15,23,42,${intensity * 0.7})`,
    lg: `0 10px 15px -3px rgba(15,23,42,${intensity})`,
    xl: `0 20px 25px -5px rgba(15,23,42,${intensity * 1.2})`,
    "2xl": `0 40px 50px -12px rgba(15,23,42,${intensity * 1.5})`,
    inner: "inset 0 2px 4px rgba(15,23,42,0.05)",
  }
}

function generateElevation(visualStyle: string) {
  const isFlat = visualStyle === "Flat" || visualStyle === "Minimal"
  return {
    description: "Visual separation is governed by progressively heavier soft shadows.",
    levels: [
      { level: "Level 0", name: "Flat layout panels", usage: "Flat forms, quiet surfaces", shadow: isFlat ? "none" : "0 1px 2px rgba(15,23,42,0.05)" },
      { level: "Level 1", name: "Basic information cards", usage: "Standard content cards", shadow: isFlat ? "none" : "0 4px 6px -1px rgba(15,23,42,0.07)" },
      { level: "Level 2", name: "Dropdown lists, navigation flyouts", usage: "Context menus, popovers", shadow: isFlat ? "none" : "0 10px 15px -3px rgba(15,23,42,0.12)" },
      { level: "Level 3", name: "Modal dialog frames, system alerts", usage: "Dialogs, critical alerts", shadow: isFlat ? "none" : "0 25px 50px -12px rgba(15,23,42,0.25)" },
    ],
    zIndex: { dropdown: 1000, sticky: 1020, fixed: 1030, overlay: 1040, modal: 1050, popover: 1060, toast: 1070, tooltip: 1080 },
    focusRing: "Highlighted by 3px outer stroke with internal spacer.",
    borders: { solid: "1px", solidStrong: "2px", dashed: "1px dashed", dotted: "1px dotted" },
  }
}

function generateIconography(iconStyle: string) {
  return {
    description: "Consistent scaling options preventing icon bloat.",
    sizes: [
      { name: "16px", usage: "Dense UI, table actions, inline indicators" },
      { name: "20px", usage: "Compact buttons, menu items" },
      { name: "24px", usage: "Default control icons, navigation" },
      { name: "40px", usage: "Empty states, hero visuals" },
    ],
    grid: { workspace: "24x24px", safeZone: "2px", baseKeyline: "24px" },
    style: iconStyle || "Outline",
    touchTarget: "Min Touch Target: 44x44px",
    colorAllocations: {
      "Primary Icon Action": "Interactive actions, primary CTA icons",
      "Secondary Normal icon": "Standard status indicators",
      "Disabled/Quiet Icon state": "Unavailable choices",
      "Destructive alert feedback": "Caution alert, delete actions",
    },
    semanticColor: {
      primary: "Interactive actions",
      secondary: "Normal icon",
      disabled: "Quiet icon state",
      destructive: "Alert feedback",
    },
  }
}

function generateGrid() {
  return {
    description: "12-Column Grid system with dynamic page configurations matching layout constraints.",
    columns: 12,
    gutter: "24px",
    margins: { mobile: "16px", tablet: "24px", desktop: "80px" },
    breakpoints: {
      sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
    maxWidthContainers: {
      fluid: { value: "100%", usage: "System: Fluid Center" },
      "640px": { usage: "Compact blog text cards" },
      "768px": { usage: "Product setting screens" },
      "1024px": { usage: "Standard settings & details pages" },
      "1280px": { usage: "Enterprise analytical panels" },
      "1536px": { usage: "Full grid systems, 3-Column Dashboards" },
    },
    canonicalLayouts: ["Single Column", "2-Column Equal"],
  }
}

function generateSizingTokens() {
  return {
    avatar: { xxs: "24px", xs: "32px", sm: "40px", md: "48px", lg: "64px" },
    inputHeights: { sm: "38px", default: "40px", lg: "48px" },
    buttonHeights: { sm: "32px", md: "40px", lg: "48px" },
    card: { padding: "24px", headerGap: "12px", radius: "12px" },
    button: { horizontalPadding: "20px", verticalPadding: "12px", innerSpacing: "8px", radius: "8px" },
  }
}

function generateSpacingLayout(density: string, radiusPref: string) {
  const spacing = generateSpacing(density)
  return {
    spacingScale: spacing.scale,
    spacingNames: spacing.names,
    baseUnit: spacing.baseUnit,
    grid: {
      columns: 12,
      gutter: density === "Compact" ? "16px" : density === "Spacious" ? "32px" : "24px",
      margin: density === "Compact" ? "16px" : density === "Spacious" ? "32px" : "24px",
    },
    breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    containerWidth: "1200px",
    maxWidths: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
    density,
    radiusScale: generateRadiusScale(radiusPref),
    sizingTokens: generateSizingTokens(),
    lineHeightComparison: {
      tight: { label: "TIGHT", description: "Good only for short displays or condensed alert tags needing minimum height." },
      normal: { label: "NORMAL (1.5)", description: "Standard reading tracking scale used throughout regular document bodies, text blocks, descriptions, and user feedback prompts." },
    },
  }
}

/* ============================ MOTION ============================ */

function generateMotion(visualStyle: string) {
  const isLuxury = visualStyle === "Luxury" || visualStyle === "Elegant"
  const isCorporate = visualStyle === "Corporate"

  return {
    duration: {
      instant: isLuxury ? "50ms" : "0ms",
      fast: isLuxury ? "150ms" : "100ms",
      normal: isLuxury ? "300ms" : "200ms",
      slow: isLuxury ? "500ms" : "300ms",
      deliberate: isLuxury ? "700ms" : "400ms",
    },
    easing: {
      default: isLuxury ? "cubic-bezier(0.4, 0, 0.2, 1)" :
               isCorporate ? "cubic-bezier(0.4, 0, 0.6, 1)" :
               "cubic-bezier(0.16, 1, 0.3, 1)",
      emphasize: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      decelerate: "cubic-bezier(0, 0, 0.2, 1)",
      accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    },
    timingScale: [
      { name: "Instant", value: "0ms", usage: "State toggles, no perceivable delay" },
      { name: "Fast (switches)", value: "100ms", usage: "Switches, hovers, focus" },
      { name: "Normal (parameters)", value: "200ms", usage: "Standard transitions, color/shadow changes" },
      { name: "Slow (expand overlays)", value: "300ms", usage: "Overlays, drawers, expandable panels" },
    ],
  }
}

function generateMotionGuidelines(visualStyle: string) {
  const isSubtle = visualStyle === "Corporate" || visualStyle === "Minimal"
  return [
    {
      type: "Hover Animation",
      description: isSubtle
        ? "Subtle lift effect with shadow transition. Elements rise 2px on hover."
        : "Elements scale to 1.02 with enhanced shadow. Interactive feedback within 150ms.",
      duration: "150ms",
      easing: "ease-out",
    },
    {
      type: "Page Transition",
      description: "Content fades in with slight vertical slide (8px). Stagger children for sequential reveal.",
      duration: "300ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    {
      type: "Loading Animation",
      description: "Skeleton pulse animation with shimmer effect. Gradient sweep from left to right.",
      duration: "1500ms",
      easing: "linear",
      loop: true,
    },
    {
      type: "Modal Animation",
      description: "Scale from 0.95 to 1 with fade in. Backdrop fades to 50% opacity.",
      duration: "200ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    {
      type: "Accordion Animation",
      description: "Height expansion with content fade-in. Smooth spring-like motion.",
      duration: "300ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    {
      type: "Toast Notification",
      description: "Slide in from top-right corner. Auto-dismiss after 5 seconds with fade out.",
      duration: "400ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    {
      type: "Button Click",
      description: "Brief scale to 0.97 on press. Immediate feedback within 50ms.",
      duration: "100ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  ]
}

/* ============================ COMPONENTS ============================ */

function generateComponents(visualStyle: string, industry: string, scope: string[]) {
  const isModern = visualStyle === "Modern" || visualStyle === "Glassmorphism"
  const all: Record<string, any[]> = {
    "Form Elements": [
      {
        name: "Text Input",
        description: "Fields for text entry in various states. Interactive controls designed to capture and validate user input while conforming to accessible standards.",
        anatomy: ["Label", "Input field", "Placeholder text", "Helper text", "Error message", "Icon (optional)"],
        variants: [
          { name: "Default", description: "Standard input with border and label." },
          { name: "Error", description: "Red border and error message below input." },
          { name: "Success", description: "Green border with check icon." },
          { name: "Disabled", description: "Grayed out. No interaction allowed." },
          { name: "Filled", description: "With background fill instead of just border." },
        ],
        sizes: [
          { name: "sm", height: "38px", fontSize: "14px" },
          { name: "default", height: "40px", fontSize: "14px" },
          { name: "lg", height: "48px", fontSize: "16px" },
        ],
        states: [
          { name: "Default", description: "Resting state with placeholder text." },
          { name: "Focused", description: "Primary color border. Focus ring applied." },
          { name: "Error", description: "Validation failed. Shows error message." },
          { name: "Disabled", description: "Grayed out. Cannot interact." },
        ],
        examples: [
          { label: "Email Address", placeholder: "your@email.com" },
          { label: "Password", placeholder: "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" },
          { label: "Phone Number", placeholder: "a+1-123-4567", helper: "Please enter a valid numbers-only phone format." },
        ],
        accessibility: "All inputs must have associated labels. Error messages must be announced by screen readers. Use aria-describedby for helper text.",
      },
      {
        name: "Select / Dropdown",
        description: "Select from multiple options.",
        anatomy: ["Trigger", "Popup list", "Selected value", "Check indicator", "Group labels"],
        variants: [
          { name: "Default", description: "Standard single-select dropdown." },
          { name: "Grouped", description: "Options organized by category." },
        ],
        examples: [
          { placeholder: "Choose standard role...", options: ["Administrator", "Billing Manager", "Content Collaborator"] },
        ],
        accessibility: "Use role='listbox' and role='option'. Arrow keys for navigation. Escape to close.",
      },
      {
        name: "Checkboxes",
        description: "Permit multiple selection from a set of options.",
        anatomy: ["Checkbox box", "Label", "Indeterminate state"],
        variants: [
          { name: "Unchecked", description: "Option Unchecked" },
          { name: "Checked", description: "Option Checked" },
          { name: "Indeterminate", description: "Partial selection for parent groups" },
        ],
        accessibility: "Use native input semantics. Keyboard operable with Space.",
      },
      {
        name: "Radio Buttons",
        description: "Permit single selection from a set of mutually exclusive options.",
        anatomy: ["Radio circle", "Label", "Selected indicator"],
        variants: [
          { name: "Unselected", description: "Radio Unselected" },
          { name: "Selected", description: "Radio Selected" },
        ],
        accessibility: "Use role='radiogroup'. Arrow keys navigate between options.",
      },
      {
        name: "Toggle / Switch",
        description: "Boolean switches for settings and preferences.",
        anatomy: ["Track", "Thumb", "Label"],
        variants: [
          { name: "Off", description: "Switch Off" },
          { name: "On", description: "Switch On" },
        ],
        accessibility: "Use role='switch'. Must have aria-checked. Keyboard operable with Enter/Space.",
      },
      {
        name: "Text Area",
        description: "Longer formatting entry fields.",
        anatomy: ["Label", "Multiline field", "Character counter", "Helper text"],
        examples: [{ label: "Short Bio", placeholder: "Experienced system engineering leader based out of Portland, OR..." }],
        accessibility: "All textareas must have associated labels.",
      },
    ],
    "Buttons": [
      {
        name: "Button",
        description: "Buttons allow users to take actions, and make choices, with a single tap. Standard interactive states convey system feedback clearly.",
        anatomy: ["Click Action", "Label", "Icon (optional)", "Loading spinner (state)", "Focus ring"],
        variants: [
          { name: "Primary Action", description: "Main call-to-action. Core semantic choice for action hierarchy.", code: "variant: 'primary'", usage: "Submit, Save, Continue, Get Started" },
          { name: "Secondary", description: "Alternative action alongside primary buttons.", code: "variant: 'secondary'", usage: "Cancel, Back, Learn More" },
          { name: "Tertiary / Ghost", description: "Lowest emphasis, quiet actions.", usage: "Delete, Remove, Dismiss" },
          { name: "Destructive", description: "For irreversible actions. Always requires confirmation.", code: "variant: 'destructive'", usage: "Delete Item, Remove Permanently" },
        ],
        sizes: [
          { name: "sm", height: "32px", horizontalPadding: "16px", fontSize: "14px" },
          { name: "md", height: "40px", horizontalPadding: "20px", fontSize: "14px" },
          { name: "lg", height: "48px", horizontalPadding: "24px", fontSize: "16px" },
        ],
        states: [
          { name: "Default", description: "Resting state" },
          { name: "Hover", description: isModern ? "Background darkens with slight lift effect" : "Background darkens by 10%" },
          { name: "Focus (Ring)", description: "Visible focus ring for keyboard navigation" },
          { name: "Disabled", description: "Opacity reduced to 40%. No interaction allowed." },
        ],
        anatomySpec: {
          horizontalPadding: "16px",
          iconCap: "8px",
          cornerRadius: "8px",
          typography: "14px, Medium Weight",
        },
        accessibility: "All buttons must have visible focus indicators. Use aria-label when icon-only. Minimum touch target of 44px.",
      },
      {
        name: "Icon Button",
        description: "Compact buttons utilizing only symbols, constrained to exact squares.",
        anatomy: ["Icon", "Square container", "Focus ring"],
        variants: [
          { name: "Default", description: "Standard icon button." },
          { name: "Ghost", description: "Icon-only without background." },
        ],
        sizes: [{ name: "sm", size: "32px" }, { name: "md", size: "40px" }, { name: "lg", size: "48px" }],
        accessibility: "Must have aria-label describing the action.",
      },
    ],
    "Containers & Feedback": [
      {
        name: "Card",
        description: "Modular items containing discrete information.",
        anatomy: ["Container", "Header", "Content area", "Footer (optional)", "Media (optional)"],
        variants: [
          { name: "Basic Content Block", description: "No image decoration, suited for simple paragraphs and text assets." },
          { name: "Stat Card", description: "Metric display with label and value.", example: { label: "TOTAL ACTIVE USERS", value: "14,249", delta: "+12.4%" } },
          { name: "Media Card", description: "Image with title and description." },
          { name: "Interactive", description: "Hoverable with lift effect. Use for clickable cards." },
        ],
        specs: { padding: "24px (Space 6)", headerToContentGap: "12px (Space 3)", cornerRadius: "12px (Radius xl)" },
        accessibility: "Interactive cards must have role='button' or be wrapped in <a>. Use proper heading hierarchy within cards.",
      },
      {
        name: "Modal Dialog",
        description: "Exclusive system interrupts over a semi-transparent backdrop.",
        anatomy: ["Backdrop", "Container", "Header (with close)", "Content", "Footer (actions)"],
        variants: [
          { name: "Default", description: "Standard modal with header, content, and footer." },
          { name: "Alert", description: "Simple confirmation dialog with destructive action." },
        ],
        examples: [
          { title: "Deactivate Account", body: "This action cannot be undone. All database records for this environment will be permanently removed.", actions: ["Cancel", "Yes, Delete"] },
        ],
        accessibility: "Focus must be trapped inside modal. Close on Escape key. aria-modal='true'.",
      },
      {
        name: "Tooltip",
        description: "Contextual hints based on hover triggers.",
        anatomy: ["Trigger element", "Tooltip container", "Arrow indicator", "Text content"],
        variants: [
          { name: "Tooltip Down", description: "Appears below the element." },
          { name: "Tooltip Up", description: "Appears above the element." },
        ],
        accessibility: "Use role='tooltip'. Trigger element must have aria-describedby.",
      },
      {
        name: "Toast Notification",
        description: "Fading system updates stacked linearly.",
        anatomy: ["Icon", "Message", "Close action", "Auto-dismiss"],
        variants: [
          { name: "Success", description: "Asset loaded successfully" },
          { name: "Error", description: "Operation failed (code 503)" },
        ],
        accessibility: "Use aria-live='polite' for screen readers.",
      },
      {
        name: "Alert Banner",
        description: "Static system-wide callouts for critical context.",
        anatomy: ["Icon", "Title", "Description", "Action button (optional)"],
        variants: [
          { name: "Warning", description: "System Maintenance â€” Scheduled downtime tonight at 02:00 UTC." },
          { name: "Info", description: "Trial ending soon â€” Update billing methods to prevent account suspension." },
        ],
        accessibility: "Use role='alert' for dynamic alerts.",
      },
    ],
    "Navigation": [
      {
        name: "Top Navigation Bar",
        description: "Primary horizontal layout containing brand, links, and profile utilities.",
        anatomy: ["Logo", "Nav links", "Search", "Profile utilities", "Mobile hamburger"],
        accessibility: "Use semantic <nav> element. Current page should have aria-current='page'.",
      },
      {
        name: "Side Navigation",
        description: "Vertical sidebar links with state feedback.",
        anatomy: ["Logo area", "Nav items", "Active indicator", "Section groups"],
        examples: [{ items: ["Overview", "Analytics", "Settings"] }, { items: ["Dashboard", "Performance", "Organization"] }],
        accessibility: "Mobile menu must be keyboard accessible.",
      },
      {
        name: "Dropdown / Context Menu",
        description: "Trigger-induced option lists.",
        anatomy: ["Trigger", "Menu panel", "Menu items", "Dividers"],
        examples: [{ items: ["Edit metadata", "Share project", "Delete permanently"] }],
        accessibility: "Use role='menu' and role='menuitem'. Arrow keys for navigation.",
      },
      {
        name: "Breadcrumbs & Tabs",
        description: "Hierarchical context and view switches.",
        anatomy: ["Items", "Separators", "Current location"],
        examples: [{ type: "Breadcrumb", items: ["Home", "Settings"] }, { type: "Tabs", items: ["Profile Settings", "Security Keys"] }],
        accessibility: "Breadcrumb nav element with aria-label='breadcrumb'.",
      },
      {
        name: "Horizontal Stepper",
        description: "Linear processes tracked and validated.",
        anatomy: ["Step circles", "Connectors", "Labels", "Completed indicators"],
        examples: [{ items: ["Billing"] }],
        accessibility: "Set aria-current='step' for active step.",
      },
      {
        name: "Pagination",
        description: "Navigating divided index values.",
        anatomy: ["Previous", "Page numbers", "Next"],
        accessibility: "Use nav landmark with aria-label.",
      },
    ],
    "Data Display": [
      {
        name: "Data Table",
        description: "Structured table rows layout with stripe decoration.",
        anatomy: ["Header row", "Body rows", "Cells", "Sort indicators", "Row actions"],
        variants: [
          { name: "Default", description: "Clean table with horizontal borders." },
          { name: "Striped", description: "Alternating row backgrounds for easier scanning." },
        ],
        examples: [
          { columns: ["MEMBER PROFILE", "ROLE", "STATUS"], rows: [["Alex Mercer", "Technical Lead", "ACTIVE (70%)"], ["Jane Doe", "Product Director", "PENDING"]] },
        ],
        accessibility: "Use proper <table> semantics. Sortable columns need aria-sort.",
      },
      {
        name: "Chart",
        description: "Data visualization with verified categorical palette.",
        anatomy: ["Chart area", "Axes", "Gridlines", "Legend", "Tooltip"],
        variants: [
          { name: "Line", description: "Trend data over time." },
          { name: "Bar", description: "Categorical comparison." },
          { name: "Donut", description: "Part-to-whole composition." },
          { name: "Scatter", description: "Correlation between variables." },
        ],
        accessibility: "Provide data tables alongside charts. Use aria-label for canvas-based charts.",
      },
    ],
  }

  const included = scope.map((s: string) => s.toLowerCase())
  const keys = Object.keys(all)
  const selected = keys.filter((k) => included.some((inc) => k.toLowerCase().includes(inc) || inc.includes(k.toLowerCase())))
  const components = (selected.length ? selected : keys).flatMap((k) => all[k])
  return components
}

/* ============================ PATTERNS ============================ */

function generatePatterns(industry: string) {
  type Pattern = {
    name: string; description: string; sections: string[];
    variants?: { name: string; description: string }[];
    states?: { name: string; description: string }[];
    examples?: any[];
    accessibility?: string;
  }
  const allPatterns: Pattern[] = [
    {
      name: "Login / Authentication",
      description: "Standard authentication screen with email/password or social login options.",
      sections: ["Logo", "Heading", "Email input", "Password input", "Submit button", "Forgot password link", "Sign up link", "Divider with social options"],
      variants: [
        { name: "Centered Card", description: "Centered card layout. Best for dedicated auth pages." },
        { name: "Split Screen", description: "Image on one side, form on the other. Best for brand storytelling." },
      ],
      accessibility: "Auto-focus first input. Show password toggle. Error messages must be announced by screen readers.",
    },
    {
      name: "Dashboard",
      description: `Main analytics overview for ${industry || "web applications"}. Displays key metrics and recent activity.`,
      sections: ["Sidebar navigation", "Header with search", "Stats cards (4)", "Chart area", "Recent activity list", "Quick actions"],
      states: [
        { name: "Loading", description: "Skeleton screens for each section." },
        { name: "Empty", description: "Welcome state for first-time users with setup guide." },
        { name: "Error", description: "Error state with retry option for each widget." },
        { name: "Populated", description: "Full data display with charts and metrics." },
      ],
    },
    {
      name: "Landing Page",
      description: "Marketing homepage showcasing product value proposition and features.",
      sections: ["Navigation bar", "Hero section with CTA", "Features grid (3x2)", "Testimonials carousel", "Pricing section", "FAQ accordion", "Footer"],
      states: [
        { name: "Loaded", description: "Full marketing page with animations." },
        { name: "Mobile", description: "Responsive stacked layout with hamburger menu." },
      ],
    },
    {
      name: "Complex Form",
      description: "How nested fields cooperate to capture structured data.",
      sections: ["Section header", "Required fields", "Address block", "Terms checkbox", "Order summary", "Submit actions"],
      examples: [
        { title: "Billing Information", fields: ["First Name *", "Last Name *", "Address Line 1", "Terms authorization", "Process order ($240.00)"] },
      ],
    },
    {
      name: "Profile Settings",
      description: "User profile management with tabbed interface for different settings categories.",
      sections: ["Avatar upload", "Personal info form", "Email preferences", "Notification settings", "Security section", "Danger zone"],
      variants: [{ name: "Single Page", description: "Long form with sections." }, { name: "Tabbed", description: "Organized into tabs." }],
    },
    {
      name: "Pricing Page",
      description: "Subscription plan comparison with feature breakdown.",
      sections: ["Heading", "Toggle (monthly/yearly)", "Plan cards (3 tiers)", "Feature comparison table", "FAQ", "CTA"],
    },
    {
      name: "Data Table",
      description: `Data management interface for ${industry || "business"} data.`,
      sections: ["Toolbar with actions", "Search and filters", "Table with sort", "Row actions menu", "Pagination", "Bulk selection"],
      states: [
        { name: "Empty", description: "No data with 'Add first item' CTA" },
        { name: "Filtered", description: "Results after filter applied" },
      ],
    },
  ]

  if (industry.includes("healthcare")) {
    allPatterns.push({
      name: "Patient Dashboard",
      description: "Patient health overview with medical history and upcoming appointments.",
      sections: ["Patient info header", "Vitals cards", "Medication list", "Appointment calendar", "Lab results", "Messages"],
      variants: [],
      states: [{ name: "Populated", description: "Full patient data display" }, { name: "Empty", description: "New patient with no history" }],
    })
  } else if (industry.includes("finance")) {
    allPatterns.push({
      name: "Account Overview",
      description: "Financial account summary with transactions and spending analysis.",
      sections: ["Account balance hero", "Recent transactions", "Spending chart", "Budget progress", "Quick transfer"],
      variants: [],
      states: [{ name: "Populated", description: "Full financial data" }, { name: "Empty", description: "New account" }],
    })
  } else if (industry.includes("education")) {
    allPatterns.push({
      name: "Course Dashboard",
      description: "Student learning dashboard with course progress and assignments.",
      sections: ["Course list", "Progress bars", "Upcoming deadlines", "Grades overview", "Discussion feed"],
      variants: [],
      states: [{ name: "Active", description: "Current courses" }, { name: "Completed", description: "Past courses" }],
    })
  }

  return allPatterns
}

/* ============================ DATA VIZ ============================ */

function generateDataViz(p: string, s: string, a: string) {
  const tokens = generateColorTokens(p, s, a)
  return {
    description: "Guidelines regarding sequential color trust, temporal easing metrics, and verified accessibility standards.",
    categoricalPalette: tokens.chartPalette,
    paletteColors: tokens.chartPalette.map((c: string) => ({ hex: c, name: colorName(c) })),
    graphSpecs: {
      line: "2px stroke width, 8px data point, 24px top padding for labels",
      bar: "Rounded top corners (4px), 16px gap between bars",
      donut: "3px gap between segments, center label in bold",
      scatter: "6px radius points, 20% opacity fill",
    },
    interactiveGraphSpecs: {
      hoverState: "Highlight with 3px ring in primary color",
      tooltip: "Elevation Level 2 shadow, 12px radius, 8px padding",
      axes: "Labels in caption size (12px), gridlines in neutral 200",
    },
    compliance: "Selected colors with verified safety ratios for anomalous color vision.",
  }
}

function colorName(hex: string): string {
  const map: Record<string, string> = {
    "#3B82F6": "Blue", "#0D9488": "Teal", "#7C3AED": "Purple", "#059669": "Green",
    "#EA580C": "Orange", "#D97706": "Amber", "#4F46E5": "Indigo", "#E11D48": "Rose",
  }
  return map[hex] || hex
}

/* ============================ ACCESSIBILITY ============================ */

function generateAccessibility(level: string) {
  return {
    level: level || "WCAG AA",
    summary: `This design system is built to meet ${level || "WCAG AA"} standards, ensuring digital accessibility for all users.`,
    principles: [
      "Perceivable â€” Information must be presentable to users in ways they can perceive.",
      "Operable â€” UI components and navigation must be operable by all users.",
      "Understandable â€” Information and operation of UI must be understandable.",
      "Robust â€” Content must be robust enough to be interpreted by assistive technologies.",
    ],
    contrastReport: {
      "Normal Text (4.5:1 min)": "Pass â€” All text meets minimum contrast ratio.",
      "Large Text (3:1 min)": "Pass â€” All large text exceeds minimum ratio.",
      "UI Components (3:1 min)": "Pass â€” All interactive elements meet contrast requirements.",
      "Graphical Objects (3:1 min)": "Pass â€” Icons and graphs meet contrast standards.",
    },
    touchTargets: {
      minimum: "44x44px",
      recommendation: "48x48px recommended for optimal usability",
      exceptions: "Inline links within text blocks exempted",
    },
    keyboardNavigation: {
      tabOrder: "Logical tab order follows visual layout (top-to-bottom, left-to-right)",
      skipLinks: "Skip to main content link at page start",
      focusTrapping: "Modals and dialogs trap focus within the component",
      focusOrder: "Interactive elements receive focus in meaningful sequence",
    },
    focusIndicators: {
      style: "3px outer stroke with internal spacer",
      color: "Current primary color at 50% opacity",
      requirement: "All interactive elements must have visible focus indicator",
      never: "Do not use outline: none without providing a replacement",
    },
    screenReader: {
      headings: "Use proper h1-h6 hierarchy. Never skip heading levels.",
      labels: "All form inputs must have associated labels.",
      altText: "All images must have descriptive alt text.",
      aria: "Use ARIA landmarks (banner, navigation, main, complementary, contentinfo).",
      announcements: "Use aria-live regions for dynamic content changes.",
      descriptions: "Use aria-describedby for complex instructions or error details.",
    },
    wcagCompliance: {
      [level || "WCAG AA"]: [
        "1.1.1 Non-text Content (Level A)",
        "1.4.3 Contrast (Minimum) (Level AA)",
        "2.1.1 Keyboard (Level A)",
        "2.4.3 Focus Order (Level A)",
        "2.4.7 Focus Visible (Level AA)",
        "3.3.2 Labels or Instructions (Level A)",
        "4.1.2 Name, Role, Value (Level A)",
      ],
    },
    bestPractices: [
      "Test with keyboard-only navigation before each release",
      "Use automated accessibility testing tools in CI/CD pipeline",
      "Conduct manual testing with screen readers (NVDA, VoiceOver, JAWS)",
      "Test with magnification (200% zoom)",
      "Avoid relying solely on color to convey information",
      "Provide transcripts for audio content and captions for video",
      "Ensure motion does not trigger vestibular disorders (prefers-reduced-motion)",
    ],
    ariaSuggestions: [
      "Use role='navigation' for nav elements",
      "Use role='banner' for page headers",
      "Use role='main' for primary content area",
      "Use role='complementary' for sidebars",
      "Use role='contentinfo' for page footers",
      "Use aria-current='page' for active navigation items",
      "Use aria-expanded for collapsible sections",
    ],
  }
}

/* ============================ DOCUMENTATION ============================ */

function generateDocumentation(brandInfo: any, industry: string, fontPairing: string, platforms: string[]) {
  const brand = brandInfo.brandName || ""
  return {
    overview: `The ${brand} Design System is a comprehensive, production-ready UI component library built for ${industry || "modern web applications"}. It provides a unified design language, reusable components, and detailed guidelines for building consistent, accessible user interfaces across ${platforms.join(", ")}.`,
    usage: [
      "Use this design system as the single source of truth for all product interfaces",
      "Follow component documentation for proper implementation",
      "Use design tokens for consistent styling across platforms",
      "Reference pattern documentation for common page layouts and flows",
    ],
    dos: [
      "Use the predefined design tokens for all styling needs",
      "Reference the component library for UI building blocks",
      "Follow accessibility guidelines for all implementations",
      "Use the spacing scale for consistent layouts",
      "Apply motion guidelines for cohesive animation behavior",
      "Use template structures directly where possible",
    ],
    donts: [
      "Do not override design tokens directly â€” use the token customization API",
      "Do not create new components without reviewing existing ones first",
      "Do not ignore accessibility requirements â€” they are mandatory",
      "Do not add custom styling outside the design system framework",
      "Do not mix patterns from different visual styles",
    ],
    componentAnatomy: "Every component in this system follows a consistent structure: PropTypes, States, Variants, Sizes, Accessibility Requirements, and Usage Guidelines.",
    gettingStarted: [
      "1. Install the design system package via npm",
      "2. Import the global CSS file for base styles and design tokens",
      "3. Import individual components as needed",
      "4. Review component documentation for props and usage",
      "5. Use the provided theme provider for dynamic theming",
    ],
    developerNotes: [
      "All components support TypeScript with full type definitions",
      "Components are tree-shakeable for optimal bundle size",
      "Use the provided ESLint config for consistent code patterns",
      "Run the visual regression suite before committing component changes",
      "Keep dependencies minimal â€” prefer native CSS solutions over JS runtime",
    ],
  }
}

/* ============================ COLOR HELPERS ============================ */

function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent))
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(2.55 * percent))
  const b = Math.min(255, (num & 0x0000ff) + Math.round(2.55 * percent))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function darken(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent))
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent))
  const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function hexToRgbArray(hex: string): [number, number, number] {
  const clean = hex.replace("#", "")
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ]
}

function rgbToHslNumbers(r: number, g: number, b: number) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break
      case gn: h = (bn - rn) / d + 2; break
      case bn: h = (rn - gn) / d + 4; break
    }
    h /= 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100
  const ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const hp = (((h % 360) + 360) % 360) / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let r = 0
  let g = 0
  let b = 0
  if (hp < 1) { r = c; g = x }
  else if (hp < 2) { r = x; g = c }
  else if (hp < 3) { g = c; b = x }
  else if (hp < 4) { g = x; b = c }
  else if (hp < 5) { r = x; b = c }
  else { r = c; b = x }
  const m = ln - c / 2
  const to = (v: number) => Math.round((v + m) * 255)
  return `#${((1 << 24) + (to(r) << 16) + (to(g) << 8) + to(b)).toString(16).slice(1)}`
}

function generateBrandNeutral(hex: string) {
  const [r, g, b] = hexToRgbArray(hex)
  const { h, s } = rgbToHslNumbers(r, g, b)
  const sat = Math.min(s, 12)
  const scale: [string, number][] = [
    ["0", 100], ["50", 98], ["100", 96], ["200", 92], ["300", 86],
    ["400", 74], ["500", 60], ["600", 46], ["700", 34], ["800", 24],
    ["900", 16], ["950", 8], ["1000", 0],
  ]
  const neutral: Record<string, string> = {}
  for (const [w, l] of scale) neutral[w] = hslToHex(h, sat, l)
  return neutral
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgbArray(hex)
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

function contrastLabel(ratio: number): string {
  const r = ratio.toFixed(1)
  if (ratio >= 7) return `AAA Pass (${r}:1)`
  if (ratio >= 4.5) return `AA Pass (${r}:1)`
  return `Fail (${r}:1)`
}
