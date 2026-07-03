import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CS Vertex — Grand Opening',
  description: 'CS Vertex Grand Launch Cinematic Experience',
}

/**
 * Isolated layout for /launch-demo.
 * NOTE: In Next.js App Router, only the ROOT layout can contain <html>/<body>.
 * This layout just passes children through — the cinematic component
 * itself renders position:fixed and covers the full viewport.
 */
export default function LaunchDemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
