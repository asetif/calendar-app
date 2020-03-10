'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Trackings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allownull: false,
        type: Sequelize.INTEGER,
       references:{
          model: 'Users',
          key: 'id'
        }
      },
      missionId :{
        allownull: false,
        type: Sequelize.INTEGER,
       references:{
          model: 'Missions',
          key: 'id'
        }
      },
      date: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Trackings');
  }
};