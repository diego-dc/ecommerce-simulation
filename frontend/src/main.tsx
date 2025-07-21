import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { Toaster } from "react-hot-toast";
import { loadUserFromToken } from "./store/authSlice.ts";

// Dispatch action to load user data from token when the app starts
store.dispatch(loadUserFromToken());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster /> {/* Toaster for displaying notifications */}
    </Provider>
  </React.StrictMode>
);
