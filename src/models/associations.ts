import Order from './order.js';
import User from './user.js';

Order.belongsTo(User);
User.hasMany(Order);

export { Order, User };
