const mask = 0x7;
const r = mask + 1;
const phi32 = 2654435769;
const reciprocalUint32 = 1 / ((-1 >>> 0) + 1);
const reciprocalInt32 = reciprocalUint32 * 2;

const createStates = function () {
    try {
        return new Uint32Array(r);
    } catch (e) {
        return new Array(r);
    }
};

const toUint32 = function (v) {
    return v >>> 0;
};

const toInt32 = function (v) {
    return v ^ 0;
};

const xorShiftLeft = function (v, s) {
    return v ^ toUint32(v << s);
};

const xorShiftRight = function (v, s) {
    return v ^ (v >>> s);
};

const advanceIndex = function (idx, distance) {
    return toUint32(idx + distance) & mask;
};

class XorShift256Engine {
    constructor() {
        const self = this;
        self.currentIndex = 0;
        self.states = createStates();
    }

    step() {
        const self = this;
        const states = self.states;
        const currentIndex = self.currentIndex;
        const nextIndex = self.currentIndex = advanceIndex(currentIndex, 1);

        let t = xorShiftLeft(xorShiftLeft(states[advanceIndex(currentIndex, 7)], 13), 9);
        t ^= xorShiftLeft(states[advanceIndex(currentIndex, 4)], 7);
        t ^= xorShiftRight(states[advanceIndex(currentIndex, 3)], 3);
        t ^= xorShiftRight(states[advanceIndex(currentIndex, 1)], 10);
        t ^= xorShiftLeft(xorShiftRight(states[nextIndex]), 24);
        states[currentIndex] = t;
        self.currentIndex = advanceIndex(currentIndex, 1);
    }

    next() {
        const self = this;
        self.step();
        return toUint32(self.states[self.currentIndex]);
    }

    discard(count) {
        while (count-- > 0) {
            this.step();
        }
    }

    clone() {
        const self = this;
        const result = new XorShift256Engine();
        result.currentIndex = self.currentIndex;
        for (let i = 0; i < r; ++i) {
            result.states[i] = self.states[i];
        }
        return result;
    }

    serialize() {
        const self = this;
        return [self.currentIndex].concat(self.states).map(toUint32).join(', ');
    }

    deserialize(str) {
        const self = this;
        let arr = str.split(/\s*,\s*/);
        arr = arr.map(function (e) {
            return toUint32(parseInt(e));
        });
        self.currentIndex = arr[0];
        const states = self.states;
        for (let i = 0; i < r; ++i) {
            states[i] = arr[i + 1];
        }
    }
}

const enginePrototype = XorShift256Engine.prototype;

enginePrototype.seed = (function () {
    const toSeedArray = function (s) {
        if (!s) {
            return [phi32];
        }
        switch (typeof s) {
            case 'number':
                return [s];
            case 'string':
                const str = s;
                s = [];
                for (let i = 0; i < str.length; ++i) {
                    s.push(str.charCodeAt(i));
                }
                return s;
            default:
                return s;
        }
    };

    return function (seeds) {
        seeds = toSeedArray(seeds);
        seeds[0] = seeds[0] || phi32;
        const self = this;
        self.currentIndex = 0;
        const states = self.states;

        for (let i = 0; i < r; ++i) {
            states[i] = 0;
        }

        let s;
        for (let i = 0; i < seeds.length; ++i) {
            s = seeds[i];
            for (let j = 0; j < r; ++j) {
                s = toUint32((s + (i + 1) * (j + 1)) * phi32);
                states[j] ^= s;
            }
            self.discard(1023);
        }
        states[0] = states[0] || phi32;
        self.currentIndex = 0;
    }
})();


const RNGMixIn = {
    nextInt32() {
        return toInt32(this.nextUint32());
    },
    next01() {
        return this.nextUint32() * reciprocalUint32;
    },
    next11() {
        return this.nextInt32() * reciprocalInt32;
    }
};


const engineToRNG = function (rngEngine) {
    const result = function () {
        return result.next01();
    };

    result.nextUint32 = function () {
        return rngEngine.next();
    };

    result.seed = function () {
        rngEngine.seed();
    };

    result.discard = function (count) {
        rngEngine.discard(count);
    };

    result.clone = function () {
        return engineToRNG(rngEngine.clone());
    };

    result.serialize = function () {
        rngEngine.serialize();
    };

    result.deserialize = function (str) {
        rngEngine.deserialize(str);
        return result;
    };

    return Object.assign(result, RNGMixIn);
};

export const xorShift256 = {
    create (seed) {
        var engine = new XorShift256Engine();
        engine.seed(seed);
        return engineToRNG(engine);
    },
    deserialize (str) {
        var engine = new XorShift256Engine();
        var rng = engineToRNG(engine);
        rng.deserialize(str);
        return rng;
    }
};