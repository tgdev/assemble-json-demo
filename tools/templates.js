/*eslint no-console: 0 */

/**
 * templates.js
 *
 * Build script for handling htm templates with Assemble and Handlebars.
 *
 * Handlebars: http://handlebarsjs.com/
 * Assemble:   https://github.com/assemble/assemble
 *
 */

import log from './util/log';
import assemble from 'assemble';
import expander from 'expander';
import merge from 'lodash.merge';
import through from 'through2';
import plumber from 'gulp-plumber';
import matter from 'parser-front-matter';
import fs from 'fs';
import { projectName, templatesPathConfig as path } from '../project.config';

export default async function templates() {

    return new Promise( (resolve, reject) => {
        // Create assemble instance
        let templates = assemble();

        function expand(data) {
            // `data` is front-matter
            // console.log('front-matter data: ', data);
            const ctx = merge({}, templates.cache.data, data);
            // console.log('expand ctx: ', ctx);
            return expander.process(ctx, data);
        }

        templates.option('data',path.data);

        templates.preRender(/\.(hbs|html)$/, function (view, next) {
            view.data = expand(view.data);
            // console.log('view data: ', view.data);
            next();
        });

        templates.data(path.data);

        templates.task('preload', function(cb) {

            templates.partials(path.partials);
            templates.layouts(path.layouts);

            // Register helpers
            templates.helpers(path.helpers);

            // Add master pages and listing page
            templates.pages(path.pages);
            templates.pages(path.referencePages);
            templates.pages(path.index);

            // Add custom data
            templates.data({
                projectName: projectName,
                templateListing: getPageData('./src/templates/pages'),
                referencePageListing: getPageData('./src/templates/reference-pages')
            });

            cb();

        });

        // Assemble task to build template files
        templates.task('build', ['preload'], () => {

            // console.log('ASSEMBLE: ', templates);

            // Render out the template files to 'dist'
            return templates.toStream('pages')
                // TODO: Because assemble is based on gulp/node streams there's not an easy way to find template
                // errors so we're relying on gulp-plumber to do this for us. We define our own handler for more
                // error information.
                .pipe(plumber({
                    errorHandler: err => {
                        // If we encounter this error on a build task, kill the promise
                        if (process.argv.includes('build')) return reject(err);
                        log.error(`${err.message}.`);
                    }
                }))
                .pipe(templates.renderFile())
                .pipe(plumber.stop())
                .pipe(renameExt())
                .pipe(templates.dest('dist'));
        });

        // Run the Assemble build method
        templates.build('build', err => {
            if (err) return reject(err);
            return resolve();
        });
    });
}

// Change the file extension through node stream
function renameExt() {
    return through.obj( (file, enc, next) => {
        file.extname = '.html';
        next(null, file);
    });
}

// Render the page listing (./src/templates/pages/index.hbs)
function getPageData(pageDirUrl) {
    return fs.readdirSync(pageDirUrl)
        .filter( el => {
            return el !== '.DS_Store';
        })
        .map( page => {
            return {
                name: formatName(page),
                path: pageDirUrl + `/${page}`,
                url: page.replace('.hbs', '.html')
            };
        });
}

// Capitalise the files for the page listing
function formatName(page) {
    return page.replace('.hbs', '').replace(/-/g, ' ').split(' ').map( el => {
        return el.charAt(0).toUpperCase() + el.substring(1);
    }).join(' ');
}
