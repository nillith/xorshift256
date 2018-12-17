import XorShift256 from "./index";
import {assert} from 'chai';
import 'mocha';

const rangeTest = function (fun: () => number, low: number, high: number) {
    const mid = (low + high) / 2;
    let hasLowPart = false;
    let hasHighPart = false;
    let i = 2000;
    let r;
    while (i--) {
        r = fun();
        assert.isAbove(r, low);
        assert.isBelow(r, high);
        if (r > mid) {
            hasHighPart = true;
        } else if (r < mid) {
            hasLowPart = true;
        }
    }
    assert.isTrue(hasHighPart);
    assert.isTrue(hasLowPart);
};

describe('XorShift256', () => {
    it('should work without new', () => {
       const rng1 = new XorShift256();
       const rng2 = XorShift256();
       assert.isTrue(rng1.equals(rng2));
       assert.isTrue(rng2.equals(rng1));
    });

    it('should restore internal state after deserialization', () => {
        const rng = new XorShift256();
        rng.discard(100);
        const data = rng.serialize();
        const rng2 = XorShift256.deserialize(data);
        assert.isOk(rng2);
        assert.isTrue(rng.equals(rng2));
        rng.discard(100);
        assert.notEqual(data, rng.serialize());
        rng.deserialize(data);
        assert.equal(data, rng.serialize());

    });

    it('should match reference implementation', () => {
        const startState = '0,2546633415,3511312576,3586500196,3793440089,3170758769,4262323354,1048902160,1672181354';
        const endState = '0,2750464480,3592632872,3268602052,3709354238,1093503916,1279914053,1003300474,824852682';
        const rng = XorShift256.deserialize(startState);
        assert.isOk(rng);
        assert.equal(startState, rng!.serialize());
        rng!.discard(200000);
        assert.equal(endState, rng!.serialize());
    });

    it('should produce same result for same seed', () => {
        const rng1 = new XorShift256();
        const rng2 = new XorShift256();
        let i = 10;
        while (i--) {
            let seed = Math.random();
            rng1.seed(seed);
            rng2.seed(seed);
            assert.isTrue(rng1.equals(rng2));
            assert.isTrue(rng2.equals(rng1));
            let j = 100;
            while (j--) {
                assert.equal(rng1(), rng2());
            }
        }
    });

    it('should reset state after reseeding', () => {
        const rng = new XorShift256();
        const rng2 = new XorShift256();
        assert.isTrue(rng.equals(rng2));
        for (let i = 0; i < 100; ++i) {
            rng2();
        }

        assert.isNotTrue(rng.equals(rng2));
        rng2.seed(XorShift256.defaultSeed);
        assert.isTrue(rng.equals(rng2));
    });

    it('should give the same result for cloned rng', () => {
        const rng = new XorShift256();
        rng.discard(100);
        const clone = rng.clone();
        rng.discard(100);
        clone.discard(100);
        let i = 100;
        while (i--) {
            assert.equal(rng(), clone());
        }
    });

    it('should perform deep clone', () => {
        const rng = new XorShift256();
        const clone = rng.clone();
        assert.isTrue(rng.equals(clone));
        const rngState = rng.serialize();
        rng.discard(100);
        assert.notEqual(rngState, rng.serialize());
        assert.equal(rngState, clone.serialize());
    });

    it('should discard the specified number of result', () => {
        const discardCount = 100;
        const rng = new XorShift256();
        const clone = rng.clone();
        assert.isTrue(rng.equals(clone));
        rng.discard(discardCount);
        assert.isNotTrue(rng.equals(clone));
        for (let i = 0; i < discardCount; ++i) {
            clone();
        }
        assert.isTrue(rng.equals(clone));
    });

    it('should return floating point value in range (0, 1)', function () {
        const rng = new XorShift256();
        rangeTest(rng, 0, 1);
    });

    it('should return floating point value in range (0, 1) for method next01', () => {
        const rng = new XorShift256();
        rangeTest(function () {
            return rng.next01();
        }, 0, 1);
    });

    it('should return floating point  value in range (-1, 1)', () => {
        const rng = new XorShift256();
        rangeTest(function () {
            return rng.next11();
        }, -1, 1);
    });

    it('should return integer value in range (-2147483649, 2147483648)', () => {
        const rng = new XorShift256();
        rangeTest(function () {
            return rng.nextInt32();
        }, -2147483649, 2147483648);
    });

    it('should return integer value in range (0, 4294967296)', () => {
        const rng = new XorShift256();
        rangeTest(function () {
            return rng.nextUint32();
        }, 0, 4294967296);
    });

    it('class tag test', () => {
        const rng = new XorShift256();
        assert.equal('[object XorShift256]', rng.toString());
    })
});