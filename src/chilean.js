export const decompose = function (rut, check_digit=null) {
	const regexToRemoveUndesirable = check_digit===null?
		/([^0-9|k])/gi:
		/([^0-9])/g;

	const regexToDecomposeRut = check_digit===null?
		/([0-9]+)([0-9|k])/gi:
		/([0-9]+)/g;

	const cleanRut = rut.replace(regexToRemoveUndesirable, "");

	const [,numberRut, DV=check_digit] = regexToDecomposeRut.exec(cleanRut);

	return [numberRut, DV];
}

export const compose = function ([rut, check_digit], formaterNumberWithDigites=true) {
	const rutFormater = formaterNumberWithDigites?
		rut.
		split("").
		reverse().
		map((e,i) => `${e}${i%3===0?".":""}`).
		reverse().
		join("").
		replace(/\.$/,""):
		rut;

	return `${rutFormater}-${check_digit}`;
}

/**
 * Gets the verifier number rut
 *
 * @see https://es.wikipedia.org/wiki/Anexo:Implementaciones_para_algoritmo_de_rut#Javascript
 * @seer https://es.wikipedia.org/wiki/C%C3%B3digo_de_control#M.C3.B3dulo_11
 *
 * @param  {Number} T                   Number associated with the RUT
 * @return {String}                     Check digit
 */
export const checkDigit = function (_T) {
	let
		M = 0,
		S = 1,
		T = Math.floor(Number(_T));

	if (Number.isNaN(T)) {
		throw new Error("Number no valid to get check digit.");
	}

	for(
		;
		T;
		T = Math.floor(T/10)
	) {
		S = (S + T%10 * ( 9- M++ %6) ) % 11;
	}

	return S ? S - 1 : 'k';
}

export const isValid = function (rut) {
	if (Array.isArray(rut)) {
		return checkDigit(rut[0]) === rut[1];
	} else {
		const [rut, dv] = decompose(rut);
		return checkDigit(rut) === dv;
	}
}

