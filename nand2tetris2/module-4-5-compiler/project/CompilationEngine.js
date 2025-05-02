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
	const body = compileSubroutineBody(tokens, tab + 1, pointer);
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
		// var declarations
		const result = compileVarDec(tokens, tab + 1, pointer);
		xml += result.xml;
		pointer = result.pointer;
	}

	const statementsResult = compileStatements(tokens, tab + 1, pointer); // statements
	xml += statementsResult.xml;
	pointer = statementsResult.pointer;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // }
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

function compileStatements(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<statements>\n`;

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
				const ifResult = compileIf(tokens, tab + 1, pointer);
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
	/**
	 * <doStatement>
          <keyword> do </keyword>
          <identifier> game </identifier>
          <symbol> . </symbol>
          <identifier> run </identifier>
          <symbol> ( </symbol>
          <expressionList>
          </expressionList>
          <symbol> ) </symbol>
          <symbol> ; </symbol>
        </doStatement>
	 */

	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<doStatement>\n`;

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'do'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'identifier'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '.'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'subroutine'
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // '('

	// compile expressionlist
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
	/**
	 * Example: 
	 * <returnStatement>
          <keyword> return </keyword>
          <symbol> ; </symbol>
        </returnStatement>
	 */

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

function compileIf(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<ifStatement>\n`;
	xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'if'
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

	// Handle optional else clause
	if (tokens[pointer]?.value === "else") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // 'else'
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // '{'
		// Statements
		const elseStatementsResult = compileStatements(tokens, tab + 1, pointer);
		xml += elseStatementsResult.xml;
		pointer = elseStatementsResult.pointer;
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // '}'
	}

	xml += `${tabs}</ifStatement>\n`;
	return { xml, pointer };
}

function compileExpression(tokens, tab, pointer) {
	// term (op term)*
	/**
	 *  <expression>
            <term>
              <identifier> Array </identifier>
              <symbol> . </symbol>
              <identifier> new </identifier>
              <symbol> ( </symbol>
              <expressionList>
                <expression>
                  <term>
                    <identifier> length </identifier>
                  </term>
                </expression>
              </expressionList>
              <symbol> ) </symbol>
            </term>
        </expression>
	 */

	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<expression>\n`;

	const term = compileTerm(tokens, tab + 1, pointer);
	xml += term.xml;
	pointer = term.pointer;

	const jackOperators = ["+", "-", "*", "/", "&", "|", "<", ">", "="];
	while (jackOperators.includes(tokens[pointer].value)) {
		xml += compileTerminalToken(tokens[pointer++], tab + 1);

		// Compile next term
		const term = compileTerm(tokens, tab + 1, pointer);
		xml += term.xml;
		pointer = term.pointer;
	}

	xml += `${tabs}</expression>\n`;
	return { xml, pointer };
}

function compileTerm(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<term>\n`;

	const nextToken = tokens[pointer + 1] || {};

	// Integer constant, string constant, keyword constant, or simple identifier
	if (
		tokens[pointer].tokenType === "INT_CONST" ||
		tokens[pointer].tokenType === "STRING_CONST" ||
		["true", "false", "null", "this"].includes(tokens[pointer].value)
	) {
		xml += compileTerminalToken(tokens[pointer++], tab + 1);
	}
	// Unary operator term
	else if (["-", "~"].includes(tokens[pointer].value)) {
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // unary op
		const termResult = compileTerm(tokens, tab + 1, pointer);
		xml += termResult.xml;
		pointer = termResult.pointer;
	}
	// Grouped expression: (expression)
	else if (tokens[pointer].value === "(") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // '('
		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		xml += expressionResult.xml;
		pointer = expressionResult.pointer;
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // ')'
	}
	// Array access: varName[expression]
	else if (nextToken.value === "[") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // identifier
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // '['
		const expressionResult = compileExpression(tokens, tab + 1, pointer);
		xml += expressionResult.xml;
		pointer = expressionResult.pointer;
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // ']'
	}
	// Subroutine call: ClassName.subroutine() or subroutine()
	else if (nextToken.value === "." || nextToken.value === "(") {
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // identifier
		if (nextToken.value === ".") {
			xml += compileTerminalToken(tokens[pointer++], tab + 1); // '.'
			xml += compileTerminalToken(tokens[pointer++], tab + 1); // subroutine name
		}
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // '('
		// Compile expression list (arguments)
		const expListResult = compileExpressionList(tokens, tab + 1, pointer);
		xml += expListResult.xml;
		pointer = expListResult.pointer;
		xml += compileTerminalToken(tokens[pointer++], tab + 1); // ')'
	}
	// Simple variable name
	else {
		xml += compileTerminalToken(tokens[pointer++], tab + 1);
	}

	xml += `${tabs}</term>\n`;
	return { xml, pointer };
}

function compileExpressionList(tokens, tab, pointer) {
	const tabs = "\t".repeat(tab);
	let xml = `${tabs}<expressionList>\n`;

	// Handle empty expression list (e.g., f())
	if (tokens[pointer].value === ")") {
		xml += `${tabs}</expressionList>\n`;
		return { xml, pointer };
	}

	while (true) {
		const expResult = compileExpression(tokens, tab + 1, pointer);
		xml += expResult.xml;
		pointer = expResult.pointer;

		if (tokens[pointer].value === ",") {
			xml += compileTerminalToken(tokens[pointer++], tab + 1);
		} else {
			break; // no more expressions
		}
	}

	xml += `${tabs}</expressionList>\n`;
	return { xml, pointer };
}

module.exports = { parseToXML };
