'use strict';
module.exports = (sequelize, DataTypes) => {
  const nonWarkingDays = sequelize.define('nonWarkingDays', {
    idnonWorkingDays: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {});
  nonWarkingDays.associate = function(models) {
    // associations can be defined here
  };
  return nonWarkingDays;
};