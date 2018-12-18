import XorShift256 from "./index";
import {assert} from 'chai';
import 'mocha';

const seedStates = [
  {
    seed: null,
    states: [
      '0,3770121851,3701793396,724651203,611450767,2352455582,2045659643,926656777,2657124737',
      '0,3032275452,1956955835,4227927834,4281028680,1951632732,665065466,419029386,3315150171',
      '0,48109448,2038479411,3894249077,1621497457,4022148740,2091238997,2916752043,125998421'
    ],
    steps: 10000
  },
  {
    states: [
      '0,3770121851,3701793396,724651203,611450767,2352455582,2045659643,926656777,2657124737',
      '0,3032275452,1956955835,4227927834,4281028680,1951632732,665065466,419029386,3315150171',
      '0,48109448,2038479411,3894249077,1621497457,4022148740,2091238997,2916752043,125998421'
    ],
    steps: 10000
  },
  {
    seed: 0,
    states: [
      '0,125404714,1633878970,1177038735,2636889392,1232369614,2842874605,3333707220,1664995909',
      '0,3962173665,1966528645,3273081806,593145235,2546981419,1281536016,2434438899,2132715341',
      '0,1512643301,546252076,3569691201,1772204917,2100082195,424550242,3264050935,3298096281'
    ],
    steps: 10000
  },
  {
    seed: [
      0
    ],
    states: [
      '0,125404714,1633878970,1177038735,2636889392,1232369614,2842874605,3333707220,1664995909',
      '0,3962173665,1966528645,3273081806,593145235,2546981419,1281536016,2434438899,2132715341',
      '0,1512643301,546252076,3569691201,1772204917,2100082195,424550242,3264050935,3298096281'
    ],
    steps: 10000
  },
  {
    seed: [
      0,
      0
    ],
    states: [
      '0,1053106061,1046869144,2432320356,1666798022,1188344617,1908836089,384018518,3810338323',
      '0,4196898769,817327246,3673848725,3998551780,3798059503,1681982359,2477745529,70168830',
      '0,2191093892,3696674396,2979636424,3661711788,4173032193,1283083066,1178839366,2768959006'
    ],
    steps: 10000
  },
  {
    seed: 1,
    states: [
      '0,578669405,3909161698,3183233816,2961966930,1707560520,4120844780,1887418723,1027671168',
      '0,3027516067,1734093043,3409220841,1718522428,345851490,3021641689,2596762476,3648906885',
      '0,3440695893,1286016887,2844818970,1306155565,2240645971,2419525830,499809732,4272665967'
    ],
    steps: 10000
  },
  {
    seed: [
      1
    ],
    states: [
      '0,578669405,3909161698,3183233816,2961966930,1707560520,4120844780,1887418723,1027671168',
      '0,3027516067,1734093043,3409220841,1718522428,345851490,3021641689,2596762476,3648906885',
      '0,3440695893,1286016887,2844818970,1306155565,2240645971,2419525830,499809732,4272665967'
    ],
    steps: 10000
  },
  {
    seed: [
      1,
      1
    ],
    states: [
      '0,211992447,1707865009,2596984360,3491078182,2516031950,3202316123,2161766744,4181783168',
      '0,488693919,4029563001,41235152,319805153,2681049659,1043642810,3784094983,2646973332',
      '0,1566991683,258361331,2825560059,2777580606,3122690528,3320384068,3208186644,2682849647'
    ],
    steps: 10000
  },
  {
    seed: 'a',
    states: [
      '0,1856843218,2715614971,28387743,2978170965,1053969893,934094402,858266216,2775225688',
      '0,2550202819,528488503,4207415559,3848881549,2791935938,4264390350,2320140937,1144449200',
      '0,2590523261,416114027,954550907,1917245640,2995494999,243288927,828913304,1486083084'
    ],
    steps: 10000
  },
  {
    seed: [
      'a'
    ],
    states: [
      '0,1856843218,2715614971,28387743,2978170965,1053969893,934094402,858266216,2775225688',
      '0,2550202819,528488503,4207415559,3848881549,2791935938,4264390350,2320140937,1144449200',
      '0,2590523261,416114027,954550907,1917245640,2995494999,243288927,828913304,1486083084'
    ],
    steps: 10000
  },
  {
    seed: [
      'a',
      'a'
    ],
    states: [
      '0,3984981591,3895576521,871826764,1229533824,4282256709,2078358853,2562764798,951487477',
      '0,2853359145,3838452897,322827336,815297490,4236967172,1242483403,2421462157,4072372623',
      '0,1248739507,495089544,1344077602,1923947051,2881411636,2831903727,1782792480,1820196980'
    ],
    steps: 10000
  },
  {
    seed: 'blah',
    states: [
      '0,1745053679,246715064,3919209554,2139830960,2425228700,2723683185,1996751354,3012624202',
      '0,4279724069,125938581,3096754040,3375099672,3006852661,2040371110,2385637865,2569981125',
      '0,3004752800,3637576046,1892641206,3131009704,3574276816,1392709490,3410741975,851460195'
    ],
    steps: 10000
  },
  {
    seed: {},
    states: [
      '0,2731393961,2256241737,3581122027,3765167793,4127738317,1409024429,1962819710,4169213895',
      '0,2176690492,2534905543,3724338589,1776969310,1509556212,2990622733,452801950,2163157831',
      '0,3693708255,2636767386,2485313678,1604520462,702292414,1554337487,4272736973,111885258'
    ],
    steps: 10000
  },
  {
    seed: [],
    states: [
      '0,3770121851,3701793396,724651203,611450767,2352455582,2045659643,926656777,2657124737',
      '0,3032275452,1956955835,4227927834,4281028680,1951632732,665065466,419029386,3315150171',
      '0,48109448,2038479411,3894249077,1621497457,4022148740,2091238997,2916752043,125998421'
    ],
    steps: 10000
  },
  {
    seed: [
      1,
      2,
      'blah'
    ],
    states: [
      '0,1929043135,3912681564,1632758157,445062501,3597743637,3602043941,4185659022,2908849777',
      '0,3262645855,418917517,4174098165,1766943565,1884027916,1394973263,1886460371,2901949392',
      '0,1176440578,3782303157,3635498968,2301617849,1206033125,632243191,3643156394,751288326'
    ],
    steps: 10000
  }
];

const rangeTest = function (fun: () => number, low: number, high: number, includeLowerBound: boolean = false) {
  const mid = (low + high) / 2;
  let hasLowPart = false;
  let hasHighPart = false;
  let i = 2000;
  let r;
  while (i--) {
    r = fun();
    if (includeLowerBound) {
      assert.isAtLeast(r, low);
    } else {
      assert.isAbove(r, low);
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
};

const assertState = function (rng: XorShift256, step: number, states: string[]) {
  const clone = rng.clone();
  states.forEach((state) => {
    state = state.replace(/\s*/g, '');
    clone.discard(step);
    assert.equal(state, clone.serialize());
  })
};


const assertDefaultState = function (rng: XorShift256) {
  assertState(rng, 5000, [
    '0,3481382831,3665686953,4192819310,3446215392,3547669729,1743833248,2028430215,2303081019',
    '0,3770121851,3701793396,724651203,611450767,2352455582,2045659643,926656777,2657124737',
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
    global.Uint32Array = store;
    assertDefaultState(rng);
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
    const rng = XorShift256();
    const rng2 = XorShift256();
    assert.isTrue(rng.equals(rng2));
    for (let i = 0; i < 100; ++i) {
      rng2();
    }

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

  it('should return floating point value in range [0, 1)', function () {
    const rng = XorShift256();
    rangeTest(rng, 0, 1, !!'includeLowerBound');
  });

  it('should return floating point value in range [0, 1) for method next01', () => {
    const rng = XorShift256();
    rangeTest(function () {
      return rng.next01();
    }, 0, 1, !!'includeLowerBound');
  });

  it('should return floating point value in range (-1, 1)', () => {
    const rng = XorShift256();
    rangeTest(function () {
      return rng.next11();
    }, -1, 1);
  });

  it('should return integer value in range (-2147483649, 2147483648)', () => {
    const rng = XorShift256();
    rangeTest(function () {
      return rng.nextInt32();
    }, -2147483649, 2147483648);
  });

  it('should return integer value in range (0, 4294967296)', () => {
    const rng = XorShift256();
    rangeTest(function () {
      return rng.nextUint32();
    }, 0, 4294967296);
  });

  it('should return integer value in range [min, max)', () => {
    const rng = XorShift256();
    const min = 1, max = 10;
    rangeTest(function () {
      return rng.nextIntRange(min, max);
    }, min, max, !!'includeLowerBound');

    rangeTest(function () {
      return rng.nextIntRange(max);
    }, 0, max, !!'includeLowerBound');
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
    for (let {min, max} of intRangeSamples) {
      let generator = rng.createIntRangeGenerator(min, max);
      rangeTest(function () {
        return generator();
      }, min, max, !!'includeLowerBound');

      generator = rng.createIntRangeGenerator(max);
      rangeTest(function () {
        return generator();
      }, max > 0 ? 0 : max, max > 0 ? max : 0, !!'includeLowerBound');
    }

  });

  it('should return floating point in range [min, max)', () => {
    const rng = XorShift256();
    const samples = [
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
    for (let {min, max} of samples) {
      rangeTest(function () {
        return rng.nextRealRange(min, max);
      }, min, max, !!'includeLowerBound');

      rangeTest(function () {
        return rng.nextRealRange(max);
      }, max > 0 ? 0 : max, max > 0 ? max : 0, !!'includeLowerBound');
    }
  });

  it('should generate lower bound', () => {
    const rng = XorShift256();
    let minGenerated = false;
    let maxGenerated = false;
    for (let {min, max} of intRangeSamples) {
      let c = 10000;
      let r;
      while (c--) {
        r = rng.nextIntRange(min, max);
        if (r === min) {
          minGenerated = true;
        } else if (r === max) {
          maxGenerated = true;
        }
      }
      assert.isTrue(minGenerated);
      assert.isFalse(maxGenerated);
      minGenerated = false;

      const generator = rng.createIntRangeGenerator(min, max);
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

  it('should return floating point value in range [min, max)', () => {
    const rng = XorShift256();
    let min = 1.1, max = 10.5;
    let generator = rng.createRealRangeGenerator(min, max);
    rangeTest(function () {
      return generator();
    }, min, max, !!'includeLowerBound');

    generator = rng.createRealRangeGenerator(max);
    rangeTest(function () {
      return generator();
    }, 0, max, !!'includeLowerBound');
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
    for (let seedState of seedStates) {
      rng.seed(seedState.seed);
      assertState(rng, seedState.steps, seedState.states);
    }
  });
});
