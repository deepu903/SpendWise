import { describe, it, expect } from "vitest"
import { runAuditEngine, AuditContext } from "../src/lib/audit-engine"

describe("Audit Engine", () => {
  it("should recommend downgrading GitHub Copilot for small teams", () => {
    const ctx: AuditContext = {
      teamSize: "1-2",
      primaryUseCase: "Coding",
      tools: [{ tool: "GitHub Copilot", plan: "Business", seats: 2, spend: 38 }]
    }
    const result = runAuditEngine(ctx)
    expect(result[0].recommendedAction).toContain("Individual")
    expect(result[0].monthlySavings).toBe(18) // 38 - 20
  })

  it("should recommend cancelling Copilot if use case is not Coding/Mixed", () => {
    const ctx: AuditContext = {
      teamSize: "11-50",
      primaryUseCase: "Data",
      tools: [{ tool: "GitHub Copilot", plan: "Individual", seats: 10, spend: 100 }]
    }
    const result = runAuditEngine(ctx)
    expect(result[0].recommendedAction).toContain("Cancel")
    expect(result[0].projectedSpend).toBe(0)
    expect(result[0].monthlySavings).toBe(100)
  })

  it("should warn against Claude Team plan for under 5 seats", () => {
    const ctx: AuditContext = {
      teamSize: "3-10",
      primaryUseCase: "Mixed",
      tools: [{ tool: "Claude", plan: "Team", seats: 3, spend: 90 }]
    }
    const result = runAuditEngine(ctx)
    expect(result[0].recommendedAction).toContain("individual Pro")
    expect(result[0].monthlySavings).toBe(30) // 90 - 60
  })

  it("should suggest consolidating premium generalized LLMs", () => {
    const ctx: AuditContext = {
      teamSize: "11-50",
      primaryUseCase: "Writing",
      tools: [
        { tool: "ChatGPT", plan: "Plus", seats: 5, spend: 100 },
        { tool: "Gemini", plan: "Ultra", seats: 5, spend: 100 }
      ]
    }
    const result = runAuditEngine(ctx)
    const geminiAudit = result.find(r => r.tool === "Gemini")
    expect(geminiAudit?.recommendedAction).toContain("Cancel Gemini Ultra")
    expect(geminiAudit?.monthlySavings).toBe(100)
  })

  it("should recommend Pro subscription for high API spend", () => {
    const ctx: AuditContext = {
      teamSize: "1-2",
      primaryUseCase: "Coding",
      tools: [{ tool: "Anthropic API direct", plan: "API direct", seats: 1, spend: 150 }]
    }
    const result = runAuditEngine(ctx)
    expect(result[0].recommendedAction).toContain("Pro subscription")
    expect(result[0].monthlySavings).toBe(130) // 150 - 20
  })
})
