"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api, { errMsg } from "../../../src/lib/api";
import ProductCard from "../../../src/components/ProductCard";
import { useStore, type Product } from "../../../src/context/Store";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { token, cart, load, wish, toggleWish } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [status, setStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setStatus("loading");
    setQuantity(1);
    setRelatedProducts([]);

    api
      .get<{ data: Product }>(`/products/${id}`)
      .then((response) => {
        const productData = response.data.data;

        setProduct(productData);
        setSelectedImage(productData.imageCover);
        setStatus("ready");

        if (productData.category?._id) {
          api
            .get<{ data: Product[] }>(
              `/products?category[in]=${productData.category._id}&limit=8`
            )
            .then((response) => {
              const products = response.data.data
                .filter((item) => item._id !== productData._id)
                .slice(0, 4);

              setRelatedProducts(products);
            })
            .catch(() => {
              setRelatedProducts([]);
            });
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [id]);

  const addToCart = async () => {
    if (!product) {
      return;
    }

    if (!token) {
      router.push("/login");
      return;
    }

    setAdding(true);

    try {
      const existingItem = cart?.data.products.find(
        (item) =>
          (item.product._id || item.product.id) === product._id
      );

      const currentQuantity = existingItem?.count || 0;

      await api.post("/cart", {
        productId: product._id,
      });

      if (quantity > 1) {
        await api.put(`/cart/${product._id}`, {
          count: currentQuantity + quantity,
        });
      }

      await load();

      toast.success(`Added ${quantity} to cart`);
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setAdding(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container loading page">
        <p>Loading…</p>
      </div>
    );
  }

  if (status === "error" || !product) {
    return (
      <div className="container empty page">
        <h2>Product not found</h2>

        <Link className="btn" href="/products">
          Back to products
        </Link>
      </div>
    );
  }

  const images = [product.imageCover, ...(product.images || [])];

  const hasDiscount =
    !!product.priceAfterDiscount &&
    product.priceAfterDiscount < product.price;

  return (
    <>
      <div className="container detail page">
        <div>
          <img
            className="big"
            src={selectedImage}
            alt={product.title}
          />

          <div className="thumbs">
            {images.map((image) => (
              <button
                key={image}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-info">
          <span className="eyebrow">
            {product.category?.name || "PRODUCT"}
          </span>

          <h2>{product.title}</h2>

          <p className="muted description">
            {product.description}
          </p>

          <p>
            {product.brand?.name || "FreshCart"} ·{" "}
            {product.category?.name || "General"}
          </p>

          <div className="detail-price">
            <b>
              {hasDiscount
                ? product.priceAfterDiscount
                : product.price}{" "}
              EGP
            </b>

            {hasDiscount && (
              <s className="muted">{product.price} EGP</s>
            )}

            <span className="star">
              ★ {product.ratingsAverage || 0} (
              {product.ratingsQuantity || 0})
            </span>
          </div>

          <div className="qty-row">
            <span>Quantity</span>

            <div className="qty">
              <button
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
                aria-label="Decrease"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase"
              >
                +
              </button>
            </div>
          </div>

          <div className="row gap">
            <button
              className="btn"
              disabled={adding}
              onClick={addToCart}
            >
              {adding ? "Adding…" : "Add to cart"}
            </button>

            <button
              className="btn ghost"
              onClick={() => toggleWish(product._id)}
            >
              {wish.includes(product._id)
                ? "Remove from wishlist"
                : "Add to wishlist"}
            </button>
          </div>

          <div className="info-box">
            <b>FreshCart promise</b>

            <p>
              Quality products, secure payment and reliable delivery.
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="container page">
          <h2>Related products</h2>

          <div className="grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} p={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
