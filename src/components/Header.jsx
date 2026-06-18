const MENU = ["शिक्षक", "वकील", "दिहाड़ीदार", "पत्रकार", "ऐक्टिविस्ट", "विविध", "हुंकार", "संपर्क"];

function Header() {
  return (
    <header className="bg-red-700 text-white">
      <div className="max-w-4xl mx-auto px-4 py-4 text-center">
        <h1 className="text-3xl font-bold">हमारा मोर्चा</h1>
        <p className="mt-4 text-sm text-red-100">
          गरिमामय जिंदगी जीने के लिए जरूरी न्यूनतम मजदूरी से भी वंचित आबादी की
          हुंकार
        </p>
      </div>
      <nav className="bg-red-800">
        <ul className="flex flex-wrap justify-evenly py-2">
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
