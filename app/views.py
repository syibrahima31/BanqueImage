from flask import Blueprint, render_template
from .models import Utilisateur

users = Blueprint("users", __name__)


@users.route("/")
def index():
    return "Bienvenue dans le projet"

@users.route("/login")
def login():
    return render_template('login.html')

@users.route("/register", methods=['GET', 'POST'])
def register():
    return render_template('registration.html')
