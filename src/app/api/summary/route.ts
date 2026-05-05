import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { ToolAudit } from "@/lib/audit-engine"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy",
})

export async function POST(req: Request) {
  try {
    const { audits, totalSavings } = await req.json()
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ summary: "Based on your audit, we've identified key areas to optimize your AI stack. While your current configuration provides powerful capabilities, standardizing subscriptions and adjusting seat counts could reduce overhead significantly. Implement these recommendations to maintain productivity while running a more capital-efficient operation." })
    }

    const prompt = `You are a finance-focused software auditor. Review this AI tool audit and write a 100-word personalized summary paragraph explaining why they should optimize their spend. Focus on the hard numbers and the business logic. Do not use generic filler.
    
    Audit Data:
    ${JSON.stringify(audits, null, 2)}
    Total Monthly Savings: $${totalSavings}
    
    Write exactly one paragraph, around 100 words.`

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 250,
      messages: [{ role: "user", content: prompt }]
    })

    const summary = (msg.content[0] as any).text

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Anthropic API Error:", error)
    return NextResponse.json({ 
      summary: "Based on your audit, we've identified key areas to optimize your AI stack. Standardizing subscriptions and adjusting seat counts could reduce overhead significantly. Implement these recommendations to maintain productivity while running a more capital-efficient operation." 
    })
  }
}
