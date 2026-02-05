

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
 * DATABASE SETUP (SQLite)
 ****************************************************/
const db = new sqlite3.Database("./database.db");
db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error("Error fetching tables:", err);
            return;
        }

        tables.forEach((table) => {
            const tableName = table.name;
            if (tableName === "sqlite_sequence") return; // skip internal table

            db.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
                if (err) {
                    console.error(`Failed to drop table ${tableName}:`, err);
                } else {
                    console.log(`Dropped table: ${tableName}`);
                }
            });
        });
    });
});
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

// Products table
db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        seller_id INTEGER,
        name TEXT,
        price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id)
    )
`);

/****************************************************
 * FILE UPLOAD SETUP (MULTER)
 ****************************************************/
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

/****************************************************
 * MIDDLEWARE
 ****************************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, "../public")));

/****************************************************
 * JWT AUTHENTICATION
 ****************************************************/
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token required" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

function authorizeSeller(req, res, next) {
    if (req.user.role !== "seller") return res.status(403).json({ message: "Seller access only" });
    next();
}

/****************************************************
 * ROUTES
 ****************************************************/

// Signup
app.post("/signup", upload.single("avatar"), async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const avatarFile = req.file;

        if (!firstName || !lastName || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarPath = avatarFile ? `/uploads/${avatarFile.filename}` : "/images/default-avatar.png";

        const sql = `INSERT INTO users (first_name, last_name, email, password, avatar) VALUES (?, ?, ?, ?, ?)`;

        db.run(sql, [firstName, lastName, email, hashedPassword, avatarPath], function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint")) return res.status(400).json({ message: "Email already exists" });
                return res.status(500).json({ message: "Database error" });
            }

            const token = jwt.sign({ id: this.lastID, email, role: "user" }, SECRET_KEY, { expiresIn: "1h" });

            res.status(201).json({
                message: "User registered successfully",
                user: { id: this.lastID, firstName, email, avatar: avatarPath, role: "user" },
                token
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid email or password" });

        const { password: pw, ...userData } = user;
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ user: userData, token });
    });
});

// Become seller
app.post("/becomeSeller", authenticateToken, (req, res) => {
    db.run("UPDATE users SET role = 'seller' WHERE id = ?", [req.user.id], function () {
        const newToken = jwt.sign({ id: req.user.id, email: req.user.email, role: "seller" }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token: newToken });
    });
});

// Products CRUD
app.post("/products", authenticateToken, authorizeSeller, (req, res) => {
    const { name, price } = req.body;
    db.run("INSERT INTO products (seller_id, name, price) VALUES (?, ?, ?)", [req.user.id, name, price], () => res.json({ message: "Product added" }));
});

app.get("/products", authenticateToken, authorizeSeller, (req, res) => {
    db.all("SELECT * FROM products WHERE seller_id = ?", [req.user.id], (err, rows) => res.json(rows));
});

app.put("/products/:id", authenticateToken, authorizeSeller, (req, res) => {
    const { name, price } = req.body;
    db.run("UPDATE products SET name = ?, price = ? WHERE id = ? AND seller_id = ?", [name, price, req.params.id, req.user.id], function () {
        if (this.changes === 0) return res.status(403).json({ message: "Not allowed" });
        res.json({ message: "Updated" });
    });
});

app.delete("/products/:id", authenticateToken, authorizeSeller, (req, res) => {
    db.run("DELETE FROM products WHERE id = ? AND seller_id = ?", [req.params.id, req.user.id], function () {
        if (this.changes === 0) return res.status(403).json({ message: "Not allowed" });
        res.json({ message: "Deleted" });
    });
});

/****************************************************
 * START SERVER
 ****************************************************/
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

















