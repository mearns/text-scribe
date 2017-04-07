const webpack = require('webpack');
const packageJson = require('./package.json');
const process = require('process');
const path = require('path');
const changeCase = require('change-case');

const APP_NAME = packageJson.name;
const APP_VERSION = packageJson.version;

const isProd = process.env['NODE_ENV'] === 'production';

const loaders = [
    {
        test: /\.js$/i,
        loader: 'babel-loader',
        query: {
            presets: [
                'es2015'
            ],
            plugins: [
                'transform-object-assign'
            ]
        }
    }
];

const plugins = [
    new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        append: '\n//# sourceMappingURL=[url]',
        moduleFilenameTemplate: `${APP_NAME}:///[resource-path]`
    })
];

if (isProd) {
    // Minify for prod
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        sourceMap: true
    }));
}

const camelCase = (i) => changeCase.camelCase(i);

const libraryTargets = [
    ['window', camelCase],
    ['global', camelCase],
    'commonjs',
    'amd',
    'umd',
    ['var', camelCase],
    ['this', camelCase]
];

module.exports = libraryTargets.map((target) => {
    var libraryTarget;
    var library = APP_NAME;
    if (target instanceof Array) {
        libraryTarget = target[0];
        library = target[1](library);
    }
    else {
        libraryTarget = target;
    }

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, `./dist/${libraryTarget}`),
            filename: `${APP_NAME}.js`,
            library,
            libraryTarget
        },
        module: {
            loaders
        },
        plugins
    };
});
