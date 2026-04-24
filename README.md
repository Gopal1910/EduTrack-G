# 🚀 EduTrack – Smart Attendance & Marks Management System

EduTrack is a modern full-stack web application designed to simplify student attendance tracking, marks management, and reporting for educational institutions.

It provides a clean dashboard experience for both **Teachers (Admin)** and **Students (Users)** with real-time updates and secure authentication.

---

## 🌟 Features

### 👨‍🏫 Teacher (Admin)

* Take and manage student attendance
* Add, update, and delete student records
* Assign and manage marks
* Generate reports
* Real-time attendance updates using WebSockets

### 🎓 Student (User)

* View attendance records
* Check marks and performance
* Access dashboard insights

---

## 🔐 Authentication

* Secure Login & Signup system
* JWT-based authentication
* Role-based access control (Teacher / Student)

---

## 🧠 Tech Stack

### 💻 Frontend

* React.js + TypeScript
* Tailwind CSS
* Vite
* Socket.io Client

### ⚙️ Backend

* Node.js + Express.js
* MongoDB + Mongoose
* JWT Authentication
* Socket.io

---

## 📁 Project Structure

```
EduTrack/
│
├── backend/
│   ├── routes/
│   ├── utils/
│   ├── sockets/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── routes/
│   └── main files
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 Clone the repository

```bash
git clone https://github.com/Gopal1910/EduTrack-G.git
cd EduTrack-G
```

---

### 🔹 Backend Setup

```bash
cd backend
npm install
npm start
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📡 Real-Time Features

* Live attendance updates using **Socket.io**
* Instant dashboard refresh without reload

---

## 🚀 Future Improvements

* AI-based attendance analytics
* Face recognition attendance
* Mobile app version
* Advanced reporting & charts

---

## 👨‍💻 Author

**Gopal**
MERN Stack | Full Stack AI Engineer

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

## 📜 License

This project is licensed under the MIT License.
