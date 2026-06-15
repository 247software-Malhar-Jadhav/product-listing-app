# Product Listing & Detail App

An Amazon-style e-commerce product listing application built with React, TypeScript
and the public [DummyJSON Products API](https://dummyjson.com/docs/products).

It has two screens:

- **Product Listing Page** (`/`) — filterable, paginated product grid with a filters sidebar.
- **Product Detail Page** (`/product/:id`) — full details, reviews and a filter-preserving Back button.

## Tech Stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Build tool     | Vite                                     |
| Language       | TypeScript                               |
| UI             | React 19 (functional components + hooks) |
| Styling        | Tailwind CSS v4                          |
| Components     | shadcn/ui (Radix primitives)             |
| Data fetching  | TanStack React Query + Axios             |
| Routing        | React Router                             |
| Icons          | lucide-react                             |

## Setup

Requires Node 18+ (developed on Node 24).

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# type-check and build for production
npm run build

# preview the production build
npm run preview
```

No environment variables are needed — the public DummyJSON API requires no key.

## Features

### Product Listing Page
- Responsive product grid of cards (image, title, price, star rating).
- Filters sidebar:
  - **Category** — fetched dynamically from `/products/categories`; multi-select.
  - **Price range** — min/max inputs with an Apply button.
  - **Brand** — multi-select, built from the unique brands in the current scope.
  - **Search** — title search in the header.
- Filters combine, update the list immediately, and **reset pagination to page 1** on change.
- Numbered pagination with windowed page buttons and Previous/Next.
- Loading skeletons and an error state with retry.

### Product Detail Page
- Image, title, price, rating, description, brand, category and reviews.
- **Back** button returns to the listing with the **previously selected filters still applied**.

## Architecture & Decisions

```
src/
├── components/
│   ├── common/      # StateMessage (shared error/empty block)
│   ├── layout/      # Header
│   ├── products/    # ProductCard, ProductGrid, FiltersSidebar, Pagination, Rating
│   └── ui/          # shadcn/ui primitives
├── hooks/           # use-products, use-categories, use-product, use-filter-params
├── lib/             # api (axios), queryClient, utils
├── pages/           # ProductListingPage, ProductDetailPage
└── types/           # Product / Category types
```

- **Filters live in the URL query string.** A single `useFilterParams` hook reads and
  writes `category`, `minPrice`, `maxPrice`, `brands`, `q` and `page`. Storing state in
  the URL is what makes filters survive navigation to the detail page and back, and also
  makes a filtered view shareable. The detail page additionally receives the listing's
  query string via router state so its Back button restores the exact view.

- **Fetch-scope + client-side filtering.** DummyJSON cannot filter by price or brand
  server-side, so a fully server-driven approach would give inconsistent counts when
  filters combine. Instead the app fetches the full scope — all products
  (`/products?limit=0`), or, when categories are selected, the union of each selected
  category (`/products/category/{slug}` per category, merged and de-duplicated by id) —
  and applies price, brand and search filters and pagination on the client. The dataset
  is small (~200 items), so this keeps combined filtering correct and the brand list
  complete. Categories are **multi-select**: the dedicated category endpoint is still used,
  fanned out one request per selected category.

- **React Query** handles caching, loading and error states. Categories are treated as
  static (`staleTime: Infinity`); product scopes are cached for 5 minutes and reused when
  switching back to a previously viewed category. `placeholderData` keeps the old grid in
  place while a new category loads.

- **shadcn/ui over a heavy component library.** Components are copied into the repo
  (`components/ui`) rather than pulled from a runtime dependency, keeping the bundle lean
  while still giving accessible primitives. Styling stays mostly utility-class based.

## API Usage

| Endpoint                          | Used for                                  |
| --------------------------------- | ----------------------------------------- |
| `GET /products?limit=0`           | Full product scope (no category selected)    |
| `GET /products/categories`        | Category filter options                      |
| `GET /products/category/{slug}`   | Scope per selected category (fanned out, merged) |
| `GET /products/{id}`              | Product detail page                          |

## Assumptions

- Not every product in the dataset has a `brand`; the brand filter only lists brands that
  exist in the current scope and products without a brand are excluded when a brand is selected.
- Categories are multi-select; since the API only filters one category per request, the
  selected categories are fetched in parallel and merged (de-duplicated by id) client-side.
- Page size is fixed at 8 (a 4×2 grid on desktop) to match the reference design.
- Price inputs are committed via **Apply** (matching the design) rather than on every keystroke.

## Improvements with more time

- Debounced search and a "no results" hint that clears the narrowest filter.
- Sorting (price, rating, name) and a price range slider.
- Cart / wishlist functionality behind the header icons.
- Image gallery on the detail page (the API returns multiple images).
- Unit tests for `useFilterParams` and the filtering logic, plus an E2E smoke test.
- Skeleton-to-content fade and route transitions for polish.
