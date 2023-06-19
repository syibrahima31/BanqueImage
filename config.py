from dotenv import load_dotenv
import os

load_dotenv()

# La classe config se base sur le fichier .env pour récupérer les valeurs des variables d'environnements
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
    LOGIN_REDIRECT_URL = '/dashboard'
