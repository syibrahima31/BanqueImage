from app import db
from flask_bcrypt import bcrypt
from ..models import Utilisateur


def register_user(email, username, password):
    user_check = Utilisateur.query.filter_by(username=username, email=email)
    if user_check is None:
        user = Utilisateur(username=username, email=email, password=bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()))
        db.session.add(user)
        db.session.commit()
        return True
    else:
        return False