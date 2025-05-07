// Static: Scope: class.
// Field: Scope: class.
// Argument: Scope: subroutine (method/function/constructor).
// Var: Scope: subroutine (method/function/constructor).

// name, type, kind, index
const symbolTable = {
	class: {
		table: {},
		counters: { static: 0, field: 0 },
	},
	subroutine: {
		table: {},
		counters: { argument: 0, local: 0 },
	},
	defineClassSymbol(name, type, kind) {
		const table = symbolTable["class"];
		const index = table.counters[kind];

		table[name] = { type, kind, index };
		table.counters[kind]++;
	},
	defineSubroutineSymbol(name, type, kind) {
		const table = symbolTable["subroutine"];
		const index = table.counters[kind];

		table[name] = { type, kind, index };
		table.counters[kind]++;
	},
	startSubroutine() {
		const table = symbolTable["subroutine"];
		this.subroutine.table = {};
		table.counters["argument"] = 0;
		table.counters["local"] = 0;
	},
};

module.exports = symbolTable;
