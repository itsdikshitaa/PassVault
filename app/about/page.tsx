import Link from "next/link"
import { ArrowLeft, CheckCircle2, Database, LayoutDashboard, Shield, Wifi } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FEATURE_BLOCKS = [
  {
    icon: Shield,
    title: "Local-first security",
    description: "Passwords are generated in the browser and stay on the device unless you export them on purpose.",
  },
  {
    icon: Database,
    title: "Organized vault",
    description: "Labels and categories make the vault useful once you start saving more than a few entries.",
  },
  {
    icon: Wifi,
    title: "Offline continuity",
    description: "Install the app and reopen the workspace after the first visit, even when the connection drops.",
  },
  {
    icon: LayoutDashboard,
    title: "Focused workflow",
    description: "Generate first, manage later. The interface stays lean until the vault becomes useful.",
  },
]

const SECURITY_NOTES = [
  "Use at least 12 characters whenever possible.",
  "Mix uppercase, lowercase, numbers, and symbols.",
  "Use different passwords for different accounts.",
  "Back up exported vault data somewhere you control.",
]

const COPYRIGHT_LABEL = `\u00A9 ${new Date().getFullYear()} Dikshita Konwar`

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top_left,rgba(80,95,145,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(162,92,54,0.16),transparent_38%)]" />
      <div className="pointer-events-none absolute left-[-3rem] top-24 h-40 w-40 border border-primary/15 sm:h-52 sm:w-52" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        <header className="border border-border bg-background/88 p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge variant="outline">About SecurePass</Badge>
              <h1 className="max-w-5xl font-serif text-[clamp(3rem,7vw,5.8rem)] leading-[0.9] tracking-[-0.07em] text-balance">
                A private password tool, redesigned as a sharper local workbench.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                SecurePass generates strong passwords, stores them locally, and opens cleanly offline. The product stays fast and self-contained instead of routing users through accounts and cloud setup.
              </p>
            </div>

            <Button asChild variant="outline" className="justify-between">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to generator
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {FEATURE_BLOCKS.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border bg-card/92">
              <CardHeader className="gap-3">
                <div className="flex h-12 w-12 items-center justify-center border border-border bg-background/84 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="font-serif text-[1.75rem] tracking-[-0.05em]">{title}</CardTitle>
                <CardDescription className="text-sm leading-7">{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <Card className="border-border bg-card/92">
            <CardHeader className="gap-3 border-b border-border">
              <div className="cipher-kicker">How it works</div>
              <CardTitle className="font-serif text-[2.3rem] tracking-[-0.05em]">Fast generation, deliberate storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["1", "Set the rules", "Choose length and character groups based on the account's risk."],
                  ["2", "Check the output", "Review the sequence, copy it instantly, and confirm the strength reading."],
                  ["3", "Save only if needed", "Archive the password locally when it should remain part of your working vault."],
                ].map(([step, title, text]) => (
                  <div key={step} className="border border-border bg-background/84 p-4">
                    <div className="cipher-kicker">Step {step}</div>
                    <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em]">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>

              <div className="border border-border bg-background/84 p-5">
                <div className="cipher-kicker">Why local-first matters</div>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                  <p>SecurePass avoids a hosted account model. That means the generator is available immediately, and the vault stays tied to the browser storage on the current device.</p>
                  <p>The workflow is intentionally narrow: create a strong password, keep it if you need it, and leave without managing unnecessary infrastructure.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/92">
            <CardHeader className="gap-3 border-b border-border">
              <div className="cipher-kicker">Security baseline</div>
              <CardTitle className="font-serif text-[2.3rem] tracking-[-0.05em]">Practical habits still matter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 py-6">
              {SECURITY_NOTES.map((note) => (
                <div key={note} className="flex gap-3 border border-border bg-background/84 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <p className="text-sm leading-7 text-muted-foreground">{note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <footer className="border-t border-border pt-4">
          <p className="text-right text-sm uppercase tracking-[0.18em] text-muted-foreground/90">{COPYRIGHT_LABEL}</p>
        </footer>
      </div>
    </main>
  )
}
