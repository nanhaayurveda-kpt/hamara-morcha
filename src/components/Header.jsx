import { Link } from "react-router";

const MENU = ["शिक्षक", "वकील", "दिहाड़ीदार", "पत्रकार", "ऐक्टिविस्ट", "विविध", "हुंकार"];

function Header() {
  return (
    <header className="bg-red-700 text-white">
      <div className="max-w-4xl mx-auto px-4 py-4 text-center">
        <Link to="/">
          <h1 className="text-3xl font-bold">पगार-पीड़ा</h1>
        </Link>
        <p className="mt-2 text-sm text-red-100">
          गरिमामय जिंदगी जीने के लिए जरूरी न्यूनतम मजदूरी से भी वंचित आबादी की हुंकार
        </p>
      </div>

      <nav className="bg-red-800">
        <ul className="max-w-4xl mx-auto flex flex-wrap justify-between px-4 py-2">
          <li>
            <Link to="/" className="hover:underline">होम</Link>
          </li>
          {MENU.map((item) => (
            <li key={item} className="cursor-pointer hover:underline">
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;