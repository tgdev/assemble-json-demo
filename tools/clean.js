/**
 * clean.js
 *
 * Clean folders!
 *
 */

import del from 'del';

export default async function clean(glob = ['dist/*']) {
    return del(glob, {dot: true});
}
