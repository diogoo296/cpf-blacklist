module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('blacklist', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true,
        validate: { isNumeric: true }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('blacklist')
  }
}
