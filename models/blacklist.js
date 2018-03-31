module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    deletedAl: false
  })
}
