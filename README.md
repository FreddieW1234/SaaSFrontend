# B2B SaaS Dashboard

A Next.js project skeleton for a B2B SaaS dashboard application with authentication pages, dashboard, and settings management.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── app/                          # Next.js App Router directory
│   ├── dashboard/               # Dashboard page
│   │   ├── page.tsx            # Dashboard component
│   │   └── page.module.css     # Dashboard styles
│   ├── login/                   # Login page
│   │   ├── page.tsx            # Login form component
│   │   └── page.module.css     # Login styles
│   ├── signup/                  # Signup page
│   │   ├── page.tsx            # Signup form component
│   │   └── page.module.css     # Signup styles
│   ├── settings/                # Settings page
│   │   ├── page.tsx            # Settings form component
│   │   └── page.module.css     # Settings styles
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page
│   ├── page.module.css         # Home page styles
│   └── globals.css             # Global styles
├── components/                   # Reusable React components
│   ├── Navigation.tsx          # Navigation menu component
│   └── Navigation.module.css   # Navigation styles
├── lib/                         # Utility functions and API helpers
│   └── api.ts                  # Placeholder API functions
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── next.config.ts              # Next.js configuration
```

## Pages

### Home Page (`/`)
Welcome page with links to login and signup.

### Login Page (`/login`)
Simple login form with email and password inputs. Currently uses placeholder API calls.

### Signup Page (`/signup`)
Registration form with email, company name, and password fields. Currently uses placeholder API calls.

### Dashboard Page (`/dashboard`)
Placeholder dashboard page that displays a welcome message. Ready for data integration.

### Settings Page (`/settings`)
Settings form for Shopify integration with fields for:
- Shopify Store Domain
- API Key
- Access Token

## Adding Backend/API Logic

### API Integration Points

All API calls are currently placeholders in `lib/api.ts`. To integrate with your backend:

1. **Authentication API** (`lib/api.ts`):
   - `handleLogin()` - Replace with your login endpoint
   - `handleSignup()` - Replace with your signup endpoint

2. **Dashboard API** (`lib/api.ts`):
   - `fetchDashboardData()` - Replace with your dashboard data endpoint

3. **Settings API** (`lib/api.ts`):
   - `saveSettings()` - Replace with your settings save endpoint

### Example API Integration

Replace the placeholder functions in `lib/api.ts` with actual fetch calls:

```typescript
export async function handleLogin(credentials: LoginCredentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
}
```

### Next.js API Routes

You can create API routes in the `app/api/` directory:

```
app/
└── api/
    ├── auth/
    │   ├── login/
    │   │   └── route.ts
    │   └── signup/
    │       └── route.ts
    ├── dashboard/
    │   └── route.ts
    └── settings/
        └── route.ts
```

## Styling

This project uses CSS Modules for component-level styling. Each page and component has its own `.module.css` file for scoped styles.

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **CSS Modules** - Scoped component styling

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps

1. Set up authentication logic (JWT, sessions, etc.)
2. Connect to your backend API
3. Add database integration
4. Implement protected routes
5. Add form validation
6. Add error handling and user feedback
7. Add loading states
8. Implement state management (if needed)
