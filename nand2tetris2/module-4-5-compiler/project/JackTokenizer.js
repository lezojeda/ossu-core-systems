const fs = require("fs");
const symbols = require("./symbols");

/**
 * Removes all comments and white space from the input stream and breaks it into Jack-language tokens.
 * @param {string} source - Path to the source file to tokenize
 * @returns {Array<string>} Array of tokens
 */
function tokenize(source) {
	const content = fs.readFileSync(source, "utf8");
	const cleanContents = removeCommentsAndWhitespace(content);
	const tokens = [];
	let pointer = 0;
	let currentToken = "";

	while (pointer <= cleanContents.length - 1) {
		let currentChar = cleanContents[pointer];

		/** symbol or digit */
		if (isSymbol(currentChar) || isDigit(currentChar)) {
			currentToken = currentChar;
			pointer += 1;
		} else if (currentChar === " ") {
			// whitespace, move pointer to next position and add current token to tokens array
			pointer += 1;
		} else {
			const result = extractStringOrIdentifier(cleanContents, pointer);
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

/**
 * Removes newlines and comments from the source content
 * @param {string} content - Raw file content
 * @returns {string} Cleaned content with comments and newlines removed
 */
function removeCommentsAndWhitespace(content) {
	return content
		.split("\n")
		.map(line => line.split(/\/\/|\/\*\*/)[0].trim())
		.filter(line => Boolean(line))
		.join("");
}

/**
 * Extracts either a string constant or identifier from the contents
 * @param {string} contents - The cleaned source content
 * @param {number} startPosition - Current position in the contents
 * @returns {{value: string, length: number}} Extracted token and length consumed
 */
function extractStringOrIdentifier(contents, startPosition) {
	const isStringConstant = contents[startPosition] === '"';
	let currentPosition = startPosition;
	let token = "";

	if (isStringConstant) {
		currentPosition += 1; // Skip past the opening quote
		while (currentPosition < contents.length && contents[currentPosition] !== '"') {
			token += contents[currentPosition];
			currentPosition++;
		}
		currentPosition += 1; // Skip past the closing quote
	} else {
		while (
			currentPosition < contents.length &&
			contents[currentPosition] !== " " &&
			!isSymbol(contents[currentPosition])
		) {
			token += contents[currentPosition];
			currentPosition++;
		}
	}

	const charsConsumed = currentPosition - startPosition;
	return {
		value: token,
		length: charsConsumed,
	};
}

/**
 * Checks if character is a symbol as defined in the Jack language
 * @param {string} char - Character to check
 * @returns {boolean} True if the character is a symbol
 */
function isSymbol(char) {
	return symbols.includes(char);
}

/**
 * Checks if character is a digit
 * @param {string} char - Character to check
 * @returns {boolean} True if the character is a digit
 */
function isDigit(char) {
	return /^\d$/.test(char);
}

/**
 * Gets the type of the current token
 * @returns {string} Token type
 */
function getTokenType() {
	// Implementation needed
}

/**
 * Gets the keyword value of the current token
 * @returns {string} Keyword value
 */
function getKeywordValue() {
	// Implementation needed
}

/**
 * Gets the symbol value of the current token
 * @returns {string} Symbol value
 */
function getSymbolValue() {
	// Implementation needed
}

/**
 * Gets the integer value of the current token
 * @returns {number} Integer value
 */
function getIntValue() {
	// Implementation needed
}

/**
 * Gets the string value of the current token
 * @returns {string} String value
 */
function getStringValue() {
	// Implementation needed
}

module.exports = { tokenize };
