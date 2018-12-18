[![Build Status](https://travis-ci.org/nillith/xorshift256.svg?branch=master)](https://travis-ci.org/nillith/xorshift256)
[![Coverage Status](https://coveralls.io/repos/github/nillith/xorshift256/badge.svg?branch=master)](https://coveralls.io/github/nillith/xorshift256?branch=master)
[![npm version](https://badge.fury.io/js/xorshift256.svg)](https://badge.fury.io/js/xorshift256)

# XorShift256
A tiny standalone library that provide a seedable random number generator with a period of 2^256 in JavaScript.

*Read this in other languages: [English](README.md), [简体中文](README.zh-cn.md).*

### Usage

    npm install xorshift256

If used in browsers that don't support es6, transpilation is not needed but polyfill is required.

Node.js

    const XorShift256 = require('xorshift256');

    const rng = XorShift256(Math.random());

The parameter of the constructor will be used to seed the generator. It's optional. If you don't provide one. It will seed with a fixed default seed:  `XorShift256.defaultSeed`. You can pass anything as seed. It's recommended to pass an array of numbers.

You can also reseed the generator anytime after creation:

    rng.seed(some-seed);

To generate a floating point value in [0, 1):

    rng();
    // or:
    rng.next01();

To generate a floating point value in (-1, 1):

    rng.next11();

To generate a floating point value in [min, max):

    rng.nextRealRange(min, max);
    // or:
    const generate = rng.createRealRangeGenerator(min, max);
    generate();

To generate a 32bit unsigned integer:

    rng.nextUint32();

To generate a 32bit integer:

    rng.nextInt32();

To generate a integer value in [min, max):

    rng.nextIntRange(min, max);
    // or:
    const generate = rng.createRealRangeGenerator(min, max);
    generate();

To discard certain number of results:

    rng.discard(100);

To make a deep copy of the generator:

    const clone = rng.clone();

To check if two generators are equal (that is they will generate identical sequence):

    clone.equals(rng)

To save the internal state of the generator:

    const data = rng.serialize(); // data is a string

To restore the internal state of the generator:

    rng.deserialize(data); // return true if succeeded. return false and keep internal state intact if data is not valid.
    // or:
    const rng2 = XorShift256.deserialize(data);


## License

Nillith, 2018. Licensed under an [MIT](LICENSE.txt) license.
