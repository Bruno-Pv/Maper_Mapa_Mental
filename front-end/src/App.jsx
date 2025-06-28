import React, { useEffect, useState } from "react";
import LanguageMenu from "./components/LanguageMenu";
import MindMap from "./components/MindMap";
import './App.css';

function App() {
  const [msg, setMsg] = useState("");
  const [selectedLanguage, setLanguage] = useState(null);

  const language = ["Python", "Java", "JavaScript", "C", "C++", "Kotlin", "TypeScript", "PHP"];

  useEffect(() => {
    fetch("http://localhost:5000/api/ping")
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(err => setMsg("Erro na conexão com o backend"));
  }, []);

  return (
    <div className="page-layout">
      
      {/* Área do Menu */}
      <div className="language-menu">
        <LanguageMenu
          language={language}
          onSetLanguage={setLanguage}
        />
      </div>

      {/* Área do Mapa Mental */}
      <div className="map-area">
        <h1  className="titulo-principal crimson-text-regular">Mapear Mapa Mental</h1>
        {selectedLanguage && (
          <>
            <MindMap language={selectedLanguage} />
          </>
        )}
      </div>

    </div>
  );
}

export default App;
