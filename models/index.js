const sequelize = require("../config/sequelize");
const User = require("./User");
const Order = require("./Order");

User.hasMany(Order, {
  foreignKey: "usuario_id",
  as: "pedidos",
});

Order.belongsTo(User, {
  foreignKey: "usuario_id",
  as: "usuario",
});

module.exports = {
  sequelize,
  User,
  Order,
};
