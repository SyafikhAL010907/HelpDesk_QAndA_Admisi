-- Database: help_desk_admisi
CREATE DATABASE IF NOT EXISTS help_desk_admisi;
USE help_desk_admisi;

-- Table: authentication
DROP TABLE IF EXISTS authentication;
CREATE TABLE authentication (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    gmail VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: captcha (Matching User's Existing Table)
CREATE TABLE IF NOT EXISTS captcha (
    kode INT AUTO_INCREMENT PRIMARY KEY,
    pertanyaan VARCHAR(255) NOT NULL,
    jawaban VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: active_sessions (For 4-device limit)
CREATE TABLE IF NOT EXISTS active_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gmail VARCHAR(100) NOT NULL,
    session_id TEXT NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (gmail)
);

-- Default Admin (Password: AdminDev1)
INSERT INTO authentication (username, gmail, password, role) 
VALUES ('Admisi UNJ', 'AdminDev@gmail.com', '$2a$14$yjvwFTC6BEXUYgProGmBSeCAZSNpd6ZjBitkUo6/5O6pqhtxOK6qi', 'admin');

-- Sample Captcha Data
INSERT INTO captcha (pertanyaan, jawaban) VALUES ('2 ditambah 2', '4'), ('4 dikurang 1', '3'), ('5 ditambah 3', '8');
