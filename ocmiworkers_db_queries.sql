
-- Database creation
CREATE DATABASE ocmiworkers_db;

-- Schema creation
CREATE SCHEMA generic;

-- Table queries
SELECT * FROM generic.profiles;
SELECT * FROM generic.users;
SELECT * FROM generic.employees;
SELECT * FROM generic.sheet_times;
SELECT * FROM generic.minimum_wages;

-- Timesheets by user
SELECT * FROM generic.sheet_times times 
INNER JOIN generic.employees empl
ON times.employee_id = empl.employee_id
WHERE empl.user_id = 9
