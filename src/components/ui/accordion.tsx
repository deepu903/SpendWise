import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

const Accordion = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} {...props} />
  )
)
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<HTMLDetailsElement, React.DetailsHTMLAttributes<HTMLDetailsElement>>(
  ({ className, ...props }, ref) => (
    <details ref={ref} className={cn("border-b group", className)} {...props} />
  )
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <summary
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline cursor-pointer list-none [&::-webkit-details-marker]:hidden",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
    </summary>
  )
)
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
