import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"

import { LANDING_FAQS } from "./faq.generated"

const DOCS_ORIGIN = "https://docs.so4.market"

export function LandingFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="landing-faq-title"
      className="border-t border-border px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="font-mono-num text-10 font-medium uppercase tracking-[0.14em] text-primary">
            Learn before trading
          </p>
          <h2
            id="landing-faq-title"
            className="mt-3 text-3xl font-medium tracking-tight text-foreground"
          >
            FAQ
          </h2>
        </div>
        <Accordion type="single" className="w-full border-t border-border">
          {LANDING_FAQS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger headingLevel={3}>
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  {item.answer}{" "}
                  <a
                    className="text-primary hover:underline"
                    href={`${DOCS_ORIGIN}${item.href}`}
                  >
                    {item.linkLabel}
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
