/*eslint no-console: 0 */
/**
 * node-modules.js
 *
 * Zip up the node_modules directory for maintenance later.
 *
 *
 */
import targz from 'tar.gz';
import { nodeModulePathConfig as path } from '../project.config';

export default function nodeModules() {

    return new Promise( (resolve, reject) => {

        targz()
            .compress(path.src, path.dist)
            .then(() => {
                return resolve();
            })
            .catch(err => {
                if (err) return reject(err);
            });
    });
}
