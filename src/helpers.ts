export const toUint32 = function(n: number): number {
  return n >>> 0;
};

export const toInt32 = function(n: number): number {
  return n << 0;
};

export const $discard = function(target: any, count: number) {
  count = toUint32(count);
  while (count-- > 0) {
    target.$step();
  }
};

export const $floor = Math.floor;
export const $parseFloat = parseFloat;
export const $assign = Object.assign;
export const $Array = Array;
export const $isFinite = isFinite;

export const Phi32 = 2654435769;

export const ReciprocalUint32 = 1 / (toUint32(-1) + 1);
export const ReciprocalInt32 = ReciprocalUint32 * 2;
export type SeedType = any;

const defaultDefaultSeed: number[] = [99991];

const toNumberArray = function($seed: string): number[] {
  const result: number[] = [];

  for (let i = 0; i < $seed.length; ++i) {
    result.push($seed.charCodeAt(i));
  }
  return result;
};

const toNumber = function(v: any) {
  if (typeof v === 'number') {
    return v;
  }
  v = v.toString();
  let n = $parseFloat(v);
  if (!$isFinite(n)) {
    n = 0;
    for (let i = 0; i < v.length; ++i) {
      n += v.charCodeAt(i);
    }
    return n;
  } else {
    return n;
  }
};

export const seedToArray = function($seed: SeedType, $defaultSeed?: number[]): number[] {
  if (undefined === $defaultSeed || null === $defaultSeed) {
    $defaultSeed = defaultDefaultSeed;
  }

  if (undefined === $seed || null === $seed) {
    $seed = $defaultSeed;
  }

  if (!$seed) {
    return [0];
  }

  switch (typeof $seed) {
    case 'number':
      return [$seed as number];
    case 'string':
      return toNumberArray($seed as string);
    default:
      if ($Array.isArray($seed)) {
        if ($seed.length) {
          return $seed.map(toNumber);
        } else {
          return $defaultSeed;
        }
      } else {
        return toNumberArray($seed.toString());
      }
  }
};
