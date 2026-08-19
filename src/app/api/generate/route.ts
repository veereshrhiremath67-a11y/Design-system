import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateDesignSystem as generateDesignSystemLegacy } from "@/lib/generator-legacy"
import { generateDesignSystemV2 } from "@/lib/generator-v2"

// Engine switch — the undo system.
//   default            -> "v2" (new professional engine)
//   DESIGN_ENGINE=legacy -> original deterministic engine (fully preserved)
const DESIGN_ENGINE: "v2" | "legacy" = process.env.DESIGN_ENGINE === "legacy" ? "legacy" : "v2"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { brandInfo, brandAssets, preferences } = await req.json()
    const designData =
      DESIGN_ENGINE === "v2"
        ? generateDesignSystemV2(brandInfo || {}, brandAssets || {}, preferences || {})
        : generateDesignSystemLegacy(brandInfo || {}, brandAssets || {}, preferences || {})

    const project = await prisma.project.create({
      data: {
        name: brandInfo?.brandName || "Untitled Design System",
        brandName: brandInfo?.brandName,
        companyName: brandInfo?.companyName,
        industry: brandInfo?.industry,
        brandPersonality: (brandInfo?.brandPersonality || []).join(", "),
        visualStyle: preferences?.visualStyle,
        theme: preferences?.theme,
        status: "completed",
        designData: JSON.stringify(designData),
        userId: session.user.id,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
