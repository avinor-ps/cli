'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
      .createTable('<%= tableName %>', {

    <% if(!attributes.hasOwnProperty('id')) {%>
            id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
        <%}%>

        <% for(attrName in attributes){
            var field = attributes[attrName];
            if(attributes.hasOwnProperty(attrName)){%>
            <%=attrName%>:{
            <% for(optionName in field.attrs){
                var option = field.attrs[optionName];
                switch(Object.prototype.toString.call(option).split(" ")[1].slice(0,-1).toLowerCase()){
                case "number":
                case "string":
                case "date":
                if(optionName == 'type') option = "Sequelize."+option;
                else option = '"'+option+'"';
                break;
            }

                if(field.attrs.hasOwnProperty(optionName)){%>
                <%=optionName%>:<%=option%>,
                <%}}%>
            },
            <%}}%>

        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field:'created_at'
        },

        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field:'updated_at'
        },

        deletedAt:: {
            allowNull: true,
            type: Sequelize.DATE,
            field:'deleted_at'
        },

        createdBy: {
            allowNull: false,
            type: Sequelize.INTEGER,
            field:'created_by',
            references: {
              model: 'employees',
              key: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        },

        updatedBy: {
            allowNull: false,
            type: Sequelize.INTEGER,
            field:'updated_by',
            references: {
              model: 'employees',
              key: 'id'
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        }
        });
        },

        down: function (queryInterface, Sequelize) {
            return queryInterface.dropTable('<%= tableName %>');
        }
    };
