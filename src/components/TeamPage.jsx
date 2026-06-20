import { Link } from "react-router";

const team = [
  { name: "रमाशंकर पाठक", role: "प्रधान संपादक" },
  { name: "विजय कुमार", role: "संपादक मंडल" },
  { name: "दिनेश शुक्ल", role: "संपादक मंडल" },
];

function TeamPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link to="/" className="text-red-700 text-sm">← वापस</Link>
      <h1 className="text-2xl font-bold mt-4 mb-4">हमारी टीम</h1>
      <ul className="space-y-3">
        {team.map((m, i) => (
          <li key={i} className="border-b py-2">
            <span className="font-semibold">{m.name}</span>
            <span className="text-gray-600"> — {m.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamPage;