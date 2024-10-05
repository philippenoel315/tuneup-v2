const { sql } = require('./db');

exports.insertOrder = async (userId, skiId, status, totalPrice, notes) => {
  console.log("insertOrder");
  return sql(`
    INSERT INTO orders (user_id, ski_id, status, total_price, notes)
    VALUES (${userId}, ${skiId}, ${status}::order_status, ${totalPrice}, ${notes})
    RETURNING order_id
  `);
};


exports.getOrders = async () => {
  return sql(`
    SELECT o.order_id, 
           u.prenom || ' ' || u.nom AS user_name, 
           s.marque || ' ' || s.modele AS ski_name, 
           o.order_date, 
           o.status, 
           o.total_price, 
           o.notes
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN ski s ON o.ski_id = s.id
    ORDER BY o.order_date DESC
  `);
  ;
};

exports.getUserByEmail = async (email) => {
  console.log("getUserByEmail");
  return sql(`
    SELECT id, email, prenom, nom, adresse, zip, skis, club
    FROM users
    WHERE email = '${email}'
  `);
};

exports.insertUser = async (email, prenom, nom, adresse, zip, club) => {
  console.log("insertUser");
  return sql(`
    INSERT INTO users (email, prenom, nom, adresse, zip, club)
    VALUES ('${email}', '${prenom}', '${nom}', '${adresse}', '${zip}', '${club}')
    RETURNING id
  `);
};

exports.getSkiById = async (skiId) => {
  console.log("getSkiById");
  return sql(`
    SELECT id, marque, modele, annee, longueur, dernierentretien, edgeAngle
    FROM ski
    WHERE id = ${skiId}
  `);
};

exports.insertSki = async (marque, modele, annee, longueur, dernierentretien, edgeAngle) => {
  console.log("insertSki");
  return sql(`
    INSERT INTO ski (marque, modele, annee, longueur, dernierentretien, edgeAngle)
    VALUES ('${marque}', '${modele}', ${annee}, ${longueur}, '${dernierentretien}', ${edgeAngle})
    RETURNING id
  `);
};