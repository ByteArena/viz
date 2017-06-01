import babel from 'rollup-plugin-babel';
import babili from 'rollup-plugin-babili';
import typescript from '@alexlur/rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

import fs from 'fs';
const pkge = JSON.parse(fs.readFileSync('package.json', 'utf8'));

export default {
    "plugins": [
        babel({
            "exclude": "node_modules/**",
            "include": "*.js",
            "presets": [
                ["es2015", { "modules": false }]
            ]
        }),
        babili({
            "comments": false,
            "banner": "/* ByteArena Viz v" + pkge.version + "; License " + pkge.license + "; " + pkge.homepage + " */",
            "sourcemap": false
        }),
        typescript(),

        nodeResolve({
            jsnext: true,
            main: true
        }),

        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: 'node_modules/**',  // Default: undefined
            //exclude: ['node_modules/foo/**', 'node_modules/bar/**'],  // Default: undefined

            // search for files other than .js files (must already
            // be transpiled by a previous plugin!)
            //extensions: ['.js', '.coffee'],  // Default: [ '.js' ]

            // if true then uses of `global` won't be dealt with by this plugin
            //ignoreGlobal: false,  // Default: false

            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: true,  // Default: true

            // explicitly specify unresolvable named exports
            // (see below for more details)
            //namedExports: { './module.js': ['foo', 'bar'] },  // Default: undefined

            // sometimes you have to leave require statements
            // unconverted. Pass an array containing the IDs
            // or a `id => boolean` function. Only use this
            // option if you know what you're doing!
            //ignore: ['conditional-runtime-dependency']
        })
    ],
    "entry": 'src/index.ts',
    "dest": "lib/bytearenaviz.min.js",
    "format": "iife",
    "moduleName": "bytearenaviz",
    "sourceMap": true,
    "external": ['babylonjs'],
    "globals": {
      "babylonjs": 'BABYLON',
    }
}