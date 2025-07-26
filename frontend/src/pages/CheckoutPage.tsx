// src/pages/CheckoutPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { clearCart } from "../store/cartSlice";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const customerData = useSelector(
    (state: RootState) => state.cart.customerData
  );
  const shippingQuote = useSelector(
    (state: RootState) => state.cart.shippingQuote
  );

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Carrito limpiado.");
    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleQuoteShipping = () => {
    if (!customerData) {
      toast("Por favor, completa tus datos de envío.", {
        icon: "🚚",
      });
      navigate("/shipping");
      return;
    }
    navigate("/shipping");
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-[128px]">
        <div className="relative max-w-3xl p-12 overflow-hidden border rounded-lg shadow-lg border-white/20 bg-white/10 backdrop-blur-md backdrop-saturate-150">
          <h2 className="mb-4 text-2xl font-bold">Tu carrito está vacío.</h2>
          <Button
            onClick={() => navigate("/")}
            iconRight="mingcute:home-2-fill"
          >
            Volver a la página inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-[128px]">
      <div className="relative max-w-3xl p-12 overflow-hidden border rounded-lg shadow-lg border-white/20 bg-white/10 backdrop-blur-md backdrop-saturate-150">
        <div className="relative z-10 flex flex-col items-center text-white">
          <h1 className="mb-6 text-4xl font-bold">Resumen de Compra</h1>

          <div className="w-full mb-6">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3 py-3 border-b"
              >
                <div className="flex items-center gap-3 ">
                  <div className="p-2">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="object-cover w-16 h-16 rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-neutral-200">
                      {item.quantity} en el carrito
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {item.discountPercentage > 0 && (
                    <p className="text-sm line-through text-error-600">
                      ${item.originalPrice.toFixed(2)} c/u
                    </p>
                  )}
                  <p className="text-xl font-bold text-primary-200">
                    ${item.price.toFixed(2)} c/u
                  </p>
                  <p className="text-lg font-bold">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <p className="text-2xl font-bold text-neutral-white">
                Total Carrito: ${calculateTotal().toFixed(2)}
              </p>
            </div>
          </div>

          {customerData && (
            <div className="w-full pt-4 mb-6 border-t">
              <h2 className="mb-4 text-2xl font-semibold">Datos de Envío:</h2>
              <p className="">
                <strong>Nombre:</strong> {customerData.name}
              </p>
              <p className="">
                <strong>Dirección:</strong> {customerData.shipping_street},{" "}
                {customerData.commune}
              </p>
              <p className="">
                <strong>Teléfono:</strong> {customerData.phone}
              </p>
            </div>
          )}

          {shippingQuote && (
            <div className="w-full pt-4 mb-6 border-t">
              <h2 className="mb-4 text-2xl font-semibol">
                Cotización de Despacho:
              </h2>
              <div className="p-8 rounded-lg bg-success-100">
                <p className="text-xl font-bold text-green-700">
                  Envío Flapp con {shippingQuote.courier} ⚡️ - ${" "}
                  {shippingQuote.price.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between w-full pt-6 mt-8 space-x-4 border-t">
            <div className="flex space-x-4">
              <Button
                onClick={handleGoBack}
                iconLeft="mingcute:delete-back-fill"
              >
                Volver
              </Button>
              <Button
                onClick={handleClearCart}
                buttonType="error"
                iconRight="mdi:trash-can"
              ></Button>
            </div>
            <Button
              onClick={handleQuoteShipping}
              buttonType="success"
              iconRight="mdi:truck-check"
            >
              Cotizar Despacho
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
