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

