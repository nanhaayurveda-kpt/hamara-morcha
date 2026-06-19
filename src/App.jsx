import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";

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
                    <h2 className="text-xl font-bold">{a.title}</h2>
                    {a.image_url && (
                      <img
                        src={a.image_url}
                        alt=""
                        className="w-full rounded my-2"
                      />
                    )}
                    <p className="text-gray-600">{a.summary}</p>
                  </article>
                ))}
              </main>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;