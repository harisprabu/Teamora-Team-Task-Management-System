# Teamora – Team Task Management System

## 📌 Project Overview

**Teamora** is a web-based **Team Task Management System** designed to help organizations and development teams manage users, teams, projects, and tasks efficiently from a centralized platform.

The system provides role-based access where users can register and, after administrator approval, access the system based on their assigned role. Administrators can manage members, teams, projects, and tasks, while team members can view their assigned work, update task status, and collaborate with their team.

Teamora is developed using **React.js, Spring Boot, Java, MySQL, Spring Security with JWT, and REST APIs**, providing a secure and scalable full-stack application.

---

## 🎯 Objectives

* To provide a centralized platform for managing team activities.
* To simplify project and task management.
* To allow administrators to manage users and teams.
* To provide role-based access control.
* To securely authenticate users using JWT.
* To allow team members to view and update their assigned tasks.
* To improve team productivity and task tracking.
* To maintain project and task information in a structured database.

---

## 🚀 Key Features

### 👨‍💼 Admin Features

* Admin login and authentication
* View and manage registered members
* Approve or reject member registrations
* Manage users and their roles
* Create and manage teams
* Assign members to teams
* Create and manage projects
* Assign projects to teams
* Create and manage tasks
* Assign tasks to team members
* Monitor task status and progress

### 👨‍💻 Member Features

* Secure member login
* View personal dashboard
* View assigned team
* View assigned projects
* View assigned tasks
* Update task status
* Track task progress
* Access project and team information based on permissions

---

## 🔐 Authentication & Authorization

Teamora uses **Spring Security and JWT (JSON Web Token)** for secure authentication and authorization.

### Registration Flow

```text
Member Registration
        ↓
Registration Request
        ↓
Admin Review
        ↓
Admin Approves
        ↓
Member Account Activated
        ↓
Member Login
        ↓
JWT Token Generated
        ↓
Access Authorized Features
```

The system uses **Role-Based Access Control (RBAC)** to restrict features according to the user's role.

Example roles:

* ADMIN
* MEMBER

---

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios
* React Router
* Font Awesome

### Backend

* Java
* Spring Boot
* Spring MVC
* Spring Data JPA
* Hibernate
* Spring Security
* JWT
* REST API

### Database

* MySQL

### Development Tools

* Visual Studio Code
* IntelliJ IDEA
* Postman
* MySQL
* Git
* GitHub

---

## 🏗️ System Architecture

```text
                  ┌─────────────────────┐
                  │       User          │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │    React.js UI      │
                  │     Frontend        │
                  └──────────┬──────────┘
                             │
                         REST API
                             │
                             ▼
                  ┌─────────────────────┐
                  │    Spring Boot     │
                  │      Backend       │
                  └──────────┬──────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        Spring Security    Services      REST APIs
              │
              ▼
        JWT Authentication
                             │
                             ▼
                  ┌─────────────────────┐
                  │       MySQL         │
                  │      Database       │
                  └─────────────────────┘
```

---

## 📂 Project Structure

### Frontend

```text
Teamora-Frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```

### Backend

```text
Teamora-Backend/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com.example.teamora/
│       │       ├── controller/
│       │       ├── service/
│       │       ├── repository/
│       │       ├── entity/
│       │       ├── dto/
│       │       ├── config/
│       │       ├── security/
│       │       └── enums/
│       │
│       └── resources/
│           └── application.properties
│
└── pom.xml
```

---

## 📋 Main Modules

### 1. Authentication Module

Handles:

* User registration
* User login
* Password authentication
* JWT token generation
* JWT token validation
* Role-based authorization

### 2. User Management Module

Admin can:

* View users
* Approve members
* Manage user roles
* Activate or deactivate users

### 3. Team Management Module

Admin can:

* Create teams
* View teams
* Add members to teams
* Manage team members

### 4. Project Management Module

Admin can:

* Create projects
* Update projects
* Delete projects
* Assign projects to teams
* Track project information

### 5. Task Management Module

Admin can:

* Create tasks
* Assign tasks
* Set task priority
* Set task status
* Update task details

Members can:

* View assigned tasks
* Update task status
* Track their task progress

### 6. Dashboard Module

The dashboard provides a centralized view of:

* Total users
* Total teams
* Total projects
* Total tasks
* Pending tasks
* Completed tasks
* Task progress

---

## 🔄 Application Workflow

```text
User Registration
        ↓
Admin Approval
        ↓
User Login
        ↓
JWT Authentication
        ↓
Role Verification
        ↓
Dashboard
        ↓
┌───────────────┬────────────────┐
│               │                │
Admin          Member
│               │
├── Users       ├── My Team
├── Teams       ├── My Projects
├── Projects    └── My Tasks
└── Tasks
```

---

## 🗄️ Database

The application uses **MySQL** as the relational database.

The database stores information related to:

* Users
* Teams
* Projects
* Tasks
* Team members
* Project assignments
* Task assignments

Spring Data JPA and Hibernate are used to communicate between the Spring Boot application and MySQL database.

---

## 🔗 REST API

The backend exposes RESTful APIs for communication between the React frontend and Spring Boot backend.

Example API operations:

```text
POST    /auth/register
POST    /auth/login

GET     /users
GET     /teams
POST    /teams

GET     /projects
POST    /projects

GET     /tasks
POST    /tasks
PUT     /tasks/{id}
DELETE  /tasks/{id}
```

> API endpoints may vary based on the final backend implementation.

---

## 🔒 Security

Teamora implements multiple security mechanisms:

* JWT-based authentication
* Password encryption
* Spring Security
* Role-based authorization
* Protected REST APIs
* Authentication token validation
* Restricted admin functionality

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

* Java JDK
* Node.js
* npm
* MySQL
* Git

---

### Backend Setup

Clone the repository:

```bash
git clone <your-github-repository-url>
```

Navigate to the backend:

```bash
cd Teamora-Backend
```

Configure MySQL in:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/teamora
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

---

### Frontend Setup

Navigate to the frontend:

```bash
cd Teamora-Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application can then be accessed through the local development URL shown by Vite.

---

## 🧪 Testing

The REST APIs can be tested using **Postman**.

Testing includes:

* User registration
* User login
* JWT authentication
* Admin authorization
* CRUD operations
* Team management
* Project management
* Task management

---

## 📸 Screenshots

Add screenshots of your application here.

### Login Page

```text
Add Login Screenshot
```

### Admin Dashboard

```text
Add Admin Dashboard Screenshot
```

### Team Management

```text
Add Team Management Screenshot
```

### Project Management

```text
Add Project Screenshot
```

### Task Management

```text
Add Task Screenshot
```

---

## 🔮 Future Enhancements

The following features can be added in future versions:

* Real-time team communication
* Email notifications
* Task deadline reminders
* File and document sharing
* Task comments
* Advanced analytics and reports
* Drag-and-drop task management
* Activity history
* Mobile application
* WebSocket-based real-time updates
* Docker deployment
* Cloud deployment

---

## 📈 Advantages

* Centralized team management
* Secure authentication
* Role-based access control
* Easy task assignment
* Improved team collaboration
* Better project tracking
* Structured data management
* Scalable full-stack architecture

---

## 👨‍💻 Developer

**Haris Prabu**

B.Tech – Computer Science

### Technologies

`React.js` • `Java` • `Spring Boot` • `Spring Security` • `JWT` • `MySQL` • `REST API`

---

## 📄 License

This project is developed for **educational and academic purposes**.
