// ==========================
// AUTH GUARD (frontend UX)
// ==========================
const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!token || !currentUser || currentUser.role !== "seller") {
    window.location.href = "login.html";
}

// ==========================
// DOM ELEMENTS
// ==========================
const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const nameInput = document.getElementById("productName");
const priceInput = document.getElementById("productPrice");
const productsList = document.getElementById("productsList");

// ==========================
// FETCH SELLER PRODUCTS
// ==========================
async function loadProducts() {
    const res = await fetch("/products", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const products = await res.json();
    productsList.innerHTML = "";

    products.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${p.name} - ₱${p.price}
            <button onclick="editProduct(${p.id}, '${p.name}', ${p.price})">Edit</button>
            <button onclick="deleteProduct(${p.id})">Delete</button>
        `;
        productsList.appendChild(li);
    });
}

// ==========================
// ADD / UPDATE PRODUCT
// ==========================
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        name: nameInput.value.trim(),
        price: priceInput.value
    };

    let url = "/products";
    let method = "POST";

    if (productIdInput.value) {
        url = `/products/${productIdInput.value}`;
        method = "PUT";
    }

    await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    productForm.reset();
    productIdInput.value = "";
    loadProducts();
});

// ==========================
// EDIT PRODUCT
// ==========================
function editProduct(id, name, price) {
    productIdInput.value = id;
    nameInput.value = name;
    priceInput.value = price;
}

// ==========================
// DELETE PRODUCT
// ==========================
async function deleteProduct(id) {
    await fetch(`/products/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    loadProducts();
}

// ==========================
// LOGOUT
// ==========================
document.getElementById("logoutBtn").onclick = () => {
    localStorage.clear();
    window.location.href = "login.html";
};

// Init
loadProducts();
