# XorShift256
A standalone lightweight library that provide a seedable random number generator with a period of 2^256 in JavaScript.

*Read this in other languages: [English](README.md), [简体中文](README.zh-cn.md).*

### Usage

    npm install xorshift256

If used in browsers that don't support es6, transpire is not needed but polyfill is required.

Node.js

    const XorShift256 = require('xorshift256');

    const rng = XorShift256(Math.random());

The constructor accept an optional seed parameter. You can pass anything as seed. It's recommended to pass an array of numbers. If you don't provide one. It will seed with a fixed default seed:  `XorShift256.defaultSeed`.

You can also reseed the generator anytime after creation:

    rng.seed(some-seed);

To generate a floating point value between (0, 1):

    rng();
    // or:
    rng.next01();

To generate a floating point value between (-1, 1):

    rng.next11();

To generate a 32bit unsigned integer:

    rng.nextUint32();

To generate a 32bit integer:

    rng.nextInt32();

To discard certain number of results:

    rng.discard(100);

To make a deep copy of the generator:

    const clone = rng.clone();

To check if two generator is equal (that is they will generate the identical sequence):

    clone.equals(rng)

To save the internal state of the generator:

    const data = rng.serialize(); // data is a string

To restore the internal state of the generator:

    rng.deserialize(data);
    // or:
    const rng2 = XorShift256.deserialize(data);


## License

Nillith, 2018. Licensed under an [MIT](LICENSE.txt) license.