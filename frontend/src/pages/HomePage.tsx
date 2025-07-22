// src/pages/HomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { setCart, setError, setLoading } from "../store/cartSlice";
import { fetchRandomCart } from "../services/apiServices";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "../components/ui/Button";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="relative p-12 overflow-hidden transition-all border rounded-lg shadow-lg transition-duration-700 animate-fadeIn border-neutral-white/20 bg-neutral-white/10 backdrop-blur-md backdrop-saturate-150">
        <div className="relative z-10 flex flex-col items-center text-center text-neutral-white">
          <h1 className="mb-8 text-4xl font-bold">
            Bienvenido a E-commerce Simulator
          </h1>
          <Button
            onClick={handleGenerateCart}
            disabled={isLoading}
            buttonType="primary"
            iconRight={isLoading ? "mdi:loading" : "mdi:cart-plus"}
          >
            {isLoading ? "Generando..." : "Generar Carrito"}
          </Button>

          {cartItems.length > 0 ? (
            <>
              <p className="mt-4 text-gray-200">
                Carrito cargado con {cartItems.length} productos.
              </p>
              <Icon
                icon="mdi:cart"
                className="inline-block w-auto h-48 transition-all animate-fadeIn"
              />
              <Button
                buttonType="success"
                iconRight="mingcute:check-circle-fill"
                onClick={handleGoToCheckout}
                disabled={cartItems.length === 0}
                className="mt-6"
              >
                Finalizar Compra
              </Button>
            </>
          ) : (
            <Icon
              icon="mingcute:emoji-fill"
              className="inline-block w-auto h-48 transition-all transition-duration-700 animate-fadeIn"
            />
          )}
          {cartItems.length === 0 && (
            <p className="mt-4 text-white-400">
              Genera un carrito para comenzar!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
