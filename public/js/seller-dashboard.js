//const sqlite3 = require("sqlite3").verbose();




// Listen to changes on the correct input
const productAvatarInput = document.getElementById("ProductAvatar");
const productAvatarPreview = document.getElementById("ProductavatarPrev");
const uploadLabel = document.querySelector(".upload-label"); // the label wrapping input

// Make sure clicking the label opens the file picker
uploadLabel.addEventListener("click", () => {
    productAvatarInput.click();
});

// Preview selected image
productAvatarInput.addEventListener("change", () => {
    const file = productAvatarInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        productAvatarPreview.src = reader.result;
        productAvatarPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
});







module.exports = (db, authenticateToken, authorizeSeller) => {
    const express = require("express");
    const router = express.Router();

    /*****************************************************
     * DATABASE SETUP (Products table only)
     *****************************************************/
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id INTEGER,
            name TEXT,
            price REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) console.error("Error creating products table:", err);
    });

    /*****************************************************
     * PRODUCTS CRUD ROUTES
     *****************************************************/
    // CREATE a new product
    router.post("/products", authenticateToken, authorizeSeller, (req, res) => {
        const { name, price } = req.body;
        db.run(
            "INSERT INTO products (seller_id, name, price) VALUES (?, ?, ?)",
            [req.user.id, name, price],
            function (err) {
                if (err) return res.status(500).json({ message: "Database error" });
                res.json({ message: "Product added", id: this.lastID });
            }
        );
    });

    // READ all products for the logged-in seller
    router.get("/products", authenticateToken, authorizeSeller, (req, res) => {
        db.all("SELECT * FROM products WHERE seller_id = ?", [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json(rows);
        });
    });

    // UPDATE a product
    router.put("/products/:id", authenticateToken, authorizeSeller, (req, res) => {
        const { name, price } = req.body;
        db.run(
            "UPDATE products SET name = ?, price = ? WHERE id = ? AND seller_id = ?",
            [name, price, req.params.id, req.user.id],
            function () {
                if (this.changes === 0) return res.status(403).json({ message: "Not allowed" });
                res.json({ message: "Updated" });
            }
        );
    });

    // DELETE a product
    router.delete("/products/:id", authenticateToken, authorizeSeller, (req, res) => {
        db.run(
            "DELETE FROM products WHERE id = ? AND seller_id = ?",
            [req.params.id, req.user.id],
            function () {
                if (this.changes === 0) return res.status(403).json({ message: "Not allowed" });
                res.json({ message: "Deleted" });
            }
        );
    });

    return router;
};
