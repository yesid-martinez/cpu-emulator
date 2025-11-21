export class ALU {
    static ADD = 0;
    static SUB = 1;
    static AND = 2;
    static OR  = 3;
    static XOR = 4;
    static SLT = 5; // Set Less Than

    constructor() {
        this.result = 0;
        this.zero = false;
    }

    static execute(op, operandA, operandB) {
        switch(op) {
            case ALU.ADD: this.result = operandA + operandB; break;
            case ALU.SUB: this.result = operandA - operandB; break;
            case ALU.AND: this.result = operandA & operandB; break;
            case ALU.OR:  this.result = operandA | operandB; break;
            case ALU.XOR: this.result = operandA ^ operandB; break;
            case ALU.SLT: this.result = operandA < operandB ? 1 : 0; break;
            default: throw new Error(`ALU: invalid operation ${op}`);
        }
        this.zero = (this.result === 0);
        return this.result;
    }
}