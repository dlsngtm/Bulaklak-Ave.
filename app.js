/* app.js */
// Smooth scrolling for navigation links
document.querySelectorAll('.menuList a').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Shop Now button functionality
document.querySelector('.shop-now')?.addEventListener('click', () => {
  const shopSection = document.getElementById('shop');
  if (shopSection) {
    shopSection.scrollIntoView({ behavior: 'smooth' });
  }
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    // You can add cart functionality here
    alert('Product added to cart!');
  });
});

// Summer collection shop now button
document.querySelector('.summer-collection .shop-now')?.addEventListener('click', () => {
  const shopSection = document.getElementById('shop');
  if (shopSection) {
    shopSection.scrollIntoView({ behavior: 'smooth' });
  }
});