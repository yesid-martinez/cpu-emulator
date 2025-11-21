// Synchronous Program Counter
// Clock controlled by tick() CPU method - Clock logic dont needed
// logic/ProgramCounter.js

export default class ProgramCounter {
    // Configurable max address
    // 16 bit by default
    constructor({ initial = 0, maxAddress = 65535 } = {}) {
        this.value = initial;
        this.maxAddress = maxAddress;
    }

    get() {
        return this.value;
    }

    // Protected against overflow
    increment() {
        const next = this.value + 1;

        if (next > this.maxAddress) {
            throw new Error(
                `PC overflow: attempted to increment beyond ${this.maxAddress}`
            );
        }

        this.value = next;
    }

    // Guarentees safe jumps
    load(addr) {
        if (addr < 0 || addr > this.maxAddress) {
            throw new Error(
                `PC load out of range: attempted to load address ${addr}`
            );
        }

        this.value = addr;
    }

    reset() {
        this.value = 0;
    }
}
