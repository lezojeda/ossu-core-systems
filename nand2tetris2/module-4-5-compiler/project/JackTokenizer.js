const fs = require("fs");
const symbols = require("./symbols");
const keywords = require("./keywords");

/**
 * Removes all comments and white space from the input stream and breaks it into Jack-language tokens.
 * @param {string} source - Path to the source file to tokenize
 * @returns {Array<string>} Array of tokens
 */
function tokenize(source) {
	const content = fs.readFileSync(source, "utf8");
	const cleanContents = removeComments(content);
	const tokens = [];

	let pointer = 0;
	let currentToken = "";

	while (pointer <= cleanContents.length - 1) {
		if (cleanContents[pointer] === " ") {
			// whitespace, move pointer to next position
			pointer += 1;
		} else {
			const { value, length } = extractToken(cleanContents, pointer);
			const tokenType = getTokenType(value);
			const keyword = tokenType === "KEYWORD" ? getKeyword(value) : undefined;

			currentToken = {
				tokenType: cleanContents[pointer] === '"' ? "STRING_CONST" : tokenType,
				value,
				...(keyword && { keyword }), 
			};

			tokens.push(currentToken);
			currentToken = {};

			pointer += length;
		}
	}

	return tokens;
}

/**
 * Removes newlines and comments from the source content
 * @param {string} content - Raw file content
 * @returns {string} Cleantokens[pointer].valueed content with comments and newlines removed
 */
function removeComments(content) {
	return content
		.replace(/\/\*[\s\S]*?\*\//g, "") // Remove /* multi-line */ comments
		.replace(/\/\/.*$/gm, "") // Remove // single-line comments
		.split("\n")
		.map(line => line.trim())
		.filter(line => line.length > 0)
		.join("");
}

/**
 * Extracts either a string constant, integer or identifier from the contents
 * @param {string} contents - The cleaned source content
 * @param {number} startPosition - Current position in the contents
 * @returns {{value: string, length: number}} Extracted token and length consumed
 */
function extractToken(contents, startPosition) {
	const currentChar = contents[startPosition];
	const isStringConstant = currentChar === '"';
	let pos = startPosition;

	if (isStringConstant) {
		return extractStringConstant(contents, pos);
	} else if (isSymbol(currentChar)) {
		return extractSymbol(currentChar);
	} else {
		return extractIdentifierOrKeywordOrInt(contents, pos);
	}
}

function extractStringConstant(contents, pos) {
	const startPosition = pos;
	let token = "";
	pos += 1; // Skip past the opening quote

	while (pos < contents.length && contents[pos] !== '"') {
		token += contents[pos];
		pos++;
	}

	pos += 1; // Skip past the closing quote
	return {
		value: token,
		length: pos - startPosition,
	};
}

function extractSymbol(symbol) {
	return {
		value: symbol,
		length: 1,
		tokenType: "SYMBOL",
	};
}

// hate this function name gotta fix
function extractIdentifierOrKeywordOrInt(contents, pos) {
	const startPosition = pos;
	let token = "";

	while (pos < contents.length && contents[pos] !== " " && !isSymbol (contents[pos])) {
		token += contents[pos];
		pos++;
	}

	return {
		value: token,
		length: pos - startPosition,
	};
}

/**
 * Gets the type of the current token
 * @returns {string} Token type
 */
function getTokenType(token) {
	if (isSymbol(token)) {
		return "SYMBOL";
	} else if (isNumber(token)) {
		return "INT_CONST";
	} else if (keywords.includes(token)) {
		return "KEYWORD";
	} else {
		return "IDENTIFIER";
	}
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
 * Checks if character is a number
 * @param {string} char - Character to check
 * @returns {boolean} True if the character is a number
 */
function isNumber(char) {
	return /\d+/.test(char);
}

/**
 * Gets the keyword value of the current token
 * @returns {string} Keyword value
 */
function getKeyword(token) {
	return keywords.find(k => k === token);
}

module.exports = { tokenize };
