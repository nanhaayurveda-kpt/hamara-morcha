import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { slugify } from "../utils/slug";

function CategoryPage() {
  const API = import.meta.env.VITE_API_URL;
  const { cat } = useParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${API}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(Array.isArray(data) ? data : []));
  }, []);

  const filtered = articles.filter((a) => a.category === cat);

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold mb-2">{cat}</h1>
      <hr className="mb-4 border-gray-200" />

      {filtered.length === 0 ? (
        <p className="text-gray-600">इस श्रेणी में अभी कोई खबर नहीं।</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {filtered.map((a) => (
            <Link
              key={a.id}
              to={`/article/${a.id}-${slugify(a.title)}`}
              className="flex gap-4 py-4 group"
            >
              <div className="flex-1">
                <span className="text-xs font-bold text-gray-500">
                  {a.category}
                </span>
                <h3 className="text-xl font-bold leading-snug mt-1 group-hover:text-gray-600">
                  {a.title}
                </h3>
              </div>
              {a.image_url && (
                <img
                  src={a.image_url}
                  alt=""
                  className="w-28 h-28 rounded object-cover flex-shrink-0"
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default CategoryPage;