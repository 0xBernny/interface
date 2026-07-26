import { useState } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Slider } from "@workspace/ui/components/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"

const BUTTON_VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const
const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const
const BADGE_VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="rounded-lg border border-border bg-card p-6">{children}</div>
    </section>
  )
}

/**
 * DS-047 / DS-049: a living catalogue of packages/ui primitives, rendered
 * with every variant/size so it doubles as:
 * - a manual QA surface for reviewing a component change across all its
 *   states at once, instead of hunting through feature pages for one that
 *   happens to use the variant you touched
 * - the fixed target for the light/dark, desktop/mobile visual regression
 *   suite (see e2e/design-system-visual.spec.ts)
 *
 * Not a Storybook replacement — no controls/knobs, no isolated iframe.
 * Just render every shipped variant so a regression is visible on sight.
 */
export function GalleryPage() {
  const [sliderValue, setSliderValue] = useState<Array<number>>([40])

  return (
    <main className="mx-auto max-w-4xl space-y-10 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Component Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every packages/ui primitive, all variants. See{" "}
          <a
            href="https://github.com/SO4-Markets/interface/blob/main/DESIGN.md"
            className="text-primary underline underline-offset-2"
          >
            DESIGN.md
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/SO4-Markets/interface/blob/main/packages/ui/CONTRIBUTING.md"
            className="text-primary underline underline-offset-2"
          >
            packages/ui/CONTRIBUTING.md
          </a>{" "}
          for how to add to this page.
        </p>
      </div>

      <Section title="Button">
        <div className="flex flex-col gap-4">
          {BUTTON_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              <span className="w-20 shrink-0 text-13 text-muted-foreground">{variant}</span>
              {BUTTON_SIZES.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap items-center gap-3">
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Input">
        <div className="max-w-sm space-y-3">
          <Input placeholder="Default input" />
          <Input placeholder="Disabled input" disabled />
          <Input aria-invalid placeholder="Invalid input" />
        </div>
      </Section>

      <Section title="Slider">
        <div className="max-w-sm">
          <Slider
            value={sliderValue}
            onValueChange={(value) => setSliderValue(Array.isArray(value) ? [...value] : [value])}
            max={100}
            step={1}
          />
          <p className="mt-2 text-13 text-muted-foreground">Value: {sliderValue[0]}</p>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="one" className="max-w-sm">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
            <TabsTrigger value="three">Three</TabsTrigger>
          </TabsList>
          <TabsContent value="one">First panel content.</TabsContent>
          <TabsContent value="two">Second panel content.</TabsContent>
          <TabsContent value="three">Third panel content.</TabsContent>
        </Tabs>
      </Section>

      <Section title="Skeleton">
        <div className="max-w-sm space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Section>

      <Section title="Separator">
        <p className="text-sm text-foreground">Above the separator</p>
        <Separator className="my-3" />
        <p className="text-sm text-foreground">Below the separator</p>
      </Section>

      <Section title="Tooltip">
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>A tooltip, positioned automatically.</TooltipContent>
        </Tooltip>
      </Section>
    </main>
  )
}
