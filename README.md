# PlantNest — Backend

Express + MongoDB (Mongoose) API for the PlantNest online nursery.

## Setup
```bash
npm install
cp .env.example .env   # your real .env is already included with your Atlas credentials
npm run seed            # creates base categories + a demo admin account
npm run start:dev       # http://localhost:5000
```

Demo admin (created by the seed script): `admin@plantnest.com` / `Admin@123`

## What changed from the original repo
The repo you gave me only had **auth, category, and plant** wired up end-to-end — the models for
accessories, cart, orders and reviews existed but had no controllers or routes, so the frontend had
nothing to call. I extended the backend (same style: `.mjs`, `express-async-handler`, same JSON
response shape) rather than build a UI against endpoints that didn't exist:

- **New modules**: accessories, cart, orders, reviews, site feedback, wishlist, saved addresses,
  admin user list — each with its own controller + route file, mirroring your existing plant/category
  pattern.
- **Plant & accessory models** gained `images`, `description`, `stock`, `discount`, and (plants only)
  `species`, `careLevel`, `wateringSchedule`, `sunlight`, `temperature`, plus `avgRating`/`numReviews`
  kept in sync whenever a review is added.
- **Category enum removed** — it was hardcoded to 6 fixed values, which would have made the admin
  "add category" button fail with a validation error the moment it was used. Categories are now free-form,
  unique strings, same as the SRS's admin CRUD calls for.
- **Cart & order models redesigned** — the original `Cart` was one document per line-item with a
  pending/checkout status, and `Order` only linked a single plant or accessory. Both are now one
  document per user/order with an `items[]` array, which is what the checkout flow in the SRS
  (view cart → compute total → place order → cancel order) actually needs.
- **Auth**: `avatar` upload is now optional on register (it was required, which would block signup for
  anyone without a photo), added `fullName`/`contactNumber` fields to match the SRS registration form,
  added `PUT /update-profile` and `PUT /change-password`, and `verifyToken` now accepts either the
  httpOnly cookie or an `Authorization: Bearer <token>` header (the frontend uses the header).
- **CORS** was missing entirely — added, scoped to `CLIENT_URL`.
- Multer's temp upload folder is created automatically instead of assuming it exists.

## Routes
```
/api/v1/auth        register, login, logout, me/profile, update-profile, change-password
/api/v1/category     CRUD (admin for write)
/api/v1/plant        CRUD + multi-image upload (admin for write), filter/sort/search query params
/api/v1/accessory     same shape as /plant
/api/v1/cart         get, add, update quantity, remove (auth required)
/api/v1/order        checkout, my-orders, cancel, admin/all, admin/status (admin for the latter two)
/api/v1/review       get by product, add (auth required)
/api/v1/feedback     submit (public), list + mark read (admin)
/api/v1/user          admin/all (admin), wishlist get/toggle, address add/delete
```

## Notes / assumptions
- Payment integration is out of scope per the SRS — checkout creates a confirmed order record directly.
- Cloudinary and Atlas credentials are read from `.env` — yours are already filled in.
