import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import ShippingDetailsPage from "./pages/ShippingDetailsPage";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/shipping" element={<ShippingDetailsPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
