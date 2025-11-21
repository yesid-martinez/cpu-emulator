export default class Registers {
    // 8 registers of configurable bit width
    constructor(numRegisters = 8, bitWidth = 16) {
        this.numRegisters = numRegisters;
        this.bitWidth = bitWidth;
        this.registers = new Array(numRegisters).fill(0); // Initialize all registers to 0
    }

    // Access methods
    read(regIndex) {
        this._checkIndex(regIndex);
        return this.registers[regIndex];
    }
    
    write(regIndex, value) {
        this._checkIndex(regIndex);
        const mask = (1 << this.bitWidth) - 1; // To ensure the value fits within the bitWidth
        this.registers[regIndex] = value & mask;
    }


    reset() {
        this.registers.fill(0);
    }

    _checkIndex(regIndex) {
        if (regIndex < 0 || regIndex >= this.numRegisters) {
            throw new Error(`Invalid register: ${regIndex}. Must be between 0 and ${this.numRegisters - 1}`);
        }
    }

    // Show all the register values
    dump() {
        return this.registers.map((val, idx) => `R${idx}: ${val}`).join(" | ");
    }
}