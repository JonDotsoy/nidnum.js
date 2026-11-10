# RUT chileno (Rol Único Tributario)

El **RUT** (Rol Único Tributario) es el número que identifica a los contribuyentes en Chile. Fue creado por el DFL N° 3 de 1969 y lo administra el Servicio de Impuestos Internos (SII). Para las personas naturales, el RUT es el mismo número que el **RUN** (Rol Único Nacional) que asigna el Servicio de Registro Civil e Identificación, y ambos comparten el mismo formato y el mismo dígito verificador.

Este documento describe el formato y la fórmula del dígito verificador que implementa `chilean.ts`.

## Formato

Un RUT se compone de dos partes:

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

Las siguientes formas representan el mismo RUT:

```
30.686.957-4
30686957-4
306869574
```

Para validar o calcular, se eliminan los puntos y el guion; el último carácter es el DV y el resto es el cuerpo. Esto es lo que hace `decompose()`, y `compose()` hace el camino inverso agregando puntos y guion.

## Dígito Verificador

El dígito verificador se calcula con el algoritmo **módulo 11**.

### Fórmula

Sea el cuerpo del RUT con dígitos `dₙ … d₂ d₁`, donde `d₁` es el dígito de más a la derecha.

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
- **DV = `4`**, por lo que el RUT completo es `30.686.957-4`.

### Caso K: 10.000.013

| Dígito (de derecha a izquierda) | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Peso | 2 | 3 | 4 | 5 | 6 | 7 | 2 | 3 |
| Producto | 6 | 3 | 0 | 0 | 0 | 0 | 0 | 3 |

- `S = 12`, `12 mod 11 = 1`, `r = 11 − 1 = 10`
- **DV = `K`**, por lo que el RUT completo es `10.000.013-K`.

### Caso 0: 10.000.004

| Dígito (de derecha a izquierda) | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Peso | 2 | 3 | 4 | 5 | 6 | 7 | 2 | 3 |
| Producto | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |

- `S = 11`, `11 mod 11 = 0`, `r = 11 − 0 = 11`
- **DV = `0`**, por lo que el RUT completo es `10.000.004-0`.

### Forma equivalente usada en `chilean.ts`

`checkDigit()` usa una variante compacta del mismo algoritmo (la que aparece en el anexo de implementaciones de Wikipedia): recorre los dígitos de derecha a izquierda con los pesos `9, 8, 7, 6, 5, 4` (repetidos cada seis), acumula `S = (S + dᵢ · pᵢ) mod 11` partiendo de `S = 1`, y devuelve `S − 1`, o `"k"` cuando `S = 0`. El resultado es el mismo que la fórmula anterior. Hay que tener en cuenta que la función devuelve un `number` para los dígitos `0`–`9` y el string `"k"` en minúscula para la K.

| Cuerpo | `checkDigit()` |
| --- | --- |
| `30686957` | `4` |
| `10000013` | `"k"` |
| `10000004` | `0` |

## Referencias

- Servicio de Impuestos Internos, *Decreto con Fuerza de Ley N° 3 de 1969, que establece normas para la aplicación del Rol Único Tributario*: <https://www.sii.cl/pagina/jurisprudencia/dfl3rut.htm>
- Wikipedia, *Rol Único Tributario* (formato, algoritmo módulo 11 y ejemplo `30.686.957-4`): <https://es.wikipedia.org/wiki/Rol_%C3%9Anico_Tributario>
- Wikipedia, *Código de control, sección Módulo 11* (pesos 2 a 7 y variante chilena con `K`): <https://es.wikipedia.org/wiki/C%C3%B3digo_de_control#M.C3.B3dulo_11>
- Wikipedia, *Anexo: Implementaciones para algoritmo de RUT* (variante usada en `chilean.ts`): <https://es.wikipedia.org/wiki/Anexo:Implementaciones_para_algoritmo_de_rut#Javascript>
