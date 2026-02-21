

/****************************************************
 * IMPORT CORE DEPENDENCIES
 ****************************************************/
const express = require("express");
const path = require("path");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");



/****************************************************
 * APP & CONFIGURATION
 ****************************************************/
const app = express();
const PORT = 3000;
const SECRET_KEY = "your_super_secret_key"; // change in production


/****************************************************
 * MIDDLEWARE
 ****************************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));
//$env:TEST_DB_PATH="C:\Htdocs\Ecommerce\EcommerceAppForQA\test\test-data\databaseForTest.db"

/****************************************************
 * DATABASE SETUP (SQLite)
 ****************************************************/

//Decide which database file to use

/*Check environment variable If Playwright starts your server like this:
 TEST_DB_PATH=some/path node server.js
Then this variable exists.
Then this variable exists.
node server.js it does not exist
the trigger is found in package.json "scripts:"

*/
const dbPath = process.env.TEST_DB_PATH
//path.resolve() convertes relative paths to absolute path ../test/test-data/databaseForTest.db becomes ../test/test-data/databaseForTest.db
  ? path.resolve(process.env.TEST_DB_PATH)
  : path.resolve(__dirname, "../server/database.db");

  console.log("SERVER DB PATH:", process.env.TEST_DB_PATH);
console.log("Resolved SERVER DB:", dbPath);
console.log("SERVER CWD:", process.cwd());

//const db = new sqlite3.Database("./database.db");

// Create SQLite connection using resolved absolute path
const db = new sqlite3.Database(dbPath);
console.log("Using DB:", dbPath);


// db.serialize(() => {
//     db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
//         if (err) {
//             console.error("Error fetching tables:", err);
//             return;
//         }

//         tables.forEach((table) => {
//             const tableName = table.name;
//             if (tableName === "sqlite_sequence") return; // skip internal table

//             db.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
//                 if (err) {
//                     console.error(`Failed to drop table ${tableName}:`, err);
//                 } else {
//                     console.log(`Dropped table: ${tableName}`);
//                 }
//             });
//         });
//     });
// });
// Users table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        avatar TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);
db.run (`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER,
    name TEXT,
    price REAL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id)
)`);

/****************************************************
 * AUTH MIDDLEWARE
 ****************************************************/
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

/****************************************************
 * FILE UPLOAD SETUP (MULTER)
 ****************************************************/
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOADS_DIR));
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });





/****************************************************
 * ROUTES
 ****************************************************/


// Signup
app.post("/signup", upload.single("avatar"), async (req, res) => {
    try {
        // Use fallback to handle missing fields gracefully
        const firstName = req.body.firstName || req.body.first_name;
        const lastName = req.body.lastName || req.body.last_name;
        const email = req.body.email;
        const password = req.body.password;
        const avatarFile = req.file;

        if (!firstName || !lastName || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Avatar path fallback
        const avatarPath = avatarFile ? `/uploads/${avatarFile.filename}` : "/images/default-avatar.png";

        // Insert user into DB
        const sql = `INSERT INTO users (first_name, last_name, email, password, avatar) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [firstName, lastName, email, hashedPassword, avatarPath], function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint")) 
                    return res.status(400).json({ message: "Email already exists" });

                console.error("DB INSERT ERROR:", err);
                return res.status(500).json({ message: "Database error" });
            }

            // Generate JWT token
            const token = jwt.sign({ id: this.lastID, email, role: "user" }, SECRET_KEY, { expiresIn: "1h" });

            res.status(201).json({
                message: "User registered successfully",
                user: { id: this.lastID, firstName, lastName, email, avatar: avatarPath, role: "user" },
                token
            });
        });
    } catch (err) {
        console.error("SIGNUP ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/signup", (req, res) => {
  res.redirect("/signup.html");
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ message: "You must have an account" });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid email or password" });

        const userData = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            avatar: user.avatar,
            role: user.role
        };

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ user: userData, token });
    });
});
app.get("/login", (req, res) => {
  res.redirect("/login.html");
});



// Get products for seller
// app.get("/products", (req, res) => {
//     const sellerId = req.query.sellerId;
//     db.all("SELECT * FROM products WHERE seller_id = ?", [sellerId], (err, rows) => {
//         if (err) return res.status(500).json({ message: "DB error" });
//         res.json(rows);
//     });
// });
app.get("/products", authMiddleware, (req, res) => {
    db.all(
        `SELECT 
            p.*, 
            u.first_name AS sellerFirstName, 
            u.last_name AS sellerLastName
         FROM products p
         JOIN users u ON p.seller_id = u.id`,
        (err, rows) => {
            if (err) return res.status(500).json({ message: "DB error" });
            res.json(rows);
        }
    );
});

// Add product
// app.post("/products", upload.single("image"), (req, res) => {
//     const { name, price, sellerId } = req.body;
//     const imagePath = req.file ? `/uploads/${req.file.filename}` : "/images/box.jpg";
//     db.run(
//         "INSERT INTO products (seller_id, name, price, image) VALUES (?, ?, ?, ?)",
//         [sellerId, name, price, imagePath],
//         function(err) {
//             if (err) return res.status(500).json({ message: "DB error" });
//             res.json({ id: this.lastID, name, price, image: imagePath });
//         }
//     );
// });
app.post("/products", authMiddleware, upload.single("image"), (req, res) => {
    const { name, price } = req.body;
    const sellerId = req.user.id;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "/images/box.jpg";

    db.run(
        "INSERT INTO products (seller_id, name, price, image) VALUES (?, ?, ?, ?)",
        [sellerId, name, price, imagePath],
        function(err) {
            if (err) return res.status(500).json({ message: "DB error" });
            res.status(201).json({ id: this.lastID, name, price, image: imagePath });
        }
    );
});
app.get("/seller", (req, res) => {
  res.redirect("/seller.html");
});

// Edit product
// app.put("/products/:id", upload.single("image"), (req, res) => {
//     const id = req.params.id;
//     const { name, price } = req.body;
//     const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

//     const sql = imagePath
//         ? "UPDATE products SET name = ?, price = ?, image = ? WHERE id = ?"
//         : "UPDATE products SET name = ?, price = ? WHERE id = ?";
//     const params = imagePath ? [name, price, imagePath, id] : [name, price, id];

//     db.run(sql, params, function(err) {
//         if (err) return res.status(500).json({ message: "DB error" });
//         res.json({ id, name, price, image: imagePath });
//     });
// });
app.put("/products/:id", authMiddleware, upload.single("image"), (req, res) => {
    const id = req.params.id;
    const { name, price } = req.body;
    const sellerId = req.user.id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Ensure product belongs to user
    db.get("SELECT * FROM products WHERE id = ? AND seller_id = ?", [id, sellerId], (err, product) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (!product) return res.status(403).json({ message: "Unauthorized" });

        const sql = imagePath
            ? "UPDATE products SET name = ?, price = ?, image = ? WHERE id = ?"
            : "UPDATE products SET name = ?, price = ? WHERE id = ?";
        const params = imagePath ? [name, price, imagePath, id] : [name, price, id];

        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ message: "DB error" });
            res.json({ id, name, price, image: imagePath || product.image });
        });
    });
});

// Delete product
// app.delete("/products/:id", (req, res) => {
//     const id = req.params.id;
//     db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
//         if (err) return res.status(500).json({ message: "DB error" });
//         res.json({ message: "Deleted" });
//     });
// });
app.delete("/products/:id", authMiddleware, (req, res) => {
    const id = req.params.id;
    const sellerId = req.user.id;

    db.run(
        "DELETE FROM products WHERE id = ? AND seller_id = ?",
        [id, sellerId],
        function(err) {
            if (err) return res.status(500).json({ message: "DB error" });
            if (this.changes === 0) {
                return res.status(403).json({ message: "Unauthorized or not found" });
            }
            res.json({ message: "Deleted" });
        }
    );
});



/****************************************************
 * START SERVER
 ****************************************************/
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

















