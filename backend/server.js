require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'my_project_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection on startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the MySQL database via pool.");
        connection.release();
        // Ensure tables exist on startup
        createTables();
    }
});

// PERSONALIZED ROOT ROUTE
app.get("/", (req, res) => {
    res.json({ name: "Wissam", role: "Admin", project: "E-Commerce Store" });
});

function createTables() {
    const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL
    )
  `;

    const productsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      price FLOAT NOT NULL,
      image VARCHAR(255)
    )
  `;

    const ordersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      total_amount FLOAT NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

    const orderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price FLOAT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `;

    db.query(usersTable, (err) => {
        if (err) console.error("Error creating users table:", err);
        else {
            // SEED WISSAM USER
            const checkWissam = "SELECT * FROM users WHERE username = 'wissam'";
            db.query(checkWissam, async (err, results) => {
                if (!err && results.length === 0) {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash("wissam123", salt);
                    const insertWissam = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
                    db.query(insertWissam, ['wissam', hash], (err) => {
                        if (!err) console.log("Created default user: wissam");
                    });
                }
            });
        }
    });

    db.query(productsTable, (err) => {
        if (err) console.error("Error creating products table:", err);
        else {
            // SEED PRODUCTS
            const checkProducts = "SELECT * FROM products";
            db.query(checkProducts, (err, results) => {
                if (!err && results.length === 0) {
                    const seedProducts = [
                        ['Premium Wireless Earbuds', 'High-quality sound with active noise cancellation', 'Electronics', 79, '/images/Bluetooth Speaker.jpg'],
                        ['20000mAh Power Bank', 'Fast charging with multiple ports', 'Electronics', 45, '/images/Bluetooth Speaker.jpg'],
                        ['Smart LED Lamp', 'Voice-controlled with multiple color options', 'Home', 39, '/images/Smart Watch.jpg'],
                        ['Portable Mini Fan', 'Rechargeable battery with 3 speed settings', 'Home', 19, '/images/Smart Watch.jpg'],
                        ['Smart Watch Pro', 'Fitness tracking with heart rate monitor', 'Electronics', 129, '/images/Smart Watch.jpg'],
                        ['Bluetooth Speaker XL', 'Waterproof with 24-hour battery life', 'Electronics', 89, '/images/Bluetooth Speaker.jpg']
                    ];
                    const insertProduct = "INSERT INTO products (title, description, category, price, image) VALUES ?";
                    db.query(insertProduct, [seedProducts], (err) => {
                        if (err) console.error("Error seeding products:", err);
                        else console.log("Seeded initial products");
                    });
                }
            });
        }
    });

    db.query(ordersTable, (err) => {
        if (err) console.error("Error creating orders table:", err);
        else {
            // Migration: Attempt to add status column if it doesn't exist (for existing tables)
            const alterSql = "ALTER TABLE orders ADD COLUMN status VARCHAR(50) DEFAULT 'Pending'";
            db.query(alterSql, (err) => {
                if (err && err.code !== 'ER_DUP_FIELDNAME') {
                    console.log("Note: Status column check:", err.message);
                }
            });
        }
    });

    db.query(orderItemsTable, (err) => {
        if (err) console.error("Error creating order_items table:", err);
    });
}

// REGISTER
app.post("/api/auth/register", (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const checkSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkSql, [username], async (err, results) => {
        if (err) {
            console.error("Database error during register check:", err);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        if (results.length > 0) return res.status(400).json({ error: "Username already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Insert
        const insertSql = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
        db.query(insertSql, [username, hash], (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to register user" });
            res.json({ message: "User registered successfully", userId: result.insertId });
        });
    });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error("Database error during login:", err);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        const role = user.username === 'wissam' ? 'admin' : 'user';
        res.json({ message: "Login successful", token, username: user.username, role });
    });
});

// GET PRODUCTS
app.get("/api/products", (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            res.status(500).json({ error: "Failed to fetch products" });
            return;
        }
        res.json(results);
    });
});

// ADD PRODUCT
app.post("/api/products", (req, res) => {
    const { title, description, category, price, image } = req.body;
    const sql = "INSERT INTO products (title, description, category, price, image) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [title, description, category, price, image], (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            res.status(500).json({ error: "Failed to add product" });
            return;
        }
        res.json({ message: "Product added", id: result.insertId });
    });
});

// DELETE PRODUCT
app.delete("/api/products/:id", (req, res) => {
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            res.status(500).json({ error: "Failed to delete product" });
            return;
        }
        res.json({ message: "Product deleted" });
    });
});

// POST ORDER (Checkout)
app.post("/api/orders", (req, res) => {
    const { username, cartItems, total, paymentMethod } = req.body;

    if (!username || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
    }

    const insertOrder = "INSERT INTO orders (username, total_amount, payment_method) VALUES (?, ?, ?)";
    db.query(insertOrder, [username, total, paymentMethod], (err, result) => {
        if (err) {
            console.error("Error inserting order:", err);
            return res.status(500).json({ error: "Failed to place order" });
        }

        const orderId = result.insertId;
        const insertItem = "INSERT INTO order_items (order_id, product_name, quantity, price) VALUES ?";
        const values = cartItems.map(item => [orderId, item.name, item.quantity, item.price]);

        db.query(insertItem, [values], (err) => {
            if (err) {
                console.error("Error inserting order items:", err);
                return res.status(500).json({ error: "Failed to save order items" });
            }
            res.json({ message: "Order placed successfully", orderId });
        });
    });
});

// GET USERS (Admin)
app.get("/api/users", (req, res) => {
    const sql = "SELECT id, username FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({ error: "Failed to fetch users" });
            return;
        }
        res.json(results);
    });
});

// UPDATE ORDER STATUS
app.put("/api/orders/:id/status", (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, req.params.id], (err, result) => {
        if (err) {
            console.error("Error updating order:", err);
            res.status(500).json({ error: "Failed to update order" });
            return;
        }
        res.json({ message: "Order status updated" });
    });
});

// GET ORDERS (Admin)
app.get("/api/orders", (req, res) => {
    const sql = `
        SELECT o.id, o.username, o.total_amount, o.payment_method, o.status, o.created_at,
               oi.product_name, oi.quantity, oi.price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        ORDER BY o.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching orders:", err);
            res.status(500).json({ error: "Failed to fetch orders" });
            return;
        }

        // Group by order ID manually
        const ordersMap = new Map();
        results.forEach(row => {
            if (!ordersMap.has(row.id)) {
                ordersMap.set(row.id, {
                    id: row.id,
                    username: row.username,
                    total_amount: row.total_amount,
                    payment_method: row.payment_method,
                    status: row.status || 'Pending',
                    created_at: row.created_at,
                    items: []
                });
            }
            ordersMap.get(row.id).items.push({
                product: row.product_name,
                quantity: row.quantity,
                price: row.price
            });
        });

        res.json(Array.from(ordersMap.values()));
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
