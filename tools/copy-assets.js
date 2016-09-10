/**
 * copy-assets.js
 *
 * Copy any assets with correct directory creation.
 *
 */
import ncp from 'ncp';
import mkdirp from 'mkdirp';
import clean from './clean';
import { assetsPathConfig as path } from '../project.config';

export default async function copyAssets() {

    // Clean up already existing assets
    await clean([path.dist]);

    // Ensure directory structure is available
    await mkdirp(path.dist);

    return new Promise( (resolve, reject) => {
        ncp(path.src, path.dist, err => {
            if (err) reject(err);
            return resolve();
        });
    });
}
