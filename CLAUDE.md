# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs on http://localhost:3000)
- **Build**: `npm run build` 
- **Production start**: `npm start`
- **Lint**: `npm run lint`

## Architecture Overview

This is a Next.js 15 application using the App Router with TypeScript, built on the Alchemi template. The stack includes:

- **Frontend**: Next.js with React 18, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives (New York style)
- **Backend**: Supabase for authentication and database
- **Styling**: Tailwind CSS with CSS variables, dark/light theme support
- **State**: Server Actions for form handling, next-themes for theme management

### Key Directory Structure

- `src/app/` - App Router pages and layouts
  - `(auth-pages)/` - Authentication pages (sign-in, sign-up, forgot-password)
  - `protected/` - Protected routes requiring authentication
  - `instruments/` - Example data page demonstrating Supabase queries
- `src/components/` - React components
  - `ui/` - shadcn/ui components
- `src/actions/` - Server Actions for authentication flows
- `src/utils/supabase/` - Supabase client configurations (client, server, middleware)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Shared utilities

### Authentication Flow

Authentication is handled through Supabase with server actions:
- Sign up/in forms use server actions in `src/actions/auth.ts`
- Protected routes check authentication via middleware
- Environment variables required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Component System

Uses shadcn/ui configuration:
- Import alias `@/components/ui` for UI components  
- Import alias `@/lib/utils` for utilities
- All components follow the New York style variant
- CSS variables enabled for theming
- Lucide React for icons

### Supabase Integration

- Client-side: `createClient()` from `@/utils/supabase/client`
- Server-side: `createClient()` from `@/utils/supabase/server`  
- Middleware integration for auth state management
- Environment check utility warns if Supabase vars missing

## Styling and CSS Methodology

- **Current Approach**: Tailwind CSS with CSS variables, leveraging shadcn/ui. Classes are utility-first.
- **Future Plan**: Integrate BEM (Block-Element-Modifier) principles where custom components require more structured, reusable CSS, especially for component-specific styling that goes beyond Tailwind's utility classes. This will be achieved using CSS custom properties for theming and consistency.

## Security, Privacy, and Accessibility Guidelines

- **Security**: Focus on secure coding practices, input validation, and proper authentication/authorization (custom implemented).
- **Privacy**: Adhere to data privacy principles; minimize data collection, ensure data encryption at rest and in transit.
- **Accessibility**: Implement WCAG guidelines; ensure keyboard navigation, proper ARIA attributes, and semantic HTML.

## Deployment Notes

- HTTPS/TLS configuration is handled at the deployment infrastructure level (e.g., Vercel).