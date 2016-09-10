/*eslint no-console: 0 */

/**
 * css.js
 *
 * Compile SASS files, then autoprefix and minify the result and write to /dist.
 *
 */
import fs from 'fs';
import mkdirp from 'mkdirp';
import sass from 'node-sass';
import sassInlineImage from 'sass-inline-image';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import log from './util/log';
import { cssPathConfig as path } from '../project.config';

export default async function css() {

    await mkdirp(path.dist);

    return new Promise( (resolve, reject) => {

        const outFile = `${path.dist}/styles.css`;

        // If production build, don't use source maps
        const sourceMapEnabled = !process.argv.includes('--production');

        // node-sass config
        const sassConfig = {
            functions: sassInlineImage(),
            file: path.src,
            outFile: outFile,
            sourceMap: sourceMapEnabled,
            sourceMapEmbed: sourceMapEnabled,
            sourceMapContents: sourceMapEnabled,
            outputStyle: sourceMapEnabled ? 'expanded' : 'compressed'
        };

        // postcss config
        const postcssConfig = {
            from: outFile,
            to: outFile,
            map: { inline: false }
        };

        // postcss processors
        const processors = [
            autoprefixer
        ];

        // If sourcemaps are not enabled, remove it from the config
        if (!sourceMapEnabled) delete postcssConfig.map;

        sass.render(sassConfig, (error, result) => {
            if (error) {
                // Sass errors suck, locked in formatting.
                // Handle this one differently and reject with a new Error
                log.error(`Sass error: ${error.message}
             ${error.file}:${error.line}`);

                reject();
            } else {
                postcss(processors)
                    .process(result.css, postcssConfig)
                    .then(result => {
                        fs.writeFile(outFile, result.css, error => {
                            if (error) reject(error);
                        });

                        // Create the sourcemap if we're using them
                        if (sourceMapEnabled) {
                            fs.writeFile(`${outFile}.map`, result.map, error => {
                                if (error) reject(error);
                            });
                        }
                    })
                    .catch(err => {
                        log.error(err.stack);
                        return reject(err);
                    });

                return resolve();
            }

        });
    });
}
