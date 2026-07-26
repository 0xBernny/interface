import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Heading, Text } from "@workspace/ui/components/text"
import { Navbar } from "../../../ui/Navbar"
import { PortfolioTab } from "./portfolio/portfolio-tab"
import { DiscoverTab } from "./discover/discover-tab"
import { AdditionalOpportunitiesTab } from "./additional/additional-opportunities-tab"
import { DistributionsTab } from "./distributions/distributions-tab"

export function EarnPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Navbar variant="app" />
      <div className="mx-auto w-full max-w-260 px-4 pb-16 pt-8 sm:px-6 lg:px-12">
        <header className="mb-7">
          <Heading level={1}>Earn</Heading>
          <Text size="base" tone="muted" className="mt-1">
            Stake SO4 and buy GLV or GM to earn rewards
          </Text>
        </header>

        <Tabs defaultValue="portfolio" className="gap-6">
          <TabsList className="h-9">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="additional">Additional opportunities</TabsTrigger>
            <TabsTrigger value="distributions">Distributions</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <PortfolioTab />
          </TabsContent>
          <TabsContent value="discover">
            <DiscoverTab />
          </TabsContent>
          <TabsContent value="additional">
            <AdditionalOpportunitiesTab />
          </TabsContent>
          <TabsContent value="distributions">
            <DistributionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
