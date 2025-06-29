import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Navbar } from "./components/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Watch } from "./pages/Watch";
import { Footer } from "./components/Footer";
import { QuizPage } from "./pages/Quiz";
import { ScrollToTop } from "./components/ScrollToTop";

function AppWrapper() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollToTop />
      <div className="flex-grow">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/watch" element={<Watch />} />
          <Route path = "/quiz" element= {<QuizPage />} />
        </Routes>
      </div>
      <Footer />
    </div>    
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