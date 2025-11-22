import { useState } from 'react';
import '../Assets/Contact.css';
import BottomToast from '../Components/BottomToast';

export default function Contact() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you could add actual form submission logic
    setShowToast(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setRating(0);
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>Have questions? We'd love to hear from you.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder=" "
            required
          />
          <label className="form-label">Your Name</label>
        </div>

        <div className="form-group">
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder=" "
            required
          />
          <label className="form-label">Your Email</label>
        </div>

        <div className="form-group">
          <textarea
            className="form-control"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="5"
            placeholder=" "
            required
          ></textarea>
          <label className="form-label textarea-label">Your Message</label>
        </div>

        <div className="star-rating">
          <p>How would you rate our service?</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hover || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>

      <BottomToast
        message="Thank you for your message! We'll get back to you soon."
        visible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </div>
  );
}
