# Full-Stack User Management System (CRUD REST API)

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21_LTS-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Render](https://img.shields.io/badge/Render-Backend-black?logo=render&logoColor=white)](https://render.com/)
[![TiDB Cloud](https://img.shields.io/badge/TiDB_Cloud-MySQL_8-0052CC)](https://tidbcloud.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel&logoColor=white)](https://vercel.com/)

A modern, production-ready Full-Stack User Management application built with a **Spring Boot** RESTful API backend, a **React + Vite** single-page frontend, containerized with **Docker**, backed by an external managed **TiDB Cloud MySQL** database, and deployed publicly across **Render** and **Vercel**.

---

## Live Demo URLs

- **Frontend Application (Vercel)**: `[Deploying on Vercel - see instructions below]`
- **Backend REST API (Render)**: [https://crud-app-iqyc.onrender.com](https://crud-app-iqyc.onrender.com)
- **Backend Health Check**: [https://crud-app-iqyc.onrender.com/api/health](https://crud-app-iqyc.onrender.com/api/health)
- **API Base Endpoint**: [https://crud-app-iqyc.onrender.com/api/users](https://crud-app-iqyc.onrender.com/api/users)

---

## Architecture Diagram

```mermaid
flowchart LR
    subgraph Client ["Client Layer"]
        Browser["User Browser"]
    end

    subgraph FrontendHosting ["Vercel Hosting"]
        ReactApp["React 19 + Vite SPA\n(Client-Side Application)"]
    end

    subgraph BackendHosting ["Render Cloud Platform"]
        DockerContainer["Docker Container (Java 21 JRE)\nSpring Boot 3.5 Backend\nEmbedded Tomcat (:10000)"]
        Cors["CORS Config\n(Allows Vercel Domain)"]
        Health["Health Endpoint\n(/api/health)"]
    end

    subgraph DatabaseCloud ["External Database Layer"]
        TiDB["TiDB Cloud Serverless\n(MySQL 8 Wire-Compatible)"]
    end

    Browser -->|HTTPS Request| ReactApp
    ReactApp -->|REST API Calls (Axios)| DockerContainer
    DockerContainer --> Cors
    DockerContainer --> Health
    DockerContainer -->|JDBC TLS Connection (Port 4000)| TiDB
```

---

## Technology Stack

### Backend
- **Java 21 LTS**: Modern LTS language features and runtime performance.
- **Spring Boot 3.5.x**: RESTful web services, dependency injection, and auto-configuration.
- **Spring Data JPA & Hibernate 6**: Object-Relational Mapping (ORM) and repository abstractions.
- **MySQL Connector/J 9.x**: High-performance JDBC driver.
- **Docker**: Multi-stage production container build (Maven compile stage + minimal Temurin JRE runtime).

### Frontend
- **React 19**: Modern component-based UI library.
- **Vite 8**: Fast ESM build tooling and development server.
- **Axios**: HTTP client configured with environment-based dynamic base URLs.
- **CSS3**: Clean, responsive layout with mobile and desktop support.

### Cloud Infrastructure
- **Vercel**: Edge-distributed static hosting for the React SPA.
- **Render**: Containerized Web Service running the Docker backend.
- **TiDB Cloud Serverless**: Fully managed, auto-scaling MySQL 8 cloud database with persistent storage.

---

## REST API Specification

| HTTP Method | Endpoint | Description | Request Body | Response Status |
|---|---|---|---|---|
| `GET` | `/api/health` | Service health status | None | `200 OK` |
| `GET` | `/api/users` | Retrieve all users | None | `200 OK` |
| `GET` | `/api/users/{id}` | Retrieve user by ID | None | `200 OK` / `404 Not Found` |
| `POST` | `/api/users` | Create a new user | JSON (`User`) | `200 OK` |
| `PUT` | `/api/users/{id}` | Update existing user | JSON (`User`) | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/users/{id}` | Delete user by ID | None | `200 OK` |

### Sample JSON Payloads

#### Create / Update User (`POST` / `PUT`)
```json
{
  "name": "Apurva Chothe",
  "email": "apurva.chothe@example.com",
  "department": "Engineering",
  "salary": 95000.0
}
```

#### User Response
```json
{
  "id": 1,
  "name": "Apurva Chothe",
  "email": "apurva.chothe@example.com",
  "department": "Engineering",
  "salary": 95000.0
}
```

---

## Environment Variables

### Backend (Render / Local)

| Variable | Required | Default / Example | Purpose |
|---|---|---|---|
| `PORT` | Auto (Render) | `8080` | Dynamic HTTP port binding |
| `SPRING_DATASOURCE_URL` | Yes (Cloud) | `jdbc:mysql://localhost:3306/crud_db...` | Cloud MySQL connection string |
| `SPRING_DATASOURCE_USERNAME` | Yes (Cloud) | `root` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Yes (Cloud) | `""` | Database password |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:5173,https://*.vercel.app` | Allowed origins for CORS |

### Frontend (Vercel / Local)

| Variable | Environment | Example Value |
|---|---|---|
| `VITE_API_BASE_URL` | Development | `http://localhost:8080/api` |
| `VITE_API_BASE_URL` | Production (Vercel) | `https://crud-app-iqyc.onrender.com/api` |

---

## Local Development Setup

### Prerequisites
- JDK 21 installed (`java -version`)
- Maven 3.9+ installed (`mvn -version`)
- Node.js 18+ and npm installed (`node -v`)
- MySQL 8 service or Docker installed

### 1. Database Setup
Ensure MySQL is running on port 3306 with a database named `crud_db`, or execute the seed script:
```sql
-- See init-db.sql for schema and seed records
```

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd D:\CRUD_REST_API\crud

# Run using Maven
mvn clean spring-boot:run
```
The backend will start at `http://localhost:8080`.

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd D:\CRUD_REST_API\crud\frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will start at `http://localhost:5173`.

---

## Production Deployment Guide

### 1. Backend on Render (Docker)
1. Push project to GitHub (`git push origin main`).
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** &rarr; **Web Service** &rarr; connect repository.
4. Render auto-detects `Dockerfile` in the root.
5. Under **Environment Variables**, add:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<host>:4000/test?sslMode=VERIFY_IDENTITY`
   - `SPRING_DATASOURCE_USERNAME`: `<user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<password>`
6. Deploy the service.

### 2. Frontend on Vercel
1. Log into [Vercel](https://vercel.com) and click **Add New...** &rarr; **Project**.
2. Import the `crud-app` GitHub repository.
3. In Project Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(Important: click Edit and select `frontend`)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://crud-app-iqyc.onrender.com/api`
5. Click **Deploy**.
