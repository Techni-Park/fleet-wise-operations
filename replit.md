# Fleet Management System

## Overview

This is a full-stack fleet management application built with React frontend and Express backend. The system allows users to manage vehicles, interventions, alerts, planning, reports, and user management for a fleet of vehicles. The application is designed to track vehicle maintenance, monitor compliance, and provide comprehensive reporting capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: React Router for client-side navigation
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development Server**: tsx for TypeScript execution
- **Production Build**: esbuild for server-side bundling

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Centralized schema definition in shared directory
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Frontend Structure
- **Pages**: Complete application views (Vehicles, Interventions, Planning, etc.)
- **Components**: Reusable UI components organized by feature
- **Layout**: Navigation and Header components for consistent app structure
- **UI Library**: Comprehensive shadcn/ui component system

### Backend Structure
- **Routes**: API endpoint definitions with Express routing
- **Storage**: Abstract storage interface with in-memory implementation
- **Vite Integration**: Development-only Vite middleware for hot reloading

### Shared Resources
- **Schema**: Database schema definitions using Drizzle ORM
- **Types**: TypeScript interfaces shared between frontend and backend

## Data Flow

1. **Client Requests**: React components make API calls through TanStack Query
2. **API Processing**: Express server processes requests through defined routes
3. **Data Access**: Storage layer abstracts database operations
4. **Response**: JSON responses sent back to client
5. **State Updates**: TanStack Query manages cache invalidation and updates

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS processing
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation
- **Carousel**: Embla Carousel for image galleries

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution

### Development Tools
- **Replit Integration**: Runtime error overlay and cartographer for development
- **TypeScript**: Full type safety across the stack
- **Path Aliases**: Configured for clean imports

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Port Configuration**: Application runs on port 5000
- **Hot Reloading**: Vite development server with HMR
- **Error Handling**: Runtime error modal for development debugging

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server to `dist/index.js`
- **Static Assets**: Express serves built frontend assets
- **Database**: PostgreSQL connection via environment variables

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Development**: `npm run dev` with auto-restart

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```