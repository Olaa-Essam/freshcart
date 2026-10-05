import Link from "next/link";

export default function Footer() {
  const perks = [
    ["Free Shipping", "On orders over 500 EGP"],
    ["Easy Returns", "14-day return policy"],
    ["Secure Payment", "100% secure checkout"],
    ["24/7 Support", "Contact us anytime"],
  ];

  return (
    <footer className="footer">
      <div className="container perks">
        {perks.map(([title, description]) => (
          <div key={title}>
            <b>{title}</b>
            <br />
            <small>{description}</small>
          </div>
        ))}
      </div>

      <div className="container cols">
        <div>
          <div className="logo">
            Fresh<span>Cart</span>
          </div>

          <p className="muted">
            FreshCart is your one-stop destination for quality products. From
            fashion to electronics, we bring you quality products at
            competitive prices.
          </p>

          <p className="muted">
            support@freshcart.com
            <br />
            Egypt · Online Store
          </p>
        </div>

        <div>
          <h4>Shop</h4>

          <Link href="/products">All Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/brands">Brands</Link>
        </div>

        <div>
          <h4>Account</h4>

          <Link href="/wishlist">Wishlist</Link>
          <Link href="/profile">My Account</Link>
          <Link href="/profile/orders">Order History</Link>
          <Link href="/cart">Shopping Cart</Link>
          <Link href="/login">Sign In</Link>
          <Link href="/register">Create Account</Link>
        </div>

        <div>
          <h4>Support</h4>

          <span>Contact Us</span>
          <span>Help Center</span>
          <span>Shipping Info</span>
          <span>Returns & Refunds</span>
        </div>
      </div>

      <div className="container row copy">
        <span>© 2026 FreshCart. All rights reserved.</span>
        <span>Visa · Mastercard · PayPal</span>
      </div>
    </footer>
  );
}
