"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

import Protected from "../../src/components/Protected";
import api, { errMsg } from "../../src/lib/api";
import { useStore } from "../../src/context/Store";

function CheckoutContent() {
  const { cart, load } = useStore();
  const router = useRouter();

  const [form, setForm] = useState({
    details: "",
    phone: "",
    city: "",
  });

  const [busy, setBusy] = useState(false);

  const cartId = cart?.cartId || cart?.data?._id;

  const valid =
    form.details.length >= 5 &&
    /^01[0125][0-9]{8}$/.test(form.phone) &&
    form.city.length >= 2;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (online: boolean) => {
    if (!valid) {
      toast.error("Enter a valid address and an Egyptian phone number");
      return;
    }

    if (!cartId) {
      return;
    }

    setBusy(true);

    try {
      const body = {
        shippingAddress: form,
      };

      if (online) {
        const response = await api.post(
          `/orders/checkout-session/${cartId}?url=${encodeURIComponent(
            window.location.origin + "/profile/orders"
          )}`,
          body
        );

        window.location.href = response.data.session.url;
      } else {
        await api.post(`/orders/${cartId}`, body);

        toast.success("Order placed. Pay on delivery.");

        await load();
        router.push("/profile/orders");
      }
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setBusy(false);
    }
  };

  if (!cartId) {
    return (
      <div className="container empty page">
        <h2>Your cart is empty</h2>

        <Link className="btn" href="/products">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container checkout page">
      <div>
        <span className="eyebrow">CHECKOUT</span>
        <h2>Shipping & payment</h2>

        <div className="form-card">
          <label>
            Address details
            <input
              className="input"
              name="details"
              placeholder="Street, building, apartment…"
              value={form.details}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone
            <input
              className="input"
              name="phone"
              placeholder="01xxxxxxxxx"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            City
            <input
              className="input"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
          </label>

          <div className="row gap">
            <button
              className="btn"
              disabled={busy}
              onClick={() => handlePayment(false)}
            >
              Cash on delivery
            </button>

            <button
              className="btn ghost"
              disabled={busy}
              onClick={() => handlePayment(true)}
            >
              Pay online
            </button>
          </div>
        </div>
      </div>

      <aside className="order-summary">
        <h3>Order summary</h3>

        <div className="row">
          <span>Items</span>
          <b>{cart.numOfCartItems || cart.data.products.length}</b>
        </div>

        <div className="row total">
          <span>Total</span>
          <b>{cart.data.totalCartPrice} EGP</b>
        </div>
      </aside>
    </div>
  );
}

export default function Checkout() {
  return (
    <Protected>
      <CheckoutContent />
    </Protected>
  );
}
