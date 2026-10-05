import type { Metadata } from "next";

import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import Providers from "./providers";

import "../src/styles.css";

export const metadata: Metadata = {
  title: {
    default: "FreshCart | Fresh E-Commerce",
    template: "%s | FreshCart",
  },
  description: "FreshCart e-commerce store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />

          <main>{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
