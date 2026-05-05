"use client"

import { useEffect, useState, use } from "react"
import { ToolAudit, runAuditEngine } from "@/lib/audit-engine"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const [audits, setAudits] = useState<ToolAudit[]>([])
  const [summary, setSummary] = useState("Analyzing your stack...")
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [honeypot, setHoneypot] = useState("")

  useEffect(() => {
    const data = sessionStorage.getItem(`audit-${id}`)
    if (data) {
      try {
        const context = JSON.parse(data)
        const results = runAuditEngine(context)
        setAudits(results)
        
        const totalSavings = results.reduce((acc, curr) => acc + curr.monthlySavings, 0)

        // Fetch AI Summary
        fetch("/api/summary", {
          method: "POST",
          body: JSON.stringify({ audits: results, totalSavings })
        }).then(res => res.json()).then(data => setSummary(data.summary))

      } catch (e) {
        console.error(e)
      }
    }
  }, [id])

  if (!audits.length) return <div className="min-h-screen bg-surface-0 text-white flex items-center justify-center">Loading audit data...</div>

  const totalCurrent = audits.reduce((sum, a) => sum + a.currentSpend, 0)
  const totalSavings = audits.reduce((sum, a) => sum + a.monthlySavings, 0)

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/lead", {
      method: "POST",
      body: JSON.stringify({ email, company, role, honeypot, audits, totalSavings })
    })
    setLeadCaptured(true)
  }

  return (
    <div className="min-h-screen bg-surface-0 py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Summary */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold">Audit Complete</h1>
          <div className="flex flex-col md:flex-row gap-8 justify-center mt-8">
            <Card className="bg-surface-1 border-border p-8 min-w-[250px]">
              <div className="text-muted-foreground mb-2">Total Monthly Savings</div>
              <div className="text-5xl font-mono text-savings font-bold">
                ${totalSavings.toLocaleString()}
              </div>
              <div className="text-sm text-savings/80 mt-2">
                ${(totalSavings * 12).toLocaleString()} annually
              </div>
            </Card>
            <Card className="bg-surface-1 border-border p-8 min-w-[250px]">
              <div className="text-muted-foreground mb-2">Current Monthly Spend</div>
              <div className="text-5xl font-mono text-spend font-bold line-through opacity-80">
                ${totalCurrent.toLocaleString()}
              </div>
            </Card>
          </div>
        </section>

        {/* AI Summary */}
        <Card className="bg-surface-1/50 border-brand-primary/30 shadow-lg shadow-brand-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-brand-accent font-semibold">
              <span className="h-2 w-2 rounded-full bg-brand-accent animate-pulse"></span>
              AI Executive Summary
            </div>
            <p className="text-lg leading-relaxed text-gray-300">{summary}</p>
          </CardContent>
        </Card>

        {/* Breakdown Table */}
        <section className="bg-surface-1 border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-surface-2 border-b border-border">
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Current Spend</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Monthly Savings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.map((a, i) => (
                <TableRow key={i} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                  <TableCell className="font-semibold text-white">{a.tool}</TableCell>
                  <TableCell className="font-mono text-gray-400">${a.currentSpend}</TableCell>
                  <TableCell>
                    <div className="font-medium text-white mb-1">{a.recommendedAction}</div>
                    <div className="text-sm text-muted-foreground">{a.reason}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-savings">
                    ${a.monthlySavings}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Action / Lead Capture */}
        <section className="mt-16 text-center">
          {totalSavings > 500 ? (
            <div className="p-8 bg-brand-dark border border-brand-primary rounded-xl mb-8">
              <h3 className="text-2xl font-bold font-display text-white mb-4">Enterprise Optimization Detected</h3>
              <p className="mb-6 text-brand-primary/80">You're losing over $500/mo. Schedule a free optimization consult with Credex.</p>
              <Button size="lg" className="bg-brand-primary hover:bg-brand-accent text-white">Book Credex Consultation</Button>
            </div>
          ) : totalSavings < 100 ? (
            <div className="p-8 bg-surface-1 border border-border rounded-xl mb-8">
              <h3 className="text-xl font-bold font-display text-white mb-4">You're spending well.</h3>
              <p className="text-muted-foreground">Your stack is heavily optimized. Sign up to be notified when new savings opportunities apply to your stack.</p>
            </div>
          ) : null}

          {!leadCaptured ? (
            <Card className="max-w-md mx-auto bg-surface-1 border-border text-left">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold font-display mb-2">Save this audit report</h3>
                <p className="text-sm text-muted-foreground mb-6">We'll email you a copy of these recommendations to share with your team.</p>
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="hidden">
                    <input type="text" name="honeypot" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>
                  <div>
                    <Label>Email (Required)</Label>
                    <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label>Company Name (Optional)</Label>
                    <Input value={company} onChange={e => setCompany(e.target.value)} />
                  </div>
                  <div>
                    <Label>Role (Optional)</Label>
                    <Input value={role} onChange={e => setRole(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-accent">Send me the report</Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="p-8 bg-surface-1 rounded-xl inline-block">
              <div className="text-brand-accent text-xl font-bold">Report sent!</div>
              <p className="text-muted-foreground mt-2">Check your inbox for the detailed breakdown.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
