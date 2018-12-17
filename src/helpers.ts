export const toUint32 = function (n: number): number {
    return n >>> 0;
};

export const toInt32 = function (n: number): number {
    return n << 0;
};

export const Phi32 = 2654435769;

export const ReciprocalUint32 = 1 / (toUint32(-1) + 1);
export const ReciprocalInt32 = ReciprocalUint32 * 2;
export type SeedType = any;

const defaultDefaultSeed: number[] = [99991];

const toNumberArray = function (seed: string): number[] {
    const result: number[] = [];

    for (let i = 0; i < seed.length; ++i) {
        result.push(seed.charCodeAt(i));
    }
    return result;
};

const toNumber = function (v: any) {
    if (typeof v === 'number') {
        return v;
    }
    v = v.toString();
    let number = parseFloat(v);
    if (isNaN(number)) {
        number = 0;
        for (let i = 0; i < v.length; ++i) {
            number += v.charCodeAt(i);
        }
        return number;
    } else {
        return number;
    }
};

export const seedToArray = function (seed: SeedType, defaultSeed?: number[]): number[] {
    if (seed === undefined || seed === null) {
        seed = defaultSeed;
    }

    if (seed === undefined || seed === null) {
        return defaultDefaultSeed;
    }

    if (!seed) {
        return [0];
    }

    switch (typeof seed) {
        case 'number':
            return [seed as number];
        case 'string':
            return toNumberArray(seed as string);
        default:
            if (Array.isArray(seed)) {
                if (seed.length) {
                    return seed.map(toNumber);
                } else {
                    return defaultSeed || defaultDefaultSeed;
                }

            } else {
                return toNumberArray(seed.toString());
            }
    }
};