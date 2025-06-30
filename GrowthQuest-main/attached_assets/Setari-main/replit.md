# Overview

This is a full-stack web application built with a modern React frontend and Express.js backend. The application appears to be a user settings management system with comprehensive configuration options including preferences for language, notifications, themes, audio settings, privacy controls, and backup features.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with React plugin

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL storage

## Development Environment
- **Platform**: Replit with autoscale deployment
- **Database**: PostgreSQL 16 module
- **Package Manager**: npm

# Key Components

## Database Schema
The application uses two main tables:
- **users**: Core user data with id, username, password, email, level, xp, and timestamps
- **user_settings**: Comprehensive user preferences including language, notifications, theme, audio, privacy, and backup settings

## API Endpoints
- `GET /api/user/:id/settings` - Retrieve user settings
- `PUT /api/user/:id/settings` - Update user settings
- `GET /api/user/:id` - Get user profile

## Frontend Pages
- **Settings Page**: Main interface for managing all user preferences
- **404 Page**: Error handling for undefined routes

## UI Components
Extensive component library including:
- Form controls (switches, sliders, selects)
- Layout components (cards, dialogs, sheets)
- Navigation and feedback components
- Custom confirmation modal for destructive actions

# Data Flow

1. **Client Request**: Frontend makes API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and validate data with Zod schemas
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response**: JSON data returned to client
5. **UI Updates**: React components re-render based on updated state

The application uses optimistic updates and proper error handling with toast notifications.

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **connect-pg-simple**: PostgreSQL session store

## UI/UX
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **date-fns**: Date manipulation utilities

## Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Production bundling for server code

# Deployment Strategy

## Development
- Runs on port 5000 with Vite dev server
- Hot module replacement for rapid development
- PostgreSQL database automatically provisioned

## Production
- **Build Process**: 
  - Frontend: Vite builds static assets to `dist/public`
  - Backend: ESBuild bundles server code to `dist/index.js`
- **Deployment**: Replit autoscale with external port 80
- **Environment**: Production Node.js with built assets

## Database
- Uses `DATABASE_URL` environment variable
- Drizzle migrations in `./migrations` directory
- Push schema changes with `npm run db:push`

# Changelog

- June 24, 2025: Initial setup
- June 24, 2025: Created focused settings page with basic options separate from main menu features
  - Language selection (Romanian, English, French, Spanish)
  - Notifications and daily reminders with time picker
  - Theme selection (Light, Dark, Auto)
  - Sound controls with volume slider
  - Privacy mode toggle
  - Time format and calendar settings
  - Auto-save functionality

# User Preferences

Preferred communication style: Simple, everyday language.
Architecture preference: Separate complex features from basic settings - settings page should only contain fundamental app preferences, not advanced functionality.