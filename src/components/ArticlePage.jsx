import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";

function ArticlePage() {
  const API = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`${API}/articles/${id}`)
      .then((res) => res.json())
      .then((data) => setArticle(data));
  }, [id]);

  if (!article) {
    return <p className="max-w-3xl mx-auto p-4">लोड हो रहा है…</p>;
  }

  return (
    <article className="max-w-3xl mx-auto p-4">
      <Link to="/" className="text-red-700 text-sm">← वापस</Link>
      <span className="block text-sm text-red-700 mt-4">{article.category}</span>
      <h1 className="text-2xl font-bold mb-3">{article.title}</h1>
      {article.image_url && (
        <img src={article.image_url} alt="" className="w-full rounded mb-4" />
      )}
      <p className="text-gray-800 whitespace-pre-line leading-relaxed">
        {article.content}
      </p>
    </article>
  );
}

export default ArticlePage;