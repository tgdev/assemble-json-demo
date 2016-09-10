/*eslint no-console: 0 */
/**
* javascript.js
*
* Bundle JS files.
*
*/
import webpack from 'webpack';
import { webpackConfig } from '../project.config';

export default async function javascript() {

    return new Promise((resolve, reject) => {

        // Check the arguments to run the correct config if we're doing a production build
        webpack(process.argv.includes('--production') ? webpackConfig.production : webpackConfig.development)
            .run((err, stats) => {
                if (err) return reject(err);

                // Log out stats with our trimmed down stats options
                console.info(stats.toString(webpackConfig.stats));

                return resolve();
            });
    });
}
