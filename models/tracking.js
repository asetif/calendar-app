'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tracking = sequelize.define('Tracking', {
    date: DataTypes.STRING
  }, {
    associate : function(models) {
      // associations can be defined here
        models.Tracking.belongsTo(models.User.nonWorkingDay,{
          foreignKey:{
            allowNull: false
          }
        })
      }
    });
  
  return Tracking;
};