# OCMI Workers Comp Technical Test

## Description
This project is a full-stack web application developed as a technical test for OCMI Workers Comp. It utilizes NestJS for the backend API, Next.js for the frontend, and PostgreSQL for the database. The application also includes Jest for testing, JWT authorization in controllers using decorators, and TypeORM for database management and migrations.

## Tech Stack
- Backend: NestJS
- Frontend: Next.js
- Database: PostgreSQL
- Testing: Jest
- Authorization: JWT
- Database Management: TypeORM

## Requirements

### Auth Module
- User must be able to login and receive a JWT token along with a profile configuration for the menu. Passwords must be encrypted in the database. Profile configurations rely on a jsonb column with icons, menu names, and links for redirection.

### Users Module
- Admin should be able to retrieve all client users and admins if there are more than one.
- Admin should be able to update user information.
- Admin should be able to delete a user by ID.

### Employees Module
- Admin should be able to retrieve all employees.
- Client should be able to retrieve all their assigned employees.
- Admin and client should be able to update employees.
- Admin and client should be able to create employees. The employee pay rate must be validated against the Minimum Wages table.
- Admin and client should be able to delete employees.

### Time Sheets Module
- Admin and client should be able to create time sheets. Pay rates must be validated against the Minimum Wages table.
- Admin should be able to retrieve all registered time sheets.
- Admin should be able to update time sheet states to 'approved' or 'declined'.
- Client should be able to retrieve all time sheets of their employees.
- Admin and client should be able to retrieve the details of an employee's time sheets.
- Admin and client should have access to the salary and hourly charts.


## App and API Screenshots

### API Swagger
![API Swagger](/images-app/api-swagger.png)

### App Landing Page
![App Landing - Part 1](/images-app/app-landing.png)
![App Landing - Part 2](/images-app/app-landing-2.png)

### App Login
![App Login](/images-app/app-login.png)

### App Home and Dashboard
![App Home](/images-app/app-home.png)

### App Employees Management
![App Home](/images-app/app-employees.png)

### App Time Sheets Management
![App Home](/images-app/app-time-sheets.png)

### App Time Sheets Admin
![App Home](/images-app/app-time-sheets-admin.png)

### App Time Sheets Detail
![App Home](/images-app/app-time-sheets-detail.png)



