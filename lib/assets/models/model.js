import * as Sequelize from "sequelize";

export interface <%= name %>Attributes {
  <% if(!attributes.hasOwnProperty('id')){%>
  id:number;
  <%}%>
  <% for(attrName in attributes){
    var field = attributes[attrName];
    if(attributes.hasOwnProperty(attrName)){%>
  <%=attrName%>:<%=field.type%>;
  <%}}%>
};

export interface <%= name %>Instance extends Sequelize.Instance<<%=name%>Instance,<%=name%>Attributes> {

};

export default function define(sequelize:Sequelize.Connection, DataTypes:Sequelize.DataTypes) {

  var <%= name %> = sequelize.define<<%=name%>Instance,<%=name%>Attributes>("<%= name %>", {

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
        if(optionName == 'type') option = "DataTypes."+option;
        else option = '"'+option+'"';
        break;
      }

        if(field.attrs.hasOwnProperty(optionName)){%>
        <%=optionName%>:<%=option%>,
        <%}}%>
      },
      <%}}%>

    },{
    classMethods: {
    associate: function (models) {

  }
  },
    instanceMethods:{

  }
  });

  return <%= name %>;

  };