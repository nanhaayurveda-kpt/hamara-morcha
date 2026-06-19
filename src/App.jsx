import { useState, useEffect } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  const API = import.meta.env.VITE_API_URL;
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState("home");

  useEffect(() => {
    fetch(`${API}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data));
  }, []);

  return (
    <div>
      <Header />

      <div className="flex gap-4 p-2">
        <button onClick={() => setPage("home")}>होम</button>
        <button onClick={() => setPage("dashboard")}>डैशबोर्ड</button>
      </div>

      {page === "home" && (
        <main className="max-w-4xl mx-auto p-4">
          {articles.map((a) => (
            <article key={a.id} className="border-b py-4">
              <span className="text-sm text-red-700">{a.category}</span>
              <h2 className="text-xl font-bold">{a.title}</h2>
              {a.image_url && (
                <img src={a.image_url} alt="" className="w-full rounded my-2" />
              )}
              <p className="text-gray-600">{a.summary}</p>
            </article>
          ))}
        </main>
      )}

      {page === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;