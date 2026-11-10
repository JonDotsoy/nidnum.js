/**
 * RUN chileno (Rol Único Nacional).
 *
 * Para las personas naturales el RUN es el mismo número que el RUT, con el
 * mismo formato y el mismo dígito verificador.
 *
 * @see ../../docs/specs/chilean/run.md
 */

/** Dígito verificador: un dígito del "0" al "9" o la letra "K". */
export type CheckDigit =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "K"

/** Par `[cuerpo, dígito verificador]`. */
export type RunParts = [body: string, checkDigit: string]

const BODY_PATTERN = /^[0-9]+$/

/**
 * Obtiene el dígito verificador de un cuerpo de RUN usando módulo 11.
 *
 * @param body Cuerpo del RUN, solo dígitos (sin puntos ni guion).
 * @returns `"0"`–`"9"` o `"K"`.
 * @throws {TypeError} Si el cuerpo contiene algo que no sea dígitos.
 *
 * @example
 * checkDigit("30686957") // "4"
 * checkDigit(10000013)   // "K"
 */
export const checkDigit = (body: string | number): CheckDigit => {
  const digits = String(body)

  if (!BODY_PATTERN.test(digits)) {
    throw new TypeError(`Invalid RUN body: ${JSON.stringify(body)}`)
  }

  let sum = 0
  let weight = 2

  for (let i = digits.length - 1; i >= 0; i--) {
    sum += Number(digits[i]) * weight
    weight = weight === 7 ? 2 : weight + 1
  }

  const r = 11 - (sum % 11)

  if (r === 11) return "0"
  if (r === 10) return "K"
  return String(r) as CheckDigit
}

/**
 * Separa un RUN escrito en cualquier forma en cuerpo y dígito verificador.
 *
 * Elimina puntos, guion y espacios. El último carácter es el dígito
 * verificador (normalizado a mayúscula) y el resto es el cuerpo. Cualquier
 * otro carácter hace que la entrada se rechace.
 *
 * @throws {TypeError} Si el texto no tiene la forma de un RUN.
 *
 * @example
 * decompose("30.686.957-4") // ["30686957", "4"]
 * decompose("10000013k")    // ["10000013", "K"]
 */
export const decompose = (run: string): RunParts => {
  const clean = run.replace(/[.\-\s]/g, "").toUpperCase()
  const match = /^([0-9]+)([0-9K])$/.exec(clean)

  if (!match) {
    throw new TypeError(`Invalid RUN: ${JSON.stringify(run)}`)
  }

  return [match[1], match[2]]
}

/**
 * Escribe un RUN a partir de su cuerpo y dígito verificador.
 *
 * @param parts `[cuerpo, dígito verificador]`.
 * @param withDots Separa los miles del cuerpo con puntos (por defecto `true`).
 *
 * @example
 * compose(["30686957", "4"])        // "30.686.957-4"
 * compose(["30686957", "4"], false) // "30686957-4"
 */
export const compose = (
  [body, dv]: RunParts,
  withDots: boolean = true
): string => {
  const formattedBody = withDots
    ? body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : body

  return `${formattedBody}-${dv.toUpperCase()}`
}

/**
 * Normaliza un RUN escrito en cualquier forma a `XX.XXX.XXX-Y`.
 *
 * Equivale a `compose(decompose(run), withDots)`. No valida el dígito
 * verificador; para eso usa {@link isValid}.
 *
 * @example
 * format("306869574")        // "30.686.957-4"
 * format("10.000.013-k", false) // "10000013-K"
 */
export const format = (run: string, withDots: boolean = true): string =>
  compose(decompose(run), withDots)

/**
 * Indica si el dígito verificador de un RUN corresponde a su cuerpo.
 *
 * Acepta el RUN escrito en cualquier forma o el par `[cuerpo, dígito
 * verificador]`. No distingue entre `k` y `K`. Nunca lanza: una entrada mal
 * formada devuelve `false`.
 *
 * @example
 * isValid("30.686.957-4")    // true
 * isValid(["10000013", "k"]) // true
 * isValid("30.686.957-5")    // false
 */
export const isValid = (run: string | RunParts): boolean => {
  try {
    const [body, dv] = Array.isArray(run) ? run : decompose(run)
    return checkDigit(body) === dv.toUpperCase()
  } catch {
    return false
  }
}
