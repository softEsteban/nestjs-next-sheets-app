CHALLENGE PLAN:

* Specify requirements
* Build database from entities and migrations
* Build services and test cases
* Build app and test cases
* Diagram database structure and app architecture
* Test through Sonarqube

---------


CHALLENGE SPECIFICATIONS:

* Gist - [https://gist.github.com/CristianHG2/ecb23035b7551c3067f51a163bf5c753](https://gist.github.com/CristianHG2/ecb23035b7551c3067f51a163bf5c753)
* Repo - [https://github.com/ocmiworkerscomp/nestjs-interview](https://github.com/ocmiworkerscomp/nestjs-interview)

---------

TYPEORM COMMANDS:

npm run migration:generate -- src/database/migrations/<MigrationName>
npm run migration:run

---------

NESTJS TESTING COMMANDS:

npm run test:watch
npm run test:e2e:watch

---------


SQL COMMANDS:

CREATE DATABASE ocmiworkers_db;

CREATE SCHEMA generic;

SELECT * FROM generic.profiles;
SELECT * FROM generic.users;

INSERT INTO generic.profiles (profile_name, profile_config) VALUES ('ADMIN PROFILE', '[{"menu_id":"1","children":[{"menu_id":"1","children":[],"menu_icon":"","menu_link":"/workers","menu_name":"Workers"},{"menu_id":"2","children":[],"menu_icon":"","menu_link":"/time-sheets","menu_name":"Time Sheets"}],"menu_icon":"FaUser","menu_link":"","menu_name":"Workers Management"},{"menu_id":"2","children":[{"menu_id":"1","children":[],"menu_icon":"","menu_link":"/my-info","menu_name":"My info"},{"menu_id":"2","children":[],"menu_icon":"","menu_link":"/logout","menu_name":"Logout"}],"menu_icon":"FaUser","menu_link":"","menu_name":"My profile"}]');
INSERT INTO generic.profiles (profile_name, profile_config) VALUES ('CLIENT PROFILE', '[{"menu_id":"1","children":[{"menu_id":"1","children":[],"menu_icon":"","menu_link":"/workers","menu_name":"Workers"},{"menu_id":"2","children":[],"menu_icon":"","menu_link":"/view-all-time-sheets","menu_name":"All Time Sheets"}],"menu_icon":"FaUser","menu_link":"","menu_name":"Workers Management"},{"menu_id":"2","children":[{"menu_id":"1","children":[],"menu_icon":"","menu_link":"/my-info","menu_name":"My info"},{"menu_id":"2","children":[],"menu_icon":"","menu_link":"/logout","menu_name":"Logout"}],"menu_icon":"FaUser","menu_link":"","menu_name":"My profile"}]');
