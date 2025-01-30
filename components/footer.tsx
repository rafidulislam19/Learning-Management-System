"use client";

import { useState } from "react";

const Footer = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const links = [
    {
      title: "Company",
      items: ["About Us", "Careers", "Press", "Blog"],
    },
    {
      title: "Support",
      items: ["Contact Us", "Help Center", "Terms of Service", "Privacy Policy"],
    },
    {
      title: "Learning",
      items: ["Courses", "Teaching", "Certification", "Partners"],
    },
    {
      title: "More",
      items: ["Mobile App", "Affiliates", "Developers", "Investors"],
    },
  ];

  const languages = ["English", "Español", "Français", "Deutsch", "বাংলা"];

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-5 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {links.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-3">{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item} className="mb-2 hover:underline cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Language Selector & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-gray-700 text-white py-2 px-4 rounded-lg focus:outline-none"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 md:mt-0 text-center md:text-left">
            <p>© {new Date().getFullYear()} LMS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;