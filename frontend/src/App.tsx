import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import ShippingDetailsPage from "./pages/ShippingDetailsPage";
import Background from "./components/layout/Background";

function App() {
  return (
    <Router>
      <main>
        <Background>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/shipping" element={<ShippingDetailsPage />} />
          </Routes>
        </Background>
      </main>
    </Router>
  );
}

export default App;
