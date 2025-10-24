import json
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class OrbitXChatbot:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', lowercase=True)
        self.responses = []
        self.questions = []
        
    def load_training_data(self):
        training_data = [
            {"question": "hello hi hey greeting", "response": "🚀 Hello! I'm OrbitX AI Assistant. I can help you learn about our space science & astronomy club. What would you like to know?"},
            {"question": "what is orbitx about mission", "response": "🌌 OrbitX is a space science & astronomy club at ZCOER, Pune. Our mission is 'Exploring Beyond Horizons'. We focus on space technology and innovation."},
            {"question": "teams departments groups", "response": "👥 OrbitX has 6 teams: Design & Innovation, Technical, Management & Operations, Public Outreach, Documentation, and Social Media & Editing."},
            {"question": "how to join become member", "response": "🎯 To join OrbitX: Contact orbitx@zcoer.edu.in, attend our events, choose a team. No experience required - just passion for space!"},
            {"question": "contact email address location", "response": "📧 Contact: orbitx@zcoer.edu.in | Location: ZCOER, Pune, Maharashtra"},
            {"question": "projects activities events", "response": "🛰️ We work on space technology research, rocket design, satellite projects, astronomy observations, and educational workshops."},
            {"question": "space astronomy rocket satellite", "response": "🌟 We explore rocket propulsion, satellite technology, planetary science, astrophysics, and space missions."},
        ]
        
        for item in training_data:
            self.questions.append(item["question"])
            self.responses.append(item["response"])
    
    def train(self):
        self.load_training_data()
        self.tfidf_matrix = self.vectorizer.fit_transform(self.questions)
    
    def get_response(self, user_input):
        user_tfidf = self.vectorizer.transform([user_input.lower()])
        similarities = cosine_similarity(user_tfidf, self.tfidf_matrix).flatten()
        best_match_idx = np.argmax(similarities)
        
        if similarities[best_match_idx] > 0.1:
            return self.responses[best_match_idx]
        return "🌌 OrbitX is a space science club at ZCOER, Pune. Mission: 'Exploring Beyond Horizons'. Contact: orbitx@zcoer.edu.in 🚀"
    
    def save_model(self):
        model_data = {
            'vectorizer': self.vectorizer,
            'tfidf_matrix': self.tfidf_matrix,
            'responses': self.responses
        }
        with open('orbitx_model.pkl', 'wb') as f:
            pickle.dump(model_data, f)

if __name__ == "__main__":
    chatbot = OrbitXChatbot()
    chatbot.train()
    chatbot.save_model()
    print("Model trained and saved!")