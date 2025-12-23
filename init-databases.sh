#!/bin/bash
set -e

mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    -- 1. USER SERVICE
    CREATE DATABASE IF NOT EXISTS deliv_user;
    USE deliv_user;
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), 
        role ENUM('CUSTOMER', 'RESTAURANT')
    );
    INSERT INTO users (name, email, password, role) 
    VALUES ('Owner Resto', 'admin@gmail.com', 'admin123', 'RESTAURANT')
    ON DUPLICATE KEY UPDATE email=email;

    -- 2. MENU SERVICE
    CREATE DATABASE IF NOT EXISTS deliv_menu;
    USE deliv_menu;
    CREATE TABLE IF NOT EXISTS menus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255), price INT, description TEXT, 
        category VARCHAR(100), image VARCHAR(255)
    );

    -- 3. ORDER SERVICE
    CREATE DATABASE IF NOT EXISTS deliv_order;
    USE deliv_order;
    CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY, menu_id INT, quantity INT, 
        total_price INT, customer_name VARCHAR(255), payment_id INT, 
        status TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. REVIEW SERVICE
    CREATE DATABASE IF NOT EXISTS deliv_review;
    USE deliv_review;
    CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, menu_id INT, 
        customer_name VARCHAR(255), rating INT, comment TEXT
    );

    -- 5. CART SERVICE
    CREATE DATABASE IF NOT EXISTS deliv_cart;
    USE deliv_cart;
    CREATE TABLE IF NOT EXISTS carts (
        id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, menu_id INT, quantity INT
    );

    -- 6. FAVORITE SERVICE
    CREATE DATABASE IF NOT EXISTS deliv_favorite;
    USE deliv_favorite;
    CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, menu_id INT
    );

    -- 7. PAYMENT SERVICE
    CREATE DATABASE IF NOT EXISTS deliv_payment;
    USE deliv_payment;
    CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, amount INT, 
        payment_method VARCHAR(100), status VARCHAR(50), 
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
EOSQL