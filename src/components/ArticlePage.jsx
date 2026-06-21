import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { GoogleLogin } from "@react-oauth/google";

function tidyContent(html) {
  if (!html) return "";
  return html.replace(/&nbsp;|\u00A0/g, " ");
}

function ArticlePage() {
  const API = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const articleId = id.split("-")[0];
  const [article, setArticle] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentToken, setCommentToken] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentSent, setCommentSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`${API}/articles/${articleId}`)
      .then((res) => res.json())
      .then((data) => setArticle(data));
  }, [articleId]);

  useEffect(() => {
    fetch(`${API}/articles/${articleId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []));
  }, [articleId]);

  async function submitComment() {
    if (!commentBody.trim()) return;
    setSending(true);
    const res = await fetch(`${API}/articles/${articleId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${commentToken}`,
      },
      body: JSON.stringify({ body: commentBody }),
    });
    setSending(false);
    if (!res.ok) {
      alert("टिप्पणी नहीं भेजी जा सकी — दुबारा login करके देखिए।");
      return;
    }
    setCommentBody("");
    setCommentSent(true);
  }

  if (!article) {
    return <p className="max-w-2xl mx-auto px-4 py-8">लोड हो रहा है…</p>;
  }

  const views = article.views ?? article.view_count;

  return (
    <article className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/" className="text-sm font-medium text-red-700">
        ← वापस
      </Link>

      <span className="block text-sm font-bold text-red-700 mt-5">
        {article.category}
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold leading-snug mt-1 mb-2">
        {article.title}
      </h1>

      {views != null && (
        <p className="text-sm text-gray-500 mb-5">👁 {views} बार पढ़ी गई</p>
      )}

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
        className="text-lg leading-relaxed text-gray-900 break-words [&_p]:mb-4 [&_a]:text-red-700 [&_a]:underline [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:my-4 [&_iframe]:rounded-lg"
        dangerouslySetInnerHTML={{ __html: tidyContent(article.content) }}
      />

      {article.images && article.images.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {article.images.map((img) => (
            <figure key={img.id}>
              <img src={img.image_url} alt="" className="w-full rounded-lg" />
              {img.caption && (
                <figcaption className="text-sm text-gray-500 mt-1">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

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

      <section className="mt-10 border-t border-gray-200 pt-6">
        <h2 className="text-xl font-bold mb-4">टिप्पणियाँ</h2>

        {comments.length === 0 ? (
          <p className="text-gray-500 text-base mb-6">अभी कोई टिप्पणी नहीं।</p>
        ) : (
          <ul className="space-y-4 mb-6">
            {comments.map((c) => (
              <li key={c.id} className="border-b border-gray-100 pb-3">
                <p className="text-sm font-semibold text-gray-800">
                  {c.author_name}
                </p>
                <p className="text-base text-gray-900">{c.body}</p>
              </li>
            ))}
          </ul>
        )}

        {commentSent ? (
          <p className="text-green-700 text-base">
            आपकी टिप्पणी भेज दी गई है। स्वीकृति के बाद यहाँ दिखेगी।
          </p>
        ) : commentToken ? (
          <div>
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="अपनी टिप्पणी लिखें…"
              rows={3}
              className="w-full border rounded p-3 text-base outline-none mb-2"
            />
            <button
              onClick={submitComment}
              disabled={sending}
              className="bg-red-700 text-white px-5 py-2 rounded font-medium hover:bg-red-800 disabled:opacity-50"
            >
              {sending ? "भेजा जा रहा है…" : "टिप्पणी भेजें"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-2">
            <p className="text-gray-600 text-base">
              टिप्पणी करने के लिए Google से login करें
            </p>
            <GoogleLogin
              onSuccess={(res) => setCommentToken(res.credential)}
              onError={() => alert("Login नहीं हो पाया")}
            />
          </div>
        )}
      </section>
    </article>
  );
}

export default ArticlePage;