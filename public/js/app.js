/*****************************************************
 * DOM ELEMENT REFERENCES
 *****************************************************/
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const emptyStateTitle = document.getElementById("emptyStateTitle");
const productsGrid = document.getElementById("productsGrid");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const priceFilter = document.getElementById("priceFilter");

const popularSection = document.querySelector(
  ".products-section .text-center.mb-5"
);

const searchResultsText = document.getElementById("searchResultsText");



/*****************************************************
 * GLOBAL STATE
 *****************************************************/
let allProducts = [];


/*****************************************************
 * AUTH HELPERS
 *****************************************************/
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getToken() {
  return localStorage.getItem("token");
}

function forceLogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}


/*****************************************************
 * LOGIN UI HANDLER
 *****************************************************/
function applyLoginUI() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById("loginForm")?.classList.add("d-none");
  document.getElementById("loggedInState")?.classList.remove("d-none");
  document.getElementById("cartNav")?.classList.remove("d-none");

  document.getElementById("usernameDisplay").textContent = user.firstName;

  // Grab the profile picture element
  const profilePic = document.getElementById("profilePicDisplay");
  if (profilePic) {
    if (user.avatar) {
      // If avatar starts with "/uploads" (uploaded by user), use it as is
      // Otherwise, assume it's a normal image path and leave it
      profilePic.src = user.avatar.startsWith("/uploads")
        ? user.avatar
        : user.avatar; // no prepending
    } else {
      profilePic.src = "./images/default-avatar.png";
    }

    profilePic.onerror = () => {
      profilePic.src = "./images/default-avatar.png";
    };
  }

}




/*****************************************************
 * PAGE LOAD (⚠️ FIXED — NO REDIRECT HERE)
 *****************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  const user = getCurrentUser();

  // ✅ DO NOT redirect here
  // Public pages should load safely
  if (token && user) {
    applyLoginUI();
  }
});


/*****************************************************
 * LOGOUT
 *****************************************************/
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  forceLogin();
});


/*****************************************************
 * FETCH PRODUCTS
 *****************************************************/
async function fetchProducts() {
  try {
    const res = await fetch("./data/products.json");
    if (!res.ok) throw new Error("Failed to load products");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}


/*****************************************************
 * RENDER PRODUCTS
 *****************************************************/
function renderProducts(products, keyword = "") {
  productsGrid.innerHTML = "";

  if (!products.length) {
    emptyState.classList.remove("d-none");
    productsGrid.classList.add("d-none");
    emptyStateTitle.textContent = keyword
      ? `No "${keyword}" available`
      : "No products available";
    return;
  }

  emptyState.classList.add("d-none");
  productsGrid.classList.remove("d-none");

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-3 mb-4";

    card.innerHTML = `
      <div class="card h-100 product-card">
        <img src="${p.image}" class="card-img-top" alt="${p.title}">
        <div class="card-body">
          <h6 class="card-title">${p.title}</h6>
          <p class="price">₱${p.price}</p>
          <button class="btn btn-warning btn-sm"
            onclick="addToCart('${p.title}', ${p.price})">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });
}


/*****************************************************
 * SEARCH + FILTER
 *****************************************************/
function performSearch() {
  const keyword = searchInput.value.toLowerCase().trim();
  const priceRange = priceFilter.value;

  popularSection.style.display = "none";

  let filtered = [...allProducts];

  if (keyword) {
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(keyword)
    );
  }

  if (priceRange) {
    const [min, max] = priceRange.split("-").map(Number);
    filtered = filtered.filter(
      (p) => p.price >= min && p.price <= max
    );
  }

  renderProducts(filtered, keyword);
}


/*****************************************************
 * INITIAL LOAD
 *****************************************************/
(async () => {
  allProducts = await fetchProducts();
  renderProducts(allProducts);
})();


/*****************************************************
 * SEARCH EVENTS
 *****************************************************/
searchBtn?.addEventListener("click", performSearch);

searchInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});


