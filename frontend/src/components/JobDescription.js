import { useState } from "react";

const JobDescription = ({ onJobSubmit }) => {
  const [jobText, setJobText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!jobText.trim()) {
      alert("Por favor, ingresa la descripción del puesto.");
      return;
    }
    console.log("Se está enviando la descripción del trabajo:", jobText);
    onJobSubmit(jobText);
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Ingresar Oferta Laboral</h2>
      <textarea
        className="w-full p-2 border rounded"
        rows="5"
        placeholder="Ingresa la descripción del puesto..."
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
      ></textarea>
      <button
        onClick={handleSubmit}
        className="bg-violet-600 text-white font-semibold py-3 px-6 rounded-full shadow-md
                   hover:bg-violet-500 hover:shadow-lg transition duration-300"
      >
        Enviar
      </button>
    </div>
  );
};

export default JobDescription;
