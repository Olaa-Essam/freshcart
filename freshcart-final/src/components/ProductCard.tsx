"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Product, useStore } from "../context/Store";

export default function ProductCard({ p }: { p: Product }) {
  const { token, addToCart, wish, toggleWish } = useStore();

  const router = useRouter();

  const liked = wish.includes(p._id);

  const hasDiscount =
    !!p.priceAfterDiscount && p.priceAfterDiscount < p.price;

  const discount = hasDiscount
    ? Math.round((1 - p.priceAfterDiscount! / p.price) * 100)
    : 0;

  const rating = p.ratingsAverage?.toFixed?.(1) || p.ratingsAverage || "0.0";

  const handleAddToCart = () => {
    if (token) {
      addToCart(p._id);
    } else {
      router.push("/login");
    }
  };

  return (
    <article className="card">
      <div className="card-media">
        {hasDiscount && (
          <span className="badge">-{discount}%</span>
        )}

        <button
          className={`heart ${liked ? "on" : ""}`}
          onClick={() => toggleWish(p._id)}
          aria-label="Toggle wishlist"
        >
          ♥
        </button>

        <Link href={`/products/${p._id}`}>
          <img src={p.imageCover} alt={p.title} />
        </Link>
      </div>

      <div className="card-body">
        <Link href={`/products/${p._id}`}>
          <small className="muted">
            {p.category?.name || "FreshCart"}
          </small>

          <h3>{p.title}</h3>
        </Link>

        <div className="row">
          <span className="star">
            ★ {rating}{" "}
            <small className="muted">
              ({p.ratingsQuantity || 0})
            </small>
          </span>
        </div>

        <div className="row">
          <span>
            <b>
              {hasDiscount ? p.priceAfterDiscount : p.price} EGP
            </b>

            {hasDiscount && (
              <s className="muted">{p.price} EGP</s>
            )}
          </span>

          <button
            className="plus"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
