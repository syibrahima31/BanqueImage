import json
import os
from database_instance import db
from flask_bcrypt import bcrypt
from flask import jsonify, session
from flask_login import login_user
from cryptography.fernet import Fernet
from models import Admin
from dotenv import load_dotenv


load_dotenv()


def register_user(email, username, password, model):
    user = model.query.filter_by(username=username, email=email).first()
    if user is None:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = model(username=username, email=email, password=hashed_password.decode('utf-8'))
        db.session.add(user)
        db.session.commit()
        return True
    else:
        return False
    

def credentials_match(username, password, model):
    user = model.query.filter_by(username=username).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return True
    return False


def process_request(username, password, model):
    if credentials_match(username, password, model):
        user = model.query.filter_by(username=username).first()
        if isinstance(user, Admin):
            f = Fernet(os.getenv('FERNET_KEY'))
            role = json.dumps({'is_admin': True})
            session['role'] = f.encrypt(role.encode('utf-8'))
        login_user(user)
        return jsonify({'message': 'Logged in successfully', 'code_message': '200'})
    else:
        return jsonify({'message': 'Check again your credentials', 'code_message': '400'})


def is_admin(role):
    f = Fernet(os.getenv('FERNET_KEY'))
    decrypted_role = f.decrypt(role)
    decoded_role = decrypted_role.decode('utf-8')
    role = json.loads(decoded_role)
    return role.get('is_admin')
