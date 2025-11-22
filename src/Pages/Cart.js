import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "../Assets/Cart.css";
import BottomToast from "../Components/BottomToast";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPaymentError, setShowPaymentError] = useState(false);

  const paymentMethods = [
    { id: "credit", name: "Credit Card", icon: "💳" },
    { id: "paypal", name: "PayPal", icon: "🌐" },
    { id: "apple", name: "Apple Pay", icon: "🍎" },
    { id: "google", name: "Google Pay", icon: "🤖" },
  ];

  const handleCheckout = () => {
    if (!paymentMethod) {
      setShowPaymentError(true);
      setToastMessage("Please select a payment method");
      setToastVisible(true);
      return;
    }

    setToastMessage(`Thank you for your purchase! Paid with ${paymentMethods.find(p => p.id === paymentMethod).name}`);
    setToastVisible(true);
    setTimeout(() => {
      clearCart();
      setPaymentMethod("");
    }, 2000);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything to your cart yet!</p>
        </div>
      ) : (
        <>
          <div className="cart-items-grid">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <p>${item.price}</p>
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <p className="subtotal">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Total Amount:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            
            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              <div className="payment-options">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={`payment-method-btn ${paymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      setShowPaymentError(false);
                    }}
                  >
                    <span className="payment-icon">{method.icon}</span>
                    <span className="payment-name">{method.name}</span>
                  </button>
                ))}
              </div>
              {showPaymentError && (
                <p className="payment-error">Please select a payment method</p>
              )}
            </div>

            <div className="cart-actions">
              <button 
                className="checkout-btn" 
                onClick={handleCheckout}
              >
                {paymentMethod ? `Pay with ${paymentMethods.find(p => p.id === paymentMethod).name}` : 'Select Payment Method'}
              </button>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}

      <BottomToast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        duration={2500}
      />
    </div>
  );
};

export default Cart;
