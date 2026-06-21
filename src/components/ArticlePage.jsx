import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";

function tidyContent(html) {
  if (!html) return "";
  let h = html.replace(/>\s+</g, "><");
  h = h.replace(/(?:<br\s*\/?>\s*){2,}/gi, "\u0001");
  h = h.replace(/<br\s*\/?>/gi, " ");
  if (/<p[\s>]/i.test(h)) {
    h = h.replace(/\u0001/g, "");
  } else {
    h =
      "<p>" +
      h
        .split("\u0001")
        .map((s) => s.trim())
        .filter(Boolean)
        .join("</p><p>") +
      "</p>";
  }
  return h;
}

function ArticlePage() {
  const API = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const articleId = id.split("-")[0];
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`${API}/articles/${articleId}`)
      .then((res) => res.json())
      .then((data) => setArticle(data));
  }, [articleId]);

  if (!article) {
    return <p className="max-w-2xl mx-auto px-4 py-8">लोड हो रहा है…</p>;
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/" className="text-sm font-medium text-red-700">
        ← वापस
      </Link>

      <span className="block text-sm font-bold text-red-700 mt-5">
        {article.category}
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold leading-snug mt-1 mb-5">
        {article.title}
      </h1>

      {article.image_url && (
        <figure className="mb-6">
          <img src={article.image_url} alt="" className="w-full rounded-lg" />
          {article.caption && (
            <figcaption className="text-sm text-gray-500 mt-2">
              {article.caption}
            </figcaption>
          )}
        </figure>
      )}

      <div
        className="text-lg leading-relaxed text-gray-900 [&_p]:mb-4 [&_a]:text-red-700 [&_a]:underline [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:my-4 [&_iframe]:rounded-lg"
        dangerouslySetInnerHTML={{ __html: tidyContent(article.content) }}
      />

      {article.pdf_url && (
        <a
          href={article.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 rounded border border-red-700 px-4 py-2 font-medium text-red-700 hover:bg-red-50"
        >
          📄 संलग्न PDF देखें / डाउनलोड करें
        </a>
      )}
    </article>
  );
}

export default ArticlePage;