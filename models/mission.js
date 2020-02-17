'use strict';
module.exports = (sequelize, DataTypes) => {
  const Mission = sequelize.define('Mission', {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    startDate: DataTypes.STRING,
    technologie: DataTypes.STRING
  }, {
    associate : function(models) {
      // associations can be defined here
      models.Mission.belongsTO(models.User,{
        foreignKey:{
          allowNull: false
        }
      })
    }
  });
 
  return Mission;
};