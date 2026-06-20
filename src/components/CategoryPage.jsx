import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";

function CategoryPage() {
  const API = import.meta.env.VITE_API_URL;
  const { cat } = useParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${API}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data));
  }, []);

  const filtered = articles.filter((a) => a.category === cat);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{cat}</h1>
      {filtered.length === 0 ? (
        <p className="text-gray-600">इस श्रेणी में अभी कोई खबर नहीं।</p>
      ) : (
        filtered.map((a) => (
          <article key={a.id} className="border-b py-4">
            <span className="text-sm text-red-700">{a.category}</span>
            <Link to={`/article/${a.id}`}>
              <h2 className="text-xl font-bold hover:text-red-700">{a.title}</h2>
            </Link>
            {a.image_url && (
              <img src={a.image_url} alt="" className="w-full rounded my-2" />
            )}
          </article>
        ))
      )}
    </main>
  );
}

export default CategoryPage;