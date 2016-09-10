/*eslint no-console: 0 */

/**
 * logger.js
 *
 * Some handy JCVD oriented logging options.
 *
 * Usage:
 *
 * import log from './util/log';
 *
 * // Default usage
 * log.file('File changed', 'file-name.ext');
 * log.error('Description of error');
 * log.info('General information');
 *
 * To use a custom handle, the last parameter is used
 * log.file('File changed', 'file-name.ext', 'My Handle');
 * Produces:
 *
 * [My Handle] File changed: file-name.ext
 *
 */

import chalk from 'chalk';

export default {
    file: (action, file, handle = 'JCVD') => {
        console.info(`[${chalk.bgBlack(handle)}] ${chalk.cyan(action)}: ${chalk.magenta(file)}`);
    },
    error: (error, handle = 'JCVD Error') => {
        console.error(`[${chalk.red.underline(handle)}] ${chalk.red(error)}`);
    },
    info: (info, handle = 'JCVD') => {
        console.info(`[${chalk.bgBlack(handle)}] ${info}`);
    }
};
