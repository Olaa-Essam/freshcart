"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api, { errMsg } from "../../src/lib/api";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
  });

  const [busy, setBusy] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    setBusy(true);

    try {
      await api.post("/auth/signup", form);

      toast.success("Account created. Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="container auth page" onSubmit={handleSubmit}>
      <div className="auth-card">
        <span className="eyebrow">JOIN FRESHCART</span>

        <h2>Create account</h2>

        <input
          className="input"
          name="name"
          placeholder="Name"
          required
          minLength={3}
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="input"
          name="email"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="input"
          name="phone"
          placeholder="Phone (01xxxxxxxxx)"
          required
          pattern="^01[0125][0-9]{8}$"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
        />

        <input
          className="input"
          name="rePassword"
          type="password"
          placeholder="Confirm password"
          required
          value={form.rePassword}
          onChange={handleChange}
        />

        <button className="btn full" disabled={busy}>
          {busy ? "Creating…" : "Register"}
        </button>

        <p>
          Already registered? <Link href="/login">Log in</Link>
        </p>
      </div>
    </form>
  );
}
