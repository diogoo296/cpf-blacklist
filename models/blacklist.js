module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      validate: { isNumeric: true }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tablename: 'blacklist',
    timestamps: true,
    updatedAt: false,
    deletedAt: false
  })
}
