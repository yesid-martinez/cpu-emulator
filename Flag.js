// logic/Flags.js
export default class Flags {
    constructor() {
        this.zero = false;
        this.negative = false;
        this.carry = false;
        this.overflow = false;
    }

    setFlags({ zero, negative, carry, overflow }) {
        if (zero !== undefined) this.zero = !!zero;
        if (negative !== undefined) this.negative = !!negative;
        if (carry !== undefined) this.carry = !!carry;
        if (overflow !== undefined) this.overflow = !!overflow;
    }

    reset() {
        this.zero = this.negative = this.carry = this.overflow = false;
    }

    toObject() {
        return {
        zero: this.zero,
        negative: this.negative,
        carry: this.carry,
        overflow: this.overflow
        };
    }

    toString() {
        return `Z:${+this.zero} N:${+this.negative} C:${+this.carry} V:${+this.overflow}`;
    }
}
