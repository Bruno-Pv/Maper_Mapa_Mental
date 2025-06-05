import React from "react";


function LanguageMenu({language, onSetLanguage}) {
    return (
        <div className="language-buttons">
            <h3>Escolha sua linguagem:</h3>
            <ul>
                {language.map((lang, index) => (
                    <li key={index}>
                        <button onClick={() => onSetLanguage(lang)}>
                            {lang}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LanguageMenu;