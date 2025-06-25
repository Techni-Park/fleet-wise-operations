# Fleet Management System

## Overview
Fleet management application built with React/TypeScript frontend and Express/Node.js backend, migrated from Lovable to Replit. The system includes vehicle tracking, intervention management, alerts, planning, user management, and reporting features.

## Project Architecture
- **Frontend**: React with TypeScript, Vite build system
- **Backend**: Express.js with TypeScript
- **Database**: MySQL with Drizzle ORM
- **UI Components**: Custom components with Tailwind CSS and Lucide icons
- **State Management**: TanStack Query for server state

## Recent Changes
- **2024-12-25**: Migrated from Lovable to Replit environment
- **2024-12-25**: Configured MySQL database integration with Drizzle ORM
- **2024-12-25**: Added comprehensive schema for vehicles, interventions, alerts, and users
- **2024-12-25**: Implemented REST API endpoints for all entities
- **2024-12-25**: Updated storage layer to use MySQL instead of in-memory storage
- **2024-12-25**: Implemented complete database schema with all tables from client's MySQL structure
- **2024-12-25**: Added support for: ACTION, ANOMALIE, CONTACT, INGREDIENT, MACHINE_MNT, PRODUIT, SOCIETE, USER, VEHICULE, DOCUMENT tables
- **2024-12-25**: Created comprehensive API endpoints for all database entities
- **2024-12-25**: Added DOCUMENT table schema matching existing MySQL structure
- **2024-12-25**: Fixed Drizzle ORM configuration with proper mode setting
- **2024-12-25**: Completed project migration - application ready for use
- **2024-12-25**: Implemented responsive design with mobile-friendly UI transitions
- **2024-12-25**: Added mobile navigation with hamburger menu and overlay
- **2024-12-25**: Created responsive layout components (AppLayout, Header, Navigation)
- **2024-12-25**: Optimized dashboard cards and tables for mobile devices
- **2024-12-25**: Added touch-friendly interactions and animations
- **2024-12-25**: Implemented mobile-first responsive breakpoints throughout the app

## Database Configuration
The application now uses MySQL with the following environment variables:
- `DB_HOST`: MySQL host (default: localhost)
- `DB_PORT`: MySQL port (default: 3306)
- `DB_USER`: MySQL username (default: root)
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name (default: fleet_management)

## User Preferences
- Language: French
- Prefers comprehensive solutions over iterative updates
- Wants real database integration (MySQL) over mock data

## Tech Stack
- React 18 with TypeScript
- Express.js backend
- MySQL database with Drizzle ORM
- Vite for development and build
- TanStack Query for data fetching
- Tailwind CSS for styling
- Lucide React for icons