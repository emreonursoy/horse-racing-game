# 🐎 Horse Racing Game

A web-based horse racing simulation game built with Vue 3. Generate horses, create race schedules, and watch them compete across multiple rounds with real-time race tracking and results.

## Project Scope

This application simulates a horse racing tournament where:

- **Generate Horses**: Create 20 horses with randomized names and condition values (1-100)
- **Race Schedule**: Generate a 6-round tournament schedule with varying distances (1200m, 1400m, 1600m, 1800m, 2000m, 2200m)
- **Race Execution**: Each round features 10 horses racing simultaneously with animated race tracks
- **Race Control**: Start, pause, and resume races
- **Results & Winners**: View race results for each round and overall tournament winners
- **Game Reset**: Reset the entire game state to start fresh

## Technologies Used

### Core Framework
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript for better code quality
- **Vuex 4** - State management for game logic and race data

### Build Tools & Development
- **Vite** - Fast build tool and development server
- **SCSS/Sass** - CSS preprocessor for styling
- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting

### Testing
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing for browser automation
- **Vue Test Utils** - Vue component testing utilities

### Development Tools
- **Vue DevTools** - Browser extension for Vue debugging
- **vue-tsc** - TypeScript type checking for Vue files

## Getting Started

### Prerequisites
- Node.js (^20.19.0 || >=22.12.0)

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Testing

```sh
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e
```

### Linting

```sh
npm run lint
```
