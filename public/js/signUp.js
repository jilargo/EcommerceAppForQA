// // // const avatarInput = document.getElementById('avatar');
// // // const avatarPreview = document.getElementById('avatarPreview');

// // // // Preview avatar when user selects a file
// // // avatarInput.addEventListener('change', () => {
// // //     const file = avatarInput.files[0];
// // //     if (!file) return;

// // //     const reader = new FileReader();
// // //     reader.onload = () => {
// // //         avatarPreview.src = reader.result;
// // //         avatarPreview.style.display = 'block';
// // //     };
// // //     reader.readAsDataURL(file);
// // // });

// // // document.getElementById('signupForm').addEventListener('submit', async function (e) {
// // //     e.preventDefault(); // Stop page reload

// // //     // 1️⃣ Create FormData and append all fields + avatar
// // //     const formData = new FormData();
// // //     formData.append("firstName", document.getElementById("firstName").value.trim());
// // //     formData.append("lastName", document.getElementById("lastName").value.trim());
// // //     formData.append("email", document.getElementById("email").value.trim());
// // //     formData.append("password", document.getElementById("password").value.trim());

// // //     const avatarFile = document.getElementById("avatar").files[0];
// // //     if (avatarFile) formData.append("avatar", avatarFile); // Must append BEFORE fetch

// // //     // 2️⃣ Basic validation (optional)
// // //     if (!formData.get("firstName") || !formData.get("lastName") || !formData.get("email") || !formData.get("password")) {
// // //         alert('All fields are required.');
// // //         return;
// // //     }

// // //     try {
// // //         // 3️⃣ Send FormData to backend
// // //         const response = await fetch("http://localhost:3000/signup", {
// // //             method: "POST",
// // //             body: formData // Important: do NOT set Content-Type manually
// // //         });

// // //         const result = await response.json();

// // //         if (!response.ok) {
// // //             alert(result.message);
// // //             return;
// // //         }

// // //         alert("Account created successfully!");
// // //         window.location.href = "login.html"; // Redirect after success

// // //     } catch (err) {
// // //         console.error(err);
// // //         alert("Server error, please try again.");
// // //     }
// // // });



// // //refractored code
// // const signupForm = document.getElementById('signupForm');
// // const avatarInput = document.getElementById('avatar');
// // const avatarPreview = document.getElementById('avatarPreview');

// // avatarInput.addEventListener('change', () => {
// //     const file = avatarInput.files[0];
// //     if (!file) return;

// //     const reader = new FileReader();
// //     reader.onload = () => {
// //         avatarPreview.src = reader.result;
// //         avatarPreview.style.display = 'block';
// //     };
// //     reader.readAsDataURL(file);
// // });

// // signupForm.addEventListener('submit', async (e) => {
// //     e.preventDefault();

// //     // ✅ Gather all form fields
// //     const formData = new FormData();
// //     formData.append("firstName", document.getElementById("firstName").value.trim());
// //     formData.append("lastName", document.getElementById("lastName").value.trim());
// //     formData.append("email", document.getElementById("email").value.trim());
// //     formData.append("password", document.getElementById("password").value.trim());

// //     const avatarFile = avatarInput.files[0];
// //     if (avatarFile) formData.append("avatar", avatarFile);

// //     // ✅ Validation
// //     for (let field of ["firstName", "lastName", "email", "password"]) {
// //         if (!formData.get(field)) {
// //             alert('All fields are required.');
// //             return;
// //         }
// //     }

// //     try {
// //         // ✅ Send FormData only here
// //         const response = await fetch("http://localhost:3000/signup", {
// //             method: "POST",
// //             body: formData
// //         });

// //         const result = await response.json();

// //         if (!response.ok) {
// //             alert(result.message || "Signup failed");
// //             return;
// //         }

// //         alert("Account created successfully!");
// //         window.location.href = "login.html";

// //     } catch (err) {
// //         console.error("Signup failed:", err);
// //         alert("Server error, please try again.");
// //     }
// // });




// const signupForm = document.getElementById("signupForm");
// const avatarInput = document.getElementById("avatar");
// const avatarPreview = document.getElementById("avatarPreview");

// // Avatar preview
// avatarInput.addEventListener("change", () => {
//     const file = avatarInput.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//         avatarPreview.src = reader.result;
//         avatarPreview.style.display = "block";
//     };
//     reader.readAsDataURL(file);
// });

// // Signup submission
// signupForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("firstName", document.getElementById("firstName").value.trim());
//     formData.append("lastName", document.getElementById("lastName").value.trim());
//     formData.append("email", document.getElementById("email").value.trim());
//     formData.append("password", document.getElementById("password").value.trim());

//     const avatarFile = avatarInput.files[0];
//     if (avatarFile) formData.append("avatar", avatarFile);

//     try {
//         const response = await fetch("/signup", { method: "POST", body: formData });
//         const result = await response.json();

//         if (!response.ok) return alert(result.message);

//         localStorage.setItem("currentUser", JSON.stringify(result.user));
//         localStorage.setItem("token", result.token);

//         alert("Signup successful!");
//         window.location.href = "index.html";
//     } catch (err) {
//         console.error(err);
//         alert("Server error, try again later.");
//     }
// });


/*****************************************************
 * SIGNUP FORM ELEMENT REFERENCES
 * Grab all required DOM elements once so we don’t
 * repeatedly query the DOM later
 *****************************************************/

// The signup <form> element
const signupForm = document.getElementById("signupForm");

// File input for avatar image
const avatarInput = document.getElementById("avatar");

// <img> element used to preview the avatar before upload
const avatarPreview = document.getElementById("avatarPreview");


/*****************************************************
 * AVATAR PREVIEW LOGIC
 * Allows the user to immediately see the selected
 * image before submitting the signup form
 *****************************************************/
avatarInput.addEventListener("change", () => {

    // Get the selected file from the file input
    const file = avatarInput.files[0];

    // If no file was selected, stop execution
    if (!file) return;

    // FileReader is used to read the file locally
    // without uploading it to the server
    const reader = new FileReader();

    // This runs once the file is successfully read
    reader.onload = () => {

        // Set the preview image source to the file data
        avatarPreview.src = reader.result;

        // Make sure the preview image is visible
        avatarPreview.style.display = "block";
    };

    // Convert the file to a base64 data URL
    reader.readAsDataURL(file);
});


/*****************************************************
 * SIGNUP FORM SUBMISSION HANDLER
 * Sends user data + avatar image to backend
 * using multipart/form-data (FormData)
 *****************************************************/
signupForm.addEventListener("submit", async (e) => {

    // Prevent default browser form submission (page reload)
    e.preventDefault();

    // FormData is required for file uploads
    // It automatically sets the correct Content-Type
    const formData = new FormData();

    // Append text fields to FormData
    formData.append(
        "firstName",
        document.getElementById("firstName").value.trim()
    );
    formData.append(
        "lastName",
        document.getElementById("lastName").value.trim()
    );
    formData.append(
        "email",
        document.getElementById("email").value.trim()
    );
    formData.append(
        "password",
        document.getElementById("password").value.trim()
    );

    // If an avatar image was selected, append it
    const avatarFile = avatarInput.files[0];
    if (avatarFile) {
        formData.append("avatar", avatarFile);
    }

    try {
        // Send signup request to backend
        // NOTE: Content-Type must NOT be set manually
        const response = await fetch("/signup", {
            method: "POST",
            body: formData
        });

        // Parse backend JSON response
        const result = await response.json();

        // If backend returns error status
        if (!response.ok) {
            alert(result.message);
            return;
        }

        /*************************************************
         * SUCCESSFUL SIGNUP
         * Backend returns:
         *  - user object (safe data)
         *  - JWT token
         *************************************************/

        // Store user info locally (for UI display)
        localStorage.setItem(
            "currentUser",
            JSON.stringify(result.user)
        );

        // Store JWT token (used for protected routes)
        localStorage.setItem("token", result.token);

        // Inform user and redirect to homepage
        alert("Signup successful!");
        window.location.href = "index.html";

    } catch (err) {
        // Network/server error
        console.error(err);
        alert("Server error, try again later.");
    }
});
