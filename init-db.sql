-- ========================================================
-- Database Schema & Seed Data for CRUD Application
-- ========================================================

-- Ensure database exists (for local or managed instances where permitted)
-- CREATE DATABASE IF NOT EXISTS crud_db;
-- USE crud_db;

-- 1. Create table `users`
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(255),
    salary DOUBLE NOT NULL
);

-- 2. Seed realistic dummy records for interviewer demonstration
INSERT INTO users (name, email, department, salary) VALUES
('Apurva Chothe', 'apurva.chothe@example.com', 'Engineering', 95000.0),
('Sarah Jenkins', 'sarah.jenkins@example.com', 'Product Management', 105000.0),
('Rajesh Kumar', 'rajesh.kumar@example.com', 'DevOps & Cloud', 98000.0),
('Elena Rostova', 'elena.rostova@example.com', 'Human Resources', 72000.0),
('Marcus Vance', 'marcus.vance@example.com', 'Finance & Analytics', 88000.0)
ON DUPLICATE KEY UPDATE name=VALUES(name);
