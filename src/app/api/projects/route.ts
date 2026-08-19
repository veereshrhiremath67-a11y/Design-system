import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      brandName: true,
      status: true,
      createdAt: true,
    },
  })

  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const project = await prisma.project.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
