module.exports = (Sequelize, DataTypes) => {
  let Blacklist = Sequelize.define('Blacklist', {
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
    tableName: 'blacklist',
    timestamps: true,
    updatedAt: false,
    deletedAt: false
  })

  Blacklist.findCpfNumber = (cpf) => {
    return Blacklist.findOne({ where: { cpf: cpf } })
  }

  return Blacklist
}
