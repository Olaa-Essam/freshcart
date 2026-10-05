"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api, { errMsg } from "../../src/lib/api";
import { useStore } from "../../src/context/Store";

type Step = "email" | "code" | "reset";

export default function ForgotPassword() {
  const { login } = useStore();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);

  const run = (action: () => Promise<void>) => {
    return async (event: FormEvent) => {
      event.preventDefault();
      setBusy(true);

      try {
        await action();
      } catch (error) {
        toast.error(errMsg(error));
      } finally {
        setBusy(false);
      }
    };
  };

  const sendCode = run(async () => {
    await api.post("/auth/forgotPasswords", {
      email,
    });

    toast.success("Reset code sent to your email");
    setStep("code");
  });

  const verifyCode = run(async () => {
    await api.post("/auth/verifyResetCode", {
      resetCode: code,
    });

    toast.success("Code verified");
    setStep("reset");
  });

  const resetPassword = run(async () => {
    const response = await api.put<{ token: string }>(
      "/auth/resetPassword",
      {
        email,
        newPassword: password,
      }
    );

    login(response.data.token);

    toast.success("Password updated");
    router.push("/");
  });

  return (
    <div className="container auth page">
      <div className="auth-card">
        <span className="eyebrow">ACCOUNT RECOVERY</span>

        <h2>Reset your password</h2>

        {step === "email" && (
          <form onSubmit={sendCode}>
            <p className="muted">
              Enter your email and we will send you a reset code.
            </p>

            <input
              className="input"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <button className="btn full" disabled={busy}>
              {busy ? "Sending…" : "Send reset code"}
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={verifyCode}>
            <p className="muted">
              Enter the code we sent to {email}.
            </p>

            <input
              className="input"
              required
              placeholder="Reset code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />

            <button className="btn full" disabled={busy}>
              {busy ? "Verifying…" : "Verify code"}
            </button>

            <button
              type="button"
              className="link-btn"
              onClick={() => setStep("email")}
            >
              Use a different email
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={resetPassword}>
            <p className="muted">
              Choose a new password for {email}.
            </p>

            <input
              className="input"
              type="password"
              required
              minLength={6}
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button className="btn full" disabled={busy}>
              {busy ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}

        <p>
          <Link href="/login">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
