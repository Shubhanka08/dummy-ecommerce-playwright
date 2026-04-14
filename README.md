# Playwright Test Automation - ShopDemo

This repository contains automated UI tests for the ShopDemo e-commerce application using Playwright and TypeScript.

##  What I Implemented

- End-to-End test automation using Playwright
- Functional testing for key user flows
- Independent test cases with no shared state
- Reliable selectors using `data-testid`

##  Test Coverage

### Product Listing
- Search functionality
- Category filtering
- Sorting by price
- Empty state validation

###  Product Detail
- Product info validation
- Add to Cart button state (enabled/disabled)

### Cart
- Add item to cart
- Update quantity
- Remove item
- Total price validation
- Empty cart state

### Checkout
- Form validation (required fields)
- Email validation
- Zip code validation

###  End-to-End Flow
- Complete purchase journey
- Order confirmation validation

##  Run Tests

```bash
npx playwright test
Test Files
tests/product-listing.spec.ts
tests/product-detail.spec.ts
tests/cart.spec.ts
tests/checkout.spec.ts
tests/e2e-purchase.spec.ts

---

##  After adding

Run:

```bash
git add README.md
git commit -m "Updated README with test details"
git push


# ShopDemo - Ecommerce Test Application

A fully functional dummy ecommerce frontend built for QA testing with Playwright. All backend data is mocked using [MSW (Mock Service Worker)](https://mswjs.io/) — no real server required.

## Prerequisites

- Node.js 18+
- npm

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or build and start production server
npm run build
npm start
```

The app runs on `http://localhost:3000` by default.

### Custom Port

```bash
PORT=4000 npm run dev
PORT=4000 npm start
```

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Product listing with search, filter by category, and sort by price |
| `/products/:id` | Product detail page with add-to-cart |
| `/cart` | Shopping cart with quantity controls |
| `/checkout` | Checkout form with shipping and payment validation |
| `/order-confirmation?orderId=...` | Order confirmation page |

## Features Available for Testing

### Product Listing (`/`)
- Grid display of 14 products across 4 categories
- **Search**: Type in the search bar to filter products by name (debounced 300ms)
- **Category filter**: Filter by Electronics, Clothing, Home, or Books
- **Sort**: Sort by price (low-to-high or high-to-low)
- Product count updates dynamically
- Empty state when no products match
- Loading skeleton while fetching

### Product Detail (`/products/:id`)
- Product image, name, description, price, category, stock status
- Quantity selector
- "Add to Cart" button (disabled for out-of-stock items)
- Success notification after adding to cart
- 404 state for invalid product IDs

### Shopping Cart (`/cart`)
- List of cart items with images, names, prices
- Increase/decrease quantity buttons
- Remove item button
- Running total
- "Proceed to Checkout" button
- Empty cart message with link back to products

### Checkout (`/checkout`)
- **Shipping fields**: First Name, Last Name, Email, Address, City, State, Zip Code
- **Payment fields**: Name on Card, Card Number, Expiry Date (MM/YY), CVV
- Client-side validation with inline error messages
- Server-side validation on submit
- Redirects to order confirmation on success
- Empty cart redirect

### Validation Rules
| Field | Rule |
|-------|------|
| First Name, Last Name, Address, City, State, Name on Card | Required |
| Email | Required, valid email format |
| Zip Code | Required, exactly 5 digits |
| Card Number | Required, exactly 16 digits (spaces allowed) |
| Expiry Date | Required, MM/YY format |
| CVV | Required, 3 or 4 digits |

## API Endpoints (Mocked via MSW)

All endpoints are intercepted by MSW in the browser — no real HTTP requests leave the app.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products?search=&category=&sort=` | List products with optional filters |
| `GET` | `/api/products/:id` | Get single product |
| `GET` | `/api/cart` | Get current cart |
| `POST` | `/api/cart` | Add item (`{ productId, quantity }`) |
| `PATCH` | `/api/cart/:id` | Update quantity (`{ quantity }`) |
| `DELETE` | `/api/cart/:id` | Remove item from cart |
| `POST` | `/api/checkout` | Submit order (`{ shipping, payment }`) |

### Sort Options
- `price_asc` — Price: Low to High
- `price_desc` — Price: High to Low

### Categories
`electronics`, `clothing`, `home`, `books`

## `data-testid` Reference

### Navigation
| Selector | Element |
|----------|---------|
| `navbar` | Navigation bar |
| `cart-link` | Cart link in navbar |
| `cart-count` | Cart item count badge |

### Product Listing
| Selector | Element |
|----------|---------|
| `search-input` | Search text input |
| `category-filter` | Category dropdown |
| `sort-select` | Sort dropdown |
| `product-count` | Product count text |
| `product-grid` | Product grid container |
| `product-card-{id}` | Individual product card (e.g., `product-card-prod-001`) |
| `no-products` | No products found message |
| `product-grid-loading` | Loading skeleton |

### Product Detail
| Selector | Element |
|----------|---------|
| `product-name` | Product name heading |
| `product-price` | Product price |
| `product-image` | Product image |
| `product-description` | Product description |
| `product-category` | Category badge |
| `quantity-input` | Quantity number input |
| `add-to-cart-button` | Add to Cart button |
| `added-notification` | Success notification (visible 2s after add) |

### Cart
| Selector | Element |
|----------|---------|
| `cart-item-{id}` | Cart line item (e.g., `cart-item-cart-1`) |
| `cart-item-quantity-{id}` | Quantity display for item |
| `quantity-increase-{id}` | Increase quantity button |
| `quantity-decrease-{id}` | Decrease quantity button |
| `remove-item-{id}` | Remove item button |
| `cart-total` | Cart total price |
| `checkout-button` | Proceed to Checkout button |
| `empty-cart-message` | Empty cart message |

### Checkout
| Selector | Element |
|----------|---------|
| `checkout-form` | The checkout form |
| `shipping-first-name` | First name input |
| `shipping-last-name` | Last name input |
| `shipping-email` | Email input |
| `shipping-address` | Address input |
| `shipping-city` | City input |
| `shipping-state` | State input |
| `shipping-zip` | Zip code input |
| `payment-name` | Name on card input |
| `payment-card-number` | Card number input |
| `payment-expiry` | Expiry date input |
| `payment-cvv` | CVV input |
| `submit-order-button` | Place Order button |
| `field-error-{testId}` | Validation error for a field (e.g., `field-error-shipping-email`) |

### Order Confirmation
| Selector | Element |
|----------|---------|
| `order-confirmation` | Confirmation container |
| `order-id` | Order ID display |
| `continue-shopping-link` | Continue Shopping button |

## Mock Data

The app uses 14 deterministic products with stable IDs (`prod-001` through `prod-014`). Product `prod-008` (Wool Beanie) is marked as out-of-stock for testing disabled states.

## Notes

- **No real backend**: All data is served by MSW's service worker in the browser
- **Cart resets on page reload**: Cart state lives in MSW's in-memory handler, not persistent storage
- **Deterministic data**: Product IDs, names, and prices are fixed — safe for assertions in tests
- **Images**: Placeholder images from `placehold.co` (no external API dependency)
