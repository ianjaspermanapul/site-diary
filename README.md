# Site Diary Mobile Application

A React Native mobile application built with Expo for managing construction site diary entries. Features include offline support, AI-powered weekly summaries, and a modern, intuitive user interface.

## 🎥 Demo Video

**👉 [Watch the Demo on Loom](https://www.loom.com/share/93bc141bb3294dbd876504538ceb36da)**

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
  - Format: `file:./dev.db` (relative to the schema file location)
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

- I've opted not to use any design libraries and created the components from scratch for more flexibility
- For the database, as we're dealing with a relatively small application and data, and for the portability of the app/exam, I opted to use **`Prisma + SQLite`** instead of PostgreSQL. Note: I've added the sample Site Diary items into a seed file so you can have sample initial data for the list
- Additionally, implementing Prisma + SQLite, I implemented mutations/creation of Site Diary items.
- I used GraphQL as expected but since I don't need any services exclusive to Apollo like Subscriptions, etc. I also opted to use a more lightweight request library, **`Tanstack's React Query`** to give me more control when updating lists globally as well as handling cache for **`offline support`**.
- As mentioned at the item above, there's offline support implemented that makes use of cache for already-queried Site Diary item and list. Creation is disabled when the user is offline.
- I've added some minor libraries for the user's convenience for example, adding date pickers and photo pickers when creating site diery items.
- I've also implemented a very simple AI prompt to summarize the entries in the site diary list for the most recent week

## Future Improvements

There are improvements that I would do for the application if in case this is turned into a full-blown app

- Update and Delete for Site Diary items.
- An auto complete for the attendees if ever the attendee is a registered user
- Maybe more information regarding the weather? Windspeed (If that's relevant in any case)
- Authentication for any logging/tracking of user activities

## AI Usage for Development

- Implementation wise, I've implemented AI using OpenAI to produce a weekly summary for the most recent week in the site diary entries. This functionaklity is optional and will be available if an API Key is provided in the .env file.
- Development wise, I used AI for polishing code in the screens and components but I could confidently say that majority of the lines of codes are done by me.

I've mentioned this to Anthony that I normally use AI for scaffolding code and doing the grunt work, but 99% of the time, I deal with the business logic to make sure that the workflow is intended.

I also used AI to build this very well constructed README file but I reviewed it to make sure that the generated file is also tailored and specific for running this app, for example, the required .env fields, etc.

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
