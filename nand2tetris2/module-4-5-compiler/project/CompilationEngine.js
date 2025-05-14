const operators = require("./operators");
const symbolTable = require("./SymbolTable");
const VMWriter = require("./VMWriter");
const context = require("./context");

function compile(tokens, pointer = 0) {
	const { code } = compileClass(tokens, pointer);
	return code;
}

function compileClass(tokens, pointer) {
	symbolTable.startClass();
	let code = "";

	pointer++; // 'class'

	const className = tokens[pointer].value;
	context["className"] = className;

	pointer++; // class name
	pointer++; // '{'

	while (["static", "field"].includes(tokens[pointer].value)) {
		const classVarDecResult = compileClassVarDec(tokens, pointer);
		code += classVarDecResult.code;
		pointer = classVarDecResult.pointer;
	}

	while (["constructor", "function", "method"].includes(tokens[pointer].value)) {
		const subroutineResult = compileSubroutine(tokens, pointer, context);
		code += subroutineResult.code;
		pointer = subroutineResult.pointer;
	}

	pointer++; // '}'

	return { code, pointer };
}

function compileSubroutine(tokens, pointer, context) {
	let code = "";

	const { className } = context;
	const subroutineType = tokens[pointer].value;
	context["subroutineType"] = subroutineType;
	symbolTable.startSubroutine(className, subroutineType);

	pointer++; // 'function', 'method' or 'constructor'
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

	code += VMWriter.writeFunction(`${context.className}.${context.subroutineName}`, body.nLocals);

	if (subroutineType === "constructor") {
		const nFields = symbolTable.getFieldCount(context.className);
		code += VMWriter.writePush("constant", nFields);
		code += VMWriter.writeCall("Memory.alloc", 1);
		code += VMWriter.writePop("pointer", 0);
	} else if (subroutineType === "method") {
		code += VMWriter.writePush("argument", 0);
		code += VMWriter.writePop("pointer", 0);
	}

	code += body.code;
	pointer = body.pointer;

	return { code, pointer };
}

function compileParameterList(tokens, pointer, context) {
	let code = "";
	let count = 0;

	while (tokens[pointer].value !== ")") {
		pointer++; // parameter type

		const parameterName = tokens[pointer].value;
		const type = tokens[pointer - 1].value;
		symbolTable.defineSubroutineSymbol(parameterName, type, "argument");
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
		symbolTable.defineSubroutineSymbol(name, type, "var");

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
	code += subroutineCallResult.code + VMWriter.writePop("temp", 0);
	pointer = subroutineCallResult.pointer;

	pointer++; // ';'

	return { code, pointer };
}

function compileLet(tokens, pointer, context) {
	// 'let' varName ('[' expr1 ']')? '=' expr2 ';'

	pointer++; // 'let'

	const varName = tokens[pointer].value;
	let code = "";

	const nextToken = tokens[pointer + 1].value;

	let isArrayAssignent = false;
	if (nextToken === "[") {
		isArrayAssignent = true;
		pointer++; // varName
		pointer++; // '['

		code += VMWriter.writePush(resolveSegment(varName), resolveIndex(varName));

		const expr1Result = compileExpression(tokens, pointer, context);
		code += expr1Result.code; // Push value of expr1 (e.g., a[3])
		pointer = expr1Result.pointer;

		code += VMWriter.writeArithmetic("add");
		pointer++; // ']'
	} else {
		pointer++; // varName
	}

	pointer++; // '='

	// expr2
	const expressionResult = compileExpression(tokens, pointer, context);
	code += expressionResult.code;
	pointer = expressionResult.pointer;

	pointer++; // ';'

	if (isArrayAssignent) {
		code += VMWriter.writePop("temp", 0);
		code += VMWriter.writePop("pointer", 1);
		code += VMWriter.writePush("temp", 0);
		code += VMWriter.writePop("that", 0);
	} else {
		code += VMWriter.writePop(resolveSegment(varName), resolveIndex(varName));
	}

	return { code, pointer };
}

function compileWhile(tokens, pointer, context) {
	// 'while' '(' expression ')' '{' statements '}'
	let code = "";
	const label = `${context.className}.${context.subroutineName}`;
	const whileLabel = `${label}.WHILE.${pointer}`;
	const exitWhile = `${label}.EXIT_WHILE.${pointer}`;

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
	const token = tokens[pointer];
	const nextToken = tokens[pointer + 1] || {};

	const pushConstant = value => {
		code += VMWriter.writePush("constant", value);
	};

	switch (token.tokenType) {
		case "INT_CONST":
			pushConstant(token.value);
			pointer++;
			break;

		case "STRING_CONST":
			const str = token.value;
			pushConstant(str.length);
			code += VMWriter.writeCall("String.new", 1);
			for (let i = 0; i < str.length; i++) {
				pushConstant(str.charCodeAt(i));
				code += VMWriter.writeCall("String.appendChar", 2);
			}
			pointer++;
			break;

		case "IDENTIFIER":
			if (nextToken.value === "[") {
				const varName = token.value;
				const baseSegment = resolveSegment(varName);
				const baseIndex = resolveIndex(varName);

				code += VMWriter.writePush(baseSegment, baseIndex);
				pointer++; // skip varName
				pointer++; // skip '['

				const exprResult = compileExpression(tokens, pointer, context);

				code += exprResult.code; // push offset

				code += VMWriter.writeArithmetic("add"); // base + offset
				code += VMWriter.writePop("pointer", 1);
				code += VMWriter.writePush("that", 0);

				pointer = exprResult.pointer + 1; // skip ']'
			} else if (nextToken.value === "." || nextToken.value === "(") {
				const call = compileSubroutineCall(tokens, pointer, context);
				code += call.code;
				pointer = call.pointer;
			} else {
				const varName = token.value;
				code += VMWriter.writePush(resolveSegment(varName), resolveIndex(varName));
				pointer++;
			}
			break;

		case "KEYWORD":
			switch (token.value) {
				case "this":
					code += VMWriter.writePush("pointer", 0);
					break;
				case "true":
					pushConstant(1);
					code += VMWriter.writeArithmetic("neg");
					break;
				case "false":
				case "null":
					pushConstant(0);
					break;
			}
			pointer++;
			break;

		case "SYMBOL":
			if (token.value === "(") {
				pointer++;
				const expr = compileExpression(tokens, pointer, context);
				code += expr.code;
				pointer = expr.pointer + 1; // skip ')'
			} else if (token.value === "-" || token.value === "~") {
				const op = token.value === "-" ? "neg" : "not";
				pointer++;
				const term = compileTerm(tokens, pointer, context);
				code += term.code;
				code += VMWriter.writeArithmetic(op);
				pointer = term.pointer;
			}
			break;

		default:
			throw new Error(`Unexpected token: ${token.value}`);
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
	const identifier = tokens[pointer].value; // ClassName or varName
	let code = "";
	let f = `${context.className}.${identifier}`;
	pointer++;

	let objectBase = null;
	let className = null;
	let subroutineName = null;
	let isMethod = false;

	// Check for explicit subroutine call (e.g., varName.method() or ClassName.function())
	if (tokens[pointer].value === ".") {
		pointer++; // skip '.'
		subroutineName = tokens[pointer].value;
		pointer++; // skip subroutineName

		const varEntry =
			symbolTable.subroutine.table[identifier] || symbolTable.class.table[identifier];

		if (varEntry) {
			// varName.method() -- it's a method call on an object
			isMethod = true;
			className = varEntry.type;
			f = `${className}.${subroutineName}`;
			objectBase = identifier;
		} else {
			// ClassName.new() or ClassName.function()
			className = identifier;
			f = `${className}.${subroutineName}`;
		}
	} else {
		// Implicit method call within current class
		subroutineName = identifier;
		f = `${context.className}.${subroutineName}`;
		isMethod = true;
		objectBase = "this";
	}

	pointer++; // skip '('

	// Compile expression list
	const {
		code: expressionListCode,
		pointer: newPointer,
		count,
	} = compileExpressionList(tokens, pointer, context);
	pointer = newPointer;
	pointer++; // skip ')'
	code += expressionListCode;

	let argCount = count;

	// If it's a method, push the object (including 'this') as the first argument
	if (isMethod) {
		if (objectBase === "this") {
			code = VMWriter.writePush("pointer", 0) + code;
		} else {
			const segment = resolveSegment(objectBase);
			const index = resolveIndex(objectBase);
			code = VMWriter.writePush(segment, index) + code;
		}
		argCount += 1;
	}

	code += VMWriter.writeCall(f, argCount);

	return { code, pointer };
}

function resolveVarName(varName) {
	const entry = symbolTable["subroutine"].table[varName] ?? symbolTable["class"].table[varName];

	if (!entry) {
		throw `${varName} is not defined`;
	}

	return { segment: entry.kind === "field" ? "this" : entry.kind, ...entry };
}

function resolveSegment(name) {
	const sub = symbolTable.subroutine.table[name];
	if (sub) {
		switch (sub.kind) {
			case "var":
				return "local";
			case "argument":
				return "argument";
			default:
				throw new Error(`Unknown subroutine variable kind: ${sub.kind}`);
		}
	}

	const cls = symbolTable.class.table[name];
	if (cls) {
		switch (cls.kind) {
			case "field":
				return "this";
			case "static":
				return "static";
			default:
				throw new Error(`Unknown class variable kind: ${cls.kind}`);
		}
	}

	throw new Error(`Variable '${name}' not found in symbol tables`);
}

function resolveIndex(name) {
	const sub = symbolTable.subroutine.table[name];
	if (sub) return sub.index;

	const cls = symbolTable.class.table[name];
	if (cls) return cls.index;

	throw new Error(`Variable '${name}' not found in symbol tables`);
}

module.exports = { compile };
