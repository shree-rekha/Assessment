# ABOKICHI E-Commerce Demo Store

A modern, responsive e-commerce website for Japanese food products.

## Features

- **Homepage** - Hero section, feature bar, best sellers, promo video, newsletter signup
- **Products Page** - Product grid with filtering (category, type, rating) and sorting
- **Product Detail Page** - Image gallery, tabs, add to cart functionality
- **Order Confirmation** - Success page after purchase
- **Cart Counter** - Persistent cart count using localStorage

## How to Run

1. Open `index.html` in your browser (no server required)
2. Navigate using the site header or click on products
3. Use filters and sorting on the products page
4. Add items to cart and proceed to checkout

## Project Structure

```
website/
├── index.html          # Homepage
├── products.html       # Product listing page
├── product.html        # Product detail page
├── order.html          # Order confirmation page
├── README.md           # This file
└── assets/
    ├── css/
    │   └── styles.css  # All styles (organized by section)
    ├── img/            # Images and icons
    │   ├── bestseller 1-4.jpg
    │   ├── img 1.png, img 2.png
    │   ├── promo.jpg
    │   ├── Story.jpg, Recipes.jpg
    │   └── *.svg       # Icons
    └── js/
        ├── data.js     # Product data array
        └── app.js      # Application logic
```

## Technologies

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Google Fonts (Raleway, Source Sans Pro)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
