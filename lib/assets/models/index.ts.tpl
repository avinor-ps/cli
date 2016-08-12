import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';
<% models.forEach(function(model, index) { %>
import {<%=model.name%>Instance, <%=model.name%>Attributes} from "<%=model.path%>";
<% }) %>
let env:string = process.env.NODE_ENV || 'development';
let config:any = JSON.parse(fs.readFileSync(<%= configFile %>,'utf-8'))[env];
let models:string = <%=modelPath%>;

if (config.use_env_variable) {
    var sequelize: Sequelize.Connection = new Sequelize(
        process.env[config.use_env_variable]
    );
} else {
    var sequelize: Sequelize.Connection = new Sequelize(
        config['database'],
        config['username'],
        config['password'],
        config
    );
}

interface DbConnection {
    sequelize: Sequelize.Connection,
    Sequelize: Sequelize.Static,
    <% models.forEach(function(model, index) { %>
    <%=model.name%>?: Sequelize.Model<<%=model.name%>Instance,<%=model.name%>Attributes><%=((index==models.length-1) ? '' : ',')%>
    <% }) %>
};

let db:DbConnection = {
    sequelize:sequelize,
    Sequelize:Sequelize
};


fs.readdirSync(MODELS)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        var model = sequelize['import'](path.join(MODELS, file));
        db[model['name']] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName] && db[modelName].associate) {
        db[modelName].associate(db);
    }
});

export default db;