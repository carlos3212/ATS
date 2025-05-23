import { useState } from "react";
import axios from "axios";

const UploadCV = ({ onKeywordsExtracted }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const extractKeywordsFromText = (text) => {
    // Implementación simplificada de la extracción de palabras clave
    const words = text
      .split(/\s+/)
      .map((word) => word.toLowerCase())
      .filter((word) => word.length > 3); // Filtrando palabras muy cortas
    return words.slice(0, 2000); // Limitar a las primeras 2000 palabras clave
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://ats-3a5z.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setText(response.data.text);

      // Extraer palabras clave del texto
      const keywords = extractKeywordsFromText(response.data.text);
      onKeywordsExtracted(keywords); // Pasar las palabras clave al componente principal
    } catch (error) {
      console.error("Error al subir el CV:", error);
      alert("Error al procesar el archivo.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto border rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">Subir CV en PDF</h2>
      
      {/* Input para cargar el archivo PDF */}
      <input 
        type="file" 
        accept="application/pdf" 
        onChange={handleFileChange} 
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />

      {/* Botón para procesar el archivo */}
      <button 
        onClick={handleUpload} 
        className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full shadow-md
                   hover:bg-indigo-500 hover:shadow-lg transition duration-300 w-full sm:w-auto"
      >
        Subir y Procesar
      </button>

      {/* Texto extraído */}
      {text && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <h3 className="font-bold">Texto extraído:</h3>
          <p className="text-sm">{text ? "Carga exitosa" : "Cargando..."}</p>
        </div>
      )}
    </div>
  );
};

export default UploadCV;
