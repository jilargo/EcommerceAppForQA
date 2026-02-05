/*****************************************************
 * DOM ELEMENT REFERENCES
 * These grab elements from the HTML so we can
 * manipulate UI states (show/hide/update content)
 *****************************************************/

// Loading spinner or loading UI
const loadingState = document.getElementById('loadingState');

// Empty state container (shown when no products exist)
const emptyState = document.getElementById('emptyState');

// Title text inside empty state
const emptyStateTitle = document.getElementById('emptyStateTitle');

// Grid container where product cards will be rendered
const productsGrid = document.getElementById('productsGrid');

// Search input field
const searchInput = document.getElementById('searchInput');

// Search button
const searchBtn = document.getElementById('searchBtn');

// Dropdown for price range filtering
const priceFilter = document.getElementById('priceFilter');

// Section header for "Popular Products"
// This is hidden when user searches
const popularSection = document.querySelector(
  '.products-section .text-center.mb-5'
);

// Optional text for showing search result info
const searchResultsText = document.getElementById('searchResultsText');


/*****************************************************
 * GLOBAL STATE
 *****************************************************/

// This will store ALL products fetched from products.json
// Used later for filtering/searching
let allProducts = [];


/*****************************************************
 * LOGIN CHECK ON PAGE LOAD
 * When the page finishes loading, we check if
 * a user is already logged in and update the UI
 *****************************************************/
document.addEventListener("DOMContentLoaded", loginSuccess);


/*****************************************************
 * FETCH PRODUCTS FROM JSON FILE
 * Loads products.json asynchronously
 *****************************************************/
const fetchProducts = async () => {
  try {
    // Fetch local JSON file (relative to index.html)
    const response = await fetch("./data/products.json");

    // If HTTP status is not OK (200–299), throw error
    if (!response.ok) {
      throw new Error("Failed to load products.json");
    }

    // Convert JSON response into JS object/array
    const products = await response.json();
    return products;

  } catch (error) {
    // Log error for debugging
    console.error("Error fetching products:", error);

    // Return empty array so app does not crash
    return [];
  }
};


/*****************************************************
 * RENDER PRODUCTS TO UI
 * Accepts an array of products and optionally
 * the search keyword for empty-state messaging
 *****************************************************/
const renderProducts = (products, keyword = '') => {

  // Clear existing products before rendering new ones
  productsGrid.innerHTML = '';

  // If there are no products to show
  if (!products.length) {

    // Show empty state UI
    emptyState.classList.remove('d-none');

    // Hide products grid
    productsGrid.classList.add('d-none');

    // Customize empty message
    emptyStateTitle.textContent = keyword
      ? `No "${keyword}" available`
      : 'No products available';

    return; // Stop execution here
  }

  // Hide empty state and show grid
  emptyState.classList.add('d-none');
  productsGrid.classList.remove('d-none');

  // Loop through each product
  products.forEach(p => {

    // Create wrapper column for Bootstrap grid
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-3 mb-4";

    // Build product card HTML
    card.innerHTML = `
      <div class="product-card card h-100">
        <img src="${p.image}" class="card-img-top" alt="${p.title}">
        <div class="card-body">
          <h6 class="card-title">${p.title}</h6>
          <p class="price">₱${p.price}</p>
          <button 
            class="btn btn-warning btn-sm"
            onclick="addToCart('${p.title}', ${p.price})">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    // Append card to products grid
    productsGrid.appendChild(card);
  });
};


/*****************************************************
 * SEARCH AND FILTER LOGIC
 * Filters products by keyword and price range
 *****************************************************/
const performSearch = () => {

  // Normalize keyword (lowercase + trim)
  const keyword = searchInput.value.toLowerCase().trim();

  // Get selected price range (example: "0-500")
  const price = priceFilter.value;

  // Hide "Popular Products" header when searching
  popularSection.style.display = 'none';

  // Clone full products list (avoid mutating original)
  let filtered = [...allProducts];

  // Filter by product title
  if (keyword) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(keyword)
    );
  }

  // Filter by price range
  if (price) {
    const [min, max] = price.split('-').map(Number);
    filtered = filtered.filter(p =>
      p.price >= min && p.price <= max
    );
  }

  // Re-render filtered products
  renderProducts(filtered, keyword);
};


/*****************************************************
 * INITIAL PAGE LOAD
 * Fetch products and render them immediately
 *****************************************************/
(async () => {
  allProducts = await fetchProducts();
  renderProducts(allProducts);
})();


/*****************************************************
 * SEARCH EVENT LISTENERS
 *****************************************************/

// Search button click
searchBtn.addEventListener('click', performSearch);

// Press Enter inside search input
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});


/*****************************************************
 * LOGIN UI STATE HANDLER
 * Updates UI when user is logged in
 *****************************************************/
function loginSuccess() {

  // Retrieve logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // If no user found, exit early
  if (!currentUser) return;

  // Hide login form
  document.getElementById("loginForm").classList.add("d-none");

  // Show logged-in UI elements
  document.getElementById("loggedInState").classList.remove("d-none");
  document.getElementById("cartNav").classList.remove("d-none");

  // Display user's first name
  document.getElementById("usernameDisplay").textContent =
    currentUser.firstName;

  // Display avatar (fallback if missing)
  document.getElementById("profilePicDisplay").src =
    currentUser.avatar || "./images/default-avatar.png";
}


/*****************************************************
 * ENSURE LOGIN STATE IS APPLIED ON LOAD
 *****************************************************/
document.addEventListener("DOMContentLoaded", () => {
  loginSuccess();
});


/*****************************************************
 * LOGOUT HANDLER
 * Clears auth data and redirects to login
 *****************************************************/
document.getElementById("logoutBtn").addEventListener("click", () => {

  // Remove user data and JWT
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");

  // Redirect user to login page
  window.location.href = "login.html";
});



//if not successful to be deleted
const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("user")); // <- match login storage key

// If no token or no user, force login
if (!token || !currentUser) {
  window.location.href = "login.html";
} else {
  // Logged-in UI
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("loggedInState").classList.remove("d-none");
  document.getElementById("cartNav").classList.remove("d-none");

  document.getElementById("usernameDisplay").textContent = currentUser.firstName;
  document.getElementById("profilePicDisplay").src = currentUser.avatar;
}

// Fetch protected dashboard data
(async () => {
  try {
    const res = await fetch("/dashboard", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard");
    }

    const data = await res.json();

    const welcomeEl = document.getElementById("welcomeMessage");
    if (welcomeEl) {
      welcomeEl.textContent = `Welcome ${data.message.split(" ")[1]}!`;
    }
  } catch (err) {
    console.error(err);

    // Token expired or invalid → reset auth
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // <- must match storage key

    window.location.href = "login.html";
  }
})();



/*****************************************************
 * FETCH PROTECTED DASHBOARD DATA
 * Sends JWT in Authorization header
 *****************************************************/
(async () => {
  try {
    const res = await fetch("/dashboard", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard");
    }

    const data = await res.json();
    console.log(data);

    // Example: display welcome message
    const welcomeEl = document.getElementById("welcomeMessage");
    if (welcomeEl) {
      welcomeEl.textContent =
        `Welcome ${data.message.split(" ")[1]}!`;
    }

  } catch (err) {
    console.error(err);

    // Token expired or invalid → reset auth
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    // Redirect to login
    window.location.href = "login.html";
  }
})();
