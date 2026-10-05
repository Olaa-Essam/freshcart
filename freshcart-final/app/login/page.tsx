"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api, { errMsg } from "../../src/lib/api";
import { useStore } from "../../src/context/Store";

export default function Login() {
  const { login } = useStore();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      const response = await api.post("/auth/signin", form);

      login(response.data.token);
      toast.success("Welcome back");
      router.push("/");
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="container auth page" onSubmit={handleSubmit}>
      <div className="auth-card">
        <span className="eyebrow">WELCOME BACK</span>

        <h2>Log in</h2>

        <p className="muted">
          Sign in to manage your cart and wishlist.
        </p>

        <input
          className="input"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button className="btn full" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>

        <p>
          <Link href="/forgot-password">Forgot your password?</Link>
        </p>

        <p>
          No account? <Link href="/register">Create one</Link>
        </p>
      </div>
    </form>
  );
}
