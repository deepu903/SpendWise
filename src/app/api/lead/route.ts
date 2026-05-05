import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabaseUrl = process.env.SUPABASE_URL || "https://dummy.supabase.co"
const supabaseKey = process.env.SUPABASE_ANON_KEY || "dummy"
const supabase = createClient(supabaseUrl, supabaseKey)

const resend = new Resend(process.env.RESEND_API_KEY || "dummy")

// Simple memory store for rate limiting
const rateLimitStore = new Map<string, number>()

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    const now = Date.now()
    const lastReq = rateLimitStore.get(ip)
    
    // 1 request per minute per IP
    if (lastReq && now - lastReq < 60000) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }
    rateLimitStore.set(ip, now)

    const { email, company, role, honeypot, audits, totalSavings } = await req.json()

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true }) // Silent fail for bots
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Save to Supabase (only if keys exist)
    if (process.env.SUPABASE_URL) {
      const { error } = await supabase.from("leads").insert([
        { email, company, role, total_savings: totalSavings, raw_audit: audits }
      ])
      if (error) console.error("Supabase error:", error)
    }

    // Send email (only if key exists)
    if (process.env.RESEND_API_KEY) {
      const isHighSavings = totalSavings > 500
      await resend.emails.send({
        from: "Audit <audit@spendwise.ai>",
        to: email,
        subject: "Your AI Spend Audit Results",
        html: `<p>Thanks for using SpendWise AI.</p><p>You could save $${totalSavings}/mo on your AI stack.</p> ${isHighSavings ? "<p>We've flagged your account for a potential enterprise optimization consult.</p>" : ""}`
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Lead capture error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
