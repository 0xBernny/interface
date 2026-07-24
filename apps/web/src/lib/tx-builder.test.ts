import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { http, HttpResponse } from "msw"
import { server } from "../../test/msw/server"
import { sendAndPoll, TxFailedError, TxTimeoutError } from "./tx-builder"

// ─────────────────────────────────────────────────────────────────────────────
// Pre-generated signed XDR (manageData op, testnet passphrase).
// Built offline via Keypair.random() + TransactionBuilder — avoids needing
// crypto.getRandomValues in the vitest / happy-dom test environment.
// ─────────────────────────────────────────────────────────────────────────────

const signedXdr =
  "AAAAAgAAAACJlUQe5rIfK+y/H5Qf1HaXezVeHd4V/ir73+ZPR3C9LAAAAGQAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAABqY8x5AAAAAAAAAAEAAAAAAAAACgAAAAR0ZXN0AAAAAQAAAAR0ZXN0AAAAAAAAAAFHcL0sAAAAQMRdV8y7Wp7XD6PKmw13QyEylYLN/0uwVLmFB5lr3whkm2nwfCQc/6zN187UEcnnO+PAV0P7/CxHCOaZqkWhogI="

// Minimal valid XDR for getTransaction SUCCESS/FAILED responses.
// The SDK's parseTransactionInfo() expects envelopeXdr, resultXdr, and
// resultMetaXdr as base64 strings — these are minimal valid encodings.
const resultXdr = "AAAAAAAAAGQAAAAAAAAAAAAAAAA=" // TransactionResult (20 bytes)
const resultMetaXdr = "AAAAAAAAAAA="              // TransactionMeta v0 (8 bytes)

// ─────────────────────────────────────────────────────────────────────────────
// MSW handler helper — routes JSON-RPC by method
// ─────────────────────────────────────────────────────────────────────────────

type RpcBody = { id?: string | number; method?: string }

function rpcHandler(
  routes: Record<string, (body: RpcBody) => object>,
) {
  return http.post("https://soroban-testnet.stellar.org", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as RpcBody
    const handler = routes[body.method ?? ""]
    if (handler) {
      return HttpResponse.json({
        jsonrpc: "2.0",
        id: body.id ?? 1,
        result: handler(body),
      })
    }
    return HttpResponse.json({ jsonrpc: "2.0", id: body.id ?? 1, result: {} })
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Drive an async promise while advancing fake timers.
//交替 flush microtasks and advance timers so both fetch (MSW) and setTimeout
// (polling sleep) resolve.
// ─────────────────────────────────────────────────────────────────────────────

async function drive<T>(promise: Promise<T>): Promise<T> {
  let settled = false
  let resolvedValue: T | undefined
  let rejectedError: unknown

  promise.then(
    (v) => { settled = true; resolvedValue = v },
    (e) => { settled = true; rejectedError = e },
  )

  for (let i = 0; i < 50 && !settled; i++) {
    await Promise.resolve()
    await vi.advanceTimersByTimeAsync(10_000)
    await Promise.resolve()
  }

  await Promise.resolve()
  if (rejectedError !== undefined) throw rejectedError
  return resolvedValue as T
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("sendAndPoll", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("returns hash and status on successful round-trip", async () => {
    const hash = "aaaa1111bbbb2222cccc3333dddd4444eeee5555ffff6666aaaabbbbccccddddeeee"

    server.use(
      rpcHandler({
        sendTransaction: () => ({ status: "PENDING", hash }),
        getTransaction: () => ({
          status: "SUCCESS",
          hash,
          envelopeXdr: signedXdr,
          resultXdr,
          resultMetaXdr,
        }),
      }),
    )

    const result = await drive(sendAndPoll(signedXdr, { timeoutMs: 5_000 }))

    expect(result.status).toBe("SUCCESS")
    expect(result.hash).toBe(hash)
  })

  it("handles DUPLICATE status from send and resolves via poll", async () => {
    const hash = "dup0000000000000000000000000000000000000000000000000000000000"

    server.use(
      rpcHandler({
        sendTransaction: () => ({ status: "DUPLICATE", hash }),
        getTransaction: () => ({
          status: "SUCCESS",
          hash,
          envelopeXdr: signedXdr,
          resultXdr,
          resultMetaXdr,
        }),
      }),
    )

    const result = await drive(sendAndPoll(signedXdr, { timeoutMs: 5_000 }))

    expect(result.status).toBe("SUCCESS")
    expect(result.hash).toBe(hash)
  })

  it("returns null result when returnValue is absent in meta", async () => {
    const hash = "noresult0000000000000000000000000000000000000000000000000000"

    server.use(
      rpcHandler({
        sendTransaction: () => ({ status: "PENDING", hash }),
        getTransaction: () => ({
          status: "SUCCESS",
          hash,
          envelopeXdr: signedXdr,
          resultXdr,
          resultMetaXdr,
        }),
      }),
    )

    const result = await drive(sendAndPoll(signedXdr, { timeoutMs: 5_000 }))

    expect(result.status).toBe("SUCCESS")
    expect(result.result).toBeNull()
  })

  it("throws TxFailedError when sendTransaction returns ERROR", async () => {
    const hash = "err00000000000000000000000000000000000000000000000000000000"

    server.use(
      rpcHandler({
        sendTransaction: () => ({
          status: "ERROR",
          hash,
          diagnosticEvents: [],
        }),
      }),
    )

    await expect(
      drive(sendAndPoll(signedXdr)),
    ).rejects.toMatchObject({
      name: "TxFailedError",
      hash,
      message: expect.stringContaining(hash),
    })
  })

  it("throws when sendTransaction returns TRY_AGAIN_LATER", async () => {
    server.use(
      rpcHandler({
        sendTransaction: () => ({ status: "TRY_AGAIN_LATER", hash: "" }),
      }),
    )

    await expect(drive(sendAndPoll(signedXdr))).rejects.toThrow("TRY_AGAIN_LATER")
  })

  it("throws TxTimeoutError with hash and timeoutMs when poll never resolves", async () => {
    const hash = "timeout000000000000000000000000000000000000000000000000000000"
    const timeoutMs = 500

    server.use(
      rpcHandler({
        sendTransaction: () => ({ status: "PENDING", hash }),
        getTransaction: () => ({ status: "NOT_FOUND", hash }),
      }),
    )

    await expect(
      drive(sendAndPoll(signedXdr, { timeoutMs })),
    ).rejects.toMatchObject({
      name: "TxTimeoutError",
      hash,
      timeoutMs,
      message: expect.stringContaining(hash),
    })
  })

  it("throws TxFailedError when poll returns FAILED", async () => {
    const hash = "fail000000000000000000000000000000000000000000000000000000000"

    server.use(
      rpcHandler({
        sendTransaction: () => ({ status: "PENDING", hash }),
        getTransaction: () => ({
          status: "FAILED",
          hash,
          envelopeXdr: signedXdr,
          resultXdr,
          resultMetaXdr,
        }),
      }),
    )

    await expect(
      drive(sendAndPoll(signedXdr, { timeoutMs: 5_000 })),
    ).rejects.toMatchObject({
      name: "TxFailedError",
      hash,
      message: expect.stringContaining("failed"),
    })
  })

  it("polls multiple times before success", async () => {
    const hash = "multi000000000000000000000000000000000000000000000000000000"
    let pollCount = 0

    server.use(
      rpcHandler({
        sendTransaction: () => ({ status: "PENDING", hash }),
        getTransaction: () => {
          pollCount++
          if (pollCount < 3) {
            return { status: "NOT_FOUND", hash }
          }
          return {
            status: "SUCCESS",
            hash,
            envelopeXdr: signedXdr,
            resultXdr,
            resultMetaXdr,
          }
        },
      }),
    )

    const result = await drive(sendAndPoll(signedXdr, { timeoutMs: 30_000 }))

    expect(result.status).toBe("SUCCESS")
    expect(result.hash).toBe(hash)
    expect(pollCount).toBe(3)
  })
})
