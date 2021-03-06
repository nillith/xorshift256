import {$parseFloat, $discard, Phi32, seedToArray, SeedType, toUint32, $Array, $isFinite} from "./helpers";
import {RandomEngine} from "./random-number-generator";

const Mask = 0x7;
const R = Mask + 1;
const SeedingDiscardCount = 233;

// make sure SeedingMultiplier * (2^32 - 1) + SeedingIncrement is not greater than Number.MAX_SAFE_INTEGER
const SeedingIncrement = 2531011;
const SeedingMultiplier = 214013;

type StateType = Uint32Array | number[];

const xorShiftLeft = function(v: number, s: number) {
  return toUint32(v ^ (v << s));
};

const xorShiftRight = function(v: number, s: number) {
  return toUint32(v ^ (v >>> s));
};

const advanceIndex = function(idx: number, distance: number) {
  return toUint32(idx + distance) & Mask;
};

const createStates = function(): StateType {
  try {
    return new Uint32Array(R);
  } catch (e) {
    return new $Array(R);
  }
};
const isValidIndex = function(index: number): boolean {
  return index >= 0 && index < R;
};

const isValidRNGStates = function(currentIndex: number, states: StateType): boolean {
  if (!isValidIndex(currentIndex) || R > states.length) {
    return false;
  }

  let x;
  for (let i = 0; i < R; ++i) {
    x = states[i];
    if (x && $isFinite(x)) {
      return true;
    }
  }
  return false;
};

const SerializeDelimiter: string = ',';

export class XorShift256Engine implements RandomEngine {
  static readonly $defaultSeed: SeedType = [97777];
  private states = createStates();
  private currentIndex: number = 0;

  $step() {
    const self = this;
    const {currentIndex, states} = self;

    let t = xorShiftLeft(xorShiftLeft(states[advanceIndex(currentIndex, 7)], 13), 9);
    t ^= xorShiftLeft(states[advanceIndex(currentIndex, 4)], 7);
    t ^= xorShiftRight(states[advanceIndex(currentIndex, 3)], 3);
    t ^= xorShiftRight(states[advanceIndex(currentIndex, 1)], 10);
    t ^= xorShiftLeft(xorShiftRight(states[currentIndex], 7), 24);
    states[currentIndex] = toUint32(t);
    self.currentIndex = advanceIndex(currentIndex, 1);
  }

  $clone(): this {
    const self = this;
    const result = new XorShift256Engine();
    const resultStates = result.states;
    const thisStates = self.states;
    result.currentIndex = self.currentIndex;
    for (let i = 0; i < R; ++i) {
      resultStates[i] = thisStates[i];
    }
    return result as this;
  }

  $uint32(): number {
    const self = this;
    const {currentIndex} = self;
    self.$step();
    return toUint32(self.states[currentIndex]);
  }

  $seed($seed?: SeedType): void {
    const self = this;
    const seedArray = seedToArray($seed, (self.constructor as typeof XorShift256Engine).$defaultSeed);

    self.currentIndex = 0;
    const {states} = self;

    for (let i = 0; i < R; ++i) {
      states[i] = 0;
    }

    let s = 0;
    for (let i = 0; i < seedArray.length; ++i) {
      s ^= toUint32((seedArray[i] + i) * Phi32);
      for (let j = 0; j < R; ++j) {
        s = toUint32(s * SeedingMultiplier + SeedingIncrement);
        states[j] ^= s;
        if (0 === states[j]) {
          states[j] = toUint32((i * R + j + 1) * Phi32);
        }
      }
      $discard(self, SeedingDiscardCount + i);
    }
    self.currentIndex = 0;
  }

  $serialize(): string {
    const self = this;
    const result = [self.currentIndex];
    const {states} = self;
    for (let i = 0; i < R; ++i) {
      result.push(states[i]);
    }
    return result.join(SerializeDelimiter);
  }

  $deserialize(str: string): boolean {
    if (!str) {
      return false;
    }
    const self = this;
    const arr = str.toString().split(new RegExp(`\\s*${SerializeDelimiter}\\s*`)).map((e) => {
      return toUint32($parseFloat(e));
    });
    const [inputIndex, ...inputStates] = arr;
    if (isValidRNGStates(inputIndex, inputStates)) {
      self.currentIndex = inputIndex;
      const {states} = self;
      for (let i = 0; i < R; ++i) {
        states[i] = inputStates[i];
      }
      return true;
    }
    return false;
  }
}
