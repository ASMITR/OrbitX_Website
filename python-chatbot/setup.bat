@echo off
echo Setting up OrbitX Python Chatbot...

echo Installing Python dependencies...
pip install -r requirements.txt

echo Training the chatbot model...
python train_model.py

echo Setup complete! 
echo To start the chatbot API, run: python chatbot_api.py
pause