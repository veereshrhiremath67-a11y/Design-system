import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const url = new URL(req.url)
  const format = url.searchParams.get("format") || "css-variables"

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!project?.designData) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const data = typeof project.designData === "string" ? JSON.parse(project.designData) : project.designData
  const tokens = data.tokens

  switch (format) {
    case "css-variables": {
      const css = generateCSSVariables(tokens)
      return new NextResponse(css, {
        headers: {
          "Content-Type": "text/css",
          "Content-Disposition": `attachment; filename="${project.name}-tokens.css"`,
        },
      })
    }
    case "tailwind": {
      const config = generateTailwindConfig(tokens)
      return NextResponse.json(config)
    }
    case "json": {
      return NextResponse.json(tokens)
    }
    default:
      return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
  }
}

function generateCSSVariables(tokens: any): string {
  const vars: string[] = [":root {"]
  const colors = tokens?.colors
  if (colors) {
    if (colors.primary) vars.push(`  --color-primary: ${colors.primary};`)
    if (colors.primaryLight) vars.push(`  --color-primary-light: ${colors.primaryLight};`)
    if (colors.primaryDark) vars.push(`  --color-primary-dark: ${colors.primaryDark};`)
    if (colors.secondary) vars.push(`  --color-secondary: ${colors.secondary};`)
    if (colors.accent) vars.push(`  --color-accent: ${colors.accent};`)
    if (colors.semantic) {
      Object.entries(colors.semantic).forEach(([key, val]) => {
        vars.push(`  --color-${key}: ${val};`)
      })
    }
    if (colors.neutral) {
      Object.entries(colors.neutral).forEach(([key, val]) => {
        vars.push(`  --neutral-${key}: ${val};`)
      })
    }
  }
  if (tokens?.typography?.fontFamily) {
    vars.push(`  --font-family: ${tokens.typography.fontFamily};`)
  }
  if (tokens?.spacing?.container) {
    vars.push(`  --container-width: ${tokens.spacing.container};`)
  }
  if (tokens?.radius) {
    vars.push(`  --radius: ${tokens.radius};`)
  }
  if (tokens?.shadows) {
    Object.entries(tokens.shadows).forEach(([key, val]) => {
      vars.push(`  --shadow-${key}: ${val};`)
    })
  }
  vars.push("}")
  return vars.join("\n")
}

function generateTailwindConfig(tokens: any): any {
  const colors = tokens?.colors
  const config: any = {
    theme: {
      extend: {},
    },
  }

  if (colors) {
    config.theme.extend.colors = {}
    if (colors.primary) config.theme.extend.colors.primary = colors.primary
    if (colors.secondary) config.theme.extend.colors.secondary = colors.secondary
    if (colors.accent) config.theme.extend.colors.accent = colors.accent
    if (colors.semantic) config.theme.extend.colors.semantic = colors.semantic
    if (colors.neutral) config.theme.extend.colors.neutral = colors.neutral
  }

  if (tokens?.radius) {
    config.theme.extend.borderRadius = {
      DEFAULT: tokens.radius,
    }
  }

  if (tokens?.spacing?.scale) {
    const spacing: Record<string, string> = {}
    tokens.spacing.scale.forEach((s: number, i: number) => {
      if (i > 0) spacing[i] = `${s}px`
    })
    config.theme.extend.spacing = spacing
  }

  return config
}
