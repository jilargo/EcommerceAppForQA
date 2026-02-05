// Get cart count element
const cartCountEl = document.getElementById("cartCount");

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart badge
function updateCartBadge() {
    cartCountEl.textContent = cart.length;
}

// Add to cart function
function addToCart(title, price) {
    const item = { title, price, quantity: 1 };

    // Check if item exists, increase quantity if it does
    const existingItem = cart.find(i => i.title === title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();

    alert(`${title} added to cart!`);
}

// Initialize badge on page load
updateCartBadge();
