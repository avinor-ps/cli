'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface
            .createTable('<%= tableName %>', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },

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

        <%= createdAt %>: {
            allowNull: false,
            type: Sequelize.DATE
        },

        <%= updatedAt %>: {
            allowNull: false,
            type: Sequelize.DATE
        }
        });
        },

        down: function (queryInterface, Sequelize) {
            return queryInterface.dropTable('<%= tableName %>');
        }
        };
