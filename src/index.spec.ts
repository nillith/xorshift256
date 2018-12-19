import XorShift256 from "./index";
import {assert} from 'chai';
import 'mocha';

const seedStates = [
  {
    seed: null,
    states: ['0,255701163,3571084029,104066848,1029223152,1842647737,3399066399,1185396769,4037164492', '0,1508365252,3770651112,3698912074,752468517,667248175,3768198832,2635333685,2866521367', '0,2042094728,3825540051,4005215607,2319179457,1811613994,1522539607,759647161,3964572036'],
    steps: 10000,
  },
  {
    states: ['0,255701163,3571084029,104066848,1029223152,1842647737,3399066399,1185396769,4037164492', '0,1508365252,3770651112,3698912074,752468517,667248175,3768198832,2635333685,2866521367', '0,2042094728,3825540051,4005215607,2319179457,1811613994,1522539607,759647161,3964572036'],
    steps: 10000,
  },
  {
    seed: 0,
    states: ['0,1682012331,4161242672,1305247764,1029764875,1348547740,1929173152,2937505031,163475810', '0,784796285,2100149430,2583688151,2829148803,506690484,2136046348,952993336,4264848468', '0,4283419918,948262652,832860987,1439803888,3664399359,488628283,2561224469,1053052953'],
    steps: 10000,
  },
  {
    seed: [0],
    states: ['0,1682012331,4161242672,1305247764,1029764875,1348547740,1929173152,2937505031,163475810', '0,784796285,2100149430,2583688151,2829148803,506690484,2136046348,952993336,4264848468', '0,4283419918,948262652,832860987,1439803888,3664399359,488628283,2561224469,1053052953'],
    steps: 10000,
  },
  {
    seed: [0, 0],
    states: ['0,65321815,62443966,684552126,570787679,1740193695,2357354846,2399267525,395053789', '0,4068608671,3148574010,2256825177,3986488495,1395502879,2797787784,3746834330,834025214', '0,1888368381,536177172,355720268,931850805,1183557931,1104895862,2986691107,1960386237'],
    steps: 10000,
  },
  {
    seed: 1,
    states: ['0,1424052999,2679704061,194833266,2743912293,3981793006,1733484611,664688421,1735066309', '0,500356149,1648193922,1685353949,1008471604,2175128411,2247613040,175446404,1628067741', '0,2139517801,1198251393,2659338213,1849074431,1269255041,888866090,3655321315,648098135'],
    steps: 10000,
  },
  {
    seed: [1],
    states: ['0,1424052999,2679704061,194833266,2743912293,3981793006,1733484611,664688421,1735066309', '0,500356149,1648193922,1685353949,1008471604,2175128411,2247613040,175446404,1628067741', '0,2139517801,1198251393,2659338213,1849074431,1269255041,888866090,3655321315,648098135'],
    steps: 10000,
  },
  {
    seed: [1, 1],
    states: ['0,1802552259,2599084271,1415715144,1931102075,2787221278,3947567131,2374226641,221214910', '0,2141493300,2649992867,3355393526,2878355453,737454973,516208636,1052068215,506636775', '0,638795700,3223662503,4083304620,481048832,2421114350,3397213489,2900234659,926966927'],
    steps: 10000,
  },
  {
    seed: 'a',
    states: ['0,1909413874,4051258789,1490895984,2420725785,3400714504,3941561633,1967955230,3243927141', '0,1033576902,418105671,2733220307,3968665984,2639801286,685939765,3957600333,426999720', '0,1089415115,3436547224,3078247131,50242950,1345233017,1235237689,1179483432,815147921'],
    steps: 10000,
  },
  {
    seed: ['a'],
    states: ['0,1909413874,4051258789,1490895984,2420725785,3400714504,3941561633,1967955230,3243927141', '0,1033576902,418105671,2733220307,3968665984,2639801286,685939765,3957600333,426999720', '0,1089415115,3436547224,3078247131,50242950,1345233017,1235237689,1179483432,815147921'],
    steps: 10000,
  },
  {
    seed: ['a', 'a'],
    states: ['0,1662798767,1564768229,471916962,2366017289,1424895287,2694860141,270073290,1033858457', '0,2795904416,3733631952,1315046325,4086289403,4067551451,2851729585,3580241784,4175388319', '0,1751000254,1542356613,576406574,3973386775,113677572,1854057694,1325348284,155772946'],
    steps: 10000,
  },
  {
    seed: 'blah',
    states: ['0,1160141156,313741678,1785165351,2980243740,4001206203,212660152,88244170,996676845', '0,972051762,4136476730,3823862048,4133958274,4212912523,899932357,722061818,2493632210', '0,1850473160,3703011861,2517058069,2374111518,730008120,1851294677,2608078004,681592810'],
    steps: 10000,
  },
  {
    seed: {},
    states: ['0,168239860,1692420360,1070178739,2035683424,4143876324,2223131668,1030042231,2784146156', '0,3476546903,3435105358,368387221,1351229350,4004266017,836124651,195671650,3988647365', '0,124933536,265089794,765836585,2475973098,15010274,1779032019,1051591229,4087635394'],
    steps: 10000,
  },
  {
    seed: [],
    states: ['0,255701163,3571084029,104066848,1029223152,1842647737,3399066399,1185396769,4037164492', '0,1508365252,3770651112,3698912074,752468517,667248175,3768198832,2635333685,2866521367', '0,2042094728,3825540051,4005215607,2319179457,1811613994,1522539607,759647161,3964572036'],
    steps: 10000,
  },
  {
    seed: [1, 2, 'blah'],
    states: ['0,3236532887,3186831801,1214235838,628585314,1132622739,4029102710,3653436372,2950501676', '0,1522377418,1849501212,1873583000,1055100906,2164247407,4059970747,2195306486,2655639147', '0,628127429,2613638232,2310089689,332949638,4151096701,4175822806,3632419914,1640181756'],
    steps: 10000,
  },
  {
    seed: 1.0203806325366014,
    states: ['0,1861718610,3606604809,1282971220,2146033413,1924123616,70814289,685179227,3102567481', '0,2406191278,999449765,989292394,558432427,937723034,2016540205,151827506,3212521598', '0,3498966346,4092683129,965030558,4099972489,1591575292,1721096523,3254105930,487875145'],
    steps: 10000,
  },
];

const rangeTest = function(fun: () => number, low: number, high: number, {includeLowerBound, assertInteger}: { includeLowerBound?: boolean, assertInteger?: boolean } = {}) {
  const mid = (low + high) / 2;
  let hasLowPart = false;
  let hasHighPart = false;
  let i = 2000;
  let r;
  let hasFloatingPointValue = false;
  while (i--) {
    r = fun();
    if (includeLowerBound) {
      assert.isAtLeast(r, low);
    } else {
      assert.isAbove(r, low);
    }
    if (!Number.isInteger(r)) {
      hasFloatingPointValue = true;
    }
    assert.isBelow(r, high);
    if (r > mid) {
      hasHighPart = true;
    } else if (r < mid) {
      hasLowPart = true;
    }
  }
  assert.isTrue(hasHighPart);
  assert.isTrue(hasLowPart);
  if (assertInteger) {
    assert.isNotTrue(hasFloatingPointValue);
  } else {
    assert.isTrue(hasFloatingPointValue);
  }
};

const assertState = function(rng: XorShift256, step: number, states: string[]) {
  const clone = rng.clone();
  states.forEach((state) => {
    state = state.replace(/\s*/g, '');
    clone.discard(step);
    assert.equal(state, clone.serialize());
  });
};

const assertDefaultState = function(rng: XorShift256) {
  assert.equal(rng.serialize(), '0,1129268363,4140876947,3363596325,698685332,654644737,3401316327,3243233427,4095296453');
  assertState(rng, 20000, [
    '0,1508365252,3770651112,3698912074,752468517,667248175,3768198832,2635333685,2866521367',
    '0,429287466,602706917,712727924,1812876286,1748596862,4088620402,3665515820,3223732497',
    '0,2260646867,4270434347,2164675462,2836018898,3974406656,3410816920,3327317506,1956238447',
  ]);
};

describe('XorShift256', () => {
  it('should work with or without new', () => {
    const rng1 = XorShift256();
    const rng2 = new XorShift256();
    assert.isTrue(rng1.equals(rng2));
    assert.isTrue(rng2.equals(rng1));
  });

  it('should work without Uint32Array', () => {
    const global: any = Function('return this')();
    const store = global.Uint32Array;
    global.Uint32Array = undefined;
    const rng = XorShift256();
    assertDefaultState(rng);
    global.Uint32Array = store;
  });

  it('should restore internal state after deserialization', () => {
    const rng = XorShift256();
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

  const invalidDeserializationDatas = ['', null, undefined, {}, [], 'blah', '0,0,0', '0,0,0,0,0,0,0,0,0'];
  it('should keep internal state valid if the data for deserialization is not valid', () => {
    const rng = XorShift256();
    const snapshot = rng.serialize();
    invalidDeserializationDatas.forEach((data) => {
      assert.isFalse(rng.deserialize(data as string));
      assert.equal(snapshot, rng.serialize());
    });
  });

  it('should return null if deserialization data is not valid', () => {
    invalidDeserializationDatas.forEach((data) => {
      assert.isNull(XorShift256.deserialize(data as string));
    });
  });

  it('should match reference implementation', () => {
    const startState = '0,2546633415,3511312576,3586500196,3793440089,3170758769,4262323354,1048902160,1672181354';
    const rng = XorShift256.deserialize(startState);
    assert.isFunction(rng);
    assert.equal(startState, rng!.serialize());
    assertState(rng!, 100000, [
      '0,3709193534, 824707297, 906382395, 3098589198, 3010552459, 3467607173, 4188158610, 2494713083',
      '0,2750464480,3592632872,3268602052,3709354238,1093503916,1279914053,1003300474,824852682',
    ]);
  });

  it('should produce same result for same seed', () => {
    const rng1 = XorShift256();
    const rng2 = XorShift256();
    let i = 10;
    while (i--) {
      const seed = Math.random();
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
    const rng = XorShift256();
    const rng2 = XorShift256();
    assert.isTrue(rng.equals(rng2));

    rng2.discard(100);
    assert.isNotTrue(rng.equals(rng2));
    rng2.seed();
    assert.isTrue(rng.equals(rng2));

    rng2.discard(100);
    assert.isNotTrue(rng.equals(rng2));
    rng2.seed(XorShift256.defaultSeed);
    assert.isTrue(rng.equals(rng2));
  });

  it('should give the same result for cloned rng', () => {
    const rng = XorShift256();
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
    const rng = XorShift256();
    const clone = rng.clone();
    assert.isTrue(rng.equals(clone));
    const rngState = rng.serialize();
    rng.discard(100);
    assert.notEqual(rngState, rng.serialize());
    assert.equal(rngState, clone.serialize());
  });

  it('should discard the specified number of result', () => {
    const discardCount = 100;
    const rng = XorShift256();
    const clone = rng.clone();
    assert.isTrue(rng.equals(clone));
    rng.discard(discardCount);
    assert.isNotTrue(rng.equals(clone));
    for (let i = 0; i < discardCount; ++i) {
      clone();
    }
    assert.isTrue(rng.equals(clone));
  });

  it('should return floating point value in range [0, 1)', function() {
    const rng = XorShift256();
    rangeTest(rng, 0, 1, {includeLowerBound: true});
  });

  it('should return floating point value in range [0, 1) for method uniform01', () => {
    const rng = XorShift256();
    rangeTest(function() {
      return rng.uniform01();
    }, 0, 1, {includeLowerBound: true});
  });

  it('should return floating point value in range (-1, 1)', () => {
    const rng = XorShift256();
    rangeTest(function() {
      return rng.uniform11();
    }, -1, 1);
  });

  it('should return integer value in range (-2147483649, 2147483648)', () => {
    const rng = XorShift256();
    rangeTest(function() {
      return rng.int32();
    }, -2147483649, 2147483648, {assertInteger: true});
  });

  it('should return integer value in range (0, 4294967296)', () => {
    const rng = XorShift256();
    rangeTest(function() {
      return rng.uint32();
    }, 0, 4294967296, {assertInteger: true});
  });

  const intRangeSamples = [
    {
      min: 1,
      max: 10,
    },
    {
      min: -20,
      max: 10,
    },
    {
      min: 100,
      max: 200,
    },
    {
      min: -21,
      max: -5,
    },
  ];

  it('should return integer value in range [min, max)', () => {
    const rng = XorShift256();
    for (const {min, max} of intRangeSamples) {
      rangeTest(function() {
        return rng.uniformInt(min, max);
      }, min, max, {includeLowerBound: true, assertInteger: true});

      rangeTest(function() {
        return rng.uniformInt(max);
      }, max > 0 ? 0 : max, max > 0 ? max : 0, {includeLowerBound: true, assertInteger: true});
    }
  });

  it('should return integer value in range [min, max)', () => {
    const rng = XorShift256();
    for (const {min, max} of intRangeSamples) {
      let generator = rng.uniformIntGenerator(min, max);
      rangeTest(function() {
        return generator();
      }, min, max, {includeLowerBound: true, assertInteger: true});

      generator = rng.uniformIntGenerator(max);
      rangeTest(function() {
        return generator();
      }, max > 0 ? 0 : max, max > 0 ? max : 0, {includeLowerBound: true, assertInteger: true});
    }
  });

  it('should generate lower bound', () => {
    const rng = XorShift256();
    let minGenerated = false;
    let maxGenerated = false;
    for (const {min, max} of intRangeSamples) {
      let c = 10000;
      let r;
      while (c--) {
        r = rng.uniformInt(min, max);
        if (r === min) {
          minGenerated = true;
        } else if (r === max) {
          maxGenerated = true;
        }
      }
      assert.isTrue(minGenerated);
      assert.isFalse(maxGenerated);
      minGenerated = false;

      const generator = rng.uniformIntGenerator(min, max);
      c = 10000;
      while (c--) {
        r = generator();
        if (r === min) {
          minGenerated = true;
        } else if (r === max) {
          maxGenerated = true;
        }
      }

      assert.isTrue(minGenerated);
      assert.isFalse(maxGenerated);
    }
  });

  const floatRangeSamples = [
    {
      min: 1.5,
      max: 10.2,
    },
    {
      min: -20.3,
      max: 10.2,
    },
    {
      min: 100.7,
      max: 200.8979,
    },
    {
      min: -21.2342,
      max: -5.256433,
    },
  ];

  it('should return floating point in range [min, max)', () => {
    const rng = XorShift256();
    for (const {min, max} of floatRangeSamples) {
      rangeTest(function() {
        return rng.uniform(min, max);
      }, min, max, {includeLowerBound: true});

      rangeTest(function() {
        return rng.uniform(max);
      }, max > 0 ? 0 : max, max > 0 ? max : 0, {includeLowerBound: true});
    }
  });

  it('should return floating point value in range [min, max)', () => {
    const rng = XorShift256();
    for (const {min, max} of floatRangeSamples) {
      let generator = rng.uniformGenerator(min, max);
      rangeTest(function() {
        return generator();
      }, min, max, {includeLowerBound: true});

      generator = rng.uniformGenerator(max);
      rangeTest(function() {
        return generator();
      }, max > 0 ? 0 : max, max > 0 ? max : 0, {includeLowerBound: true});
    }
  });

  it('should return integer in range [0, 255]', () => {
    const rng = XorShift256();
    rangeTest(function() {
      return rng.byte();
    }, 0, 256, {includeLowerBound: true, assertInteger: true});
  });

  const assertBytes = function(bytes: any, length?: number) {
    assert.isNotNull(bytes);
    if (typeof length === 'number') {
      assert.equal(bytes.length, length);
    }
    assert.isAbove(bytes.length, 0);
    for (const b of bytes!) {
      assert.isTrue(Number.isInteger(b));
      assert.isAtLeast(b, 0);
      assert.isAtMost(b, 255);
    }
  };

  it('should return an array of bytes', () => {
    const rng = XorShift256();
    for (let i = 1; i < 200; ++i) {
      assertBytes(rng.bytes(i), i);
    }
  });

  it('should return null', () => {
    const rng = XorShift256();
    const x: number | null = null;
    assert.isNull(rng.bytes(x!));
    assert.isNull(rng.bytes(0));
  });

  it('should accept an array', () => {
    const rng = XorShift256();
    for (let i = 1; i < 100; ++i) {
      assertBytes(rng.bytes(new Array(i)), i);
    }
    for (let i = 1; i < 100; ++i) {
      assertBytes(rng.bytes(new Uint8Array(i)), i);
    }
  });

  const magicConstant = 15;
  const isMagicSquare = function(arr: number[]): boolean {
    for (let i = 0; i < 3; ++i) {
      if (magicConstant !== arr[i * 3] + arr[i * 3 + 1] + arr[i * 3 + 2]) {
        return false;
      }
      if (magicConstant !== arr[i] + arr[3 + i] + arr[6 + i]) {
        return false;
      }
    }
    return (magicConstant === arr[0] + arr[4] + arr[8]) && (magicConstant === arr[2] + arr[4] + arr[6]);
  };

  it('should shuffle an arry', () => {
    const rng = XorShift256();
    rng.shuffle();
    rng.shuffle(null!);
    rng.shuffle([]);
    rng.shuffle([1]);
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let c = 0;
    while (true) {
      ++c;
      rng.shuffle(arr);
      if (isMagicSquare(arr)) {
        break;
      }
    }
    assert.isAtMost(c, 100000);
  });

  it('class tag test', () => {
    const rng = XorShift256();
    assert.equal('[object XorShift256]', rng.toString());
  });

  it('instanceof test', () => {
    const rng = XorShift256();
    assert.isTrue(rng instanceof XorShift256);
  });

  it('freeze seeding methods', () => {
    const rng = XorShift256();
    assertDefaultState(rng);
    for (const seedState of seedStates) {
      rng.seed(seedState.seed);
      assertState(rng, seedState.steps, seedState.states);
    }
  });
});
