# BrewGuard Cloud Deployment Guide

This document describes the deployment architecture and step-by-step process for deploying the BrewGuard full-stack application to the cloud.

---

## Architecture Overview

| Layer        | Technology              | Host                |
| ------------ | ----------------------- | ------------------- |
| Frontend     | React.js / Vite         | Vercel              |
| Backend      | ASP.NET Core 10 Web API | MonsterASP          |
| Database     | SQL Server              | MonsterASP WebMSSQL |
| File Storage | Cloudinary              | Cloudinary          |

```
User
  ↓
Vercel (React Frontend UI)
  ↓
MonsterASP (ASP.NET Backend API)
  ↓
MonsterASP SQL Server (Database)  &  Cloudinary (Media Storage)
```

---

## 1. Deploying the Frontend (React → Vercel)

### Step 1: Push Project to GitHub

Separate the React frontend into its own folder and push it to an independent GitHub repository so Vercel can track and build it separately from the backend.

```bash
git init
git add .
git commit -m "Initial commit of separated frontend"
git branch -M main
git remote add origin https://github.com/jeriel08/BrewGuard-UI.git
git push -u origin main
```

### Step 2: Import Project in Vercel

1. Go to [https://vercel.com](https://vercel.com) and click **Add New Project**.
2. Import the `BrewGuard-UI` GitHub repository.
3. Vercel automatically detects the framework as **Vite** and configures the standard build settings (`npm run build`).

### Step 3: Set Environment Variables

To allow the frontend to communicate with the live backend, configure the following in the Vercel Dashboard under **Settings → Environment Variables**:

```
VITE_API_BASE_URL=https://brewguard.runasp.net
```

> **Note:** Ensure there is no trailing slash at the end of the URL.

### Step 4: Fix SPA Routing (404 Error on Reload)

Because React is a Single Page Application (SPA), reloading a sub-page on Vercel causes a 404 error. Resolve this by creating a `vercel.json` file in the root of the React project:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 5: Deploy

Click **Deploy** in Vercel. Vercel will automatically:

- Install node modules
- Build the optimized production files
- Distribute the app via their global CDN

---

## 2. Deploying the Backend & Database (ASP.NET → MonsterASP)

### Step 1: Apply Database Migrations

Before publishing new code, the live database schema must be updated to match the local environment.

1. Generate an idempotent SQL script locally:

```bash
dotnet ef migrations script --idempotent --output update.sql
```

2. Connect to the MonsterASP database using **SQL Server Management Studio (SSMS)**.
3. Open a **New Query**, paste the contents of `update.sql`, and click **Execute**.

### Step 2: Configure CORS (Security)

To prevent the browser from blocking requests between the Vercel frontend and the MonsterASP backend, implement a Cross-Origin Resource Sharing (CORS) policy in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://your-vercel-project.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Applied before Authentication
app.UseCors("AllowVercel");
```

### Step 3: Clean and Publish Code

1. In Visual Studio, run **Clean Solution** and then **Rebuild Solution** to ensure no stale cached files are carried over.
2. Right-click the `BrewGuard.Server` project and select **Publish**.
3. Push the compiled API directly to the MonsterASP hosting environment.

---

## 3. Configuring Cloudinary for File Storage

To prevent the MonsterASP server from running out of storage space, all media (e.g., coffee bean photos, user avatars) is offloaded to Cloudinary.

### Step 1: Install the SDK

Install the required package into the ASP.NET Core project:

```bash
dotnet add package CloudinaryDotNet
```

### Step 2: Secure the Credentials & Environment Variables

To adhere to security best practices, sensitive keys (like database passwords, JWT secrets, and Cloudinary API keys) are never hardcoded into the source code or pushed to the public repository. We use a two-tiered configuration system for local development and production.

#### 1. The Configuration Template (`appsettings.json`)

The main `appsettings.json` file is pushed to GitHub as a "template." It shows the exact structure of the required variables, but all real passwords are replaced with placeholder text (e.g., `"Secret": "YOUR_JWT_SECRET_HERE"`).

#### 2. Local Development (`appsettings.Development.json`)

For local testing, real keys are stored in `appsettings.Development.json`. This file is strictly excluded from version control using a `.gitignore` rule (`**/appsettings.Development.json`), ensuring local secrets never touch the GitHub repository.

#### 3. Production Environment (MonsterASP)

In the live production environment, the ASP.NET Core backend is configured to read from the server's Environment Variables, which securely override the placeholder text in `appsettings.json`.

These are configured in the **MonsterASP Control Panel** under **Website → Scripting → Environment Variables**. Because the JSON structure is nested, we use a double underscore (`__`) to map the variables correctly:

- **Database:**
  - `ConnectionStrings__DefaultConnection`
- **Authentication (JWT):** _(Requires a 64+ character SHA-512 hash)_
  - `JwtSettings__Secret`
  - `JwtSettings__Issuer`
  - `JwtSettings__Audience`
- **File Storage (Cloudinary):**
  - `CloudinarySettings__CloudName`
  - `CloudinarySettings__ApiKey`
  - `CloudinarySettings__ApiSecret`
- **Email Service (SMTP):**
  - `EmailSettings__Server`
  - `EmailSettings__Port`
  - `EmailSettings__SenderName`
  - `EmailSettings__SenderEmail`
  - `EmailSettings__Password`

---

## 4. Local Development Setup (For Team Members)

To run this decoupled architecture locally, follow the steps below.

### Backend Setup

1. Clone the main repository containing the ASP.NET API.
2. Update `appsettings.Development.json` with your local SQL Server connection string.
3. Run the database update command in the **Package Manager Console**:
   ```
   Update-Database
   ```
4. Run the project in Visual Studio (it will typically start on `https://localhost:7001` or similar).

### Frontend Setup

1. Clone the separate `BrewGuard-UI` repository.
2. Run `npm install` to grab dependencies.
3. Create a `.env` file in the root directory and point it to your local backend:
   ```
   VITE_API_BASE_URL=https://localhost:7001
   ```
4. Run `npm run dev` to start the Vite development server.
