from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

class ChatbotAPI:
    def __init__(self):
        self.model = None
        self.load_model()
    
    def load_model(self):
        try:
            with open('orbitx_model.pkl', 'rb') as f:
                self.model = pickle.load(f)
            print("Model loaded successfully!")
        except FileNotFoundError:
            print("Model not found. Please train the model first.")
    
    def get_response(self, user_input):
        if not self.model:
            return "Model not loaded. Please train the model first."
        
        user_tfidf = self.model['vectorizer'].transform([user_input.lower()])
        similarities = cosine_similarity(user_tfidf, self.model['tfidf_matrix']).flatten()
        best_match_idx = np.argmax(similarities)
        
        if similarities[best_match_idx] > 0.1:
            return self.model['responses'][best_match_idx]
        return "🌌 OrbitX is a space science club at ZCOER, Pune. Mission: 'Exploring Beyond Horizons'. Contact: orbitx@zcoer.edu.in 🚀"

chatbot_api = ChatbotAPI()

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        response = chatbot_api.get_response(message)
        return jsonify({'response': response})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)