from flask import Blueprint
from .models import Utilisateur

users = Blueprint("users", __name__)


@users.route("/")
def index():
    return "Bienvenue dans le projet"
