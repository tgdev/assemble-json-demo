/**
 * build.js
 *
 * Build script with options for kentico, assets, etc...
 *
 * Use multiTask to run tasks. This ensures that we can await on things that
 * have dependencies. ie. javascript, icons, and copyAsses can be run at any time
 * but only after clean... css and templates can only run last.
 *
 */
import run from './run';
import clean from './clean';
import stylelinter from './stylelinter';
import javascript from './javascript';
import icons from './icons';
import fonts from './fonts';
import css from './css';
import templates from './templates';
// import images from './images';

async function multiTask(tasks) {
    return Promise.all(tasks);
}

export default async function build() {
    // Before
    await multiTask([
        run(clean)
    ]);

    await multiTask([
        run(stylelinter),
        run(javascript),
        run(icons),
        run(fonts)//,
        // run(images)
    ]);

    // After
    await multiTask([
        run(css),
        run(templates)
    ]);
}
