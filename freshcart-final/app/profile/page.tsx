"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import Protected from "../../src/components/Protected";
import api, { errMsg } from "../../src/lib/api";
import { decodeToken } from "../../src/lib/auth";
import { useStore } from "../../src/context/Store";

function ProfileContent() {
  const { token, login } = useStore();

  const user = useMemo(() => decodeToken(token), [token]);

  const [info, setInfo] = useState({
    name: user?.name || "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    rePassword: "",
  });

  const [busy, setBusy] = useState<"info" | "pw" | null>(null);

  const saveInfo = async (event: FormEvent) => {
    event.preventDefault();

    const data = Object.fromEntries(
      Object.entries(info).filter(([, value]) => value.trim())
    );

    setBusy("info");

    try {
      await api.put("/users/updateMe/", data);

      toast.success("Details updated");
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setBusy(null);
    }
  };

  const savePassword = async (event: FormEvent) => {
    event.preventDefault();

    if (passwordData.password !== passwordData.rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    setBusy("pw");

    try {
      const response = await api.put<{ token: string }>(
        "/users/changeMyPassword",
        passwordData
      );

      login(response.data.token);

      setPasswordData({
        currentPassword: "",
        password: "",
        rePassword: "",
      });

      toast.success("Password changed");
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="container narrow page">
      <span className="eyebrow">MY ACCOUNT</span>

      <h2>Hello, {user?.name || "there"}</h2>

      <p>
        <Link className="green" href="/profile/orders">
          View my orders
        </Link>
      </p>

      <form className="panel" onSubmit={saveInfo}>
        <h3>Update details</h3>

        <input
          className="input"
          placeholder="Name"
          value={info.name}
          onChange={(event) =>
            setInfo({
              ...info,
              name: event.target.value,
            })
          }
        />

        <input
          className="input"
          type="email"
          placeholder="New email (optional)"
          value={info.email}
          onChange={(event) =>
            setInfo({
              ...info,
              email: event.target.value,
            })
          }
        />

        <input
          className="input"
          placeholder="Phone 01xxxxxxxxx (optional)"
          value={info.phone}
          onChange={(event) =>
            setInfo({
              ...info,
              phone: event.target.value,
            })
          }
        />

        <button className="btn" disabled={busy === "info"}>
          {busy === "info" ? "Saving…" : "Save details"}
        </button>
      </form>

      <form className="panel" onSubmit={savePassword}>
        <h3>Change password</h3>

        <input
          className="input"
          type="password"
          required
          placeholder="Current password"
          value={passwordData.currentPassword}
          onChange={(event) =>
            setPasswordData({
              ...passwordData,
              currentPassword: event.target.value,
            })
          }
        />

        <input
          className="input"
          type="password"
          required
          minLength={6}
          placeholder="New password"
          value={passwordData.password}
          onChange={(event) =>
            setPasswordData({
              ...passwordData,
              password: event.target.value,
            })
          }
        />

        <input
          className="input"
          type="password"
          required
          placeholder="Confirm new password"
          value={passwordData.rePassword}
          onChange={(event) =>
            setPasswordData({
              ...passwordData,
              rePassword: event.target.value,
            })
          }
        />

        <button className="btn" disabled={busy === "pw"}>
          {busy === "pw" ? "Saving…" : "Change password"}
        </button>
      </form>
    </div>
  );
}

export default function Profile() {
  return (
    <Protected>
      <ProfileContent />
    </Protected>
  );
}
