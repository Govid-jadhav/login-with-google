# Node.js Login System with Google & GitHub OAuth

A simple login system built using **Node.js**, **Express**, **MongoDB**, and **Passport.js** with support for:
- Local signup/login (with bcrypt password hashing)
- Google OAuth 2.0
- GitHub OAuth 2.0
- Session management with MongoDB store
- Flash messages for errors/success

---

## 📌 Features
- **User Authentication**
  - Local signup/login
  - Google login
  - GitHub login
- **Password Encryption** using bcrypt
- **Session Management** using express-session + connect-mongo
- **Flash Messages** for feedback
- **EJS Templates** with ejs-mate layout support
- **Profile Page** for logged-in users
- **Logout** functionality

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** Passport.js, Google OAuth 2.0, GitHub OAuth 2.0
- **Templating Engine:** EJS with ejs-mate
- **Styling:** Bootstrap
- **Session Store:** connect-mongo
- **Others:** bcrypt, dotenv, method-override, connect-flash

---

## 📂 Project Structure
project/
│── models/
│ └── schema.js # User schema
│── public/ # Static files (CSS, JS, images)
│── views/ # EJS templates
│ ├── login.ejs
│ ├── signup.ejs
│ ├── profile.ejs
│ └── layout.ejs
│── .env # Environment variables
│── server.js # Main application file
│── package.json
└── README.md

yaml
Copy code

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
Install dependencies

bash
Copy code
npm install
Create .env file

env
Copy code
PORT=3000
SESSION_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
Run MongoDB locally

bash
Copy code
mongod
Start the server

bash
Copy code
npm start
Visit in browser

arduino
Copy code
http://localhost:3000
🚀 Usage
Signup/Login Locally

Enter your name, email, and password on the signup form.

Google Login

Click "Login with Google".

GitHub Login

Click "Login with GitHub".

Profile Page

Accessible only to logged-in users.

Logout

Click the logout link to end your session.
