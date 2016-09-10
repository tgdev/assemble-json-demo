/*eslint no-console: 0 */

/**
* run.js
*
* Handle the colourful execution and output of build scripts.
*
*/

import chalk from 'chalk';

export default function run(fn, options) {

    const task = typeof fn.default === 'undefined' ? fn : fn.default;
    const start = new Date();

    console.info(`[${chalk.bgBlack('JCVD')}] ${chalk.yellow('Starting')} '${chalk.cyan(task.name)}${options ? `(${options})` : ''}'...`);

    // Each task needs to return a promise so we can say it's done
    return task(options).then(() => {
        const end = new Date();
        const time = end.getTime() - start.getTime();
        console.info(`[${chalk.bgBlack('JCVD')}] ${chalk.green('Finished')} '${chalk.cyan(task.name)}${options ? `(${options})` : ''}' after ${chalk.red(`${time} ms`)}`);
    });
}

if (process.mainModule.children.length === 0 && process.argv.length > 2) {
    delete require.cache[__filename];
    const module = require(`./${process.argv[2]}.js`).default;
    run(module).catch(err => console.error(err.stack));
}
