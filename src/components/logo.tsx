import type { CSSProperties } from "react"

/**
 * logo.tsx — DS Generator "token grid" mark.
 * A rounded-square frame holding four design-token tiles (solid, solid, hollow,
 * notched) so the mark reads as a design system in a single color.
 * Inherits `currentColor`, so pass `text-primary` (or a style color) to theme it.
 */
export function Logo({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-hidden>
      <rect x="2.5" y="2.5" width="27" height="27" rx="7" stroke="currentColor" strokeWidth="2.4" />
      <rect x="7" y="7" width="7.5" height="7.5" rx="1.8" fill="currentColor" />
      <rect x="17.5" y="7" width="7.5" height="7.5" rx="1.8" fill="currentColor" />
      <rect x="7" y="17.5" width="7.5" height="7.5" rx="1.8" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M19.3 17.5 L22.7 17.5 L24.5 19.3 L24.5 22.7 Q24.5 25 22.7 25 L19.3 25 Q17.5 25 17.5 22.7 L17.5 19.3 Q17.5 17.5 19.3 17.5 Z"
        stroke="currentColor"
        strokeWidth="1.9"
      />
    </svg>
  )
}
