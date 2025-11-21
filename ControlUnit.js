import { OPCODES } from "../const/opcodes.js";
import { ALU } from "./ALU.js";

export default class ControlUnit {
    decode(raw) {
        // Extract the 4-bit opcode
        // e.g., RAW = 0x1523
        const opcode = (raw >> 12) & 0xF;
        // >> Moves right 12 bits
        // & Masks to get last 4 bits

        /* 
            ADD decode example
        {
            type: "R",
            opcode: 0,
            rd: 2,
            rs1: 1,
            rs2: 3,
            aluOp: ALU.ADD
        }
        */

        switch (opcode) {
            // -------------------------
            // R–TYPE: ADD - Operations between registers
            // -------------------------
            case OPCODES.ADD: {
                const rd  = (raw >> 8) & 0xF;
                const rs1 = (raw >> 4) & 0xF;
                const rs2 = raw & 0xF;

                return {
                    type: "R",
                    opcode,
                    rd,
                    rs1,
                    rs2,
                    aluOp: ALU.ADD
                };
            }

            // -------------------------
            // I–TYPE: ADDI - Operations with immediate
            // -------------------------
            case OPCODES.ADDI: {
                const rd  = (raw >> 8) & 0xF;
                const rs1 = (raw >> 4) & 0xF;
                const imm = raw & 0xF;  // 4-bit immediate

                return {
                    type: "I",
                    opcode,
                    rd,
                    rs1,
                    imm: this.signExtend4(imm),
                    aluOp: ALU.ADD
                };
            }

            // -------------------------
            // LOAD
            // -------------------------
            case OPCODES.LOAD: {
                const rd  = (raw >> 8) & 0xF;
                const rs1 = (raw >> 4) & 0xF;
                const imm = raw & 0xF;

                return {
                    type: "LOAD",
                    opcode,
                    rd,
                    rs1,
                    imm: this.signExtend4(imm)
                };
            }

            // -------------------------
            // STORE
            // -------------------------
            case OPCODES.STORE: {
                const rs2 = (raw >> 8) & 0xF;
                const rs1 = (raw >> 4) & 0xF;
                const imm = raw & 0xF;

                return {
                    type: "STORE",
                    opcode,
                    rs1,
                    rs2,
                    imm: this.signExtend4(imm)
                };
            }

            // -------------------------
            // JUMP (12-bit immediate)
            // -------------------------
            case OPCODES.JMP: {
                const imm = raw & 0xFFF;

                return {
                    type: "JUMP",
                    opcode,
                    target: imm
                };
            }

            // -------------------------
            // BRANCH IF EQUAL - Conditional
            // -------------------------
            case OPCODES.BEQ: {
                const rs1 = (raw >> 8) & 0xF;
                const rs2 = (raw >> 4) & 0xF;
                const imm = raw & 0xF;

                return {
                    type: "BRANCH",
                    opcode,
                    rs1,
                    rs2,
                    target: this.signExtend4(imm)
                };
            }

            // -------------------------
            // HALT - Stop execution (Emulation based)
            // -------------------------
            case OPCODES.HALT:
                return { type: "HALT", opcode };

            // -------------------------
            // UNKNOWN OPCODE
            // -------------------------
            default:
                throw new Error(`Unknown opcode in instruction: 0x${raw.toString(16)}`);
        }
    }

    // Helper for signed 4-bit values (-8 to +7)
    // MIPS, ARM, x86... all use sign extension
    signExtend4(imm) {
        return (imm & 0x8) ? imm | 0xFFFFFFF0 : imm;
    }
}