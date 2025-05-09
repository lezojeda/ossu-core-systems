const operators = require("./operators");
const symbolTable = require("./SymbolTable");
const VMWriter = require("./VMWriter");

function parseToXML(tokens, tab = 0, pointer = 0) {
	const { code } = compileClass(tokens, tab, pointer);
	return code;
}

function compileClass(tokens, tab, pointer) {
	let code = "";

	pointer++; // 'class'

	const className = tokens[pointer].value;
	pointer++; // class name
	pointer++; // '{'

	while (["static", "field"].includes(tokens[pointer]?.value)) {
		const classVarDecResult = compileClassVarDec(tokens, tab + 1, pointer);
		code += classVarDecResult.code;
		pointer = classVarDecResult.pointer;
	}

	while (["constructor", "function", "method"].includes(tokens[pointer]?.value)) {
		const subroutineResult = compileSubroutine(tokens, tab + 1, pointer, className);
		code += subroutineResult.code;
		pointer = subroutineResult.pointer;
	}

	pointer++; // '}'

	return { code, pointer };
}

function compileSubroutine(tokens, tab, pointer, className) {
	symbolTable.startSubroutine(className);

	let code = "";
	symbolTable.defineSubroutineSymbol("this", className, "argument");

	pointer++; // 'function'
	pointer++; // function return type
	const subroutineName = tokens[pointer].value;
	pointer++; // function name

	pointer++; // '('

	// Parameter list
	const parameterListResult = compileParameterList(tokens, tab + 1, pointer, className);
	pointer = parameterListResult.pointer;

	// Closing parenthesis
	pointer++; // ')'

	code += VMWriter.writeFunction(`${className}.${subroutineName}`, parameterListResult.count);

	// Subroutine body
	const body = compileSubroutineBody(tokens, tab + 1, pointer, className, subroutineName);
	code += body.code;
	pointer = body.pointer;

	return { code, pointer };
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
	let code = "";
	let count = 0;

	while (tokens[pointer].value !== ")") {
		pointer++; // parameter type

		const parameterName = tokens[pointer].value;
		symbolTable.defineSubroutineSymbol(parameterName, className, "argument");
		pointer++; // parameter name
		count++;

		if (tokens[pointer].value === ",") {
			pointer++; // comma separator
		}
	}

	return { code, pointer, count };
}

function compileSubroutineBody(tokens, tab, pointer, className, subroutineName) {
	let code = "";

	pointer++; // {

	while (tokens[pointer].value === "var") {
		// var declarations
		const result = compileVarDec(tokens, tab + 1, pointer);
		code += result.code;
		pointer = result.pointer;
	}

	const statementsResult = compileStatements(tokens, tab + 1, pointer, className, subroutineName); // statements
	code += statementsResult.code;
	pointer = statementsResult.pointer;

	pointer++; // }

	return { code, pointer };
}

function compileClassVarDec(tokens, tab, pointer) {
	let code = "";

	// Parse kind and type
	const kind = tokens[pointer].value; // 'static' or 'field'
	code += compileTerminalToken(tokens[pointer++], tab + 1);

	const type = tokens[pointer].value; // e.g., 'int' or 'boolean'
	code += compileTerminalToken(tokens[pointer++], tab + 1);

	// First varName
	while (tokens[pointer].value !== ";") {
		const name = tokens[pointer].value;

		pointer++;
		symbolTable.defineClassSymbol(name, type, kind);

		if (tokens[pointer].value === ",") {
			pointer++; // comma separator
		}
	}

	pointer++; // ;
	return { code, pointer };
}

function compileVarDec(tokens, tab, pointer) {
	let code = "";

	// Parse kind and type
	pointer++; // 'var'

	const type = tokens[pointer].value;
	pointer++; // type

	while (tokens[pointer].value !== ";") {
		const name = tokens[pointer].value;

		pointer++; // varName
		symbolTable.defineSubroutineSymbol(name, type, "local");

		if (tokens[pointer].value === ",") {
			pointer++; // ','
		}
	}

	pointer++; // ;
	return { code, pointer };
}

function compileStatements(tokens, tab, pointer, className, subroutineName) {
	let code = "";
	const label = `${className}.${subroutineName}`;

	while (tokens[pointer].value !== "}") {
		switch (tokens[pointer].value) {
			case "do":
				const doResult = compileDo(tokens, tab + 1, pointer);
				code += doResult.code;
				pointer = doResult.pointer;
				break;
			case "let":
				const letResult = compileLet(tokens, tab + 1, pointer);
				code += letResult.code;
				pointer = letResult.pointer;
				break;
			case "while":
				const whileResult = compileWhile(tokens, tab + 1, pointer, label);
				code += whileResult.code;
				pointer = whileResult.pointer;
				break;
			case "return":
				const returnResult = compileReturn(tokens, tab + 1, pointer);
				code += returnResult.code;
				pointer = returnResult.pointer;
				break;
			case "if":
				const ifResult = compileIf(tokens, tab + 1, pointer, label);
				code += ifResult.code;
				pointer = ifResult.pointer;
				break;
		}
	}
	return { code, pointer };
}

function compileDo(tokens, tab, pointer, className) {
	// 'do' subroutineCall ';'

	let code = "";
	let f = "";

	pointer++; // 'do'

	const subroutineCallResult = compileSubroutineCall(tokens, pointer);
	code += subroutineCallResult.code;
	pointer = subroutineCallResult.pointer;

	return { code, pointer };
}

function compileLet(tokens, tab, pointer) {
	// 'let' varName ('[' expression ']')? '=' expression ';'

	let code = "";
	pointer++; // 'let'

	// resolve varname to write pop at the end
	const varName = tokens[pointer].value;

	const { segment, index } = resolveVarName(varName);

	pointer++; // varName

	if (tokens[pointer].value === "[") {
		code += compileTerminalToken(tokens[pointer++], tab + 1); // '['

		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		code += expressionResult.code;
		pointer = expressionResult.pointer;

		code += compileTerminalToken(tokens[pointer++], tab + 1); // ']'
	}

	pointer++; // '='

	// Expression
	const expressionResult = compileExpression(tokens, tab + 1, pointer);
	code += expressionResult.code;
	pointer = expressionResult.pointer;

	pointer++; // ';'
	code += VMWriter.writePop(segment, index);

	return { code, pointer };
}

function compileWhile(tokens, tab, pointer, label) {
	// 'while' '(' expression ')' '{' statements '}'
	const whileLabel = `${label}.WHILE.${pointer}`;
	const exitWhile = `${label}.EXIT_WHILE.${pointer}`;

	let code = "";
	pointer++; // 'while'
	pointer++; // '('

	code += VMWriter.writeLabel(whileLabel);

	// Expression
	const expressionResult = compileExpression(tokens, tab + 1, pointer);
	code += expressionResult.code;
	pointer = expressionResult.pointer;

	code += VMWriter.writeArithmetic("not");
	code += VMWriter.writeIf(exitWhile);

	pointer++; // ')'
	pointer++; // '{'

	// Statements
	const statementsResult = compileStatements(tokens, tab + 1, pointer); // statements
	code += statementsResult.code;
	pointer = statementsResult.pointer;

	pointer++; // '}'
	code += VMWriter.writeGoto(whileLabel);
	code += VMWriter.writeLabel(exitWhile);

	return { code, pointer };
}

function compileReturn(tokens, tab, pointer) {
	// 'return' expression? ';'

	let code = "";

	pointer++; // 'return'

	// Optional expression
	if (tokens[pointer].value !== ";") {
		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		code += expressionResult.code;
		pointer = expressionResult.pointer;
	}

	code += VMWriter.writeReturn();
	pointer++; // ;

	return { code, pointer };
}

function compileIf(tokens, tab, pointer, label) {
	const falseLabel = `${label}.IF_FALSE.${pointer}`;
	const endLabel = `${label}.IF_END.${pointer}`;
	let code = "";

	code += compileTerminalToken(tokens[pointer++], tab + 1); // 'if'
	code += compileTerminalToken(tokens[pointer++], tab + 1); // '('

	// Expression
	const expressionResult = compileExpression(tokens, tab + 1, pointer);
	code += expressionResult.code;
	pointer = expressionResult.pointer;

	code += VMWriter.writeArithmetic("not");
	code += VMWriter.writeIf(falseLabel);

	pointer++; // ')'
	pointer++; // '{'

	// Statements
	const statementsResult = compileStatements(tokens, tab + 1, pointer); // statements
	code += statementsResult.code;
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
		code += elseStatementsResult.code;
		pointer = elseStatementsResult.pointer;

		pointer++; // '}'
	}
	code += VMWriter.writeLabel(endLabel);

	return { code, pointer };
}

function compileExpression(tokens, tab, pointer) {
	let code = "";

	// Compile first term
	const termResult = compileTerm(tokens, tab + 1, pointer);
	code += termResult.code;
	pointer = termResult.pointer;

	// Compile (op term)* pattern
	while (operators.includes(tokens[pointer]?.value)) {
		const op = VMWriter.writeArithmetic(tokens[pointer]?.value);
		pointer++;

		const nextTermResult = compileTerm(tokens, tab + 1, pointer);

		code += nextTermResult.code;
		code += op;
		pointer = nextTermResult.pointer;
	}

	return { code, pointer };
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
		["true", "this"].includes(tokens[pointer].value)
	) {
		code += compileTerminalToken(tokens[pointer++], tab + 1);
	}
	// null/false
	else if (["false", "null"].includes(tokens[pointer].value)) {
		code += VMWriter.writePush("constant", 0);
	}
	// Unary operator term "op exp"
	else if (["-", "~"].includes(tokens[pointer].value)) {
		const op = VMWriter.writeArithmetic(tokens[pointer]?.value); // unary op
		pointer++;

		const termResult = compileTerm(tokens, tab + 1, pointer); // term
		code += termResult.code;
		code += op;

		pointer = termResult.pointer;
	}
	// Grouped expression: (expression)
	else if (tokens[pointer].value === "(") {
		pointer++; // '('

		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		code += expressionResult.code;
		pointer = expressionResult.pointer;

		pointer++; // ')'
	}
	// Array access: varName[expression]
	else if (nextToken.value === "[") {
		code += compileTerminalToken(tokens[pointer++], tab + 1); // identifier
		code += compileTerminalToken(tokens[pointer++], tab + 1); // '['
		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		code += expressionResult.code;
		pointer = expressionResult.pointer;
		code += compileTerminalToken(tokens[pointer++], tab + 1); // ']'
	}
	// Class subroutine call ClassName.identifier() or subroutine call identifier()
	else if (nextToken.value === "." || nextToken.value === "(") {
		const subroutineCallResult = compileSubroutineCall(tokens, pointer);
		code += subroutineCallResult.code;
		pointer = subroutineCallResult.pointer;	
	}
	// Simple variable name
	else {
		const varName = tokens[pointer++].value;

		const { segment, index } = resolveVarName(varName);

		code += VMWriter.writePush(segment === "field" ? "this" : segment, varName, index);
	}

	return { code, pointer };
}

function compileExpressionList(tokens, tab, pointer) {
	let code = "";
	let count = 0;

	// Handle empty expression list (e.g., f())
	if (tokens[pointer].value === ")") {
		return { code, pointer, count };
	}

	while (true) {
		count++;
		const expResult = compileExpression(tokens, tab + 1, pointer);
		code += expResult.code;
		pointer = expResult.pointer;

		if (tokens[pointer].value === ",") {
			pointer++; // ','
		} else {
			break; // no more expressions
		}
	}

	return { code, pointer, count };
}

function compileSubroutineCall(tokens, pointer) {
	const identifier = tokens[pointer].value;
	f = `${className}.${identifier}`; // TODO: fix this duplicate reassignment to subroutineName in the two possible cases of do class.method() vs do method()
	pointer++; // identifier (varName or subroutineName)

	if (tokens[pointer].value === ".") {
		pointer++; // '.'

		f = `${identifier}.${tokens[pointer].value}`;
		pointer++; // subroutine name
	}

	pointer++; // '('

	// Expression list
	const {
		code: expressionListCode,
		pointer: expressionListPointer,
		count,
	} = compileExpressionList(tokens, tab + 1, pointer);
	code += expressionListCode;
	pointer = expressionListPointer;

	pointer++; // ')'
	pointer++; // ';'
	return { code: VMWriter.writeCall(f, count), pointer };
}

function resolveVarName(varName) {
	const entry = symbolTable["subroutine"].table[varName] ?? symbolTable["class"].table[varName];

	if (!entry) {
		throw `${varName} is not defined`;
	}

	return { segment: entry.kind === "field" ? "this" : entry.kind, ...entry };
}

module.exports = { parseToXML };
