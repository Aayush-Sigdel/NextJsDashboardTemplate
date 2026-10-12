# Next.js Dashboard Template

A dashboard starter built with Next.js App Router, React, TypeScript, and Ant Design. It includes admin authentication, responsive navigation, light and dark themes, and English and German translations.

The template provides the dashboard layout and sign-in flow. Home, Analytics, Projects, and Settings currently display section headings; application-specific content can be added to these sections.

## Features

- Responsive dashboard with a collapsible desktop sidebar and mobile navigation drawer.
- Light and dark themes, with the selected theme saved in local storage.
- Admin sign-in using Auth.js credentials authentication and JWT sessions.
- Authentication redirects that preserve the requested page after sign-in.
- English and German translations with locale-aware navigation and redirects.
- Ant Design server-rendered styles through `@ant-design/nextjs-registry`.
- Tailwind CSS utilities, shared color tokens, and Tabler icons.
- PostgreSQL and Prisma configuration for future database-backed features.

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16, App Router |
| UI | React 19, Ant Design 6 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, CSS variables |
| Authentication | Auth.js (`next-auth` 5 beta), Zod validation |
| Internationalization | `next-intl` 4 |
| Database tooling | Prisma 7, PostgreSQL, `pg`, `@prisma/adapter-pg` |
| Icons | `@tabler/icons-react` |
| Linting | ESLint 9 with Next.js rules |

SWR and Zustand are also installed for future data fetching and state management. The current dashboard uses React state and does not yet use these libraries or a database.

## Getting Started

### Prerequisites

- Node.js 22.12 or later within the 22.x release line, or Node.js 24 or later, to satisfy the included Next.js and Prisma dependencies.
- npm.
- A PostgreSQL database if you plan to use Prisma. The current dashboard and sign-in flow work without a database connection.

### 1. Clone and install

```bash
git clone https://github.com/Aayush-Sigdel/NextJsDashboardTemplate.git
cd NextJsDashboardTemplate
npm ci
```

### 2. Configure the environment

Copy the example environment file:

```bash
cp .env.example .env
```

Generate an authentication secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Paste the generated value into `AUTH_SECRET` in `.env`, then set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to the credentials you want to use.

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Secret used by Auth.js to protect sessions. Set this before starting the app. |
| `AUTH_TRUST_HOST` | Host trust setting for Auth.js; the example sets it to `true`. |
| `ADMIN_EMAIL` | Email address accepted by the credentials provider. |
| `ADMIN_PASSWORD` | Password accepted by the credentials provider. Replace the example value. |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma tooling. Match the SSL options to your database. |
| `BASE_URL` | Included in the example for future integration; currently unused by the application. |
| `NEXT_PUBLIC_API_URL` | Included for future client-side API integration; currently unused. Values prefixed with `NEXT_PUBLIC_` are public. |

The `.env` file is ignored by Git. Authentication currently supports one admin account configured through environment variables.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated visitors are redirected to the sign-in page. Sign in with the values configured in `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. Run `npm run build` first. |
| `npm run lint` | Run ESLint. |

The development, build, and start scripts set the V8 heap limit to 2,048 MB. This limits the JavaScript heap rather than the total memory used by the application and its child processes.

## Project Structure

```text
prisma/
  schema.prisma                  # PostgreSQL datasource and client generator
  migrations/                    # Migration directory
public/                          # Static assets
src/
  app/
    [locale]/
      (auth)/sign-in/             # Sign-in page and authentication actions
      antd-theme-provider.tsx     # Theme state and Ant Design tokens
      dashboard.tsx              # Dashboard layout and section selection
      dashboard.css              # Dashboard styling and responsive rules
      globals.css                # Tailwind setup and application theme variables
      layout.tsx                 # Fonts, translations, and UI providers
      page.tsx                   # Dashboard entry point
    api/auth/[...nextauth]/       # Auth.js GET and POST handlers
  auth.ts                        # Credentials provider and JWT session setup
  i18n/                          # Locale routing, navigation, and message loading
  messages/                      # English and German translations
  theme/colors.ts                # Shared dark-theme palette
  proxy.ts                       # Authentication redirects and locale handling
prisma7.config.ts                # Prisma CLI configuration
```

## Internationalization

Supported locales are defined in [`src/i18n/routing.ts`](src/i18n/routing.ts). English (`en`) is the default, and German (`de`) uses a URL prefix. The `as-needed` prefix setting gives these routes:

| Page | English | German |
| --- | --- | --- |
| Dashboard | `/` | `/de` |
| Sign-in | `/sign-in` | `/de/sign-in` |

Locale detection can select German based on browser preferences. Explicit English-prefixed URLs such as `/en` are normalized to the default unprefixed route.

Edit translations in [`src/messages/en.json`](src/messages/en.json) and [`src/messages/de.json`](src/messages/de.json). Use `useTranslations` in client components and the navigation helpers exported from [`src/i18n/navigation.ts`](src/i18n/navigation.ts) for locale-aware links and routing.

## Customization

- **Dashboard content:** Extend [`src/app/[locale]/dashboard.tsx`](src/app/[locale]/dashboard.tsx). Menu selection currently switches local component state; sections do not have separate URLs.
- **Branding and layout:** Update the dashboard component and [`src/app/[locale]/dashboard.css`](src/app/[locale]/dashboard.css).
- **Themes:** Adjust Ant Design tokens in [`src/app/[locale]/antd-theme-provider.tsx`](src/app/[locale]/antd-theme-provider.tsx), application CSS variables in [`src/app/[locale]/globals.css`](src/app/[locale]/globals.css), and dashboard CSS variables. The shared dark palette lives in [`src/theme/colors.ts`](src/theme/colors.ts).
- **Authentication:** Update [`src/auth.ts`](src/auth.ts) to add providers or replace the environment-based admin account with your application's user system.
- **Languages:** Add a locale to the routing configuration and create its matching JSON file in `src/messages/`.

## Database Setup

Prisma is configured for PostgreSQL in [`prisma/schema.prisma`](prisma/schema.prisma). The schema currently has no models, and no database queries or Prisma client instance are used by the application.

When adding persistence, define your models and set `DATABASE_URL`. Pass the configuration path explicitly because this repository uses `prisma7.config.ts`:

```bash
npx prisma validate --config prisma7.config.ts
npx prisma migrate dev --name init --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

Run these commands after adding models. The client generator writes to `src/generated/prisma`, which is ignored by Git. Create a Prisma client using the PostgreSQL adapter when connecting the database to your application.

## Production

Set `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and the appropriate Auth.js host settings in your deployment environment, then build and start the application:

```bash
npm run build
npm run start
```

The application uses Node.js authentication code and server actions, so deploy it to a host that supports the Next.js Node.js runtime. The layout loads Inter and Oswald through `next/font/google`; builds need network access to download those fonts.

If you add database models and migrations, configure `DATABASE_URL` in the deployment environment, generate the Prisma client during the build, and apply committed migrations with:

```bash
npx prisma migrate deploy --config prisma7.config.ts
```
