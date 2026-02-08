


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
