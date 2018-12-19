import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'
import tslint from "rollup-plugin-tslint";
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
  'seed', 'uint32', 'discard', 'serialize', 'deserialize', 'clone',
  'uniformInt', 'uniform', 'uniformIntGenerator', 'uniformGenerator',
  'uniform01', 'int32', 'uniform11', 'equals', 'byte', 'bytes', 'shuffle']
const createConfig = function (output) {
  return {
    input: 'src/index.ts',
    external: ['ms'],
    plugins: [
      tslint({}),
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
