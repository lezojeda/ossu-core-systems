const operators = require("./operators");
const symbolTable = require("./SymbolTable");
const VMWriter = require("./VMWriter");
const context = require("./context");

function parseToXML(tokens, pointer = 0) {
	const { code } = compileClass(tokens, pointer);
	return code;
}

function compileClass(tokens, pointer) {
	let code = "";

	pointer++; // 'class'

	const className = tokens[pointer].value;
	context["className"] = className;

	pointer++; // class name
	pointer++; // '{'

	while (["static", "field"].includes(tokens[pointer]?.value)) {
		const classVarDecResult = compileClassVarDec(tokens, pointer);
		code += classVarDecResult.code;
		pointer = classVarDecResult.pointer;
	}

	while (["constructor", "function", "method"].includes(tokens[pointer]?.value)) {
		const subroutineResult = compileSubroutine(tokens, pointer, context);
		code += subroutineResult.code;
		pointer = subroutineResult.pointer;
	}

	pointer++; // '}'

	return { code, pointer };
}

function compileSubroutine(tokens, pointer, context) {
    const { className } = context;
	context['suboutineType'] = tokens[pointer].value;
    symbolTable.startSubroutine(className, context.subroutineType);

    let code = "";

    pointer++; // 'function'
    pointer++; // function return type
    const subroutineName = tokens[pointer].value;
    context["subroutineName"] = subroutineName;
    pointer++; // function name

    pointer++; // '('

    // Parameter list
    const parameterListResult = compileParameterList(tokens, pointer, context);
    pointer = parameterListResult.pointer;

    pointer++; // ')'

    const body = compileSubroutineBody(tokens, pointer, context);
    
    code += VMWriter.writeFunction(
        `${context.className}.${context.subroutineName}`,
        body.nLocals
    );
    
    code += body.code;
    pointer = body.pointer;

    return { code, pointer };
}

function compileTerminalToken(token) {
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

	return `<${tag}> ${escapedValue} </${tag}>\n`;
}

function compileParameterList(tokens, pointer, context) {
	let code = "";
	let count = 0;

	while (tokens[pointer].value !== ")") {
		pointer++; // parameter type

		const parameterName = tokens[pointer].value;
		symbolTable.defineSubroutineSymbol(parameterName, context.className, "argument");
		pointer++; // parameter name
		count++;

		if (tokens[pointer].value === ",") {
			pointer++; // comma separator
		}
	}

	return { code, pointer, count };
}

function compileSubroutineBody(tokens, pointer, context) {
    let code = "";
    let nLocals = 0;
    let varDecCode = "";

    pointer++; // {

    while (tokens[pointer].value === "var") {
        // var declarations
        const result = compileVarDec(tokens, pointer);
        varDecCode += result.code;
        nLocals += result.varCount;
        pointer = result.pointer;
    }

    code += varDecCode;

    const statementsResult = compileStatements(tokens, pointer, context); // statements
    code += statementsResult.code;
    pointer = statementsResult.pointer;

    pointer++; // }

    return { code, pointer, nLocals }; // Return nLocals with the result
}

function compileClassVarDec(tokens, pointer) {
	let code = "";

	// Parse kind and type
	const kind = tokens[pointer].value; // 'static' or 'field'
	pointer++;

	const type = tokens[pointer].value; // e.g., 'int' or 'boolean'
	pointer++;

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

function compileVarDec(tokens, pointer) {
    let code = "";
    let varCount = 0;

    // Parse kind and type
    pointer++; // 'var'

    const type = tokens[pointer].value;
    pointer++; // type

    while (tokens[pointer].value !== ";") {
        varCount++; // Increment var count
        const name = tokens[pointer].value;

        pointer++; // varName
        symbolTable.defineSubroutineSymbol(name, type, "local");

        if (tokens[pointer].value === ",") {
            pointer++; // ','
        }
    }

    pointer++; // ;
    return { code, pointer, varCount };
}

function compileStatements(tokens, pointer, context) {
	let code = "";

	while (tokens[pointer].value !== "}") {
		switch (tokens[pointer].value) {
			case "do":
				const doResult = compileDo(tokens, pointer, context);
				code += doResult.code;
				pointer = doResult.pointer;
				break;
			case "let":
				const letResult = compileLet(tokens, pointer, context);
				code += letResult.code;
				pointer = letResult.pointer;
				break;
			case "while":
				const whileResult = compileWhile(tokens, pointer, context);
				code += whileResult.code;
				pointer = whileResult.pointer;
				break;
			case "return":
				const returnResult = compileReturn(tokens, pointer, context);
				code += returnResult.code;
				pointer = returnResult.pointer;
				break;
			case "if":
				const ifResult = compileIf(tokens, pointer, context);
				code += ifResult.code;
				pointer = ifResult.pointer;
				break;
		}
	}
	return { code, pointer };
}

function compileDo(tokens, pointer, context) {
	// 'do' subroutineCall ';'

	let code = "";
	let f = "";

	pointer++; // 'do'

	const subroutineCallResult = compileSubroutineCall(tokens, pointer, context);
	code += subroutineCallResult.code;
	pointer = subroutineCallResult.pointer;

	pointer++; // ';'

	return { code, pointer };
}

function compileLet(tokens, pointer, context) {
	// 'let' varName ('[' expression ']')? '=' expression ';'

	let code = "";
	pointer++; // 'let'

	// resolve varname to write pop at the end
	const varName = tokens[pointer].value;

	const { segment, index } = resolveVarName(varName);

	pointer++; // varName

	if (tokens[pointer].value === "[") {
		code += compileTerminalToken(tokens[pointer++]); // '['

		const expressionResult = compileExpression(tokens, pointer, context);
		code += expressionResult.code;
		pointer = expressionResult.pointer;

		code += compileTerminalToken(tokens[pointer++]); // ']'
	}

	pointer++; // '='

	// Expression
	const expressionResult = compileExpression(tokens, pointer, context);
	code += expressionResult.code;
	pointer = expressionResult.pointer;

	pointer++; // ';'
	code += VMWriter.writePop(segment, index);

	return { code, pointer };
}

function compileWhile(tokens, pointer, context) {
	// 'while' '(' expression ')' '{' statements '}'
	const label = `${context.className}.${context.subroutineName}`;
	const whileLabel = `${label}.WHILE.${pointer}`;
	const exitWhile = `${label}.EXIT_WHILE.${pointer}`;

	let code = "";
	pointer++; // 'while'
	pointer++; // '('

	code += VMWriter.writeLabel(whileLabel);

	// Expression
	const expressionResult = compileExpression(tokens, pointer, context);
	code += expressionResult.code;
	pointer = expressionResult.pointer;

	code += VMWriter.writeArithmetic("not");
	code += VMWriter.writeIf(exitWhile);

	pointer++; // ')'
	pointer++; // '{'

	// Statements
	const statementsResult = compileStatements(tokens, pointer, context); // statements
	code += statementsResult.code;
	pointer = statementsResult.pointer;

	pointer++; // '}'
	code += VMWriter.writeGoto(whileLabel);
	code += VMWriter.writeLabel(exitWhile);

	return { code, pointer };
}

function compileReturn(tokens, pointer, context) {
	// 'return' expression? ';'
	let code = "";

	pointer++; // 'return'

	// Optional expression
	if (tokens[pointer].value !== ";") {
		const expressionResult = compileExpression(tokens, pointer, context);
		code += expressionResult.code;
		pointer = expressionResult.pointer;
	}

	code += VMWriter.writeReturn();
	pointer++; // ;

	return { code, pointer };
}

function compileIf(tokens, pointer, context) {
	const label = `${context.className}.${context.subroutineName}`;
	const falseLabel = `${label}.IF_FALSE.${pointer}`;
	const endLabel = `${label}.IF_END.${pointer}`;
	let code = "";

	pointer++; // 'if'
	pointer++; // '('

	// Expression
	const expressionResult = compileExpression(tokens, pointer, context);
	code += expressionResult.code;
	pointer = expressionResult.pointer;

	code += VMWriter.writeArithmetic("not");
	code += VMWriter.writeIf(falseLabel);

	pointer++; // ')'
	pointer++; // '{'

	// Statements
	const statementsResult = compileStatements(tokens, pointer, context); // statements
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
		const elseStatementsResult = compileStatements(tokens, pointer, context);
		code += elseStatementsResult.code;
		pointer = elseStatementsResult.pointer;

		pointer++; // '}'
	}
	code += VMWriter.writeLabel(endLabel);

	return { code, pointer };
}

function compileExpression(tokens, pointer, context) {
	let code = "";

	// Compile first term
	const termResult = compileTerm(tokens, pointer, context);
	code += termResult.code;
	pointer = termResult.pointer;

	// Compile (op term)* pattern
	while (operators.includes(tokens[pointer]?.value)) {
		const op = VMWriter.writeArithmetic(tokens[pointer]?.value);
		pointer++;

		const nextTermResult = compileTerm(tokens, pointer, context);

		code += nextTermResult.code;
		code += op;
		pointer = nextTermResult.pointer;
	}

	return { code, pointer };
}

function compileTerm(tokens, pointer, context) {
    let code = "";
    const nextToken = tokens[pointer + 1] || {};

    if (tokens[pointer].tokenType === "INT_CONST") {
        code += VMWriter.writePush("constant", tokens[pointer++].value);
    }
    else if (tokens[pointer].tokenType === "STRING_CONST" || ["this"].includes(tokens[pointer].value)) {
        code += compileTerminalToken(tokens[pointer++]);
    }
    else if (tokens[pointer].value === "true") {
        code += VMWriter.writePush("constant", 1);
        code += VMWriter.writeArithmetic("neg");
        pointer++;
    }
    else if (["false", "null"].includes(tokens[pointer].value)) {
        code += VMWriter.writePush("constant", 0);
        pointer++;
    }
    else if (["-", "~"].includes(tokens[pointer].value)) {
        const op = tokens[pointer].value === "-" ? "neg" : "not";
        pointer++;
        const termResult = compileTerm(tokens, pointer, context);
        code += termResult.code; // Compile term first (e.g., push constant 1)
        code += VMWriter.writeArithmetic(op); // Apply neg or not after
        pointer = termResult.pointer;
    }
    else if (tokens[pointer].value === "(") {
        pointer++;
        const expressionResult = compileExpression(tokens, pointer, context);
        code += expressionResult.code;
        pointer = expressionResult.pointer;
        pointer++;
    }
    else if (nextToken.value === "[") {
        code += compileTerminalToken(tokens[pointer++]);
        code += compileTerminalToken(tokens[pointer++]);
        const expressionResult = compileExpression(tokens, pointer, context);
        code += expressionResult.code;
        pointer = expressionResult.pointer;
        code += compileTerminalToken(tokens[pointer++]);
    }
    else if (nextToken.value === "." || nextToken.value === "(") {
        const subroutineCallResult = compileSubroutineCall(tokens, pointer, context);
        code += subroutineCallResult.code;
        pointer = subroutineCallResult.pointer;
    }
    else {
        const varName = tokens[pointer++].value;
        const { segment, index } = resolveVarName(varName);
        code += VMWriter.writePush(segment === "field" ? "this" : segment, index);
    }
    return { code, pointer };
}

function compileExpressionList(tokens, pointer, context) {
	let code = "";
	let count = 0;

	// Handle empty expression list (e.g., f())
	if (tokens[pointer].value === ")") {
		return { code, pointer, count };
	}

	while (true) {
		count++;
		const expResult = compileExpression(tokens, pointer, context);
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

function compileSubroutineCall(tokens, pointer, context) {
	let code = "";
	const identifier = tokens[pointer].value;
	f = `${context.className}.${identifier}`; // TODO: fix this duplicate reassignment to subroutineName in the two possible cases of do class.method() vs do method()
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
	} = compileExpressionList(tokens, pointer, context);
	code += expressionListCode;
	pointer = expressionListPointer;

	pointer++; // ')'
	code += VMWriter.writeCall(f, count);
	return { code, pointer };
}

function resolveVarName(varName) {
	const entry = symbolTable["subroutine"].table[varName] ?? symbolTable["class"].table[varName];

	if (!entry) {
		throw `${varName} is not defined`;
	}

	return { segment: entry.kind === "field" ? "this" : entry.kind, ...entry };
}

module.exports = { parseToXML };
