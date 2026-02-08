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

