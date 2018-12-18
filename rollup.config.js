import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const toFormat = function (fileName) {
  return fileName.match(/.*?(\w+)\.js$/)[1]
}

const createOutput = function (file, extra) {
  return Object.assign({
      file,
      format: toFormat(file),
      sourcemap: true
    }, extra
  )
}

// workaround for terser

const terserReserved = ['XorShift256', 'createRNGClass', 'exports',
  'seed', 'nextUint32', 'discard', 'serialize', 'deserialize', 'clone',
  'nextIntRange', 'nextRealRange', 'createIntRangeGenerator', 'createRealRangeGenerator',
  'next01', 'nextInt32', 'next11', 'equals']
const createConfig = function (output) {
  return {
    input: 'src/index.ts',
    external: ['ms'],
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json'
      }),
      terser({
        mangle: {
          toplevel: true,
          reserved: terserReserved,
          properties: {
            reserved: terserReserved,
            debug: false,
          },
        },
      })
    ],
    output
  }
}

export default [
  createConfig(createOutput(pkg.main)),
  createConfig(createOutput(pkg.module)),
  createConfig(createOutput(pkg.browser, {name: 'XorShift256'}))
]
