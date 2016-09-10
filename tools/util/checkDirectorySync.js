/*eslint no-console: 0 */

/**
 * checkDirectorySync.js
 *
 * Nifty little helper to check if directory exists.
 *
 */

import fs from 'fs';
import log from './log';

export default function checkDirectorySync(dir, msg) {
    try {
        fs.statSync(dir);
    } catch(e) {
        log.info(msg);
    }
}