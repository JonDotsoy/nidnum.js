import {
  checkDigit,
  compose,
  decompose,
  format,
  isValid,
} from "../src/nums/run"

describe("run", () => {
  describe("checkDigit", () => {
    it.each([
      ["30686957", "4"],
      ["12345678", "5"],
      ["11111111", "1"],
      ["10000013", "K"],
      ["10000004", "0"],
    ])("%s -> %s", (body, dv) => {
      expect(checkDigit(body)).toBe(dv)
    })

    it("accepts numbers", () => {
      expect(checkDigit(30686957)).toBe("4")
    })

    it.each(["30.686.957", "abc", "", "-1"])("throws on %j", (body) => {
      expect(() => checkDigit(body)).toThrow(TypeError)
    })
  })

  describe("decompose", () => {
    it.each([
      ["30.686.957-4", ["30686957", "4"]],
      ["30686957-4", ["30686957", "4"]],
      ["306869574", ["30686957", "4"]],
      ["10.000.013-k", ["10000013", "K"]],
      [" 10.000.013-K ", ["10000013", "K"]],
    ])("%j -> %j", (input, parts) => {
      expect(decompose(input)).toEqual(parts)
    })

    it.each(["", "k", "4", "12.345.678-X"])("throws on %j", (input) => {
      expect(() => decompose(input)).toThrow(TypeError)
    })
  })

  describe("compose", () => {
    it("adds dots by default", () => {
      expect(compose(["30686957", "4"])).toBe("30.686.957-4")
      expect(compose(["1000005", "k"])).toBe("1.000.005-K")
      expect(compose(["123", "6"])).toBe("123-6")
    })

    it("without dots", () => {
      expect(compose(["30686957", "4"], false)).toBe("30686957-4")
    })
  })

  describe("format", () => {
    it("normalizes any input", () => {
      expect(format("306869574")).toBe("30.686.957-4")
      expect(format("10.000.013-k", false)).toBe("10000013-K")
    })
  })

  describe("isValid", () => {
    it.each([
      "30.686.957-4",
      "306869574",
      "10.000.013-K",
      "10.000.013-k",
      "10.000.004-0",
    ])("%j is valid", (run) => {
      expect(isValid(run)).toBe(true)
    })

    it("accepts parts", () => {
      expect(isValid(["10000013", "k"])).toBe(true)
      expect(isValid(["30686957", "5"])).toBe(false)
    })

    it.each(["30.686.957-5", "10.000.013-0", "", "abc"])(
      "%j is not valid",
      (run) => {
        expect(isValid(run)).toBe(false)
      }
    )
  })
})
