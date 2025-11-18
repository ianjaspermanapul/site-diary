# Site Diary Mobile Application

A React Native mobile application built with Expo for managing construction site diary entries. Features include offline support, AI-powered weekly summaries, and a modern, intuitive user interface.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Starting the Application](#starting-the-application)
- [Database Setup](#database-setup)
- [Technical Choices / Focus Areas](#technical-choices--focus-areas)
- [Future Improvements](#future-improvements)
- [AI Usage for Development](#ai-usage-for-development)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun** (package manager)
- **Expo CLI** (optional, but recommended)
- **iOS Simulator** (for iOS development - macOS only)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)

## Installation

1. **Clone the repository** (if applicable):

   ```bash
   git clone <repository-url>
   cd coding-test-mobile-main
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Generate native projects** (required for iOS/Android):

   ```bash
   npm run prebuild
   # or
   yarn prebuild
   # or
   bun run prebuild
   ```

4. **Set up environment variables** (see [Environment Variables](#environment-variables) section below)

5. **Generate Prisma Client**:

   ```bash
   npm run db:generate
   ```

6. **Set up the database**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="file:./dev.db"

# OpenAI API Key (Optional - for AI weekly summaries)
OPENAI_API_KEY="sk-your-api-key-here"
```

### Environment Variable Details

- **`DATABASE_URL`** (Required)
  - SQLite database connection string
  - Format: `file:./app/api/db/dev.db` (relative to the schema file location)
  - The database file will be created at `app/api/db/dev.db`

- **`OPENAI_API_KEY`** (Optional)
  - Your OpenAI API key for generating weekly AI summaries
  - Get your API key from [OpenAI Platform](https://platform.openai.com/)
  - If not provided, the weekly summary feature will be disabled
  - Format: `sk-...`

**Note:** The `.env` file is already in `.gitignore` and will not be committed to version control.

## Starting the Application

### Development Server

Start the Expo development server:

```bash
npm start
# or
yarn start
# or
bun start
```

This will start the Metro bundler and display a QR code. You can:

- **Scan the QR code** with the Expo Go app on your physical device
- **Press `i`** to open in iOS Simulator (macOS only)
- **Press `a`** to open in Android Emulator
- **Press `w`** to open in web browser

### Running on Specific Platforms

**iOS Simulator** (macOS only):

```bash
npm run ios
```

**Android Emulator**:

```bash
npm run android
```

**Web Browser**:

```bash
npm run web
```

### Building Native Apps

After making changes to native dependencies or configuration:

```bash
npm run prebuild
```

This will regenerate the iOS and Android native projects.

## Database Setup

### Initial Setup

1. **Generate Prisma Client**:

   ```bash
   npm run db:generate
   ```

2. **Run migrations**:

   ```bash
   npm run db:migrate
   ```

   When prompted, enter a migration name (e.g., `init`)

3. **Seed the database** (optional, but recommended):
   ```bash
   npm run db:seed
   ```
   This will populate the database with sample site diary entries.

### Database Commands

- **`npm run db:generate`** - Generate Prisma Client
- **`npm run db:migrate`** - Create and apply migrations
- **`npm run db:push`** - Push schema changes to database (development)
- **`npm run db:studio`** - Open Prisma Studio (database GUI)
- **`npm run db:seed`** - Seed database with sample data

### Database Location

The SQLite database file is located at:

```
app/api/db/dev.db
```

**Note:** The database file is in `.gitignore` and will not be committed to version control.

## Technical Choices / Focus Areas

<!-- Add your technical choices and focus areas here -->

## Future Improvements

<!-- Add your planned future improvements here -->

## AI Usage for Development

<!-- Add information about AI tools and assistance used during development here -->

---

## Troubleshooting

### Common Issues

**Metro bundler cache issues:**

```bash
npm start -- --reset-cache
```

**Prisma Client not found:**

```bash
npm run db:generate
```

**Database locked error:**

- Ensure no other process is using the database
- Check if `dev.db-journal` file exists and remove it if stuck

**Network detection not working:**

- Ensure `@react-native-community/netinfo` is properly installed
- On iOS, you may need to rebuild the app: `npm run prebuild`

**OpenAI API errors:**

- Verify your API key is correct in `.env`
- Check your OpenAI account has available credits
- Ensure you have internet connectivity

## License

[Add your license information here]

## Contact

[Add your contact information here]
