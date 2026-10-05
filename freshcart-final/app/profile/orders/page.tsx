'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Protected from '../../../src/components/Protected';
import api, { errMsg } from '../../../src/lib/api';
import { decodeToken } from '../../../src/lib/auth';
import { useStore } from '../../../src/context/Store';
import type { Order } from '../../../src/lib/types';

function OrdersContent() {
  const { token } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const id = decodeToken(token)?.id;
    if (!id) { setState('error'); setError('Please log in again.'); return; }
    api.get<Order[] | { data: Order[] }>(`/orders/user/${id}`)
      .then((r) => { setOrders(Array.isArray(r.data) ? r.data : r.data.data || []); setState('ready'); })
      .catch((e) => { setError(errMsg(e)); setState('error'); });
  }, [token]);

  if (state === 'loading') return <div className="container loading page"><p>Loading…</p></div>;
  if (state === 'error') return <div className="container page"><div className="error-box">{error}</div></div>;
  return (
    <div className="container page">
      <span className="eyebrow">ORDER HISTORY</span>
      <h2>My orders</h2>
      {orders.length === 0 && <div className="empty"><h3>No orders yet</h3><Link className="btn" href="/products">Start shopping</Link></div>}
      {orders.map((o) => (
        <div className="order" key={o._id}>
          <div className="row">
            <b>Order #{o.id ?? o._id.slice(-6)} <small className="muted">{new Date(o.createdAt).toLocaleDateString()}</small></b>
            <span className="row gap">
              <span className={`pill ${o.isPaid ? '' : 'warn'}`}>{o.isPaid ? 'Paid' : 'Pay on delivery'}</span>
              <span className={`pill ${o.isDelivered ? '' : 'warn'}`}>{o.isDelivered ? 'Delivered' : 'Processing'}</span>
              <b>{o.totalOrderPrice} EGP</b>
            </span>
          </div>
          {o.cartItems.map((i) => (
            <div className="line" key={i._id}>
              <img src={i.product.imageCover} alt="" />
              <div className="grow"><h3>{i.product.title}</h3><p>{i.count} × {i.price} EGP</p></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
export default function Orders() { return <Protected><OrdersContent /></Protected>; }
