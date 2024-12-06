IRCTC Railway Management System
Problem Statement
Hey there, Mr. X. You have been appointed to design a railway management system like IRCTC, where users can come on the platform and
check if there are any trains available between 2 stations.
The app will also display how many seats are available between any 2 stations and the user can book a seat if the availability > 0 after
logging in. Since this has to be real-time and multiple users can book seats simultaneously, your code must be optimized enough to handle
large traffic and should not fail while doing any bookings.
If more than 1 users simultaneously try to book seats, only either one of the users should be able to book. Handle such race conditions
while booking.
There is a Role Based Access provision and 2 types of users would exist :
1. Admin - can perform all operations like adding trains, updating total seats in a train, etc.
2. Login users - can check availability of trains, seat availability, book seats, get booking details, etc.

This project is a Railway Management System designed to mimic key functionalities of the IRCTC platform. It allows users to book train seats, check train availability, and manage train details while ensuring role-based access for both users and administrators.

The backend is powered by Node.js, Express.js, and MySQL.

Key Features
1. User Management
Registration and Login with JWT-based authentication for secure access.
2. Train Search and Booking
Check train availability between a source and destination.
Book train seats with mechanisms to handle race conditions.
3. Admin Features
Add or update train details such as seat availability.
Role-based access controls for users and admins.
4. Error Handling
Comprehensive input validation and error responses.

Project Setup
Prerequisites
Ensure the following software is installed on your system:

Node.js (v14 or later)
MySQL (Database setup)
Postman (for API testing)

Environment Variables
Create a .env file in the project's root directory with the following configuration:

env
PORT=3000
HOST=localhost
USER=username
PASSWORD=password
DATABASE_NAME=db_irctc
JWT_SECRET=jwt_secret
API_KEY=admin_api_key

Installation Steps
Clone the repository:
git clone https://github.com/prachidubey15/IRCTC-WorkIndia.git
cd IRCTC-WorkIndia


Install dependencies:

npm install
Set up the MySQL database:

Create a database named irctc_db.
Use the SQL script in database/schema.sql to set up tables:

CREATE DATABASE irctc_db;
USE irctc_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainNo VARCHAR(50) NOT NULL,
    src VARCHAR(255) NOT NULL,
    dest VARCHAR(255) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    trainId INT,
    seat INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (trainId) REFERENCES trains(id)
);


Start the server:
npm start


The server runs on port 3000 by default.
Access APIs at: http://localhost:3000.

API Endpoints

User Endpoints: 
Register

POST: http://localhost:3000/user/register
Body: {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password"
}

Login

POST: http://localhost:3000/user/login
Body:{
    "email": "john@example.com",
    "password": "password"
}


Check Train Availability

GET: http://localhost:3000/user/availability
Query Parameters:
src: Source station (e.g., "Ranchi")
dest: Destination station (e.g., "Delhi")
Response:{
    "available": true,
    "availableTrainCount": 1,
    "trains": [
        {
            "trainNo": "123123",
            "available_seats": 600
        }
    ]
}

Book Seats

POST: http://localhost:3000/user/book
Body:
{
    "id": 1,
    "seats": 2
}
Response:{
    "message": "Seats booked successfully"
}


View Bookings

GET: http://localhost:3000/user/getAllbookings
Response:
[
    {
        "booking_id": 17,
        "number_of_seats": 50,
        "trainNo": "123123",
        "src": "Ranchi",
        "dest": "Delhi"
    }
]


Admin Endpoints
Add a Train

POST: http://localhost:3000/admin/create-train
Body:{
    "trainNo": "172622",
    "src": "Delhi",
    "dest": "Mumbai",
    "total_seats": 200,
    "available_seats": 200
}

Headers:
x-api-key: Your admin API key stored in env.


Update Seat Availability

PUT: http://localhost:3000/admin/update-seats/:id
Body:
{
    "total_seats": 200,
    "available_seats": 150
}

Headers:
x-api-key: Your admin API key stored in env.
Response:{
    "message": "Seats updated successfully"
}

Technologies Used
Node.js: Backend logic
Express.js: RESTful API framework
MySQL: Database for train, user, and booking data
JWT: Authentication and authorization
bcrypt: Password hashing
dotenv: Environment variable management

Contributing
Feel free to fork the repository and make your contributions via pull requests. Any enhancements, bug fixes, or suggestions are welcome!
