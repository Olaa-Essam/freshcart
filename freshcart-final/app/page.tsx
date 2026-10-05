"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import api from "../src/lib/api";
import ProductCard from "../src/components/ProductCard";
import type { Product } from "../src/context/Store";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const slides = [
  {
    h: "Fresh Products Delivered to your Door",
    p: "Get 20% off your first order",
    a: ["Shop Now", "/products"],
    b: ["View Deals", "/products"],
  },
  {
    h: "Premium Quality Guaranteed",
    p: "Fresh from farm to your table",
    a: ["Shop Now", "/products"],
    b: ["Explore Categories", "/categories"],
  },
  {
    h: "Fast & Free Delivery",
    p: "Same day delivery available",
    a: ["Order Now", "/products"],
    b: ["Discover Brands", "/brands"],
  },
];

const perks = [
  ["Free Shipping", "On orders over 500 EGP"],
  ["Secure Payment", "100% secure transactions"],
  ["Easy Returns", "14-day return policy"],
  ["24/7 Support", "Dedicated support team"],
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    api.get("/categories").then((response) => {
      setCategories(response.data.data);
    });

    api.get("/products?limit=12").then((response) => {
      setProducts(response.data.data);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">
            FRESHCART · EVERYDAY ESSENTIALS
          </span>

          <h1>{slide.h}</h1>
          <p>{slide.p}</p>

          <div className="row gap">
            <Link className="btn light" href={slide.a[1]}>
              {slide.a[0]}
            </Link>

            <Link className="btn outline" href={slide.b[1]}>
              {slide.b[0]}
            </Link>
          </div>

          <div className="dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={index === currentSlide ? "on" : ""}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="container perks">
        {perks.map(([title, description]) => (
          <div key={title}>
            <b>{title}</b>
            <br />
            <small className="muted">{description}</small>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="section-head row">
          <h2>Shop By Category</h2>

          <Link className="green" href="/categories">
            View All Categories
          </Link>
        </div>

        <div className="chips">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="chip"
            >
              <img src={category.image} alt="" />
              {category.name}
            </Link>
          ))}
        </div>

        <div className="deals">
          <div className="deal d1">
            <small>DEAL OF THE DAY</small>
            <h3>Fresh Organic Fruits</h3>
            <p>Get up to 40% off on selected products.</p>
            <b>40% OFF</b>
            <br />

            <Link className="btn light" href="/products">
              Shop Now
            </Link>
          </div>

          <div className="deal d2">
            <small>NEW ARRIVALS</small>
            <h3>Discover Something Fresh</h3>
            <p>Explore the latest products and brands.</p>
            <b>25% OFF</b>
            <br />

            <Link className="btn light" href="/products">
              Explore Now
            </Link>
          </div>
        </div>

        <div className="section-head row">
          <h2>Featured Products</h2>

          <Link className="green" href="/products">
            Shop all
          </Link>
        </div>

        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product._id} p={product} />
          ))}
        </div>
      </div>

      <section className="news">
        <div className="container">
          <small>NEWSLETTER · 50,000+ SUBSCRIBERS</small>

          <h2>Get the Freshest Updates Delivered Free</h2>

          <p>
            Weekly recipes, seasonal offers & exclusive member perks.
          </p>

          <form
            className="row gap"
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
          >
            <input
              className="input"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn light">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
