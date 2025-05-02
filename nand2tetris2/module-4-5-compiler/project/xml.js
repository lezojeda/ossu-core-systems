const keywords = require("./keywords");

function mapTokenToXML(token) {
	const { tokenType, value } = token;
	let tag = "";

	if (tokenType === "INT_CONST") {
		tag = "integerConstant";
	} else if (tokenType === "STRING_CONST") {
		tag = "stringConst";
	} else {
		tag = tokenType.toLowerCase();
	}
	return `<${tag}>${value}<${tag}>`;
}

// class -> <class></class>
// function -> subroutineDec
// after () if inside function -> parameterList
// after {} -> subroutineBody
// var -> varDec
// before let -> statements
// let -> letStatement
// after ( in function call -> expressionList
	// inside expressionList -> expression
		// inside expression -> term
// while -> whileStatement
// if -> ifStatement
// do -> doStatement
// return -> returnStatement

// non terminals can be generalized to ${keyword}Statement and for those we must recursively convert tokens inside to XML until 
module.exports = { mapTokenToXML };
