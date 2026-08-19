export type RGB = [number, number, number]

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "")
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")
  return `#${to(r)}${to(g)}${to(b)}`
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0)
        break
      case gn:
        h = (bn - rn) / d + 2
        break
      case bn:
        h = (rn - gn) / d + 4
        break
    }
    h /= 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const sn = Math.max(0, Math.min(100, s)) / 100
  const ln = Math.max(0, Math.min(100, l)) / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const hp = (((h % 360) + 360) % 360) / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let r = 0
  let g = 0
  let b = 0
  if (hp < 1) {
    r = c
    g = x
  } else if (hp < 2) {
    r = x
    g = c
  } else if (hp < 3) {
    g = c
    b = x
  } else if (hp < 4) {
    g = x
    b = c
  } else if (hp < 5) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }
  const m = ln - c / 2
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

export function hslToHex(h: number, s: number, l: number): string {
  return rgbToHex(...hslToRgb(h, s, l))
}

export function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  const clamp = Math.max(0, Math.min(1, t))
  return rgbToHex(
    ca[0] + (cb[0] - ca[0]) * clamp,
    ca[1] + (cb[1] - ca[1]) * clamp,
    ca[2] + (cb[2] - ca[2]) * clamp
  )
}

export function shade(hex: string, target: "white" | "black", amount: number): string {
  return mixHex(hex, target === "white" ? "#ffffff" : "#000000", amount)
}

export function hueOf(hex: string): number {
  return rgbToHsl(...hexToRgb(hex)).h
}

export function satOf(hex: string): number {
  return rgbToHsl(...hexToRgb(hex)).s
}

/** Tailwind-style brand ramp: hue-stable, lightness-stepped 50 -> 950. */
export function buildBrandScale(hex: string): Record<string, string> {
  const { h, s } = rgbToHsl(...hexToRgb(hex))
  const sat = Math.min(s, 95)
  const steps: [string, number, number][] = [
    ["50", 0.97, 0.9],
    ["100", 0.94, 0.82],
    ["200", 0.88, 0.72],
    ["300", 0.78, 0.64],
    ["400", 0.66, 0.58],
    ["500", 0.55, 0.62],
    ["600", 0.46, 0.68],
    ["700", 0.37, 0.72],
    ["800", 0.28, 0.72],
    ["900", 0.2, 0.7],
    ["950", 0.13, 0.68],
  ]
  const out: Record<string, string> = {}
  for (const [key, lightness, satScale] of steps) {
    out[key] = hslToHex(h, Math.max(4, Math.min(100, sat * satScale)), lightness * 100)
  }
  return out
}

/** True-gray neutral ramp (hue 222) or softly brand-tinted when tintHex is provided. */
export function buildNeutralScale(tintHex?: string): Record<string, string> {
  const tintHue = tintHex ? hueOf(tintHex) : 222
  const tintSat = tintHex ? Math.min(satOf(tintHex), 14) : 6
  const steps: [string, number][] = [
    ["0", 100],
    ["50", 98],
    ["100", 96],
    ["200", 93],
    ["300", 88],
    ["400", 78],
    ["500", 66],
    ["600", 52],
    ["700", 40],
    ["800", 28],
    ["900", 18],
    ["950", 10],
    ["1000", 4],
  ]
  const out: Record<string, string> = {}
  for (const [key, lightness] of steps) out[key] = hslToHex(tintHue, tintSat, lightness)
  return out
}

/** Distinct fixed semantic hues (green/amber/red/blue) with bg/border/dark variants. */
export function buildSemanticColors(): Record<string, string> {
  const base: Record<string, string> = {
    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
    info: "#2563EB",
  }
  const out: Record<string, string> = {}
  for (const [name, hex] of Object.entries(base)) {
    out[name] = hex
    out[`${name}Bg`] = mixHex(hex, "#ffffff", 0.86)
    out[`${name}Border`] = mixHex(hex, "#ffffff", 0.55)
    out[`${name}Dark`] = mixHex(hex, "#000000", 0.35)
  }
  return out
}

/** Distinct-hue categorical palette, seeded by the brand hue. */
export function buildChartPalette(brand: string): string[] {
  const h = hueOf(brand)
  const out: string[] = []
  for (let i = 0; i < 8; i++) {
    const hue = (h + i * 45 + (i % 2 === 0 ? 0 : 15)) % 360
    const l = i % 3 === 0 ? 52 : i % 3 === 1 ? 62 : 42
    const s = i % 2 === 0 ? 66 : 72
    out.push(hslToHex(hue, s, l))
  }
  return out
}

export function buildGradients(p: string, s: string, a: string): Record<string, string> {
  return {
    primary: `linear-gradient(135deg, ${p} 0%, ${mixHex(p, s, 0.55)} 100%)`,
    brand: `linear-gradient(135deg, ${p} 0%, ${a} 100%)`,
    subtle: `linear-gradient(180deg, ${mixHex(p, "#ffffff", 0.92)} 0%, rgba(255,255,255,0) 100%)`,
    dark: `linear-gradient(160deg, ${mixHex(p, "#000000", 0.25)} 0%, ${mixHex(p, "#000000", 0.6)} 100%)`,
  }
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

export function contrastLabel(ratio: number): string {
  const r = ratio.toFixed(1)
  if (ratio >= 7) return `AAA Pass (${r}:1)`
  if (ratio >= 4.5) return `AA Pass (${r}:1)`
  return `Fail (${r}:1)`
}

/** Computed (never fabricated) contrast summary from the actual generated colors. */
export function buildContrastReport(colors: {
  primary: string
  primaryDark: string
  primaryLight: string
  neutral: Record<string, string>
  text: Record<string, string>
  semantic: Record<string, string>
}): Record<string, string> {
  return {
    "Primary on White": contrastLabel(contrastRatio(colors.primary, "#ffffff")),
    "Primary on Black": contrastLabel(contrastRatio(colors.primary, "#000000")),
    "Text on Background": contrastLabel(contrastRatio(colors.text.primary, "#ffffff")),
    "Secondary Text on Background": contrastLabel(contrastRatio(colors.text.secondary, "#ffffff")),
    "White on Primary": contrastLabel(contrastRatio("#ffffff", colors.primary)),
    "Body on Surface": contrastLabel(contrastRatio(colors.neutral[900], "#ffffff")),
  }
}
