import pkg from '../../package.json';

import { createRollupConfig } from './createRollupConfig';

const name = 'index';
const input = pkg.source;
const tsconfig = 'tsconfig.build.json';
const options = [
    {
        name,
        format: 'cjs',
        input,
        tsconfig
    },
    { name, format: 'esm', input, tsconfig },
    {
        name,
        format: 'umd',
        input,
        tsconfig
    }
];

export default options.map((o) => createRollupConfig(o));

// import typescript from 'rollup-plugin-typescript2';
// import commonjs from '@rollup/plugin-commonjs';
// import resolve from '@rollup/plugin-node-resolve';
// import external from 'rollup-plugin-peer-deps-external';
// import sourcemaps from 'rollup-plugin-sourcemaps';
// import { terser } from 'rollup-plugin-terser';
//
// export default {
//     input: 'src/index.ts',
//     output: {
//         file: 'dist/index.js',
//         format: 'umd',
//         name: 'useNextQueryParams',
//         globals: {
//             react: 'React',
//             'react-dom': 'ReactDOM',
//             crypto: 'crypto'
//         },
//         sourcemap: true,
//         exports: 'named'
//     },
//     plugins: [
//         external(),
//         typescript({
//             tsconfig: 'tsconfig.build.json'
//         }),
//         commonjs(),
//         resolve(),
//         sourcemaps(),
//         terser({
//             output: { comments: false },
//             compress: {
//                 drop_console: true
//             }
//         })
//     ],
//     external: ['react', 'react-dom', 'next']
// };
