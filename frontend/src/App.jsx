import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Navbar } from "./components/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function AppWrapper() {
  const location = useLocation();

  return (
    <>
    <Navbar /> {/* Shows navbar on each page*/}
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path = "/about" element={<About />} />
    </Routes>
    </>
    
    
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