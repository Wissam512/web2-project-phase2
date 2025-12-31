import { Link } from "react-router-dom";
import "../Assets/Navbar.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar({ onLogout }) {
  const { cartItems } = useContext(CartContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1 className="logo">
          <span className="logo-text">Wissam's</span>
          <span className="logo-store">Store</span>
        </h1>
      </div>
      <div className="links">
        {localStorage.getItem('username') === 'wissam' && (
          <Link to="/admin" className="nav-link" style={{ color: '#ffcc00' }}>
            <span>🔑</span>
            Admin
          </Link>
        )}
        <Link to="/" className="nav-link">
          <span>🏠</span>
          Home
        </Link>
        <Link to="/products" className="nav-link">
          <span>🛍️</span>
          Products
        </Link>
        <Link to="/contact" className="nav-link">
          <span>📞</span>
          Contact
        </Link>
        <Link to="/cart" className="cart-link">
          <span className="cart-icon">🛒</span>
          <span className="cart-text">Cart</span>
          <span className="cart-count">{cartItems.length}</span>
        </Link>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
        <button
          className="nav-link logout-btn"
          onClick={onLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1rem', marginLeft: '10px' }}
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </nav>
  );
}
