// src/services/apiService.ts
import axios from "axios";
import type {
  CartItem,
  DummyProduct,
  CartBackendPayload,
  ShippingQuote,
} from "../types/cart";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:8000"; // Usa tu variable de entorno
const DUMMYJSON_URL = "https://dummyjson.com/products";

// Función para obtener un carrito aleatorio de dummyjson
export const fetchRandomCart = async (): Promise<CartItem[]> => {
  try {
    const response = await axios.get(`${DUMMYJSON_URL}?limit=5`); // Obtener 5 productos aleatorios
    const products: DummyProduct[] = response.data.products;

    if (!products || products.length === 0) {
      return [];
    }

    // Transformar los productos de dummyjson al formato CartItem
    const cartItems: CartItem[] = products.map((product) => {
      // Calcular precio con descuento
      const discountedPrice =
        product.price * (1 - product.discountPercentage / 100);
      return {
        productId: product.id,
        name: product.title,
        price: parseFloat(discountedPrice.toFixed(2)), // Redondear a 2 decimales
        quantity: Math.floor(Math.random() * 3) + 1, // Cantidad aleatoria entre 1 y 3
        originalPrice: product.price,
        discountPercentage: product.discountPercentage,
        thumbnail: product.thumbnail,
      };
    });
    return cartItems;
  } catch (error) {
    console.error("Error fetching random cart:", error);
    throw new Error("Failed to load random cart. Please try again.");
  }
};

// Función para cotizar el despacho con tu backend
export const quoteShipping = async (
  payload: CartBackendPayload
): Promise<ShippingQuote> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/cart/`, payload);
    return response.data; // Esperamos { price: number, courier: string }
  } catch (error) {
    console.error("Error quoting shipping:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Manejar errores específicos del backend
      const errorMessage =
        error.response.data.error || "An unknown error occurred.";
      throw new Error(`Failed to quote shipping: ${errorMessage}`);
    }
    throw new Error(
      "Failed to connect to shipping service. Please try again later."
    );
  }
};
