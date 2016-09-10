var fs = require('fs');
var path = require('path');

module.exports.fileToString = function(filePath) {
    'use strict';
    var file = fs.readFileSync(path.join('./dist/', filePath), 'utf8');
    return file.toString();
};
