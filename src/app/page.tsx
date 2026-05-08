import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-surface-0 px-4 pt-20">
      <section className="max-w-4xl w-full text-center space-y-8 mb-24">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-brand-accent mb-4">
          <span className="flex h-2 w-2 rounded-full bg-brand-accent mr-2"></span>
          Finance-grade AI audit
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-display">
          Stop overpaying for AI tools.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Audit your startup&apos;s AI stack in 2 minutes. Uncover hidden savings, eliminate redundant seats, and optimize your vendor spend instantly.
        </p>
        <div className="flex justify-center pt-4">
          <Link href="/audit">
            <Button size="lg" className="h-14 px-8 text-lg bg-brand-primary hover:bg-brand-accent text-white font-semibold rounded-xl">
              Start Free Audit
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl w-full mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-display">How it works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Input your stack", desc: "Tell us what tools your team uses and your current seat counts." },
            { step: "2", title: "Run the engine", desc: "Our rules engine analyzes your stack against current pricing data." },
            { step: "3", title: "Get your savings", desc: "Receive actionable recommendations to cut your monthly AI bill." }
          ].map((s) => (
            <div key={s.step} className="p-8 rounded-2xl bg-surface-1 border border-border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-accent font-bold text-xl mb-6">
                {s.step}
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-surface-1 border-y border-border py-20 mb-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8 text-muted-foreground">Trusted by fast-growing startups (Mocked)</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            {["Acme Corp", "Globex", "Soylent", "Initech", "Umbrella"].map(company => (
              <div key={company} className="text-xl font-display font-bold">{company}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-2xl w-full mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-display">Frequently Asked Questions</h2>
        </div>
        <Accordion className="w-full">
          {[
            { q: "Is the audit really free?", a: "Yes, the basic audit is 100% free. We may offer consulting services for complex enterprise stacks later." },
            { q: "Do you need access to our billing?", a: "No. You just manually enter your seat counts and plans." },
            { q: "How accurate is the pricing data?", a: "We update our pricing models weekly to ensure our recommendations are based on the latest vendor data." },
            { q: "What tools do you support?", a: "Currently: GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, and direct API usage." },
            { q: "Will you spam my email?", a: "No. We only require email if you want to save your audit results or receive a detailed report." }
          ].map((faq, i) => (
            <AccordionItem key={i}>
              <AccordionTrigger className="text-left text-lg">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  )
}
