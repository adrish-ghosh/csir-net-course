// src/App.jsx
import { Toaster } from "sonner";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Mentor } from "./components/Mentor";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";
import "./App.css";

function App() {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToMentor = () => {
    document.getElementById("mentor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="App">
      <Navbar onEnroll={scrollToPricing} />
      <main>
        <Hero onPrimary={scrollToPricing} onSecondary={scrollToMentor} />
        <Features />
        <Mentor />
        <Pricing />
      </main>
      <Footer />
      
      {/* Toast notification container for success/error messages */}
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;