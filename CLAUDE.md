# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native mobile application built with Expo and expo-router for file-based navigation. Uses Bun as the package manager.

## Development Commands

### Running the App
- `bun start` - Start Expo development server
- `bun ios` - Run on iOS simulator (requires Xcode)
- `bun android` - Run on Android emulator (requires Android Studio)
- `bun web` - Run web version in browser

### Code Quality
- `bun lint` - Run ESLint and Prettier checks
- `bun format` - Auto-fix ESLint issues and format code with Prettier

### Building Native Apps
After making native changes (dependencies, app.json), rebuild with:
- `npx expo prebuild` - Generate iOS and Android native projects

## Architecture

### File-Based Routing (Expo Router)
Routes are defined by the file structure in `/app`:
- `/app/index.tsx` - Home screen (/)
- `/app/details.tsx` - Details screen (/details)
- `/app/_layout.tsx` - Root layout with Stack navigator
- `/app/+not-found.tsx` - 404 fallback
- `/app/+html.tsx` - Web-specific HTML wrapper

**Navigation**: Use `Link` component with `href` prop or `router.push()` from `expo-router`:
```tsx
<Link href={{ pathname: '/details', params: { name: 'value' } }} />
```

**Route Parameters**: Access via `useLocalSearchParams()` hook:
```tsx
const { name } = useLocalSearchParams();
```

**Typed Routes**: Enabled via `experiments.typedRoutes` in app.json for type-safe navigation.

### API Routes

API endpoints are defined in `/app/api/` using the `+api.ts` suffix:
- `/app/api/graphql+api.ts` - GraphQL endpoint at `/api/graphql`

**GraphQL API** (using graphql-yoga):
- **Endpoint**: `http://localhost:8081/api/graphql`
- **GraphiQL Interface**: Available in development for testing queries
- **Schema**: Site diary management with queries and mutations
  - `siteDiaries` - Get all site diaries
  - `siteDiary(id: String!)` - Get a specific site diary
  - `createSiteDiary(input: SiteDiaryInput!)` - Create a new site diary
- **Types**: `SiteDiary`, `Weather`, `SiteDiaryInput`
- **Data**: Mock data with 5 site diary entries stored in memory

**API Route Pattern**: Export `GET`, `POST`, `OPTIONS` async functions that return `Promise<Response>`.

### Import Aliases
TypeScript path alias `@/*` maps to project root:
```tsx
import { Button } from '@/components/Button';
```

### Component Organization
Reusable components live in `/components`:
- **Button.tsx** - Styled button with forwardRef for imperative access
- **Container.tsx** - SafeAreaView wrapper for screen layouts
- **ScreenContent.tsx** - Common screen template with title/children
- **EditScreenInfo.tsx** - Development helper component

**Pattern**: Components use `StyleSheet.create()` for styling and TypeScript for props.

### State Management
No global state management library is configured. Add React Context, Zustand, or Redux if needed for complex state.

### Styling
All styling uses React Native's `StyleSheet.create()`. No CSS-in-JS library is configured.

## Configuration Files

- **app.json** - Expo configuration (app name, bundle IDs, orientation, plugins)
- **tsconfig.json** - TypeScript config with strict mode and path aliases
- **eslint.config.js** - Flat config using expo preset, disables react/display-name
- **prettier.config.js** - Code formatting config
- **metro.config.js** - Metro bundler configuration
- **babel.config.js** - Babel transpilation config

## Platform-Specific Details

- **iOS**: Bundle ID `com.anthonybuildpass.codingtestmobile`, supports tablets
- **Android**: Package `com.anthonybuildpass.codingtestmobile`
- **Web**: Uses Metro bundler with static output

## Package Manager

This project uses **Bun** (v1.3.2). Always use `bun` instead of `npm` or `yarn` for installing dependencies.
