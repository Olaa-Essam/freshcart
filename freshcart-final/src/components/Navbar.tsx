"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useStore } from "../context/Store";

export default function Navbar() {
  const { token, logout, cart, wish, hydrated } = useStore();

  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const links = [
    ["Home", "/"],
    ["Shop", "/products"],
    ["Categories", "/categories"],
    ["Brands", "/brands"],
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="site-head">
      <div className="topbar">
        <div className="container row">
          <span>Free Shipping on Orders 500 EGP · New Arrivals Daily</span>

          <span className="row gap top-contact">
            <a href="mailto:support@freshcart.com">
              support@freshcart.com
            </a>

            {hydrated && !token && (
              <>
                <Link href="/login">Sign In</Link>
                <Link href="/register">Sign Up</Link>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="nav">
        <div className="container nav-in">
          <Link href="/" className="logo">
            Fresh<span>Cart</span>
          </Link>

          <button
            className="mobile-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <nav className={`links ${open ? "mobile-open" : ""}`}>
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={pathname === href ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="links icons">
            <Link href="/wishlist" title="Wishlist">
              ♡ <sup>{wish.length}</sup>
            </Link>

            <Link href="/cart" title="Cart">
              Cart <sup>{cart?.numOfCartItems || 0}</sup>
            </Link>

            {hydrated && token && (
              <Link href="/profile" title="My account">
                Account
              </Link>
            )}

            {hydrated &&
              (token ? (
                <button className="btn sm" onClick={handleLogout}>
                  Sign Out
                </button>
              ) : (
                <Link className="btn sm" href="/login">
                  Sign In
                </Link>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
