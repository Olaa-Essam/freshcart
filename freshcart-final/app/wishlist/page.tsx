"use client";

import { useEffect, useState } from "react";

import Protected from "../../src/components/Protected";
import ProductCard from "../../src/components/ProductCard";
import api from "../../src/lib/api";
import { Product, useStore } from "../../src/context/Store";

function WishlistContent() {
  const { wish } = useStore();
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/wishlist").then((response) => {
      setItems(response.data.data);
    });
  }, [wish]);

  const shown = items
    .filter((product) => wish.includes(product._id || product.id!))
    .map((product) => ({
      ...product,
      _id: product._id || product.id!,
    }));

  return (
    <div className="container page">
      <span className="eyebrow">SAVED ITEMS</span>

      <h2>My Wishlist</h2>

      {shown.length === 0 ? (
        <div className="empty">
          <h3>Your wishlist is empty</h3>

          <p className="muted">
            Save products you love and find them here.
          </p>
        </div>
      ) : (
        <div className="grid">
          {shown.map((product) => (
            <ProductCard key={product._id} p={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Wishlist() {
  return (
    <Protected>
      <WishlistContent />
    </Protected>
  );
}
