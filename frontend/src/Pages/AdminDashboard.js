import React, { useEffect, useState } from 'react';
import '../Assets/Login.css'; // Reusing some styles
import API_URL from '../apiConfig';

function AdminDashboard() {
    const username = localStorage.getItem('username');
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchOrders = () => {
            fetch(`${API_URL}/api/orders`)
                .then(res => {
                    if (!res.ok) throw new Error("Server returned " + res.status);
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) setOrders(data);
                    else setOrders([]);
                })
                .catch(err => console.error("Error fetching orders:", err));
        };

        const fetchUsers = () => {
            fetch(`${API_URL}/api/users`)
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(err => console.error("Error fetching users:", err));
        }

        fetchOrders();
        fetchUsers();
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        fetch(`${API_URL}/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(() => {
                // Optimistic update
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                alert("Order status updated to " + newStatus);
            })
            .catch(err => console.error("Error updating status:", err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
    };

    // Analytics
    const totalRevenue = orders.reduce((acc, order) => acc + order.total_amount, 0);
    const totalOrders = orders.length;
    const totalUsers = users.length;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Admin Dashboard</h1>
                <div>
                    <span>Welcome, <strong>{username}</strong>!</span>
                    <button className="auth-btn" onClick={handleLogout} style={{ marginLeft: '15px', padding: '5px 15px', fontSize: '0.9rem' }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Analytics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', background: '#e0f7fa', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Revenue</h3>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${totalRevenue.toFixed(2)}</p>
                </div>
                <div style={{ padding: '20px', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Orders</h3>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalOrders}</p>
                </div>
                <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalUsers}</p>
                </div>
            </div>

            {/* Users List */}
            <div style={{ marginBottom: '40px' }}>
                <h2>Registered Users</h2>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#f4f4f4' }}>
                            <tr style={{ textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>ID</th>
                                <th style={{ padding: '10px' }}>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{user.id}</td>
                                    <td style={{ padding: '10px' }}>{user.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            <h2>Recent Orders</h2>
            {orders.length === 0 ? (
                <p>No orders placed yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>ID</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>User</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Total</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Status</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Date</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>#{order.id}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{order.username}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>${order.total_amount.toFixed(2)}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                    <select
                                        value={order.status || 'Pending'}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        style={{ padding: '5px', borderRadius: '4px' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{new Date(order.created_at).toLocaleString()}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                        {order.items && order.items.map((item, idx) => (
                                            <li key={idx}>
                                                {item.quantity}x {item.product} (${item.price})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminDashboard;
