import { useState, useEffect } from "react";

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data));
  }, []);

  const handleSubmit = async () => {
    await fetch("http://localhost:4000/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, title, summary }),
    });
    setCategory("");
    setTitle("");
    setSummary("");
    fetch("http://localhost:4000/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-red-700 mb-6">नई खबर जोड़ें</h2>

      <div className="bg-white shadow rounded p-6 mb-8">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">-- श्रेणी चुनें --</option>
          <option value="शिक्षक">शिक्षक</option>
          <option value="वकील">वकील</option>
          <option value="दिहाड़ीदार">दिहाड़ीदार</option>
          <option value="पत्रकार">पत्रकार</option>
          <option value="ऐक्टिविस्ट">ऐक्टिविस्ट</option>
          <option value="विविध">विविध</option>
          <option value="हुंकार">हुंकार</option>
        </select>

        <input
          type="text"
          placeholder="शीर्षक"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <textarea
          placeholder="खबर लिखें..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={5}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800"
        >
          खबर प्रकाशित करें
        </button>
      </div>

      <h2 className="text-2xl font-bold text-red-700 mb-4">प्रकाशित खबरें</h2>
      {articles.length === 0 ? (
        <p className="text-gray-500">अभी कोई खबर नहीं है।</p>
      ) : (
        articles.map((a) => (
          <div key={a.id} className="bg-white shadow rounded p-4 mb-4">
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
              {a.category}
            </span>
            <h3 className="font-bold mt-2">{a.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{a.summary}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;