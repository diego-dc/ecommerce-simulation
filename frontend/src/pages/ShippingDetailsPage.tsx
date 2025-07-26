// src/pages/ShippingDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  setCustomerData,
  setShippingQuote,
  setLoading,
  setError,
} from "../store/cartSlice";
import type {
  CustomerData,
  BackendProductPayload,
  CartBackendPayload,
} from "../types/cart";
import { quoteShipping } from "../services/apiServices";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";

const ShippingDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customerData = useSelector(
    (state: RootState) => state.cart.customerData
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isLoading = useSelector((state: RootState) => state.cart.isLoading);

  const [formData, setFormData] = useState<CustomerData>({
    name: "",
    shipping_street: "",
    commune: "",
    phone: "",
  });

  useEffect(() => {
    if (customerData) {
      setFormData(customerData); // pre-load data if already exists in Redux
    }
  }, [customerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.shipping_street ||
      !formData.commune ||
      !formData.phone
    ) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }
    dispatch(setCustomerData(formData));
    toast.success("Datos de envío guardados.");
  };

  const handleQuoteShipping = async () => {
    if (
      !formData.name ||
      !formData.shipping_street ||
      !formData.commune ||
      !formData.phone
    ) {
      toast.error(
        "Por favor, completa todos los datos de envío antes de cotizar."
      );
      return;
    }

    if (cartItems.length === 0) {
      toast.error("No hay productos en el carrito para cotizar envío.");
      navigate("/");
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setCustomerData(formData)); // Make sure the latest form data is in Redux

    // Prepare payload for backend
    const productsPayload: BackendProductPayload[] = cartItems.map((item) => ({
      productId: item.productId.toString(), // El backend espera string para productId
      price: item.price,
      quantity: item.quantity,
      discount:
        item.originalPrice * item.quantity * (item.discountPercentage / 100),
    }));

    const backendPayload: CartBackendPayload = {
      products: productsPayload,
      customer_data: formData,
    };

    try {
      const quote = await quoteShipping(backendPayload);
      dispatch(setShippingQuote(quote));
      toast.success(
        `Envío Flapp con ${quote.courier} ⚡️ - $ ${quote.price.toFixed(2)}`
      );
      navigate("/checkout"); // Go back to checkout
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      dispatch(setError(err.message));
      toast.error(`No hay envíos disponibles :( ${err.message}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative max-w-3xl p-12 overflow-hidden border rounded-lg shadow-lg border-white/20 bg-white/10 backdrop-blur-md backdrop-saturate-150">
        <div className="relative z-10 flex flex-col items-center text-white">
          <h1 className="mb-6 text-3xl font-bold">Ingresar Datos de Envío</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="shipping_street"
                className="block text-sm font-medium"
              >
                Dirección (Calle y Número)
              </label>
              <input
                type="text"
                id="shipping_street"
                name="shipping_street"
                value={formData.shipping_street}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="commune" className="block text-sm font-medium">
                Comuna
              </label>
              <input
                type="text"
                id="commune"
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-between pt-4 space-x-4">
              <Button
                onClick={() => navigate("/checkout")}
                iconLeft="mingcute:delete-back-fill"
              >
                Volver
              </Button>
              <Button
                buttonType="success"
                type="submit"
                iconRight="mingcute:save-2-fill"
              >
                Guardar Datos
              </Button>
              <Button
                onClick={handleQuoteShipping}
                disabled={isLoading}
                buttonType="success"
                iconRight="mdi:truck-check"
              >
                {isLoading ? "Cotizando..." : "Cotizar Despacho"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetailsPage;
