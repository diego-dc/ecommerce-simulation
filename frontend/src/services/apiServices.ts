// src/services/apiService.ts
import axios from "axios";
import type {
  CartItem,
  DummyProduct,
  CartBackendPayload,
  ShippingQuote,
} from "../types/cart";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:8000";
const DUMMYJSON_URL = "https://dummyjson.com/products";

// Function to fetch a random cart from dummyjson
export const fetchRandomCart = async (): Promise<CartItem[]> => {
  try {
    //Get the total number of products
    const totalResponse = await axios.get(`${DUMMYJSON_URL}?limit=1`);
    const totalProducts: number = totalResponse.data.total;

    if (totalProducts === 0) {
      return [];
    }

    const numberOfItemsToFetch = Math.random() * 10 + 1;

    // Ensure we don't skip past the end of the list when fetching our N items
    const maxSkip = Math.max(0, totalProducts - numberOfItemsToFetch);
    const randomSkip = Math.floor(Math.random() * (maxSkip + 1));

    //Fetch a batch of products starting from the random skip position
    const response = await axios.get(
      `${DUMMYJSON_URL}?limit=${numberOfItemsToFetch}&skip=${randomSkip}`
    );
    const products: DummyProduct[] = response.data.products;

    if (!products || products.length === 0) {
      const fallbackResponse = await axios.get(
        `${DUMMYJSON_URL}?limit=${numberOfItemsToFetch}`
      );
      const fallbackProducts: DummyProduct[] = fallbackResponse.data.products;
      if (!fallbackProducts || fallbackProducts.length === 0) {
        return [];
      }
      return transformProductsToCartItems(fallbackProducts);
    }

    // Transform products into CartItem format
    return transformProductsToCartItems(products);
  } catch (error) {
    console.error("Error fetching random cart:", error);
    throw new Error("Failed to load random cart. Please try again.");
  }
};

// Helper function to transform products to CartItem format
const transformProductsToCartItems = (products: DummyProduct[]): CartItem[] => {
  return products.map((product) => {
    // Calculate discounted price
    const discountedPrice =
      product.price * (1 - product.discountPercentage / 100);
    return {
      productId: product.id,
      name: product.title,
      price: parseFloat(discountedPrice.toFixed(2)), // Round to 2 decimal places
      quantity: Math.floor(Math.random() * 5) + 1, // Random quantity between 1 and 5
      originalPrice: product.price,
      discountPercentage: product.discountPercentage,
      thumbnail: product.thumbnail,
    };
  });
};

// Function to quote shipping with your backend
export const quoteShipping = async (
  payload: CartBackendPayload
): Promise<ShippingQuote> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/cart/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error quoting shipping:", error);
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data.error || "An unknown error occurred.";
      throw new Error(`Failed to quote shipping: ${errorMessage}`);
    }
    throw new Error(
      "Failed to connect to shipping service. Please try again later."
    );
  }
};
