# Authormaton

A modern web application for authors to manage and organize their writing projects. Built with Next.js, Prisma, and PostgreSQL, Authormaton provides a clean interface for creating, editing, and tracking various types of writing projects including posts, articles, ebooks, and scripts.

## Features

- **User Authentication**: Secure sign-up and sign-in functionality
- **Project Management**: Create, read, update, and delete writing projects
- **Project Types**: Support for posts, articles, ebooks, and scripts
- **Responsive Design**: Modern UI built with Radix UI and Tailwind CSS
- **Type Safety**: Full TypeScript support with Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **Session Management**: Secure session handling with iron-session

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: iron-session with bcryptjs
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React, React Icons

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun
- PostgreSQL database

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Authormaton/authormaton.git
   cd authormaton
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up your environment variables. Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/authormaton"
   AUTH_SECRET="your-super-secret-key-at-least-32-characters-long"
   APP_ENV="development"
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:migrate` - Run Prisma migrations

## Project Structure

```
src/
├── actions/           # Server actions for auth and projects
├── app/              # Next.js app router pages and layouts
├── components/       # Reusable UI components
│   ├── common/       # Shared components (tables, forms, etc.)
│   ├── layouts/      # Layout components
│   ├── models/       # Feature-specific components
│   └── ui/           # Base UI components (shadcn/ui)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
└── middleware.ts     # Next.js middleware for auth

prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations

public/               # Static assets
```

## Database Schema

The application uses the following main models:

- **User**: Stores user information, authentication, and role
- **Project**: Writing projects with types (post, article, ebook, script)

## Authentication

Authormaton uses session-based authentication with iron-session. User passwords are hashed using bcryptjs.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
