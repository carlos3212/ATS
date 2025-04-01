from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import fitz  # PyMuPDF
import os
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from textblob import Word

# Descargar recursos necesarios de NLTK
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)

# ✅ Permitir CORS para localhost y 127.0.0.1
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}}, supports_credentials=True)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Stopwords personalizadas (para eliminar términos irrelevantes)
custom_stopwords = set(stopwords.words("spanish"))
#custom_stopwords.update(["buscamos", "experiencia", "desarrollador", "empresa", "equipo", "trabajo"])
custom_stopwords.update([
    "liderazgo", "motivado", "creativo", "responsable", "organizado", "proactivo", 
    "especializado", "apasionado", "experimentado", "confiable", "flexible", 
    "adaptable", "iniciativa", "compromiso", "éxito", "visión", "estrategia", 
    "solucionador de problemas", "trabajo en equipo", "comunicación", "analítico", 
    "multitarea", "dedicado", "entusiasta", "innovador", "detallista", "compasivo", 
    "paciente", "tolerante", "resiliente", "empático", "honesto", "leal", "optimista", 
    "realista", "sociable", "flexible", "disciplinado", "persistente", "versátil", 
    "técnico", "analítico", "creativo", "lógico", "eficiente", "productivo", "organizado", 
    "orientado a resultados", "orientado al detalle", "orientado al cliente", 
    "responsable", "comprometido", "motivado", "dedicado", "apasionado", "entusiasta", 
    "innovador", "creativo", "liderazgo", "estrategia", "correo electrónico", "email", 
    "teléfono", "número de contacto", "dirección", "whatsapp", "redes sociales", "linkedin", 
    "skype", "slack", "instagram", "facebook", "twitter", "tiktok", "página web", 
    "web personal", "blog", "skype id", "telegram", "telegrama", "número fijo", 
    "móvil", "whatsapp business", "fax", "correo postal", "dirección de contacto", 
    "id de usuario", "identificación", "dirección de empresa", "perfil personal", 
    "enlace de contacto", "formulario de contacto", "nombre de usuario", 
    "número de identificación", "zona horaria", "buscamos", "experiencia", 
    "desarrollador", "empresa", "equipo", "trabajo", "seguro de salud", "seguro dental", 
    "seguro de vida", "seguro de visión", "plan 401(k)", "licencia por maternidad", 
    "licencia por paternidad", "trabajo remoto", "comidas en la oficina", 
    "reembolso por transporte", "reembolso por educación", "asistencia en planificación familiar", 
    "asistencia en cuidado familiar", "asistencia en salud mental", "alimentación", 
    "transporte", "seguro de vida", "seguro médico"
])


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text("text") for page in doc])
    return text

def normalize_text(text):
    """Normaliza el texto usando TextBlob (lematización y eliminación de stopwords)"""
    words = word_tokenize(text.lower())
    normalized_words = [
        Word(word).lemmatize()
        for word in words if word.isalpha() and word not in custom_stopwords
    ]
    return normalized_words

def extract_keywords(text, num_keywords=10):
    words = normalize_text(text)

    vectorizer = TfidfVectorizer(max_features=100)
    tfidf_matrix = vectorizer.fit_transform([" ".join(words)])
    feature_names = vectorizer.get_feature_names_out()
    scores = tfidf_matrix.toarray().flatten()
    sorted_indices = scores.argsort()[::-1]
    
    return [feature_names[idx] for idx in sorted_indices[:num_keywords]]

@app.route("/upload", methods=["POST"])
@cross_origin()
def upload_cv():
    if "file" not in request.files:
        return jsonify({"error": "No se envió un archivo"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Nombre de archivo vacío"}), 400

    if file and file.filename.endswith(".pdf"):
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)
        text = extract_text_from_pdf(file_path)
        return jsonify({"message": "Archivo procesado", "text": text})

    return jsonify({"error": "Formato de archivo no permitido"}), 400

@app.route("/compare", methods=["POST"])
@cross_origin()
def compare_cv():
    try:
        data = request.json
        cv_keywords = set(data.get("cvKeywords", []))
        job_text = data.get("jobDescription", "")

        if not cv_keywords or not job_text:
            return jsonify({"error": "Faltan datos"}), 400

        # ✅ Extraer palabras clave de la oferta usando lematización y stopwords personalizadas
        job_keywords = set(extract_keywords(job_text))
        common_keywords = cv_keywords.intersection(job_keywords)
        missing_keywords = job_keywords - cv_keywords

        # ✅ MÉTODO RECALL: Porcentaje de coincidencia basado solo en palabras clave de la oferta
        recall = round((len(common_keywords) / len(job_keywords)) * 100, 2) if job_keywords else 0

        return jsonify({
            "matchPercentage": recall,
            "missingKeywords": list(missing_keywords)
        })
    except Exception as e:
        print(f"Error en compare_cv: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
