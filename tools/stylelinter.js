/*eslint no-console: 0 */
import stylelint from 'stylelint';
import log from './util/log';

export default async function stylelinter() {

    return new Promise((resolve, reject) => {

        const sourceFiles = './src/**/*.scss';
        const stylelintConfig = {
            files: sourceFiles,
            formatter: 'string',
            syntax: 'scss'
        };

        stylelint.lint(stylelintConfig)
            .then(function(data) {
                if ( data.output ) {
                    log.info(data.output);
                }
                resolve();
            })
            .catch(function(err) {
                log.error(err.stack);
                reject();
            });
    });
}
