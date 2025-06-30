# TranscendUp - Comprehensive Personal Development Platform

## Overview

TranscendUp is a comprehensive personal development platform that gamifies growth through an interactive map system, personal journal, objectives tracking, community chat, and XP progression. The platform features level-based progression, loot boxes, community interaction, and a complete settings system for personalization.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and bundling
- **Charts**: Chart.js for progress visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: OpenID Connect with Replit Auth integration
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with structured error handling

### Database Architecture
- **Primary Database**: PostgreSQL via Neon (serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling via @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Security**: HTTP-only cookies, CSRF protection, secure session handling

### Goal Management
- **Categories**: Fitness, learning, reading, mindfulness, productivity, social
- **Tracking**: Progress tracking with target values and current progress
- **Frequency**: Daily, weekly, monthly goal frequencies
- **Completion**: Automatic completion detection and XP rewards

### Gamification Engine
- **Levels**: XP-based leveling system (200 XP per level)
- **Achievements**: Category-based achievement system with XP rewards
- **Streaks**: Daily streak tracking for consistency motivation
- **Progress Visualization**: Charts and progress maps for user engagement

### Community Features
- **Posts**: User-generated content sharing
- **Interactions**: Like and reply system for community engagement
- **Social Proof**: Public achievement sharing and goal inspiration

### Data Analytics
- **Progress Tracking**: Daily XP accumulation and goal completion rates
- **Streak Analytics**: Current and longest streak monitoring
- **Achievement Progress**: Automated achievement checking and awarding

## Data Flow

1. **User Authentication**: Users authenticate via Replit OAuth → Session created → User profile loaded
2. **Goal Creation**: User creates goal → Validated → Stored in database → Displayed in dashboard
3. **Progress Logging**: User logs progress → XP calculated → Streak updated → Achievements checked
4. **Community Interaction**: User creates post → Stored → Displayed to community → Interactions tracked
5. **Real-time Updates**: All data changes trigger React Query cache invalidation for immediate UI updates

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Auth**: OpenID Connect authentication provider
- **Replit Hosting**: Application deployment and environment management

### Key Libraries
- **@neondatabase/serverless**: PostgreSQL connection and pooling
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **passport & openid-client**: Authentication handling
- **chart.js**: Data visualization for progress tracking

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the full stack
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon database connection via environment variables
- **Authentication**: Replit Auth integration for development

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Deployment**: Single-command deployment via `npm start`
- **Static Assets**: Served directly by Express in production

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Session encryption key (required)
- **REPL_ID**: Replit application identifier
- **ISSUER_URL**: OAuth issuer endpoint

### Performance Optimizations
- **Database**: Connection pooling and prepared statements
- **Frontend**: Code splitting and lazy loading
- **Caching**: React Query provides aggressive client-side caching
- **Assets**: Optimized builds with tree shaking and minification

## Changelog

Changelog:
- June 28, 2025. Initial setup with comprehensive TranscendUp platform
- June 28, 2025. Implemented advanced authentication system with session optimization
- June 28, 2025. Extended schema with journal, settings, loot boxes, and community features
- June 28, 2025. Optimized login flow to prevent multiple window issues
- June 28, 2025. Completed backend implementation for all TranscendUp features

## Recent Issues

- OAuth authentication errors still occurring with "authorization response from the server is an error"
- Need to resolve authentication flow for seamless user login experience

## Recent Enhancements (June 28, 2025)

✅ **Complete Gamification System Implemented:**
- Added 50+ new nivele și titluri deblocabile
- Implementat sistem complet de Daily Quests cu reward-uri XP
- Creat sistem extins de Badge-uri cu rarități (common, rare, epic, legendary)
- Adăugat componente interactive pentru XP Rewards și Quick Actions
- Optimizat navigația mobilă cu acces complet la Settings și toate funcționalitățile

✅ **Extended Database Schema:**
- Titles system cu unlock-uri bazate pe nivel și achievements
- Daily Quests cu progress tracking și XP rewards
- Badge system cu categorii și rarități multiple
- User rewards și loot box extensions
- Comprehensive relations și type safety

✅ **Enhanced User Interaction:**
- Toate butoanele sunt acum funcționale
- Multiple modalități de a acumula XP (daily login, goals, quests, social)
- Sistem complet de progres cu visual feedback
- Mobile-first design cu navigație optimizată în două rânduri
- Interactive dashboard cu toate componentele gamificate

✅ **Mobile Optimization:**
- Navigație mobilă cu 8 secțiuni (Home, Map, Goals, Journal, Community, Progress, Achievements, Settings)
- Layout responsive cu grid în două rânduri pentru mobile
- Acces complet la setări și toate funcționalitățile pe mobile
- Optimizări pentru touch interfaces

## User Preferences

Preferred communication style: Simple, everyday language.
Mobile version prioritization: All functions accessible, optimized navigation.
Gamification focus: Many levels, achievements, unlockables, interactive XP system.