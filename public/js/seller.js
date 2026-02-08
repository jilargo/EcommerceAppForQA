/*****************************************************
 * AUTH HELPERS
 *****************************************************/
// const currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
 * APPLY LOGIN UI
 *****************************************************/
function applyLoginUI() {
  const user = getCurrentUser();
  if (!user) {
    forceLogin(); // If no user, redirect to login
    return;
  }

  // Hide login form and show logged-in state
  document.getElementById("loginForm")?.classList.add("d-none");
  document.getElementById("loggedInState")?.classList.remove("d-none");
  document.getElementById("cartNav")?.classList.remove("d-none");

  // Display user info
  document.getElementById("usernameDisplay").textContent = user.firstName;
  document.getElementById("sellerNameDisplay").textContent = user.firstName;


  //Search functionality and filter
  const searchInput = document.getElementById("searchInput");
const priceFilter = document.getElementById("priceFilter");
const searchBtn = document.getElementById("searchBtn");
const productsList = document.getElementById("productsList");

let products = []; // will hold all products fetched from server

async function fetchProducts() {
    try {
        const response = await fetch(`/products?sellerId=${currentUser.id}`);
        products = await response.json();
        displayProducts(products);
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}
function displayProducts(productsArray) {
    productsList.innerHTML = ""; // clear current list
    if (productsArray.length === 0) {
        productsList.innerHTML = `<p class="text-muted">No products found.</p>`;
        return;
    }

    productsArray.forEach(product => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p>Seller:${currentUser.firstName}</p>
            <h6>${product.name}</h6>
            <p>${product.price}</p>
            <div>
                <button class="btn btn-primary btn-sm editBtn" data-id="${product.id}">Edit</button>
                <button class="btn btn-danger btn-sm deleteBtn" data-id="${product.id}">Delete</button>
            </div>
        `;
        productsList.appendChild(li);
    });

    // Add event listeners for edit/delete
    document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", () => editProduct(btn.dataset.id));
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
    });
}
function filterProducts() {
    const keyword = searchInput.value.toLowerCase();
    const priceRange = priceFilter.value;

    let filtered = products;

    // Filter by keyword
    if (keyword) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword));
    }

    // Filter by price
    if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        filtered = filtered.filter(p => Number(p.price) >= min && Number(p.price) <= max);
    }

    displayProducts(filtered);
}
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    filterProducts();
});
window.addEventListener("DOMContentLoaded", () => {
    fetchProducts(); // fetch all products when page loads
});








  const profilePic = document.getElementById("profilePicDisplay");
  if (profilePic) {
    profilePic.src = user.avatar
      ? user.avatar.startsWith("/uploads")
        ? user.avatar
        : user.avatar // leave as is
      : "./images/default-avatar.png";

    profilePic.onerror = () => {
      profilePic.src = "./images/default-avatar.png";
    };
  }
}

/*****************************************************
 * LOGOUT HANDLER
 *****************************************************/
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  forceLogin();
});

/*****************************************************
 * PAGE LOAD
 *****************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  if (!token) {
    forceLogin();
    return;
  }

  applyLoginUI();
});

// Grab the file input and the preview image
const avatarInput = document.getElementById("ProductAvatar");
const avatarPreview = document.getElementById("ProductavatarPrev");

// Listen for file selection
avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0]; // Get the selected file
    if (!file) return; // Stop if no file selected

    const reader = new FileReader(); // Create FileReader

    reader.onload = () => {
        avatarPreview.src = reader.result; // Set preview
        avatarPreview.style.display = "block"; // Ensure visible
    };

    reader.readAsDataURL(file); // Read file as base64 URL
});


//fetch seller products
async function fetchSellerProducts() {
    try {
        const res = await fetch(`/products?sellerId=${currentUser.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

const productsList = document.getElementById("productsList");

// Get current user from localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Function to render products
async function loadProducts() {
    if (!currentUser) return;

    const res = await fetch(`/products?sellerId=${currentUser.id}`);
    const products = await res.json();

    // Clear current list
    productsList.innerHTML = "";

    products.forEach(prod => {
    const li = document.createElement("li");
    li.classList.add("card", "mb-2", "p-2");
    li.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="${prod.image}" alt="${prod.name}" style="width:60px; height:60px; object-fit:cover; margin-right:10px; border:1px solid #ccc">
            <div>
                <strong>${prod.name}</strong><br>
                $${prod.price}
            </div>
            <button class="btn btn-sm btn-primary ms-2" onclick="editProduct(${prod.id})">Edit</button>
            <button class="btn btn-sm btn-danger ms-2" onclick="deleteProduct(${prod.id})">Delete</button>
        </div>
    `;
    productsList.appendChild(li);
});

}

// Call loadProducts on page load
loadProducts();



// add edit product
const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById('productName').value);
    formData.append("price", document.getElementById('productPrice').value);
    formData.append("image", document.getElementById('ProductAvatar').files[0]);
    formData.append("sellerId", currentUser.id);

    const res = await fetch("/products", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    console.log(data);

    // Reset form
    productForm.reset();
    document.getElementById('ProductavatarPrev').src = './images/box.jpg';

    // Reload products
    loadProducts();
});

//edit/delete button
async function deleteProduct(id) {
    const res = await fetch(`/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    console.log(data);
    loadProducts(); // Refresh list after deletion
}
//Edit product
function editProduct(id) {
    // Fetch the product data from backend
    fetch(`/products?sellerId=${currentUser.id}`)
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id === id);
            if (!product) return;

            // Pre-fill the form
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('ProductavatarPrev').src = product.image;
        });
}

//price formatter
const productPriceInput = document.getElementById("productPrice");

productPriceInput.addEventListener("input", (e) => {
    // Remove anything that's not a number or dot
    let value = e.target.value.replace(/[^0-9.]/g, "");
    
    // Optional: limit to two decimals
    if (value.includes(".")) {
        const parts = value.split(".");
        parts[1] = parts[1].slice(0,2);
        value = parts.join(".");
    }

    // Add dollar sign
    e.target.value = value ? `$${value}` : "";
});

// Optional: on form submit, remove $ before sending to server

productForm.addEventListener("submit", (e) => {
    const priceInput = document.getElementById("productPrice");
    priceInput.value = priceInput.value.replace("$", "");
});
