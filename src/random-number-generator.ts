import {discard, ReciprocalInt32, ReciprocalUint32, SeedType, toInt32} from "./helpers";


export interface RandomEngine {
  seed(seed?: SeedType): void;

  nextUint32(): number;

  step(): void;

  serialize(): string;

  deserialize(str: string): boolean;

  clone(): this;
}

export type NumberGenerator = {
  (): number
};

export interface RandomNumberGenerator extends RandomEngine {
  (): number;

  next01(): number;

  nextInt32(): number;

  next11(): number;

  equals(rhs: RandomNumberGenerator | null): boolean;

  discard(count: number): void;

  nextIntRange(min: number, max?: number): number;

  nextRealRange(min: number, max?: number): number;

  createIntRangeGenerator(min: number, max?: number): NumberGenerator;

  createRealRangeGenerator(min: number, max?: number): NumberGenerator;
}

const normalizeMinMax = function (min: number, max?: number): [number, number] {
  if (null == max) {
    max = min;
    min = 0;
  }
  return max > min ? [min, max] : [max, min];
};

const getIntSpanMin = function (min: number, max?: number): [number, number] {
  [min, max] = normalizeMinMax(min, max);
  min = Math.floor(min);
  const span = Math.floor(max - min);
  return [span, min];
};

const getRealSpanMin = function (min: number, max?: number): [number, number] {
  [min, max] = normalizeMinMax(min, max);
  return [max - min, min];
};

const RNGMixIn = {
  nextInt32(this: RandomNumberGenerator): number {
    return toInt32(this.nextUint32());
  },
  next01(this: RandomNumberGenerator): number {
    return this.nextUint32() * ReciprocalUint32;
  },
  next11(this: RandomNumberGenerator): number {
    return this.nextInt32() * ReciprocalInt32;
  },
  nextIntRange(this: RandomNumberGenerator, min: number, max?: number): number {
    let span: number;
    [span, min] = getIntSpanMin(min, max);
    return Math.floor(this.next01() * span) + min;
  },

  nextRealRange(this: RandomNumberGenerator, min: number, max?: number): number {
    let span: number;
    [span, min] = getRealSpanMin(min, max);
    return this.next01() * span + min;
  },

  createIntRangeGenerator(this: RandomNumberGenerator, min: number, max?: number): NumberGenerator {
    const self = this;
    let span: number;
    [span, min] = getIntSpanMin(min, max);
    return function () {
      return Math.floor(self.next01() * span) + min;
    };
  },

  createRealRangeGenerator(this: RandomNumberGenerator, min: number, max?: number): NumberGenerator {
    const self = this;
    let span: number;
    [span, min] = getRealSpanMin(min, max);
    return function () {
      return self.next01() * span + min;
    };
  },
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
      discard(rngEngine, count);
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

export const createRandomNumberGeneratorClass = function <T extends RandomEngine>(Engine: EngineClass<T>, toStringTag: string): RandomNumberGeneratorClass<RandomNumberGenerator> {
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
    createRNGClass: createRandomNumberGeneratorClass
  };

  return Object.assign(RNGClass, namedMethods) as RandomNumberGeneratorClass<RandomNumberGenerator>;
};
