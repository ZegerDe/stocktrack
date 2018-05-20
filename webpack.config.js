/**
 * As our first step, we'll pull in the user's webpack.mix.js
 * file. Based on what the user requests in that file,
 * a generic config object will be constructed for us.
 */

let path = require('path');
let glob = require('glob');
let webpack = require('webpack');
let Mix = require('laravel-mix').config;
let webpackPlugins = require('laravel-mix').plugins;
let dotenv = require('dotenv');
let SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin'); //Our magic


//let Mix = require('../src/index');

let ComponentFactory = require('../src/components/ComponentFactory');

new ComponentFactory().installAll();

require(Mix.paths.mix());

/**
 * Just in case the user needs to hook into this point
 * in the build process, we'll make an announcement.
 */

Mix.dispatch('init', Mix);

/**
 * Now that we know which build tasks are required by the
 * user, we can dynamically create a configuration object
 * for Webpack. And that's all there is to it. Simple!
 */

let WebpackConfig = require('../src/builder/WebpackConfig');

plugins.push(
    new SWPrecacheWebpackPlugin({
        cacheId: 'pwa',
        filename: 'service-worker.js',
        staticFileGlobs: ['public/**/*.{css,eot,svg,ttf,woff,woff2,js,html}'],
        minify: true,
        stripPrefix: 'public/',
        handleFetch: true,
        dynamicUrlToDependencies: {
            '/': ['resources/views/index/index.blade.php'],
            '/indices': ['resources/views/indices/indicesoverview.blade.php'],
            '/stocks': ['resources/views/companies/companiesoverview.blade.php']

        },
        staticFileGlobsIgnorePatterns: [/\.map$/, /mix-manifest\.json$/, /manifest\.json$/, /service-worker\.js$/],
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/www.\.zegerdeketelaere\.be/,
                handler: 'cacheFirst'
            },
            {
                urlPattern: /^https:\/\/www.\.zegerdeketelaere\.be\/indices/,
                handler: 'cacheFirst'
            },
            {
                urlPattern: /^https:\/\/www.\.zegerdeketelaere\.be\/stocks/,
                handler: 'cacheFirst'
            }
        ],
        importScripts: ['./js/push_message.js'],

    })
);


module.exports = new WebpackConfig().build();

module.exports.plugins = plugins;