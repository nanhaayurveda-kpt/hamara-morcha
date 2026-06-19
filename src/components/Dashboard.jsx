import { useState, useEffect } from "react";

const CATEGORIES = [
  "शिक्षक",
  "वकील",
  "दिहाड़ीदार",
  "पत्रकार",
  "ऐक्टिविस्ट",
  "विविध",
  "हुंकार",
];

function Dashboard() {
  const API = import.meta.env.VITE_API_URL;

  const [category, setCategory] = useState("शिक्षक");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [articles, setArticles] = useState([]);

  function loadArticles() {
    fetch(`${API}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data));
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function handleSubmit() {
    if (!title.trim()) return;

    await fetch(`${API}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, title, summary }),
    });

    setTitle("");
    setSummary("");
    loadArticles();
  }

  async function handleDelete(id) {
    await fetch(`${API}/articles/${id}`, { method: "DELETE" });
    loadArticles();
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">नई ख़बर</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="शीर्षक"
          className="w-full text-xl font-medium border-b pb-2 mb-4 outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 text-sm mb-4"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="सारांश लिखिए…"
          rows={4}
          className="w-full border rounded p-3 mb-4 outline-none resize-none"
        />

        <button
          onClick={handleSubmit}
          className="bg-red-700 text-white px-5 py-2 rounded font-medium hover:bg-red-800"
        >
          प्रकाशित करें
        </button>
      </div>

      <h3 className="text-sm font-semibold text-gray-500 mt-8 mb-3">
        प्रकाशित ख़बरें ({articles.length})
      </h3>

      <div className="space-y-2">
        {articles.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between bg-white border rounded p-3"
          >
            <div>
              <span className="text-xs text-red-700">{a.category}</span>
              <p className="font-medium">{a.title}</p>
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              className="text-sm text-gray-400 hover:text-red-700"
            >
              हटाएँ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
