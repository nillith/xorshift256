import {ReciprocalInt32, ReciprocalUint32, SeedType, toInt32} from "./helpers";


export interface RandomEngine {
    seed(seed?: SeedType): void;

    nextUint32(): number;

    discard(count: number): void;

    serialize(): string;

    deserialize(str: string): boolean;

    clone(): this;
}


export interface RandomNumberGenerator extends RandomEngine {
    (): number;

    next01(): number;

    nextInt32(): number;

    next11(): number;

    equals(rhs: RandomNumberGenerator | null): boolean;
}

const RNGMixIn = {
    nextInt32(this: RandomNumberGenerator): number {
        return toInt32(this.nextUint32());
    },
    next01(this: RandomNumberGenerator): number {
        return this.nextUint32() * ReciprocalUint32;
    },
    next11(this: RandomNumberGenerator): number {
        return this.nextInt32() * ReciprocalInt32;
    }
};

const emptyName = function (anonymousFunction: Function): Function {
    return anonymousFunction;
};

export const engineToRNG = function (rngEngine: RandomEngine, Constructor: Function): RandomNumberGenerator {
    const result: RandomNumberGenerator = emptyName(function () {
        return result.next01();
    }) as RandomNumberGenerator;

    (result as any).__proto__ = Constructor.prototype;

    const namedMethods = {
        seed(seed?: SeedType) {
            rngEngine.seed(seed);
        },
        discard(count: number) {
            rngEngine.discard(count);
        },
        clone() {
            return engineToRNG(rngEngine.clone(), Constructor);
        },
        serialize() {
            return rngEngine.serialize();
        },
        deserialize(str: string): boolean {
            return rngEngine.deserialize(str);
        },
        nextUint32() {
            return rngEngine.nextUint32();
        },
        equals(rhs: RandomNumberGenerator): boolean {
            return null !== rhs && this.serialize() === rhs.serialize();
        }
    };


    return Object.assign(result, namedMethods, RNGMixIn);
};

type EngineClass<T extends RandomEngine> = { new(): T; readonly defaultSeed: SeedType };

export type RandomNumberGeneratorClass<T extends RandomNumberGenerator> = {
    new(seed?: SeedType): T;
    deserialize(str: string): T | null;
    readonly defaultSeed: SeedType;
    (seed?: SeedType): T;
};

export const createRandomNumberGeneratorClass = function <T extends RandomEngine>(Engine: EngineClass<T>, toStringTag?: string): RandomNumberGeneratorClass<RandomNumberGenerator> {

    toStringTag = toStringTag || Engine.name.replace(/Engine$/, '') || 'RandomNumberGenerator';

    const RNGClass: any = emptyName(function (seed: SeedType): RandomNumberGenerator {
        const engine = new Engine();
        engine.seed(seed);
        return engineToRNG(engine, RNGClass);
    });

    const RNGPrototype = RNGClass.prototype;

    RNGPrototype[Symbol.toStringTag] = toStringTag;

    RNGClass.defaultSeed = Engine.defaultSeed;

    const namedMethods = {
        deserialize(str: string): RandomNumberGenerator | null {
            const engine = new Engine();
            if (engine.deserialize(str)) {
                return engineToRNG(engine, RNGClass);
            }
            return null;
        },
    };

    return Object.assign(RNGClass, namedMethods) as RandomNumberGeneratorClass<RandomNumberGenerator>;
};