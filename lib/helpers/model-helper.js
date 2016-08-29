'use strict';

var clc = require('cli-color');
var helpers = require(__dirname);
var types = {
    "STRING": "string",
    "CHAR": "string",
    "TEXT": "string",
    "INTEGER": "number",
    "BIGINT": "number",
    "FLOAT": "number",
    "REAL": "number",
    "DOUBLE": "number",
    "DECIMAL": "number",
    "BOOLEAN": "boolean",
    "TIME": "string",
    "DATE": "Date",
    "DATEONLY": "Date",
    "HSTORE": "any",
    "JSON": "any",
    "JSONB": "any",
    "NOW": "Date",
    "BLOB": "string",
    "RANGE": "any[]",
    "UUID": "string",
    "UUIDV1": "string",
    "UUIDV4": "string",
    "VIRTUAL": "any",
    "ENUM": "string",
    "ARRAY": "any[]",
    "GEOMETRY": "any",
    "GEOGRAPHY": "any"
};

module.exports = {
    notifyAboutExistingFile: function (file) {
        helpers.view.error(
            'The file ' + clc.blueBright(file) + ' already exists. ' +
            'Run "sequelize model:create --force" to overwrite it.'
        );
    },

    toTypeScriptType: function (type) {
        type = (type + '').toUpperCase();
        return types[type];
    },

    transformAttributes: function (flag) {

        var self = this,
            set = flag.replace(/\s/g, '').split(';'),
            result = {};

        if(!set[set.length - 1]) set.splice(-1,1);

        set.forEach(function (line) {

            var pair = line.split(':'),
                name = pair[0],
                attrs = {type: ""},
                items = pair[1].split(',');
            if (items.length == 1) {
                attrs.type = (items[0] + "").toUpperCase();
            }
            else {
                items.forEach(function (item) {

                    var attr = item.split('=');

                    if (attr.length == 1) {
                        attrs[attr[0]] = true;
                    }
                    else {
                        if (attr[0] == 'type') attr[1] = attr[1].toUpperCase();
                        attrs[attr[0]] = attr[1];
                    }
                });
            }

            result[name] = {
                "type": self.toTypeScriptType(attrs.type),
                "attrs": attrs
            };

        });

        return result;
    },

    generateFileContent: function (args) {
        var name = (args.name + '').toLocaleLowerCase().split('_').map(function (str) {
                var f = str.charAt(0).toUpperCase();
                str = f + str.substr(1, str.length - 1);
                return str;
            });

        return helpers.template.render('models/model.js', {
            name: name.join(''),
            attributes: this.transformAttributes(args.attributes)
        },{
            beautify: true,
            indent_size: 0,
            preserve_newlines: false
        });
    },

    generateFile: function (args) {
        var modelPath = helpers.path.getModelPath(args.name).replace('.js','.ts');

        helpers.asset.write(modelPath, this.generateFileContent(args));
    },

    modelFileExists: function (filePath) {
        return helpers.path.existsSync(filePath);
    }
};
