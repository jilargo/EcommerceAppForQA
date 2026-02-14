


// /*****************************************************
//  * SIGNUP FORM ELEMENT REFERENCES
//  * Grab all required DOM elements once so we don’t
//  * repeatedly query the DOM later
//  *****************************************************/

// // The signup <form> element
// const signupForm = document.getElementById("signupForm");

// // File input for avatar image
// const avatarInput = document.getElementById("avatar");

// // <img> element used to preview the avatar before upload
// const avatarPreview = document.getElementById("avatarPreview");


// /*****************************************************
//  * AVATAR PREVIEW LOGIC
//  * Allows the user to immediately see the selected
//  * image before submitting the signup form
//  *****************************************************/
// avatarInput.addEventListener("change", () => {

//     // Get the selected file from the file input
//     const file = avatarInput.files[0];

//     // If no file was selected, stop execution
//     if (!file) return;

//     // FileReader is used to read the file locally
//     // without uploading it to the server
//     const reader = new FileReader();

//     // This runs once the file is successfully read
//     reader.onload = () => {

//         // Set the preview image source to the file data
//         avatarPreview.src = reader.result;

//         // Make sure the preview image is visible
//         avatarPreview.style.display = "block";
//     };

//     // Convert the file to a base64 data URL
//     reader.readAsDataURL(file);
// });


// /*****************************************************
//  * SIGNUP FORM SUBMISSION HANDLER
//  * Sends user data + avatar image to backend
//  * using multipart/form-data (FormData)
//  *****************************************************/
// signupForm.addEventListener("submit", async (e) => {

//     // Prevent default browser form submission (page reload)
//     e.preventDefault();

//     // FormData is required for file uploads
//     // It automatically sets the correct Content-Type
//     const formData = new FormData();

//     // Append text fields to FormData
//     formData.append(
//         "firstName",
//         document.getElementById("firstName").value.trim()
//     );
//     formData.append(
//         "lastName",
//         document.getElementById("lastName").value.trim()
//     );
//     formData.append(
//         "email",
//         document.getElementById("email").value.trim()
//     );
//     formData.append(
//         "password",
//         document.getElementById("password").value.trim()
//     );

//     // If an avatar image was selected, append it
//     const avatarFile = avatarInput.files[0];
//     if (avatarFile) {
//         formData.append("avatar", avatarFile);
//     }

//     try {
//         // Send signup request to backend
//         // NOTE: Content-Type must NOT be set manually
//         const response = await fetch("/signup", {
//             method: "POST",
//             body: formData
//         });

//         // Parse backend JSON response
//         const result = await response.json();

//         // If backend returns error status
//         if (!response.ok) {
//             alert(result.message);
//             return;
//         }

//         /*************************************************
//          * SUCCESSFUL SIGNUP
//          * Backend returns:
//          *  - user object (safe data)
//          *  - JWT token
//          *************************************************/

//         // Store user info locally (for UI display)
//         localStorage.setItem(
//             "currentUser",
//             JSON.stringify(result.user)
//         );

//         // Store JWT token (used for protected routes)
//         localStorage.setItem("token", result.token);

//         // Inform user and redirect to homepage
//         alert("Signup successful!");
//         window.location.href = "index.html";

//     } catch (err) {
//         // Network/server error
//         console.error(err);
//         alert("Server error, try again later.");
//     }

// });
// const togglePassword = document.getElementById("togglePassword");
// const passwordInput = document.getElementById("password");
// const icon = togglePassword.querySelector("i");

// togglePassword.addEventListener("click", () => {
//     const isPassword = passwordInput.type === "password";
//     passwordInput.type = isPassword ? "text" : "password";
//     icon.className = isPassword ? "bi bi-eye-slash" : "bi bi-eye";
// });


//For Professional Validation

/*****************************************************
 * SIGNUP FORM ELEMENT REFERENCES
 *****************************************************/
const signupForm = document.getElementById("signupForm");
const avatarInput = document.getElementById("avatar");
const avatarPreview = document.getElementById("avatarPreview");

/*****************************************************
 * POPUP HELPER
 *****************************************************/
const popup = document.getElementById("popup");
let popupTimer;

function showPopup(message, type = "error") {
    clearTimeout(popupTimer);

    popup.textContent = message;
    popup.className = `popup show ${type}`;

    popupTimer = setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
}

/*****************************************************
 * SIMPLE VALIDATION RULES (NO UI DAMAGE)
 *****************************************************/
const nameRegex = /^[A-Za-z\s'-]{2,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

/*****************************************************
 * AVATAR PREVIEW
 *****************************************************/
avatarInput.addEventListener("change", () => {
    const file = avatarInput.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        avatarInput.value = "";
        showPopup("Profile picture must be an image");
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        avatarInput.value = "";
        showPopup("Profile picture must be under 2MB");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        avatarPreview.src = reader.result;
        avatarPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
});

/*****************************************************
 * SIGNUP FORM SUBMISSION
 *****************************************************/
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const email     = document.getElementById("email").value.trim();
    const password  = document.getElementById("password").value;

    // FRONTEND VALIDATION (SILENT, CLEAN)
    if (!nameRegex.test(firstName))
        return showPopup("Invalid first name");

    if (!nameRegex.test(lastName))
        return showPopup("Invalid last name");

    if (!emailRegex.test(email))
        return showPopup("Invalid email address");

    if (!passwordRegex.test(password))
        return showPopup(
            "Password must be 8+ chars with upper, lower, number & symbol"
        );

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);

    if (avatarInput.files[0]) {
        formData.append("avatar", avatarInput.files[0]);
    }

    try {
        showPopup("Creating account...", "info");

        const response = await fetch("/signup", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            showPopup(result.message || "Signup failed");
            return;
        }

        // STORE USER DATA
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);

        showPopup("Signup successful!", "success");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);

    } catch (err) {
        console.error(err);
        showPopup("Server error. Try again later.");
    }
});

/*****************************************************
 * TOGGLE PASSWORD VISIBILITY
 *****************************************************/
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const icon = togglePassword.querySelector("i");

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    icon.className = isPassword ? "bi bi-eye-slash" : "bi bi-eye";
});


