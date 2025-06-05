    import React, { useEffect, useState } from "react";
    import LanguageMenu from "./components/LanguageMenu";
    import MindMap from "./components/MindMap";
    import './App.css';

function App() {
  const [msg, setMsg] = useState("");
  const[selectedLanguage, setLanguage] = useState(null);

  const language = ["Python", "Java", "JavaScript", "C", "C++"];

  useEffect(() => {
    fetch("http://localhost:5000/api/ping")
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(err => setMsg("Erro na conexão com o backend"));
  }, []);

  return (
    <div className={`App ${selectedLanguage ? selectedLanguage.toLowerCase() : 'default'}`}>
      <h1>Projeto Mapear Mapa Mental</h1> 

      <LanguageMenu
      language={language}
      onSetLanguage={setLanguage}
      />

      {selectedLanguage && <h2>Voce escolheu: {selectedLanguage}</h2> }
      {selectedLanguage && <MindMap language={selectedLanguage} />}

    </div>
  );
}

export default App;
