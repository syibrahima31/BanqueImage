from app import db
from flask_bcrypt import bcrypt
from flask import jsonify
from ..models import Utilisateur
from flask_login import login_user


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
        login_user(user)
        return jsonify({'message': 'Logged in successfully', 'code_message': '200'})
    else:
        return jsonify({'message': 'Check again your credentials', 'code_message': '400'})
