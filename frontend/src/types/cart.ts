export interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  originalPrice: number;
  discountPercentage: number;
  thumbnail: string;
}

export interface CustomerData {
  name: string;
  shipping_street: string;
  commune: string;
  phone: string;
}

export interface ShippingQuote {
  price: number;
  courier: string;
}

export interface BackendProductPayload {
  productId: string;
  price: number;
  quantity: number;
  discount: number;
}

export interface CartBackendPayload {
  products: BackendProductPayload[];
  customer_data: CustomerData;
}
