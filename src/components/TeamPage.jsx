import { Link } from "react-router";

const team = [
  {
    name: "रमाशंकर पाठक",
    role: "प्रधान संपादक",
    photo: "/photos/rama-shankar.jpg",
    email: "rsp.amt@gmail.com",
    phone: "9838455577",
  },
];

const editorialBoard = [
  { name: "दिनेश कुमार शुक्ल" },
];

function TeamPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link to="/" className="text-red-700 text-sm">← वापस</Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">हमारी टीम</h1>

      {/* प्रधान संपादक */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-red-700 border-b border-red-200 pb-1 mb-4">
          प्रधान संपादक
        </h2>
        {team.map((m, i) => (
          <div key={i} className="flex items-center gap-4">
            <img
              src={m.photo}
              alt={m.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-lg">{m.name}</p>
              <a
                href={`mailto:${m.email}`}
                className="text-sm text-gray-600 hover:text-red-700"
              >
                {m.email}
              </a>
              <p className="text-sm text-gray-600">{m.phone}</p>
            </div>
          </div>
        ))}
      </section>

      {/* संपादक मंडल */}
      <section>
        <h2 className="text-lg font-semibold text-red-700 border-b border-red-200 pb-1 mb-4">
          संपादक मंडल
        </h2>
        <ul className="space-y-2">
          {editorialBoard.map((m, i) => (
            <li key={i} className="py-1">
              <span className="font-semibold">{m.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default TeamPage;