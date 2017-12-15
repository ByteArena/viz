module.exports = {
    parser: "babel-eslint",
    extends: [
        "eslint:recommended",
        "plugin:flowtype/recommended",
        "plugin:react/all",
    ],
    plugins: ["flowtype", "flowtype-errors", "react"],
    env: {
        browser: true,
        es6: true,
    },
    rules: {
        "flowtype-errors/show-errors": "error",
        "react/jsx-filename-extension": "off",
        "react/jsx-no-literals": "off",
        "react/require-optimization": "warn",
        "react/no-set-state": "off",
        "react/no-multi-comp": "off",
        "react/jsx-indent": ["error", 4],
        "react/no-string-refs": "warn",
        "react/forbid-component-props": "off",
        "react/jsx-one-expression-per-line": "off",
        "react/no-unused-prop-types": "off",
        "react/jsx-sort-props": "off",
        "react/jsx-no-bind": "off",
        "no-console": "off",
        "comma-dangle": [
            "error",
            {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "never",
                exports: "never",
                functions: "always-multiline",
            },
        ],
    },
    settings: {
        flowtype: {
            onlyFilesWithFlowAnnotation: true,
        },
    },
    globals: {
        dat: true,
        pc: true,
    },
};
