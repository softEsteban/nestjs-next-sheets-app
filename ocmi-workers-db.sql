
-- Database creation
CREATE DATABASE ocmiworkers_db;

-- Schema creation
CREATE SCHEMA generic;

-- Table queries
SELECT * FROM generic.profiles;
SELECT * FROM generic.users;
SELECT * FROM generic.employees;
SELECT * FROM generic.sheet_times;


-- Update these !!
INSERT INTO generic.profiles (profile_name, profile_config) VALUES ('ADMIN PROFILE', '[{"menu_id":"1","children":[{"menu_id":"1","children":[],"menu_icon":"","menu_link":"/workers","menu_name":"Workers"},{"menu_id":"2","children":[],"menu_icon":"","menu_link":"/time-sheets","menu_name":"Time Sheets"}],"menu_icon":"FaUser","menu_link":"","menu_name":"Workers Management"},{"menu_id":"2","children":[{"menu_id":"1","children":[],"menu_icon":"","menu_link":"/my-info","menu_name":"My info"},{"menu_id":"2","children":[],"menu_icon":"","menu_link":"/logout","menu_name":"Logout"}],"menu_icon":"FaUser","menu_link":"","menu_name":"My profile"}]');
INSERT INTO generic.profiles (profile_name, profile_config) VALUES ('CLIENT PROFILE', '[{"menu_id":"1","children":[{"menu_id":"1","children":[],"menu_icon":"","menu_link":"/workers","menu_name":"Workers"},{"menu_id":"2","children":[],"menu_icon":"","menu_link":"/view-all-time-sheets","menu_name":"All Time Sheets"}],"menu_icon":"FaUser","menu_link":"","menu_name":"Workers Management"},{"menu_id":"2","children":[{"menu_id":"1","children":[],"menu_icon":"","menu_link":"/my-info","menu_name":"My info"},{"menu_id":"2","children":[],"menu_icon":"","menu_link":"/logout","menu_name":"Logout"}],"menu_icon":"FaUser","menu_link":"","menu_name":"My profile"}]');