import { useEffect, useState } from "react";
import axios from "axios";

const CompareCV = ({ cvKeywords, jobDescription }) => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verifica que tanto los keywords como la descripción del trabajo sean válidos
    if (cvKeywords.length > 0 && jobDescription) {
      // Inicia el proceso de comparación
      setLoading(true);
      setError(null);

      axios
        .post("https://ats-3a5z.onrender.com/compare", { cvKeywords, jobDescription })
        .then((response) => {
          setComparison(response.data);
          setLoading(false); // Detiene el estado de carga
        })
        .catch((error) => {
          setError("Hubo un error al comparar el CV y la oferta.");
          setLoading(false);
          console.error("Error en la comparación:", error);
        });
    }
  }, [cvKeywords, jobDescription]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto border rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">Resultado de la Comparación</h2>

      {/* Muestra un mensaje de error si lo hay */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Muestra un mensaje de carga mientras se hace la comparación */}
      {loading ? (
        <p>Comparando...</p>
      ) : (
        <div>
          {/* Si hay un resultado de comparación, muestra los datos */}
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
      )}
    </div>
  );
};

export default CompareCV;
