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
- **2024-12-25**: Added DOCUMENT table schema matching existing MySQL structure
- **2024-12-25**: Fixed Drizzle ORM configuration with proper mode setting
- **2024-12-25**: Completed project migration - application ready for use

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