import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Contact from "./Pages/Contact";
import Login from "./Login";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import Cart from "./Pages/Cart";
import AdminDashboard from "./Pages/AdminDashboard";
import "./Assets/Theme.css";
import "./Assets/PageTransition.css"; // Import the new transition CSS

// Wrapper component to handle animations on route change
const PageWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-animate">
      {children}
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  // Logic to handle login success called from Login component if needed
  // or we can just rely on the fact that we'll navigate and the component will stay mounted
  // But since App is the root, we need it to pick up the change.
  // Actually, let's just listen for storage changes or use a simple interval/check.
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // We'll pass a function to Login to update the state
  const onLoginSuccess = (userData) => {
    setToken(userData.token);
    setRole(userData.role);
  };

  const basename = process.env.NODE_ENV === 'production' ? '/web2-project-phase2' : '';

  return (
    <ThemeProvider>
      <CartProvider>
        <Router basename={basename}>
          {!token ? (
            <Routes>
              <Route path="*" element={<Login onLogin={(data) => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.role);
                onLoginSuccess(data);
              }} />} />
            </Routes>
          ) : (
            <>
              <Navbar onLogout={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                setToken(null);
                setRole(null);
              }} />
              <div style={{ minHeight: "80vh" }}>
                <PageWrapper>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </PageWrapper>
              </div>
              <Footer />
            </>
          )}
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
