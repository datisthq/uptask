import { describe, expect, it, vi } from "vitest"
import { batchFunctions } from "../batchFunctions.js"

describe("batchFunctions", () => {
  it("should execute all functions", async () => {
    const fn1 = vi.fn().mockResolvedValue("result1")
    const fn2 = vi.fn().mockResolvedValue("result2")
    const fn3 = vi.fn().mockResolvedValue("result3")

    await batchFunctions([fn1, fn2, fn3])

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
    expect(fn3).toHaveBeenCalledTimes(1)
  })

  it("should handle empty array", async () => {
    await expect(batchFunctions([])).resolves.toBeUndefined()
  })

  it("should handle function rejections", async () => {
    const fn1 = vi.fn().mockResolvedValue("result1")
    const fn2 = vi.fn().mockRejectedValue(new Error("Test error"))
    const fn3 = vi.fn().mockResolvedValue("result3")

    await expect(batchFunctions([fn1, fn2, fn3])).rejects.toThrow("Test error")

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
    // fn3 might or might not be called depending on execution timing
  })

  it("should respect concurrency limit", async () => {
    let runningCount = 0
    let maxConcurrent = 0

    const createDelayedFn = () => () => {
      runningCount++
      maxConcurrent = Math.max(maxConcurrent, runningCount)

      return new Promise<void>(resolve => {
        setTimeout(() => {
          runningCount--
          resolve()
        }, 50)
      })
    }

    const fns = Array.from({ length: 10 }, () => createDelayedFn())

    await batchFunctions(fns, { concurrency: 3 })

    expect(maxConcurrent).toBeLessThanOrEqual(3)
  })

  it("should run with unlimited concurrency by default", async () => {
    let runningCount = 0
    let maxConcurrent = 0

    const createDelayedFn = () => () => {
      runningCount++
      maxConcurrent = Math.max(maxConcurrent, runningCount)

      return new Promise<void>(resolve => {
        setTimeout(() => {
          runningCount--
          resolve()
        }, 10)
      })
    }

    const fns = Array.from({ length: 10 }, () => createDelayedFn())

    await batchFunctions(fns)

    // All functions should start at virtually the same time
    expect(maxConcurrent).toBe(10)
  })
})
