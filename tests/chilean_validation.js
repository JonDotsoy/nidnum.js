const expect = require("expect.js");
const {compose, decompose, chilean, getCheckDigit} = require("../src/chilean");

describe("chilean", () => {

	describe("Compose numbers", () => {

		it("With format number (Default)", () => {

			expect(compose([ '11111111', '1' ])).to.be( "11.111.111-1" );
			expect(compose([ '12068692', '5' ])).to.be( "12.068.692-5" );
			expect(compose([ '11440456', 'k' ])).to.be( "11.440.456-k" );
			expect(compose([ '10991878', '4' ])).to.be( "10.991.878-4" );

		});

		it("Without fomrat number", () => {

			expect(compose([ '18349082', '6' ], false)).to.be( "18349082-6" );
			expect(compose([ '15322091', '3' ], false)).to.be( "15322091-3" );
			expect(compose([ '9673221', 'k' ], false)).to.be( "9673221-k" );
			expect(compose([ '6962458', '8' ], false)).to.be( "6962458-8" );

		});

	});

	describe("Uncompose number", () => {

		const itDecomposeArray = (input, output) => {
			it(`if ${input} is [${output.join(", ")}]`, () => {
				const [number, dv] = decompose(input);

				expect(number).to.be(output[0]);
				expect(dv).to.be(output[1]);
			});
		};

		itDecomposeArray("11.111.111-1", ["11111111", "1"]);
		itDecomposeArray("15322091-3", ["15322091", "3"]);
		itDecomposeArray("6962458-8", ["6962458", "8"]);
		itDecomposeArray("21575109-0", ["21575109", "0"]);

	});

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
				"12381349-9"
			]

			ruts.map((r) => {
				const [,number, dv] = /([0-9]+)-([0-9|k])/ig.exec(r);

				it(`if number ${number} is compare check digit to be ${dv}`,() => {
					expect(String(getCheckDigit(number))).to.be(dv);
				})
			});

		});

	});

});