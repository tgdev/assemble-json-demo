/**
 * images.js
 *
 * Optimise (compress) images into build location
 *
 * Imagemin: https://github.com/imagemin/imagemin
 *
 */

import fs from 'fs';
import mkdirp from 'mkdirp';
import ncp from 'ncp';
import path from 'path';
import imagemin from 'imagemin';
// import newer from 'imagemin-newer';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';
import imageminGifsicle from 'imagemin-gifsicle';

import clean from './clean';
import { imagesPathConfig as imgPath } from '../project.config';

export default async function images() {

    // clean the images dist directory before compressing images
    // only processes the files that need to be
    await clean([imgPath.dist]);

    return new Promise((resolve, reject) => {

        const sourceFiles = path.join(imgPath.src, '*.{jpg,png,gif}');

        // Compress images for prod
        if(process.argv.includes('--production')) {

            const pluginsConfig = [
                // newer(imgPath.dist),
                imageminJpegtran({
                    progressive: true
                }),
                imageminOptipng(),
                imageminGifsicle({
                    interlaced: true,
                    optimizationLevel: 2
                })
            ];

            imagemin([sourceFiles], imgPath.dist, {
                use: pluginsConfig
            }).then(files => {
                files.forEach(file => {
                    mkdirp.sync(path.dirname(file.path));
                    fs.writeFileSync(file.path, file.data);
                });
                return resolve();
            });

        } else {
            // Copy images for dev
            ncp(imgPath.src, imgPath.dist, err => {
                if (err) reject(err);
                return resolve();
            });

        }

    });

}
