import { compose, decompose, checkDigit } from "../chilean"

describe("chilean", () => {
  describe("Compose numbers", () => {
    it("With format number (Default)", () => {
      expect(compose(["11111111", "1"])).toBe("11.111.111-1")
      expect(compose(["12068692", "5"])).toBe("12.068.692-5")
      expect(compose(["11440456", "k"])).toBe("11.440.456-k")
      expect(compose(["10991878", "4"])).toBe("10.991.878-4")
    })

    it("Without format number", () => {
      expect(compose(["18349082", "6"], false)).toBe("18349082-6")
      expect(compose(["15322091", "3"], false)).toBe("15322091-3")
      expect(compose(["9673221", "k"], false)).toBe("9673221-k")
      expect(compose(["6962458", "8"], false)).toBe("6962458-8")
    })
  })

  describe("Uncompose number", () => {
    const itDecomposeArray = (input: string, output: [string, string]) => {
      it(`if ${input} is [${output.join(", ")}]`, () => {
        const [number, dv] = decompose(input)

        expect(number).toBe(output[0])
        expect(dv).toBe(output[1])
      })
    }

    itDecomposeArray("11.111.111-1", ["11111111", "1"])
    itDecomposeArray("15322091-3", ["15322091", "3"])
    itDecomposeArray("6962458-8", ["6962458", "8"])
    itDecomposeArray("21575109-0", ["21575109", "0"])
  })

  describe("Validate number", () => {
    describe("gets check digit", () => {
      const ruts = [
        "16232033-5",
        "15500182-8",
        "10463821-k",
        "5251582-3",
        "10851339-k",
        "7976057-9",
        "14805513-0",
        "10716252-6",
        "24017268-2",
        "12381349-9",
      ]

      ruts.map((r) => {
        const [, number, dv] = /([0-9]+)-([0-9|k])/gi.exec(r) ?? []

        it(`if number ${number} is compare check digit to be ${dv}`, () => {
          expect(String(checkDigit(number))).toBe(dv)
        })
      })
    })
  })
})
