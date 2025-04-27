const fs = require("fs");
const symbols = require("./symbols");

// Removes all comments and white space from the input stream and breaks it into Jack-language tokens, as specified by the Jack grammar.

function tokenize(source) {
	const content = fs.readFileSync(source, "utf8");

	const cleanContents = clean(content);

	const tokens = [];
	let pointer = 0;
	let currentToken = "";

	while (pointer <= cleanContents.length - 1) {
		let currentChar = cleanContents[pointer];

		if (isSymbol(currentChar) || isIntegerConstant(currentChar)) {
			currentToken = currentChar;
			pointer += 1;
		} else if (currentChar === " ") {
			// whitespace, move pointer to next position and add current token to tokens array
			pointer += 1;
		} else {
			const result = handleStringConstant(cleanContents, pointer);
			currentToken = result.value;
			pointer += result.length;
		}

		if (currentToken) {
			tokens.push(currentToken);
			currentToken = "";
		}
	}

	return tokens;
}

function clean(content) {
	/** Remove newlines and comments */
	return content
		.split("\n")
		.map(line => line.split(/\/\/|\/\*\*/)[0].trim())
		.filter(line => Boolean(line))
		.join("");
}

function handleStringConstant(contents, startPosition) {
	const isStringConstant = contents[startPosition] === '"';
	let currentPosition = startPosition;
	let stringConstant = "";

	if (isStringConstant) {
		currentPosition += 1; // Skip past the opening quote
		while (currentPosition < contents.length && contents[currentPosition] !== '"') {
			stringConstant += contents[currentPosition];
			currentPosition++;
		}
		currentPosition += 1; // SKip past the closing quote
	} else {
		while (
			currentPosition < contents.length &&
			contents[currentPosition] !== " " &&
			!isSymbol(contents[currentPosition])
		) {
			stringConstant += contents[currentPosition];
			currentPosition++;
		}
	}

	const charsConsumed = currentPosition - startPosition;

	return {
		value: stringConstant,
		length: charsConsumed,
	};
}

/** Returns true/false if character passed is any of
 * { | } | ( | ) | [ | ] | . | , | ; | + | - | * | / | & |
 * | | | < | > | = | -
 */
function isSymbol(char) {
	return symbols.includes(char);
}

function isIntegerConstant(char) {
	return /^\d$/.test(char);
}

function getTokenType() {}

/** Only if current token is KEYWORD */
function getKeyword() {}

/** Only if current token is SYMBOL */
function getSymbol() {}

/** Only if current token is INT_CONST */
function getIntValue() {}

/** Only if current token is STRING_CONST */
function getIntValue() {}

module.exports = { tokenize };
