import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useTheme } from "@/ui/theme-provider"
import { Separator } from "@workspace/ui/components/separator"

function ComponentSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={title.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-16 space-y-4 py-8">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-4 rounded-lg border border-border p-6">{children}</div>
    </section>
  )
}

function ButtonExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs">XS</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🎨</Button>
          <Button size="icon-xs">🎨</Button>
          <Button size="icon-sm">🎨</Button>
          <Button size="icon-lg">🎨</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">States</h3>
        <div className="flex flex-wrap gap-2">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  )
}

function InputExamples() {
  const [value, setValue] = useState("")

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Default</label>
        <Input placeholder="Enter text..." />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">With value</label>
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type here..." />
        {value && <p className="mt-1 text-xs text-muted-foreground">You typed: {value}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Disabled</label>
        <Input placeholder="Disabled input" disabled />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Invalid</label>
        <Input placeholder="Invalid input" aria-invalid="true" />
      </div>
    </div>
  )
}

function BadgeExamples() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">With Icon</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>
            ✓ Success
          </Badge>
          <Badge variant="destructive">
            ✕ Error
          </Badge>
          <Badge variant="secondary">
            ⓘ Info
          </Badge>
        </div>
      </div>
    </div>
  )
}

function SkeletonExamples() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Text Skeleton</h3>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Avatar Skeleton</h3>
        <div className="flex gap-2">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="size-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function DialogExamples() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Example Dialog</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This is a dialog component example.</p>
          <div className="flex gap-2 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TabsExamples() {
  return (
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="mt-4">
        <p className="text-sm">Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab2" className="mt-4">
        <p className="text-sm">Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab3" className="mt-4">
        <p className="text-sm">Content for Tab 3</p>
      </TabsContent>
    </Tabs>
  )
}

export function DesignSystemPage() {
  const { theme, setTheme } = useTheme()
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop")

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Design System Gallery</h1>
              <p className="text-sm text-muted-foreground">
                Development-only gallery showing all components and tokens
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                className="rounded border border-border bg-background px-2 py-1 text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
              <select
                value={viewport}
                onChange={(e) => setViewport(e.target.value as "mobile" | "tablet" | "desktop")}
                className="rounded border border-border bg-background px-2 py-1 text-sm"
              >
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
                <option value="desktop">Desktop</option>
              </select>
            </div>
          </div>

          <nav className="mt-4 flex gap-4 overflow-x-auto pb-2 text-sm font-medium">
            <a href="#buttons" className="whitespace-nowrap text-primary hover:underline">
              Buttons
            </a>
            <a href="#inputs" className="whitespace-nowrap text-primary hover:underline">
              Inputs
            </a>
            <a href="#badges" className="whitespace-nowrap text-primary hover:underline">
              Badges
            </a>
            <a href="#tabs" className="whitespace-nowrap text-primary hover:underline">
              Tabs
            </a>
            <a href="#dialogs" className="whitespace-nowrap text-primary hover:underline">
              Dialogs
            </a>
            <a href="#skeletons" className="whitespace-nowrap text-primary hover:underline">
              Skeletons
            </a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <ComponentSection title="Buttons" description="Button component with multiple variants and sizes">
          <ButtonExamples />
        </ComponentSection>

        <Separator />

        <ComponentSection title="Inputs" description="Input field component with various states">
          <InputExamples />
        </ComponentSection>

        <Separator />

        <ComponentSection title="Badges" description="Badge component for labeling and categorization">
          <BadgeExamples />
        </ComponentSection>

        <Separator />

        <ComponentSection title="Tabs" description="Tabbed interface for organizing content">
          <TabsExamples />
        </ComponentSection>

        <Separator />

        <ComponentSection title="Dialogs" description="Dialog component for modal content">
          <DialogExamples />
        </ComponentSection>

        <Separator />

        <ComponentSection title="Skeletons" description="Skeleton loaders for content placeholders">
          <SkeletonExamples />
        </ComponentSection>
      </div>
    </div>
  )
}
