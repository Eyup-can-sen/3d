# python-backend/app.py

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_mail import Mail

# IMPORTANT: This needs to be 'backend.auth' as you successfully ran it with this setting
from backend.auth import auth_bp

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() in ('true', '1', 't')
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')

# Flask-Mail initialization
mail = Mail(app) # <<< This must come BEFORE app.register_blueprint for extensions

app.register_blueprint(auth_bp, url_prefix='/api')

# Sanity check for mail (keep this for now!)
if not hasattr(app, 'extensions') or 'mail' not in app.extensions:
    print("CRITICAL WARNING: Flask-Mail extension NOT found in app.extensions!")
else:
    print("DEBUG: Flask-Mail extension found in app.extensions.")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)