import { describe, expect, test } from "bun:test"
import { lintMarkdownContent } from "./lint-prose"

describe("SO4 prose linter (DX-053)", () => {
  test("flags prohibited weak words as correctness errors", () => {
    const markdown = "You simply connect your wallet and it is obviously easy to trade."
    const result = lintMarkdownContent("test.md", markdown)

    expect(result.errors.length).toBeGreaterThanOrEqual(3)
    const rules = result.errors.map((e) => e.rule)
    expect(rules).toContain("banned-words")
  })

  test("flags exclamation marks as correctness errors", () => {
    const markdown = "Welcome to SO4 Markets!"
    const result = lintMarkdownContent("test.md", markdown)

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].rule).toBe("no-exclamation-mark")
  })

  test("enforces product and protocol capitalization", () => {
    const markdown = "Deploy your contract to stellar using soroban and freighter."
    const result = lintMarkdownContent("test.md", markdown)

    expect(result.errors.length).toBe(3)
    const messages = result.errors.map((e) => e.message)
    expect(messages.some((m) => m.includes("Stellar"))).toBe(true)
    expect(messages.some((m) => m.includes("Soroban"))).toBe(true)
    expect(messages.some((m) => m.includes("Freighter"))).toBe(true)
  })

  test("flags sentence length > 30 words as style warning", () => {
    const longSentence =
      "This is an exceptionally long sentence designed specifically to test the prose linter sentence length threshold rule which ensures that every technical sentence remains clear concise and readable for traders and integrators reading our documentation."
    const result = lintMarkdownContent("test.md", longSentence)

    expect(result.warnings.some((w) => w.rule === "sentence-length")).toBe(true)
  })

  test("flags passive voice constructions as style warning", () => {
    const passiveText = "The collateral is managed by the order vault contract."
    const result = lintMarkdownContent("test.md", passiveText)

    expect(result.warnings.some((w) => w.rule === "prefer-active-voice")).toBe(true)
  })

  test("passes clean compliant markdown without errors", () => {
    const cleanMarkdown = `---
title: Understanding Perpetual Futures
description: Perpetual futures allow traders to gain exposure to market price movements without holding underlying assets.
updated: 2026-08-28
status: stable
---

# Perpetual Futures

Perpetual futures track spot index prices through periodic funding payments.`

    const result = lintMarkdownContent("clean.mdx", cleanMarkdown)
    expect(result.errors).toHaveLength(0)
  })
})
