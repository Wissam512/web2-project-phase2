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
  // Simple auth check
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <div style={{ minHeight: "80vh" }}>
            <PageWrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </PageWrapper>
          </div>
          <Footer />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
