"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { ToolInput, AuditContext } from "@/lib/audit-engine"

const PRICING = {
  "GitHub Copilot": { Individual: 10, Business: 19, Enterprise: 39 },
  Claude: { Free: 0, Pro: 20, Max: 0, Team: 30, Enterprise: 0, "API direct": 0 },
  ChatGPT: { Plus: 20, Team: 30, Enterprise: 0, "API direct": 0 },
  "Anthropic API direct": { "API direct": 0 },
  "OpenAI API direct": { "API direct": 0 },
  Gemini: { Pro: 0, Ultra: 20, API: 0 },
  Windsurf: { Free: 0, Pro: 15, Teams: 20 }
}

export default function AuditForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [teamSize, setTeamSize] = useState("1-2")
  const [useCase, setUseCase] = useState("Coding")
  const [tools, setTools] = useState<ToolInput[]>([])

  const [availableTools, setAvailableTools] = useState(Object.keys(PRICING))
  const [selectedTool, setSelectedTool] = useState(Object.keys(PRICING)[0])

  // Load from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("spendwise-draft")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.teamSize) setTeamSize(parsed.teamSize)
        if (parsed.useCase) setUseCase(parsed.useCase)
        if (parsed.tools) setTools(parsed.tools)
      } catch (e) {}
    }
  }, [])

  // Save to localstorage on change
  useEffect(() => {
    localStorage.setItem("spendwise-draft", JSON.stringify({ teamSize, useCase, tools }))
  }, [teamSize, useCase, tools])

  const addTool = () => {
    const plans = Object.keys(PRICING[selectedTool as keyof typeof PRICING])
    const defaultPlan = plans[0]
    setTools([...tools, { tool: selectedTool, plan: defaultPlan, seats: 1, spend: PRICING[selectedTool as keyof typeof PRICING][defaultPlan as keyof typeof PRICING["GitHub Copilot"]] || 0 }])
  }

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index))
  }

  const updateTool = (index: number, field: keyof ToolInput, value: any) => {
    const newTools = [...tools]
    newTools[index] = { ...newTools[index], [field]: value }
    
    // Auto calculate spend if seats or plan change
    if (field === "plan" || field === "seats") {
      const toolName = newTools[index].tool as keyof typeof PRICING
      const planName = newTools[index].plan as keyof typeof PRICING["GitHub Copilot"]
      const pricePerSeat = PRICING[toolName]?.[planName] || 0
      
      // Only auto-update spend if price is fixed (not 0/API) or if it's currently 0
      if (pricePerSeat > 0) {
        newTools[index].spend = pricePerSeat * newTools[index].seats
      }
    }
    
    setTools(newTools)
  }

  const runAudit = async () => {
    const context: AuditContext = { teamSize, primaryUseCase: useCase, tools }
    
    // We will save to a temporary store, but in a real app this creates a DB record
    // We'll generate a random ID and store the payload in sessionStorage to pass to results page
    const id = Math.random().toString(36).substring(7)
    sessionStorage.setItem(`audit-${id}`, JSON.stringify(context))
    router.push(`/audit/${id}`)
  }

  return (
    <div className="min-h-screen bg-surface-0 flex justify-center py-20 px-4">
      <Card className="w-full max-w-2xl bg-surface-1 border-border">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            {step === 1 ? "Step 1: Team Context" : step === 2 ? "Step 2: Tool Stack" : "Step 3: Review"}
          </CardTitle>
          <CardDescription>
            {step === 1 ? "Help us understand your setup." : step === 2 ? "Add the AI tools your team currently pays for." : "Review your stack before we run the engine."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Team Size</Label>
                <Select value={teamSize} onChange={(e) => setTeamSize(e.target.value)}>
                  <option value="1-2">1–2</option>
                  <option value="3-10">3–10</option>
                  <option value="11-50">11–50</option>
                  <option value="51-200">51–200</option>
                  <option value="200+">200+</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Primary Use Case</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["Coding", "Writing", "Data", "Research", "Mixed"].map(uc => (
                    <div 
                      key={uc}
                      onClick={() => setUseCase(uc)}
                      className={`p-4 rounded-lg border cursor-pointer text-center transition-colors ${useCase === uc ? "border-brand-primary bg-brand-primary/10 text-brand-accent" : "border-border hover:border-muted-foreground"}`}
                    >
                      {uc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {tools.map((t, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 items-end p-4 border rounded-lg bg-surface-2 border-border">
                  <div className="w-full md:w-1/4">
                    <Label className="mb-2 block">{t.tool}</Label>
                    <Select value={t.plan} onChange={(e) => updateTool(i, "plan", e.target.value)}>
                      {Object.keys(PRICING[t.tool as keyof typeof PRICING]).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-full md:w-1/4">
                    <Label className="mb-2 block">Seats</Label>
                    <Input type="number" min="1" value={t.seats} onChange={(e) => updateTool(i, "seats", parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="w-full md:w-1/4">
                    <Label className="mb-2 block">Mo. Spend ($)</Label>
                    <Input type="number" min="0" value={t.spend} onChange={(e) => updateTool(i, "spend", parseFloat(e.target.value) || 0)} />
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => removeTool(i)} className="shrink-0 text-white hover:bg-destructive/80 shrink-0 mb-0.5">
                    ✕
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-4 pt-4 border-t border-border">
                <Select value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)}>
                  {availableTools.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
                <Button onClick={addTool} variant="secondary">Add Tool</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-surface-2 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Total Monthly Spend</div>
                <div className="text-3xl font-mono text-spend font-bold">
                  ${tools.reduce((sum, t) => sum + t.spend, 0).toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Summary of Tools</Label>
                <ul className="space-y-2">
                  {tools.map((t, i) => (
                    <li key={i} className="flex justify-between text-sm p-2 bg-surface-0 rounded">
                      <span>{t.seats}x {t.tool} ({t.plan})</span>
                      <span className="font-mono">${t.spend}</span>
                    </li>
                  ))}
                  {tools.length === 0 && <li className="text-muted-foreground text-sm">No tools added.</li>}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-border pt-6">
          <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1}>Back</Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-brand-primary hover:bg-brand-accent text-white">Next Step</Button>
          ) : (
            <Button onClick={runAudit} className="bg-brand-primary hover:bg-brand-accent text-white" disabled={tools.length === 0}>Run Audit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
