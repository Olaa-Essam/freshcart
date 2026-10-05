"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../src/lib/api";

interface Category {
  _id: string;
  name: string;
  image: string;
}

export default function Categories() {
  const [items, setItems] = useState<Category[]>([]);

  useEffect(() => {
    api.get("/categories").then((res) => {
      setItems(res.data.data);
    });
  }, []);

  return (
    <div className="container page">
      <span className="eyebrow">EXPLORE</span>

      <h2>Categories</h2>

      <p className="muted">
        Browse products by category.
      </p>

      <div className="grid tile-grid">
        {items.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category._id}`}
            className="card tile"
          >
            <img src={category.image} alt={category.name} />

            <h3>{category.name}</h3>

            <span className="green">Shop category →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
