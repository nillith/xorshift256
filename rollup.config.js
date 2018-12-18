import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import {terser} from "rollup-plugin-terser";

const toFormat = function (fileName) {
    return fileName.match(/.*?(\w+)\.js$/)[1];
};

const createOutput = function (file, extra) {
    return Object.assign({
            file,
            format: toFormat(file),
            sourcemap: true
        }, extra
    );
};

// workaround for terser
const createConfig = function (output) {
    return {
        input: 'src/index.ts',
        external: ['ms'],
        plugins: [
            //resolve(),
            //commonjs(),
            typescript({
                tsconfig: "tsconfig.json"
            }),
            terser()
        ],
        output
    }
};

export default [
    createConfig(createOutput(pkg.main)),
    createConfig(createOutput(pkg.module)),
    createConfig(createOutput(pkg.browser, {name: 'XorShift256'})),
];
