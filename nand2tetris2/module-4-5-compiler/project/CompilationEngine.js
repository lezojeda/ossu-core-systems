const operators = require("./operators");
const symbolTable = require("./SymbolTable");
const VMWriter = require("./VMWriter");

function parseToXML(tokens, tab = 0, pointer = 0) {
	const { xml } = compileClass(tokens, tab, pointer);
	return xml;
}

function compileClass(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<class>\n`;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'class'

	const className = tokens[pointer].value;
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // class name
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '{'

	while (["static", "field"].includes(tokens[pointer]?.value)) {
		const classVarDecResult = compileClassVarDec(tokens, tab + 1, pointer);
		xml += classVarDecResult.xml;
		pointer = classVarDecResult.pointer;
	}

	while (["constructor", "function", "method"].includes(tokens[pointer]?.value)) {
		const subroutineResult = compileSubroutine(tokens, tab + 1, pointer, className);
		xml += subroutineResult.xml;
		pointer = subroutineResult.pointer;
	}

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '}'
	xml += `${tabs}</class>\n`;

	return { xml, pointer };
}

function compileSubroutine(tokens, tab, pointer, className) {
	symbolTable.startSubroutine();

	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<subroutineDec>\n`;
	symbolTable.defineSubroutineSymbol("this", className, "argument");

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'function'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // function return type
	const subroutineName = tokens[pointer].value;
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // function name
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '('

	// Parameter list
	const parameterList = compileParameterList(tokens, tab + 1, pointer, className);
	xml += parameterList.xml;
	pointer = parameterList.pointer;

	// Closing parenthesis
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ')'

	// Subroutine body
	const body = compileSubroutineBody(tokens, tab + 1, pointer, className, subroutineName);
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

	// Escape special characters for symbols
	let escapedValue = value;
	if (tag === "symbol") {
		if (value === "<") escapedValue = "&lt;";
		else if (value === ">") escapedValue = "&gt;";
		else if (value === "&") escapedValue = "&amp;";
	}

	const tabs = "\t".repeat(tab);
	return `${tabs}<${tag}> ${escapedValue} </${tag}>\n`;
}

function compileParameterList(tokens, tab, pointer, className) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<parameterList>\n`;

	while (tokens[pointer].value !== ")") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // parameter type

		const parameterName = tokens[pointer].value;
		symbolTable.defineSubroutineSymbol(parameterName, className, "argument");
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // parameter name

		if (tokens[pointer].value === ",") {
			xml += compileTerminalToken(tokens[pointer++], tab + 1); // comma separator
		}
	}

	xml += `${tabs}</parameterList>\n`;
	return { xml, pointer };
}

function compileSubroutineBody(tokens, tab, pointer, className, subroutineName) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<subroutineBody>\n`;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // {

	while (tokens[pointer]?.value === "var") {
		// var declarations
		const result = compileVarDec(tokens, tab + 1, pointer);
		xml += result.xml;
		pointer = result.pointer;
	}

	const statementsResult = compileStatements(tokens, tab + 1, pointer, className, subroutineName); // statements
	xml += statementsResult.xml;
	pointer = statementsResult.pointer;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // }
	xml += `${tabs}</subroutineBody>\n`;

	return { xml, pointer };
}

function compileClassVarDec(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<classVarDec>\n`;

	// Parse kind and type
	const kind = tokens[pointer].value; // 'static' or 'field'
	xml += compileTerminalToken(tokens[pointer++], tab + 1);

	const type = tokens[pointer].value; // e.g., 'int' or 'boolean'
	xml += compileTerminalToken(tokens[pointer++], tab + 1);

	// First varName
	while (tokens[pointer].value !== ";") {
		const name = tokens[pointer].value;

		xml += compileTerminalToken(tokens[pointer++], tab + 1);
		symbolTable.defineClassSymbol(name, type, kind);

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

	// Parse kind and type
	xml += compileTerminalToken(tokens[pointer++], tab + 1);

	const type = tokens[pointer].value;
	xml += compileTerminalToken(tokens[pointer++], tab + 1);

	while (tokens[pointer].value !== ";") {
		const name = tokens[pointer].value;

		xml += compileTerminalToken(tokens[pointer++], tab + 1);
		symbolTable.defineSubroutineSymbol(name, type, "local");

		if (tokens[pointer].value === ",") {
			xml += compileTerminalToken(tokens[pointer++], tab + 1); // comma separator
		}
	}

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ;
	xml += `${tabs}</varDec>\n`;
	return { xml, pointer };
}

function compileStatements(tokens, tab, pointer, className, subroutineName) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<statements>\n`;
	const label = `${className}.${subroutineName}`;

	while (tokens[pointer].value !== "}") {
		switch (tokens[pointer].value) {
			case "do":
				const doResult = compileDo(tokens, tab + 1, pointer);
				xml += doResult.xml;
				pointer = doResult.pointer;
				break;
			case "let":
				const letResult = compileLet(tokens, tab + 1, pointer);
				xml += letResult.xml;
				pointer = letResult.pointer;
				break;
			case "while":
				const whileResult = compileWhile(tokens, tab + 1, pointer);
				xml += whileResult.xml;
				pointer = whileResult.pointer;
				break;
			case "return":
				const returnResult = compileReturn(tokens, tab + 1, pointer);
				xml += returnResult.xml;
				pointer = returnResult.pointer;
				break;
			case "if":
				const ifResult = compileIf(tokens, tab + 1, pointer, label);
				xml += ifResult.xml;
				pointer = ifResult.pointer;
				break;
		}
	}
	xml += `${tabs}</statements>\n`;
	return { xml, pointer };
}

function compileDo(tokens, tab, pointer) {
	// 'do' subroutineCall ';'

	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<doStatement>\n`;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'do'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // identifier (varName or subroutineName)

	if (tokens[pointer].value === ".") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // '.'
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // subroutine name
	}

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '('

	// Expression list
	const { xml: expressionListXML, pointer: expressionListPointer } = compileExpressionList(
		tokens,
		tab + 1,
		pointer
	);
	xml += expressionListXML;
	pointer = expressionListPointer;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ')'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ';'
	xml += `${tabs}</doStatement>\n`;

	return { xml, pointer };
}

function compileLet(tokens, tab, pointer) {
	// 'let' varName ('[' expression ']')? '=' expression ';'

	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<letStatement>\n`;
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'let'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // varName

	if (tokens[pointer].value === "[") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // '['

		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		xml += expressionResult.xml;
		pointer = expressionResult.pointer;

		xml += compileTerminalToken(tokens[pointer++], tab + 1); // ']'
	}

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '='

	// Expression
	const expressionResult = compileExpression(tokens, tab + 1, pointer);
	xml += expressionResult.xml;
	pointer = expressionResult.pointer;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ';'
	xml += `${tabs}</letStatement>\n`;

	return { xml, pointer };
}

function compileWhile(tokens, tab, pointer) {
	// 'while' '(' expression ')' '{' statements '}'

	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<whileStatement>\n`;
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'while'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '('

	// Expression
	const expressionResult = compileExpression(tokens, tab + 1, pointer);
	xml += expressionResult.xml;
	pointer = expressionResult.pointer;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ')'

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '{'

	// Statements
	const statementsResult = compileStatements(tokens, tab + 1, pointer); // statements
	xml += statementsResult.xml;
	pointer = statementsResult.pointer;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '}'
	xml += `${tabs}</whileStatement>\n`;

	return { xml, pointer };
}

function compileReturn(tokens, tab, pointer) {
	// 'return' expression? ';'

	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<returnStatement>\n`;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'return'

	// Optional expression
	if (tokens[pointer].value !== ";") {
		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		xml += expressionResult.xml;
		pointer = expressionResult.pointer;
	}

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ;
	xml += `${tabs}</returnStatement>\n`;
	return { xml, pointer };
}

function compileIf(tokens, tab, pointer, label) {
	const falseLabel = `${label}.IF_FALSE.${pointer}`;
	const endLabel = `${label}.IF_END.${pointer}`;
	let code = "";

	code += compileTerminalToken(tokens[pointer++], tab + 1); // 'if'
	code += compileTerminalToken(tokens[pointer++], tab + 1); // '('

	// Expression
	const expressionResult = compileExpression(tokens, tab + 1, pointer);
	code += expressionResult.xml;
	pointer = expressionResult.pointer;

	code += VMWriter.writeArithmetic("not");
	code += VMWriter.writeIf(falseLabel);

	pointer++; // ')'
	pointer++; // '{'

	// Statements
	const statementsResult = compileStatements(tokens, tab + 1, pointer); // statements
	code += statementsResult.xml;
	pointer = statementsResult.pointer;
	pointer++; // '}'

	code += VMWriter.writeGoto(endLabel);

	code += VMWriter.writeLabel(falseLabel);
	// Handle optional else clause
	if (tokens[pointer]?.value === "else") {
		pointer++; // 'else'
		pointer++; // '{'

		// Statements
		const elseStatementsResult = compileStatements(tokens, tab + 1, pointer);
		code += elseStatementsResult.xml;
		pointer = elseStatementsResult.pointer;

		pointer++; // '}'
	}
	code += VMWriter.writeLabel(endLabel);

	return { xml: code, pointer };
}

function compileExpression(tokens, tab, pointer) {
	let code = "";

	// Compile first term
	const termResult = compileTerm(tokens, tab + 1, pointer);
	code += termResult.xml;
	pointer = termResult.pointer;

	// Compile (op term)* pattern
	while (operators.includes(tokens[pointer]?.value)) {
		const op = VMWriter.writeArithmetic(tokens[pointer]?.value);
		pointer++;

		const nextTermResult = compileTerm(tokens, tab + 1, pointer);

		code += nextTermResult.xml;
		code += op;
		pointer = nextTermResult.pointer;
	}

	return { xml: code, pointer };
}

function compileTerm(tokens, tab, pointer) {
	let code = "";

	const nextToken = tokens[pointer + 1] || {};

	// Integer constant,
	if (tokens[pointer].tokenType === "INT_CONST") {
		code += VMWriter.writePush("constant", tokens[pointer++].value);
	}
	// String constant, keyword constant, or simple identifier
	else if (
		tokens[pointer].tokenType === "STRING_CONST" ||
		["true", "false", "null", "this"].includes(tokens[pointer].value)
	) {
		code += compileTerminalToken(tokens[pointer++], tab + 1);
	}
	// Unary operator term "op exp"
	else if (["-", "~"].includes(tokens[pointer].value)) {
		const op = VMWriter.writeArithmetic(tokens[pointer]?.value); // unary op
		pointer++;

		const termResult = compileTerm(tokens, tab + 1, pointer); // term
		code += termResult.xml;
		code += op;

		pointer = termResult.pointer;
	}
	// Grouped expression: (expression)
	else if (tokens[pointer].value === "(") {
		pointer++; // '('

		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		code += expressionResult.xml;
		pointer = expressionResult.pointer;

		pointer++; // ')'
	}
	// Array access: varName[expression]
	else if (nextToken.value === "[") {
		code += compileTerminalToken(tokens[pointer++], tab + 1); // identifier
		code += compileTerminalToken(tokens[pointer++], tab + 1); // '['
		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		code += expressionResult.xml;
		pointer = expressionResult.pointer;
		code += compileTerminalToken(tokens[pointer++], tab + 1); // ']'
	}
	// Class subroutine call: ClassName.subroutine()
	else if (nextToken.value === ".") {
		let identifier = tokens[pointer].value;
		pointer++; // class identifier

		pointer++; // '.'
		const subroutineName = tokens[pointer].value;
		pointer++;

		pointer++; // '('

		// Compile expression list (arguments)
		const expListResult = compileExpressionList(tokens, tab + 1, pointer);
		code += expListResult.xml;
		pointer = expListResult.pointer;

		pointer++; // ')
		code += VMWriter.writeCall(subroutineName);
	}
	// Subroutine call: subroutine()
	else if (nextToken.value === "(") {
		const subroutineName = tokens[pointer].value;
		pointer++;

		pointer++; // '('

		// Compile expression list (arguments)
		const expListResult = compileExpressionList(tokens, tab + 1, pointer);
		code += expListResult.xml;
		pointer = expListResult.pointer;

		pointer++; // ')'
		code += VMWriter.writeCall(subroutineName);
	}
	// Simple variable name
	else {
		// Resolve varName to segment
		const varName = tokens[pointer++].value;

		const entry =
			symbolTable["subroutine"].table[varName] ?? symbolTable["class"].table[varName];

		if (!entry) {
			throw `${varName} is not defined`;
		}

		const segment = entry.kind;

		code += VMWriter.writePush(segment === "field" ? "this" : segment, varName);
	}

	return { xml: code, pointer };
}

function compileExpressionList(tokens, tab, pointer) {
	let code = "";

	// Handle empty expression list (e.g., f())
	if (tokens[pointer].value === ")") {
		return { xml: code, pointer };
	}

	while (true) {
		const expResult = compileExpression(tokens, tab + 1, pointer);
		code += expResult.xml;
		pointer = expResult.pointer;

		if (tokens[pointer].value === ",") {
			pointer++; // ','
		} else {
			break; // no more expressions
		}
	}

	return { xml: code, pointer };
}

module.exports = { parseToXML };
