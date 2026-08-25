import { expect, test } from "@playwright/test"

test.use({ viewport: { width: 390, height: 844 } })

test("faq accordion opens via keyboard and is wired to its panel", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  const trigger = page.getByRole("button", { name: /good place to earn yield/i })
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  const controls = await trigger.getAttribute("aria-controls")
  expect(controls).toBeTruthy()

  // Retry past hydration: the trigger is server-rendered and only starts
  // responding to Enter once React has attached its handler.
  await expect(async () => {
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(trigger).toHaveAttribute("aria-expanded", "true", { timeout: 1000 })
  }).toPass({ timeout: 15_000 })
  await expect(page.locator(`#${controls}`)).toHaveAttribute("aria-hidden", "false")
})

test("roadmap scroller is keyboard reachable", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  const scroller = page.getByRole("group", { name: /roadmap timeline/i })
  await expect(scroller).toHaveAttribute("tabindex", "0")
  await scroller.focus()
  await expect(scroller).toBeFocused()
})

test("mobile menu is a modal dialog and locks body scroll", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")

  // The burger is server-rendered, so it is clickable before React has
  // attached its onClick. Retry the open until the panel actually appears
  // rather than racing hydration.
  const burger = page.getByRole("button", { name: /open menu/i })
  const dialog = page.locator('[role="dialog"]')
  await expect(async () => {
    await burger.click()
    await expect(dialog).toBeVisible({ timeout: 1000 })
  }).toPass({ timeout: 15_000 })

  await expect(dialog).toHaveAttribute("aria-modal", "true")
  await expect(dialog).toHaveAttribute("aria-label", "Site menu")
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden")

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden")
})
