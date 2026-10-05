'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '../../../src/lib/api';
import ProductCard from '../../../src/components/ProductCard';
import type { Product } from '../../../src/context/Store';
import type { Category } from '../../../src/lib/types';

interface Sub { _id: string; name: string }

export default function CategoryDetails() {
  const { id } = useParams<{ id: string }>();
  const [cat, setCat] = useState<Category | null>(null);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    setState('loading');
    Promise.all([
      api.get<{ data: Category }>(`/categories/${id}`),
      api.get<{ data: Product[] }>(`/products?category[in]=${id}&limit=24`),
      api.get<{ data: Sub[] }>(`/categories/${id}/subcategories`).catch(() => ({ data: { data: [] as Sub[] } })),
    ])
      .then(([c, p, s]) => { setCat(c.data.data); setItems(p.data.data); setSubs(s.data.data); setState('ready'); })
      .catch(() => setState('error'));
  }, [id]);

  if (state === 'loading') return <div className="container loading page"><p>Loading…</p></div>;
  if (state === 'error' || !cat) return <div className="container empty page"><h2>Category not found</h2><Link className="btn" href="/categories">All categories</Link></div>;
  return (
    <div className="container page">
      <div className="cat-head">
        <img src={cat.image} alt={cat.name} />
        <div>
          <span className="eyebrow">CATEGORY</span>
          <h2>{cat.name}</h2>
          {subs.length > 0 && <div className="tags">{subs.map((s) => <span key={s._id}>{s.name}</span>)}</div>}
        </div>
      </div>
      <div className="row"><h3>Products in {cat.name}</h3><Link className="green" href={`/products?category=${cat._id}`}>Open in shop</Link></div>
      {items.length === 0
        ? <div className="empty"><h3>No products in this category yet</h3><Link className="btn" href="/products">Browse all products</Link></div>
        : <div className="grid">{items.map((p) => <ProductCard key={p._id} p={p} />)}</div>}
    </div>
  );
}
