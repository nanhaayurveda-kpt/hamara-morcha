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

  if (articles.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-gray-600">अभी कोई खबर नहीं।</p>
      </main>
    );
  }

  const [lead, ...rest] = articles;

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {/* मुख्य खबर (lead) */}
      <Link
        to={`/article/${lead.id}-${slugify(lead.title)}`}
        className="block group"
      >
        {lead.image_url && (
          <img
            src={lead.image_url}
            alt=""
            className="w-full rounded-lg mb-3 aspect-video object-cover"
          />
        )}
        <span className="text-sm font-bold text-red-700">{lead.category}</span>
        <h2 className="text-3xl font-extrabold leading-snug mt-1 group-hover:text-red-700">
          {lead.title}
        </h2>
      </Link>

      {/* बाक़ी खबरें */}
      {rest.length > 0 && (
        <>
          <hr className="my-6 border-gray-200" />
          <div className="divide-y divide-gray-200">
            {rest.map((a) => (
              <Link
                key={a.id}
                to={`/article/${a.id}-${slugify(a.title)}`}
                className="flex gap-4 py-4 group"
              >
                <div className="flex-1">
                  <span className="text-xs font-bold text-red-700">
                    {a.category}
                  </span>
                  <h3 className="text-xl font-bold leading-snug mt-1 group-hover:text-red-700">
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
        </>
      )}
    </main>
  );
}

export default Home;