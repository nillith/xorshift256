import {$floor, $discard, ReciprocalInt32, ReciprocalUint32, SeedType, toInt32, $assign, $Array} from "./helpers";

export interface RandomEngine {
  seed(seed?: SeedType): void;

  uint32(): number;

  step(): void;

  serialize(): string;

  deserialize(str: string): boolean;

  clone(): this;
}

export type NumberGenerator = () => number;

export interface RandomNumberGenerator extends RandomEngine {
  (): number;

  uniform01(): number;

  int32(): number;

  uniform11(): number;

  equals(rhs: RandomNumberGenerator | null): boolean;

  discard(count: number): void;

  uniformInt(min: number, max?: number): number;

  uniform(min: number, max?: number): number;

  uniformIntGenerator(min: number, max?: number): NumberGenerator;

  uniformGenerator(min: number, max?: number): NumberGenerator;

  byte(): number;

  bytes(arg: number | number[] | Uint8Array): number[] | Uint8Array | null;

  shuffle(arr?: any[]): void;
}

const normalizeMinMax = function(min: number, max?: number): [number, number] {
  if (null == max) {
    max = min;
    min = 0;
  }
  return max > min ? [min, max] : [max, min];
};

const getIntSpanMin = function(min: number, max?: number): [number, number] {
  [min, max] = normalizeMinMax(min, max);
  min = $floor(min);
  const span = $floor(max - min);
  return [span, min];
};

const getRealSpanMin = function(min: number, max?: number): [number, number] {
  [min, max] = normalizeMinMax(min, max);
  return [max - min, min];
};

const RNGMixIn = {
  int32(this: RandomNumberGenerator): number {
    return toInt32(this.uint32());
  },
  uniform01(this: RandomNumberGenerator): number {
    return this.uint32() * ReciprocalUint32;
  },
  uniform11(this: RandomNumberGenerator): number {
    return this.int32() * ReciprocalInt32;
  },
  uniformInt(this: RandomNumberGenerator, min: number, max?: number): number {
    let span: number;
    [span, min] = getIntSpanMin(min, max);
    return $floor(this.uniform01() * span) + min;
  },

  uniform(this: RandomNumberGenerator, min: number, max?: number): number {
    let span: number;
    [span, min] = getRealSpanMin(min, max);
    return this.uniform01() * span + min;
  },

  uniformIntGenerator(this: RandomNumberGenerator, min: number, max?: number): NumberGenerator {
    const self = this;
    let span: number;
    [span, min] = getIntSpanMin(min, max);
    return function() {
      return $floor(self.uniform01() * span) + min;
    };
  },

  uniformGenerator(this: RandomNumberGenerator, min: number, max?: number): NumberGenerator {
    const self = this;
    let span: number;
    [span, min] = getRealSpanMin(min, max);
    return function() {
      return self.uniform01() * span + min;
    };
  },

  byte(this: RandomNumberGenerator): number {
    return $floor(this.uniform01() * 256);
  },

  bytes(this: RandomNumberGenerator, arg: number | number[] | Uint8Array): number[] | Uint8Array | null {
    if (typeof arg === 'number') {
      arg = $floor(arg);
      if (arg <= 0) {
        return null;
      }
      arg = new $Array(arg);
    }

    if (null == arg) {
      return null;
    }

    let n: number;
    for (let i = 0; i < arg.length;) {
      n = this.uint32();
      for (let j = 0; i < arg.length && j < 4; ++i, ++j) {
        arg[i] = (n >>> (j * 8)) & 0xff;
      }
    }
    return arg;
  },

  shuffle(this: RandomNumberGenerator, arr?: any[]): void {
    if (arr && arr.length > 1) {
      let tmp: any;
      let j: number;
      for (let i = arr.length - 1; i > 0; --i) {
        j = $floor(this.uniform01() * i);
        tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
    }
  },
};

const emptyName = function(anonymousFunction: Function): Function {
  return anonymousFunction;
};

export const engineToRNG = function(rngEngine: RandomEngine, Constructor: Function): RandomNumberGenerator {
  const result: RandomNumberGenerator = emptyName(function() {
    return result.uniform01();
  }) as RandomNumberGenerator;

  (result as any).__proto__ = Constructor.prototype;

  const namedMethods = {
    seed($seed?: SeedType) {
      rngEngine.seed($seed);
    },
    discard(count: number) {
      $discard(rngEngine, count);
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
    uint32() {
      return rngEngine.uint32();
    },
    equals(rhs: RandomNumberGenerator): boolean {
      return null !== rhs && this.serialize() === rhs.serialize();
    },
  };

  return $assign(result, namedMethods, RNGMixIn);
};

type EngineClass<T extends RandomEngine> = { new(): T; readonly defaultSeed: SeedType };

export type RandomNumberGeneratorClass<T extends RandomNumberGenerator> = {
  new(seed?: SeedType): T;
  deserialize(str: string): T | null;
  readonly defaultSeed: SeedType;
  (seed?: SeedType): T;
};

export const createRandomNumberGeneratorClass = function <T extends RandomEngine>(Engine: EngineClass<T>, toStringTag: string): RandomNumberGeneratorClass<RandomNumberGenerator> {
  const RNGClass: any = emptyName(function($seed: SeedType): RandomNumberGenerator {
    const engine = new Engine();
    engine.seed($seed);
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
    createRNGClass: createRandomNumberGeneratorClass,
  };

  return $assign(RNGClass, namedMethods) as RandomNumberGeneratorClass<RandomNumberGenerator>;
};
