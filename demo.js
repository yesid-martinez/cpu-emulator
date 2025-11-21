import ProgramCounter from "./logic/ProgramCounter.js";
import Registers from "./logic/Registers.js";
import { ALU } from "./logic/ALU.js";
import ControlUnit from "./logic/ControlUnit.js";
import { InstructionMemory, DataMemory } from "./logic/Memory.js";
import Flags from "./logic/Flag.js";
import CPU from "./logic/CPU.js";
import { assemble } from "./assembler.js";

const pc = new ProgramCounter({ initial: 0, maxAddress: 65535 });
const regs = new Registers(16, 16);
const control = new ControlUnit();
const instrMem = new InstructionMemory(256);
const dataMem = new DataMemory(256);
const flags = new Flags();
// ALU: we use ALU.execute static object, not instanced
const cpu = new CPU({ pc, registers: regs, alu: ALU, controlUnit: control, instrMemory: instrMem, dataMemory: dataMem, flags });

// sample program: compute 10 + 20 -> R3 ; HALT
const asm = `
; load constants into registers
ADDI R1, R0, 10
ADDI R2, R0, 20
ADD  R3, R1, R2
HALT
`;

console.log("Assembling program...");
const program = assemble(asm);
instrMem.loadProgram(program);
console.log("Program words:", program.map(w => "0x" + w.toString(16).padStart(4,"0")));

// run until HALT or max cycles
let cycles = 0;
const MAX = 1000;
console.log("Starting CPU...");
while (!cpu.halted && cycles < MAX) {
    cpu.tick();
    cycles++;
}

console.log(`Finished after ${cycles} cycles. CPU halted=${cpu.halted}`);
console.log("Registers:");
console.log(regs.dump());
console.log("Flags:", flags.toString());
console.log("Data memory (first 16):", dataMem.dumpRange(0, 15));
