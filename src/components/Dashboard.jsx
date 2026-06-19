import { useState, useEffect } from "react";

const CATEGORIES = ["शिक्षक", "वकील", "दिहाड़ीदार", "पत्रकार", "ऐक्टिविस्ट", "विविध", "हुंकार"];

function Dashboard() {
  const API = import.meta.env.VITE_API_URL;
  const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  const [category, setCategory] = useState("शिक्षक");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageId, setImageId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [articles, setArticles] = useState([]);

  function loadArticles() {
    fetch(`${API}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data));
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
      { method: "POST", body: form }
    );
    const data = await res.json();

    setImageUrl(data.secure_url);
    setImageId(data.public_id);
    setUploading(false);
  }

  async function handleSubmit() {
    if (!title.trim()) return;

    await fetch(`${API}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        title,
        summary,
        image_url: imageUrl,
        image_id: imageId,
      }),
    });

    setTitle("");
    setSummary("");
    setImageUrl("");
    setImageId("");
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

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mb-3"
        />

        {uploading && (
          <p className="text-sm text-gray-500 mb-3">तस्वीर चढ़ रही है…</p>
        )}
        {imageUrl && <img src={imageUrl} alt="" className="w-40 rounded mb-3" />}

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
            className="flex items-center gap-3 bg-white border rounded p-3"
          >
            {a.image_url && (
              <img
                src={a.image_url}
                alt=""
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
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