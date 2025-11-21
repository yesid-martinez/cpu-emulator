// Orchestrates the CPU components
// logic/CPU.js
    import { ALU } from "./ALU.js";

    export default class CPU {
    constructor({ pc, registers, alu, controlUnit, instrMemory, dataMemory, flags }) {
        this.pc = pc;
        this.registers = registers;
        this.alu = alu;
        this.controlUnit = controlUnit;
        this.instrMemory = instrMemory;
        this.dataMemory = dataMemory;
        this.flags = flags;
        this.halted = false;
    }

    tick() {
        if (this.halted) return;
        const fetched = this.fetch();
        const decoded = this.decode(fetched);
        this.execute(decoded);
    }

    fetch() {
        const addr = this.pc.get();
        const raw = this.instrMemory.read(addr);
        return { raw, addr };
    }

    decode(fetched) {
        return this.controlUnit.decode(fetched.raw);
    }

    execute(d) {
        switch (d.type) {
        case "R": {
            const a = this.registers.read(d.rs1);
            const b = this.registers.read(d.rs2);
            const res = ALU.execute(d.aluOp, a, b);
            this.registers.write(d.rd, res.value);
            this.flags.setFlags(res);
            this.pc.increment();
            break;
        }

        case "I": {
            const a = this.registers.read(d.rs1);
            const res = ALU.execute(d.aluOp, a, d.imm);
            this.registers.write(d.rd, res.value);
            this.flags.setFlags(res);
            this.pc.increment();
            break;
        }

        case "LOAD": {
            const base = this.registers.read(d.rs1);
            const addr = base + d.imm;
            const val = this.dataMemory.read(addr);
            this.registers.write(d.rd, val);
            this.pc.increment();
            break;
        }

        case "STORE": {
            const base = this.registers.read(d.rs1);
            const addr = base + d.imm;
            const val = this.registers.read(d.rs2);
            this.dataMemory.write(addr, val);
            this.pc.increment();
            break;
        }

        case "BRANCH": {
            const a = this.registers.read(d.rs1);
            const b = this.registers.read(d.rs2);
            const res = ALU.execute(ALU.SUB, a, b);
            this.flags.setFlags(res);
            if (this.flags.zero) {
            // target is small signed immediate; we'll compute relative address
            // treat target as relative offset from current PC (common simple model)
            const targetAddr = (this.pc.get() + d.target) & 0xFFFF;
            this.pc.load(targetAddr);
            } else {
            this.pc.increment();
            }
            break;
        }

        case "JUMP": {
            this.pc.load(d.target);
            break;
        }

        case "HALT": {
            this.halted = true;
            break;
        }

        default:
            throw new Error(`CPU execute: unknown type ${d.type}`);
        }
    }
    }