"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, Check } from "lucide-react"
import { toast } from "sonner"

interface ExportDropdownProps {
  projectId: string
}

const FORMATS = [
  { key: "css-variables", label: "CSS Variables" },
  { key: "tailwind", label: "Tailwind Config" },
  { key: "json", label: "JSON Tokens" },
]

export function ExportDropdown({ projectId }: ExportDropdownProps) {
  const [exporting, setExporting] = useState<string | null>(null)

  async function handleExport(format: string) {
    setExporting(format)
    try {
      const res = await fetch(`/api/export/${projectId}?format=${format}`)
      if (!res.ok) throw new Error("Export failed")

      const contentType = res.headers.get("content-type")
      let blob: Blob
      let filename: string

      if (contentType?.includes("text/css")) {
        blob = await res.blob()
        filename = `design-system-tokens.css`
      } else {
        const data = await res.json()
        blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        filename = `design-system-${format}.json`
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exported as ${format}`)
    } catch {
      toast.error("Export failed")
    } finally {
      setExporting(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium outline-none transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 h-9 px-4 py-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
        <Download className="h-4 w-4" />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {FORMATS.map(({ key, label }) => (
          <DropdownMenuItem key={key} onClick={() => handleExport(key)} disabled={exporting === key}>
            {exporting === key ? (
              <Check className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
