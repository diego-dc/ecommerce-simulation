// src/pages/HomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { setCart, setError, setLoading } from "../store/cartSlice";
import { fetchRandomCart } from "../services/apiServices";
import toast from "react-hot-toast";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isLoading = useSelector((state: RootState) => state.cart.isLoading);

  const handleGenerateCart = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const randomCart = await fetchRandomCart();
      if (randomCart.length > 0) {
        dispatch(setCart(randomCart));
        toast.success("¡Carrito aleatorio generado!");
      } else {
        toast.error("No se pudo generar un carrito. Intenta de nuevo.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      dispatch(setError(err.message));
      toast.error(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoToCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout");
    } else {
      toast.error("Primero debes generar un carrito.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">
        Bienvenido a Flapp E-commerce
      </h1>
      <div className="flex space-x-4">
        <button
          onClick={handleGenerateCart}
          disabled={isLoading}
          className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generando..." : "Generar Carrito"}
        </button>
        <button
          onClick={handleGoToCheckout}
          disabled={cartItems.length === 0}
          className="px-6 py-3 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalizar Compra
        </button>
      </div>
      {cartItems.length > 0 && (
        <p className="mt-4 text-gray-700">
          Carrito cargado con {cartItems.length} productos.
        </p>
      )}
      {/* Puedes mostrar errores aquí si lo deseas, aunque los toasts ya los manejan */}
      {/* {error && <p className="mt-4 text-red-500">{error}</p>} */}
    </div>
  );
};

export default HomePage;
