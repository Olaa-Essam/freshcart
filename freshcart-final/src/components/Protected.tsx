"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useStore } from "../context/Store";

export default function Protected({
  children,
}: {
  children: ReactNode;
}) {
  const { token, hydrated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <div className="container loading">
        <p>Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
