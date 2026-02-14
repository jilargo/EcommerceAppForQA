const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

//define the script location move up two folders result will be C:\Htdocs\Ecommerce\EcommerceAppForQA
const projectRoot = path.resolve(__dirname, "../../");

// Step 2: Define database path relative to project root C:\Htdocs\Ecommerce\EcommerceAppForQA  + test/test-data/databaseForTest.db
const dbPath = path.join(projectRoot, "test/test-data/database/databaseForTest.db");

// Step 3: Make sure the folder exists (so sqlite can create the file if needed)
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Step 4: Debug info
console.log("Project root:", projectRoot);
//result = Project root: C:\Htdocs\Ecommerce\EcommerceAppForQA
console.log("Resolved TEST DB:", dbPath);
//result Resolved TEST DB: C:\Htdocs\Ecommerce\EcommerceAppForQA\test\test-data\databaseForTest.db
console.log("Script folder (__dirname):", __dirname);
//result Current working dir (process.cwd()): C:\Htdocs\Ecommerce\EcommerceAppForQA - this script being located
console.log("Current working dir (process.cwd()):", process.cwd());
//result PW Current Working Directory: C:\Htdocs\Ecommerce\EcommerceAppForQA

// this is important because If the test-data folder doesn’t exist,it will create it.
fs.mkdirSync(path.dirname(dbPath), { recursive: true });


//create database connection
function getDb() {
  return new sqlite3.Database(dbPath);
}

//responsible for database creation
function initializeTestDb() {
  return new Promise((resolve, reject) => {
    const db = getDb();

    db.serialize(() => {
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
      `, (err) => {
        db.close();
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

//inserting user
// function insertUser(user) {
//   return new Promise((resolve, reject) => {
//     const db = getDb();
//     db.run(
//       `INSERT INTO users (first_name, last_name, email, password, avatar) VALUES (?, ?, ?, ?, ?)`,
//       [user.first_name, user.last_name, user.email, user.password],
//       function (err) {
//         db.close();
//         if (err) return reject(err);
//         resolve();
//       }
//     );
//   });
// }



// function deleteUserByEmail(email) {
//   return new Promise((resolve, reject) => {
//     const db = getDb();

//     db.run(
//       "DELETE FROM users WHERE email = ?",
//       [email],
//       function (err) {
//         db.close();
//         if (err) return reject(err);
//         resolve();
//       }
//     );
//   });
// }

module.exports = {
  initializeTestDb,
  getDb,
  dbPath
  
};
