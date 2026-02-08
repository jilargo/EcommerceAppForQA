// /*****************************************************
//  * DOM ELEMENT REFERENCES
//  *****************************************************/
// const loadingState = document.getElementById("loadingState");
// const emptyState = document.getElementById("emptyState");
// const emptyStateTitle = document.getElementById("emptyStateTitle");


// const searchInput = document.getElementById("searchInput");
// const searchBtn = document.getElementById("searchBtn");
// const priceFilter = document.getElementById("priceFilter");

// const popularSection = document.querySelector(
//   ".products-section .text-center.mb-5"
// );

// const searchResultsText = document.getElementById("searchResultsText");



// /*****************************************************
//  * GLOBAL STATE
//  *****************************************************/



// /*****************************************************
//  * AUTH HELPERS
//  *****************************************************/
// function getCurrentUser() {
//   return JSON.parse(localStorage.getItem("currentUser"));
// }

// function getToken() {
//   return localStorage.getItem("token");
// }

// function forceLogin() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("currentUser");
//   window.location.href = "login.html";
// }


// /*****************************************************
//  * LOGIN UI HANDLER
//  *****************************************************/
// function applyLoginUI() {
//   const user = getCurrentUser();
//   if (!user) return;

//   document.getElementById("loginForm")?.classList.add("d-none");
//   document.getElementById("loggedInState")?.classList.remove("d-none");
//   document.getElementById("cartNav")?.classList.remove("d-none");

//   document.getElementById("usernameDisplay").textContent = user.firstName;

//   // Grab the profile picture element
//   const profilePic = document.getElementById("profilePicDisplay");
//   if (profilePic) {
//     if (user.avatar) {
//       // If avatar starts with "/uploads" (uploaded by user), use it as is
//       // Otherwise, assume it's a normal image path and leave it
//       profilePic.src = user.avatar.startsWith("/uploads")
//         ? user.avatar
//         : user.avatar; // no prepending
//     } else {
//       profilePic.src = "./images/default-avatar.png";
//     }

//     profilePic.onerror = () => {
//       profilePic.src = "./images/default-avatar.png";
//     };
//   }

// }




// /*****************************************************
//  * PAGE LOAD (⚠️ FIXED — NO REDIRECT HERE)
//  *****************************************************/
// document.addEventListener("DOMContentLoaded", () => {
//   const token = getToken();
//   const user = getCurrentUser();

//   // ✅ DO NOT redirect here
//   // Public pages should load safely
//   if (token && user) {
//     applyLoginUI();
//   }
// });


// /*****************************************************
//  * LOGOUT
//  *****************************************************/
// document.getElementById("logoutBtn")?.addEventListener("click", () => {
//   forceLogin();
// });


// /*****************************************************
//  * FETCH PRODUCTS
//  *****************************************************/

// const productsList = document.getElementById("productsList");


// /*****************************************************
//  * GLOBAL STATE
//  *****************************************************/
// let allProducts = [];

// /*****************************************************
//  * FETCH PRODUCTS
//  *****************************************************/
// async function fetchProducts() {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     if (!currentUser) return; // exit if not logged in
//     try {
//         const response = await fetch(`/products?sellerId=${currentUser.id}`);
//         const data = await response.json();
//         displayProducts(data);
//         allProducts = data; // store globally for search/filter
//     } catch (err) {
//         console.error("Error fetching products:", err);
//     }
// }
//  // for search/filter



// /*****************************************************
//  * DISPLAY PRODUCTS
//  *****************************************************/
// function displayProducts(productsArray) {
//     const productsList = document.getElementById("productsList");
//     productsList.innerHTML = "";

//     if (!productsArray.length) {
//         productsList.innerHTML = `<div class="col-12 text-center"><p class="text-muted">No products available</p></div>`;
//         return;
//     }

//     productsArray.forEach((product) => {
//         const col = document.createElement("div");
//         col.className = "col-md-6 col-lg-3 mb-4";

//         col.innerHTML = `
//           <div class="card h-100 shadow-sm">
//             <img src="${product.image}" class="card-img-top" alt="${product.name}">
//             <div class="card-body d-flex flex-column">
//               <h6 class="card-title">${product.name}</h6>
//               <p class="price">$${product.price}</p>
//               <button class="btn btn-warning btn-sm mt-auto">Add to Cart</button>
//             </div>
//           </div>
//         `;
//         productsList.appendChild(col);
//     });
// }


//   // Event delegation for dynamic buttons
//   productsList.addEventListener("click", (e) => {
//     if (e.target.classList.contains("addToCartBtn")) {
//       const productId = e.target.dataset.id;
//       const product = productsArray.find(p => p.id == productId);
//       alert(`Added "${product.name}" to cart!`);
//       // Here you can call your addToCart(product) function
//     }
//   });


// /*****************************************************
//  * SEARCH + FILTER
//  *****************************************************/
// function performSearch() {
//   const keyword = searchInput.value.toLowerCase().trim();
//   const priceRange = priceFilter.value;

//   popularSection.style.display = "none";

//   let filtered = [...allProducts];

//   if (keyword) {
//     filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword));
//   }

//   if (priceRange) {
//     const [min, max] = priceRange.split("-").map(Number);
//     filtered = filtered.filter(p => Number(p.price) >= min && Number(p.price) <= max);
//   }

  
// }

// /*****************************************************
//  * INITIAL LOAD
//  *****************************************************/
// document.addEventListener("DOMContentLoaded", () => {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     if (!currentUser) return; // optional: show login first
//     fetchProducts();



//   searchBtn?.addEventListener("click", performSearch);
//   searchInput?.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") performSearch();
//   });
// });



// /****************************************************
//  * SEARCH + FILTER
//  *****************************************************/



// /*****************************************************
//  * INITIAL LOAD
//  *****************************************************/
// (async () => {
//   allProducts = await fetchProducts();
//   displayProducts(allProducts);
// })();


// /*****************************************************
//  * SEARCH EVENTS
//  *****************************************************/
// searchBtn?.addEventListener("click", performSearch);

// searchInput?.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") performSearch();
// });


/*****************************************************
 * DOM ELEMENT REFERENCES
 *****************************************************/
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const emptyStateTitle = document.getElementById("emptyStateTitle");
const productsList = document.getElementById("productsList");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const priceFilter = document.getElementById("priceFilter");

const popularSection = document.querySelector(".products-section .text-center.mb-5");
const searchResultsText = document.getElementById("searchResultsText");
const cartCount = document.getElementById("cartCount");
const cartDropdown = document.getElementById("cartDropdown");

/*****************************************************
 * GLOBAL STATE
 *****************************************************/
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

    const profilePic = document.getElementById("profilePicDisplay");
    if (profilePic) {
        profilePic.src = user.avatar ? user.avatar : "./images/default-avatar.png";
        profilePic.onerror = () => (profilePic.src = "./images/default-avatar.png");
    }
}

/*****************************************************
 * LOGOUT
 *****************************************************/
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    forceLogin();
});

/*****************************************************
 * CART FUNCTIONS
 *****************************************************/
// function updateCartCount() {
//     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//     cartCount.textContent = totalItems;
//     if (totalItems > 0) {
//         document.getElementById("cartNav").classList.remove("d-none");
//     } else {
//         document.getElementById("cartNav").classList.add("d-none");
//     }
// }
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Show/hide cart in navbar
  if (totalItems > 0) {
    document.getElementById("cartNav").classList.remove("d-none");
  } else {
    document.getElementById("cartNav").classList.add("d-none");
  }
  renderCartDropdown();
}
function renderCartDropdown() {
  cartDropdown.innerHTML = "";

  if (cart.length === 0) {
    const li = document.createElement("li");
    li.className = "text-center text-muted";
    li.textContent = "Your cart is empty.";
    cartDropdown.appendChild(li);
    return;
  }

  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "d-flex align-items-center justify-content-between mb-2";

    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.image}" alt="${item.name}" class="cart-thumb me-2">
        <div>
          <strong>${item.name}</strong><br>
          <small>$${item.price} x ${item.quantity}</small>
        </div>
      </div>
      <button class="btn btn-sm btn-danger removeCartBtn" data-id="${item.id}">&times;</button>
    `;
    cartDropdown.appendChild(li);
  });

  // Add Checkout button at bottom
  const checkout = document.createElement("li");
  checkout.className = "mt-2 text-center";
  checkout.innerHTML = `<a href="cart.html" class="btn btn-warning btn-sm w-100">Check out</a>`;
  cartDropdown.appendChild(checkout);


  // Add Checkout button at bottom
  // const checkout = document.createElement("li");
  // checkout.className = "mt-2 text-center";
  // checkout.innerHTML = `<a href="cart.html" class="btn btn-warning btn-sm w-100">Go to Cart</a>`;
  // cartDropdown.appendChild(checkout);
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Add to cart
function addToCart(productId) {
  const product = allProducts.find(p => p.id == productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id == productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
}

// Remove from cart
cartDropdown.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeCartBtn")) {
    const id = e.target.dataset.id;
    cart = cart.filter(item => item.id != id);
    saveCart();
  }
});

// Initialize
updateCartCount();

// function saveCart() {
//     localStorage.setItem("cart", JSON.stringify(cart));
//     updateCartCount();
// }

// function addToCart(productId) {
//     const product = allProducts.find(p => p.id == productId);
//     if (!product) return;

//     const existingItem = cart.find(item => item.id == productId);
//     if (existingItem) {
//         existingItem.quantity += 1;
//     } else {
//         cart.push({ ...product, quantity: 1 });
//     }

//     saveCart();
//     alert(`Added "${product.name}" to cart!`);
// }

// // Initialize cart badge
// updateCartCount();

/*****************************************************
 * FETCH PRODUCTS
 *****************************************************/
async function fetchProducts() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    try {
        const response = await fetch(`/products?sellerId=${currentUser.id}`);
        const data = await response.json();
        allProducts = data; // store globally for search/filter
        return data;
    } catch (err) {
        console.error("Error fetching products:", err);
        return [];
    }
}

/*****************************************************
 * DISPLAY PRODUCTS
 *****************************************************/
function displayProducts(productsArray) {
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = "";

    const currentUser = getCurrentUser(); // get current logged-in user

    if (!productsArray.length) {
        productsList.innerHTML = `<div class="col-12 text-center"><p class="text-muted">No products available</p></div>`;
        return;
    }

    productsArray.forEach((product) => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-3 mb-4";

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="object-fit: cover; height: 200px;">
                
                <div class="card-body d-flex flex-column">
                    <p class="text-muted mb-1">Seller: ${currentUser.firstName}</p>
                    <h6 class="card-title">${product.name}</h6>
                    <p class="price">$${product.price}</p>
                    <button class="btn btn-warning btn-sm mt-auto addToCartBtn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;

        productsList.appendChild(col);
    });
}

/*****************************************************
 * EVENT DELEGATION FOR ADD TO CART
 *****************************************************/
productsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("addToCartBtn")) {
        const productId = e.target.dataset.id;
        addToCart(productId);
    }
});

/*****************************************************
 * SEARCH + FILTER
 *****************************************************/
function performSearch() {
    const keyword = searchInput.value.toLowerCase().trim();
    const priceRange = priceFilter.value;

    popularSection.style.display = "none";

    let filtered = [...allProducts];

    if (keyword) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword));
    }

    if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        filtered = filtered.filter(p => Number(p.price) >= min && Number(p.price) <= max);
    }

    displayProducts(filtered);
}

/*****************************************************
 * INITIAL LOAD
 *****************************************************/
document.addEventListener("DOMContentLoaded", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    applyLoginUI();

    const products = await fetchProducts();
    displayProducts(products);

    searchBtn?.addEventListener("click", performSearch);
    searchInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });
});

