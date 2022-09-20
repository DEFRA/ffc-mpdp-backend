module.exports = (sequelize, DataTypes) => {
  return sequelize.define('example', {
    exampleId: { type: DataTypes.INTEGER, primaryKey: true },
    textField: DataTypes.STRING
  },
  {
    tableName: 'examples',
    freezeTableName: true,
    timestamps: false
  })
}
