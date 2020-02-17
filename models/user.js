'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    cost: DataTypes.DECIMAL,
    isAdmin: DataTypes.INTEGER,
    hasCompletedTutorial: DataTypes.INTEGER
  }, {
    classMethods:{
      associate : function(models) {
        // associations can be defined here
        models.User.hasMany(models.Mission);
      }
    }
  });
  
  return User;
};