"use client";

import Link from "next/link";
import Protected from "../../src/components/Protected";
import { useStore } from "../../src/context/Store";

function CartContent() {
  const { cart, updateQty, removeItem, clearCart } = useStore();
  const items = cart?.data?.products || [];

  if (!items.length) {
    return (
      <div className="container empty page">
        <h2>Your cart is empty</h2>

        <p className="muted">
          Add some products and they will appear here.
        </p>

        <Link className="btn" href="/products">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="section-head row">
        <div>
          <span className="eyebrow">YOUR BAG</span>
          <h2>Shopping cart</h2>
        </div>

        <span className="muted">
          {cart?.numOfCartItems || items.length} items
        </span>
      </div>

      <div className="cart-list">
        {items.map((item) => {
          const id = item.product._id || item.product.id!;

          return (
            <div className="line" key={id}>
              <img src={item.product.imageCover} alt="" />

              <div className="grow">
                <h3>{item.product.title}</h3>
                <p>{item.price} EGP</p>

                <button
                  className="link-btn danger"
                  onClick={() => removeItem(id)}
                >
                  Remove
                </button>
              </div>

              <div className="qty">
                <button onClick={() => updateQty(id, item.count - 1)}>
                  −
                </button>

                <span>{item.count}</span>

                <button onClick={() => updateQty(id, item.count + 1)}>
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary row">
        <div>
          <span className="muted">Total</span>
          <h3>{cart?.data?.totalCartPrice} EGP</h3>
        </div>

        <div className="row gap">
          <button className="btn ghost" onClick={clearCart}>
            Clear cart
          </button>

          <Link className="btn" href="/checkout">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  return (
    <Protected>
      <CartContent />
    </Protected>
  );
}
