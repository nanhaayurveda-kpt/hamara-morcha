import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const CATEGORIES = [
  "शिक्षक",
  "चिंटू-पिंटू",
  "दिहाड़ीदार",
  "पत्रकार",
  "ऐक्टिविस्ट",
  "विविध",
  "हुंकार",
];

const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ header: [2, 3, false] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

function Dashboard() {
  const API = import.meta.env.VITE_API_URL;
  const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  const [category, setCategory] = useState("शिक्षक");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageId, setImageId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [token, setToken] = useState("");
  const [editingId, setEditingId] = useState(null);

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
      { method: "POST", body: form },
    );
    const data = await res.json();

    setImageUrl(data.secure_url);
    setImageId(data.public_id);
    setUploading(false);
  }

  function startEdit(a) {
    setEditingId(a.id);
    setCategory(a.category);
    setTitle(a.title);
    setContent(a.content || "");
    setImageUrl(a.image_url || "");
    setImageId(a.image_id || "");
    window.scrollTo(0, 0);
  }

  async function handleSubmit() {
    if (!title.trim()) return;

    const url = editingId ? `${API}/articles/${editingId}` : `${API}/articles`;
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category,
        title,
        content,
        image_url: imageUrl,
        image_id: imageId,
      }),
    });

    setEditingId(null);
    setTitle("");
    setContent("");
    setImageUrl("");
    setImageId("");
    loadArticles();
  }

  async function handleDelete(id) {
    await fetch(`${API}/articles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadArticles();
  }

  if (!token) {
    return (
      <div className="max-w-3xl mx-auto p-4 mt-10 flex flex-col items-center gap-4">
        <p className="text-gray-600">
          खबर डालने के लिए पहले Google से login करें
        </p>
        <GoogleLogin
          onSuccess={(res) => setToken(res.credential)}
          onError={() => alert("Login नहीं हो पाया")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "ख़बर बदलें" : "नई ख़बर"}
        </h2>

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

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="पूरी खबर यहाँ लिखिए…"
          modules={QUILL_MODULES}
          className="mb-4 bg-white"
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
        {imageUrl && (
          <img src={imageUrl} alt="" className="w-40 rounded mb-3" />
        )}

        <button
          onClick={handleSubmit}
          className="bg-red-700 text-white px-5 py-2 rounded font-medium hover:bg-red-800"
        >
          {editingId ? "अपडेट करें" : "प्रकाशित करें"}
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
              onClick={() => startEdit(a)}
              className="text-sm text-gray-400 hover:text-red-700 mr-3"
            >
              संपादन
            </button>
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
