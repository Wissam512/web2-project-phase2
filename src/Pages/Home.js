import ProductCard from "../Components/ProductCard";
import "../Assets/Home.css";
import watchImg from "../Assets/images/Smart Watch.jpg";
import speakerImg from "../Assets/images/Bluetooth Speaker.jpg";

export default function Home() {
  const featured = [
    {
      id: 1,
      name: "Smart Watch Pro",
      price: 129,
      image: watchImg,
      description: "Track your fitness with style"
    },
    {
      id: 2,
      name: "Premium Bluetooth Speaker",
      price: 89,
      image: speakerImg,
      description: "Crystal clear sound anywhere"
    },
  ];

  return (
    <div>
      <section className="hero-section">
        <h1 className="hero-title">Welcome to Tech Haven</h1>
        <p className="hero-description">
          Discover the latest in technology and innovation. From smart watches to premium audio,
          we bring you the best gadgets at unbeatable prices!
        </p>
      </section>

      <section className="featured-section">
        <h2 className="featured-title">Featured Products</h2>
        <div className="products-grid">
          {featured.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
