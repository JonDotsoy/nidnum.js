# RUN chileno (Rol Único Nacional)

El **RUN** (Rol Único Nacional) es el número que el Servicio de Registro Civil e Identificación asigna a cada persona natural en Chile. Para las personas naturales es el mismo número que el **RUT** (Rol Único Tributario), creado por el DFL N° 3 de 1969 y administrado por el Servicio de Impuestos Internos (SII), que también se asigna a personas jurídicas. RUN y RUT comparten el mismo formato y el mismo dígito verificador, así que todo lo que sigue aplica a ambos.

Este documento describe el formato y la fórmula del dígito verificador que implementa `chilean.ts`.

## Formato

Un RUN se compone de dos partes:

| Parte | Descripción |
| --- | --- |
| Cuerpo | Número entero positivo (en la práctica, de 7 u 8 dígitos). |
| Dígito verificador (DV) | Un carácter: un dígito del `0` al `9` o la letra `K`. |

Forma escrita habitual:

```
XX.XXX.XXX-Y
```

- Los puntos separan los miles del cuerpo (por ejemplo `30.686.957`).
- El guion `-` separa el cuerpo del dígito verificador.
- La `K` puede escribirse en mayúscula o minúscula; ambas son equivalentes.

Las siguientes formas representan el mismo RUN:

```
30.686.957-4
30686957-4
306869574
```

Para validar o calcular, se eliminan los puntos y el guion; el último carácter es el DV y el resto es el cuerpo. Esto es lo que hace `decompose()`, y `compose()` hace el camino inverso agregando puntos y guion.

## Dígito Verificador

El dígito verificador se calcula con el algoritmo **módulo 11**.

### Fórmula

Sea el cuerpo del RUN con dígitos `dₙ … d₂ d₁`, donde `d₁` es el dígito de más a la derecha.

1. Se asigna a cada dígito un peso, empezando por la derecha, con la serie `2, 3, 4, 5, 6, 7`. Si el número tiene más de seis dígitos, la serie vuelve a empezar en `2`:

   ```
   pᵢ = 2 + ((i − 1) mod 6)      para i = 1, 2, …, n
   ```

2. Se suman los productos de cada dígito por su peso:

   ```
   S = Σ dᵢ · pᵢ
   ```

3. Se calcula el resto de dividir por 11 y se resta de 11:

   ```
   r = 11 − (S mod 11)
   ```

4. Se convierte `r` en el dígito verificador:

   | `r` | DV |
   | --- | --- |
   | 11 | `0` |
   | 10 | `K` |
   | 1 … 9 | el mismo dígito |

### Ejemplo: 30.686.957

| Dígito (de derecha a izquierda) | 7 | 5 | 9 | 6 | 8 | 6 | 0 | 3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Peso | 2 | 3 | 4 | 5 | 6 | 7 | 2 | 3 |
| Producto | 14 | 15 | 36 | 30 | 48 | 42 | 0 | 9 |

- `S = 14 + 15 + 36 + 30 + 48 + 42 + 0 + 9 = 194`
- `194 mod 11 = 7` (porque 11 × 17 = 187)
- `r = 11 − 7 = 4`
- **DV = `4`**, por lo que el RUN completo es `30.686.957-4`.

### Caso K: 10.000.013

| Dígito (de derecha a izquierda) | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Peso | 2 | 3 | 4 | 5 | 6 | 7 | 2 | 3 |
| Producto | 6 | 3 | 0 | 0 | 0 | 0 | 0 | 3 |

- `S = 12`, `12 mod 11 = 1`, `r = 11 − 1 = 10`
- **DV = `K`**, por lo que el RUN completo es `10.000.013-K`.

### Caso 0: 10.000.004

| Dígito (de derecha a izquierda) | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Peso | 2 | 3 | 4 | 5 | 6 | 7 | 2 | 3 |
| Producto | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |

- `S = 11`, `11 mod 11 = 0`, `r = 11 − 0 = 11`
- **DV = `0`**, por lo que el RUN completo es `10.000.004-0`.

### Forma equivalente usada en `chilean.ts`

`checkDigit()` usa una variante compacta del mismo algoritmo (la que aparece en el anexo de implementaciones de Wikipedia): recorre los dígitos de derecha a izquierda con los pesos `9, 8, 7, 6, 5, 4` (repetidos cada seis), acumula `S = (S + dᵢ · pᵢ) mod 11` partiendo de `S = 1`, y devuelve `S − 1`, o `"k"` cuando `S = 0`. El resultado es el mismo que la fórmula anterior. Hay que tener en cuenta que la función devuelve un `number` para los dígitos `0`–`9` y el string `"k"` en minúscula para la K.

| Cuerpo | `checkDigit()` |
| --- | --- |
| `30686957` | `4` |
| `10000013` | `"k"` |
| `10000004` | `0` |

## Operaciones

Estas son las operaciones básicas sobre un RUN y la función de `chilean.ts` que implementa cada una.

### Obtener el dígito verificador

**Entrada:** el cuerpo del RUN, solo dígitos (sin puntos ni guion).
**Salida:** el dígito verificador.

1. Recorrer los dígitos del cuerpo de derecha a izquierda.
2. Multiplicar cada dígito por su peso (`2, 3, 4, 5, 6, 7`, y repetir).
3. Sumar los productos y calcular `r = 11 − (S mod 11)`.
4. Devolver `0` si `r = 11`, `K` si `r = 10`, y `r` en otro caso.

En `chilean.ts`:

```ts
import { checkDigit } from "nidnum/chilean"

checkDigit(30686957)   // 4
checkDigit("10000013") // "k"
checkDigit("10000004") // 0
checkDigit("30.686.957") // lanza Error: el cuerpo debe venir sin puntos
```

### Descomponer un RUN

**Entrada:** un RUN escrito en cualquier forma (`30.686.957-4`, `30686957-4`, `306869574`).
**Salida:** el par `[cuerpo, dígito verificador]`.

1. Eliminar todo carácter que no sea un dígito o una `K` (puntos, guion, espacios).
2. El último carácter es el dígito verificador y el resto es el cuerpo.

Si el dígito verificador ya se conoce por separado, se eliminan todos los caracteres que no sean dígitos y el resultado completo es el cuerpo.

En `chilean.ts`:

```ts
import { decompose } from "nidnum/chilean"

decompose("30.686.957-4")      // ["30686957", "4"]
decompose("10.000.013-K")      // ["10000013", "K"]
decompose("30.686.957", "4")   // ["30686957", "4"]
```

### Formatear (componer) un RUN

**Entrada:** el par `[cuerpo, dígito verificador]`.
**Salida:** el RUN escrito como `XX.XXX.XXX-Y`.

1. Agrupar los dígitos del cuerpo de a tres desde la derecha y separar los grupos con puntos (opcional).
2. Agregar un guion y el dígito verificador.

En `chilean.ts`:

```ts
import { compose } from "nidnum/chilean"

compose(["30686957", "4"])        // "30.686.957-4"
compose(["30686957", "4"], false) // "30686957-4"
compose(["1000005", "k"])         // "1.000.005-k"
```

### Validar un RUN

**Entrada:** un RUN escrito en cualquier forma, o el par `[cuerpo, dígito verificador]`.
**Salida:** `true` si el dígito verificador corresponde al cuerpo.

1. Descomponer el RUN en cuerpo y dígito verificador.
2. Obtener el dígito verificador del cuerpo.
3. Comparar ambos, sin distinguir entre `k` y `K`.

En `chilean.ts`:

```ts
import { isValid } from "nidnum/chilean"

isValid("10.000.013-k")      // true
isValid("30.686.957-5")      // false
```

> **Nota:** hoy `isValid()` compara con igualdad estricta (`===`) el valor de `checkDigit()` (un `number` o `"k"`) contra el DV extraído del texto (un `string`). Por eso devuelve `false` para RUN válidos cuyo DV es un dígito (`isValid("30.686.957-4")`) o una `K` mayúscula (`isValid("10.000.013-K")`). La operación descrita arriba es el comportamiento esperado.

## Referencias

- Servicio de Impuestos Internos, *Decreto con Fuerza de Ley N° 3 de 1969, que establece normas para la aplicación del Rol Único Tributario*: <https://www.sii.cl/pagina/jurisprudencia/dfl3rut.htm>
- Wikipedia, *Rol Único Tributario* (formato, algoritmo módulo 11 y ejemplo `30.686.957-4`): <https://es.wikipedia.org/wiki/Rol_%C3%9Anico_Tributario>
- Wikipedia, *Código de control, sección Módulo 11* (pesos 2 a 7 y variante chilena con `K`): <https://es.wikipedia.org/wiki/C%C3%B3digo_de_control#M.C3.B3dulo_11>
- Wikipedia, *Anexo: Implementaciones para algoritmo de RUT* (variante usada en `chilean.ts`): <https://es.wikipedia.org/wiki/Anexo:Implementaciones_para_algoritmo_de_rut#Javascript>
