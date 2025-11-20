# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A full-stack e-commerce application built with Next.js 14 (App Router), TypeScript, MongoDB, and NextAuth for authentication. The application supports multiple payment methods (PayPal, Paynow), order tracking, and includes a complete admin dashboard.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm start            # Start production server
npm run lint         # Run ESLint
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `MONGODB_URI` - MongoDB connection string
- `AUTH_URL` and `AUTH_SECRET` - NextAuth configuration
- `PAYPAL_CLIENT_ID`, `PAYPAL_APP_SECRET` - PayPal payment integration
- `NEXT_PUBLIC_PAYNOW_API_ID`, `NEXT_PUBLIC_PAYNOW_API_KEY` - Paynow payment integration
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET` - Image uploads

## Architecture

### Route Structure
The app uses Next.js App Router with two main route groups:

**`app/(front)/`** - Customer-facing pages:
- `/` - Homepage with featured products
- `/product/[slug]` - Product details
- `/cart` - Shopping cart
- `/shipping`, `/payment`, `/place-order` - Checkout flow
- `/order/[id]`, `/order-tracking` - Order management
- `/signin`, `/register` - Authentication
- `/profile` - User profile and order history
- `/search` - Product search

**`app/admin/`** - Admin dashboard:
- `/admin/dashboard` - Analytics and summary
- `/admin/products` - Product management (CRUD, bulk operations)
- `/admin/orders` - Order management and delivery status
- `/admin/users` - User management
- `/admin/banners` - Banner management

**`app/api/`** - API routes organized by resource:
- `/api/auth/[...nextauth]` - NextAuth endpoints
- `/api/products` - Product operations
- `/api/orders` - Order creation and management
- `/api/admin/*` - Protected admin endpoints

### Database Layer

**Models** (`lib/models/`):
- `ProductModel.ts` - Products with inventory tracking, ratings, and optional tracking info
- `OrderModel.ts` - Orders with items, shipping, payment, and status tracking
- `UserModel.ts` - Users with email/password auth and admin flag
- `BannerModel.ts` - Marketing banners

**Database Connection** (`lib/dbConnect.ts`):
- Singleton pattern with global caching for connection reuse
- Must be called before any database operation: `await dbConnect()`

### Services Layer (`lib/services/`)

**`productService.ts`** - Cached product queries:
- `getLatest()` - Recent products
- `getFeatured()` - Featured products
- `getBySlug(slug)` - Single product lookup
- `getByQuery({q, category, sort, price, rating, page})` - Filtered search with pagination
- `getCategories()` - Distinct category list
- All functions use React `cache()` for request-level memoization

**`bannerServices.ts`** - Banner CRUD operations

### State Management

**Zustand Store** (`lib/hooks/useCartStore.ts`):
- Client-side cart state with localStorage persistence
- `useCartService()` hook provides cart operations:
  - `increase(item)`, `decrease(item)`, `remove(item)` - Cart manipulation
  - `saveShippingAddress()`, `savePaymentMethod()` - Checkout data
  - `clear()`, `init()` - Cart reset
- Auto-calculates `itemsPrice`, `taxPrice`, `shippingPrice`, `totalPrice`

### Authentication

**NextAuth** (`app/api/auth/[...nextauth]/options.ts`):
- Credentials provider with bcrypt password hashing
- Session includes: `_id`, `email`, `name`, `isAdmin`
- Protected routes use `middleware.ts` (currently only `/dashboard`)
- Session available via `getServerSession(options)` in Server Components
- Client-side: `useSession()` from `next-auth/react`

### UI Components

**Structure**:
- `components/ui/` - shadcn/ui components (Button, Dialog, Tabs, etc.)
- `components/header/` - Header and navigation
- `components/products/` - Product-specific components
- `components/admin/` - Admin dashboard components

**Styling**: 
- Tailwind CSS with DaisyUI plugin
- Theme configuration in `tailwind.config.ts` supports light/dark modes
- Custom primary color: `#0000FF`

### Type System (`lib/types.ts`)

Key types:
- `Product` - Full product schema with optional `banner`, `colors`, `sizes`
- `OrderItem` - Cart/order item with product reference, quantity, price, optional color/size
- `ShippingAddress` - Customer shipping details
- `AuthUser` - Authenticated user with admin flag

### Utility Functions (`lib/utils.ts`)

- `cn()` - Tailwind class merging
- `round2(num)` - Round to 2 decimal places for prices
- `convertDocToObj(doc)` - Convert MongoDB ObjectId to string
- `formatNumber(x)` - Add thousand separators
- `formatDateTime(dateString, timeZone?)` - Flexible date/time formatting

## Payment Integration

Two payment methods supported:
1. **PayPal** - Uses `@paypal/react-paypal-js` and PayPal sandbox API
2. **Paynow** - Zimbabwe payment gateway via `paynow-react` wrapper

Payment flow endpoints:
- `/api/orders/[id]/create-paypal-order`
- `/api/orders/[id]/capture-paypal-order`
- `/api/orders/[id]/create-paynow-order`
- `/api/orders/[id]/capture-paynow-order`

## Import Aliases

Use `@/*` for all imports: `import { Product } from '@/lib/types'`

## Key Patterns

1. **Server Components by default** - Use `'use client'` only when needed (hooks, browser APIs, interactivity)
2. **Cached data fetching** - Use `productService` functions which implement React `cache()`
3. **Database operations** - Always call `await dbConnect()` before Mongoose operations
4. **Authentication checks** - Use `getServerSession(options)` in Server Components, check `session?.user?.isAdmin` for admin routes
5. **Form validation** - Uses `zod` schemas with `react-hook-form` and `@hookform/resolvers`
6. **Error handling** - API routes return `NextResponse.json()` with appropriate status codes

## Testing

No test framework is currently configured. Tests should be added as needed.

## Deployment

Configured for Vercel deployment (see lesson 20 in `/lessons/`). The app includes Cloudinary integration for image hosting in production.
