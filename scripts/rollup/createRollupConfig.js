import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export function createRollupConfig(options, callback) {
    const name = options.name;
    const extName = options.format === 'esm' ? 'mjs' : 'js';
    const outputName = 'dist/' + [name, options.format, extName].join('.');

    const config = {
        input: options.input,
        output: {
            file: outputName,
            format: options.format,
            name: 'UseNextQueryParams',
            sourcemap: true,
            globals: { react: 'React' },
            exports: 'named'
        },
        plugins: [
            external(),
            typescript({
                tsconfig: options.tsconfig,
                clean: true,
                exclude: ['**/*.spec.ts', '**/*.spec.tsx']
            }),
            options.format === 'umd' &&
                commonjs({
                    include: /\/node_modules\//
                }),
            sourcemaps(),
            options.format !== 'esm' &&
                terser({
                    output: { comments: false },
                    compress: {
                        drop_console: true
                    }
                })
        ].filter(Boolean)
    };

    return callback ? callback(config) : config;
}
