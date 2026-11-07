\# Sweety – Blood Glucose Tracker



A full-stack blood glucose tracking application built using React, Node.js, Express, and PostgreSQL.



\## Features



\- User signup and login

\- Password hashing using bcrypt

\- JWT authentication

\- User-specific glucose readings

\- Add, view, edit, and delete readings

\- Morning, After breakfast, After lunch, After dinner slots

\- Glucose validation from 40–600 mg/dl

\- Whole-number validation

\- Future-date prevention

\- One reading per time slot per day

\- Daily report

\- Month-to-date report

\- Previous-month report



\## Tech Stack



\- React

\- Node.js

\- Express.js

\- PostgreSQL

\- Axios

\- bcrypt

\- JSON Web Token

\- dotenv

\- CORS



\## Installation



\### Backend



cd server

npm install

npm run dev



Backend runs on:

http://localhost:5000



\### Frontend



cd client

npm install

npm run dev



Frontend runs on:

http://localhost:5173



\## Environment Variables



Create a .env file inside the server folder.



Use .env.example as a reference.



Required variables:



DB\_HOST=localhost

DB\_PORT=5432

DB\_NAME=sweety

DB\_USER=postgres

DB\_PASSWORD=your\_postgres\_password



JWT\_SECRET=your\_jwt\_secret

PORT=5000



\## API Endpoints



\### Authentication



POST /api/auth/register

POST /api/auth/login



\### Readings



POST /api/readings

GET /api/readings

GET /api/readings/:id

PUT /api/readings/:id

DELETE /api/readings/:id



\### Reports



GET /api/reports/daily

GET /api/reports/month-to-date

GET /api/reports/previous-month



\## Validation



\- Glucose value is required

\- Glucose value must be a whole number

\- Glucose value must be between 40 and 600

\- Future dates are not allowed

\- Duplicate readings for the same user, date, and time slot are not allowed



\## Authentication



Passwords are hashed using bcrypt.



Protected APIs use JWT authentication.



Each user can access only their own readings.



\## Author



Sahana Busare



\## Demo Account



Run the seed command from the server folder:



npm run seed



Demo login:



Email: demo@example.com

Password: Demo@12345



The seed creates a demo user with sample glucose readings.



\## Database Setup



Create a PostgreSQL database named `sweety`.



Create the `users` table:



CREATE TABLE users (

&#x20;   id SERIAL PRIMARY KEY,

&#x20;   name VARCHAR(100) NOT NULL,

&#x20;   email VARCHAR(255) UNIQUE NOT NULL,

&#x20;   password VARCHAR(255) NOT NULL,

&#x20;   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP

);



Create the `readings` table:



CREATE TABLE readings (

&#x20;   id SERIAL PRIMARY KEY,

&#x20;   user\_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

&#x20;   reading\_date DATE NOT NULL,

&#x20;   time\_slot VARCHAR(30) NOT NULL,

&#x20;   value INTEGER NOT NULL,

&#x20;   created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,

&#x20;   updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,



&#x20;   CONSTRAINT unique\_user\_date\_slot

&#x20;       UNIQUE (user\_id, reading\_date, time\_slot),



&#x20;   CONSTRAINT valid\_time\_slot

&#x20;       CHECK (

&#x20;           time\_slot IN (

&#x20;               'Morning',

&#x20;               'After breakfast',

&#x20;               'After lunch',

&#x20;               'After dinner'

&#x20;           )

&#x20;       ),



&#x20;   CONSTRAINT valid\_glucose\_value

&#x20;       CHECK (value >= 40 AND value <= 600)

&#x20;   );



\## Testing



The application was manually tested for:



\- Signup and login

\- JWT authentication

\- Adding glucose readings

\- Viewing readings

\- Editing readings

\- Deleting readings

\- Required-field validation

\- Whole-number validation

\- 40–600 mg/dl validation

\- Future-date validation

\- Duplicate time-slot prevention

\- Daily reports

\- Month-to-date reports

\- Previous-month reports

\- Logout

\- User-specific reading access



\## Seed Demo Data



From the `server` folder:



npm run seed



Demo account:



Email: demo@example.com

Password: Demo@12345

## Notes

### Assumptions
- Each user can record up to 4 glucose readings per day.
- Each reading is associated with a date and one of four time slots: Morning, After breakfast, After lunch, or After dinner.
- Glucose values are restricted to the range of 40–600 mg/dL.
- A user cannot add more than one reading for the same date and time slot.
- PostgreSQL is used as the database for storing users and glucose readings.
- JWT is used for user authentication.

### What I Would Improve With More Time
- Add pagination for the readings list.
- Add charts to visualize glucose readings over time.
- Improve the UI/UX for better usability on mobile and desktop.
- Add more comprehensive frontend and backend tests.
- Add Docker support for easier setup and deployment.
- Add stronger validation and error handling throughout the application.

