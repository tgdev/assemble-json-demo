/**
 * project.config.js
 *
 * Project wide configuration
 *
 * HINT: Code fold this file at level 1 for easier reading!
 *
 */

import path from 'path';
import webpack from 'webpack';

// The name of the project!
export const projectName = 'Assemble Demo';

// Asset path variables
export const assetsPathConfig = {
    src: './src/assets/',
    dist: './dist/assets/'
};

// Font path variables
export const fontsPathConfig = {
    src: './src/assets/fonts/',
    dist: './dist/assets/fonts/'
};


// Icon path variables
export const iconsPathConfig = {
    src: './src/icons/raw',
    min: './src/icons/optimised',
    dist: './dist/assets/'
};

// Image path variables
export const imagesPathConfig = {
    src: './src/assets/images',
    dist: './dist/assets/images'
};

// CSS path variables
export const cssPathConfig = {
    src: './src/scss/styles.scss',
    dist: './dist/css'
    // NOTE: This is a directory because multiple files are created here
};

export const nodeModulePathConfig = {
    src: './node_modules/',
    dist: './node_modules.tar.gz'
};

export const templatesPathConfig = {
    layouts: './src/templates/layouts/*.hbs',
    partials: ['./src/components/**/*.hbs', './src/sections/**/*.hbs'],
    pages: './src/templates/pages/*.hbs',
    referencePages: './src/templates/reference-pages/*.hbs',
    index: './src/templates/*.hbs',
    helpers: './src/templates/helpers/**/*.js',
    data: './src/templates/data/**/*.json'
};

// Local development server config (BrowserSync)
const serverConfig = {
    host: 'localhost',
    bsPort: 3000
};

// A trimmed down version of webpack stats output, not exported as we want a
// more generic name for export
const webpackStatsConfig = {
    colors: true,
    version: false,
    hash: false,
    timings: false,
    children: false,
    chunks: false,
    modules: false
};

// Development webpack configuration, not exported as we want a more generic
// name for export
const webpackDevelopmentConfig = {
    devtool: 'source-map',

    entry: {
        'main': './src/js/scripts.js'
    },

    output: {
        filename: 'scripts.js',
        path: path.join(__dirname, './dist/js')
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ],

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};

// Production webpack configufation, not exported as we want a more generic
// name and this depends on the development config
const webpackProductionConfig = Object.assign({}, webpackDevelopmentConfig, {

    output: Object.assign({}, webpackDevelopmentConfig.output, {
        publicPath: '/assets/'
    }),

    // Add new plugins for production
    plugins: [
        ...webpackDevelopmentConfig.plugins,
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
});

// Finally we can export our 'webpackConfig' in a nice way!
export const webpackConfig = {
    development: webpackDevelopmentConfig,
    production: webpackProductionConfig,
    stats: webpackStatsConfig
};

// A large complete object for all jcvd configuration if you must import
// absolutely everything
export default {
    projectName: projectName,
    serverConfig: serverConfig,
    webpackConfig: webpackConfig
};
