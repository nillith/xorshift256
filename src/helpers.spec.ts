import {seedToArray, toInt32, toUint32} from "./helpers";
import {assert} from 'chai';
import 'mocha';

const assertIsArrayOfNumbers = function(arr: any) {
  assert.isTrue(Array.isArray(arr));
  assert.isAbove(arr.length, 0);
  arr.forEach((e: any) => {
    assert.equal('number', typeof e);
  });
};

describe('Helpers Test', () => {
  it('should convert to uint32', () => {
    assert.equal(toUint32(1), 1);
    assert.equal(toUint32(1.1), 1);
    assert.equal(toUint32(-1), 4294967295);
    assert.equal(toUint32(-1.1), 4294967295);
    assert.equal(toUint32(4294967295), 4294967295);
    assert.equal(toUint32(Number.MAX_SAFE_INTEGER), 4294967295);
    assert.equal(toUint32(0), 0);
    assert.equal(toUint32(0.1), 0);
    assert.equal(toUint32(4294967296), 0);
  });

  it('should convert to int32', () => {
    assert.equal(toInt32(1), 1);
    assert.equal(toInt32(1.1), 1);
    assert.equal(toInt32(-1), -1);
    assert.equal(toInt32(-1.1), -1);
    assert.equal(toInt32(4294967295), -1);
    assert.equal(toInt32(Number.MAX_SAFE_INTEGER), -1);
    assert.equal(toInt32(0), 0);
    assert.equal(toInt32(0.1), 0);
    assert.equal(toInt32(4294967296), 0);
  });

  it('should convert to array of numbers', () => {
    assertIsArrayOfNumbers(seedToArray(0.1));
    assertIsArrayOfNumbers(seedToArray(''));
    assertIsArrayOfNumbers(seedToArray(100));
    assertIsArrayOfNumbers(seedToArray([1, 3, '4', 'blah']));
    assertIsArrayOfNumbers(seedToArray('hello'));
    assertIsArrayOfNumbers(seedToArray(['hello', 'world']));
    assertIsArrayOfNumbers(seedToArray([]));
    assertIsArrayOfNumbers(seedToArray({}));
    assertIsArrayOfNumbers(seedToArray(function() {
    }));
  });
});
