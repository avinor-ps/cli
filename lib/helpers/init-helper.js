'use strict';

var helpers = require(__dirname);
var path = require('path');
var fs = require('fs');
var clc = require('cli-color');

module.exports = {
    notifyAboutExistingFile: function (file) {
        helpers.view.log(
            'The file ' + clc.blueBright(file) + ' already exists. Run ' +
            '"sequelize init --force" to overwrite it.'
        );
    },

    createFolder: function (folderName, folder, force) {
        if (force) {
            console.log('Deleting the ' + folderName + ' folder. (--force)');

            try {
                fs.readdirSync(folder).forEach(function (filename) {
                    fs.unlinkSync(path.resolve(folder, filename));
                });
            } catch (e) {
                console.log(e);
            }

            try {
                fs.rmdirSync(folder);
                console.log('Successfully deleted the ' + folderName + ' folder.');
            } catch (e) {
                console.log(e);
            }
        }

        try {
            helpers.generic.mkdirp(folder);
            console.log('Successfully created ' + folderName + ' folder at "' + folder + '".');
        } catch (e) {
            console.log(e);
        }
    },

    createMigrationsFolder: function (force) {
        this.createFolder('migrations', helpers.path.getPath('migration'), force);
    },

    createSeedersFolder: function (force) {
        this.createFolder('seeders', helpers.path.getPath('seeder'), force);
    },

    createModelsFolder: function (force) {
        this.createFolder('models', helpers.path.getModelsPath(), force);
    },

    createModelsIndexFile: function (force) {
        var modelsPath = helpers.path.getModelsPath(),
            indexPath = path.resolve(
                modelsPath, '..',
                helpers.path.addFileExtension('index').replace('.js', '.ts')
            ),
            names = [];

        if (!helpers.path.existsSync(modelsPath)) {
            helpers.view.log('Models folder not available.');
        } else if (helpers.path.existsSync(indexPath) && !force) {
            this.notifyAboutExistingFile(indexPath);
        } else {

            fs.readdirSync(modelsPath)
                .filter(function (file) {
                    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.ts');
                })
                .forEach(function (file) {
                    var parts = file.split('.'),
                        name = parts[0].split('_').map(function (str) {
                            var f = str.charAt(0).toUpperCase();
                            str = f + str.substr(1, str.length - 1);
                            return str;
                        });

                    names.push({
                        file:parts[0],
                        name:name.join('')
                    });

                });

            names.forEach(function (name) {
                name.path = path.relative(
                    indexPath,
                    helpers.path.getModelPath(name.file)
                ).slice(1,-3);
            });


            var relativeConfigPath = path.relative(
                path.resolve(helpers.path.getModelsPath(),'..'),
                helpers.config.getConfigFile()
            );

            if(fs.existsSync(indexPath)) fs.unlinkSync(indexPath);

            helpers.asset.write(
                indexPath,
                helpers.template.render('models/index.ts.tpl', {
                    configFile: '"__dirname/'+relativeConfigPath+'"',
                    models:names,
                    modelPath:'"'+helpers.path.getModelsPath()+'"'
                },{
                    beautify: true,
                    indent_size: 0,
                    preserve_newlines: false
                })
            );
        }
    }
};
