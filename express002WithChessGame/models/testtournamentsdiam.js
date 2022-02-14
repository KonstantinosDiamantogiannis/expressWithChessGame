'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestTournamentsDiam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TestTournamentsDiam.init({
    title: DataTypes.STRING,
    tdate: DataTypes.DATE,
    tplayers: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TestTournamentsDiam',
  });
  return TestTournamentsDiam;
};