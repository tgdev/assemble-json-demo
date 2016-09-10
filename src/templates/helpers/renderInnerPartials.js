/*eslint no-console: 0*/
/*
 * templates/helpers/renderInnerPartial
 *
 * This file contains the funtionality that allows us to pass Handlebar partials through other handlebars partials (with data!).
 *
 */
var Handlebars = require('handlebars');

// function always get a partial name and any data that is needed for it to render.
module.exports.renderInnerPartial = function(partialName, data) {
    if (!partialName) {
        console.error('No partial name given.');
        return '';
    }

    // find the partial in the Handlebars partial list.
    var partial = Handlebars.partials[partialName];
    if (!partial) {
        console.error('Couldnt find the compiled partial: ' + partialName);
        return '';
    }

    // if the partial isn't compiled, do it now
    if (typeof partial !== 'function') {
        partial = Handlebars.compile(partial);
    }

    return new Handlebars.SafeString( partial(data.hash) );
};
