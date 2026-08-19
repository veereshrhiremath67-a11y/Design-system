"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Palette, Trash2, Edit, ExternalLink, Loader2, Sun, Moon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Project {
  id: string
  name: string
  brandName: string | null
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects()
    }
  }, [status])

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects")
      const data = await res.json()
      setProjects(data)
    } catch {
      toast.error("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  async function deleteProject(id: string) {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id))
        toast.success("Project deleted")
      }
    } catch {
      toast.error("Failed to delete project")
    }
  }

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className="flex-1">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">DS Generator</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{session?.user?.email}</span>
            <ThemeToggle />
            <Link href="/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New System
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {session?.user?.name || "Designer"}</h1>
          <p className="text-muted-foreground">Manage your design systems</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="py-20">
            <CardContent className="text-center space-y-4">
              <Palette className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg">No design systems yet</h3>
                <p className="text-sm text-muted-foreground mt-1">Create your first design system to get started</p>
              </div>
              <Link href="/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Design System
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      {project.brandName && (
                        <p className="text-sm text-muted-foreground mt-1">{project.brandName}</p>
                      )}
                    </div>
                    <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/project/${project.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => deleteProject(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
