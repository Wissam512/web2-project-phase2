import "../Assets/Footer.css";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <footer className={`footer ${isVisible ? 'visible' : ''}`}>
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Wissam's Tech Haven</h3>
          <p className="footer-description">Curating excellence in technology and innovation.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Wissam</h4>
          <div className="social-icons">
            <a href="#" className="social-icon hover-effect">📱</a>
            <a href="#" className="social-icon hover-effect">💬</a>
            <a href="#" className="social-icon hover-effect">📸</a>
            <a href="#" className="social-icon hover-effect">💼</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="copyright">
          <span className="highlight">© 2025 Wissam's Tech Haven.</span> 
          <span className="fade-in">Crafted with ❤️ by Wissam</span>
        </p>
      </div>
    </footer>
  );
}
