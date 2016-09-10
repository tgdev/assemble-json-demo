/*eslint no-console: 0 */

/**
 * icons.js
 *
 * Build script for optimising SVG files and creating an SVG spritesheet
 *
 * SVGSpriter: https://github.com/jkphl/svg-sprite
 * SVGO: https://github.com/svg/svgo
 *
 */

import SVGSpriter from 'svg-sprite';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import glob from 'glob';
import clean from './clean';
import { iconsPathConfig as iconPath } from '../project.config.js';

export default async function icons() {

    // Clean up already existing optimised icons
    await clean([iconPath.min]);

    return new Promise((resolve, reject) => {

        const spriteName = 'icon-sprite.svg';
        const iconSrc = iconPath.src;
        const spriteConfig = {
            'dest': iconPath.dist,
            // 'log': 'debug',
            'shape': {
                'dimension': {
                    'maxWidth': 40,
                    'maxHeight': 20
                }
            },
            'svg': {
                'xmlDeclaration': false,
                'doctypeDeclaration': false,
                'rootAttributes': {
                    'xmlns': 'http://www.w3.org/2000/svg'
                }
            },
            'mode': {
                'symbol': {
                    'dest': '',
                    'sprite': spriteName,
                    'bust': false,
                    'inline': true
                }
            }
        };
        const spriter = new SVGSpriter(spriteConfig);

        // Find SVG files recursively via `glob`
        const files = glob.sync('**/*.svg', { cwd: iconSrc });

        files.forEach(file => {

            spriter.add(
                path.resolve(path.join(iconSrc, file)),
                file,
                fs.readFileSync(path.join(iconSrc, file), { encoding: 'utf-8' })
            );

        });

        // Output optimised SVGs
        spriter.getShapes(iconPath.min, (error, result) => {

            if (error) reject(error);

            result.forEach(file => {
                mkdirp.sync(path.dirname(file.path));
                fs.writeFileSync(file.path, file.contents);
            });

        });

        // Create svg sprite based on result mode.
        spriter.compile( (error, result) => {

            if(error) reject(error);

            const sprite = result.symbol.sprite;

            mkdirp.sync(path.dirname(sprite.path));
            fs.writeFileSync(sprite.path, sprite.contents);

            return resolve();

        });

    });

}
