/*eslint no-console: 0 */

/**
* serve.js
*
* Spin up browser sync to watch for changes and live reload.
*
*/
import serverConfig from '../project.config';

import log from './util/log';
import run from './run';

import build from './build';
import templates from './templates';
import icons from './icons';
import images from './images';
import fonts from './fonts';
import css from './css';
import javascript from './javascript';
// import copyAssets from './copy-assets';
import nodeModules from './node-modules';

import chokidar from 'chokidar';
import bs from 'browser-sync';

export default async function serve() {

    await run(build);

    return new Promise((resolve, reject) => {

        //watch TEMPLATES
        chokidar.watch('./src/**/*.hbs', {
            ignoreInitial: true
        })
        .on('error', error => log.error(error))
        .on('all', (event, path) => {
            log.file('File Changed', path);
            run(templates).then(() => {
                browserSync.reload('*.html');
            });
        });

        //watch SASS
        chokidar.watch('./src/**/*.scss', {
            ignoreInitial: true
        })
        .on('error', error => log.error(error))
        .on('all', (event, path) => {
            log.file('File Changed', path);
            run(css).then(() => {
                browserSync.reload('*.css');
            });
        });

        //watch JAVASCRIPT
        chokidar.watch('./src/**/*.js', {
            ignoreInitial: true
        })
        .on('error', error => log.error(error))
        .on('all', (event, path) => {
            log.file('File Changed', path);
            run(javascript).then(() => {
                browserSync.reload('*.js');
            });
        });

        /*
        * watch ASSETS
        * Interesting behaviour with this one, works perfectly if you're adding or removing files from /assets
        * Starts to double up when you move files around within /assets itself.
        * There will be one call for unlink and one for add as it changes it's position.
        * Not really sure how we can get around that but I would imagine MOST of the time we'd be adding or removing assets
        */
        // chokidar.watch('./src/assets/', {
        //     ignored: /[\/\\]\./,
        //     ignoreInitial: true,
        //     awaitWriteFinish: true
        // })
        // .on('error', error => console.info(`Watcher error: ${error}`))
        // .on('add', path => console.info(`[${chalk.yellow('JCVD')}] ${chalk.cyan('File added:')} ${chalk.magenta(path)}`))
        // .on('change', path => console.info(`[${chalk.yellow('JCVD')}] ${chalk.cyan('File changed:')} ${chalk.magenta(path)}`))
        // .on('unlink', path => console.info(`[${chalk.yellow('JCVD')}] ${chalk.cyan('File removed:')} ${chalk.magenta(path)}`))
        // .on('all', () => {
        //     run(copyAssets).then(() => {
        //         browserSync.reload('*.html');
        //     });
        // });

        // Watch Images
        chokidar.watch('./src/assets/images/**/*.{jpg,png,gif}', {
            ignoreInitial: true,
            awaitWriteFinish: true
        })
        .on('error', error => log.error(error))
        .on('all', (event, path) => {
            log.file('File Changed', path);
            run(images).then(() => {
                browserSync.reload('*.html');
            });
        });

        //watch Icons
        chokidar.watch('./src/icons/raw', {
            ignoreInitial: true
        })
        .on('error', error => log.error(error))
        .on('all', (event, path) => {
            log.file('File Changed', path);
            run(icons).then(() => {
                browserSync.reload('*.html');
            });
        });

        // Watch Fonts
        chokidar.watch('./src/assets/fonts', {
            awaitWriteFinish: true
        })
        .on('error', error => log.error(error))
        .on('all', (event, path) => {
            log.file('File Changed', path);
            run(fonts).then(() => {
                browserSync.reload('*.html');
            });
        });

        //watch NODE MODULES
        chokidar.watch('./package.json', {
            ignoreInitial: true,
            awaitWriteFinish: true
        })
        .on('error', error => log.error(error))
        .on('change', (path) => {
            log.file('File Changed', path);
            run(nodeModules);
        });

        //Now Serve!
        const browserSync = bs.create();
        const bsOpts = {
            server: './dist',
            host: serverConfig.host,
            open: false,
            logFileChanges: true
        };

        browserSync.init(bsOpts, err => {
            if (err) reject(err);
            return resolve();
        });
    });
}
