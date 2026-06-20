import { useState, useEffect } from "react";
import ArticlePage from "./components/ArticlePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import { Routes, Route, Link } from "react-router";

function App() {
  const API = import.meta.env.VITE_API_URL;
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${API}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <main className="max-w-4xl mx-auto p-4">
                {articles.map((a) => (
                  <article key={a.id} className="border-b py-4">
                    <span className="text-sm text-red-700">{a.category}</span>
                    <Link to={`/article/${a.id}`}>
                      <h2 className="text-xl font-bold hover:text-red-700">
                        {a.title}
                      </h2>
                    </Link>
                    {a.image_url && (
                      <img
                        src={a.image_url}
                        alt=""
                        className="w-full rounded my-2"
                      />
                    )}
                  </article>
                ))}
              </main>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
