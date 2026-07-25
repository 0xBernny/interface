import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { FaucetPage } from "../features/faucet/components/faucet-page";
import { TradePage } from "../features/trade/components/TradePage";
import { ReferralsPage } from "../features/referrals/components/referrals-page";

// A11y Triage Guide:
// If an accessibility violation occurs, you can triage it by inspecting the violation details.
// If the issue is a known upstream component library problem or inherently unfixable at the moment,
// you can waive it by filtering out specific rules or adding `rules: { 'rule-name': { enabled: false } }`
// into the axe run config.
// Always aim to fix critical and serious violations rather than waiving them.

function renderWithRouter(component: React.ComponentType) {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component,
  });
  const routeTree = rootRoute.addChildren([indexRoute]);
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const router = createRouter({ routeTree, history });
  
  return render(<RouterProvider router={router} />);
}

describe("Accessibility Smoke Checks", () => {
  it("Faucet page has no critical/serious violations in disconnected state", async () => {
    const { container } = renderWithRouter(FaucetPage);
    const results = await axe(container);
    
    const seriousViolations = results.violations.filter(
      v => v.impact === "critical" || v.impact === "serious"
    );
    expect(seriousViolations).toEqual([]);
  });

  it("Trade page has no critical/serious violations in disconnected state", async () => {
    const { container } = renderWithRouter(TradePage);
    const results = await axe(container);
    
    const seriousViolations = results.violations.filter(
      v => v.impact === "critical" || v.impact === "serious"
    );
    expect(seriousViolations).toEqual([]);
  });

  it("Referrals page has no critical/serious violations in disconnected state", async () => {
    const { container } = renderWithRouter(ReferralsPage);
    const results = await axe(container);
    
    const seriousViolations = results.violations.filter(
      v => v.impact === "critical" || v.impact === "serious"
    );
    expect(seriousViolations).toEqual([]);
  });
});
