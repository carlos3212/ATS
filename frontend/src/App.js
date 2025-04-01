import { useState } from "react";
import UploadCV from "./components/UploadCV";
import JobDescription from "./components/JobDescription";
import CompareCV from "./components/CompareCV";
import './App.css';



function App() {
  const [cvKeywords, setCvKeywords] = useState([]);
  const [jobDescription, setJobDescription] = useState("");

  return (
    <div className="app-container">
      
      {/* Contenedor para UploadCV */}
      <div className="upload-cv-container">
        <UploadCV onKeywordsExtracted={setCvKeywords} />
      </div>

      {/* Contenedor para JobDescription */}
      <div className="job-description-container">
        <JobDescription onJobSubmit={setJobDescription} />
      </div>

      {/* Contenedor para CompareCV */}
      <div className="compare-cv-container">
        <CompareCV cvKeywords={cvKeywords} jobDescription={jobDescription} />
      </div>

    </div>
  );
}

export default App;
