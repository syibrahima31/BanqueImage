from flask import Blueprint, render_template, jsonify, request, flash, redirect, url_for, session
import json
import os
from werkzeug.utils import secure_filename
from .utilities import register_user, credentials_match
from flask_login import login_user, logout_user, login_required, LoginManager
from .models import Utilisateur, Contributeur, Image

users = Blueprint("users", __name__)
contrib = Blueprint("contrib", __name__)
admin = Blueprint("admin", __name__)
login_manager = LoginManager()


@users.route("/")
@login_required
def index():
    return render_template('index.html')


@contrib.route("/upload", methods=["POST"])
def upload_image():
    if request.method == "POST":
        file = request.files.get('image')
        if file:
            filename = file.filename
            filename = secure_filename(filename)
            filepath = os.path.join('uploads', filename)
            file.save(filepath)

            nom = request.form.get("nom")
            email = request.form.get("email")

            Contributeur(username=nom, email=email)

            return "Image save"
        else:
            return "No file upload"


@admin.route("/admin/add/contributeur")
def add():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        email = request.form.get("email")

    return render_template("contributeur.html")


@users.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html")


@users.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        if credentials_match(username, password):
            user = Utilisateur.query.filter_by(username=username).first()
            login_user(user)
            return jsonify({'message': 'Logged in successfully', 'code_message': '200'})
        else:
            return jsonify({'message': 'User already registered', 'code_message': '400'})

    return render_template('login.html', next_page=json.dumps({"name": "users.dashboard"}))


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
        return jsonify({'message': 'Registered successfully', 'code_message': '200'})
    else:
        return jsonify({'message': 'User already registered', 'code_message': '400'})


@users.route("/logout", endpoint="logout")
def logout():
    logout_user()
    return redirect(url_for('users.login'))
