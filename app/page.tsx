"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { ArrowRight, CheckCircle2, Copy, Database, Eye, EyeOff, LayoutDashboard, Lock, RefreshCw, Save, Shield, Sparkles, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { getPasswordStorageSnapshot, savePassword, type Category } from "@/lib/password-storage"

const PasswordDashboard = dynamic(() => import("@/components/password-dashboard").then((mod) => mod.PasswordDashboard), {
  ssr: false,
})

const PasswordScene = dynamic(() => import("@/components/password-scene").then((mod) => mod.PasswordScene), {
  ssr: false,
})

const COPYRIGHT_LABEL = `\u00A9 ${new Date().getFullYear()} Dikshita Konwar`

function ToggleTile({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 border p-4 transition-[transform,border-color,background-color,box-shadow] duration-200",
        checked
          ? "border-primary/35 bg-primary/10 shadow-[0_18px_32px_-26px_rgba(138,73,49,0.45)]"
          : "border-border bg-background/82 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-accent/55",
      )}
    >
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.12em]">{label}</div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  )
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [strength, setStrength] = useState(0)
  const [passwordLabel, setPasswordLabel] = useState("")
  const [passwordCategory, setPasswordCategory] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [showScene, setShowScene] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [passwordStats, setPasswordStats] = useState({ total: 0, weak: 0, fair: 0, good: 0, strong: 0 })
  const { toast } = useToast()

  const generatePassword = () => {
    let charset = ""
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if (excludeSimilar) charset = charset.replace(/[il1Lo0O]/g, "")

    if (!charset) {
      toast({ title: "Error", description: "Please select at least one character type", variant: "destructive" })
      return
    }

    let next = ""
    for (let i = 0; i < length[0]; i++) next += charset.charAt(Math.floor(Math.random() * charset.length))
    setPassword(next)

    let score = 0
    if (next.length >= 8) score += 20
    if (next.length >= 12) score += 10
    if (next.length >= 16) score += 10
    if (/[a-z]/.test(next)) score += 15
    if (/[A-Z]/.test(next)) score += 15
    if (/[0-9]/.test(next)) score += 15
    if (/[^A-Za-z0-9]/.test(next)) score += 15
    setStrength(Math.min(score, 100))
  }

  const loadData = () => {
    const snapshot = getPasswordStorageSnapshot()
    setPasswordStats(snapshot.passwordStats)
    setCategories(snapshot.categories)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      toast({ title: "Copied!", description: "Password copied to clipboard" })
    } catch {
      toast({ title: "Error", description: "Failed to copy password", variant: "destructive" })
    }
  }

  const handleSavePassword = () => {
    if (!password) {
      toast({ title: "Error", description: "No password to save", variant: "destructive" })
      return
    }

    const label = passwordLabel.trim() || `Password ${new Date().toLocaleDateString()}`
    const success = savePassword({
      password,
      label,
      strength,
      length: length[0],
      category: passwordCategory || undefined,
      settings: { includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar },
    })

    if (!success) {
      toast({ title: "Error", description: "Failed to save password", variant: "destructive" })
      return
    }

    toast({ title: "Saved!", description: `Password "${label}" saved successfully` })
    setPasswordLabel("")
    setPasswordCategory("")
    setShowSaveDialog(false)
    loadData()
  }

  useEffect(() => {
    generatePassword()
    loadData()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(max-width: 1023px), (prefers-reduced-motion: reduce)").matches) return
    const timeoutId = window.setTimeout(() => setShowScene(true), 180)
    return () => window.clearTimeout(timeoutId)
  }, [])

  if (showDashboard) return <PasswordDashboard onClose={() => setShowDashboard(false)} />

  const strengthMeta =
    strength < 30
      ? { label: "Weak", tone: "bg-red-600 text-white border-red-600", note: "Too easy to crack" }
      : strength < 60
        ? { label: "Fair", tone: "bg-amber-500 text-stone-950 border-amber-500", note: "Usable, not ideal" }
        : strength < 80
          ? { label: "Good", tone: "bg-secondary text-secondary-foreground border-secondary", note: "Solid everyday choice" }
          : { label: "Strong", tone: "bg-primary text-primary-foreground border-primary", note: "Ready for critical accounts" }

  const characterOptions = [
    { id: "uppercase", label: "Uppercase", description: "Add A-Z", checked: includeUppercase, onCheckedChange: setIncludeUppercase },
    { id: "lowercase", label: "Lowercase", description: "Add a-z", checked: includeLowercase, onCheckedChange: setIncludeLowercase },
    { id: "numbers", label: "Numbers", description: "Add 0-9", checked: includeNumbers, onCheckedChange: setIncludeNumbers },
    { id: "symbols", label: "Symbols", description: "Add punctuation", checked: includeSymbols, onCheckedChange: setIncludeSymbols },
  ]
  const protocolNotes = [
    "Local vault only",
    "No account wall",
    "PWA offline access",
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_left,rgba(80,95,145,0.16),transparent_38%),radial-gradient(circle_at_top_right,rgba(162,92,54,0.18),transparent_42%)]" />
      <div className="pointer-events-none absolute left-6 top-28 h-32 w-32 border border-primary/20 sm:left-12 sm:h-44 sm:w-44" />
      <div className="pointer-events-none absolute right-[-5rem] top-20 h-56 w-56 rounded-full bg-primary/8 blur-3xl sm:right-0" />
      {showScene ? (
        <PasswordScene
          strength={strength}
          className="pointer-events-none absolute right-[-16rem] top-[-4rem] hidden w-[52rem] opacity-40 mix-blend-multiply lg:block dark:mix-blend-screen animate-drift [mask-image:linear-gradient(90deg,transparent_0%,black_28%,black_100%)]"
        />
      ) : null}

      <div className="relative z-10 px-4 py-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-7xl animate-rise-in border border-border bg-background/88">
          <div className="grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex flex-wrap items-center gap-4">
              <div className="border-r border-border pr-4">
                <div className="cipher-kicker">SecurePass</div>
                <div className="font-serif text-[1.85rem] tracking-[-0.05em]">Cipher Bureau</div>
              </div>
              <Badge variant="outline">Private vault</Badge>
              <Badge variant="outline">Offline ready</Badge>
              <Badge variant="outline">Local-first</Badge>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <Button asChild variant="ghost" className="px-0 text-[0.72rem] sm:px-4">
                <Link href="/about">About the system</Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto mt-6 max-w-7xl space-y-6">
          <section className="animate-rise-in border border-border bg-background/84 px-4 py-3 sm:px-6" style={{ animationDelay: "70ms" }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">Editorial workbench for private password generation and local vault control.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {protocolNotes.map((note) => (
                  <Badge key={note} variant="outline">{note}</Badge>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
            <div className="animate-rise-in border border-border bg-card/90 p-5 sm:p-7" style={{ animationDelay: "120ms" }}>
              <div className="cipher-kicker">Generator desk</div>
              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_11rem]">
                <div className="space-y-5">
                  <h1 className="max-w-4xl font-serif text-[clamp(3.2rem,8vw,6.4rem)] leading-[0.9] tracking-[-0.07em] text-balance">
                    Build a password that feels impossible to guess.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                    Tune the sequence, audit the strength instantly, then copy it or archive it in your local vault when it earns a place there.
                  </p>
                </div>
                <div className="grid gap-3 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                  <div className="border border-border bg-background/82 p-4">
                    <div className="cipher-kicker">Stored</div>
                    <div className="mt-2 text-4xl font-semibold tracking-[-0.05em]">{passwordStats.total}</div>
                  </div>
                  <div className="border border-border bg-background/82 p-4">
                    <div className="cipher-kicker">Strong</div>
                    <div className="mt-2 text-4xl font-semibold tracking-[-0.05em]">{passwordStats.strong}</div>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-3 border-t border-border pt-5 md:grid-cols-3">
                <div className="vault-sheet p-4">
                  <div className="cipher-kicker">Primary action</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Generate first. Save only when the sequence deserves to live in the vault.</p>
                </div>
                <div className="vault-sheet p-4">
                  <div className="cipher-kicker">Failure mode</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Weak passwords are surfaced immediately so the next run is obvious, not hidden.</p>
                </div>
                <div className="vault-sheet p-4">
                  <div className="cipher-kicker">Vault model</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Everything stays local unless you explicitly export it for backup or transfer.</p>
                </div>
              </div>
            </div>

            <aside className="animate-rise-in border border-border bg-background/88 p-5 sm:p-6" style={{ animationDelay: "170ms" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="cipher-kicker">Live reading</div>
                  <div className="mt-2 font-serif text-[clamp(2.8rem,7vw,4.8rem)] leading-[0.9] tracking-[-0.07em]">
                    {strength}
                    <span className="ml-1 text-muted-foreground">/100</span>
                  </div>
                </div>
                <Badge className={cn("px-3 py-1", strengthMeta.tone)}>{strengthMeta.label}</Badge>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{strengthMeta.note}</p>
              <Progress value={strength} className="mt-5 h-3 rounded-none" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="border border-border bg-card/86 p-4">
                  <div className="cipher-kicker">Length</div>
                  <div className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{length[0]}</div>
                </div>
                <div className="border border-border bg-card/86 p-4">
                  <div className="cipher-kicker">Groups</div>
                  <div className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{characterOptions.filter((option) => option.checked).length}</div>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button variant="outline" onClick={() => setShowDashboard(true)} className="justify-between">
                  Vault dashboard
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
                <Button asChild variant="outline" className="justify-between">
                  <Link href="/about">
                    Why it works
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </aside>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
            <Card className="animate-rise-in overflow-hidden border-border bg-card/94" style={{ animationDelay: "210ms" }}>
              <CardHeader className="cipher-rule gap-5 border-b border-border py-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-3">
                    <div className="cipher-kicker">Primary workbench</div>
                    <CardTitle className="font-serif text-[clamp(2.1rem,4vw,3.6rem)] tracking-[-0.05em]">Sequence generator</CardTitle>
                    <CardDescription className="max-w-2xl text-base leading-7">
                      Reveal, copy, or save the current sequence once it passes the threshold you want.
                    </CardDescription>
                  </div>
                  <Badge className={cn("px-4 py-1.5", strengthMeta.tone)}>{strengthMeta.label} sequence</Badge>
                </div>
              </CardHeader>

              <CardContent className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
                <div className="space-y-6">
                  <div className="border border-border bg-background/86 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="cipher-kicker">Generated output</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">Reveal, copy, or save the current sequence.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
                        <span className="inline-flex items-center gap-1 border border-border bg-background/84 px-2.5 py-1">
                          <Lock className="h-3.5 w-3.5 text-primary" />
                          Local
                        </span>
                        <span className="inline-flex items-center gap-1 border border-border bg-background/84 px-2.5 py-1">
                          <Copy className="h-3.5 w-3.5 text-primary" />
                          Clipboard-ready
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                          <DialogTrigger asChild>
                            <Button size="icon">
                              <Save className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl p-0">
                            <div className="space-y-6 p-6 sm:p-7">
                              <DialogHeader className="space-y-3 text-left">
                                <Badge variant="outline">Archive sequence</Badge>
                                <div className="space-y-2">
                                  <DialogTitle className="font-serif text-3xl tracking-[-0.04em]">Save Password</DialogTitle>
                                  <DialogDescription className="max-w-md text-sm leading-7">
                                    Add a clear label and optional category before storing this password locally.
                                  </DialogDescription>
                                </div>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="label" className="cipher-kicker text-foreground">Password label</Label>
                                  <Input id="label" value={passwordLabel} onChange={(event) => setPasswordLabel(event.target.value)} placeholder="e.g. Primary email or admin login" className="h-12" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="category" className="cipher-kicker text-foreground">Category</Label>
                                  <Select value={passwordCategory} onValueChange={setPasswordCategory}>
                                    <SelectTrigger className="h-12 w-full">
                                      <Tag className="mr-2 h-4 w-4" />
                                      <SelectValue placeholder="Assign a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                          <div className="flex items-center gap-2">
                                            <span>{category.icon}</span>
                                            {category.name}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter className="border-t border-border pt-4">
                                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                                <Button onClick={handleSavePassword}>Save password</Button>
                              </DialogFooter>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="mt-4 border border-border bg-card/90 p-4 sm:p-5">
                      <div className="break-all font-mono text-[1rem] leading-8 sm:text-[1.15rem]">
                        {showPassword ? password : "•".repeat(Math.max(password.length, length[0]))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
                    <div className="border border-border bg-background/82 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="cipher-kicker">Strength meter</div>
                          <div className="mt-2 text-4xl font-semibold tracking-[-0.05em]">{strength}%</div>
                        </div>
                        <Badge className={cn("px-3 py-1", strengthMeta.tone)}>{strengthMeta.label}</Badge>
                      </div>
                      <Progress value={strength} className="mt-4 h-3 rounded-none" />
                    </div>
                    <div className="border border-border bg-background/82 p-4 sm:p-5">
                      <div className="cipher-kicker">Length dial</div>
                      <div className="mt-2 text-5xl font-semibold tracking-[-0.06em]">{length[0]}</div>
                      <div className="mt-5">
                        <Slider value={length} onValueChange={setLength} max={128} min={4} step={1} className="w-full" />
                      </div>
                    </div>
                  </div>

                  <div className="border border-border bg-background/82 p-4 sm:p-5">
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <div>
                        <div className="cipher-kicker">Character groups</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">Enable the sets you want in the final password.</p>
                      </div>
                      <Badge variant="outline">{characterOptions.filter((option) => option.checked).length} active</Badge>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {characterOptions.map((option) => (
                        <ToggleTile key={option.id} {...option} />
                      ))}
                    </div>
                    <div className="mt-3">
                      <ToggleTile
                        id="exclude-similar"
                        label="Exclude similar"
                        description="Remove i, l, 1, L, o, 0, and O for better readability."
                        checked={excludeSimilar}
                        onCheckedChange={setExcludeSimilar}
                      />
                    </div>
                  </div>

                  <Button onClick={generatePassword} size="lg" className="justify-center gap-3">
                    <RefreshCw className="h-5 w-5" />
                    Generate fresh sequence
                  </Button>
                </div>

                <aside className="space-y-4 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-6">
                  <div className="border border-border bg-background/82 p-4">
                    <div className="cipher-kicker">Protocol notes</div>
                    <div className="mt-4 space-y-4">
                      <div className="flex gap-3"><Shield className="mt-0.5 h-4 w-4 text-primary" /><p className="text-sm leading-6 text-muted-foreground">Use longer strings for banking, email, and admin credentials.</p></div>
                      <div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /><p className="text-sm leading-6 text-muted-foreground">Similar-character exclusion helps when a password will be typed manually.</p></div>
                      <div className="flex gap-3"><Database className="mt-0.5 h-4 w-4 text-primary" /><p className="text-sm leading-6 text-muted-foreground">Save only the passwords you need to revisit. Everything else can stay transient.</p></div>
                    </div>
                  </div>
                  <div className="border border-border bg-primary p-4 text-primary-foreground">
                    <div className="cipher-kicker text-primary-foreground/80">Next step</div>
                    <p className="mt-3 text-sm leading-7 text-primary-foreground/90">Open the dashboard to sort saved entries, manage categories, and run import or export jobs.</p>
                    <Button variant="outline" onClick={() => setShowDashboard(true)} className="mt-4 w-full border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/12">
                      <LayoutDashboard className="h-4 w-4" />
                      Open dashboard
                    </Button>
                  </div>
                </aside>
              </CardContent>
            </Card>

            <Card className="animate-rise-in border-border bg-card/92" style={{ animationDelay: "260ms" }}>
              <CardHeader className="gap-3">
                <div className="cipher-kicker">System advantages</div>
                <CardTitle className="font-serif text-[2rem] tracking-[-0.05em]">Built for quick trust</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Generate instantly without an account wall.",
                  "Keep everything local unless you export on purpose.",
                  "Jump into the vault only when organization is useful.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 border border-border bg-background/84 p-4">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="mx-auto mt-8 max-w-7xl border-t border-border pt-4">
          <p className="text-right text-sm uppercase tracking-[0.18em] text-muted-foreground/90">{COPYRIGHT_LABEL}</p>
        </footer>
      </div>
    </div>
  )
}
