# NIDNum

_nidnum.js_ is a converter that work to compose and uncompose the [national identification numbers][national identification number].

## Usage RUN / RUT

`nidnum/run` and `nidnum/rut` are the same module.

```javascript
import { isValid, checkDigit, format, decompose, compose } from "nidnum/run"
// or: from "nidnum/rut"

isValid("30.686.957-4") // true
checkDigit("10000013") // "K"
format("306869574") // "30.686.957-4"
decompose("30.686.957-4") // ["30686957", "4"]
compose(["30686957", "4"]) // "30.686.957-4"
```

See [docs/specs/chilean/run.md](docs/specs/chilean/run.md) for the spec.

## Usage Chilean Check

```javascript
const chilean = require("nidnum/chilean")

console.log(chilean.isValid(""))
```

```javascript
const chilean = require("nidnum/chilean")

if (chilean.isValid(RUT)) {
  console.log("Is valid")
} else {
  console.log("Not is valid")
}
```

[national identification number]: https://en.wikipedia.org/wiki/National_identification_number "National identification number"
