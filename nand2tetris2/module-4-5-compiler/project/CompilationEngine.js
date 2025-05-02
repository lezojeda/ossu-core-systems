function parseToXML(tokens, tab = 0, pointer = 0) {
	const { xml } = compileClass(tokens, tab, pointer);
	return xml;
}

function compileClass(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<class>\n`;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'class'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // class name
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '{'

	while (["static", "field"].includes(tokens[pointer]?.value)) {
		const result = compileClassVarDec(tokens, tab + 1, pointer);
		xml += result.xml;
		pointer = result.pointer;
	}

	while (["constructor", "function", "method"].includes(tokens[pointer]?.value)) {
		const result = compileSubroutine(tokens, tab + 1, pointer);
		xml += result.xml;
		pointer = result.pointer;
	}

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '}'
	xml += `${tabs}</class>\n`;

	return { xml, pointer };
}

function compileSubroutine(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<subroutineDec>\n`;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'function'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // function return type
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // function name
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '('

	// Parameter list
	const parameterList = compileParameterList(tokens, tab + 1, pointer);
	xml += parameterList.xml;
	pointer = parameterList.pointer;

	// Closing parenthesis
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ')'

	// Subroutine body
	const body = compileSubroutineBody(tokens, tab, pointer);
	xml += body.xml;
	pointer = body.pointer;

	xml += `${tabs}</subroutineDec>\n`;

	return { xml, pointer };
}

function compileTerminalToken(token, tab) {
	const { tokenType, value } = token;
	let tag =
		tokenType === "INT_CONST"
			? "integerConstant"
			: tokenType === "STRING_CONST"
			? "stringConstant"
			: tokenType.toLowerCase();

	const tabs = "\t".repeat(tab);
	return `${tabs}<${tag}>${value}</${tag}>\n`;
}

function compileParameterList(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<parameterList>\n`;

	while (tokens[pointer].value !== ")") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // parameter type
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // parameter name

		if (tokens[pointer].value === ",") {
			xml += compileTerminalToken(tokens[pointer++], tab + 1); // comma separator
		}
	}

	xml += `${tabs}</parameterList>\n`;
	return { xml, pointer };
}

function compileSubroutineBody(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<subroutineBody>\n`;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // {

	while (tokens[pointer]?.value === "var") {
		const result = compileVarDec(tokens, tab + 1, pointer);
		xml += result.xml;
		pointer = result.pointer;
	}

	xml += `${tabs}</subroutineBody>\n`;
	return { xml, pointer };
}

function compileClassVarDec(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<classVarDec>\n`;

	while (tokens[pointer].value !== ";") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1);

		if (tokens[pointer].value === ",") {
			xml += compileTerminalToken(tokens[pointer++], tab + 1); // comma separator
		}
	}

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ;
	xml += `${tabs}</classVarDec>\n`;
	return { xml, pointer };
}

function compileVarDec(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<varDec>\n`;

	while (tokens[pointer].value !== ";") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1);

		if (tokens[pointer].value === ",") {
			xml += compileTerminalToken(tokens[pointer++], tab + 1); // comma separator
		}
	}

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ;
	xml += `${tabs}</varDec>\n`;
	return { xml, pointer };
}

function compileStatements(tokens, tab) {}

function compileLet(tokens, tab) {}

function compileExpression(tokens, tab) {}

function compileTerm(tokens, tab) {}

function compileExpressionList(tokens, tab) {}

const tokenToTag = {
	class: "class",
	static: "classVarDec",
	field: "classVarDec",
	function: "subroutineDec",
	do: "doStatement",
	while: "whileStatement",
	return: "returnStatement",
	if: "ifStatement",
};

module.exports = { parseToXML };
