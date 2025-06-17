import { Home } from "./pages/Home";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function AppWrapper() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;