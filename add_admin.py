from dotenv import load_dotenv
import os
from app import db
from utilities import register_user
from . import models
from run import app

# Permet de charger les variables d'environnement provenant du fichier .env dans le script actuel
load_dotenv()

# Ceci est un script qui permettra de créer un utilisateur automatiquement en se basant sur les informations
# fournies dans le fichier .env

username = os.getenv('ADMIN_USERNAME')
password = os.getenv('ADMIN_PASSWORD')
email = os.getenv('ADMIN_EMAIL')

with app.app_context():
    register_user(email, username, password, models.Admin)
    db.session.close()
