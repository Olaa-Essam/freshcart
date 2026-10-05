import type { Product } from "../context/Store";

export interface Category {
  _id: string;
  name: string;
  image: string;
}

export interface Brand {
  _id: string;
  name: string;
  image: string;
}

export interface ListResponse<T> {
  data: T[];
  metadata?: {
    numberOfPages?: number;
  };
}

export interface OrderItem {
  _id: string;
  count: number;
  price: number;
  product: Pick<Product, "_id" | "title" | "imageCover">;
}

export interface Order {
  _id: string;
  id?: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  cartItems: OrderItem[];
}
