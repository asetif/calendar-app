'use strict';
module.exports = (sequelize, DataTypes) => {
  const Mission = sequelize.define('Mission', {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    startDate: DataTypes.STRING,
    technologie: DataTypes.STRING,
    userId : DataTypes.INTEGER
  });

  Mission.associate = function (models) {
    Mission.belongsTo(models.User,{
      foreignKey: 'id',
      sourceKey: 'userId'
    })
  }
 
  return Mission;
};