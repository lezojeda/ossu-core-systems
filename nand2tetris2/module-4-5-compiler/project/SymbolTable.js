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
		const context = symbolTable["class"];
		const index = context.counters[kind];

		context.table[name] = { type, kind, index };
		context.counters[kind]++;
	},
	defineSubroutineSymbol(name, type, kind) {
		const context = symbolTable["subroutine"];
		const index = context.counters[kind];

		context.table[name] = { type, kind, index };
		context.counters[kind]++;
	},
	startSubroutine(className, suboutineType) {
		const table = symbolTable["subroutine"];

		if (this.subroutineType === "method") {
			this.subroutine.table = { this: { type: className, kind: "argument", index: 0 } };
		}

		table.counters["argument"] = 0;
		table.counters["local"] = 0;
	},
	getFieldCount(className) {
		return Object.values(this.class.table).filter(
			entry => entry.kind === "field"
		).length;
	}
};

module.exports = symbolTable;
