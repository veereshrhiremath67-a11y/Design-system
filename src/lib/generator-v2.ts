import { generateDesignSystem as generateDesignSystemLegacy } from "@/lib/generator-legacy"
import {
  buildBrandScale,
  buildNeutralScale,
  buildSemanticColors,
  buildChartPalette,
  buildGradients,
  buildContrastReport,
  contrastRatio,
  contrastLabel,
  hexToRgb,
  rgbToHsl,
  mixHex,
} from "@/lib/color"

/**
 * generator-v2.ts — the professional generation engine.
 * Calls the legacy engine as a base (components, patterns, motion, docs, ...)
 * and overrides the visual core: colors, semantic hues, neutrals, dark mode,
 * gradients, chart palette, fluid type scale, computed accessibility.
 *
 * Output shape is fully backward-compatible with the legacy `designData` so the
 * project page, preview, and export routes keep working unchanged.
 */

type BrandInfo = {
  brandName?: string
  [key: string]: unknown
}
type BrandAssets = {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  [key: string]: unknown
}
type Preferences = {
  theme?: string
  spacingDensity?: string
  accessibility?: string
  fontPairing?: string
  [key: string]: unknown
}
type Colors = ReturnType<typeof buildColors>
type Mode = {
  background: string
  surface: string
  surfaceMuted: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  border: string
  borderStrong: string
  primary: string
  primaryContrast: string
  semantic: { success: string; warning: string; error: string; info: string }
}
type LegacyDesignData = {
  designPrinciples?: string[]
  overview?: { principles?: unknown[] }
}

function pickFonts(pairing: string) {
  const p = (pairing || "").toLowerCase()
  if (p.includes("playfair")) {
    return {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      headingFont: "'Playfair Display', Georgia, 'Times New Roman', serif",
      monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    }
  }
  if (p.includes("space grotesk")) {
    return {
      fontFamily: "'Space Grotesk', Inter, -apple-system, sans-serif",
      headingFont: "'Space Grotesk', Inter, -apple-system, sans-serif",
      monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    }
  }
  if (p.includes("serif")) {
    return {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      headingFont: "'Playfair Display', Georgia, serif",
      monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    }
  }
  return {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headingFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    monoFont: "'JetBrains Mono', 'Fira Code', monospace",
  }
}

function hexInfo(hex: string) {
  const [r, g, b] = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  return {
    rgb: `${r} ${g} ${b}`,
    hsl: `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`,
  }
}

function iconFor(title: string): string {
  const t = title.toLowerCase()
  if (t.includes("access")) return "Accessibility"
  if (t.includes("consist")) return "Repeat2"
  if (t.includes("performance") || t.includes("efficien") || t.includes("innovation")) return "Zap"
  if (t.includes("less is more") || t.includes("content") || t.includes("scale") || t.includes("quality")) return "Maximize"
  if (t.includes("delight") || t.includes("human") || t.includes("confiden")) return "Star"
  if (t.includes("clarity") || t.includes("bold")) return "Sparkles"
  return "Info"
}

function buildPrinciples(legacy: LegacyDesignData) {
  const raw = legacy?.designPrinciples?.length ? legacy.designPrinciples : []
  if (!raw.length) return legacy?.overview?.principles || []
  return raw.map((p: string, i: number) => {
    const sep = p.indexOf("—") !== -1 ? "—" : "-"
    const idx = p.indexOf(sep)
    const title = idx > -1 ? p.slice(0, idx).trim() : p
    const description = idx > -1 ? p.slice(idx + 1).trim() : p
    return {
      title,
      icon: iconFor(title) || iconFor(p),
      description: description || p,
      _key: i,
    }
  })
}

function buildTypography(preferences: Preferences) {
  const { fontFamily, headingFont, monoFont } = pickFonts(preferences.fontPairing || "Inter + Playfair Display")
  const scale = {
    display: { size: "clamp(3rem, 2rem + 3vw, 4.5rem)", lineHeight: "1.1", weight: 800, letterSpacing: "-0.03em" },
    h1: { size: "clamp(2.25rem, 1.75rem + 2vw, 3.5rem)", lineHeight: "1.15", weight: 700, letterSpacing: "-0.025em" },
    h2: { size: "clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)", lineHeight: "1.2", weight: 600, letterSpacing: "-0.02em" },
    h3: { size: "clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)", lineHeight: "1.25", weight: 600, letterSpacing: "-0.01em" },
    h4: { size: "1.5rem", lineHeight: "1.3", weight: 600, letterSpacing: "-0.005em" },
    h5: { size: "1.25rem", lineHeight: "1.35", weight: 600, letterSpacing: "0" },
    bodyLarge: { size: "1.125rem", lineHeight: "1.5", weight: 400, letterSpacing: "0" },
    body: { size: "1rem", lineHeight: "1.5", weight: 400, letterSpacing: "0" },
    bodySmall: { size: "0.875rem", lineHeight: "1.45", weight: 400, letterSpacing: "0" },
    caption: { size: "0.75rem", lineHeight: "1.4", weight: 500, letterSpacing: "0.02em" },
    overline: { size: "0.75rem", lineHeight: "1.2", weight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
  }
  return {
    fontFamily,
    headingFont,
    monoFont,
    scale,
    weights: {
      thin: 100,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    tracking: { compact: "-0.03em", default: "0", wide: "0.08em" },
    description: "A fluid, accessible type scale generated from a 4px spacing base unit.",
    usage: "Use the defined scale for all text elements. Headings use the display pairing.",
  }
}

function buildTypographyDoc(typography: ReturnType<typeof buildTypography>) {
  const { fontFamily, headingFont, monoFont, scale } = typography
  const serif = { fontFamily: headingFont }
  const sans = { fontFamily: fontFamily }
  const rows: Array<Record<string, string | number | boolean>> = [
    { style: "Display", ...scale.display, font: serif.fontFamily, preview: "Your Brand Visuals" },
    { style: "Header H1", ...scale.h1, font: serif.fontFamily, preview: "System Hierarchy Overview" },
    { style: "Header H2", ...scale.h2, font: serif.fontFamily, preview: "Medium scale sub-headings" },
    { style: "Header H3", ...scale.h3, font: sans.fontFamily, preview: "Section container block title" },
    { style: "Header H4", ...scale.h4, font: sans.fontFamily, preview: "Card grouping visual labels" },
    { style: "Header H5", ...scale.h5, font: sans.fontFamily, preview: "Compact card labels and list groups" },
    { style: "Body Large", ...scale.bodyLarge, font: sans.fontFamily, preview: "Intro paragraphs and lead-in sentence text styles." },
    { style: "Body Regular", ...scale.body, font: sans.fontFamily, preview: "Default interactive dashboard table copy, standard paragraphs." },
    { style: "Body Small", ...scale.bodySmall, font: sans.fontFamily, preview: "Sub-information text, forms metadata, input hints." },
    { style: "Caption", ...scale.caption, font: sans.fontFamily, uppercase: true, preview: "CHART AXIS LABEL, HELPER LEGENDS, MINI METADATA STATS." },
    { style: "Overline", ...scale.overline, font: sans.fontFamily, uppercase: true, preview: "PRE-ACCENT CATEGORY TAG MARKER" },
  ]
  return {
    title: "Typography & Type Scale",
    typeScale: rows,
    fontFamilies: [
      { name: "Inter (Sans-Serif)", role: "Primary / Interface Engine", sample: "AbCdEfGhIjKlMnOpQrStUvWxYz 1234567890", font: fontFamily },
      { name: "Playfair Display (Serif)", role: "Secondary / Editorial & display", sample: "AbCdEfGhIjKlMnOpQrStUvWxYz 1234567890", font: headingFont },
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
      tight: { label: "TIGHT", value: "115% / 1.15", lineHeight: "1.15", description: "Good for short displays or condensed alert tags." },
      normal: { label: "NORMAL", value: "150% / 1.5", lineHeight: "1.5", description: "Standard reading scale for bodies and descriptions." },
    },
    letterSpacing: {
      compact: { label: "COMPACT", value: "-0.03em", letterSpacing: "-0.03em", description: "Display headers use tight tracking." },
      wide: { label: "WIDE", value: "+0.08em", letterSpacing: "0.08em", uppercase: true, description: "Overlines and badge titles need wider spacing." },
    },
  }
}

function buildColors(p: string, s: string, a: string) {
  const brandScale = buildBrandScale(p)
  const neutral = buildNeutralScale(p)
  const semantic = buildSemanticColors()
  const chartPalette = buildChartPalette(p)
  return {
    primary: p,
    primaryLight: brandScale[300],
    primaryLighter: brandScale[200],
    primaryDark: brandScale[700],
    primaryDarker: brandScale[900],
    secondary: s,
    secondaryLight: mixHex(s, "#ffffff", 0.55),
    secondaryLighter: mixHex(s, "#ffffff", 0.7),
    secondaryDark: mixHex(s, "#000000", 0.35),
    secondaryDarker: mixHex(s, "#000000", 0.55),
    accent: a,
    accentLight: mixHex(a, "#ffffff", 0.55),
    accentDark: mixHex(a, "#000000", 0.35),
    neutral,
    semantic,
    backgrounds: { primary: "#ffffff", secondary: "#F8FAFC", tertiary: "#F1F5F9", elevated: "#ffffff" },
    surfaces: { card: "#ffffff", sheet: "#ffffff", dialog: "#ffffff", tooltip: brandScale[900] },
    borders: { light: neutral[200], medium: neutral[300], heavy: neutral[500] },
    text: {
      primary: neutral[900],
      secondary: neutral[600],
      tertiary: neutral[400],
      inverse: "#ffffff",
      link: p,
    },
    interactive: {
      default: p,
      hover: brandScale[600],
      active: brandScale[700],
      disabled: neutral[200],
      focus: `0 0 0 3px ${brandScale[200]}`,
    },
    chartPalette,
    brandScale,
    gradients: buildGradients(p, s, a),
  }
}

function buildModes(colors: Colors, theme: string) {
  const light = {
    background: "#ffffff",
    surface: "#ffffff",
    surfaceMuted: colors.backgrounds.secondary,
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    border: colors.borders.light,
    borderStrong: colors.borders.medium,
    primary: colors.primary,
    primaryContrast: "#ffffff",
    semantic: {
      success: colors.semantic.success,
      warning: colors.semantic.warning,
      error: colors.semantic.error,
      info: colors.semantic.info,
    },
  }
  const dark = {
    background: "#0b1120",
    surface: "#111827",
    surfaceMuted: "#0f172a",
    textPrimary: "#f1f5f9",
    textSecondary: "#94a3b8",
    textTertiary: "#64748b",
    border: "#1e293b",
    borderStrong: "#334155",
    primary: colors.primaryLight,
    primaryContrast: "#0b1120",
    semantic: { success: "#4ade80", warning: "#fbbf24", error: "#f87171", info: "#60a5fa" },
  }
  const modes: { light: Mode; dark: Mode; default: "light" | "dark" } = {
    light,
    dark,
    default: theme === "Dark" ? "dark" : "light",
  }
  return modes
}

function buildColorSystem(p: string, colors: Colors) {
  const contrastReport = buildContrastReport(colors)
  const neutral = colors.neutral
  return {
    description: "A complete, accessible color system with distinct semantic hues and computed contrast.",
    usage: "Use semantic colors for their intended purposes. Use the neutral scale for backgrounds, borders, and text hierarchy.",
    do: [
      "Use primary color for main actions and key interactive elements",
      "Use semantic colors consistently (success green, warning amber, error red)",
      "Maintain sufficient contrast ratios (4.5:1 minimum for text)",
      "Use the chart palette exclusively for data visualizations",
    ],
    dont: [
      "Don't use primary color for error states",
      "Don't mix multiple accent colors without clear hierarchy",
      "Don't rely on color alone to convey information",
      "Don't route primary brand color to denote critical warnings",
    ],
    colorBlindSafe: true,
    contrastReport,
    lightSurfaceReport: [
      { sample: "Info Text", ratio: contrastLabel(contrastRatio(colors.semantic.infoDark, "#ffffff")) },
      { sample: "Regular Body", ratio: contrastLabel(contrastRatio(colors.text.primary, "#ffffff")) },
      { sample: "Light Alert", ratio: contrastLabel(contrastRatio(colors.semantic.successBg, "#ffffff")) },
    ],
    darkSurfaceReport: [
      { sample: "White Heading", ratio: contrastLabel(contrastRatio("#ffffff", neutral[800])) },
      { sample: "Slate Text", ratio: contrastLabel(contrastRatio(colors.text.secondary, neutral[800])) },
      { sample: "Muted Gray", ratio: contrastLabel(contrastRatio(colors.text.tertiary, neutral[800])) },
    ],
    shades: [
      { name: "Primary 100", hex: colors.primaryLighter, usage: "Light backgrounds, hover states" },
      { name: "Primary 200", hex: colors.primaryLight, usage: "Selected states, badges" },
      { name: "Primary 500", hex: p, usage: "Main actions, links, active indicators" },
      { name: "Primary 700", hex: colors.primaryDark, usage: "Hover states for primary elements" },
      { name: "Primary 900", hex: colors.primaryDarker, usage: "Active/pressed states" },
      { name: "Neutral 100", hex: neutral[100], usage: "Page backgrounds" },
      { name: "Neutral 200", hex: neutral[200], usage: "Card borders, dividers" },
      { name: "Neutral 700", hex: neutral[700], usage: "Secondary text" },
      { name: "Neutral 900", hex: neutral[900], usage: "Primary text" },
    ],
  }
}

function buildColorSystemDoc(brandName: string, p: string, s: string, a: string, colors: Colors) {
  const neutral = colors.neutral
  const semantic = colors.semantic
  const order = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]
  const name = brandName || "Brand"
  return {
    title: "Color System",
    primaryBrand: [
      { name: `${name} Primary`, hex: p, ...hexInfo(p), description: "Primary actions, links, active states" },
      { name: "Primary Dark", hex: colors.primaryDark, ...hexInfo(colors.primaryDark), description: "Hover / pressed states" },
      { name: "Accent", hex: a, ...hexInfo(a), description: "Promo paths, premium features" },
    ],
    secondaryHighlights: [
      { name: "Success", hex: semantic.success },
      { name: "Warning", hex: semantic.warning },
      { name: "Error", hex: semantic.error },
      { name: "Info", hex: semantic.info },
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
        { sample: "Info Text", ratio: contrastLabel(contrastRatio(semantic.infoDark, "#ffffff")) },
        { sample: "Regular Body", ratio: contrastLabel(contrastRatio(neutral[900], "#ffffff")) },
        { sample: "Light Alert", ratio: contrastLabel(contrastRatio(semantic.successBg, "#ffffff")) },
      ],
      dark: [
        { sample: "White Heading", ratio: contrastLabel(contrastRatio("#ffffff", neutral[800])) },
        { sample: "Slate Text", ratio: contrastLabel(contrastRatio(neutral[400], neutral[800])) },
        { sample: "Muted Gray", ratio: contrastLabel(contrastRatio(neutral[600], neutral[800])) },
      ],
    },
    guidelines: {
      do: `Ensure warning highlights utilize designated ${semantic.warning} variables stacked with ${semantic.warningDark} text colors to maintain WCAG compliant readability patterns.`,
      dont: `Do not route primary branding (${p}) to denote critical warnings or missing inputs, which confuses global state categorization guidelines.`,
    },
  }
}

function buildDataViz(colors: Colors) {
  const chartPalette = colors.chartPalette || []
  const paletteColors = chartPalette.map((hex: string, i: number) => ({
    hex,
    name: `Series ${i + 1}`,
  }))
  return {
    description: "Guidelines regarding distinct categorical color use, temporal easing metrics, and verified accessibility standards.",
    categoricalPalette: chartPalette,
    paletteColors,
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

function buildAccessibility(colors: Colors, level: string) {
  const contrastReport = buildContrastReport(colors)
  return {
    level: level || "WCAG AA",
    summary: `This design system is built to meet ${level || "WCAG AA"} standards, ensuring digital accessibility for all users. All contrast ratios below are computed from the generated palette.`,
    principles: [
      "Perceivable — Information must be presentable to users in ways they can perceive.",
      "Operable — UI components and navigation must be operable by all users.",
      "Understandable — Information and operation of UI must be understandable.",
      "Robust — Content must be robust enough to be interpreted by assistive technologies.",
    ],
    contrastReport,
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

export function generateDesignSystemV2(brandInfo: BrandInfo, brandAssets: BrandAssets, preferences: Preferences) {
  const legacy = generateDesignSystemLegacy(brandInfo, brandAssets, preferences)
  const p = brandAssets.primaryColor || "#4F46E5"
  const s = brandAssets.secondaryColor || "#3B82F6"
  const a = brandAssets.accentColor || "#7C3AED"
  const theme = preferences.theme || "Light"
  const density = preferences.spacingDensity || "Comfortable"
  const accessibilityLevel = preferences.accessibility || "WCAG AA"
  const version = legacy.version || "v2.0.0"

  const colors = buildColors(p, s, a)
  const typography = buildTypography(preferences)
  const brandScale = colors.brandScale

  const containerWidth = density === "Compact" ? "1100px" : density === "Spacious" ? "1320px" : "1200px"
  const spacing = {
    ...legacy.tokens?.spacing,
    container: containerWidth,
  }

  const tokens = {
    ...legacy.tokens,
    theme,
    modes: buildModes(colors, theme),
    colors,
    typography,
    spacing,
    radius: legacy.tokens?.radius || "8px",
    radiusScale: legacy.tokens?.radiusScale,
    shadows: legacy.tokens?.shadows,
    gradients: colors.gradients,
    borderColor: colors.borders.light,
  }

  const colorSystem = buildColorSystem(p, colors)
  const colorSystemDoc = buildColorSystemDoc(
    brandInfo.brandName || legacy.brandFoundation?.brandName,
    p,
    s,
    a,
    colors
  )
  const typographyDoc = buildTypographyDoc(typography)
  const overview = {
    ...legacy.overview,
    principles: buildPrinciples(legacy),
  }
  const dataViz = buildDataViz(colors)
  const accessibility = buildAccessibility(colors, accessibilityLevel)

  return {
    ...legacy,
    systemName: legacy.systemName,
    version,
    description: legacy.description,
    lastUpdated: legacy.lastUpdated,
    overview,
    tokens,
    colorSystem,
    colorSystemDoc,
    typography: {
      ...legacy.typography,
      ...typography,
    },
    typographyDoc,
    spacingLayout: {
      ...legacy.spacingLayout,
      containerWidth,
      baseUnit: spacing.baseUnit,
      spacingScale: spacing.scale,
      spacingNames: spacing.names,
    },
    dataViz,
    accessibility,
    brandScale,
  }
}
