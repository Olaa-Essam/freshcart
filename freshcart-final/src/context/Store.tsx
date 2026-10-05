"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

import api, { errMsg } from "../lib/api";

export interface Product {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  imageCover: string;
  images?: string[];
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  category?: {
    _id?: string;
    name: string;
  };
  brand?: {
    _id?: string;
    name: string;
  };
}

export interface CartItem {
  product: Product;
  count: number;
  price: number;
}

export interface CartData {
  _id?: string;
  products: CartItem[];
  totalCartPrice: number;
}

export interface CartResponse {
  cartId?: string;
  numOfCartItems?: number;
  data: CartData;
}

interface StoreValue {
  token: string | null;
  hydrated: boolean;

  login: (token: string) => void;
  logout: () => void;

  cart: CartResponse | null;
  wish: string[];

  load: () => Promise<void>;
  addToCart: (id: string) => Promise<void>;
  updateQty: (id: string, count: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWish: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreValue | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }

  return context;
};

export function StoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [wish, setWish] = useState<string[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    setToken(savedToken);
    setHydrated(true);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setCart(null);
    setWish([]);
  };

  const load = useCallback(async () => {
    if (!token) {
      return;
    }

    const [cartResult, wishlistResult] = await Promise.allSettled([
      api.get<CartResponse>("/cart"),
      api.get<{ data: Product[] }>("/wishlist"),
    ]);

    if (cartResult.status === "fulfilled") {
      setCart(cartResult.value.data);
    } else {
      setCart(null);
    }

    if (wishlistResult.status === "fulfilled") {
      const products = wishlistResult.value.data.data;

      setWish(products.map((product) => product.id || product._id));
    }
  }, [token]);

  useEffect(() => {
    if (hydrated) {
      load();
    }
  }, [hydrated, load]);

  const addToCart = async (id: string) => {
    try {
      await api.post("/cart", {
        productId: id,
      });

      await load();

      toast.success("Added to cart");
    } catch (error) {
      toast.error(errMsg(error));
    }
  };

  const updateQty = async (id: string, count: number) => {
    try {
      if (count < 1) {
        await removeItem(id);
        return;
      }

      await api.put(`/cart/${id}`, {
        count,
      });

      await load();
    } catch (error) {
      toast.error(errMsg(error));
    }
  };

  const removeItem = async (id: string) => {
    try {
      await api.delete(`/cart/${id}`);

      await load();

      toast.success("Item removed");
    } catch (error) {
      toast.error(errMsg(error));
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");

      setCart(null);

      toast.success("Cart cleared");
    } catch (error) {
      toast.error(errMsg(error));
    }
  };

  const toggleWish = async (id: string) => {
    if (!token) {
      toast.error("Please log in first");
      return;
    }

    try {
      if (wish.includes(id)) {
        await api.delete(`/wishlist/${id}`);

        setWish((items) => items.filter((item) => item !== id));

        toast.success("Removed from wishlist");
      } else {
        await api.post("/wishlist", {
          productId: id,
        });

        setWish((items) => [...items, id]);

        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(errMsg(error));
    }
  };

  const value = useMemo(
    () => ({
      token,
      hydrated,
      login,
      logout,
      cart,
      wish,
      load,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      toggleWish,
    }),
    [token, hydrated, cart, wish, load]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}
