import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <main>
        <Route path="/" element={<HomePage />} />
      </main>
    </Router>
  );
}

export default App;
