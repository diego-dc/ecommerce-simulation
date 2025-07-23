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
      toast.custom("Por favor, ingresa tus datos de envío primero.");
      navigate("/shipping"); // Redirigir a la vista de datos de envío
      return;
    }
    navigate("/shipping"); // Simplemente navega, el botón de cotizar estará allí
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="mb-4 text-2xl font-bold text-gray-700">
          Tu carrito está vacío.
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Volver a la página inicial
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative max-w-3xl p-12 overflow-hidden border rounded-lg shadow-lg border-white/20 bg-white/10 backdrop-blur-md backdrop-saturate-150">
        <div className="relative z-10 flex flex-col items-center text-white">
          <h1 className="mb-6 text-4xl font-bold">Resumen de Compra</h1>

          <div className="mb-6">
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
                      Cantidad: {item.quantity}
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
            <div className="pt-4 mb-6 border-t">
              <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Datos de Envío:
              </h2>
              <p className="text-gray-700">**Nombre:** {customerData.name}</p>
              <p className="text-gray-700">
                **Dirección:** {customerData.shipping_street},{" "}
                {customerData.commune}
              </p>
              <p className="text-gray-700">
                **Teléfono:** {customerData.phone}
              </p>
            </div>
          )}

          {shippingQuote && (
            <div className="pt-4 mb-6 border-t">
              <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Cotización de Despacho:
              </h2>
              <p className="text-xl font-bold text-green-700">
                Envío Flapp con {shippingQuote.courier} ⚡️ - ${" "}
                {shippingQuote.price.toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex justify-between pt-6 mt-8 space-x-4 border-t">
            <Button onClick={handleGoBack}>Volver</Button>
            <Button
              onClick={handleClearCart}
              buttonType="error"
              iconRight="mdi:trash-can"
            ></Button>
            <Button onClick={handleQuoteShipping} buttonType="primary">
              Cotizar Despacho
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
