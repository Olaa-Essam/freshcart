"use client";

import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";

import api, { errMsg } from "../../src/lib/api";
import ProductCard from "../../src/components/ProductCard";
import type { Product } from "../../src/context/Store";
import type { ListResponse } from "../../src/lib/types";

const SORTS: [string, string][] = [
  ["", "Default"],
  ["price", "Price: low to high"],
  ["-price", "Price: high to low"],
  ["-ratingsAverage", "Top rated"],
];

function ProductsContent() {
  const searchParams = useSearchParams();

  const brand = searchParams.get("brand");
  const category = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [range, setRange] = useState({
    min: "",
    max: "",
  });

  const [appliedRange, setAppliedRange] = useState({
    min: "",
    max: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [brand, category, sort, appliedRange]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
      });

      if (brand) {
        params.set("brand", brand);
      }

      if (category) {
        params.set("category[in]", category);
      }

      if (sort) {
        params.set("sort", sort);
      }

      if (appliedRange.min) {
        params.set("price[gte]", appliedRange.min);
      }

      if (appliedRange.max) {
        params.set("price[lte]", appliedRange.max);
      }

      try {
        const response = await api.get<ListResponse<Product>>(
          `/products?${params}`
        );

        setProducts(response.data.data);
        setPages(response.data.metadata?.numberOfPages || 1);
      } catch (error) {
        setProducts([]);
        setError(errMsg(error));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, brand, category, sort, appliedRange]);

  const applyFilters = (event: FormEvent) => {
    event.preventDefault();

    setAppliedRange(range);
  };

  const clearFilters = () => {
    setRange({
      min: "",
      max: "",
    });

    setAppliedRange({
      min: "",
      max: "",
    });

    setSort("");
    setSearch("");
  };

  const shownProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container page">
      <div className="section-head row">
        <div>
          <span className="eyebrow">SHOP</span>
          <h2>Products</h2>
        </div>

        <span className="muted">
          {shownProducts.length} products
        </span>
      </div>

      <form className="filters" onSubmit={applyFilters}>
        <label>
          Search

          <input
            className="input"
            placeholder="Search products…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          Sort by

          <select
            className="input"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {SORTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Min price

          <input
            className="input"
            type="number"
            min={0}
            value={range.min}
            onChange={(event) =>
              setRange({
                ...range,
                min: event.target.value,
              })
            }
          />
        </label>

        <label>
          Max price

          <input
            className="input"
            type="number"
            min={0}
            value={range.max}
            onChange={(event) =>
              setRange({
                ...range,
                max: event.target.value,
              })
            }
          />
        </label>

        <button className="btn">Apply</button>

        <button
          type="button"
          className="btn ghost"
          onClick={clearFilters}
        >
          Clear
        </button>
      </form>

      {loading ? (
        <p className="loading">Loading…</p>
      ) : error ? (
        <div className="error-box">{error}</div>
      ) : shownProducts.length === 0 ? (
        <div className="empty">
          <h3>No products found</h3>

          <p>
            Try another search or clear the filters.
          </p>
        </div>
      ) : (
        <div className="grid">
          {shownProducts.map((product) => (
            <ProductCard key={product._id} p={product} />
          ))}
        </div>
      )}

      <div className="pager">
        <button
          className="btn ghost"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {pages}
        </span>

        <button
          className="btn"
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <Suspense
      fallback={
        <div className="container loading">
          Loading…
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
