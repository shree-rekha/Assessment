/**
 * ABOKICHI E-Commerce - Main Application Logic
 * Handles cart, filters, product rendering, and page initialization
 */

(function() {
  'use strict';

  // ====================================
  // Cart Management
  // ====================================
  
  function getCartCount() {
    return Number(localStorage.getItem('cartCount') || 0);
  }

  function setCartCount(count) {
    localStorage.setItem('cartCount', String(count));
    updateCartCount();
  }

  function incrementCart() {
    setCartCount(getCartCount() + 1);
  }

  function updateCartCount() {
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
      cartBadge.textContent = getCartCount();
    }
  }

  // ====================================
  // Utility Functions
  // ====================================

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function getStarIcons(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? '★' : '☆';
    }
    return stars;
  }

  // ====================================
  // Product Rendering
  // ====================================

  function renderProductsGrid(products, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
      const card = document.createElement('a');
      card.className = 'prod-card';
      card.href = `product.html?id=${product.id}`;
      
      const oldPriceHtml = product.oldPrice 
        ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` 
        : '';
      
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p class="price">$${product.price.toFixed(2)} ${oldPriceHtml}</p>
        <div class="stars">
          <span class="star-icons">${getStarIcons(product.rating)}</span>
          <span class="muted">${product.reviews} Reviews</span>
        </div>
      `;
      
      container.appendChild(card);
    });
  }

  // ====================================
  // Products Page
  // ====================================

  function initProductsPage() {
    if (!window.PRODUCTS) return;
    
    updateCartCount();
    
    const productsList = document.getElementById('products-list');
    const sortSelect = document.getElementById('sort-select');
    const productCount = document.getElementById('product-count');
    
    function applyFilters() {
      let filteredProducts = window.PRODUCTS.slice();
      
      // Category filter
      const selectedCategories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
      ).map(input => input.value);
      
      if (selectedCategories.length) {
        filteredProducts = filteredProducts.filter(
          p => selectedCategories.includes(p.category)
        );
      }
      
      // Type filter (Single Pack / Multi Set)
      const selectedTypes = Array.from(
        document.querySelectorAll('input[name="type"]:checked')
      ).map(input => input.value);
      
      if (selectedTypes.length) {
        filteredProducts = filteredProducts.filter(
          p => selectedTypes.includes(p.type)
        );
      }
      
      // Rating filter
      const selectedRatings = Array.from(
        document.querySelectorAll('input[name="rating"]:checked')
      ).map(input => Number(input.value));
      
      if (selectedRatings.length) {
        const minRating = Math.min(...selectedRatings);
        filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
      }
      
      // Sorting
      const sortValue = sortSelect ? sortSelect.value : 'alpha-asc';
      
      switch (sortValue) {
        case 'alpha-asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'alpha-desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
          filteredProducts.sort((a, b) => {
            const ratingDiff = b.rating - a.rating;
            return ratingDiff !== 0 ? ratingDiff : b.reviews - a.reviews;
          });
          break;
      }
      
      // Update product count display
      if (productCount) {
        productCount.textContent = `(${filteredProducts.length})`;
      }
      
      // Render filtered products
      renderProductsGrid(filteredProducts, productsList);
    }

    // Attach filter event listeners
    document.querySelectorAll('input[name="category"]').forEach(
      cb => cb.addEventListener('change', applyFilters)
    );
    document.querySelectorAll('input[name="type"]').forEach(
      cb => cb.addEventListener('change', applyFilters)
    );
    document.querySelectorAll('input[name="rating"]').forEach(
      cb => cb.addEventListener('change', applyFilters)
    );
    
    if (sortSelect) {
      sortSelect.addEventListener('change', applyFilters);
    }

    // Initial render
    applyFilters();
  }

  // ====================================
  // Product Detail Page
  // ====================================

  function initProductDetailPage() {
    updateCartCount();
    
    const productId = Number(getQueryParam('id'));
    if (!productId) return;
    
    const product = window.PRODUCTS.find(p => p.id === productId);
    const container = document.getElementById('product-detail');
    
    if (!product || !container) return;
    
    container.innerHTML = `
      <div style="flex:1">
        <img src="${product.img}" alt="${product.name}">
      </div>
      <div style="flex:1">
        <h2>${product.name}</h2>
        <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
        <p><strong>Rating:</strong> ${product.rating}</p>
        <p>${product.description}</p>
        <div style="margin-top:12px">
          <button id="add-cart" class="btn">Add to Cart</button>
          <button id="buy-now" class="btn" style="background:#28a745;margin-left:8px">Buy Now</button>
        </div>
      </div>
    `;

    document.getElementById('add-cart').addEventListener('click', () => {
      incrementCart();
      alert('Added to cart');
    });
    
    document.getElementById('buy-now').addEventListener('click', () => {
      window.location.href = 'order.html';
    });
  }

  // ====================================
  // Order Page
  // ====================================

  function initOrderPage() {
    // Clear cart after order is placed
    localStorage.setItem('cartCount', '0');
    updateCartCount();
  }

  // ====================================
  // Filter Panel Toggle
  // ====================================

  function initFilterToggle() {
    const filterToggle = document.getElementById('filter-toggle');
    const filterPanel = document.getElementById('filter-panel');
    
    if (filterToggle && filterPanel) {
      filterToggle.addEventListener('click', () => {
        filterPanel.classList.toggle('active');
        filterToggle.classList.toggle('active');
      });
    }
  }

  // ====================================
  // Product Detail - Tabs
  // ====================================

  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length) {
      tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const tabId = this.dataset.tab;
          
          // Remove active from all
          tabBtns.forEach(b => b.classList.remove('active'));
          tabPanes.forEach(p => p.classList.remove('active'));
          
          // Add active to clicked
          this.classList.add('active');
          document.getElementById(tabId).classList.add('active');
        });
      });
    }
  }

  // ====================================
  // Product Detail - Thumbnail Gallery
  // ====================================

  function initThumbnailGallery() {
    const thumbs = document.querySelectorAll('.thumb');
    const mainImg = document.getElementById('main-product-img');
    
    if (thumbs.length && mainImg) {
      thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
          thumbs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          mainImg.src = this.src;
        });
      });
    }
  }

  // ====================================
  // Product Detail - Add to Cart Button
  // ====================================

  function initAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart');
    
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', function() {
        incrementCart();
        
        // Visual feedback
        this.textContent = 'ADDED!';
        this.style.background = '#0b5a3a';
        this.style.color = '#fff';
        
        setTimeout(() => {
          this.textContent = 'ADD TO CART';
          this.style.background = '#fff';
          this.style.color = '#333';
        }, 1500);
      });
    }
  }

  // ====================================
  // Product Detail - Buy Now Button
  // ====================================

  function initBuyNowButton() {
    const buyNowBtn = document.getElementById('buy-now');
    
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        window.location.href = 'order.html';
      });
    }
  }

  // ====================================
  // Page Initialization
  // ====================================

  function init() {
    // Detect current page
    const path = window.location.pathname.split('/').pop();
    
    // Initialize page-specific functionality
    if (path === 'products.html') {
      initProductsPage();
    }
    
    if (path === 'product.html') {
      initProductDetailPage();
    }
    
    if (path === 'order.html') {
      initOrderPage();
    }
    
    // Initialize common functionality
    updateCartCount();
    initFilterToggle();
    initTabs();
    initThumbnailGallery();
    initAddToCartButton();
    initBuyNowButton();
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
