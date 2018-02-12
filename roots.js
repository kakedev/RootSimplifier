function simplifyRoot(index, radicand, exponent, coeficient) {
	var ind = index;
	var rad = radicand;
	var exp = exponent;
	var cof = coeficient;

	var returnStr = "\\(\\require{cancel}\\)";

	//Calcular o mdc e executar simplificação Índice-Expoente
	returnStr += "Primeiro Passo: Simplificação Índice-Expoente (MDC).<br/>";
	var d = gcd(ind, exp);
	ind /= d;
	exp /= d;

	if (d != 1) {
		returnStr += "\\(mdc(" + index + "," + exponent + ") = " + d + "\\)<br/>";
		returnStr += "Índice: \\(" + index + "\\div" + d + " = " + ind + "\\)<br/>";
		returnStr += "Expoente: \\(" + exponent + "\\div" + d + " = " + exp + "\\)<br/><br/>";
	} else
		returnStr += "Os números são primos entre si.<br/><br/>";

	//Calcular o radicando para a fatoração
	returnStr += "Segundo Passo: Executar a potenciação entre radicando e expoente.<br/>";
	rad = rad ** exp;
	if (exp != 1)
		returnStr += "\\(" + radicand + "^{" + exp + "} = " + rad + "\\)<br/><br/>";
	else
		returnStr += "O expoente é 1, consequentemente o radicando não muda.<br/><br/>";

	if (ind != 1) {
		//Fatorar radicando
		returnStr += "Terceiro Passo: Fatorar o radicando.<br/>";
		var factorStr = factor(rad);
		var factorArr = factorStr.split(',');

		if (factorArr.length > 1) {
			var factorObj = {};
			for (var i = 0; i < factorArr.length; i++) {
				if (factorObj.hasOwnProperty(factorArr[i]))
					factorObj[factorArr[i]]++;
				else
					factorObj[factorArr[i]] = 1;
			}
			factorStr = factorStr.replace(/,/g, "\\cdot");
			returnStr += "\\(" + cof + "\\sqrt[" + ind + "]{" + rad + "} = " + cof + "\\sqrt[" + ind + "]{" + factorStr + "}\\)<br/><br/>";

			//Executar simplificação por fatoração
			returnStr += "Quarto Passo: Simplificão Índice-Fator.<br/>"
			Object.keys(factorObj).forEach(function(f) {
				while (factorObj[f] >= ind) {
					var prevCof = cof;
					var cancelStr = getFactorCancel(factorObj, f, ind);
					factorObj[f] -= ind;
					cof *= parseInt(f);
					var normalStr = getFactorString(factorObj);
					if (prevCof != 1) {
						if (normalStr != "") {
							returnStr += "\\(" + prevCof + "\\sqrt[\\bcancel{" + ind + "}]{" + cancelStr + "} = " + cof + "\\sqrt[" + ind + "]{" + normalStr + "}\\)<br/>";
						} else {
							returnStr += "\\(" + prevCof + "\\sqrt[\\bcancel{" + ind + "}]{" + cancelStr + "} = " + cof + "\\)<br/>";
						}
					} else {
						returnStr += "\\(\\sqrt[\\bcancel{" + ind + "}]{" + cancelStr + "} = " + cof + "\\sqrt[" + ind + "]{" + normalStr + "}\\)<br/>";
					}
				}
			});
			returnStr += "<br/>";

			//Recalcular radicando
			var prevCof = cof;
			rad = 1;
			var lastFactorStr = getFactorString(factorObj);
			Object.keys(factorObj).forEach(function(f) {
				if (factorObj[f] != 0)
					rad *= parseInt(f) ** factorObj[f];
			});
		} else {
			returnStr += "O radicando é primo.<br/></br>";
		}

		if (exp != 1) {
			if (rad != 1) {
				if (cof != 1) {
					returnStr += "\\(" + cof + "\\sqrt[" + ind + "]{" + lastFactorStr + "} = \\) ";
				} else {
					returnStr += "\\(\\sqrt[" + ind + "]{" + lastFactorStr + "} = \\) ";
				}
			} else {
				returnStr += "O resultado é ";
			}
		} else {
			returnStr += "O resultado é ";
		}


		if (rad != 1) {
			if (cof != 1) {
				returnStr += "\\(" + cof + "\\sqrt[" + ind + "]{" + rad + "}\\)";
			} else {
				returnStr += "\\(\\sqrt[" + ind + "]{" + rad + "}\\)";
			}
		} else {
			returnStr += "\\(" + cof + "\\)";
		}
	} else {
		returnStr += "O índice resultou 1, portanto a raiz foi anulada.<br/>";
		rad *= cof;
		returnStr += "O resultado é \\(" + rad + "\\)";
	}

	return returnStr;
}

function gcd(a, b) {
	if (!b)
		return a;

	return gcd(b, a % b);
}

function factor(n) {
	if (isNaN(n) || !isFinite(n) || n % 1 != 0 || n == 0) return '' + n;
	if (n < 0) return '-' + factor(-n);
	var minFactor = leastFactor(n);
	if (n == minFactor) return '' + n;
	return minFactor + ',' + factor(n / minFactor);
}

// find the least factor in n by trial division
function leastFactor(n) {
	if (isNaN(n) || !isFinite(n)) return NaN;
	if (n == 0) return 0;
	if (n % 1 || n * n < 2) return 1;
	if (n % 2 == 0) return 2;
	if (n % 3 == 0) return 3;
	if (n % 5 == 0) return 5;
	var m = Math.sqrt(n);
	for (var i = 7; i <= m; i += 30) {
		if (n % i == 0) return i;
		if (n % (i + 4) == 0) return i + 4;
		if (n % (i + 6) == 0) return i + 6;
		if (n % (i + 10) == 0) return i + 10;
		if (n % (i + 12) == 0) return i + 12;
		if (n % (i + 16) == 0) return i + 16;
		if (n % (i + 22) == 0) return i + 22;
		if (n % (i + 24) == 0) return i + 24;
	}
	return n;
}

function execute() {
	var cof = document.getElementById("coeficient").value;
	var ind = document.getElementById("index").value;
	var rad = document.getElementById("radicand").value;
	var exp = document.getElementById("exponent").value;

	if(ind < 2){
		document.getElementById("answer").innerHTML = "O índice deve ser no minimo 2.";
		return;
	}

	if(rad <= 0) {
		document.getElementById("answer").innerHTML = "O radicando deve ser maior que 0.";
		return;
	}

	if(exp <= 0) {
		document.getElementById("answer").innerHTML = "O expoente deve ser maior que 0.";
		return;
	}

	document.getElementById("answer").innerHTML = simplifyRoot(ind, rad, exp, cof);
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function getFactorCancel(object, key, index) {
	var returnStr = "";
	Object.keys(object).forEach(function(k) {
		var count = 0;
		if (k === key) {
			while (count < object[k]) {
				var finished;
				while (count < index) {
					returnStr += "\\cancel{" + k + "}\\cdot";
					count++;
					finished = (count == object[k]);
				}
				if (!finished)
					returnStr += k + "\\cdot";

				count++;
			}
		} else {
			while (count < object[k]) {
				returnStr += k + "\\cdot";
				count++;
			}
		}
	});
	returnStr = returnStr.slice(0, -5);
	return returnStr;
}

function getFactorString(object) {
	var returnStr = "";
	Object.keys(object).forEach(function(k) {
		var count = 0;
		while (count < object[k]) {
			returnStr += k + "\\cdot";
			count++;
		}
	});
	returnStr = returnStr.slice(0, -5);
	return returnStr;
}
