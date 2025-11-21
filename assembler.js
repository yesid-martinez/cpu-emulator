import { OPCODES } from "./const/opcodes.js";

const regIndex = (token) => {
    token = token.trim().toUpperCase();
    if (!token.startsWith("R")) throw new Error("Register must be Rn");
    return parseInt(token.slice(1), 10);
};

// simple assembler
export function assemble(assemblyText) {
    const lines = assemblyText
        .split("\n")
        .map(l => l.split(";")[0].trim())
        .filter(Boolean);

    const out = [];

    for (const line of lines) {
        const parts = line.replace(/,/g, " ").split(/\s+/).filter(Boolean);
        const op = parts[0].toUpperCase();

        switch (op) {
            case "ADD": {
                const rd = regIndex(parts[1]);
                const rs1 = regIndex(parts[2]);
                const rs2 = regIndex(parts[3]);
                const word = (OPCODES.ADD << 12) | (rd << 8) | (rs1 << 4) | rs2;
                out.push(word & 0xFFFF);
                break;
            }
            case "ADDI": {
                const rd = regIndex(parts[1]);
                const rs1 = regIndex(parts[2]);
                const imm = parseInt(parts[3], 0) & 0xFFF; // 12-bit immediate
                const word = (OPCODES.ADDI << 12) | (rd << 8) | (rs1 << 4) | (imm & 0xF);
                out.push(word & 0xFFFF);
                break;
            }
            case "LOAD": {
                const rd = regIndex(parts[1]);
                const rs1 = regIndex(parts[2]);
                const imm = parseInt(parts[3], 0) & 0xFFF;
                const word = (OPCODES.LOAD << 12) | (rd << 8) | (rs1 << 4) | (imm & 0xF);
                out.push(word & 0xFFFF);
                break;
            }
            case "STORE": {
                const rs2 = regIndex(parts[1]);
                const rs1 = regIndex(parts[2]);
                let imm = parseInt(parts[3], 0) & 0xFFF; // 12 bits
                const word = (OPCODES.STORE << 12) | (rs2 << 8) | (rs1 << 4) | (imm & 0xF);
                out.push(word & 0xFFFF);
                break;
            }
            case "JMP": {
                const addr = parseInt(parts[1], 0) & 0xFFF;
                const word = (OPCODES.JMP << 12) | addr;
                out.push(word & 0xFFFF);
                break;
            }
            case "BEQ": {
                const rs1 = regIndex(parts[1]);
                const rs2 = regIndex(parts[2]);
                const imm = parseInt(parts[3], 0) & 0xFFF;
                const word = (OPCODES.BEQ << 12) | (rs1 << 8) | (rs2 << 4) | (imm & 0xF);
                out.push(word & 0xFFFF);
                break;
            }
            case "HALT":
                out.push((OPCODES.HALT << 12) & 0xFFFF);
                break;

            default:
                throw new Error(`Assembler: unknown op ${op}`);
        }
    }
    return out;
}
