from flask import Blueprint, render_template, jsonify, request, flash, redirect
from .models import Utilisateur
from .utilities import register_user, credentials_match
from flask_login import login_user, logout_user, login_required, LoginManager

users = Blueprint("users", __name__)
login_manager = LoginManager()


@users.route("/")
@login_required
def index():
    return "Bienvenue dans le projet"

@users.route("/dashboard", methods=["GET"])
def dashboard():
    return render_template("dashboard.html")

@users.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        print(username, password)
        if credentials_match(username, password):
            user = Utilisateur.query.filter_by(username=username).first()
            login_user(user)
            flash("User logged in successfully", category="success")
            redirect("/dashboard")
        else:
            return jsonify({"message": "Authentication failed", "code_message": "400"})
        
    return render_template('login.html')

@users.route("/register", methods=['GET', 'POST'])
def register():
    return render_template('registration.html')

@users.route("/submit-registration", methods=['POST'])
def subscribe():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    is_registered = register_user(email, username, password)
    if is_registered:
        return jsonify({"message": "Registered successfully", "code_message": "200"})
    else:
        return jsonify({"message": "User already registered", "code_message": "400"})


@users.route("/logout", methods=["GET", "POST"])
def logout():
    pass