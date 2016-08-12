'use strict';

var path = require('path');
var helpers = require(path.resolve(__dirname, '..', 'helpers'));
var args    = require('yargs').argv;

module.exports = {
    'bootstrap': {
        descriptions: {
            'short': 'Generates typescript index file for models and db connection.',
            'long': 'Generates typescript index file for models and db connection.'
        },
        task: function () {

            helpers.init.createModelsFolder(false);
            helpers.init.createModelsIndexFile(true);
        }
    }
};
