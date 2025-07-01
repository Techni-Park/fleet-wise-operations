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
- **2024-12-25**: Connected to remote MySQL database (85.31.239.121:3306)
- **2024-12-25**: Configured access to gestinter_test database with 73 tables
- **2024-12-25**: Created database test interface and real data visualization
- **2024-12-25**: Implemented API endpoints for MACHINE_MNT, CONTACT, and ANOMALIE tables
- **2024-12-25**: Connected Interventions page to real INTERVENTION table in MySQL database
- **2024-12-25**: Updated Drizzle schema to match exact INTERVENTION table structure
- **2024-12-25**: Implemented real-time intervention data loading with status mapping
- **2024-12-25**: Connected Vehicles page to MACHINE_MNT linked to VEHICULE tables with combined data display
- **2024-12-25**: Updated Drizzle schema to match exact MACHINE_MNT and VEHICULE table structures
- **2024-12-25**: Implemented JOIN query to combine vehicle and machine data in a single interface
- **2024-12-25**: Created complete Clients page with CONTACT table integration and CRUD operations
- **2024-12-25**: Implemented client details with tabs for interventions history, vehicles, contracts, documents, and alerts
- **2024-12-25**: Added client creation and editing forms with comprehensive contact management

## Database Configuration
The application is now connected to a remote MySQL database:
- `DB_HOST`: 85.31.239.121
- `DB_PORT`: 3306
- `DB_USERNAME`: tp_admin
- `DB_PASSWORD`: Techn1p@rk04
- `DB_DATABASE`: gestinter_test

The database contains 73 tables including MACHINE_MNT, CONTACT, ANOMALIE, ACTION, INGREDIENT, PRODUIT, SOCIETE, USER, VEHICULE, and DOCUMENT.

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