from app import db
from flask_bcrypt import bcrypt
from ..models import Utilisateur


def register_user(email, username, password):
    user = Utilisateur.query.filter_by(username=username, email=email).first()
    if user is None:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = Utilisateur(username=username, email=email, password=hashed_password.decode('utf-8'))
        db.session.add(user)
        db.session.commit()
        return True
    else:
        return False
    

def credentials_match(username, password):
    user = Utilisateur.query.filter_by(username=username).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return True
    return False