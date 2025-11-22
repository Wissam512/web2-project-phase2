import ProductCard from "../Components/ProductCard";
import { useState } from "react";
import watchImg from "../Assets/images/Smart Watch.jpg";
import speakerImg from "../Assets/images/Bluetooth Speaker.jpg";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const products = [
    {
      id: 1,
      name: "Premium Wireless Earbuds",
      price: 79,
      category: "Electronics",
      image: speakerImg,
      description: "High-quality sound with active noise cancellation"
    },
    {
      id: 2,
      name: "20000mAh Power Bank",
      price: 45,
      category: "Electronics",
      image: speakerImg,
      description: "Fast charging with multiple ports"
    },
    {
      id: 3,
      name: "Smart LED Lamp",
      price: 39,
      category: "Home",
      image: watchImg,
      description: "Voice-controlled with multiple color options"
    },
    {
      id: 4,
      name: "Portable Mini Fan",
      price: 19,
      category: "Home",
      image: watchImg,
      description: "Rechargeable battery with 3 speed settings"
    },
    {
      id: 5,
      name: "Smart Watch Pro",
      price: 129,
      category: "Electronics",
      image: watchImg,
      description: "Fitness tracking with heart rate monitor"
    },
    {
      id: 6,
      name: "Bluetooth Speaker XL",
      price: 89,
      category: "Electronics",
      image: speakerImg,
      description: "Waterproof with 24-hour battery life"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (priceFilter === "all") return matchesSearch;
    if (priceFilter === "under25") return matchesSearch && product.price < 25;
    if (priceFilter === "25to50") return matchesSearch && product.price >= 25 && product.price <= 50;
    if (priceFilter === "over50") return matchesSearch && product.price > 50;
    
    return matchesSearch;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Our Products</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        >
          <option value="all">All Prices</option>
          <option value="under25">Under $25</option>
          <option value="25to50">$25 - $50</option>
          <option value="over50">Over $50</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))
        ) : (
          <p>No products found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
