"use client"

import { useState, useEffect, useRef, startTransition } from "react"
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
  const [formData, setFormData] = useState<{
    teamSize: string;
    useCase: string;
    tools: ToolInput[];
  }>({
    teamSize: "1-2",
    useCase: "Coding",
    tools: []
  })

  // State for the tool selection UI
  const [availableTools] = useState(Object.keys(PRICING))
  const [selectedTool, setSelectedTool] = useState(Object.keys(PRICING)[0])

  // Use a ref to track if we've loaded from localStorage to avoid saving defaults over saved data
  const hasLoaded = useRef(false)

  // Load from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("spendwise-draft")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        startTransition(() => {
          setFormData({
            teamSize: parsed.teamSize || "1-2",
            useCase: parsed.useCase || "Coding",
            tools: parsed.tools || []
          })
          hasLoaded.current = true
        })
      } catch (e) {
        console.error("Failed to parse saved draft", e)
        hasLoaded.current = true
      }
    } else {
      hasLoaded.current = true
    }
  }, [])

  // Save to localstorage on change, but only after initial load
  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem("spendwise-draft", JSON.stringify(formData))
    }
  }, [formData])

  const getPlanPrice = (toolName: string, planName: string): number => {
    const toolPricing = PRICING[toolName as keyof typeof PRICING] as Record<string, number>
    return toolPricing?.[planName] ?? 0
  }

  const addTool = () => {
    const plans = Object.keys(PRICING[selectedTool as keyof typeof PRICING])
    const defaultPlan = plans[0]
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, { tool: selectedTool, plan: defaultPlan, seats: 1, spend: getPlanPrice(selectedTool, defaultPlan) }]
    }))
  }

  const removeTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }))
  }

  const updateTool = <K extends keyof ToolInput>(index: number, field: K, value: ToolInput[K]) => {
    setFormData(prev => {
      const newTools = [...prev.tools]
      newTools[index] = { ...newTools[index], [field]: value }
      
      if (field === "plan" || field === "seats") {
        const pricePerSeat = getPlanPrice(newTools[index].tool, newTools[index].plan)
        if (pricePerSeat > 0) {
          newTools[index].spend = pricePerSeat * newTools[index].seats
        }
      }
      return { ...prev, tools: newTools }
    })
  }

  const runAudit = async () => {
    const context: AuditContext = { teamSize: formData.teamSize, primaryUseCase: formData.useCase, tools: formData.tools }
    
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
                <Select value={formData.teamSize} onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}>
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
                      onClick={() => setFormData(prev => ({ ...prev, useCase: uc }))}
                      className={`p-4 rounded-lg border cursor-pointer text-center transition-colors ${formData.useCase === uc ? "border-brand-primary bg-brand-primary/10 text-brand-accent" : "border-border hover:border-muted-foreground"}`}
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
              {formData.tools.map((t, i) => (
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
                  ${formData.tools.reduce((sum, t) => sum + t.spend, 0).toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Summary of Tools</Label>
                <ul className="space-y-2">
                  {formData.tools.map((t, i) => (
                    <li key={i} className="flex justify-between text-sm p-2 bg-surface-0 rounded">
                      <span>{t.seats}x {t.tool} ({t.plan})</span>
                      <span className="font-mono">${t.spend}</span>
                    </li>
                  ))}
                  {formData.tools.length === 0 && <li className="text-muted-foreground text-sm">No tools added.</li>}
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
            <Button onClick={runAudit} className="bg-brand-primary hover:bg-brand-accent text-white" disabled={formData.tools.length === 0}>Run Audit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
