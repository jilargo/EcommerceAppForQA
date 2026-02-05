/*****************************************************
 * LOGIN FORM ELEMENT REFERENCES
 * Cache DOM elements once for performance and clarity
 *****************************************************/

// Reference to the login <form>
const loginForm = document.getElementById("loginForm");

// Reference to the error message container
const errorMsg = document.getElementById("errorMsg");


/*****************************************************
 * LOGIN FORM SUBMISSION HANDLER
 * Handles authentication using email + password
 * Backend returns user data + JWT token on success
 *****************************************************/
loginForm.addEventListener("submit", async (e) => {

    // Prevent browser default form submission (page reload)
    e.preventDefault();

    // Read user input values and remove leading/trailing spaces
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Hide error message before attempting login
    errorMsg.style.display = "none";

    try {
        /*************************************************
         * SEND LOGIN REQUEST TO BACKEND
         * JSON is used because no file upload is involved
         *************************************************/
        const response = await fetch("/login", {
            method: "POST",

            // Inform backend that JSON is being sent
            headers: { "Content-Type": "application/json" },

            // Convert JS object to JSON string
            body: JSON.stringify({ email, password })
        });

        // Parse backend response
        const result = await response.json();

        /*************************************************
         * HANDLE INVALID LOGIN
         * Backend usually responds with:
         * { message: "Invalid credentials" }
         *************************************************/
        if (!response.ok) {
            errorMsg.textContent = result.message || "Login failed";
            errorMsg.style.display = "block";
            return;
        }

        /*************************************************
         * SUCCESSFUL LOGIN
         * Backend returns:
         *  - user: safe user info (no password)
         *  - token: JWT used for protected routes
         *************************************************/

        // Store user info locally for UI usage
        localStorage.setItem(
            "currentUser",
            JSON.stringify(result.user)
        );

        // Store JWT token for authentication
        // This token is sent in Authorization headers later
        localStorage.setItem("token", result.token);

        // Redirect user to homepage/dashboard
        window.location.href = "index.html";

    } catch (err) {
        /*************************************************
         * NETWORK / SERVER ERROR
         * Happens when backend is down or unreachable
         *************************************************/
        console.error(err);
        errorMsg.textContent = "Server error, try again later.";
        errorMsg.style.display = "block";
    }
});
