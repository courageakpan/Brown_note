# Brown Note Perfume Store

A web-based perfume store featuring an interactive shop, admin product management, and promo campaigns.

---

## Features

- **Shop Page**  
  - Browse perfumes alphabetically by brand.  
  - View fragrance details, prices, and sizes.  
  - Wishlist feature with ♥/♡ toggle.  

- **Admin Panel** (Hidden)  
  - Accessible via `index.html#admin` or long-pressing the logo.  
  - Add, edit, or delete products.  
  - Upload product images via modal or drag & drop.  
  - Set product prices, sizes, notes, and descriptions.  

- **Promo & Sales System**  
  - Create campaigns with custom hero color, banner, and countdown.  
  - Apply discounts globally or to selected products.  

- **UI Enhancements**  
  - Smooth cursor animation.  
  - Scroll reveal effects.  
  - Toast notifications for user actions.  

---

## Admin Access

- Admin page is protected by a password (base64 encoded in the code).  
- Normal users **cannot** edit products or upload images.  

---

## Setup & Run

1. Clone or download the repository.  
2. Open `index.html` in a browser.  
3. To access admin features:  
   - Append `#admin` to the URL (`index.html#admin`) or  
   - Long-press the logo (configured in JS).  

---

## License

For internal use only. Do not distribute without permission.