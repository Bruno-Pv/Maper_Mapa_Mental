import React, { useState } from "react";


function LanguageMenu({ language, onSetLanguage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLanguageSelect = (lang) => {
    onSetLanguage(lang);
    setMenuOpen(false);
  };

  return (
    <div className="language-dropdown">
      <button className="menu-button" onClick={toggleMenu}>
        ☰ Escolher Linguagem
      </button>

      {menuOpen && (
        <div className="dropdown-content">
          {language.map((lang, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleLanguageSelect(lang)}
            >
              {lang}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageMenu;
