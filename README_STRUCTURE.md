# Signage Backend Structure

I have set up a professional, modular, and optimized folder structure for your Fastify backend.

### Folder Structure
- **`src/config/`**: Handles environment variables and global configurations using Zod for validation.
- **`src/plugins/`**: Custom Fastify plugins. I've already added a **Prisma** plugin to handle database connections.
- **`src/modules/`**: Modular architecture where each feature (like `user`) has its own:
  - `*.routes.ts`: API endpoints definition.
  - `*.controller.ts`: Request handling logic.
  - `*.service.ts`: Business logic and Database interactions.
  - `*.schema.ts`: Zod schemas for request validation and type safety.
- **`src/middlewares/`**: For Fastify hooks (e.g., authentication, logging).
- **`src/utils/`**: Helper functions and common utilities (e.g., standardized response formatter).
- **`src/app.ts`**: Main application setup and plugin/route registration.
- **`src/server.ts`**: Entry point to start the server.

### Key Features Added
1.  **Zod Validation**: Automated request body validation for routes.
2.  **Type Safety**: Full TypeScript support with Prisma and Zod.
3.  **Environment Safety**: The app won't start if required environment variables (like `DATABASE_URL` or `JWT_SECRET`) are missing or invalid.
4.  **Standardized Responses**: Using `successResponse` and `errorResponse` utilities.
5.  **Prisma Integration**: Database is pre-configured and injected into the Fastify instance as `app.prisma`.

### How to Run
1.  Ensure your `.env` has the correct `DATABASE_URL`.
2.  Run `npm run dev` to start the development server with auto-reload.
