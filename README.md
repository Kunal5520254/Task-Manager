# Team Task Manager

A full-stack Team Task Manager application built with Next.js, Prisma, and PostgreSQL. It features a beautiful, glassmorphic UI with role-based access control (Admin/Member).

## Features
- **Authentication**: JWT-based auth via cookies. First registered user is automatically assigned the `ADMIN` role.
- **Projects**: Admins can create new projects.
- **Tasks**: Admins can create tasks within projects, assign them to members, and set due dates.
- **Dashboard**: All users have a personal dashboard showing their assigned tasks and current statuses.
- **Task Board**: Dynamic columns (To Do, In Progress, Done) for every project.
- **Modern UI**: Stunning, responsive glassmorphic interface with vibrant colors.

## Tech Stack
- **Frontend & Backend**: Next.js (App Router)
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Styling**: Vanilla CSS (CSS Modules) without TailwindCSS.

## Railway Deployment Instructions

To deploy this application seamlessly on Railway, follow these steps:

1. **Push to GitHub**: Initialize a Git repository and push this code to a public or private GitHub repository.
2. **Create Railway Project**: Go to [Railway](https://railway.app/), click "New Project", and choose "Deploy from GitHub repo".
3. **Select Repo**: Choose the repository you just created.
4. **Add PostgreSQL Database**: Once the Next.js service is created, click "New", select "Database", and choose "Add PostgreSQL".
5. **Set Environment Variables**:
   Go to your Next.js service -> Variables -> New Variable:
   - Variable Name: `DATABASE_URL`
   - Value: Click the magic wand icon (Reference Variable) and select the `DATABASE_URL` from your newly created Postgres database.
   - Variable Name: `JWT_SECRET`
   - Value: Enter any random secure string (e.g. `my-super-secret-key-12345`).
6. **Configure Build Command**:
   Go to your Next.js service -> Settings -> Build Command.
   Enter: `npx prisma migrate deploy && next build`
   *(This ensures the Postgres database tables are created before the app builds)*
7. **Deploy**: Railway will automatically build and deploy. Once finished, go to Settings -> Networking -> **Generate Domain** to get your live URL!

## Local Development
If you want to run this locally:
1. Ensure you have a local PostgreSQL database running.
2. Create a `.env` file and add your `DATABASE_URL`.
3. Run `npx prisma migrate dev` to push the schema to your local database.
4. Run `npm run dev` and open `http://localhost:3000`.
