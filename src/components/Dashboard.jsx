import { useState, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
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

function extractYouTubeId(url) {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/,
  );
  return m ? m[1] : null;
}

function cleanContent(html) {
  return html.replace(/&nbsp;|\u00A0/g, " ");
}

const QUILL_MODULES = {
  toolbar: {
    container: [
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ header: [2, 3, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "video"],
      ["clean"],
    ],
    handlers: {
      video: function () {
        const url = window.prompt("YouTube का link यहाँ paste कीजिए:");
        if (!url) return;
        const id = extractYouTubeId(url);
        if (!id) {
          window.alert("YouTube link सही नहीं लगा।");
          return;
        }
        const range = this.quill.getSelection(true);
        this.quill.insertEmbed(
          range.index,
          "video",
          `https://www.youtube.com/embed/${id}`,
          "user",
        );
        this.quill.setSelection(range.index + 1);
      },
    },
  },
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
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfUploading, setPdfUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [articles, setArticles] = useState([]);
  const [token, setToken] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryCaption, setGalleryCaption] = useState("");

  const [pending, setPending] = useState([]);

  function loadArticles() {
    fetch(`${API}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data));
  }

  function loadGallery(id) {
    fetch(`${API}/articles/${id}/images`)
      .then((res) => res.json())
      .then((data) => setGalleryImages(Array.isArray(data) ? data : []));
  }

  function loadPending() {
    fetch(`${API}/comments/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPending(Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("pp_draft");
    if (!saved) return;
    try {
      const d = JSON.parse(saved);
      if (d.title) setTitle(d.title);
      if (d.content) setContent(d.content);
      if (d.category) setCategory(d.category);
      if (d.caption) setCaption(d.caption);
      if (d.imageUrl) setImageUrl(d.imageUrl);
      if (d.imageId) setImageId(d.imageId);
      if (d.pdfUrl) setPdfUrl(d.pdfUrl);
    } catch (e) {
      console.error("draft पढ़ने में दिक्कत:", e.message);
    }
  }, []);

  useEffect(() => {
    if (editingId) return;
    const draft = {
      title,
      content,
      category,
      caption,
      imageUrl,
      imageId,
      pdfUrl,
    };
    localStorage.setItem("pp_draft", JSON.stringify(draft));
  }, [title, content, category, caption, imageUrl, imageId, pdfUrl, editingId]);

  useEffect(() => {
    if (token) loadPending();
  }, [token]);

  function handleLogout() {
    googleLogout();
    setToken("");
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setImageUrl("");
    setImageId("");
    setPdfUrl("");
    setCaption("");
    setGalleryImages([]);
    setGalleryCaption("");
  }

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

  async function handlePdf(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPdfUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`,
      { method: "POST", body: form },
    );
    const data = await res.json();

    setPdfUrl(data.secure_url || "");
    setPdfUploading(false);
  }

  async function handleGalleryUpload(e) {
    const file = e.target.files[0];
    if (!file || !editingId) return;
    setGalleryUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", PRESET);

    const up = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
      { method: "POST", body: form },
    );
    const data = await up.json();

    const res = await fetch(`${API}/articles/${editingId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        image_url: data.secure_url,
        image_id: data.public_id,
        caption: galleryCaption,
      }),
    });

    setGalleryUploading(false);
    e.target.value = "";

    if (!res.ok) {
      alert("गैलरी तस्वीर सेव नहीं हुई — दुबारा login करके देखिए।");
      return;
    }

    setGalleryCaption("");
    loadGallery(editingId);
  }

  async function handleGalleryDelete(imageId) {
    const res = await fetch(`${API}/article-images/${imageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert("तस्वीर नहीं हटी — दुबारा login करके देखिए।");
      return;
    }
    loadGallery(editingId);
  }

  function startEdit(a) {
    setEditingId(a.id);
    setCategory(a.category);
    setTitle(a.title);
    setContent(a.content || "");
    setImageUrl(a.image_url || "");
    setImageId(a.image_id || "");
    setPdfUrl(a.pdf_url || "");
    setCaption(a.caption || "");
    loadGallery(a.id);
    window.scrollTo(0, 0);
  }

  async function handleSubmit() {
    if (!title.trim()) return;

    const url = editingId ? `${API}/articles/${editingId}` : `${API}/articles`;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category,
        title,
        content: cleanContent(content),
        image_url: imageUrl,
        image_id: imageId,
        pdf_url: pdfUrl,
        caption,
      }),
    });

    if (!res.ok) {
      alert(`सेव नहीं हुआ (status ${res.status}) — दुबारा login करके देखिए।`);
      return;
    }

    const saved = await res.json();
    loadArticles();

    if (editingId) {
      resetForm();
    } else {
      localStorage.removeItem("pp_draft");
      setEditingId(saved.id);
      loadGallery(saved.id);
      window.scrollTo(0, 0);
      alert(
        "ख़बर प्रकाशित हो गई — अब नीचे 'गैलरी' सेक्शन में तस्वीरें जोड़ सकते हैं।",
      );
    }
  }

  async function handleDelete(id) {
    const res = await fetch(`${API}/articles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert(
        `delete नहीं हुआ (status ${res.status}) — दुबारा login करके देखिए।`,
      );
      return;
    }

    if (editingId === id) resetForm();
    loadArticles();
  }

  async function approveComment(id) {
    await fetch(`${API}/comments/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadPending();
  }

  async function deleteComment(id) {
    await fetch(`${API}/comments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadPending();
  }

  function askSubmit() {
    if (!title.trim()) return;
    if (editingId) {
      setConfirm({
        message: "इस ख़बर में बदलाव सेव करें?",
        action: handleSubmit,
      });
    } else {
      handleSubmit();
    }
  }

  function askDelete(id) {
    setConfirm({
      message: "क्या यह ख़बर हटानी है? यह वापस नहीं आएगी।",
      action: () => handleDelete(id),
    });
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
      <div className="flex justify-end mb-3">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-700"
        >
          लॉगआउट
        </button>
      </div>

      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {editingId ? "ख़बर बदलें" : "नई ख़बर"}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-red-700"
            >
              + नई ख़बर
            </button>
          )}
        </div>

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
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="मुख्य फोटो का कैप्शन (वैकल्पिक)"
          className="w-full border rounded px-3 py-2 text-sm mb-3 outline-none"
        />

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            PDF (वैकल्पिक)
          </label>
          <input type="file" accept="application/pdf" onChange={handlePdf} />
        </div>

        {pdfUploading && (
          <p className="text-sm text-gray-500 mb-3">PDF चढ़ रहा है…</p>
        )}
        {pdfUrl && (
          <p className="text-sm text-green-700 mb-3">
            PDF लग गया ✓ —{" "}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              देखें
            </a>
          </p>
        )}

        {editingId ? (
          <div className="mb-4 border-t pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              गैलरी (अतिरिक्त तस्वीरें)
            </label>
            <input
              value={galleryCaption}
              onChange={(e) => setGalleryCaption(e.target.value)}
              placeholder="अगली तस्वीर का कैप्शन (वैकल्पिक)"
              className="w-full border rounded px-3 py-2 text-sm mb-2 outline-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
            />
            {galleryUploading && (
              <p className="text-sm text-gray-500 mt-2">तस्वीर चढ़ रही है…</p>
            )}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {galleryImages.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      onClick={() => handleGalleryDelete(img.id)}
                      className="absolute top-1 right-1 bg-red-700 text-white text-xs rounded px-1.5"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 border-t pt-4">
            <p className="text-sm text-gray-500">
              गैलरी (अतिरिक्त तस्वीरें) — खबर "प्रकाशित" करते ही यहीं जुड़ने
              लगेगी।
            </p>
          </div>
        )}

        <button
          onClick={askSubmit}
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
              onClick={() => askDelete(a.id)}
              className="text-sm text-gray-400 hover:text-red-700"
            >
              हटाएँ
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-gray-500 mt-8 mb-3">
        स्वीकृति बाक़ी टिप्पणियाँ ({pending.length})
      </h3>

      <div className="space-y-2">
        {pending.length === 0 ? (
          <p className="text-gray-400 text-sm">कोई नई टिप्पणी नहीं।</p>
        ) : (
          pending.map((c) => (
            <div key={c.id} className="bg-white border rounded p-3">
              <p className="text-xs text-gray-500">
                {c.author_name} · {c.article_title}
              </p>
              <p className="text-base text-gray-900 my-1">{c.body}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => approveComment(c.id)}
                  className="text-sm text-green-700 hover:underline"
                >
                  अनुमति दें
                </button>
                <button
                  onClick={() => deleteComment(c.id)}
                  className="text-sm text-red-700 hover:underline"
                >
                  हटाएँ
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-sm w-full shadow-lg">
            <p className="mb-5 text-base">{confirm.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                रद्द करें
              </button>
              <button
                onClick={() => {
                  confirm.action();
                  setConfirm(null);
                }}
                className="px-4 py-2 text-sm bg-red-700 text-white rounded hover:bg-red-800"
              >
                हाँ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
