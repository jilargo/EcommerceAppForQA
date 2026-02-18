const sqlite3 = require("sqlite3").verbose();
import {getDb} from '../utils/testDbConfiguration';

function deleteUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const db = getDb();

    db.run(
      "DELETE FROM users WHERE email = ?",
      [email],
      function (err) {
        db.close();
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

function deleteProductByName(name) {
  return new Promise((resolve, reject) => {
    const db = getDb();

    db.run(
      "DELETE FROM products WHERE name = ?",
      [name],
      function (err) {
        db.close();
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

module.exports = {
deleteUserByEmail,
deleteProductByName
}