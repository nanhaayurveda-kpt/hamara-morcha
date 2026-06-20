import { useState, useEffect } from "react";
import { Link } from "react-router";
import { slugify } from "../utils/slug";

function Home() {
  const API = import.meta.env.VITE_API_URL;
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${API}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(Array.isArray(data) ? data : []));
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-4">
      {articles.length === 0 ? (
        <p className="text-gray-600">अभी कोई खबर नहीं।</p>
      ) : (
        articles.map((a) => (
          <article key={a.id} className="border-b py-4">
            <span className="text-sm text-red-700">{a.category}</span>
            <Link to={`/article/${a.id}-${slugify(a.title)}`}>
              <h2 className="text-xl font-bold hover:text-red-700">
                {a.title}
              </h2>
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

export default Home;