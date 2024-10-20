# HireConnect

Welcome to **HireConnect**, a robust backend project built with the MERN stack, featuring RESTful API architecture and secure JWT authentication.
## Getting Started
To set up HireConnect on your local machine:

1. Clone the Repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Configure Environment Variables:  
   Create a `.env` file and include:
   ```plaintext
   MONGO_URL=<your-mongodb-url>
   JWT_SECRET=<your-secret-key>
   JWT_LIFETIME=<token-lifetime>
   ```
3. Install Dependencies:
   Run:
   ```bash
   npm install
   ```
4. Start the Server:
   Launch the application with:
   ```bash
   npm start
   ```
## API Endpoints

- User Registration:  
  `POST localhost:3000/api/v1/auth/register`
- User Login:  
  `POST localhost:3000/api/v1/auth/login`
- Manage Jobs:  
  - Get All Jobs:  
    `GET localhost:3000/api/v1/jobs/`
  - Create a Job:  
    `POST localhost:3000/api/v1/jobs/`
  - Job Operations**:  
    - Get Job**:  
      `GET localhost:3000/api/v1/jobs/:id`
    - Update Job**:  
      `PATCH localhost:3000/api/v1/jobs/:id`
    - Delete Job**:  
      `DELETE localhost:3000/api/v1/jobs/:id`

## Testing
Utilize [Postman](https://www.postman.com/) to interact with the API and test the functionalities.
Happy coding with HireConnect!
