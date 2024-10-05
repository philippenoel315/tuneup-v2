const { sql } = require('./db');

exports.insertOrder = async (orderId, name, email, service, skisCount, requestedDate) => {
  return sql`
    INSERT INTO orders (order_id, name, email, service, skis_count, requested_date)
    VALUES (${orderId}, ${name}, ${email}, ${service}, ${skisCount}, ${requestedDate})
  `;
};

exports.getOrders = async () => {
  if (process.env.NODE_ENV === 'production') {
    return sql`
      SELECT o.order_id, u.name AS user_name, s.name AS ski_name, 
             o.order_date, o.status, o.total_price, o.notes
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN ski s ON o.ski_id = s.id
      ORDER BY o.order_date DESC
    `;
  } else {
    const { rows } = await sql(`
      SELECT o.order_id, u.name AS user_name, s.name AS ski_name, 
             o.order_date, o.status, o.total_price, o.notes
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN ski s ON o.ski_id = s.id
      ORDER BY o.order_date DESC
    `);
    return rows;
  }
};