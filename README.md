# 💼 Enterprise Finance Management System

## 📌 Project Overview

Enterprise Finance Management System is a full-stack web application designed to manage company financial transactions efficiently.  
It allows administrators to manage all transactions and users, while regular users can view their completed transactions through a secure role-based dashboard.

The system supports file uploads (invoices, receipts, CSV reports), JWT-based authentication, and role-based authorization.

---

## 🚀 Features

---

### 🔒 Security Features

- Stateless authentication using JWT
- Role-based endpoint protection
- Store JWT tokens in HTTPOnly cookies for XSS protection
- Password hashing with BCrypt
- File validation (type + size restriction)
- Protected admin routes

### 👨‍💼 Admin Features
- Moniter the Enterprise transactions on Analytics page
- View Pending transactions along with overdues
- Get alerts for transactions with due less than a month
- Upload supporting files or reciepts (PDF, CSV, JPG, PNG)
- Download uploaded transaction files
- Create new users for other Enterprise Employees
- Change passwords for security
- View and Manage all transactions

### 👤 User Features
- Login with user credentials
- View only completed transactions
- Secure dashboard access

---

## 🛠 Tech Stack

### 🔵 Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap CSS

### 🟢 Backend
- Spring Boot
- Spring Security
- Spring Data JPA (Hibernate)
- JWT (io.jsonwebtoken)
- MySQL Database
- Maven
- Eclipse IDE

---

## 🏗 Project Structure

```
project-root/
│
├── frontend/         → React Application
│
├── backend/          → Spring Boot Application
│
└── README.md
```

---

# ⚙ Backend Setup (Spring Boot - Eclipse)

## 1️⃣ Import Backend Project in Eclipse

1. Open Eclipse  
2. Click **File → Import**  
3. Select **Existing Maven Project**  
4. Browse and select the `backend` folder  
5. Click **Finish**

---

## 2️⃣ Configure Database (MySQL Workbench)

1. Open **MySQL Workbench**
2. Connect using your MySQL credentials
3. Create a database:

```sql
CREATE DATABASE enterprise_finance;
```

---

## 3️⃣ Configure Application Properties

Navigate to:

```
backend/src/main/resources/
```

You will see:

```
common_application.properties
```

### 👉 Rename it to:

```
application.properties
```

Open `application.properties` and update with your MySQL credentials and then,

Save the file.

---

## 4️⃣ Run Backend

Right-click the backend project  
→ **Run As → Spring Boot App**

Backend will start on:

```
http://localhost:8081
```

---

# 🎨 Frontend Setup (React)

## 1️⃣ Open Terminal

Navigate to frontend folder:

```bash
cd frontend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

If required, install manually:

```bash
npm install react-router-dom axios bootstrap
```

---

## 3️⃣ Start Frontend

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# ✅ Startup Order

1. Start MySQL (Workbench)
2. Run Backend (Port 8081)
3. Run Frontend (Port 3000)
4. Login and use the system

---
