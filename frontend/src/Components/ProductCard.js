import "../Assets/ProductCard.css";
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import BottomToast from "./BottomToast";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  if (!product) {
    return <div className="product-card">No product data</div>;
  }

  // fallback SVG data URI in case image fails to load
  const fallbackSvg = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="Arial" font-size="18">No Image</text></svg>'
  );
  const fallback = `data:image/svg+xml;utf8,${fallbackSvg}`;

  const handleAdd = () => {
    addToCart(product);
    setToastMsg(`${product.name} added to cart`);
    setToastVisible(true);
  };

  return (
    <>
      <div className="card">
        <div className="card-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="card-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
            }}
          />
        </div>
        <div className="card-content">
          <h3>{product.name}</h3>
          {product.description && <p className="card-description">{product.description}</p>}
          <p className="card-price">${product.price}</p>
          <button onClick={handleAdd} className="buy-btn">
            Add to Cart
          </button>
        </div>
      </div>

      <BottomToast
        message={toastMsg}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        duration={2500}
      />
    </>
  );
};

export default ProductCard;
