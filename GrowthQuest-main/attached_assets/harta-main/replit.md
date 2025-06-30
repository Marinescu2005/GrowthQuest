# Replit Configuration

## Overview

This is a gamified learning application built with React, Express, and PostgreSQL. The app features a map-based progression system where users complete levels, earn XP, and collect cards as rewards. The application uses a modern tech stack with TypeScript, Drizzle ORM for database management, and shadcn/ui for the frontend components.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** for server state management and API calls
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens

### Backend Architecture
- **Express.js** with TypeScript for the REST API server
- **Node.js 20** runtime environment
- **ESM modules** throughout the application
- RESTful API design with proper error handling and logging middleware

### Database Layer
- **PostgreSQL 16** as the primary database
- **Drizzle ORM** for type-safe database operations and schema management
- **Neon Database** serverless PostgreSQL hosting (@neondatabase/serverless)
- Database migrations managed through Drizzle Kit

## Key Components

### Data Models
The application uses a relational database schema with the following main entities:
- **Users**: Store user credentials and progress statistics (XP, level, card count)
- **Regions**: Themed areas of the map with level ranges and unlock requirements
- **Levels**: Individual challenges with XP rewards and special types (boss, reward levels)
- **Cards**: Collectible items with rarity tiers and unlock requirements
- **User Progress**: Tracks completion status for each user-level combination
- **User Cards**: Junction table for user card collections

### Frontend Components
- **Map System**: Interactive level progression with visual states
- **Level Nodes**: Clickable level indicators with completion states
- **Reward Modal**: Card collection interface with animations
- **Progress Tracking**: Real-time XP and completion statistics

### API Endpoints
- `GET /api/user/:id` - Fetch user profile with progress
- `GET /api/regions/:userId` - Get regions with user-specific progress
- `POST /api/progress` - Complete a level and update progress
- `GET /api/rewards/:userId` - Fetch available card rewards

## Data Flow

1. **User Authentication**: Users are identified by ID (authentication system appears to be planned)
2. **Progress Loading**: Frontend fetches user data and region progress on map load
3. **Level Completion**: Users complete levels, triggering XP updates and potential card rewards
4. **Real-time Updates**: TanStack Query manages cache invalidation for immediate UI updates
5. **Reward Collection**: Modal system allows users to collect earned cards

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database toolkit
- Connection managed via `DATABASE_URL` environment variable

### UI Framework
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast development and build tooling
- **ESBuild**: Production bundling for the server

## Deployment Strategy

### Development Environment
- **Replit**: Cloud-based development with automatic PostgreSQL provisioning
- **Hot Reload**: Vite dev server with HMR for frontend, tsx for backend auto-reload
- **Port Configuration**: Frontend serves on port 5000, backend integrates via Vite proxy

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets in production
- **Autoscale Deployment**: Configured for Replit's autoscale hosting

### Build Commands
- `npm run dev`: Development mode with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server startup
- `npm run db:push`: Database schema deployment

## Changelog

Changelog:
- June 24, 2025. Initial setup
- June 24, 2025. Added personal development objectives for all 100 levels with progressive difficulty
- June 24, 2025. Enhanced visual design with vibrant colors and clear element distinction
- June 24, 2025. Implemented XP rewards based on difficulty and region (50-600 XP per level)
- June 25, 2025. Reverted to minimalist circular design for level nodes while maintaining reward indicators
- June 25, 2025. Optimized interface for mobile with responsive design, proper centering, and touch-friendly interactions
- June 25, 2025. Fixed map duplication issue by consolidating render structure and eliminating redundant components
- June 25, 2025. Created single unified map component to completely eliminate duplication issues
- June 25, 2025. Redesigned interface with Duolingo-inspired layout: vertical level path, section headers, mascot, and bottom navigation

## User Preferences

Preferred communication style: Simple, everyday language.
Application focus: Only map module with essential features - no dashboard, no additional navigation.
Simplified interface: Direct access to map functionality without extra options or menus.
Personal development focus: Each level has specific objectives with progressive difficulty and timeframes.
Enhanced design: Vibrant colors, clear element distinction, and detailed visual hierarchy in minimalist style.
Design preference: Duolingo-inspired vertical level path with alternating node positions, section headers, and gamified elements while maintaining TranscendUp's personal development focus.
Mobile optimization: Responsive design with proper centering and touch-friendly interactions for full mobile experience.