import { useEffect, useState } from "react";
import axios from "axios";

const CompareCV = ({ cvKeywords, jobDescription }) => {
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    console.log("cvKeywords:", cvKeywords);
    console.log("jobDescription:", jobDescription);
    if (cvKeywords.length > 0 && jobDescription) {
      axios
        .post("http://127.0.0.1:5000/compare", { cvKeywords, jobDescription })
        .then((response) => setComparison(response.data))
        .catch((error) => console.error("Error en la comparación:", error));
    }
  }, [cvKeywords, jobDescription]);

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Resultado de la Comparación</h2>
      {comparison ? (
        <div>
          <p><strong>Coincidencia:</strong> {comparison.matchPercentage}%</p>
          <h3 className="font-bold">Sugerencias de mejora:</h3>
          <ul>
            {comparison.missingKeywords.map((word, index) => (
              <li key={index} className="text-red-600">{word}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Sube un CV y una oferta para ver los resultados.</p>
      )}
    </div>
  );
};

export default CompareCV;
