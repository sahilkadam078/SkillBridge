# 🎓 SkillBridge – Internship Portal Web Application

SkillBridge is a full-stack internship portal that connects **students with recruiters**.

Students can explore internships and apply for them, while recruiters can post internships and manage applicants through a dedicated dashboard.

The platform demonstrates **role-based authentication, internship management, and application tracking**.

---

## 🚀 Live Demo

(Add deployment link after hosting)

Example:  
https://skillbridge-demo.com

---

## 🛠 Tech Stack

### Frontend
- EJS
- Bootstrap
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL
- mysql2

### Authentication & Security
- Express Sessions
- bcrypt
- Input Validation
- Role-based Authorization

### Other Tools
- dotenv
- connect-flash
- Nodemon

---

## ✨ Features

### 👨‍🎓 Student Features
- Student Registration & Login
- Browse available internships
- Search internships by role/skill
- Apply for internships
- View applied internships
- Track application status:
  - Applied
  - Approved
  - Cancelled
- Update student profile
- Reset password

### 🏢 Recruiter Features
- Recruiter Login
- Add new internships
- View posted internships
- View applicants for each internship
- Approve or reject applications
- Manage company profile

---

## 🧠 What I Learned

- Building a **role-based authentication system**
- Implementing **MVC architecture**
- Designing a **relational database schema**
- Managing **sessions and authentication**
- Implementing **secure environment variables**
- Handling **student-recruiter interaction workflows**

---

## 📂 Project Structure
SkillBridge/
│
├── config/
│ └── db.js
│
├── controllers/
│ ├── authController.js
│ ├── studentController.js
│ ├── recruiterController.js
│ └── homeController.js
│
├── middleware/
│ ├── roleMiddleware.js
│ └── validators.js
│
├── routes/
│ ├── authRoutes.js
│ ├── studentRoutes.js
│ ├── recruiterRoutes.js
│ └── homeRoutes.js
│
├── services/
│ ├── authService.js
│ ├── studentService.js
│ ├── recruiterService.js
│ └── homeService.js
│
├── views/
│ ├── student/
│ ├── recruiter/
│ ├── login.ejs
│ ├── register.ejs
│ └── home.ejs
│
├── .env
├── app.js
├── package.json
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/SkillBridge.git
cd SkillBridge

```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Create .env file

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=skillbridge
SESSION_SECRET=your_secret_key
PORT=3000
```

### 4️⃣ Start the server

```
nodemon app.js
```

## 👨‍💻 Author

Sahil Vijay Kadam
BSc Computer Science Student
Aspiring Full-Stack Developer

GitHub:
https://github.com/sahilkadam078

LinkedIn:
www.linkedin.com/in/sahil-kadam-dev