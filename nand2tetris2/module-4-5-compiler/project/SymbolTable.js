// Static: Scope: class.
// Field: Scope: class.
// Argument: Scope: subroutine (method/function/constructor).
// Var: Scope: subroutine (method/function/constructor).

// name, type, kind, index
const symbolTable = {
	class: {
		table: {},
		counters: { static: 0, field: 0 }
	},
	subroutine: {
		table: {},
		counters: { static: 0, field: 0 }
	},
	defineClassSymbol(name, type, kind) {
		const table = symbolTable["class"];
		const index = table.counters[kind];

		table[name] = {type, kind, index}
		table.counters[kind]++;
	}
};

function defineSubroutineSymbol(name, type, kind) {
	const index = symbolTable["subroutine"].counters[kind];

	symbolTable
}

module.exports = symbolTable;