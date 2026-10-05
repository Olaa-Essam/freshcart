"use client";

import { StoreProvider } from "../src/context/Store";
import ClientToaster from "../src/components/ClientToaster";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      {children}
      <ClientToaster />
    </StoreProvider>
  );
}
