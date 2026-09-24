# E-Commerce Frontend

React + Vite storefront for the existing Express/MongoDB e-commerce API.

**Phase 1 scope:** frontend foundation, design system, public home page, product listing and product details. Authentication, cart, checkout, orders, and admin come in later phases.

## Setup

```bash
cd frontend
npm install
cp .env.example .env      # then adjust if your API isn't on localhost:5000
npm run dev               # http://localhost:5173
```

The backend must be running (`npm run dev` in the backend folder, default port 5000).

## Environment variables

Only **public** values belong here. Every `VITE_*` variable is bundled into the browser build.

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL, including `/api` | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Brand name shown in the navbar, footer, and page titles | `Shopfront` |
| `VITE_CURRENCY` | ISO currency code used to format prices | `PKR` |

## Scripts

`npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

## Structure

```
src/
  components/
    ui/        Button, SectionHeading, LoadingSpinner, EmptyState, ErrorMessage, Icons
    layout/    Navbar, Footer, Brand
    product/   ProductCard, ProductGrid, ProductImage, AvailabilityBadge
    home/      Hero, HeroShowcase, FeaturedProducts, CategoriesSection, CategoryCard,
               WhyChooseUs, FeatureCard, HowItWorks, CallToAction
    auth/      AuthPlaceholder (visual shell only)
  pages/       Home, Products, ProductDetails, Login, Register, NotFound
  layouts/     MainLayout (skip link, navbar, outlet, footer)
  services/    api.js (single Axios instance), productService.js
  hooks/       useProducts, useProduct, useDocumentTitle
  utils/       errors, formatters, products
  context/     (empty: reserved for Phase 2 auth)
  styles/      tokens, base, ui, layout, home, products, auth
  config.js    Reads public env vars
```

## Backend endpoints used

| Endpoint | Response shape |
|---|---|
| `GET /api/products` | `{ count, products: [...] }` |
| `GET /api/products/:id` | `{ product: {...} }` (404 `{ message }` when missing) |

## Design tokens

All colors, type, spacing, radii, and shadows live in `src/styles/tokens.css`. Change the look of the whole app there.
