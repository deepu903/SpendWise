export interface ToolAudit {
  tool: string;
  currentSpend: number;
  recommendedAction: string;
  projectedSpend: number;
  monthlySavings: number;
  reason: string;
}

export interface ToolInput {
  tool: string;
  plan: string;
  seats: number;
  spend: number;
}

export interface AuditContext {
  teamSize: string; // "1-2" | "3-10" | "11-50" | "51-200" | "200+"
  primaryUseCase: string; // "Coding" | "Writing" | "Data" | "Research" | "Mixed"
  tools: ToolInput[];
}

export function runAuditEngine(context: AuditContext): ToolAudit[] {
  const audits: ToolAudit[] = [];
  
  for (const t of context.tools) {
    let projectedSpend = t.spend;
    let recommendedAction = "Keep your current plan.";
    let reason = "Your plan is optimal for your usage and team size.";
    let monthlySavings = 0;

    // Logic per tool
    if (t.tool === "GitHub Copilot") {
      if (t.plan === "Business" && t.seats < 5 && context.teamSize === "1-2") {
        recommendedAction = "Downgrade to GitHub Copilot Individual.";
        projectedSpend = t.seats * 10;
        reason = "For teams under 5, Individual plans provide identical core code completion features for half the price.";
      } else if (context.primaryUseCase !== "Coding" && context.primaryUseCase !== "Mixed") {
        recommendedAction = "Cancel GitHub Copilot.";
        projectedSpend = 0;
        reason = `Since your primary use case is ${context.primaryUseCase}, a dedicated coding assistant is an unnecessary expense.`;
      }
    }

    if (t.tool === "Claude") {
      if (t.plan === "Team" && t.seats < 5) {
        recommendedAction = "Switch to individual Pro accounts or API.";
        projectedSpend = t.seats * 20;
        reason = "Team plan requires a 5-seat minimum, meaning you are overpaying for unused licenses.";
      } else if (t.plan === "Pro" && t.seats > 10 && context.teamSize !== "1-2") {
        recommendedAction = "Migrate to Claude Team.";
        projectedSpend = t.seats * 30; // Wait, team is more expensive but has higher limits.
        reason = "While Team is $30/user, it provides central billing and higher usage limits necessary for larger teams.";
      }
    }

    if (t.tool === "ChatGPT") {
      if (t.plan === "Team" && t.seats < 3) {
        recommendedAction = "Downgrade to ChatGPT Plus.";
        projectedSpend = t.seats * 20;
        reason = "Team plan is optimal for 3+ users; for smaller groups, Plus offers the same model access.";
      }
    }

    if (t.tool === "Windsurf") {
      if (t.plan === "Pro" && context.teamSize !== "1-2") {
        recommendedAction = "Upgrade to Windsurf Teams for management, or consolidate coding tools.";
        projectedSpend = t.seats * 20;
        reason = "If keeping Windsurf, Teams offers organization-wide context which pays for the $5 premium in developer productivity.";
      }
    }
    
    // Cross-tool redundancies
    if (
      (t.tool === "ChatGPT" || t.tool === "Claude" || t.tool === "Gemini") &&
      context.tools.filter(x => ["ChatGPT", "Claude", "Gemini"].includes(x.tool) && x.plan !== "Free").length > 1
    ) {
      if (t.tool === "Gemini" && t.plan !== "Free") {
        recommendedAction = "Cancel Gemini Ultra and standardize on ChatGPT or Claude.";
        projectedSpend = 0;
        reason = "Maintaining multiple premium generalized LLM subscriptions creates redundant capabilities.";
      }
    }
    
    // API vs Subscription
    if ((t.tool === "Anthropic API direct" || t.tool === "OpenAI API direct") && t.spend > 100 && t.seats === 1) {
       // if high spend for 1 person on API, maybe chat UI is better
       recommendedAction = "Switch to a Pro subscription if usage is primarily conversational.";
       projectedSpend = 20;
       reason = "High individual API spend usually indicates heavy conversational use, which is capped at $20/mo on Pro plans.";
    }

    if (t.spend !== projectedSpend) {
      monthlySavings = t.spend - projectedSpend;
      // if saving is negative, meaning projected spend is higher, we might not want to recommend it as "savings"
      if (monthlySavings < 0) {
        monthlySavings = 0; // We don't frame upgrades as direct savings in this metric
      }
    }

    audits.push({
      tool: t.tool,
      currentSpend: t.spend,
      recommendedAction,
      projectedSpend,
      monthlySavings,
      reason,
    });
  }

  return audits;
}
