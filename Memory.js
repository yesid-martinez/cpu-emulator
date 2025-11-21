export class InstructionMemory {
    constructor(size = 256) {
        this.size = size;
        this.memory = new Uint16Array(size);
    }

    loadProgram(programArray) {
        for (let i = 0; i < programArray.length && i < this.size; i++) {
        this.memory[i] = programArray[i] & 0xFFFF;
        }
    }

    read(address) {
        if (address < 0 || address >= this.size) {
        throw new Error(`InstructionMemory read out of range: ${address}`);
        }
        return this.memory[address];
    }
}

export class DataMemory {
    constructor(size = 1024) {
        this.size = size;
        this.memory = new Uint16Array(size);
    }

    read(address) {
        if (address < 0 || address >= this.size) {
        throw new Error(`DataMemory read out of range: ${address}`);
        }
        return this.memory[address];
    }

    write(address, value) {
        if (address < 0 || address >= this.size) {
        throw new Error(`DataMemory write out of range: ${address}`);
        }
        this.memory[address] = value & 0xFFFF;
    }

    dumpRange(from = 0, to = 16) {
        const out = [];
        for (let i = from; i <= to && i < this.size; i++) {
        out.push({ addr: i, value: this.memory[i] });
        }
        return out;
    }
}