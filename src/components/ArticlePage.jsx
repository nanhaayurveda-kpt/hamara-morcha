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
      <Link to="/" className="text-red-700 text-sm">
        ← वापस
      </Link>
      <span className="block text-sm text-red-700 mt-4">
        {article.category}
      </span>
      <h1 className="text-2xl font-bold mb-3">{article.title}</h1>
      {article.image_url && (
        <img src={article.image_url} alt="" className="w-full rounded mb-4" />
      )}
      <div
        className="text-gray-800 leading-relaxed [&_p]:mb-3 [&_a]:text-red-700 [&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}

export default ArticlePage;
