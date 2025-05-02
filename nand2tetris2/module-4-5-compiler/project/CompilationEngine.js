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
		// var declarations
		const result = compileVarDec(tokens, tab + 1, pointer);
		xml += result.xml;
		pointer = result.pointer;
	}

	const statementsResult = compileStatements(tokens, tab + 1, pointer); // statements
	xml += statementsResult.xml;
	pointer = statementsResult.pointer;

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
		// check if current token is do, let, while, return or if and pass control to its compile function
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

function compileDo(tokens, tab) {}

function compileLet(tokens, tab) {}

function compileWhile(tokens, tab) {}

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

	if (tokens[pointer].value !== ";") {
		const expressionResult = compileExpression(tokens, tab, pointer);
		xml += expressionResult.xml;
		pointer += expressionResult.pointer;
	}

	xml += compileTerminalToken(tokens[pointer++], tab + 1); // ;
	xml += `${tabs}</returnStatement>\n`;
	return { xml, pointer };
}

function compileIf(tokens, tab) {}

function compileExpression(tokens, pointer, tab) {
	// term (op term)*
	/**
	 * <expression>
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

	xml += `${tabs}</expression>\n`;

	return { xml, pointer };
}

function compileTerm(tokens, tab) {}

function compileExpressionList(tokens, tab) {}

module.exports = { parseToXML };
