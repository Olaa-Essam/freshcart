"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../src/lib/api";

interface Brand {
  _id: string;
  name: string;
  image: string;
}

export default function Brands() {
  const [items, setItems] = useState<Brand[]>([]);

  useEffect(() => {
    api.get("/brands").then((res) => {
      setItems(res.data.data);
    });
  }, []);

  return (
    <div className="container page">
      <span className="eyebrow">DISCOVER</span>

      <h2>Brands</h2>
      <p className="muted">
        Find products from your favorite brands.
      </p>

      <div className="grid tile-grid">
        {items.map((brand) => (
          <Link
            key={brand._id}
            href={`/products?brand=${brand._id}`}
            className="card tile"
          >
            <img src={brand.image} alt={brand.name} />

            <h3>{brand.name}</h3>

            <span className="green">View products →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
