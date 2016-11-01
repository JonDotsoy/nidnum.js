# NIDNum
*nidnum.js* is a converter that work to compose and uncompose the [national identification numbers][national identification number].


## Usage

```javascript
const chilean = require("nidnum/chilean");

console.log(chilean.isValid(""));
```

```javascript
const chilean = require("nidnum/chilean");

if (chilean.isValid(RUT)) {
    console.log("Is valid");
} else {
    console.log("Not is valid");
}
```

[national identification number]: https://en.wikipedia.org/wiki/National_identification_number "National identification number"