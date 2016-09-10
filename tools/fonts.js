/**
 * fonts.js
 *
 * Copy fonts into build location.
 *
 */
import ncp from 'ncp';
import clean from './clean';
import checkDirectorySync from './util/checkDirectorySync';
import { fontsPathConfig as fontPath } from '../project.config';

export default async function fonts() {

    // only run if fonts directory exists
    const fontsExist = checkDirectorySync(fontPath.src, 'No fonts to copy!');

    if(fontsExist) {

        // clean the dist font directory before copying fonts
        // only copy the fonts that need to be
        await clean([fontPath.dist]);

        // Copy webfonts to dist
        return new Promise((resolve, reject) => {

            ncp(fontPath.src, fontPath.dist, function (err) {
                if (err) reject(err);
                return resolve();
            });

        });

    }

}
