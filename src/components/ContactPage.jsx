import { Link } from "react-router";

function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link to="/" className="text-red-700 text-sm">
        ← वापस
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-3">संपर्क</h1>

      <p className="text-gray-800 leading-relaxed">
        रमाशंकर पाठक पूरे टेकई तिवारी,
        <br />
        पोस्ट — शाहगढ़-227411,
        <br />
        जिला — अमेठी,
        <br />
        उत्तर प्रदेश।
      </p>
    </div>
  );
}

export default ContactPage;
