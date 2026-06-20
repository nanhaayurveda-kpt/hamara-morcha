import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import ArticlePage from "./components/ArticlePage";
import ContactPage from "./components/ContactPage";
import TeamPage from "./components/TeamPage";
import CategoryPage from "./components/CategoryPage";
import { Routes, Route } from "react-router";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/sampark" element={<ContactPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/category/:cat" element={<CategoryPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;