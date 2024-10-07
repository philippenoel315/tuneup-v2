const Order = require('./order');
const User = require('./user');  // Assuming you have a User model

Order.belongsTo(User);
User.hasMany(Order);

// Export your models if needed
module.exports = {
  Order,
  User
};
