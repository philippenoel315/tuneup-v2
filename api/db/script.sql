-- Drop the orders table if it exists
DROP TABLE IF EXISTS orders;

-- Drop the users table if it exists
DROP TABLE IF EXISTS users;

-- Drop the ski table if it exists
DROP TABLE IF EXISTS ski;

-- Drop the ENUM type order_status if it exists
DROP TYPE IF EXISTS order_status;

-- Create the ski table
CREATE TABLE ski (
    id SERIAL PRIMARY KEY,
    marque VARCHAR(255),
    modele VARCHAR(255),
    annee INT,
    longueur INT,
    dernierentretien DATE,
    edgeAngle INT
);

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    prenom VARCHAR(255),
    nom VARCHAR(255),
    adresse VARCHAR(255),
    zip VARCHAR(20),
    skis INT REFERENCES ski(id),
    club VARCHAR(255)
);

-- Create an ENUM type for order status
CREATE TYPE order_status AS ENUM ('En attente', 'En cours', 'Completé', 'Annulé');

-- Create the orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,  -- Auto-incrementing order ID
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    ski_id INT REFERENCES ski(id) ON DELETE SET NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status order_status NOT NULL,
    total_price DECIMAL(10, 2),
    notes TEXT
);

-- Seed data for the ski table
INSERT INTO ski (marque, modele, annee, longueur, dernierentretien, edgeAngle) VALUES
('Rossignol', 'Experience 88', 2022, 170, '2023-01-15', 90),
('Atomic', 'Redster G9', 2021, 165, '2023-02-10', 88),
('Salomon', 'XDR 80', 2020, 175, '2023-03-05', 87);

-- Seed data for the users table
INSERT INTO users (email, prenom, nom, adresse, zip, skis, club) VALUES
('john.doe@example.com', 'John', 'Doe', '123 Ski Lane', '12345', 1, 'Ski Club A'),
('jane.smith@example.com', 'Jane', 'Smith', '456 Mountain Road', '67890', 2, 'Ski Club B'),
('emma.jones@example.com', 'Emma', 'Jones', '789 Snow Street', '54321', 3, 'Ski Club C');

-- Seed data for the orders table
INSERT INTO orders (user_id, ski_id, order_date, status, total_price, notes) VALUES
(1, 1, '2024-10-01', 'En attente', 200.00, 'Regular maintenance required.'),
(2, 2, '2024-10-02', 'En cours', 250.00, 'Edge sharpening completed.'),
(3, 3, '2024-10-03', 'Completé', 180.00, 'Base repair and waxing.');
