import babel from 'rollup-plugin-babel';
import babili from 'rollup-plugin-babili';
import typescript from '@alexlur/rollup-plugin-typescript';

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
    ],
    "entry": 'src/index.js',
    "dest": "lib/bytearenaviz.min.js",
    "format": "iife",
    "moduleName": "bytearenaviz",
    "sourceMap": true,
    "external": ['babylonjs'],
    "globals": {
      "babylonjs": 'BABYLON',
    }
}