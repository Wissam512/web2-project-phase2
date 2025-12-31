const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'my_project_db'
});

db.connect(err => {
    if (err) {
        console.error("Connection failed:", err);
        return;
    }
    console.log("Connected to DB");

    const sql = `
        SELECT o.id, o.username, o.total_amount, o.payment_method, o.created_at,
               JSON_ARRAYAGG(
                   JSON_OBJECT('product', oi.product_name, 'quantity', oi.quantity, 'price', oi.price)
               ) as items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id, o.username, o.total_amount, o.payment_method, o.created_at
        ORDER BY o.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) console.error("Query Error:", err);
        console.log("Query Results:", results);
        console.log("First item type:", results && results[0] ? typeof results[0].items : 'N/A');
        db.end();
    });
});
